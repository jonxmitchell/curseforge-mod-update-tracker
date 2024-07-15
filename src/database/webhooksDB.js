const { getDb } = require("./connection");

function getWebhooks() {
	const db = getDb();
	return db.prepare("SELECT id, name, url FROM webhooks").all();
}

function addWebhook(name, url) {
	const db = getDb();
	const stmt = db.prepare("INSERT INTO webhooks (name, url) VALUES (?, ?)");
	try {
		stmt.run(name, url);
	} catch (err) {
		if (err.code === "SQLITE_CONSTRAINT") {
			if (err.message.includes("name")) {
				throw new Error("Webhook name already exists");
			} else if (err.message.includes("url")) {
				throw new Error("Webhook URL already exists");
			}
		}
		throw err;
	}
}

function deleteWebhook(id) {
	const db = getDb();
	db.transaction(() => {
		// First, delete related entries in mod_webhooks
		db.prepare("DELETE FROM mod_webhooks WHERE webhook_id = ?").run(id);

		// Then, delete the webhook itself
		const result = db.prepare("DELETE FROM webhooks WHERE id = ?").run(id);

		if (result.changes === 0) {
			throw new Error("Webhook not found");
		}
	})();
}

function renameWebhook(id, newName) {
	const db = getDb();
	const stmt = db.prepare("UPDATE webhooks SET name = ? WHERE id = ?");
	const result = stmt.run(newName, id);
	if (result.changes === 0) {
		throw new Error("Webhook not found");
	}
}

module.exports = {
	getWebhooks,
	addWebhook,
	deleteWebhook,
	renameWebhook,
};
