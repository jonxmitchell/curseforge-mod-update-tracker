const { ipcRenderer } = require("electron");
const { updateConsoleOutput } = require("./domUtils");

let consoleLines = [];

function initializeConsoleLogger() {
	const originalConsoleLog = console.log;
	console.log = function (...args) {
		originalConsoleLog.apply(console, args);
		const logMessage = args.join(" ");
		const now = new Date();
		const date = `${String(now.getDate()).padStart(2, "0")}/${String(
			now.getMonth() + 1
		).padStart(2, "0")}/${now.getFullYear()}`;
		const time = `${String(now.getHours()).padStart(2, "0")}:${String(
			now.getMinutes()
		).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
		const formattedDateTime = `<span class="text-purple-400">[${date}] [${time}]</span>`;

		let colorClass = "";
		if (
			logMessage.includes("deleted from tracker") ||
			logMessage.includes("Webhook deleted:")
		) {
			colorClass = "text-red-500";
		} else if (
			logMessage.includes("added to tracker") ||
			logMessage.includes("Webhook added:")
		) {
			colorClass = "text-green-500";
		} else if (
			logMessage.includes("Mod update detected") ||
			logMessage.includes("Webhook sent successfully")
		) {
			colorClass = "text-cyan-500";
		} else if (logMessage.includes("No mod updates detected")) {
			colorClass = "text-amber-500";
		} else if (
			logMessage.includes("initialization") ||
			logMessage.includes("initialized") ||
			logMessage.includes("Initializing") ||
			logMessage.includes("Setting up") ||
			logMessage.includes("set up") ||
			logMessage.includes("Loading") ||
			logMessage.includes("loaded") ||
			logMessage.includes("Updating") ||
			logMessage.includes("updated")
		) {
			colorClass = "text-pink-500";
		}

		const formattedMessage = `<span class="${colorClass}">${formattedDateTime} ${logMessage}</span>`;
		consoleLines.push(formattedMessage);
		if (consoleLines.length > 200) {
			consoleLines.shift();
		}
		updateConsoleOutput(consoleLines);

		// Send log to main process for file writing
		ipcRenderer.send("log-to-file", logMessage);
	};
}

function clearConsoleLogs() {
	consoleLines = [];
	updateConsoleOutput(consoleLines);
}

module.exports = {
	initializeConsoleLogger,
	clearConsoleLogs,
};
