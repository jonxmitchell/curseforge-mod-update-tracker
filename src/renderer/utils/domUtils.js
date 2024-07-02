function updateModCount(count) {
	const modCountElement = document.querySelector(".mod-count");
	if (modCountElement) {
		modCountElement.textContent = count;
	}
}

function updateConsoleOutput(consoleLines) {
	const consoleOutput = document.getElementById("consoleOutput");
	consoleOutput.textContent = consoleLines.join("\n");
	consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

module.exports = {
	updateModCount,
	updateConsoleOutput,
};
