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

function initializeSettings() {
	const intervalSlider = document.getElementById("intervalSlider");
	const intervalInput = document.getElementById("intervalInput");
	const setIntervalButton = document.getElementById("setIntervalButton");
	const apiKeyInput = document.getElementById("apiKeyInput");
	const toggleApiKeyVisibilityButton = document.getElementById(
		"toggleApiKeyVisibility"
	);
	const saveApiKeyButton = document.getElementById("saveApiKeyButton");

	intervalSlider.addEventListener("input", (e) => {
		intervalInput.value = e.target.value;
	});

	intervalInput.addEventListener("input", (e) => {
		const value = parseInt(e.target.value);
		if (!isNaN(value) && value >= 1 && value <= 3600) {
			intervalSlider.value = value;
		}
	});

	setIntervalButton.addEventListener("click", async () => {
		const interval = parseInt(intervalInput.value);
		if (!isNaN(interval) && interval >= 1) {
			await saveInterval(interval);
		} else {
			showToast("Please enter a valid interval (1-3600 seconds)", "error");
		}
	});

	toggleApiKeyVisibilityButton.addEventListener("click", () => {
		if (apiKeyInput.type === "password") {
			apiKeyInput.type = "text";
			toggleApiKeyVisibilityButton.innerHTML =
				'<i class="fas fa-eye-slash"></i>';
		} else {
			apiKeyInput.type = "password";
			toggleApiKeyVisibilityButton.innerHTML = '<i class="fas fa-eye"></i>';
		}
	});

	saveApiKeyButton.addEventListener("click", async () => {
		const apiKey = apiKeyInput.value.trim();
		if (apiKey) {
			await saveApiKey(apiKey);
		} else {
			showToast("Please enter an API key", "error");
		}
	});
}

module.exports = {
	loadSavedInterval,
	loadApiKey,
	saveInterval,
	saveApiKey,
	initializeSettings,
};
