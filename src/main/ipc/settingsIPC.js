const { ipcMain } = require("electron");
const { saveSetting, getSetting } = require("../../database/settingsDB");
const { startCountdown } = require("./updateIPC");

function setupSettingsIPC(mainWindow) {
	ipcMain.handle("save-interval", (event, interval) => {
		try {
			saveSetting("update_interval", interval.toString());
			startCountdown(parseInt(interval), mainWindow);
			return { success: true };
		} catch (error) {
			console.error("Error saving interval:", error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle("get-interval", (event) => {
		try {
			const interval = getSetting("update_interval");
			return { success: true, interval: parseInt(interval) || 3600 };
		} catch (error) {
			console.error("Error getting interval:", error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle("save-api-key", (event, apiKey) => {
		try {
			saveSetting("curseforge_api_key", apiKey);
			return { success: true };
		} catch (error) {
			console.error("Error saving API key:", error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle("get-api-key", (event) => {
		try {
			const apiKey = getSetting("curseforge_api_key");
			return { success: true, apiKey };
		} catch (error) {
			console.error("Error getting API key:", error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle("save-open-link-preference", (event, preference) => {
		try {
			saveSetting("open_link_preference", preference);
			console.log(`Open mod links preference changed to: ${preference}`);
			return { success: true };
		} catch (error) {
			console.error("Error saving open link preference:", error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle("get-open-link-preference", (event) => {
		try {
			const preference = getSetting("open_link_preference");
			return { success: true, preference: preference || "inApp" };
		} catch (error) {
			console.error("Error getting open link preference:", error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle("save-webhook-layout", async (event, layout) => {
		try {
			saveSetting("webhook_layout", JSON.stringify(layout));
			console.log("Webhook layout updated");
			return { success: true };
		} catch (error) {
			console.error("Error saving webhook layout:", error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle("get-webhook-layout", async (event) => {
		try {
			const layoutString = getSetting("webhook_layout");
			const layout = layoutString ? JSON.parse(layoutString) : null;
			return { success: true, layout };
		} catch (error) {
			console.error("Error getting webhook layout:", error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle("save-tooltip-preference", async (event, isEnabled) => {
		try {
			saveSetting("tooltip_enabled", isEnabled.toString());
			return { success: true };
		} catch (error) {
			console.error("Error saving tooltip preference:", error);
			return { success: false, error: error.message };
		}
	});

	ipcMain.handle("get-tooltip-preference", async (event) => {
		try {
			const tooltipEnabled = getSetting("tooltip_enabled");
			return { success: true, isEnabled: tooltipEnabled === "true" };
		} catch (error) {
			console.error("Error getting tooltip preference:", error);
			return { success: false, error: error.message };
		}
	});
}

module.exports = setupSettingsIPC;
