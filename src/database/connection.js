// src/database/connection.js

const sqlite3 = require("better-sqlite3");
const path = require("path");
const { app } = require("electron");
const fs = require("fs");

let db;

function getDatabasePath() {
	return path.join(app.getPath("userData"), "mods.db");
}

function initDatabase() {
	const dbPath = getDatabasePath();
	console.log(`Attempting to open database at: ${dbPath}`);

	// Ensure the directory exists
	fs.mkdirSync(path.dirname(dbPath), { recursive: true });

	try {
		db = new sqlite3(dbPath);
		console.log("Database opened successfully");

		db.exec(`CREATE TABLE IF NOT EXISTS mods (
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

		db.exec(`CREATE TABLE IF NOT EXISTS webhooks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE,
            url TEXT UNIQUE
        )`);

		db.exec(`CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )`);

		db.exec(`CREATE TABLE IF NOT EXISTS mod_webhooks (
            mod_id TEXT,
            webhook_id INTEGER,
            PRIMARY KEY (mod_id, webhook_id),
            FOREIGN KEY (mod_id) REFERENCES mods(mod_id),
            FOREIGN KEY (webhook_id) REFERENCES webhooks(id)
        )`);

		console.log("Database tables created or already exist");
	} catch (err) {
		console.error("Database initialization error: ", err);
	}
}

function getDb() {
	if (!db) {
		throw new Error(
			"Database has not been initialized. Call initDatabase() first."
		);
	}
	return db;
}

module.exports = {
	initDatabase,
	getDb,
};
