const { getDb } = require("./connection");

function getMods() {
	return new Promise((resolve, reject) => {
		const db = getDb();
		db.all(`SELECT * FROM mods`, (err, rows) => {
			if (err) {
				console.error("Error fetching mods:", err);
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
}

async function addMod(
	modId,
	name,
	game,
	description,
	author,
	downloadCount,
	websiteUrl,
	currentReleased,
	lastCheckedReleased,
	lastUpdated
) {
	return new Promise((resolve, reject) => {
		const db = getDb();
		db.get(`SELECT * FROM mods WHERE mod_id = ?`, [modId], (err, row) => {
			if (err) {
				reject(err);
			} else if (row) {
				reject(new Error("Mod already exists"));
			} else {
				db.run(
					`INSERT INTO mods (mod_id, name, game, description, author, download_count, website_url, current_released, last_checked_released, last_updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
					[
						modId,
						name,
						game,
						description,
						author,
						downloadCount,
						websiteUrl,
						currentReleased,
						lastCheckedReleased,
						lastUpdated,
					],
					(err) => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					}
				);
			}
		});
	});
}

function updateMod(modId, currentReleased, lastCheckedReleased, lastUpdated) {
	return new Promise((resolve, reject) => {
		const db = getDb();
		db.run(
			`UPDATE mods SET current_released = ?, last_checked_released = ?, last_updated = ? WHERE mod_id = ?`,
			[currentReleased, lastCheckedReleased, lastUpdated, modId],
			(err) => {
				if (err) {
					console.error("Error updating mod:", err);
					reject(err);
				} else {
					resolve();
				}
			}
		);
	});
}

function deleteMod(modId) {
	return new Promise((resolve, reject) => {
		const db = getDb();
		db.serialize(() => {
			db.run("BEGIN TRANSACTION", (err) => {
				if (err) {
					console.error("Error starting transaction:", err);
					reject(err);
					return;
				}

				db.run(`DELETE FROM mods WHERE mod_id = ?`, [modId], (err) => {
					if (err) {
						console.error("Error deleting mod:", err);
						db.run("ROLLBACK", () => {
							reject(err);
						});
						return;
					}

					db.run(
						`DELETE FROM mod_webhooks WHERE mod_id = ?`,
						[modId],
						(err) => {
							if (err) {
								console.error("Error deleting mod webhooks:", err);
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
	getMods,
	addMod,
	updateMod,
	deleteMod,
};
