function updateModCount(count) {
	const modCountElement = document.querySelector(".mod-count");
	if (modCountElement) {
		modCountElement.textContent = count;
	}
}

function updateConsoleOutput(consoleLines) {
	const consoleOutput = document.getElementById("consoleOutput");
	if (consoleOutput) {
		// Join the lines with line breaks and set as HTML to preserve formatting
		consoleOutput.innerHTML = consoleLines.join("<br>");
		consoleOutput.scrollTop = consoleOutput.scrollHeight;
	}
}

module.exports = {
	updateModCount,
	updateConsoleOutput,
};
