const { ipcMain } = require("electron");
const fetch = require("node-fetch");
const { getMods, updateMod } = require("../../database/modsDB");
const { getSetting, getWebhookLayout } = require("../../database/settingsDB");
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
					mod.mod_id,
					data.data
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
	modId,
	modData
) {
	try {
		const webhookIds = await getModWebhooks(modId);
		const webhooks = await getWebhooks();
		const layout = await getWebhookLayout();

		for (const webhookId of webhookIds) {
			const webhook = webhooks.find((w) => w.id === webhookId);
			if (webhook) {
				const message = await createWebhookMessage(
					layout,
					modName,
					newReleased,
					oldReleased,
					modId,
					modData
				);

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

async function createWebhookMessage(
	layout,
	modName,
	newReleased,
	oldReleased,
	modId,
	modData
) {
	const latestModFileName = getLatestModFileName(modData);
	const modAuthorName = getModAuthorName(modData);
	const webhookText = replaceVariables(
		layout.webhookText,
		modName,
		newReleased,
		oldReleased,
		modId,
		modData,
		latestModFileName,
		modAuthorName
	);

	const message = {
		content: webhookText,
	};

	if (layout.useEmbed) {
		const embedTitle = replaceVariables(
			layout.embedTitle,
			modName,
			newReleased,
			oldReleased,
			modId,
			modData,
			latestModFileName,
			modAuthorName
		);
		const embedText = replaceVariables(
			layout.embedText,
			modName,
			newReleased,
			oldReleased,
			modId,
			modData,
			latestModFileName,
			modAuthorName
		);

		message.embeds = [
			{
				title: embedTitle,
				description: embedText,
				color: parseInt(layout.embedColor.replace("#", ""), 16),
			},
		];

		if (layout.authorName) {
			message.embeds[0].author = {
				name: replaceVariables(
					layout.authorName,
					modName,
					newReleased,
					oldReleased,
					modId,
					modData,
					latestModFileName,
					modAuthorName
				),
			};
			if (layout.authorIcon) {
				message.embeds[0].author.icon_url = layout.authorIcon;
			}
		}

		if (layout.footerText) {
			message.embeds[0].footer = {
				text: replaceVariables(
					layout.footerText,
					modName,
					newReleased,
					oldReleased,
					modId,
					modData,
					latestModFileName,
					modAuthorName
				),
			};
			if (layout.footerIcon) {
				message.embeds[0].footer.icon_url = layout.footerIcon;
			}
		}

		if (layout.showDate) {
			message.embeds[0].timestamp = new Date().toISOString();
		}

		if (layout.showImage && modData.logo) {
			message.embeds[0].thumbnail = { url: modData.logo.url };
		}
	}

	return message;
}

function replaceVariables(
	text,
	modName,
	newReleased,
	oldReleased,
	modId,
	modData,
	latestModFileName,
	modAuthorName
) {
	return text
		.replace(/{modID}/g, modId)
		.replace(/{newReleaseDate}/g, formatDate(newReleased))
		.replace(/{oldPreviousDate}/g, formatDate(oldReleased))
		.replace(/{modName}/g, modName)
		.replace(/{everyone}/g, "@everyone")
		.replace(/{here}/g, "@here")
		.replace(/{&(\w+)}/g, (match, role) => `<@&${role}>`)
		.replace(/{#(\w+)}/g, (match, channel) => `<#${channel}>`)
		.replace(/{lastestModFileName}/g, latestModFileName)
		.replace(/{modAuthorName}/g, modAuthorName);
}

function getLatestModFileName(modData) {
	if (modData.latestFiles && modData.latestFiles.length > 0) {
		return modData.latestFiles[0].fileName || "Unknown";
	}
	return "Unknown";
}

function getModAuthorName(modData) {
	if (modData.authors && modData.authors.length > 0) {
		return modData.authors[0].name || "Unknown";
	}
	return "Unknown";
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
