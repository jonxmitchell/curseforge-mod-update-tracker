const sqlite3 = require("sqlite3").verbose();

let db;
let transactionQueue = [];
let transactionInProgress = false;

function initDatabase() {
	db = new sqlite3.Database("./mods.db", (err) => {
		if (err) console.error("Database opening error: ", err);
	});

	db.serialize(() => {
		db.run(`CREATE TABLE IF NOT EXISTS mods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mod_id TEXT UNIQUE,
            name TEXT,
            game TEXT,
            description TEXT,
            author TEXT,
            download_count INTEGER,
            website_url TEXT,
            current_released TEXT,
            last_checked_released TEXT,
            last_updated TEXT
        )`);

		db.run(`CREATE TABLE IF NOT EXISTS webhooks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE,
            url TEXT UNIQUE
        )`);

		db.run(`CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )`);

		db.run(`CREATE TABLE IF NOT EXISTS mod_webhooks (
            mod_id TEXT,
            webhook_id INTEGER,
            PRIMARY KEY (mod_id, webhook_id),
            FOREIGN KEY (mod_id) REFERENCES mods(mod_id),
            FOREIGN KEY (webhook_id) REFERENCES webhooks(id)
        )`);
	});
}

function runNextTransaction() {
	if (transactionQueue.length > 0 && !transactionInProgress) {
		const transaction = transactionQueue.shift();
		transaction();
	}
}

function addTransaction(transaction) {
	transactionQueue.push(transaction);
	runNextTransaction();
}

function saveSetting(key, value) {
	return new Promise((resolve, reject) => {
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

function getMods() {
	return new Promise((resolve, reject) => {
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

function getWebhooks() {
	return new Promise((resolve, reject) => {
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
		console.log(
			`Adding mod: ${modId}, Current Released: ${currentReleased}, Last Checked Released: ${lastCheckedReleased}`
		);
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
					console.error("Error adding mod:", err);
					reject(err);
				} else {
					resolve();
				}
			}
		);
	});
}

function updateMod(modId, currentReleased, lastCheckedReleased, lastUpdated) {
	return new Promise((resolve, reject) => {
		console.log(
			`Updating mod: ${modId}, Current Released: ${currentReleased}, Last Checked Released: ${lastCheckedReleased}`
		);
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
		addTransaction(() => {
			if (transactionInProgress) {
				console.error("Transaction already in progress for deleteMod");
				reject(new Error("Transaction already in progress"));
				runNextTransaction();
				return;
			}
			transactionInProgress = true;

			db.serialize(() => {
				db.run("BEGIN TRANSACTION", (err) => {
					if (err) {
						console.error("Error starting transaction:", err);
						transactionInProgress = false;
						reject(err);
						runNextTransaction();
						return;
					}

					db.run(`DELETE FROM mods WHERE mod_id = ?`, [modId], (err) => {
						if (err) {
							console.error("Error deleting mod:", err);
							db.run("ROLLBACK", (rollbackErr) => {
								if (rollbackErr) {
									console.error("Rollback error:", rollbackErr);
								}
								transactionInProgress = false;
								reject(err);
								runNextTransaction();
							});
							return;
						}

						db.run(
							`DELETE FROM mod_webhooks WHERE mod_id = ?`,
							[modId],
							(err) => {
								if (err) {
									console.error("Error deleting mod_webhooks:", err);
									db.run("ROLLBACK", (rollbackErr) => {
										if (rollbackErr) {
											console.error("Rollback error:", rollbackErr);
										}
										transactionInProgress = false;
										reject(err);
										runNextTransaction();
									});
									return;
								}

								db.run("COMMIT", (err) => {
									transactionInProgress = false;
									if (err) {
										console.error("Error committing transaction:", err);
										db.run("ROLLBACK", (rollbackErr) => {
											if (rollbackErr) {
												console.error("Rollback error:", rollbackErr);
											}
											reject(err);
											runNextTransaction();
										});
									} else {
										resolve();
										runNextTransaction();
									}
								});
							}
						);
					});
				});
			});
		});
	});
}

function addWebhook(name, url) {
	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO webhooks (name, url) VALUES (?, ?)`,
			[name, url],
			(err) => {
				if (err) {
					console.error("Error adding webhook:", err);
					reject(err);
				} else {
					resolve();
				}
			}
		);
	});
}

function deleteWebhook(id) {
	return new Promise((resolve, reject) => {
		addTransaction(() => {
			if (transactionInProgress) {
				console.error("Transaction already in progress for deleteWebhook");
				reject(new Error("Transaction already in progress"));
				runNextTransaction();
				return;
			}
			transactionInProgress = true;

			db.serialize(() => {
				db.run("BEGIN TRANSACTION", (err) => {
					if (err) {
						console.error("Error starting transaction:", err);
						transactionInProgress = false;
						reject(err);
						runNextTransaction();
						return;
					}

					db.run(`DELETE FROM webhooks WHERE id = ?`, [id], (err) => {
						if (err) {
							console.error("Error deleting webhook:", err);
							db.run("ROLLBACK", (rollbackErr) => {
								if (rollbackErr) {
									console.error("Rollback error:", rollbackErr);
								}
								transactionInProgress = false;
								reject(err);
								runNextTransaction();
							});
							return;
						}

						db.run(
							`DELETE FROM mod_webhooks WHERE webhook_id = ?`,
							[id],
							(err) => {
								if (err) {
									console.error("Error deleting mod_webhooks:", err);
									db.run("ROLLBACK", (rollbackErr) => {
										if (rollbackErr) {
											console.error("Rollback error:", rollbackErr);
										}
										transactionInProgress = false;
										reject(err);
										runNextTransaction();
									});
									return;
								}

								db.run("COMMIT", (err) => {
									transactionInProgress = false;
									if (err) {
										console.error("Error committing transaction:", err);
										db.run("ROLLBACK", (rollbackErr) => {
											if (rollbackErr) {
												console.error("Rollback error:", rollbackErr);
											}
											reject(err);
											runNextTransaction();
										});
									} else {
										resolve();
										runNextTransaction();
									}
								});
							}
						);
					});
				});
			});
		});
	});
}

async function assignWebhooks(modId, webhookIds) {
	return new Promise((resolve, reject) => {
		addTransaction(() => {
			if (transactionInProgress) {
				console.error("Transaction already in progress for assignWebhooks");
				reject(new Error("Transaction already in progress"));
				runNextTransaction();
				return;
			}
			transactionInProgress = true;

			db.serialize(() => {
				db.run("BEGIN TRANSACTION", (err) => {
					if (err) {
						console.error("Error starting transaction:", err);
						transactionInProgress = false;
						reject(err);
						runNextTransaction();
						return;
					}

					db.run(
						"DELETE FROM mod_webhooks WHERE mod_id = ?",
						[modId],
						(err) => {
							if (err) {
								console.error("Error deleting mod_webhooks:", err);
								db.run("ROLLBACK", (rollbackErr) => {
									if (rollbackErr) {
										console.error("Rollback error:", rollbackErr);
									}
									transactionInProgress = false;
									reject(err);
									runNextTransaction();
								});
								return;
							}

							const stmt = db.prepare(
								"INSERT INTO mod_webhooks (mod_id, webhook_id) VALUES (?, ?)"
							);

							const runInsert = (webhookId, callback) => {
								stmt.run(modId, webhookId, (err) => {
									callback(err);
								});
							};

							let i = 0;
							const next = (err) => {
								if (err) {
									console.error("Error inserting into mod_webhooks:", err);
									stmt.finalize((finalizeErr) => {
										if (finalizeErr) {
											console.error("Error finalizing statement:", finalizeErr);
										}
										db.run("ROLLBACK", (rollbackErr) => {
											if (rollbackErr) {
												console.error("Rollback error:", rollbackErr);
											}
											transactionInProgress = false;
											reject(err);
											runNextTransaction();
										});
									});
									return;
								}
								if (i < webhookIds.length) {
									runInsert(webhookIds[i++], next);
								} else {
									stmt.finalize((err) => {
										if (err) {
											console.error("Error finalizing statement:", err);
											db.run("ROLLBACK", (rollbackErr) => {
												if (rollbackErr) {
													console.error("Rollback error:", rollbackErr);
												}
												transactionInProgress = false;
												reject(err);
												runNextTransaction();
											});
											return;
										}
										db.run("COMMIT", (err) => {
											transactionInProgress = false;
											if (err) {
												console.error("Error committing transaction:", err);
												db.run("ROLLBACK", (rollbackErr) => {
													if (rollbackErr) {
														console.error("Rollback error:", rollbackErr);
													}
													reject(err);
													runNextTransaction();
												});
												return;
											}
											resolve();
											runNextTransaction();
										});
									});
								}
							};
							next();
						}
					);
				});
			});
		});
	});
}

function getModWebhooks(modId) {
	return new Promise((resolve, reject) => {
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
	initDatabase,
	saveSetting,
	getSetting,
	getMods,
	getWebhooks,
	addMod,
	updateMod,
	deleteMod,
	addWebhook,
	deleteWebhook,
	assignWebhooks,
	getModWebhooks,
};
