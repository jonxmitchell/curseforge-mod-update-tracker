const { ipcRenderer } = require("electron");

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
		const modList = document.getElementById("modList");
		modList.innerHTML = "";
		result.mods.forEach((mod) => {
			const modElement = document.createElement("div");
			modElement.className = "mod-item";
			modElement.innerHTML = `
        <span class="mod-name">${mod.name}</span>
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
	} else {
		alert(`Failed to get mods: ${result.error}`);
	}
});

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

let countdownInterval;
function startCountdown(duration) {
	let timer = duration;
	countdownInterval = setInterval(() => {
		const hours = parseInt(timer / 3600, 10);
		const minutes = parseInt((timer % 3600) / 60, 10);
		const seconds = parseInt(timer % 60, 10);

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
			startCountdown(10); // Restart countdown for 1 hour
		}
	}, 1000);
}

startCountdown(10); // Start initial countdown for 1 hour

updateModList(); // Initial mod list update
updateWebhookList(); // Initial webhook list update
