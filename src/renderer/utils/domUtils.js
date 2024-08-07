// src/renderer/utils/domUtils.js

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
		scrollConsoleToBottom();
	}
}

function adjustConsoleHeight() {
	const consoleOutput = document.getElementById("consoleOutput");
	if (consoleOutput) {
		const windowHeight = window.innerHeight;
		const consoleTop = consoleOutput.getBoundingClientRect().top;
		const newHeight = windowHeight - consoleTop - 20; // 20px for some padding
		consoleOutput.style.height = `${newHeight}px`;
		scrollConsoleToBottom();
	}
}

function scrollConsoleToBottom() {
	const consoleOutput = document.getElementById("consoleOutput");
	if (consoleOutput) {
		consoleOutput.scrollTop = consoleOutput.scrollHeight;
	}
}

module.exports = {
	updateModCount,
	updateConsoleOutput,
	adjustConsoleHeight,
	scrollConsoleToBottom,
};
