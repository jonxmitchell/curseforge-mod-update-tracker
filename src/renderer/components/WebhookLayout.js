const { ipcRenderer } = require("electron");
const { showToast } = require("../utils/toast");

function initializeWebhookLayout() {
	const saveButton = document.getElementById("saveWebhookLayout");
	saveButton.addEventListener("click", saveWebhookLayout);

	loadWebhookLayout();
}

async function saveWebhookLayout() {
	const layout = {
		webhookText: document.getElementById("webhookText").value,
		embedTitle: document.getElementById("embedTitle").value,
		embedText: document.getElementById("embedText").value,
		showDate: document.getElementById("showDate").checked,
		showImage: document.getElementById("showImage").checked,
	};

	try {
		await ipcRenderer.invoke("save-webhook-layout", layout);
		showToast("Webhook layout saved successfully", "success");
	} catch (error) {
		showToast(`Failed to save webhook layout: ${error.message}`, "error");
	}
}

async function loadWebhookLayout() {
	try {
		const result = await ipcRenderer.invoke("get-webhook-layout");
		if (result.success) {
			const layout = result.layout;
			document.getElementById("webhookText").value = layout.webhookText || "";
			document.getElementById("embedTitle").value = layout.embedTitle || "";
			document.getElementById("embedText").value = layout.embedText || "";
			document.getElementById("showDate").checked = layout.showDate || false;
			document.getElementById("showImage").checked = layout.showImage || false;
		} else {
			showToast(`Failed to load webhook layout: ${result.error}`, "error");
		}
	} catch (error) {
		showToast(`Failed to load webhook layout: ${error.message}`, "error");
	}
}

module.exports = {
	initializeWebhookLayout,
};
