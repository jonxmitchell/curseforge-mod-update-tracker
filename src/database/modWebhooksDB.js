const { getDb } = require("./connection");

function assignWebhooks(modId, webhookIds) {
	const db = getDb();
	db.transaction(() => {
		const deleteStmt = db.prepare("DELETE FROM mod_webhooks WHERE mod_id = ?");
		deleteStmt.run(modId);

		const insertStmt = db.prepare(
			"INSERT INTO mod_webhooks (mod_id, webhook_id) VALUES (?, ?)"
		);
		for (const webhookId of webhookIds) {
			insertStmt.run(modId, webhookId);
		}
	})();
}

function getModWebhooks(modId) {
	const db = getDb();
	const stmt = db.prepare(
		"SELECT webhook_id FROM mod_webhooks WHERE mod_id = ?"
	);
	const rows = stmt.all(modId);
	return rows.map((row) => row.webhook_id);
}

module.exports = {
	assignWebhooks,
	getModWebhooks,
};
