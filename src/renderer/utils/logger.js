const fs = require("fs");
const path = require("path");

class Logger {
	constructor() {
		this.logsDir = path.join(__dirname, "../../../logs");
		this.logFile = this.createNewLogFile();
		this.ensureLogDirectory();
	}

	ensureLogDirectory() {
		if (!fs.existsSync(this.logsDir)) {
			fs.mkdirSync(this.logsDir, { recursive: true });
		}
	}

	createNewLogFile() {
		const timestamp = this.getFormattedTimestamp();
		return path.join(this.logsDir, `log_${timestamp}.txt`);
	}

	getFormattedTimestamp() {
		const now = new Date();
		return now.toISOString().replace(/:/g, "-").replace("T", "_").slice(0, -5);
	}

	getFormattedDateTime() {
		const now = new Date();
		const date = `${String(now.getDate()).padStart(2, "0")}/${String(
			now.getMonth() + 1
		).padStart(2, "0")}/${now.getFullYear()}`;
		const time = `${String(now.getHours()).padStart(2, "0")}:${String(
			now.getMinutes()
		).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
		return `[${date}] [${time}]`;
	}

	log(message) {
		const formattedDateTime = this.getFormattedDateTime();
		const logEntry = `${formattedDateTime} ${message}\n`;

		fs.appendFile(this.logFile, logEntry, (err) => {
			if (err) {
				console.error("Error writing to log file:", err);
			}
		});
	}
}

module.exports = new Logger();
