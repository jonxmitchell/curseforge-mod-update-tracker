const { ipcRenderer } = require("electron");
const { showToast } = require("../utils/toast");
const { updateWebhookDropdowns } = require("./ModList");
const {
	shouldShowTooltips,
	showTooltip,
	hideTooltip,
} = require("../utils/tooltipManager");

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
                    <button class="icon-button show-full-webhook" data-tooltip="Show/Hide full URL">
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4H4m0 0v4m0-4 5 5m7-5h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5m7 5h4m0 0v-4m0 4-5-5"/>
                    </svg>
                    </button>
                    <button class="icon-button test-webhook" data-tooltip="Test webhook">
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4a4 4 0 0 1 4 4v6M5 4a4 4 0 0 0-4 4v6h8M5 4h9M9 14h10V8a3.999 3.999 0 0 0-4-4h-2m4 0v3m3 0v3m-6 4v3"/>
                        </svg>
                    </button>
                    <button class="icon-button rename-webhook" data-webhook-id="${webhook.id}" data-webhook-name="${webhook.name}" data-tooltip="Rename webhook">
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6h9m-9-3h9m1.5-12.573-6.573 6.573M21 3l-6.573 6.573"/>
                        </svg>
                    </button>
                    <button class="icon-button delete-webhook" data-webhook-id="${webhook.id}" data-tooltip="Delete webhook">
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
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15h4m0 0v4m0-4-5 5m15-5h-4m0 0v4m0-4 5 5M5 9h4m0 0V5m0 4L4 4m15 5h-4m0 0V5m0 4 5-5"/>
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

		const renameWebhookButton = webhookElement.querySelector(".rename-webhook");
		renameWebhookButton.addEventListener("click", () => {
			const modal = document.getElementById("renameWebhookModal");
			const currentWebhookName = document.getElementById("currentWebhookName");
			const webhookNameInput = document.getElementById("newWebhookName");
			const webhookIdInput = document.getElementById("webhookIdInput");

			currentWebhookName.textContent = webhook.name;
			webhookNameInput.value = "";
			webhookIdInput.value = webhook.id;

			modal.classList.remove("hidden");
		});
	});

	initializeTooltips();
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
				reject(new Error(result.error));
			}
		});
	});
}

function addWebhook(name, url) {
	return new Promise((resolve, reject) => {
		if (!isValidDiscordWebhookUrl(url)) {
			showToast(
				"Invalid Discord webhook URL. Please enter a valid URL.",
				"error"
			);
			setInvalidWebhookInputStyle();
			reject(new Error("Invalid Discord webhook URL"));
			return;
		}

		ipcRenderer.send("add-webhook", { name, url });
		ipcRenderer.once("add-webhook-result", (event, result) => {
			if (result.success) {
				updateWebhookList().then(resolve).catch(reject);
				resetWebhookInputStyle();
			} else {
				reject(new Error(result.error));
			}
		});
	});
}

function renameWebhook(id, newName) {
	return new Promise((resolve, reject) => {
		ipcRenderer
			.invoke("rename-webhook", { id, newName })
			.then((result) => {
				if (result.success) {
					updateWebhookList().then(resolve).catch(reject);
				} else {
					reject(new Error(result.error));
				}
			})
			.catch(reject);
	});
}

function initializeTooltips() {
	if (shouldShowTooltips()) {
		document.querySelectorAll("[data-tooltip]").forEach((element) => {
			element.addEventListener("mouseenter", showTooltip);
			element.addEventListener("mouseleave", hideTooltip);
		});
	}
}

function isValidDiscordWebhookUrl(url) {
	const discordWebhookRegex =
		/^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/;
	return discordWebhookRegex.test(url);
}

function setInvalidWebhookInputStyle() {
	const webhookInput = document.getElementById("webhookInput");
	const webhookInputLabel = document.querySelector('label[for="webhookInput"]');

	webhookInput.classList.remove(
		"border-gray-300",
		"dark:border-gray-600",
		"focus:border-blue-600",
		"dark:focus:border-blue-500"
	);
	webhookInput.classList.add(
		"border-red-600",
		"dark:border-red-500",
		"focus:border-red-600",
		"dark:focus:border-red-500"
	);

	webhookInputLabel.classList.remove(
		"text-gray-500",
		"dark:text-gray-400",
		"peer-focus:text-blue-600",
		"peer-focus:dark:text-blue-500"
	);
	webhookInputLabel.classList.add("text-red-600", "dark:text-red-500");
}

function resetWebhookInputStyle() {
	const webhookInput = document.getElementById("webhookInput");
	const webhookInputLabel = document.querySelector('label[for="webhookInput"]');

	webhookInput.classList.remove(
		"border-red-600",
		"dark:border-red-500",
		"focus:border-red-600",
		"dark:focus:border-red-500"
	);
	webhookInput.classList.add(
		"border-gray-300",
		"dark:border-gray-600",
		"focus:border-blue-600",
		"dark:focus:border-blue-500"
	);

	webhookInputLabel.classList.remove("text-red-600", "dark:text-red-500");
	webhookInputLabel.classList.add(
		"text-gray-500",
		"dark:text-gray-400",
		"peer-focus:text-blue-600",
		"peer-focus:dark:text-blue-500"
	);
}

module.exports = {
	renderWebhookList,
	updateWebhookList,
	addWebhook,
	renameWebhook,
	initializeTooltips,
	setInvalidWebhookInputStyle,
	resetWebhookInputStyle,
	isValidDiscordWebhookUrl,
};
