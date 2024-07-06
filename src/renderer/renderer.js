const { ipcRenderer } = require("electron");
const { showToast, showToastDebounced } = require("./utils/toast");
const { updateModCount, updateConsoleOutput } = require("./utils/domUtils");
const {
	renderModList,
	initializeWebhookSelects,
	handleWebhookChange,
	updateSelectedText,
} = require("./components/ModList");
const {
	renderWebhookList,
	updateWebhookList,
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
	const pauseResumeButton = document.getElementById("pauseResumeButton");
	pauseResumeButton.removeEventListener("click", handlePauseResume);
	pauseResumeButton.addEventListener("click", handlePauseResume);

	ipcRenderer.on("initialize-pause-resume-button", () => {
		console.log("Initializing pause/resume button");
		pauseResumeButton.textContent = "Pause";
		isPaused = false;
	});

	currentInterval = (await loadSavedInterval()) || DEFAULT_INTERVAL;
	await loadApiKey();
	await updateModList();
	await updateWebhookList();
	openTab("mods");

	setupEventListeners();

	// Update the interval input and slider with the current interval
	const intervalSlider = document.getElementById("intervalSlider");
	const intervalInput = document.getElementById("intervalInput");
	intervalSlider.value = Math.min(currentInterval, 3600);
	intervalInput.value = currentInterval;

	initializeSettings();

	console.log("Application initialized");
}

function setupEventListeners() {
	document.getElementById("addModButton").addEventListener("click", addMod);
	document
		.getElementById("checkUpdatesButton")
		.addEventListener("click", checkForUpdates);
	document
		.getElementById("addWebhookButton")
		.addEventListener("click", addWebhook);
	document
		.getElementById("filterModInput")
		.addEventListener("input", filterMods);

	document.querySelectorAll(".tab-button").forEach((button) => {
		button.addEventListener("click", () => {
			const tabName = button.getAttribute("data-tab");
			openTab(tabName);
		});
	});

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
	const button = document.getElementById("pauseResumeButton");
	console.log("Pause/Resume button clicked. Current state:", isPaused);
	if (isPaused) {
		ipcRenderer.send("resume-timer");
		button.textContent = "Pause";
		isPaused = false;
		console.log("Resuming timer.");
	} else {
		ipcRenderer.send("pause-timer");
		button.textContent = "Resume";
		isPaused = true;
		console.log("Pausing timer.");
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

function addWebhook() {
	const webhookNameInput = document.getElementById("webhookNameInput");
	const webhookInput = document.getElementById("webhookInput");
	const webhookName = webhookNameInput.value.trim();
	const webhookUrl = webhookInput.value.trim();
	if (webhookName && webhookUrl) {
		ipcRenderer.send("add-webhook", { name: webhookName, url: webhookUrl });
		webhookNameInput.value = "";
		webhookInput.value = "";
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

function openTab(tabName) {
	const tabContents = document.querySelectorAll(".tab-content");
	const tabButtons = document.querySelectorAll(".tab-button");

	tabContents.forEach((tab) => {
		tab.classList.add("hidden");
	});

	tabButtons.forEach((button) => {
		button.classList.remove(
			"active",
			"text-blue-600",
			"border-blue-600",
			"dark:text-blue-500",
			"dark:border-blue-500"
		);
		button.classList.add(
			"text-gray-500",
			"hover:text-gray-300",
			"hover:border-gray-300",
			"dark:hover:text-gray-300"
		);
	});

	document.getElementById(`${tabName}-tab`).classList.remove("hidden");
	const activeTab = document.querySelector(
		`.tab-button[data-tab="${tabName}"]`
	);
	activeTab.classList.add(
		"active",
		"text-blue-600",
		"border-blue-600",
		"dark:text-blue-500",
		"dark:border-blue-500"
	);
	activeTab.classList.remove(
		"text-gray-500",
		"hover:text-gray-300",
		"hover:border-gray-300",
		"dark:hover:text-gray-300"
	);
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
		if (result.error === "Webhook name already exists") {
			showToast("A webhook with this name already exists", "warning");
		} else if (result.error === "Webhook URL already exists") {
			showToast("This webhook URL is already in your list", "warning");
		} else if (result.error === "Webhook already exists") {
			showToast("This webhook is already in your list", "warning");
		} else {
			showToast(`Failed to add webhook: ${result.error}`, "error");
		}
	}
}

function handleGetWebhooksResult(event, result) {
	if (result.success) {
		const webhooks = result.webhooks;
		const customSelects = document.querySelectorAll(".custom-select");

		customSelects.forEach(async (select) => {
			const modId = select.getAttribute("data-mod-id");
			const selectItems = select.querySelector(".select-items");
			selectItems.innerHTML = "";

			webhooks.forEach((webhook) => {
				const option = document.createElement("div");
				option.className =
					"select-item flex items-center p-2 hover:bg-gray-600 cursor-pointer";
				option.innerHTML = `
                    <div class="flex items-center w-full">
                        <input id="${modId}-${webhook.id}" type="checkbox" value="${webhook.id}" 
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                        <label for="${modId}-${webhook.id}" class="ms-2 text-sm font-medium text-gray-300 flex-grow">
                            ${webhook.name}
                        </label>
                    </div>
                `;

				const checkbox = option.querySelector('input[type="checkbox"]');

				// Handle clicks on the entire row
				option.addEventListener("click", (e) => {
					if (e.target !== checkbox) {
						e.preventDefault();
						checkbox.checked = !checkbox.checked;
						handleWebhookChange({ target: checkbox });
					}
				});

				// Handle clicks directly on the checkbox
				checkbox.addEventListener("change", (e) => {
					e.stopPropagation();
					handleWebhookChange({ target: checkbox });
				});

				selectItems.appendChild(option);
			});

			const assignedWebhooks = await ipcRenderer.invoke(
				"get-mod-webhooks",
				modId
			);

			selectItems
				.querySelectorAll('input[type="checkbox"]')
				.forEach((checkbox) => {
					if (assignedWebhooks.includes(parseInt(checkbox.value))) {
						checkbox.checked = true;
					}
				});

			updateSelectedText(select);
		});
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
	document.getElementById("hours").textContent = hours;
	document.getElementById("minutes").textContent = minutes;
	document.getElementById("seconds").textContent = seconds;
}

async function updateModList() {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("get-mods");
		ipcRenderer.once("get-mods-result", (event, result) => {
			if (result.success) {
				allMods = result.mods;
				renderModList(allMods);
				updateModCount(allMods.length);
				resolve();
			} else {
				showToast(`Failed to get mods: ${result.error}`, "error");
				reject(new Error(result.error));
			}
		});
	});
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
