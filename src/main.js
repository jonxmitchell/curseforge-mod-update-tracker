const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fetch = require("node-fetch");
const {
	initDatabase,
	saveSetting,
	getSetting,
	getMods,
	getWebhooks,
	addMod,
	updateMod,
	deleteMod,
	addWebhook,
	deleteWebhook,
	assignWebhook,
} = require("./database");

let mainWindow;
let countdownInterval;
let isPaused = false;
let remainingTime = 0;

const DEFAULT_INTERVAL = 3600; // Default to 1 hour

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	mainWindow.loadFile(path.join(__dirname, "index.html"));
}

async function checkForUpdates() {
	const apiKey = await getSetting("curseforge_api_key");
	if (!apiKey) {
		console.error("CurseForge API key not set");
		return;
	}

	let updatesFound = false;
	const checkTime = new Date().toISOString();

	try {
		const mods = await getMods();
		for (const mod of mods) {
			const response = await fetch(
				`https://api.curseforge.com/v1/mods/${mod.mod_id}`,
				{
					headers: {
						"x-api-key": apiKey,
					},
				}
			);
			const data = await response.json();
			const latestReleased = data.data.dateReleased || "N/A";
			const lastUpdated = data.data.dateModified || new Date().toISOString();

			if (latestReleased !== mod.current_released) {
				updatesFound = true;
				await updateMod(
					mod.mod_id,
					latestReleased,
					latestReleased,
					lastUpdated
				);
				mainWindow.webContents.send("mod-updated", {
					id: mod.mod_id,
					name: mod.name,
					newReleased: latestReleased,
					oldReleased: mod.current_released,
				});
				await sendDiscordNotifications(
					mod.name,
					latestReleased,
					mod.current_released,
					mod.webhook_id
				);
			} else {
				// Only update last_checked_released
				await updateMod(
					mod.mod_id,
					mod.current_released,
					latestReleased,
					mod.last_updated
				);
			}
		}

		mainWindow.webContents.send("update-check-complete", { updatesFound });
	} catch (error) {
		console.error("Error checking for updates:", error);
	}
}

function formatDate(dateString) {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	}).format(date);
}

async function sendDiscordNotifications(
	modName,
	newReleased,
	oldReleased,
	webhookId
) {
	if (!webhookId) {
		console.log(`No webhook assigned for mod ${modName}`);
		return;
	}

	try {
		const webhooks = await getWebhooks();
		const webhook = webhooks.find((w) => w.id === webhookId);

		if (!webhook) {
			console.error(`No webhook found with id ${webhookId}`);
			return;
		}

		const message = {
			content: `Mod Update Alert!`,
			embeds: [
				{
					title: `${modName} has been updated!`,
					description: `New release date: ${formatDate(
						newReleased
					)}\nPrevious release date: ${formatDate(oldReleased)}`,
					color: 5814783,
					timestamp: new Date().toISOString(),
				},
			],
		};

		const response = await fetch(webhook.url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(message),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		console.log(`Notification sent for ${modName} to webhook ${webhook.url}`);
	} catch (error) {
		console.error(`Error sending Discord notification:`, error);
	}
}

function startCountdown(duration) {
	clearInterval(countdownInterval);
	let timer = duration;
	remainingTime = duration;

	countdownInterval = setInterval(() => {
		if (isPaused) return;

		const hours = Math.floor(timer / 3600);
		const minutes = Math.floor((timer % 3600) / 60);
		const seconds = timer % 60;

		mainWindow.webContents.send("countdown-tick", {
			hours: hours.toString().padStart(2, "0"),
			minutes: minutes.toString().padStart(2, "0"),
			seconds: seconds.toString().padStart(2, "0"),
		});

		if (--timer < 0) {
			clearInterval(countdownInterval);
			checkForUpdates();
			startCountdown(duration); // Restart countdown with the same interval
		}

		remainingTime = timer;
	}, 1000);
}

function pauseCountdown() {
	isPaused = true;
	clearInterval(countdownInterval);
}

function resumeCountdown() {
	isPaused = false;
	startCountdown(remainingTime);
}

async function initializeSettings() {
	let interval = await getSetting("update_interval");
	if (!interval) {
		interval = DEFAULT_INTERVAL;
		await saveSetting("update_interval", interval);
	}
	startCountdown(interval);
}

app.whenReady().then(() => {
	createWindow();
	initDatabase();
	initializeSettings();
	// Initialize the pause/resume button state
	mainWindow.webContents.on("did-finish-load", () => {
		mainWindow.webContents.send("initialize-pause-resume-button");
	});
});

ipcMain.on("add-mod", async (event, modId) => {
	try {
		const apiKey = await getSetting("curseforge_api_key");
		if (!apiKey) {
			throw new Error("CurseForge API key not set");
		}

		const mods = await getMods();
		if (mods.find((m) => m.mod_id === modId)) {
			throw new Error("Mod already exists");
		}

		const response = await fetch(
			`https://api.curseforge.com/v1/mods/${modId}`,
			{
				headers: {
					"x-api-key": apiKey,
				},
			}
		);
		const data = await response.json();

		if (!data.data) {
			throw new Error(
				`Invalid API response structure: ${JSON.stringify(data)}`
			);
		}

		const latestReleased = data.data.dateReleased || "N/A";
		const gameId = data.data.gameId;
		const websiteUrl =
			data.data.links?.websiteUrl || "https://www.curseforge.com";

		// Fetch the game details using the gameId
		const gameResponse = await fetch(
			`https://api.curseforge.com/v1/games/${gameId}`,
			{
				headers: {
					"x-api-key": apiKey,
				},
			}
		);
		const gameData = await gameResponse.json();

		if (!gameData.data) {
			throw new Error(
				`Invalid game API response structure: ${JSON.stringify(gameData)}`
			);
		}

		const game = gameData.data.name || "Unknown";
		const lastUpdated = data.data.dateModified || new Date().toISOString();

		await addMod(
			modId,
			data.data.name,
			game,
			data.data.summary,
			data.data.authors[0].name,
			data.data.downloadCount,
			websiteUrl,
			latestReleased,
			latestReleased,
			lastUpdated
		);
		event.reply("add-mod-result", { success: true, mod: data.data });
	} catch (error) {
		console.error(`Error adding mod ${modId}:`, error);
		event.reply("add-mod-result", { success: false, error: error.message });
	}
});

ipcMain.on("check-updates", (event) => {
	checkForUpdates();
});

ipcMain.on("get-mods", async (event) => {
	try {
		const mods = await getMods();
		event.reply("get-mods-result", { success: true, mods });
	} catch (error) {
		console.error("Error fetching mods:", error);
		event.reply("get-mods-result", { success: false, error: error.message });
	}
});

ipcMain.on("delete-mod", async (event, modId) => {
	try {
		await deleteMod(modId);
		event.reply("delete-mod-result", { success: true, modId });
	} catch (error) {
		console.error("Error deleting mod:", error);
		event.reply("delete-mod-result", { success: false, error: error.message });
	}
});

ipcMain.on("add-webhook", async (event, { name, url }) => {
	try {
		const webhooks = await getWebhooks();
		if (webhooks.find((w) => w.name === name || w.url === url)) {
			throw new Error("Webhook name or URL already exists");
		}

		await addWebhook(name, url);
		event.reply("add-webhook-result", { success: true });
	} catch (error) {
		console.error("Error adding webhook:", error);
		event.reply("add-webhook-result", { success: false, error: error.message });
	}
});

ipcMain.on("get-webhooks", async (event) => {
	try {
		const webhooks = await getWebhooks();
		event.reply("get-webhooks-result", { success: true, webhooks });
	} catch (error) {
		console.error("Error fetching webhooks:", error);
		event.reply("get-webhooks-result", {
			success: false,
			error: error.message,
		});
	}
});

ipcMain.on("delete-webhook", async (event, id) => {
	try {
		await deleteWebhook(id);
		event.reply("delete-webhook-result", { success: true, id });
	} catch (error) {
		console.error("Error deleting webhook:", error);
		event.reply("delete-webhook-result", {
			success: false,
			error: error.message,
		});
	}
});

ipcMain.on("assign-webhook", async (event, { modId, webhookId }) => {
	try {
		await assignWebhook(modId, webhookId);
		event.reply("assign-webhook-result", { success: true });
	} catch (error) {
		console.error("Error assigning webhook:", error);
		event.reply("assign-webhook-result", {
			success: false,
			error: error.message,
		});
	}
});

ipcMain.handle("save-interval", async (event, interval) => {
	try {
		await saveSetting("update_interval", interval);
		startCountdown(interval); // Reset countdown with the new interval
		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
});

ipcMain.handle("get-interval", async (event) => {
	try {
		const interval = await getSetting("update_interval");
		return { success: true, interval };
	} catch (error) {
		return { success: false, error: error.message };
	}
});

ipcMain.on("test-webhook", async (event, webhookId) => {
	try {
		const webhooks = await getWebhooks();
		const webhook = webhooks.find((w) => w.id === webhookId);
		if (!webhook) {
			throw new Error("Webhook not found");
		}

		const message = {
			content:
				"This is a test message from the Mod Update Tracker application.",
			embeds: [
				{
					title: "Webhook Test",
					description:
						"If you can see this message, your webhook is working correctly.",
					color: 5814783,
					timestamp: new Date().toISOString(),
				},
			],
		};

		const response = await fetch(webhook.url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(message),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		event.reply("test-webhook-result", { success: true });
	} catch (error) {
		console.error("Error testing webhook:", error);
		event.reply("test-webhook-result", {
			success: false,
			error: error.message,
		});
	}
});

ipcMain.handle("save-api-key", async (event, apiKey) => {
	try {
		await saveSetting("curseforge_api_key", apiKey);
		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
});

ipcMain.handle("get-api-key", async (event) => {
	try {
		const apiKey = await getSetting("curseforge_api_key");
		return { success: true, apiKey };
	} catch (error) {
		return { success: false, error: error.message };
	}
});

ipcMain.on("pause-timer", () => {
	pauseCountdown();
});

ipcMain.on("resume-timer", () => {
	resumeCountdown();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
