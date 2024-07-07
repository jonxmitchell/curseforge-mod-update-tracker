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
                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13.407V6.593a.5.5 0 0 0-.854-.353L9.6 10l4.546 3.76A.5.5 0 0 0 15 13.407Zm-5 0V6.593a.5.5 0 0 0-.854-.353L4.6 10l4.546 3.76A.5.5 0 0 0 10 13.407Z"/>
                        </svg>
                    </button>
                    <button class="icon-button test-webhook">
                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4a4 4 0 0 1 4 4v6M5 4a4 4 0 0 0-4 4v6h8M5 4h9M9 14h10V8a3.999 3.999 0 0 0-4-4h-2m4 0v3m3 0v3m-6 4v3"/>
                        </svg>
                    </button>
                    <button class="icon-button delete-webhook" data-webhook-id="${webhook.id}">
                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
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
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13.407V6.593a.5.5 0 0 1 .854-.353L10.4 10l-4.546 3.76A.5.5 0 0 1 5 13.407Zm5 0V6.593a.5.5 0 0 1 .854-.353L15.4 10l-4.546 3.76A.5.5 0 0 1 10 13.407Z"/>
                    </svg>
                `;
			} else {
				webhookUrlElement.textContent = truncatedUrl;
				showFullWebhookButton.innerHTML = `
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13.407V6.593a.5.5 0 0 0-.854-.353L9.6 10l4.546 3.76A.5.5 0 0 0 15 13.407Zm-5 0V6.593a.5.5 0 0 0-.854-.353L4.6 10l4.546 3.76A.5.5 0 0 0 10 13.407Z"/>
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
