// src/renderer/components/ModList.js

const { ipcRenderer, shell } = require("electron");
const { showToast } = require("../utils/toast");
const { updateModCount } = require("../utils/domUtils");
const {
	shouldShowTooltips,
	showTooltip,
	hideTooltip,
} = require("../utils/tooltipManager");

async function openModLink(url) {
	try {
		const result = await ipcRenderer.invoke("get-open-link-preference");
		if (result.success) {
			if (result.preference === "inBrowser") {
				shell.openExternal(url);
			} else {
				// Open in-app
				ipcRenderer.send("open-in-app", url);
			}
		} else {
			console.error("Failed to get open link preference:", result.error);
		}
	} catch (error) {
		console.error("Error opening mod link:", error);
	}
}

function renderModList(mods) {
	const modList = document.getElementById("modList");
	modList.innerHTML = "";
	mods.forEach((mod, index) => {
		const modElement = document.createElement("div");
		modElement.className =
			"mod-item bg-lighter-black p-4 rounded mb-4 opacity-0";
		modElement.style.transitionDelay = `${index * 50}ms`;
		modElement.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <div class="space-y-1 pr-8">
                    <span class="font-bold text-lg">${mod.name} (ID: ${
			mod.mod_id
		})</span>
                    <span class="text-gray-400 block">Game: ${mod.game}</span>
                    <span class="text-gray-400 block">Last Updated: ${new Date(
											mod.last_checked_released
										).toLocaleString()}</span>
                </div>
                <div class="flex items-center space-x-3">
                    <button class="icon-button open-mod-link" data-tooltip="Open mod page">
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"/>
                        </svg>
                    </button>
                    <button class="icon-button delete-mod" data-mod-id="${
											mod.mod_id
										}" data-tooltip="Delete mod">
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="custom-select relative w-full" data-mod-id="${mod.mod_id}">
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
                        <button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 clear-search-webhook">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clip-rule="evenodd"/>
                            </svg>
                        </button>
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

		// Trigger entrance animation
		setTimeout(() => {
			modElement.classList.remove("opacity-0");
			modElement.classList.add("opacity-100");
		}, 10);
	});

	document.querySelectorAll(".delete-mod").forEach((button) => {
		button.addEventListener("click", (e) => {
			const modId = e.target.closest(".delete-mod").getAttribute("data-mod-id");
			ipcRenderer.send("delete-mod", modId);
		});
	});

	document.querySelectorAll(".open-mod-link").forEach((button, index) => {
		button.addEventListener("click", () => {
			openModLink(mods[index].website_url);
		});
	});

	initializeWebhookSelects();
	initializeTooltips();
}

function filterMods(e) {
	const filterText = e.target.value.toLowerCase();
	const modItems = document.querySelectorAll(".mod-item");

	modItems.forEach((item) => {
		const modName = item.querySelector(".font-bold").textContent.toLowerCase();
		const modId = item
			.querySelector(".text-gray-400")
			.textContent.toLowerCase();

		if (modName.includes(filterText) || modId.includes(filterText)) {
			item.classList.remove("mod-item-exit");
			item.style.display = "";
			setTimeout(() => item.classList.remove("mod-item-enter"), 10);
		} else {
			item.classList.add("mod-item-exit");
			setTimeout(() => {
				item.style.display = "none";
				item.classList.add("mod-item-enter");
				item.classList.remove("mod-item-exit");
			}, 300);
		}
	});
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
		const clearSearchButton = select.querySelector(".clear-search-webhook");

		dropdownButton.addEventListener("click", (e) => {
			e.stopPropagation();
			toggleDropdown(dropdownMenu, dropdownButton);
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

		clearSearchButton.addEventListener("click", () => {
			searchInput.value = "";
			searchInput.dispatchEvent(new Event("input"));
		});
	});

	document.addEventListener("click", (e) => {
		if (!e.target.closest(".custom-select")) {
			closeAllDropdowns();
		}
	});

	updateWebhookDropdowns();
}

function toggleDropdown(dropdownMenu, button) {
	const isHidden = dropdownMenu.classList.contains("hidden");
	closeAllDropdowns();
	if (isHidden) {
		dropdownMenu.classList.remove("hidden");
		updateDropdownArrow(button, true);
	} else {
		updateDropdownArrow(button, false);
	}
}

function updateDropdownArrow(button, isOpen) {
	const svg = button.querySelector("svg");
	if (isOpen) {
		svg.innerHTML =
			'<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 5 4-4 4 4"/>';
	} else {
		svg.innerHTML =
			'<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>';
	}
}

function closeAllDropdowns() {
	document.querySelectorAll(".custom-select").forEach((select) => {
		const dropdownMenu = select.querySelector('[id^="dropdownSearch-"]');
		const button = select.querySelector('[id^="dropdownSearchButton-"]');
		const searchInput = select.querySelector('[id^="input-group-search-"]');
		dropdownMenu.classList.add("hidden");
		updateDropdownArrow(button, false);
		searchInput.value = "";
		searchInput.dispatchEvent(new Event("input"));
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
	const maxHeight = 130; // Maximum height before scrolling

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

function initializeTooltips() {
	if (shouldShowTooltips()) {
		document.querySelectorAll("[data-tooltip]").forEach((element) => {
			element.addEventListener("mouseenter", showTooltip);
			element.addEventListener("mouseleave", hideTooltip);
		});
	}
}

module.exports = {
	renderModList,
	initializeWebhookSelects,
	handleWebhookChange,
	updateSelectedText,
	updateWebhookDropdowns,
	initializeTooltips,
	openModLink,
	filterMods,
};
