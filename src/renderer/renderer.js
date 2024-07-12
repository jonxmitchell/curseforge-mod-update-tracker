const { ipcRenderer } = require("electron");
const { showToast } = require("./utils/toast");
const logger = require("./utils/logger");
const { initializeCharacterCounters } = require("./utils/characterCounter");
const { updateModCount, updateConsoleOutput } = require("./utils/domUtils");
const {
	initializeTooltipState,
	setTooltipState,
	shouldShowTooltips,
	showTooltip,
	hideTooltip,
} = require("./utils/tooltipManager");
const {
	renderModList,
	initializeWebhookSelects,
	handleWebhookChange,
	updateSelectedText,
	updateWebhookDropdowns,
	initializeTooltips,
	filterMods,
} = require("./components/ModList");
const {
	renderWebhookList,
	updateWebhookList,
	addWebhook,
	renameWebhook,
} = require("./components/WebhookList");
const {
	loadSavedInterval,
	loadApiKey,
	saveInterval,
	saveApiKey,
	initializeSettings,
} = require("./components/Settings");
const {
	initializeWebhookLayout,
	initializeFormattedContent,
} = require("./components/WebhookLayout");

const { DEFAULT_INTERVAL } = require("../shared/constants");

let isPaused = false;
let currentInterval = DEFAULT_INTERVAL;
let consoleLines = [];
let allMods = [];

document.addEventListener("DOMContentLoaded", initializeApp);

async function initializeApp() {
	console.log("Starting application initialization...");

	console.log("Initializing tooltip state...");
	await initializeTooltipState();
	console.log("Tooltip state initialized.");

	console.log("Setting up event listeners...");
	await setupEventListeners();
	console.log("Event listeners set up.");

	console.log("Loading saved interval...");
	currentInterval = (await loadSavedInterval()) || DEFAULT_INTERVAL;
	console.log(`Saved interval loaded: ${currentInterval} seconds`);

	console.log("Loading API key...");
	await loadApiKey();
	console.log("API key loaded.");

	console.log("Updating mod list...");
	await updateModList();
	console.log("Mod list updated.");

	console.log("Updating webhook list...");
	await updateWebhookList();
	console.log("Webhook list updated.");

	console.log("Initializing settings...");
	initializeSettings();
	console.log("Settings initialized.");

	console.log("Initializing webhook layout...");
	initializeWebhookLayout();
	console.log("Webhook layout initialized.");

	console.log("Updating interval display...");
	updateIntervalDisplay();
	console.log("Interval display updated.");

	console.log("Initializing formatted content...");
	initializeFormattedContent();
	console.log("Formatted content initialized.");

	console.log("Initializing tabs...");
	initializeTabs();
	console.log("Tabs initialized.");

	console.log("Initializing rename webhook modal...");
	initializeRenameWebhookModal();
	console.log("Rename webhook modal initialized.");

	console.log("Initializing tooltip toggle...");
	initializeTooltipToggle();
	console.log("Tooltip toggle initialized.");

	console.log("Initializing character counters...");
	initializeCharacterCounters();
	console.log("Character counters initialized.");

	console.log("Application initialization completed.");
}

function initializeRenameWebhookModal() {
	const modal = document.getElementById("renameWebhookModal");
	const closeButtons = modal.querySelectorAll("[data-modal-hide]");
	const submitButton = document.getElementById("renameWebhookSubmit");

	closeButtons.forEach((button) => {
		button.addEventListener("click", () => {
			modal.classList.add("hidden");
		});
	});

	submitButton.addEventListener("click", handleRenameWebhook);
}

function initializeTabs() {
	const tabsElement = document.getElementById("myTab");
	if (!tabsElement) {
		console.error("Tabs element not found");
		return;
	}

	const tabButtons = tabsElement.querySelectorAll('[role="tab"]');
	const tabContents = document.querySelectorAll('[role="tabpanel"]');

	function setActiveTab(tabId) {
		tabButtons.forEach((button) => {
			if (button.getAttribute("data-tabs-target") === `#${tabId}`) {
				button.classList.add("text-blue-600", "border-blue-600");
				button.classList.remove("text-gray-500", "border-transparent");
				button.setAttribute("aria-selected", "true");
			} else {
				button.classList.remove("text-blue-600", "border-blue-600");
				button.classList.add("text-gray-500", "border-transparent");
				button.setAttribute("aria-selected", "false");
			}
		});

		tabContents.forEach((content) => {
			if (content.id === tabId) {
				content.classList.remove("hidden");
			} else {
				content.classList.add("hidden");
			}
		});
	}

	tabButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const tabId = button.getAttribute("data-tabs-target").replace("#", "");
			setActiveTab(tabId);
		});
	});

	// Set the first tab as active by default
	if (tabButtons.length > 0) {
		const firstTabId = tabButtons[0]
			.getAttribute("data-tabs-target")
			.replace("#", "");
		setActiveTab(firstTabId);
	}
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
		.addEventListener("click", toggleApiKeyVisibility);
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
	document
		.getElementById("tooltipToggle")
		.addEventListener("change", handleTooltipToggle);

	const filterModInput = document.getElementById("filterModInput");
	const clearModSearchButton = document.querySelector(".clear-mod-search");

	if (clearModSearchButton) {
		clearModSearchButton.addEventListener("click", () => {
			filterModInput.value = "";
			filterModInput.dispatchEvent(new Event("input"));
		});
	}

	setupIpcListeners();
}

function setupIpcListeners() {
	ipcRenderer.on("mod-updated", handleModUpdated);
	ipcRenderer.on("update-check-complete", handleUpdateCheckComplete);
	ipcRenderer.on("add-mod-result", handleAddModResult);
	ipcRenderer.on("delete-mod-result", handleDeleteModResult);
	ipcRenderer.on("delete-webhook-result", handleDeleteWebhookResult);
	ipcRenderer.on("test-webhook-result", handleTestWebhookResult);
	ipcRenderer.on("countdown-tick", updateCountdown);
	ipcRenderer.on("main-process-log", (event, message) => {
		console.log(message);
	});
}

function handlePauseResume() {
	isPaused = !isPaused;
	const button = document.getElementById("pauseResumeButton");
	if (isPaused) {
		ipcRenderer.send("pause-timer");
		button.textContent = "Resume";
		console.log("Timer paused");
	} else {
		ipcRenderer.send("resume-timer");
		button.textContent = "Pause";
		console.log("Timer resumed");
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
	console.log("Manual mod check initiated");
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
			console.log(`Webhook added: ${name}`);
			showToast("Webhook added successfully", "success");
			nameInput.value = "";
			urlInput.value = "";
		} catch (error) {
			console.error(`Failed to add webhook: ${error.message}`);
			showToast(`Failed to add webhook: ${error.message}`, "error");
		}
	} else {
		showToast("Please enter both webhook name and URL", "error");
	}
}

function handleModUpdated(event, mod) {
	const oldDate = new Date(mod.oldReleased);
	const newDate = new Date(mod.newReleased);
	const formattedOldDate = oldDate
		.toLocaleString("en-GB", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		})
		.replace(",", "");
	const formattedNewDate = newDate
		.toLocaleString("en-GB", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		})
		.replace(",", "");

	console.log(
		`Mod update detected: ${mod.name} from ${formattedOldDate} to ${formattedNewDate}`
	);
	showToast(
		`Mod ${mod.name} updated from release date ${formattedOldDate} to ${formattedNewDate}`,
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
		console.log("No mod updates detected");
		showToast("No mod updates detected", "info");
	}
}

function handleAddModResult(event, result) {
	if (result.success) {
		console.log(
			`Mod added to tracker: ${result.mod.name} (ID: ${result.mod.id})`
		);
		showToast("Mod added successfully", "success");
		updateModList();
	} else {
		if (result.error === "Mod already exists") {
			showToast("This mod is already in your list", "warning");
		} else {
			console.error(`Failed to add mod: ${result.error}`);
			showToast(`Failed to add mod: ${result.error}`, "error");
		}
	}
}

function handleDeleteModResult(event, result) {
	if (result.success) {
		console.log(`Mod deleted from tracker: ID ${result.modId}`);
		showToast("Mod deleted successfully", "success");
		updateModList();
	} else {
		console.error(`Failed to delete mod: ${result.error}`);
		showToast(`Failed to delete mod: ${result.error}`, "error");
	}
}

function handleDeleteWebhookResult(event, result) {
	if (result.success) {
		console.log(`Webhook deleted: ID ${result.id}`);
		showToast("Webhook removed successfully", "success");
		updateWebhookList();
	} else {
		console.error(`Failed to delete webhook: ${result.error}`);
		showToast(`Failed to delete webhook: ${result.error}`, "error");
	}
}

function handleTestWebhookResult(event, result) {
	if (result.success) {
		console.log(`Test webhook sent successfully for ${result.webhookName}`);
		showToast("Webhook test successful", "success");
	} else {
		console.error(
			`Webhook test failed for ${result.webhookName}: ${result.error}`
		);
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

function toggleApiKeyVisibility() {
	const apiKeyInput = document.getElementById("apiKeyInput");
	const toggleButton = document.getElementById("toggleApiKeyVisibility");
	if (apiKeyInput.type === "password") {
		apiKeyInput.type = "text";
		toggleButton.innerHTML = `
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1.933 10.909A4.357 4.357 0 0 1 1 9c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 19 9c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M2 17 18 1m-5 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
            </svg>
        `;
	} else {
		apiKeyInput.type = "password";
		toggleButton.innerHTML = `
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 14">
                <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                    <path d="M10 13c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6Z"/>
                </g>
            </svg>
        `;
	}
}

async function handleSaveApiKey() {
	const apiKeyInput = document.getElementById("apiKeyInput");
	const apiKey = apiKeyInput.value.trim();
	if (apiKey) {
		try {
			await saveApiKey(apiKey);
			console.log("API key updated");
			showToast("API key saved successfully", "success");
		} catch (error) {
			console.error(`Failed to save API key: ${error.message}`);
			showToast(`Failed to save API key: ${error.message}`, "error");
		}
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
	if (!isNaN(value)) {
		if (value > 3600) {
			intervalSlider.value = 3600;
		} else {
			intervalSlider.value = value;
		}
		currentInterval = value;
	}
}

async function handleSetInterval() {
	const interval = currentInterval;
	if (!isNaN(interval) && interval >= 1) {
		try {
			await saveInterval(interval);
			ipcRenderer.send("set-interval", interval);
			console.log(`Update interval set to ${interval} seconds`);
			showToast("Update interval set successfully", "success");
		} catch (error) {
			console.error(`Failed to set interval: ${error.message}`);
			showToast(`Failed to set interval: ${error.message}`, "error");
		}
	} else {
		showToast("Please enter a valid interval (minimum 1 second)", "error");
	}
}

function updateIntervalDisplay() {
	const intervalSlider = document.getElementById("intervalSlider");
	const intervalInput = document.getElementById("intervalInput");
	intervalSlider.value = Math.min(currentInterval, 3600);
	intervalInput.value = currentInterval;
}

async function handleRenameWebhook() {
	const webhookId = document.getElementById("webhookIdInput").value;
	const newName = document.getElementById("newWebhookName").value.trim();
	const oldName = document.getElementById("currentWebhookName").textContent;

	if (newName) {
		try {
			await renameWebhook(webhookId, newName);
			console.log(`Webhook renamed from "${oldName}" to "${newName}"`);
			showToast("Webhook renamed successfully", "success");
			document.getElementById("renameWebhookModal").classList.add("hidden");
		} catch (error) {
			console.error(`Failed to rename webhook: ${error.message}`);
			showToast(`Failed to rename webhook: ${error.message}`, "error");
		}
	} else {
		showToast("Please enter a new name for the webhook", "error");
	}
}

function initializeTooltipToggle() {
	const tooltipToggle = document.getElementById("tooltipToggle");
	tooltipToggle.checked = shouldShowTooltips();
	if (tooltipToggle.checked) {
		document.querySelectorAll("[data-tooltip]").forEach((element) => {
			element.addEventListener("mouseenter", showTooltip);
			element.addEventListener("mouseleave", hideTooltip);
		});
	} else {
		removeAllTooltipListeners();
	}
}

function handleTooltipToggle(event) {
	const isEnabled = event.target.checked;
	setTooltipState(isEnabled);
	console.log(`Tooltips ${isEnabled ? "enabled" : "disabled"}`);
	if (isEnabled) {
		document.querySelectorAll("[data-tooltip]").forEach((element) => {
			element.addEventListener("mouseenter", showTooltip);
			element.addEventListener("mouseleave", hideTooltip);
		});
	} else {
		removeAllTooltipListeners();
	}
}

function removeAllTooltipListeners() {
	document.querySelectorAll("[data-tooltip]").forEach((element) => {
		element.removeEventListener("mouseenter", showTooltip);
		element.removeEventListener("mouseleave", hideTooltip);
	});
}

// Modify the existing console.log override
const originalConsoleLog = console.log;
console.log = function (...args) {
	originalConsoleLog.apply(console, args);
	const logMessage = args.join(" ");
	const now = new Date();
	const date = `${String(now.getDate()).padStart(2, "0")}/${String(
		now.getMonth() + 1
	).padStart(2, "0")}/${now.getFullYear()}`;
	const time = `${String(now.getHours()).padStart(2, "0")}:${String(
		now.getMinutes()
	).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
	const formattedDateTime = `[${date}] [${time}]`;
	const formattedMessage = `${formattedDateTime} ${logMessage}`;
	consoleLines.push(formattedMessage);
	if (consoleLines.length > 200) {
		consoleLines.shift();
	}
	updateConsoleOutput(consoleLines);

	// Send log to main process for file writing
	ipcRenderer.send("log-to-file", logMessage);
};

module.exports = {
	initializeApp,
	handlePauseResume,
	addMod,
	checkForUpdates,
	handleAddWebhook,
	clearConsole,
};
