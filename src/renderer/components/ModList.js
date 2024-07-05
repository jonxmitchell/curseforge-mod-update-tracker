const { ipcRenderer } = require("electron");
const { showToast } = require("../utils/toast");
const { updateModCount } = require("../utils/domUtils");

function renderModList(mods) {
	const modList = document.getElementById("modList");
	modList.innerHTML = "";
	mods.forEach((mod) => {
		const modElement = document.createElement("div");
		modElement.className = "mod-item";
		modElement.innerHTML = `
            <div class="mod-content">
                <div class="mod-info">
                    <span class="mod-name">${mod.name} (ID: ${
			mod.mod_id
		})</span>
                    <span class="mod-game">Game: ${mod.game}</span>
                    <span class="mod-updated">Last Updated: ${new Date(
											mod.last_checked_released
										).toLocaleString()}</span>
                </div>
                <div class="mod-actions">
                    <a href="${
											mod.website_url
										}" target="_blank" class="mod-link"><i class="fas fa-external-link-alt"></i></a>
                    <button class="delete-mod" data-mod-id="${
											mod.mod_id
										}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div class="custom-select" data-mod-id="${mod.mod_id}">
                <div class="select-selected">Select Webhooks</div>
                <div class="select-items select-hide"></div>
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
			selectItems.classList.toggle("select-hide");
			this.classList.toggle("select-arrow-active");
		});

		selectItems.addEventListener("click", (e) => {
			e.stopPropagation();
		});
	});

	document.addEventListener("click", closeAllSelect);
	updateWebhookSelects();
}

function updateWebhookSelects() {
	ipcRenderer.send("get-webhooks");
}

function closeAllSelect(elmnt) {
	const selectItems = document.getElementsByClassName("select-items");
	const selectSelected = document.getElementsByClassName("select-selected");
	for (let i = 0; i < selectSelected.length; i++) {
		if (elmnt !== selectSelected[i]) {
			selectSelected[i].classList.remove("select-arrow-active");
			selectItems[i].classList.add("select-hide");
		}
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
	const webhookName = checkbox.nextElementSibling.textContent;
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
					`${webhookName} webhook was assigned to mod ${modId}`,
					"success",
					{
						background: "linear-gradient(to right, #00b09b, #96c93d)",
					}
				);
			} else {
				showToast(
					`${webhookName} webhook was unassigned from mod ${modId}`,
					"info",
					{
						background: "linear-gradient(to right, #2193b0, #6dd5ed)",
					}
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
		(checkbox) => checkbox.nextElementSibling.textContent
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
