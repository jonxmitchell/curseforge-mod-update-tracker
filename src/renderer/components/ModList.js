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
                <div class="select-selected">Select Webhooks</div>
                <div class="select-items hidden"></div>
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
		const selectSelected = select.querySelector(".select-selected");
		const selectItems = select.querySelector(".select-items");

		selectSelected.addEventListener("click", function (e) {
			e.stopPropagation();
			closeAllSelect(this);
			selectItems.classList.toggle("hidden");
			this.classList.toggle("select-arrow-active");
		});

		selectItems.addEventListener("click", (e) => {
			e.stopPropagation();
		});
	});

	document.addEventListener("click", closeAllSelect);
	updateWebhookSelects();
}

function closeAllSelect(elmnt) {
	const selectItems = document.getElementsByClassName("select-items");
	const selectSelected = document.getElementsByClassName("select-selected");
	for (let i = 0; i < selectSelected.length; i++) {
		if (elmnt !== selectSelected[i]) {
			selectSelected[i].classList.remove("select-arrow-active");
			selectItems[i].classList.add("hidden");
		}
	}
}

function updateWebhookSelects() {
	ipcRenderer.send("get-webhooks");
}

async function handleWebhookChange(event) {
	const checkbox = event.target;
	const modId = checkbox.closest(".custom-select").getAttribute("data-mod-id");
	const select = checkbox.closest(".custom-select");
	const webhookIds = Array.from(
		select.querySelectorAll('input[type="checkbox"]:checked'),
		(checkbox) => parseInt(checkbox.value)
	);
	const webhookName = checkbox.nextElementSibling.textContent
		.trim()
		.replace(/\s+/g, " ");
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
		(checkbox) =>
			checkbox.nextElementSibling.textContent.trim().replace(/\s+/g, " ")
	);
	const selectedText = select.querySelector(".select-selected");
	selectedText.innerHTML = "";
	if (selectedWebhooks.length > 0) {
		selectedWebhooks.forEach((webhook) => {
			const bubble = document.createElement("span");
			bubble.className = "webhook-bubble";
			bubble.textContent = webhook;
			selectedText.appendChild(bubble);
		});
	} else {
		selectedText.textContent = "Select Webhooks";
	}
}

module.exports = {
	renderModList,
	initializeWebhookSelects,
	handleWebhookChange,
	updateSelectedText,
};
