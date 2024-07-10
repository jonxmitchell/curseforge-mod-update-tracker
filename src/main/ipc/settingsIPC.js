const { ipcMain } = require("electron");
const { saveSetting, getSetting } = require("../../database/settingsDB");
const { startCountdown } = require("./updateIPC");

function setupSettingsIPC(mainWindow) {
	ipcMain.handle("save-interval", async (event, interval) => {
		try {
			await saveSetting("update_interval", interval);
			startCountdown(interval, mainWindow);
			return { success: true };
		} catch (error) {
			console.error("Error saving interval:", error);
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

	ipcMain.handle("save-open-link-preference", async (event, preference) => {
		try {
			await saveSetting("open_link_preference", preference);
			return { success: true };
		} catch (error) {
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle("get-open-link-preference", async (event) => {
		try {
			const preference = await getSetting("open_link_preference");
			return { success: true, preference: preference || "inApp" };
		} catch (error) {
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle("save-tooltip-preference", async (event, preference) => {
		try {
			await saveSetting("tooltip_enabled", preference.toString());
			return { success: true };
		} catch (error) {
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle("get-tooltip-preference", async (event) => {
		try {
			const preference = await getSetting("tooltip_enabled");
			return { success: true, preference: preference === "true" };
		} catch (error) {
			return { success: false, error: error.message };
		}
	});
}

module.exports = setupSettingsIPC;
