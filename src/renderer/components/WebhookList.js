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
                <div class="space-y-1 flex-grow pr-8">
                    <span class="font-bold text-lg">${webhook.name}</span>
                    <div class="text-gray-400 break-all webhook-url">${truncatedUrl}</div>
                </div>
                <div class="flex space-x-3">
                    <button class="icon-button show-full-webhook">
<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4H4m0 0v4m0-4 5 5m7-5h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5m7 5h4m0 0v-4m0 4-5-5"/>
                    </svg>
                    </button>
                    <button class="icon-button test-webhook">
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4a4 4 0 0 1 4 4v6M5 4a4 4 0 0 0-4 4v6h8M5 4h9M9 14h10V8a3.999 3.999 0 0 0-4-4h-2m4 0v3m3 0v3m-6 4v3"/>
                        </svg>
                    </button>
                    <button class="icon-button delete-webhook" data-webhook-id="${webhook.id}">
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"/>
                        </svg>
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
				showFullWebhookButton.innerHTML = `
					<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h4V4m12 4h-4V4M4 16h4v4m12-4h-4v4"/>
                    </svg>
                `;
			} else {
				webhookUrlElement.textContent = truncatedUrl;
				showFullWebhookButton.innerHTML = `
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4H4m0 0v4m0-4 5 5m7-5h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5m7 5h4m0 0v-4m0 4-5-5"/>
                    </svg>
                `;
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
