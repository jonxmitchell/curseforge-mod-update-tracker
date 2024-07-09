function showTooltip(event) {
	const tooltipText = event.target.getAttribute("data-tooltip");
	const tooltip = document.createElement("div");
	tooltip.className =
		"tooltip absolute bg-gray-800 text-white text-xs rounded py-1 px-2 z-50 opacity-100";
	tooltip.textContent = tooltipText;
	document.body.appendChild(tooltip);

	const rect = event.target.getBoundingClientRect();
	const tooltipRect = tooltip.getBoundingClientRect();

	// Position the tooltip above the button
	tooltip.style.left = `${
		rect.left + window.scrollX + rect.width / 2 - tooltipRect.width / 2
	}px`;
	tooltip.style.top = `${rect.top + window.scrollY - tooltipRect.height - 5}px`;
}

function hideTooltip() {
	const tooltip = document.querySelector(".tooltip");
	if (tooltip) {
		tooltip.remove();
	}
}

module.exports = {
	showTooltip,
	hideTooltip,
};
