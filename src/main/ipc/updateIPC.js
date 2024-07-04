const { ipcMain } = require("electron");
const fetch = require("node-fetch");
const { getMods, updateMod } = require("../../database/modsDB");
const { getSetting, saveSetting } = require("../../database/settingsDB");
const { getModWebhooks } = require("../../database/modWebhooksDB");
const { getWebhooks } = require("../../database/webhooksDB");

let isPaused = false;
let remainingTime = 0;
let countdownInterval;

function setupUpdateIPC(mainWindow) {
	ipcMain.on("check-updates", (event) => {
		checkForUpdates(mainWindow);
	});

	ipcMain.on("pause-timer", () => {
		isPaused = true;
		clearInterval(countdownInterval);
	});

	ipcMain.on("resume-timer", () => {
		isPaused = false;
		startCountdown(remainingTime, mainWindow);
	});

	initializeSettings(mainWindow);
}

async function checkForUpdates(mainWindow) {
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
					headers: { "x-api-key": apiKey },
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
					mod.mod_id
				);
			} else {
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

async function sendDiscordNotifications(
	modName,
	newReleased,
	oldReleased,
	modId
) {
	try {
		const webhookIds = await getModWebhooks(modId);
		const webhooks = await getWebhooks();

		for (const webhookId of webhookIds) {
			const webhook = webhooks.find((w) => w.id === webhookId);
			if (webhook) {
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
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(message),
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				console.log(
					`Notification sent for ${modName} to webhook ${webhook.url}`
				);
			}
		}
	} catch (error) {
		console.error(`Error sending Discord notifications:`, error);
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

function startCountdown(duration, mainWindow) {
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
			checkForUpdates(mainWindow);
			startCountdown(duration, mainWindow);
		}

		remainingTime = timer;
	}, 1000);
}

async function initializeSettings(mainWindow) {
	let interval = await getSetting("update_interval");
	if (!interval) {
		interval = 3600; // Default to 1 hour
		await saveSetting("update_interval", interval);
	}
	startCountdown(interval, mainWindow);
}

module.exports = { setupUpdateIPC, startCountdown };
