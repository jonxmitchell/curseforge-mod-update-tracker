const { ipcRenderer } = require("electron");
const { showToast } = require("../utils/toast");

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

function updateWebhookList() {
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

module.exports = {
	renderWebhookList,
	updateWebhookList,
};
