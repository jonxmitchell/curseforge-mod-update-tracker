const { getDb } = require("./connection");

function saveSetting(key, value) {
	return new Promise((resolve, reject) => {
		const db = getDb();
		db.run(
			`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`,
			[key, value],
			(err) => {
				if (err) {
					console.error("Error saving setting:", err);
					reject(err);
				} else {
					resolve();
				}
			}
		);
	});
}

function getSetting(key) {
	return new Promise((resolve, reject) => {
		const db = getDb();
		db.get(`SELECT value FROM settings WHERE key = ?`, [key], (err, row) => {
			if (err) {
				console.error("Error getting setting:", err);
				reject(err);
			} else {
				resolve(row ? row.value : null);
			}
		});
	});
}

function saveWebhookLayout(layout) {
	return saveSetting("webhook_layout", JSON.stringify(layout));
}

async function getWebhookLayout() {
	const layout = await getSetting("webhook_layout");
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
