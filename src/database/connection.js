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

function getDb() {
	return db;
}

module.exports = {
	initDatabase,
	getDb,
};
