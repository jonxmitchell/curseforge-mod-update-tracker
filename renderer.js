const { ipcRenderer } = require("electron");

let updatedMods = new Set();
let allMods = [];
let countdownInterval;
let timer = 3600; // Default to 1 hour
let isPaused = false;

document.getElementById("addModButton").addEventListener("click", () => {
	const modId = document.getElementById("modSearchInput").value;
	ipcRenderer.send("add-mod", modId);
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

document.getElementById("setIntervalButton").addEventListener("click", () => {
	const intervalInput = document.getElementById("intervalInput");
	const newInterval = parseInt(intervalInput.value, 10);
	if (newInterval > 0) {
		timer = newInterval;
		clearInterval(countdownInterval);
		startCountdown(timer);
		intervalInput.value = "";
	} else {
		alert("Please enter a valid positive number for the interval.");
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
		updateModList();
	} else {
		alert(`Failed to add mod: ${result.error}`);
	}
});

ipcRenderer.on("mod-updated", (event, mod) => {
	console.log(
		`Mod update received: ${mod.name} from ${mod.oldVersion} to ${mod.newVersion}`
	);
	alert(
		`Mod ${mod.name} updated from version ${mod.oldVersion} to ${mod.newVersion}`
	);
	updatedMods.add(mod.id);
	updateModList();
	// Remove the "No updates" message when an update is detected
	const statusElement = document.getElementById("updateStatus");
	if (statusElement) {
		statusElement.textContent = "";
	}
});

ipcRenderer.on("update-check-complete", () => {
	updatedMods.clear();
	updateModList();
});

ipcRenderer.on("no-updates", (event, data) => {
	const statusElement = document.getElementById("updateStatus");
	if (statusElement) {
		statusElement.textContent = data.message;
	} else {
		const newStatusElement = document.createElement("div");
		newStatusElement.id = "updateStatus";
		newStatusElement.textContent = data.message;
		document.body.appendChild(newStatusElement);
	}
});

ipcRenderer.on("add-webhook-result", (event, result) => {
	if (result.success) {
		alert("Webhook added successfully");
		updateWebhookList();
	} else {
		alert(`Failed to add webhook: ${result.error}`);
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
		alert(`Failed to get mods: ${result.error}`);
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
		updateModList();
	} else {
		alert(`Failed to delete mod: ${result.error}`);
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
		alert(`Failed to get webhooks: ${result.error}`);
	}
});

ipcRenderer.on("delete-webhook-result", (event, result) => {
	if (result.success) {
		updateWebhookList();
	} else {
		alert(`Failed to delete webhook: ${result.error}`);
	}
});

function startCountdown(duration) {
	clearInterval(countdownInterval);
	timer = duration;
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
			startCountdown(duration); // Restart countdown with the same duration
		}
	}, 1000);
}

startCountdown(300); // Start initial countdown for 1 hour

updateModList(); // Initial mod list update
updateWebhookList(); // Initial webhook list update
