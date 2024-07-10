const { ipcMain } = require("electron");
const {
	saveSetting,
	getSetting,
	saveWebhookLayout,
	getWebhookLayout,
} = require("../../database/settingsDB");
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

	ipcMain.handle("save-webhook-layout", async (event, layout) => {
		try {
			await saveWebhookLayout(layout);
			return { success: true };
		} catch (error) {
			console.error("Error saving webhook layout:", error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle("get-webhook-layout", async (event) => {
		try {
			const layout = await getWebhookLayout();
			return { success: true, layout };
		} catch (error) {
			console.error("Error getting webhook layout:", error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle("save-tooltip-preference", async (event, isEnabled) => {
		try {
			await saveSetting("tooltip_enabled", isEnabled.toString());
			return { success: true };
		} catch (error) {
			console.error("Error saving tooltip preference:", error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle("get-tooltip-preference", async (event) => {
		try {
			const tooltipEnabled = await getSetting("tooltip_enabled");
			return { success: true, isEnabled: tooltipEnabled === "true" };
		} catch (error) {
			console.error("Error getting tooltip preference:", error);
			return { success: false, error: error.message };
		}
	});
}

module.exports = setupSettingsIPC;
