const { ipcRenderer } = require("electron");
const Toastify = require("toastify-js");

let updatedMods = new Set();
let allMods = [];
let countdownInterval;
let timer = 3600; // Default to 1 hour
let isPaused = false;
let currentInterval = 3600;
let consoleLines = [];

document.getElementById("addModButton").addEventListener("click", () => {
	const modIdInput = document.getElementById("modSearchInput");
	const modId = modIdInput.value.trim();
	if (modId) {
		ipcRenderer.send("add-mod", modId);
		modIdInput.value = ""; // Clear the input after adding
	} else {
		showToast("Please enter a mod ID", "error");
	}
});

document.getElementById("checkUpdatesButton").addEventListener("click", () => {
	ipcRenderer.send("check-updates");
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

	// Only allow positive integers
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
			clearInterval(countdownInterval);
			startCountdown(currentInterval);
			try {
				await ipcRenderer.invoke("save-interval", currentInterval);
				showToast("Update interval set successfully", "success");
			} catch (error) {
				console.error("Failed to save interval:", error);
				showToast("Failed to save interval", "error");
			}
		}
	});

document.getElementById("pauseResumeButton").addEventListener("click", () => {
	const button = document.getElementById("pauseResumeButton");
	if (isPaused) {
		startCountdown(timer);
		button.textContent = "Pause";
		isPaused = false;
	} else {
		clearInterval(countdownInterval);
		button.textContent = "Resume";
		isPaused = true;
	}
});

document.getElementById("clearConsoleButton").addEventListener("click", () => {
	consoleLines = [];
	updateConsoleOutput();
	showToast("Console cleared", "info");
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
		`Mod update received: ${mod.name} from ${mod.oldVersion} to ${mod.newVersion}`
	);
	showToast(
		`Mod ${mod.name} updated from version ${mod.oldVersion} to ${mod.newVersion}`,
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

function updateModList() {
	ipcRenderer.send("get-mods");
}

ipcRenderer.on("get-mods-result", (event, result) => {
	if (result.success) {
		allMods = result.mods;
		renderModList(allMods);
		updateModCount(allMods.length);
	} else {
		showToast(`Failed to get mods: ${result.error}`, "error");
	}
});

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
        <span class="mod-version">Version: ${mod.current_version}</span>
        <span class="mod-updated">Last Updated: ${new Date(
					mod.last_updated
				).toLocaleString()}</span>
      </div>
      <div class="mod-actions">
        <select class="webhook-select" data-mod-id="${mod.mod_id}">
          <option value="">Select Webhook</option>
        </select>
        <a href="https://www.curseforge.com/minecraft/mc-mods/${
					mod.mod_id
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

	updateWebhookSelects();
}

function updateWebhookSelects() {
	ipcRenderer.send("get-webhooks");
}

ipcRenderer.on("get-webhooks-result", (event, result) => {
	if (result.success) {
		const webhooks = result.webhooks;
		document.querySelectorAll(".webhook-select").forEach((select) => {
			const modId = select.getAttribute("data-mod-id");
			select.innerHTML = '<option value="">Select Webhook</option>';
			webhooks.forEach((webhook) => {
				const option = document.createElement("option");
				option.value = webhook.id;
				option.textContent = webhook.name;
				select.appendChild(option);
			});
			// Set the selected webhook if any
			const mod = allMods.find((m) => m.mod_id === modId);
			if (mod && mod.webhook_id) {
				select.value = mod.webhook_id;
			}
		});

		document.querySelectorAll(".webhook-select").forEach((select) => {
			select.addEventListener("change", (e) => {
				const modId = e.target.getAttribute("data-mod-id");
				const webhookId = e.target.value;
				ipcRenderer.send("assign-webhook", { modId, webhookId });
			});
		});
	} else {
		showToast(`Failed to get webhooks: ${result.error}`, "error");
	}
});

ipcRenderer.on("delete-mod-result", (event, result) => {
	if (result.success) {
		showToast("Mod deleted successfully", "success");
		updateModList();
	} else {
		showToast(`Failed to delete mod: ${result.error}`, "error");
	}
});

function updateWebhookList() {
	ipcRenderer.send("get-webhooks");
}

ipcRenderer.on("get-webhooks-result", (event, result) => {
	if (result.success) {
		const webhookList = document.getElementById("webhookList");
		webhookList.innerHTML = "";
		result.webhooks.forEach((webhook) => {
			const webhookElement = document.createElement("div");
			webhookElement.className = "webhook-item";
			const truncatedUrl =
				webhook.url.length > 60
					? webhook.url.substring(0, 60) + "..."
					: webhook.url;
			webhookElement.innerHTML = `
        <div class="webhook-info">
          <span class="webhook-name">${webhook.name}</span>
        </div>
        <div class="webhook-url">${truncatedUrl}</div>
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
		});

		document.querySelectorAll(".delete-webhook").forEach((button) => {
			button.addEventListener("click", (e) => {
				const webhookId = e.target
					.closest(".delete-webhook")
					.getAttribute("data-webhook-id");
				ipcRenderer.send("delete-webhook", webhookId);
			});
		});
	} else {
		showToast(`Failed to get webhooks: ${result.error}`, "error");
	}
});

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

function startCountdown(duration) {
	clearInterval(countdownInterval);
	timer = duration;
	currentInterval = duration;
	countdownInterval = setInterval(() => {
		const hours = Math.floor(timer / 3600);
		const minutes = Math.floor((timer % 3600) / 60);
		const seconds = timer % 60;

		document.getElementById("hours").textContent = hours
			.toString()
			.padStart(2, "0");
		document.getElementById("minutes").textContent = minutes
			.toString()
			.padStart(2, "0");
		document.getElementById("seconds").textContent = seconds
			.toString()
			.padStart(2, "0");

		if (--timer < 0) {
			clearInterval(countdownInterval);
			ipcRenderer.send("check-updates");
			startCountdown(currentInterval); // Restart countdown with the current interval
		}
	}, 1000);
}

async function loadSavedInterval() {
	try {
		const result = await ipcRenderer.invoke("get-interval");
		if (result.success) {
			currentInterval = result.interval;
			intervalSlider.value = Math.min(currentInterval, 3600);
			intervalInput.value = currentInterval;
			startCountdown(currentInterval);
		} else {
			console.error("Failed to load saved interval:", result.error);
		}
	} catch (error) {
		console.error("Error loading saved interval:", error);
	}
}

function showToast(message, type = "info") {
	let backgroundColor;
	switch (type) {
		case "success":
			backgroundColor = "linear-gradient(to right, #00b09b, #96c93d)";
			break;
		case "error":
			backgroundColor = "linear-gradient(to right, #ff5f6d, #ffc371)";
			break;
		case "warning":
			backgroundColor = "linear-gradient(to right, #f2994a, #f2c94c)";
			break;
		default:
			backgroundColor = "linear-gradient(to right, #00b4db, #0083b0)";
	}

	Toastify({
		text: message,
		duration: 3000,
		close: true,
		gravity: "top",
		position: "center",
		backgroundColor: backgroundColor,
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

// Initialize the application
loadSavedInterval();
updateModList();
updateWebhookList();
openTab("mods"); // Open the mods tab by default

// Log a message to test the console
console.log("Application initialized");
