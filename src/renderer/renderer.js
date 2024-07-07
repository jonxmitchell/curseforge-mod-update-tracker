const { ipcRenderer } = require("electron");
const { showToast } = require("./utils/toast");
const { updateModCount, updateConsoleOutput } = require("./utils/domUtils");
const {
	renderModList,
	initializeWebhookSelects,
	updateWebhookDropdowns,
} = require("./components/ModList");
const {
	renderWebhookList,
	updateWebhookList,
	addWebhook,
} = require("./components/WebhookList");
const {
	loadSavedInterval,
	loadApiKey,
	saveInterval,
	saveApiKey,
	initializeSettings,
} = require("./components/Settings");
const { DEFAULT_INTERVAL } = require("../shared/constants");

let isPaused = false;
let currentInterval = DEFAULT_INTERVAL;
let consoleLines = [];
let allMods = [];

document.addEventListener("DOMContentLoaded", initializeApp);

async function initializeApp() {
	await setupEventListeners();
	currentInterval = (await loadSavedInterval()) || DEFAULT_INTERVAL;
	await loadApiKey();
	await updateModList();
	await updateWebhookList();
	initializeSettings();
	updateIntervalDisplay();
	console.log("Application initialized");
}

async function setupEventListeners() {
	document.getElementById("addModButton").addEventListener("click", addMod);
	document
		.getElementById("checkUpdatesButton")
		.addEventListener("click", checkForUpdates);
	document
		.getElementById("addWebhookButton")
		.addEventListener("click", handleAddWebhook);
	document
		.getElementById("filterModInput")
		.addEventListener("input", filterMods);
	document
		.getElementById("clearConsoleButton")
		.addEventListener("click", clearConsole);
	document
		.getElementById("toggleApiKeyVisibility")
		.addEventListener("click", toggleApiKeyVisibility, true);
	document
		.getElementById("saveApiKeyButton")
		.addEventListener("click", handleSaveApiKey);
	document
		.getElementById("setIntervalButton")
		.addEventListener("click", handleSetInterval);
	document
		.getElementById("intervalSlider")
		.addEventListener("input", handleIntervalSliderChange);
	document
		.getElementById("intervalInput")
		.addEventListener("input", handleIntervalInputChange);
	document
		.getElementById("pauseResumeButton")
		.addEventListener("click", handlePauseResume);

	setupIpcListeners();
}

function setupIpcListeners() {
	ipcRenderer.on("mod-updated", handleModUpdated);
	ipcRenderer.on("update-check-complete", handleUpdateCheckComplete);
	ipcRenderer.on("add-mod-result", handleAddModResult);
	ipcRenderer.on("add-webhook-result", handleAddWebhookResult);
	ipcRenderer.on("get-webhooks-result", handleGetWebhooksResult);
	ipcRenderer.on("delete-mod-result", handleDeleteModResult);
	ipcRenderer.on("delete-webhook-result", handleDeleteWebhookResult);
	ipcRenderer.on("test-webhook-result", handleTestWebhookResult);
	ipcRenderer.on("countdown-tick", updateCountdown);
}

function handlePauseResume() {
	isPaused = !isPaused;
	const button = document.getElementById("pauseResumeButton");
	if (isPaused) {
		ipcRenderer.send("pause-timer");
		button.textContent = "Resume";
	} else {
		ipcRenderer.send("resume-timer");
		button.textContent = "Pause";
	}
}

function addMod() {
	const modIdInput = document.getElementById("modSearchInput");
	const modId = modIdInput.value.trim();
	if (modId) {
		ipcRenderer.send("add-mod", modId);
		modIdInput.value = "";
	} else {
		showToast("Please enter a mod ID", "error");
	}
}

function checkForUpdates() {
	ipcRenderer.send("check-updates");
}

async function handleAddWebhook() {
	const nameInput = document.getElementById("webhookNameInput");
	const urlInput = document.getElementById("webhookInput");
	const name = nameInput.value.trim();
	const url = urlInput.value.trim();

	if (name && url) {
		try {
			await addWebhook(name, url);
			nameInput.value = "";
			urlInput.value = "";
		} catch (error) {
			showToast(`Failed to add webhook: ${error.message}`, "error");
		}
	} else {
		showToast("Please enter both webhook name and URL", "error");
	}
}

function filterMods(e) {
	const filterText = e.target.value.toLowerCase();
	const filteredMods = allMods.filter(
		(mod) =>
			mod.name.toLowerCase().includes(filterText) ||
			mod.mod_id.toLowerCase().includes(filterText)
	);
	renderModList(filteredMods);
}

function handleModUpdated(event, mod) {
	console.log(
		`Mod update received: ${mod.name} from ${mod.oldReleased} to ${mod.newReleased}`
	);
	showToast(
		`Mod ${mod.name} updated from release date ${mod.oldReleased} to ${mod.newReleased}`,
		"success"
	);
	updateModList();
}

function handleUpdateCheckComplete(event, result) {
	updateModList();
	updateWebhookDropdowns();
	if (result.updatesFound) {
		showToast("Mod updates found and applied!", "success");
	} else {
		showToast("No mod updates detected", "info");
	}
}

function handleAddModResult(event, result) {
	if (result.success) {
		showToast("Mod added successfully", "success");
		updateModList();
	} else {
		if (result.error === "Mod already exists") {
			showToast("This mod is already in your list", "warning");
		} else {
			showToast(`Failed to add mod: ${result.error}`, "error");
		}
	}
}

function handleAddWebhookResult(event, result) {
	if (result.success) {
		showToast("Webhook added successfully", "success");
		updateWebhookList();
	} else {
		showToast(`Failed to add webhook: ${result.error}`, "error");
	}
}

function handleGetWebhooksResult(event, result) {
	if (result.success) {
		updateWebhookDropdowns(result.webhooks);
	} else {
		showToast(`Failed to get webhooks: ${result.error}`, "error");
	}
}

function handleDeleteModResult(event, result) {
	if (result.success) {
		showToast("Mod deleted successfully", "success");
		updateModList();
	} else {
		showToast(`Failed to delete mod: ${result.error}`, "error");
	}
}

function handleDeleteWebhookResult(event, result) {
	if (result.success) {
		showToast("Webhook removed successfully", "success");
		updateWebhookList();
	} else {
		showToast(`Failed to delete webhook: ${result.error}`, "error");
	}
}

function handleTestWebhookResult(event, result) {
	if (result.success) {
		showToast("Webhook test successful", "success");
	} else {
		showToast(`Webhook test failed: ${result.error}`, "error");
	}
}

function updateCountdown(event, { hours, minutes, seconds }) {
	document.getElementById("hours").textContent = hours
		.toString()
		.padStart(2, "0");
	document.getElementById("minutes").textContent = minutes
		.toString()
		.padStart(2, "0");
	document.getElementById("seconds").textContent = seconds
		.toString()
		.padStart(2, "0");
}

async function updateModList() {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("get-mods");
		ipcRenderer.once("get-mods-result", (event, result) => {
			if (result.success) {
				allMods = result.mods;
				renderModList(allMods);
				updateModCount(allMods.length);
				updateWebhookDropdowns();
				resolve();
			} else {
				showToast(`Failed to get mods: ${result.error}`, "error");
				reject(new Error(result.error));
			}
		});
	});
}

function clearConsole() {
	consoleLines = [];
	updateConsoleOutput(consoleLines);
}

function toggleApiKeyVisibility(event) {
	event.preventDefault();
	event.stopPropagation();

	const apiKeyInput = document.getElementById("apiKeyInput");
	const toggleButton = document.getElementById("toggleApiKeyVisibility");
	const icon = toggleButton.querySelector("i");

	console.log("Toggle button clicked. Current input type:", apiKeyInput.type);

	if (apiKeyInput.type === "password") {
		apiKeyInput.type = "text";
		icon.classList.remove("fa-eye");
		icon.classList.add("fa-eye-slash");
	} else {
		apiKeyInput.type = "password";
		icon.classList.remove("fa-eye-slash");
		icon.classList.add("fa-eye");
	}

	console.log("New input type immediately after change:", apiKeyInput.type);

	// Check the type after a small delay
	setTimeout(() => {
		console.log("Input type after delay:", apiKeyInput.type);
	}, 100);

	return false;
}

async function handleSaveApiKey() {
	const apiKeyInput = document.getElementById("apiKeyInput");
	const apiKey = apiKeyInput.value.trim();
	if (apiKey) {
		await saveApiKey(apiKey);
		showToast("API key saved successfully", "success");
	} else {
		showToast("Please enter an API key", "error");
	}
}

function handleIntervalSliderChange(e) {
	const intervalInput = document.getElementById("intervalInput");
	intervalInput.value = e.target.value;
	currentInterval = parseInt(e.target.value);
}

function handleIntervalInputChange(e) {
	const intervalSlider = document.getElementById("intervalSlider");
	const value = parseInt(e.target.value);
	if (!isNaN(value) && value >= 1 && value <= 3600) {
		intervalSlider.value = value;
		currentInterval = value;
	}
}

async function handleSetInterval() {
	const interval = currentInterval;
	if (!isNaN(interval) && interval >= 1) {
		await saveInterval(interval);
		ipcRenderer.send("set-interval", interval);
		showToast("Update interval set successfully", "success");
	} else {
		showToast("Please enter a valid interval (1-3600 seconds)", "error");
	}
}

function updateIntervalDisplay() {
	const intervalSlider = document.getElementById("intervalSlider");
	const intervalInput = document.getElementById("intervalInput");
	intervalSlider.value = currentInterval;
	intervalInput.value = currentInterval;
}

const originalConsoleLog = console.log;
console.log = function () {
	originalConsoleLog.apply(console, arguments);
	const logMessage = Array.from(arguments).join(" ");
	consoleLines.push(logMessage);
	if (consoleLines.length > 200) {
		consoleLines.shift();
	}
	updateConsoleOutput(consoleLines);
};

module.exports = {
	initializeApp,
	handlePauseResume,
	addMod,
	checkForUpdates,
	handleAddWebhook,
	filterMods,
	clearConsole,
};
