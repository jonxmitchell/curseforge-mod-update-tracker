function updateModCount(count) {
	const modCountElement = document.querySelector(".mod-count");
	if (modCountElement) {
		modCountElement.textContent = count;
	}
}

function updateConsoleOutput(consoleLines) {
	const consoleOutput = document.getElementById("consoleOutput");
	if (consoleOutput) {
		consoleOutput.innerHTML = consoleLines.join("<br>");
		consoleOutput.scrollTop = consoleOutput.scrollHeight;
	}
}

module.exports = {
	updateModCount,
	updateConsoleOutput,
};
