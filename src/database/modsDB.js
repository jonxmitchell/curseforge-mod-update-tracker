const { getDb } = require("./connection");

function getMods() {
	const db = getDb();
	return db.prepare("SELECT * FROM mods").all();
}

function addMod(
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
	const db = getDb();
	const stmt =
		db.prepare(`INSERT INTO mods (mod_id, name, game, description, author, download_count, website_url, current_released, last_checked_released, last_updated) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
	try {
		stmt.run(
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
		);
	} catch (err) {
		if (err.code === "SQLITE_CONSTRAINT") {
			throw new Error("Mod already exists");
		}
		throw err;
	}
}

function updateMod(modId, currentReleased, lastCheckedReleased, lastUpdated) {
	const db = getDb();
	const stmt = db.prepare(
		`UPDATE mods SET current_released = ?, last_checked_released = ?, last_updated = ? WHERE mod_id = ?`
	);
	stmt.run(currentReleased, lastCheckedReleased, lastUpdated, modId);
}

function deleteMod(modId) {
	const db = getDb();
	db.transaction(() => {
		// First, delete related entries in mod_webhooks
		db.prepare(`DELETE FROM mod_webhooks WHERE mod_id = ?`).run(modId);

		// Then, delete the mod itself
		const result = db.prepare(`DELETE FROM mods WHERE mod_id = ?`).run(modId);

		if (result.changes === 0) {
			throw new Error("Mod not found");
		}
	})();
}

module.exports = {
	getMods,
	addMod,
	updateMod,
	deleteMod,
};
