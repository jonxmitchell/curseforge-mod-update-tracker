const { ipcRenderer } = require("electron");
const Toastify = require("toastify-js");

let updatedMods = new Set();
let allMods = [];
let isPaused = false;
let currentInterval = 3600;
let consoleLines = [];

document.addEventListener("DOMContentLoaded", () => {
	initializeApp();
});

async function initializeApp() {
	const pauseResumeButton = document.getElementById("pauseResumeButton");
	pauseResumeButton.removeEventListener("click", handlePauseResume);
	pauseResumeButton.addEventListener("click", handlePauseResume);

	ipcRenderer.on("initialize-pause-resume-button", () => {
		console.log("Initializing pause/resume button");
		pauseResumeButton.textContent = "Pause";
		isPaused = false;
	});

	await loadSavedInterval();
	await loadApiKey();
	await updateModList();
	await updateWebhookList();
	openTab("mods");

	console.log("Application initialized");
}

document.getElementById("addModButton").addEventListener("click", () => {
	const modIdInput = document.getElementById("modSearchInput");
	const modId = modIdInput.value.trim();
	if (modId) {
		ipcRenderer.send("add-mod", modId);
		modIdInput.value = "";
	} else {
		showToast("Please enter a mod ID", "error");
	}
});

document.getElementById("checkUpdatesButton").addEventListener("click", () => {
	checkForUpdates();
});

document.getElementById("addWebhookButton").addEventListener("click", () => {
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
});

document.getElementById("filterModInput").addEventListener("input", (e) => {
	const filterText = e.target.value.toLowerCase();
	const filteredMods = allMods.filter(
		(mod) =>
			mod.name.toLowerCase().includes(filterText) ||
			mod.mod_id.toLowerCase().includes(filterText)
	);
	renderModList(filteredMods);
});

const intervalSlider = document.getElementById("intervalSlider");
const intervalInput = document.getElementById("intervalInput");

intervalSlider.addEventListener("input", (e) => {
	const value = e.target.value;
	intervalInput.value = value;
});

intervalInput.addEventListener("input", (e) => {
	const value = e.target.value;
	e.target.value = value.replace(/[^0-9]/g, "");
	const newInterval = parseInt(value, 10);

	if (newInterval < 1) {
		showToast("Interval must be at least 1 second.", "error");
		document.getElementById("setIntervalButton").disabled = true;
	} else {
		document.getElementById("setIntervalButton").disabled = false;
		if (newInterval <= 3600) {
			intervalSlider.value = newInterval;
		} else {
			intervalSlider.value = 3600;
		}
	}
});

document
	.getElementById("setIntervalButton")
	.addEventListener("click", async () => {
		const newInterval = parseInt(intervalInput.value, 10);
		if (newInterval >= 1) {
			if (newInterval < 300) {
				showToast(
					"It is recommended to set the interval to at least 300 seconds",
					"warning"
				);
			}
			currentInterval = newInterval;
			try {
				await ipcRenderer.invoke("save-interval", currentInterval);
				showToast("Update interval set successfully", "success");
			} catch (error) {
				console.error("Failed to save interval:", error);
				showToast("Failed to save interval", "error");
			}
		}
	});

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

document.getElementById("clearConsoleButton").addEventListener("click", () => {
	consoleLines = [];
	updateConsoleOutput();
	showToast("Console cleared", "info");
});

document
	.getElementById("toggleApiKeyVisibility")
	.addEventListener("click", () => {
		const apiKeyInput = document.getElementById("apiKeyInput");
		const toggleButton = document.getElementById("toggleApiKeyVisibility");
		if (apiKeyInput.type === "password") {
			apiKeyInput.type = "text";
			toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
		} else {
			apiKeyInput.type = "password";
			toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
		}
	});

document
	.getElementById("saveApiKeyButton")
	.addEventListener("click", async () => {
		const apiKeyInput = document.getElementById("apiKeyInput").value.trim();
		if (apiKeyInput) {
			try {
				const result = await ipcRenderer.invoke("save-api-key", apiKeyInput);
				if (result.success) {
					showToast("API key saved successfully", "success");
				} else {
					showToast(`Failed to save API key: ${result.error}`, "error");
				}
			} catch (error) {
				console.error("Failed to save API key:", error);
				showToast("Failed to save API key", "error");
			}
		} else {
			showToast("Please enter an API key", "error");
		}
	});

ipcRenderer.on("add-mod-result", (event, result) => {
	if (result.success) {
		showToast("Mod added successfully", "success");
		updateModList();
	} else {
		showToast(`Failed to add mod: ${result.error}`, "error");
	}
});

ipcRenderer.on("mod-updated", (event, mod) => {
	console.log(
		`Mod update received: ${mod.name} from ${mod.oldReleased} to ${mod.newReleased}`
	);
	showToast(
		`Mod ${mod.name} updated from release date ${mod.oldReleased} to ${mod.newReleased}`,
		"success"
	);
	updatedMods.add(mod.id);
	updateModList();
});

ipcRenderer.on("update-check-complete", (event, result) => {
	updatedMods.clear();
	updateModList();

	if (result.updatesFound) {
		showToast("Mod updates found and applied!", "success");
	} else {
		showToast("No mod updates detected", "info");
	}
});

ipcRenderer.on("add-webhook-result", (event, result) => {
	if (result.success) {
		showToast("Webhook added successfully", "success");
		updateWebhookList();
	} else {
		showToast(`Failed to add webhook: ${result.error}`, "error");
	}
});

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

function updateModCount(count) {
	const modCountElement = document.querySelector(".mod-count");
	if (modCountElement) {
		modCountElement.textContent = count;
	}
}

function renderModList(mods) {
	const modList = document.getElementById("modList");
	modList.innerHTML = "";
	mods.forEach((mod) => {
		const modElement = document.createElement("div");
		modElement.className = "mod-item";
		if (updatedMods.has(mod.mod_id)) {
			modElement.classList.add("mod-updated");
		}
		modElement.innerHTML = `
            <div class="mod-info">
                <span class="mod-name">${mod.name} (ID: ${mod.mod_id})</span>
                <span class="mod-game">Game: ${mod.game}</span>
                <span class="mod-updated">Last Updated: ${new Date(
									mod.last_checked_released
								).toLocaleString()}</span>
            </div>
            <div class="mod-actions">
                <div class="custom-select" data-mod-id="${mod.mod_id}">
                    <div class="select-selected">Select Webhooks</div>
                    <div class="select-items select-hide"></div>
                </div>
                <a href="${
									mod.website_url
								}" target="_blank" class="mod-link"><i class="fas fa-external-link-alt"></i></a>
                <button class="delete-mod" data-mod-id="${
									mod.mod_id
								}"><i class="fas fa-trash"></i></button>
            </div>
        `;
		modList.appendChild(modElement);
	});

	document.querySelectorAll(".delete-mod").forEach((button) => {
		button.addEventListener("click", (e) => {
			const modId = e.target.closest(".delete-mod").getAttribute("data-mod-id");
			ipcRenderer.send("delete-mod", modId);
		});
	});

	initializeWebhookSelects();
}

function initializeWebhookSelects() {
	const customSelects = document.querySelectorAll(".custom-select");
	customSelects.forEach((select) => {
		const selectSelected = select.querySelector(".select-selected");
		const selectItems = select.querySelector(".select-items");

		selectSelected.addEventListener("click", function (e) {
			e.stopPropagation();
			selectItems.classList.toggle("select-hide");
			this.classList.toggle("select-arrow-active");
		});

		// Prevent the dropdown from closing when clicking on an option
		selectItems.addEventListener("click", (e) => {
			e.stopPropagation();
		});
	});

	document.addEventListener("click", closeAllSelect);
	updateWebhookSelects();
}

function updateWebhookSelects() {
	ipcRenderer.send("get-webhooks");
}

ipcRenderer.on("get-webhooks-result", async (event, result) => {
	if (result.success) {
		const webhooks = result.webhooks;
		const customSelects = document.querySelectorAll(".custom-select");

		for (const select of customSelects) {
			const modId = select.getAttribute("data-mod-id");
			const selectItems = select.querySelector(".select-items");
			const selectSelected = select.querySelector(".select-selected");
			selectItems.innerHTML = "";

			webhooks.forEach((webhook) => {
				const option = document.createElement("div");
				option.innerHTML = `
                    <input type="checkbox" id="${modId}-${webhook.id}" value="${webhook.id}">
                    <label for="${modId}-${webhook.id}">${webhook.name}</label>
                `;
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

			selectItems.removeEventListener("change", handleWebhookChange); // Remove any previous listener
			selectItems.addEventListener("change", handleWebhookChange);
		}
	} else {
		showToast(`Failed to get webhooks: ${result.error}`, "error");
	}
});

async function handleWebhookChange(e) {
	const checkbox = e.target;
	const modId = checkbox.closest(".custom-select").getAttribute("data-mod-id");
	const select = checkbox.closest(".custom-select");
	const webhookIds = Array.from(
		checkbox
			.closest(".select-items")
			.querySelectorAll('input[type="checkbox"]:checked'),
		(checkbox) => parseInt(checkbox.value)
	);
	const webhookName = checkbox.nextElementSibling.textContent;
	const isChecked = checkbox.checked;

	await ipcRenderer.send("assign-webhooks", { modId, webhookIds });

	if (isChecked) {
		showToast(`${webhookName} webhook was assigned to mod ${modId}`, "success");
	} else {
		showToast(
			`${webhookName} webhook was unassigned from mod ${modId}`,
			"success"
		);
	}

	updateSelectedText(select);
	// Prevent dropdown from closing
	e.stopPropagation();
}

function updateSelectedText(select) {
	const selectedWebhooks = Array.from(
		select.querySelectorAll('input[type="checkbox"]:checked'),
		(checkbox) => checkbox.nextElementSibling.textContent
	);
	const selectedText = select.querySelector(".select-selected");
	if (selectedWebhooks.length > 0) {
		selectedText.textContent = selectedWebhooks.join(", ");
	} else {
		selectedText.textContent = "Select Webhooks";
	}
}

function closeAllSelect(elmnt) {
	const selectItems = document.getElementsByClassName("select-items");
	const selectSelected = document.getElementsByClassName("select-selected");
	for (let i = 0; i < selectSelected.length; i++) {
		if (elmnt !== selectSelected[i]) {
			selectSelected[i].classList.remove("select-arrow-active");
		}
	}
	for (let i = 0; i < selectItems.length; i++) {
		if (
			elmnt !== selectItems[i] &&
			elmnt.parentNode !== selectItems[i].parentNode
		) {
			selectItems[i].classList.add("select-hide");
		}
	}
}

ipcRenderer.on("delete-mod-result", (event, result) => {
	if (result.success) {
		showToast("Mod deleted successfully", "success");
		updateModList();
	} else {
		showToast(`Failed to delete mod: ${result.error}`, "error");
	}
});

async function updateWebhookList() {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("get-webhooks");
		ipcRenderer.once("get-webhooks-result", (event, result) => {
			if (result.success) {
				renderWebhookList(result.webhooks);
				resolve();
			} else {
				showToast(`Failed to get webhooks: ${result.error}`, "error");
				reject(new Error(result.error));
			}
		});
	});
}

function renderWebhookList(webhooks) {
	const webhookList = document.getElementById("webhookList");
	webhookList.innerHTML = "";
	webhooks.forEach((webhook) => {
		const webhookElement = document.createElement("div");
		webhookElement.className = "webhook-item";
		const truncatedUrl =
			webhook.url.length > 60
				? webhook.url.substring(0, 60) + "..."
				: webhook.url;
		webhookElement.innerHTML = `
            <div class="webhook-info">
                <span class="webhook-name">${webhook.name}</span>
                <span class="webhook-url">${truncatedUrl}</span>
            </div>
            <div class="webhook-actions">
                <button class="show-full-webhook">Show Full Webhook</button>
                <button class="test-webhook">Test</button>
                <button class="delete-webhook" data-webhook-id="${webhook.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
		webhookList.appendChild(webhookElement);

		const showFullWebhookButton =
			webhookElement.querySelector(".show-full-webhook");
		showFullWebhookButton.addEventListener("click", () => {
			const webhookUrlElement = webhookElement.querySelector(".webhook-url");
			if (webhookUrlElement.textContent === truncatedUrl) {
				webhookUrlElement.textContent = webhook.url;
				showFullWebhookButton.textContent = "Hide Full Webhook";
			} else {
				webhookUrlElement.textContent = truncatedUrl;
				showFullWebhookButton.textContent = "Show Full Webhook";
			}
		});

		const testWebhookButton = webhookElement.querySelector(".test-webhook");
		testWebhookButton.addEventListener("click", () => {
			ipcRenderer.send("test-webhook", webhook.id);
		});

		const deleteWebhookButton = webhookElement.querySelector(".delete-webhook");
		deleteWebhookButton.addEventListener("click", () => {
			ipcRenderer.send("delete-webhook", webhook.id);
		});
	});
}

ipcRenderer.on("delete-webhook-result", (event, result) => {
	if (result.success) {
		showToast("Webhook removed successfully", "success");
		updateWebhookList();
	} else {
		showToast(`Failed to delete webhook: ${result.error}`, "error");
	}
});

ipcRenderer.on("test-webhook-result", (event, result) => {
	if (result.success) {
		showToast("Webhook test successful", "success");
	} else {
		showToast(`Webhook test failed: ${result.error}`, "error");
	}
});

ipcRenderer.on("countdown-tick", (event, { hours, minutes, seconds }) => {
	document.getElementById("hours").textContent = hours;
	document.getElementById("minutes").textContent = minutes;
	document.getElementById("seconds").textContent = seconds;
});

async function loadSavedInterval() {
	try {
		const result = await ipcRenderer.invoke("get-interval");
		if (result.success) {
			currentInterval = result.interval;
			intervalSlider.value = Math.min(currentInterval, 3600);
			intervalInput.value = currentInterval;
		} else {
			console.error("Failed to load saved interval:", result.error);
		}
	} catch (error) {
		console.error("Error loading saved interval:", error);
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

function showToast(message, type = "info") {
	let background;
	switch (type) {
		case "success":
			background = "linear-gradient(to right, #00b09b, #96c93d)";
			break;
		case "error":
			background = "linear-gradient(to right, #ff5f6d, #ffc371)";
			break;
		case "warning":
			background = "linear-gradient(to right, #f2994a, #f2c94c)";
			break;
		default:
			background = "linear-gradient(to right, #00b4db, #0083b0)";
	}

	Toastify({
		text: message,
		duration: 3000,
		close: true,
		gravity: "top",
		position: "center",
		style: { background: background },
		stopOnFocus: true,
	}).showToast();
}

function updateConsoleOutput() {
	const consoleOutput = document.getElementById("consoleOutput");
	consoleOutput.textContent = consoleLines.join("\n");
	consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// Override console.log to update the in-app console
const originalConsoleLog = console.log;
console.log = function () {
	originalConsoleLog.apply(console, arguments);
	const logMessage = Array.from(arguments).join(" ");
	consoleLines.push(logMessage);
	if (consoleLines.length > 200) {
		consoleLines.shift();
	}
	updateConsoleOutput();
};

// Tab functionality
document.querySelectorAll(".tab-button").forEach((button) => {
	button.addEventListener("click", () => {
		const tabName = button.getAttribute("data-tab");
		openTab(tabName);
	});
});

function openTab(tabName) {
	const tabContents = document.querySelectorAll(".tab-content");
	const tabButtons = document.querySelectorAll(".tab-button");

	tabContents.forEach((tab) => {
		tab.style.display = "none";
	});

	tabButtons.forEach((button) => {
		button.classList.remove("active");
	});

	document.getElementById(`${tabName}-tab`).style.display = "block";
	document
		.querySelector(`.tab-button[data-tab="${tabName}"]`)
		.classList.add("active");
}

ipcRenderer.on("unassign-webhooks-result", (event, result) => {
	if (result.success) {
		result.unassignedWebhooks.forEach((webhook) => {
			showToast(
				`${webhook.name} webhook was unassigned from ${result.modItem.name}`,
				"success"
			);
		});
	} else {
		showToast(`Failed to unassign webhooks: ${result.error}`, "error");
	}
});

async function checkForUpdates() {
	ipcRenderer.send("check-updates");
	await updateModList();
	await updateWebhookList();
}
