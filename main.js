const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const fetch = require("node-fetch");
require("dotenv").config();

let mainWindow;
let db;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	mainWindow.loadFile("index.html");
}

function initDatabase() {
	db = new sqlite3.Database("./mods.db", (err) => {
		if (err) console.error("Database opening error: ", err);
	});

	db.run(`CREATE TABLE IF NOT EXISTS mods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mod_id TEXT,
    name TEXT,
    current_version TEXT,
    last_checked_version TEXT,
    last_updated TEXT
  )`);

	db.run(`CREATE TABLE IF NOT EXISTS webhooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE
  )`);
}

async function checkForUpdates() {
	let updatesFound = false;
	const checkTime = new Date().toISOString();

	db.all(`SELECT * FROM mods`, async (err, rows) => {
		if (err) {
			console.error(err);
			return;
		}

		for (const mod of rows) {
			try {
				const response = await fetch(
					`https://api.curseforge.com/v1/mods/${mod.mod_id}`,
					{
						headers: {
							"x-api-key": process.env.CURSEFORGE_API_KEY,
						},
					}
				);
				const data = await response.json();
				const latestVersion = data.data.latestFilesIndexes[0].fileId.toString();

				console.log(
					`Checking mod ${mod.name}: Current version: ${mod.current_version}, Latest version: ${latestVersion}`
				);

				if (latestVersion !== mod.current_version) {
					console.log(
						`Update found for ${mod.name}: ${mod.current_version} -> ${latestVersion}`
					);
					updatesFound = true;
					db.run(
						`UPDATE mods SET current_version = ?, last_checked_version = ?, last_updated = ? WHERE mod_id = ?`,
						[latestVersion, latestVersion, checkTime, mod.mod_id]
					);

					mainWindow.webContents.send("mod-updated", {
						name: mod.name,
						newVersion: latestVersion,
						oldVersion: mod.current_version,
					});

					await sendDiscordNotifications(
						mod.name,
						latestVersion,
						mod.current_version
					);
				} else {
					console.log(
						`No update for ${mod.name}: Current version matches latest (${latestVersion})`
					);
					// Only update last_checked_version
					db.run(`UPDATE mods SET last_checked_version = ? WHERE mod_id = ?`, [
						latestVersion,
						mod.mod_id,
					]);
				}
			} catch (error) {
				console.error(`Error checking update for mod ${mod.mod_id}:`, error);
			}
		}

		if (!updatesFound) {
			console.log("No updates found for any mods");
			sendNoUpdatesMessage(checkTime);
		}
		mainWindow.webContents.send("update-check-complete");
	});
}

function sendNoUpdatesMessage(checkTime) {
	mainWindow.webContents.send("no-updates", {
		message: `No mod updates detected as of ${new Date(
			checkTime
		).toLocaleString()}`,
		checkTime: checkTime,
	});
}

async function sendDiscordNotifications(modName, newVersion, oldVersion) {
	const webhooks = await getDiscordWebhooks();

	if (webhooks.length === 0) {
		console.error("No Discord webhooks set");
		return;
	}

	const message = {
		content: `Mod Update Alert!`,
		embeds: [
			{
				title: `${modName} has been updated!`,
				description: `New version: ${newVersion}\nPrevious version: ${oldVersion}`,
				color: 5814783,
				timestamp: new Date().toISOString(),
			},
		],
	};

	for (const webhook of webhooks) {
		try {
			const response = await fetch(webhook, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(message),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			console.log(`Notification sent for ${modName} to webhook ${webhook}`);
		} catch (error) {
			console.error(`Error sending Discord notification to ${webhook}:`, error);
		}
	}
}

function getDiscordWebhooks() {
	return new Promise((resolve) => {
		db.all("SELECT url FROM webhooks", (err, rows) => {
			if (err) {
				console.error("Error fetching Discord webhooks:", err);
				resolve([]);
			} else {
				resolve(rows.map((row) => row.url));
			}
		});
	});
}

app.whenReady().then(() => {
	createWindow();
	initDatabase();
});

ipcMain.on("add-mod", async (event, modId) => {
	try {
		const response = await fetch(
			`https://api.curseforge.com/v1/mods/${modId}`,
			{
				headers: {
					"x-api-key": process.env.CURSEFORGE_API_KEY,
				},
			}
		);
		const data = await response.json();
		const latestVersion = data.data.latestFilesIndexes[0].fileId.toString();

		db.run(
			`INSERT INTO mods (mod_id, name, current_version, last_checked_version, last_updated) VALUES (?, ?, ?, ?, ?)`,
			[
				modId,
				data.data.name,
				latestVersion,
				latestVersion,
				new Date().toISOString(),
			],
			(err) => {
				if (err) {
					console.error(err);
					event.reply("add-mod-result", { success: false, error: err.message });
				} else {
					event.reply("add-mod-result", { success: true, mod: data.data });
				}
			}
		);
	} catch (error) {
		console.error(`Error adding mod ${modId}:`, error);
		event.reply("add-mod-result", { success: false, error: error.message });
	}
});

ipcMain.on("check-updates", (event) => {
	checkForUpdates();
});

ipcMain.on("get-mods", (event) => {
	db.all(`SELECT * FROM mods`, (err, rows) => {
		if (err) {
			console.error(err);
			event.reply("get-mods-result", { success: false, error: err.message });
		} else {
			event.reply("get-mods-result", { success: true, mods: rows });
		}
	});
});

ipcMain.on("delete-mod", (event, modId) => {
	db.run(`DELETE FROM mods WHERE mod_id = ?`, [modId], (err) => {
		if (err) {
			console.error(err);
			event.reply("delete-mod-result", { success: false, error: err.message });
		} else {
			event.reply("delete-mod-result", { success: true, modId: modId });
		}
	});
});

ipcMain.on("add-webhook", (event, url) => {
	db.run(`INSERT OR IGNORE INTO webhooks (url) VALUES (?)`, [url], (err) => {
		if (err) {
			console.error("Error saving Discord webhook URL:", err);
			event.reply("add-webhook-result", { success: false, error: err.message });
		} else {
			event.reply("add-webhook-result", { success: true });
		}
	});
});

ipcMain.on("get-webhooks", (event) => {
	db.all(`SELECT * FROM webhooks`, (err, rows) => {
		if (err) {
			console.error(err);
			event.reply("get-webhooks-result", {
				success: false,
				error: err.message,
			});
		} else {
			event.reply("get-webhooks-result", { success: true, webhooks: rows });
		}
	});
});

ipcMain.on("delete-webhook", (event, id) => {
	db.run(`DELETE FROM webhooks WHERE id = ?`, [id], (err) => {
		if (err) {
			console.error(err);
			event.reply("delete-webhook-result", {
				success: false,
				error: err.message,
			});
		} else {
			event.reply("delete-webhook-result", { success: true, id: id });
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
