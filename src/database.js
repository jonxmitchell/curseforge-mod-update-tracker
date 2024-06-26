const sqlite3 = require("sqlite3").verbose();

let db;

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
      current_released TEXT, /* Changed */
      last_checked_released TEXT, /* Changed */
      last_updated TEXT,
      webhook_id INTEGER
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
	});
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
		db.run(`DELETE FROM mods WHERE mod_id = ?`, [modId], (err) => {
			if (err) {
				console.error("Error deleting mod:", err);
				reject(err);
			} else {
				resolve();
			}
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
		db.run(`DELETE FROM webhooks WHERE id = ?`, [id], (err) => {
			if (err) {
				console.error("Error deleting webhook:", err);
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

function assignWebhook(modId, webhookId) {
	return new Promise((resolve, reject) => {
		db.run(
			`UPDATE mods SET webhook_id = ? WHERE mod_id = ?`,
			[webhookId, modId],
			(err) => {
				if (err) {
					console.error("Error assigning webhook:", err);
					reject(err);
				} else {
					resolve();
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
	assignWebhook,
};