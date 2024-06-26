const { ipcRenderer } = require("electron");
const Toastify = require("toastify-js");

let updatedMods = new Set();
let allMods = [];
let countdownInterval;
let timer = 3600; // Default to 1 hour
let isPaused = false;
let currentInterval = 3600;

document.getElementById("addModButton").addEventListener("click", () => {
	const modIdInput = document.getElementById("modSearchInput");
	const modId = modIdInput.value;
	ipcRenderer.send("add-mod", modId);
	modIdInput.value = ""; // Clear the input after adding
});

document.getElementById("checkUpdatesButton").addEventListener("click", () => {
	ipcRenderer.send("check-updates");
});

document.getElementById("addWebhookButton").addEventListener("click", () => {
	const webhookUrl = document.getElementById("webhookInput").value;
	ipcRenderer.send("add-webhook", webhookUrl);
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
	} else {
		showToast(`Failed to get mods: ${result.error}`, "error");
	}
});

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
      <span class="mod-name">${mod.name} (ID: ${mod.mod_id})</span>
      <span class="mod-version">Version: ${mod.current_version}</span>
      <span class="mod-updated">Last Updated: ${new Date(
				mod.last_updated
			).toLocaleString()}</span>
      <a href="https://www.curseforge.com/minecraft/mc-mods/${
				mod.mod_id
			}" target="_blank" class="mod-link">🔗</a>
      <button class="delete-mod" data-mod-id="${mod.mod_id}">🗑️</button>
    `;
		modList.appendChild(modElement);
	});

	document.querySelectorAll(".delete-mod").forEach((button) => {
		button.addEventListener("click", (e) => {
			const modId = e.target.getAttribute("data-mod-id");
			ipcRenderer.send("delete-mod", modId);
		});
	});
}

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
			webhookElement.innerHTML = `
        <span class="webhook-url">${webhook.url}</span>
        <button class="delete-webhook" data-webhook-id="${webhook.id}">🗑️</button>
      `;
			webhookList.appendChild(webhookElement);
		});

		document.querySelectorAll(".delete-webhook").forEach((button) => {
			button.addEventListener("click", (e) => {
				const webhookId = e.target.getAttribute("data-webhook-id");
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
