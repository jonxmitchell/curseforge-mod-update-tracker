const { getDb } = require("./connection");

async function assignWebhooks(modId, webhookIds) {
	return new Promise((resolve, reject) => {
		const db = getDb();
		db.serialize(() => {
			db.run("BEGIN TRANSACTION", (err) => {
				if (err) {
					console.error("Error starting transaction:", err);
					reject(err);
					return;
				}

				db.run("DELETE FROM mod_webhooks WHERE mod_id = ?", [modId], (err) => {
					if (err) {
						console.error("Error deleting mod_webhooks:", err);
						db.run("ROLLBACK", () => {
							reject(err);
						});
						return;
					}

					const stmt = db.prepare(
						"INSERT INTO mod_webhooks (mod_id, webhook_id) VALUES (?, ?)"
					);

					if (webhookIds.length === 0) {
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
					} else {
						webhookIds.forEach((webhookId, index) => {
							stmt.run(modId, webhookId, (err) => {
								if (err) {
									console.error("Error inserting into mod_webhooks:", err);
									db.run("ROLLBACK", () => {
										reject(err);
									});
									return;
								}

								if (index === webhookIds.length - 1) {
									stmt.finalize((err) => {
										if (err) {
											console.error("Error finalizing statement:", err);
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
									});
								}
							});
						});
					}
				});
			});
		});
	});
}

function getModWebhooks(modId) {
	return new Promise((resolve, reject) => {
		const db = getDb();
		db.all(
			"SELECT webhook_id FROM mod_webhooks WHERE mod_id = ?",
			[modId],
			(err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows.map((row) => row.webhook_id));
				}
			}
		);
	});
}

module.exports = {
	assignWebhooks,
	getModWebhooks,
};
