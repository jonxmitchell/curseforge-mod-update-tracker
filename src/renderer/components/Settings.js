const { ipcRenderer } = require("electron");
const { showToast } = require("../utils/toast");

async function loadSavedInterval() {
	try {
		const result = await ipcRenderer.invoke("get-interval");
		if (result.success) {
			return result.interval;
		} else {
			console.error("Failed to load saved interval:", result.error);
			return null;
		}
	} catch (error) {
		console.error("Error loading saved interval:", error);
		return null;
	}
}

async function loadApiKey() {
	try {
		const result = await ipcRenderer.invoke("get-api-key");
		if (result.success) {
			const apiKeyInput = document.getElementById("apiKeyInput");
			apiKeyInput.value = result.apiKey;
		} else {
			console.error("Failed to load API key:", result.error);
		}
	} catch (error) {
		console.error("Error loading API key:", error);
	}
}

async function saveInterval(interval) {
	try {
		const result = await ipcRenderer.invoke("save-interval", interval);
		if (result.success) {
			showToast("Update interval set successfully", "success");
		} else {
			showToast("Failed to save interval", "error");
		}
	} catch (error) {
		console.error("Failed to save interval:", error);
		showToast("Failed to save interval", "error");
	}
}

async function saveApiKey(apiKey) {
	try {
		const result = await ipcRenderer.invoke("save-api-key", apiKey);
		if (result.success) {
			showToast("API key saved successfully", "success");
		} else {
			showToast(`Failed to save API key: ${result.error}`, "error");
		}
	} catch (error) {
		console.error("Failed to save API key:", error);
		showToast("Failed to save API key", "error");
	}
}

module.exports = {
	loadSavedInterval,
	loadApiKey,
	saveInterval,
	saveApiKey,
};
