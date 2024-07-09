const { ipcRenderer } = require("electron");

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
		if (!result.success) {
			throw new Error(result.error);
		}
	} catch (error) {
		console.error("Failed to save interval:", error);
		throw error;
	}
}

async function saveApiKey(apiKey) {
	try {
		const result = await ipcRenderer.invoke("save-api-key", apiKey);
		if (!result.success) {
			throw new Error(result.error);
		}
	} catch (error) {
		console.error("Failed to save API key:", error);
		throw error;
	}
}

async function loadOpenLinkPreference() {
	try {
		const result = await ipcRenderer.invoke("get-open-link-preference");
		if (result.success) {
			const radioButtons = document.querySelectorAll(
				'input[name="openLinkPreference"]'
			);
			radioButtons.forEach((radio) => {
				if (radio.value === result.preference) {
					radio.checked = true;
				}
			});
		} else {
			console.error("Failed to load open link preference:", result.error);
		}
	} catch (error) {
		console.error("Error loading open link preference:", error);
	}
}

async function saveOpenLinkPreference(preference) {
	try {
		const result = await ipcRenderer.invoke(
			"save-open-link-preference",
			preference
		);
		if (!result.success) {
			throw new Error(result.error);
		}
	} catch (error) {
		console.error("Failed to save open link preference:", error);
		throw error;
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

	const openLinkPreferenceRadios = document.querySelectorAll(
		'input[name="openLinkPreference"]'
	);
	openLinkPreferenceRadios.forEach((radio) => {
		radio.addEventListener("change", (e) => {
			saveOpenLinkPreference(e.target.value);
		});
	});

	loadOpenLinkPreference();
}

module.exports = {
	loadSavedInterval,
	loadApiKey,
	saveInterval,
	saveApiKey,
	initializeSettings,
	loadOpenLinkPreference,
	saveOpenLinkPreference,
};
