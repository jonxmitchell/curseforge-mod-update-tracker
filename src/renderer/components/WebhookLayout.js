const { ipcRenderer } = require("electron");
const { showToast } = require("../utils/toast");

function initializeWebhookLayout() {
	const saveButton = document.getElementById("saveWebhookLayout");
	saveButton.addEventListener("click", saveWebhookLayout);

	const embedColorPicker = document.getElementById("embedColorPicker");
	const embedColor = document.getElementById("embedColor");
	const colorPreview = document.getElementById("colorPreview");

	embedColorPicker.addEventListener("input", (event) => {
		const color = event.target.value;
		colorPreview.style.backgroundColor = color;
		embedColor.value = color;
	});

	embedColor.addEventListener("input", (event) => {
		const color = event.target.value;
		if (/^#[0-9A-F]{6}$/i.test(color)) {
			colorPreview.style.backgroundColor = color;
			embedColorPicker.value = color;
		}
	});

	loadWebhookLayout();
}

async function saveWebhookLayout() {
	const layout = {
		webhookText: document.getElementById("webhookText").value,
		embedTitle: document.getElementById("embedTitle").value,
		embedText: document.getElementById("embedText").value,
		showDate: document.getElementById("showDate").checked,
		showImage: document.getElementById("showImage").checked,
		embedColor: document.getElementById("embedColor").value,
		footerText: document.getElementById("footerText").value,
		footerIcon: document.getElementById("footerIcon").value,
		authorName: document.getElementById("authorName").value,
		authorIcon: document.getElementById("authorIcon").value,
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
		if (result.success && result.layout) {
			const layout = result.layout;
			document.getElementById("webhookText").value = layout.webhookText || "";
			document.getElementById("embedTitle").value = layout.embedTitle || "";
			document.getElementById("embedText").value = layout.embedText || "";
			document.getElementById("showDate").checked = layout.showDate || false;
			document.getElementById("showImage").checked = layout.showImage || false;
			document.getElementById("embedColor").value =
				layout.embedColor || "#03EAF7";
			document.getElementById("embedColorPicker").value =
				layout.embedColor || "#03EAF7";
			document.getElementById("colorPreview").style.backgroundColor =
				layout.embedColor || "#03EAF7";
			document.getElementById("footerText").value = layout.footerText || "";
			document.getElementById("footerIcon").value = layout.footerIcon || "";
			document.getElementById("authorName").value = layout.authorName || "";
			document.getElementById("authorIcon").value = layout.authorIcon || "";
		}
	} catch (error) {
		showToast(`Failed to load webhook layout: ${error.message}`, "error");
	}
}

module.exports = {
	initializeWebhookLayout,
};
