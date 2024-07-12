const fs = require("fs");
const path = require("path");

class Logger {
	constructor() {
		this.logsDir = path.join(__dirname, "../../../logs");
		this.logFile = path.join(
			this.logsDir,
			`log_${this.getFormattedDate()}.txt`
		);
		this.ensureLogDirectory();
	}

	ensureLogDirectory() {
		if (!fs.existsSync(this.logsDir)) {
			fs.mkdirSync(this.logsDir, { recursive: true });
		}
	}

	getFormattedDate() {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
			2,
			"0"
		)}-${String(now.getDate()).padStart(2, "0")}`;
	}

	log(message) {
		const timestamp = new Date().toISOString();
		const logEntry = `[${timestamp}] ${message}\n`;

		fs.appendFile(this.logFile, logEntry, (err) => {
			if (err) {
				console.error("Error writing to log file:", err);
			}
		});
	}
}

module.exports = new Logger();
