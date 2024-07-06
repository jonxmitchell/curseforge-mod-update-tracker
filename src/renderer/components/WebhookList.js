const { ipcRenderer } = require("electron");
const { showToast } = require("../utils/toast");
const { updateWebhookDropdowns } = require("./ModList");

function renderWebhookList(webhooks) {
	const webhookList = document.getElementById("webhookList");
	webhookList.innerHTML = "";
	webhooks.forEach((webhook) => {
		const webhookElement = document.createElement("div");
		webhookElement.className = "bg-lighter-black p-4 rounded mb-4";
		const truncatedUrl =
			webhook.url.length > 60
				? webhook.url.substring(0, 60) + "..."
				: webhook.url;
		webhookElement.innerHTML = `
            <div class="flex justify-between items-center">
                <div class="space-y-1 flex-grow pr-4">
                    <span class="font-bold text-lg">${webhook.name}</span>
                    <div class="text-gray-400 break-all webhook-url">${truncatedUrl}</div>
                </div>
                <div class="flex space-x-2">
                    <button class="icon-button show-full-webhook">
                        <i class="fas fa-expand-alt"></i>
                    </button>
                    <button class="icon-button test-webhook">
                        <i class="fas fa-vial"></i>
                    </button>
                    <button class="icon-button delete-webhook" data-webhook-id="${webhook.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
		webhookList.appendChild(webhookElement);

		const showFullWebhookButton =
			webhookElement.querySelector(".show-full-webhook");
		showFullWebhookButton.addEventListener("click", () => {
			const webhookUrlElement = webhookElement.querySelector(".webhook-url");
			if (webhookUrlElement.textContent === truncatedUrl) {
				webhookUrlElement.textContent = webhook.url;
				showFullWebhookButton.innerHTML = '<i class="fas fa-compress-alt"></i>';
			} else {
				webhookUrlElement.textContent = truncatedUrl;
				showFullWebhookButton.innerHTML = '<i class="fas fa-expand-alt"></i>';
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
				updateWebhookDropdowns(result.webhooks);
				resolve(result.webhooks);
			} else {
				showToast(`Failed to get webhooks: ${result.error}`, "error");
				reject(new Error(result.error));
			}
		});
	});
}

// Add this function to handle adding a new webhook
function addWebhook(name, url) {
	return new Promise((resolve, reject) => {
		ipcRenderer.send("add-webhook", { name, url });
		ipcRenderer.once("add-webhook-result", (event, result) => {
			if (result.success) {
				updateWebhookList().then(resolve).catch(reject);
			} else {
				showToast(`Failed to add webhook: ${result.error}`, "error");
				reject(new Error(result.error));
			}
		});
	});
}

module.exports = {
	renderWebhookList,
	updateWebhookList,
	addWebhook,
};
