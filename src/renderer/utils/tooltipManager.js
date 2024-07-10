const { ipcRenderer } = require("electron");

let isTooltipEnabled = true; // Default to true

async function initializeTooltipState() {
	try {
		const result = await ipcRenderer.invoke("get-tooltip-preference");
		if (result.success) {
			isTooltipEnabled = result.preference;
		} else {
			console.error("Failed to load tooltip preference:", result.error);
			// Set default state if there's an error
			await setTooltipState(true);
		}
	} catch (error) {
		console.error("Error loading tooltip preference:", error);
		// Set default state if there's an error
		await setTooltipState(true);
	}
}

async function setTooltipState(state) {
	isTooltipEnabled = state;
	try {
		await ipcRenderer.invoke("save-tooltip-preference", state);
	} catch (error) {
		console.error("Error saving tooltip preference:", error);
	}
}

function shouldShowTooltips() {
	return isTooltipEnabled;
}

function showTooltip(event) {
	if (!shouldShowTooltips()) return;

	const tooltipText = event.target.getAttribute("data-tooltip");

	const tooltip = document.createElement("div");
	tooltip.className =
		"tooltip absolute bg-gray-800 text-white text-xs rounded py-1 px-2 z-50 opacity-100";
	tooltip.textContent = tooltipText;
	document.body.appendChild(tooltip);

	const rect = event.target.getBoundingClientRect();
	const tooltipRect = tooltip.getBoundingClientRect();

	tooltip.style.left = `${
		rect.left + window.scrollX + rect.width / 2 - tooltipRect.width / 2
	}px`;
	tooltip.style.top = `${rect.top + window.scrollY - tooltipRect.height - 5}px`;
}

function hideTooltip() {
	const tooltips = document.querySelectorAll(".tooltip");
	tooltips.forEach((tooltip) => tooltip.remove());
}

module.exports = {
	initializeTooltipState,
	setTooltipState,
	shouldShowTooltips,
	showTooltip,
	hideTooltip,
};
