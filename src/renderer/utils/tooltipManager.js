// src/renderer/utils/tooltipManager.js

let isTooltipEnabled = true; // Default to true

function initializeTooltipState() {
	const storedState = localStorage.getItem("tooltipEnabled");
	if (storedState === null) {
		// If no state is stored, set the default state (true) in localStorage
		localStorage.setItem("tooltipEnabled", "true");
	} else {
		// If a state is stored, use that value
		isTooltipEnabled = storedState === "true";
	}
}

function setTooltipState(state) {
	isTooltipEnabled = state;
	localStorage.setItem("tooltipEnabled", state.toString());
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
