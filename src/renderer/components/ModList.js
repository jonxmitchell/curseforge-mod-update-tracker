const { ipcRenderer } = require("electron");
const { showToast } = require("../utils/toast");
const { updateModCount } = require("../utils/domUtils");

function renderModList(mods) {
	const modList = document.getElementById("modList");
	modList.innerHTML = "";
	mods.forEach((mod) => {
		const modElement = document.createElement("div");
		modElement.className = "bg-lighter-black p-4 rounded mb-4";
		modElement.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <div class="space-y-1">
                    <span class="font-bold text-lg">${mod.name} (ID: ${
			mod.mod_id
		})</span>
                    <span class="text-gray-400 block">Game: ${mod.game}</span>
                    <span class="text-gray-400 block">Last Updated: ${new Date(
											mod.last_checked_released
										).toLocaleString()}</span>
                </div>
                <div class="flex items-center space-x-2">
                    <a href="${
											mod.website_url
										}" target="_blank" class="icon-button">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                    <button class="icon-button delete-mod" data-mod-id="${
											mod.mod_id
										}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="custom-select relative w-full" data-mod-id="${
							mod.mod_id
						}">
                <button id="dropdownSearchButton-${
									mod.mod_id
								}" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full justify-between" type="button">
                    <span class="selected-webhooks flex flex-wrap gap-2"></span>
                    <svg class="w-2.5 h-2.5 ms-3 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                    </svg>
                </button>
                <div id="dropdownSearch-${
									mod.mod_id
								}" class="z-10 hidden bg-white rounded-lg shadow w-full dark:bg-gray-700 absolute left-0 mt-2">
                    <div class="p-3">
                        <label for="input-group-search-${
													mod.mod_id
												}" class="sr-only">Search</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="text" id="input-group-search-${
															mod.mod_id
														}" class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search webhook">
                        </div>
                    </div>
                    <ul class="px-3 pb-3 text-sm text-gray-700 dark:text-gray-200 webhook-list" aria-labelledby="dropdownSearchButton-${
											mod.mod_id
										}">
                        <!-- Webhook checkboxes will be dynamically inserted here -->
                    </ul>
                </div>
            </div>
        `;
		modList.appendChild(modElement);
	});

	document.querySelectorAll(".delete-mod").forEach((button) => {
		button.addEventListener("click", (e) => {
			const modId = e.target.closest(".delete-mod").getAttribute("data-mod-id");
			ipcRenderer.send("delete-mod", modId);
		});
	});

	initializeWebhookSelects();
}

function initializeWebhookSelects() {
	const customSelects = document.querySelectorAll(".custom-select");
	customSelects.forEach((select) => {
		const modId = select.getAttribute("data-mod-id");
		const dropdownButton = select.querySelector(
			`#dropdownSearchButton-${modId}`
		);
		const dropdownMenu = select.querySelector(`#dropdownSearch-${modId}`);
		const searchInput = select.querySelector(`#input-group-search-${modId}`);

		dropdownButton.addEventListener("click", (e) => {
			e.stopPropagation();
			toggleDropdown(dropdownMenu);
		});

		searchInput.addEventListener("click", (e) => {
			e.stopPropagation();
		});

		searchInput.addEventListener("input", (e) => {
			const searchTerm = e.target.value.toLowerCase();
			const checkboxes = select.querySelectorAll("li");
			checkboxes.forEach((item) => {
				const label = item.querySelector("label");
				if (label.textContent.toLowerCase().includes(searchTerm)) {
					item.style.display = "";
				} else {
					item.style.display = "none";
				}
			});
		});
	});

	document.addEventListener("click", (e) => {
		if (!e.target.closest(".custom-select")) {
			closeAllDropdowns();
		}
	});

	updateWebhookDropdowns();
}

function toggleDropdown(dropdownMenu) {
	const isHidden = dropdownMenu.classList.contains("hidden");
	closeAllDropdowns();
	if (isHidden) {
		dropdownMenu.classList.remove("hidden");
	}
}

function closeAllDropdowns() {
	document.querySelectorAll(".custom-select").forEach((select) => {
		const dropdownMenu = select.querySelector('[id^="dropdownSearch-"]');
		dropdownMenu.classList.add("hidden");
	});
}

async function updateWebhookDropdowns() {
	try {
		const webhooks = await ipcRenderer.invoke("get-webhooks");
		document.querySelectorAll(".custom-select").forEach(async (select) => {
			const modId = select.getAttribute("data-mod-id");
			const webhookList = select.querySelector(".webhook-list");
			webhookList.innerHTML = "";

			webhooks.forEach((webhook) => {
				const listItem = document.createElement("li");
				listItem.innerHTML = `
                    <div class="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        <input id="${modId}-${webhook.id}" type="checkbox" value="${webhook.id}" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                        <label for="${modId}-${webhook.id}" class="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">${webhook.name}</label>
                    </div>
                `;
				const checkbox = listItem.querySelector('input[type="checkbox"]');
				checkbox.addEventListener("change", handleWebhookChange);
				webhookList.appendChild(listItem);
			});

			const assignedWebhooks = await ipcRenderer.invoke(
				"get-mod-webhooks",
				modId
			);
			webhookList
				.querySelectorAll('input[type="checkbox"]')
				.forEach((checkbox) => {
					if (assignedWebhooks.includes(parseInt(checkbox.value))) {
						checkbox.checked = true;
					}
				});

			updateSelectedText(select);
			updateDropdownHeight(webhookList);
		});
	} catch (error) {
		showToast(`Error updating webhook dropdowns: ${error.message}`, "error");
	}
}

function updateDropdownHeight(webhookList) {
	const webhookItems = webhookList.querySelectorAll("li");
	const itemHeight = 40; // Approximate height of each item in pixels
	const maxHeight = 200; // Maximum height before scrolling

	if (webhookItems.length >= 4) {
		webhookList.style.maxHeight = `${maxHeight}px`;
		webhookList.style.overflowY = "auto";
	} else {
		webhookList.style.height = `${webhookItems.length * itemHeight}px`;
		webhookList.style.overflowY = "visible";
	}
}

async function handleWebhookChange(event) {
	event.stopPropagation();
	const checkbox = event.target;
	const modId = checkbox.closest(".custom-select").getAttribute("data-mod-id");
	const select = checkbox.closest(".custom-select");
	const webhookIds = Array.from(
		select.querySelectorAll('input[type="checkbox"]:checked'),
		(checkbox) => parseInt(checkbox.value)
	);
	const webhookName = checkbox.nextElementSibling.textContent.trim();
	const isChecked = checkbox.checked;

	try {
		const result = await ipcRenderer.invoke("assign-webhooks", {
			modId,
			webhookIds,
		});
		if (result.success) {
			updateSelectedText(select);
			if (isChecked) {
				showToast(
					`Webhook "${webhookName}" was assigned to mod ${modId}`,
					"success"
				);
			} else {
				showToast(
					`Webhook "${webhookName}" was unassigned from mod ${modId}`,
					"info"
				);
			}
		} else {
			showToast(`Failed to update webhooks: ${result.error}`, "error");
		}
	} catch (error) {
		showToast(`Error updating webhooks: ${error.message}`, "error");
	}
}

function updateSelectedText(select) {
	const selectedWebhooks = Array.from(
		select.querySelectorAll('input[type="checkbox"]:checked'),
		(checkbox) => checkbox.nextElementSibling.textContent.trim()
	);
	const dropdownButton = select.querySelector('[id^="dropdownSearchButton-"]');
	const selectedWebhooksContainer =
		dropdownButton.querySelector(".selected-webhooks");
	selectedWebhooksContainer.innerHTML = "";

	if (selectedWebhooks.length > 0) {
		selectedWebhooks.forEach((webhookName) => {
			const bubble = document.createElement("span");
			bubble.className =
				"bg-blue-500 text-white text-xs px-2 py-1 rounded-full";
			bubble.textContent = webhookName;
			selectedWebhooksContainer.appendChild(bubble);
		});
	} else {
		dropdownButton.querySelector(".selected-webhooks").textContent =
			"Select Webhooks";
	}
}

module.exports = {
	renderModList,
	initializeWebhookSelects,
	handleWebhookChange,
	updateSelectedText,
	updateWebhookDropdowns,
};
