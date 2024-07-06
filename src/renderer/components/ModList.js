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
            <div class="custom-select" data-mod-id="${mod.mod_id}">
                <button id="dropdownSearchButton-${
									mod.mod_id
								}" data-dropdown-toggle="dropdownSearch-${
			mod.mod_id
		}" data-dropdown-placement="bottom" class="dropdown-button" type="button">
                    Select Webhooks 
                    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                    </svg>
                </button>
                <div id="dropdownSearch-${
									mod.mod_id
								}" class="dropdown-menu hidden">
                    <div class="p-3">
                        <label for="input-group-search-${
													mod.mod_id
												}" class="sr-only">Search</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="text" id="input-group-search-${
															mod.mod_id
														}" class="dropdown-search" placeholder="Search webhook">
                        </div>
                    </div>
                    <ul class="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSearchButton-${
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

		dropdownButton.addEventListener("click", () => {
			dropdownMenu.classList.toggle("hidden");
		});

		document.addEventListener("click", (e) => {
			if (!select.contains(e.target)) {
				dropdownMenu.classList.add("hidden");
			}
		});

		searchInput.addEventListener("input", (e) => {
			const searchTerm = e.target.value.toLowerCase();
			const checkboxes = select.querySelectorAll(".dropdown-item");
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

	updateWebhookDropdowns();
}

async function updateWebhookDropdowns() {
	try {
		const webhooks = await ipcRenderer.invoke("get-webhooks");
		document.querySelectorAll(".custom-select").forEach(async (select) => {
			const modId = select.getAttribute("data-mod-id");
			const webhookList = select.querySelector("ul");
			webhookList.innerHTML = "";

			webhooks.forEach((webhook) => {
				const listItem = document.createElement("li");
				listItem.innerHTML = `
                    <div class="dropdown-item">
                        <input id="${modId}-${webhook.id}" type="checkbox" value="${webhook.id}" class="dropdown-checkbox">
                        <label for="${modId}-${webhook.id}" class="dropdown-label">${webhook.name}</label>
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
		});
	} catch (error) {
		showToast(`Error updating webhook dropdowns: ${error.message}`, "error");
	}
}

async function handleWebhookChange(event) {
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
	if (selectedWebhooks.length > 0) {
		dropdownButton.textContent = `${selectedWebhooks.length} Webhook${
			selectedWebhooks.length > 1 ? "s" : ""
		} Selected`;
	} else {
		dropdownButton.textContent = "Select Webhooks";
	}
}

module.exports = {
	renderModList,
	initializeWebhookSelects,
	handleWebhookChange,
	updateSelectedText,
	updateWebhookDropdowns,
};
