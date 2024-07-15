const { getDb } = require("./connection");

function saveSetting(key, value) {
	const db = getDb();
	const stmt = db.prepare(
		"INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)"
	);
	stmt.run(key, value);
}

function getSetting(key) {
	const db = getDb();
	const stmt = db.prepare("SELECT value FROM settings WHERE key = ?");
	const result = stmt.get(key);
	return result ? result.value : null;
}

function saveWebhookLayout(layout) {
	return saveSetting("webhook_layout", JSON.stringify(layout));
}

function getWebhookLayout() {
	const layout = getSetting("webhook_layout");
	return layout
		? JSON.parse(layout)
		: {
				webhookText: "Mod Update Alert!",
				embedTitle: "{modName} has been updated!",
				embedText:
					"New release date: {newReleaseDate}\nPrevious release date: {oldPreviousDate}",
				showDate: true,
				showImage: false,
		  };
}

module.exports = {
	saveSetting,
	getSetting,
	saveWebhookLayout,
	getWebhookLayout,
};
