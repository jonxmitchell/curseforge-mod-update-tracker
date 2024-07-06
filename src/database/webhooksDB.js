const { getDb } = require("./connection");

function getWebhooks() {
	return new Promise((resolve, reject) => {
		const db = getDb();
		db.all(`SELECT id, name, url FROM webhooks`, (err, rows) => {
			if (err) {
				console.error("Error fetching webhooks:", err);
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
}

function addWebhook(name, url) {
	return new Promise((resolve, reject) => {
		const db = getDb();
		db.get(
			`SELECT * FROM webhooks WHERE name = ? OR url = ?`,
			[name, url],
			(err, row) => {
				if (err) {
					reject(err);
				} else if (row) {
					if (row.name === name) {
						reject(new Error("Webhook name already exists"));
					} else {
						reject(new Error("Webhook URL already exists"));
					}
				} else {
					db.run(
						`INSERT INTO webhooks (name, url) VALUES (?, ?)`,
						[name, url],
						(err) => {
							if (err) {
								reject(err);
							} else {
								resolve();
							}
						}
					);
				}
			}
		);
	});
}

function deleteWebhook(id) {
	return new Promise((resolve, reject) => {
		const db = getDb();
		db.serialize(() => {
			db.run("BEGIN TRANSACTION", (err) => {
				if (err) {
					console.error("Error starting transaction:", err);
					reject(err);
					return;
				}

				db.run(`DELETE FROM webhooks WHERE id = ?`, [id], (err) => {
					if (err) {
						console.error("Error deleting webhook:", err);
						db.run("ROLLBACK", () => {
							reject(err);
						});
						return;
					}

					db.run(
						`DELETE FROM mod_webhooks WHERE webhook_id = ?`,
						[id],
						(err) => {
							if (err) {
								console.error("Error deleting mod_webhooks:", err);
								db.run("ROLLBACK", () => {
									reject(err);
								});
								return;
							}

							db.run("COMMIT", (err) => {
								if (err) {
									console.error("Error committing transaction:", err);
									db.run("ROLLBACK", () => {
										reject(err);
									});
									return;
								}
								resolve();
							});
						}
					);
				});
			});
		});
	});
}

module.exports = {
	getWebhooks,
	addWebhook,
	deleteWebhook,
};
