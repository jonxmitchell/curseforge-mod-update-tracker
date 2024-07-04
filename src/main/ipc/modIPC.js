const { ipcMain } = require("electron");
const { getMods, addMod, deleteMod } = require("../../database/modsDB");
const { getSetting } = require("../../database/settingsDB");
const fetch = require("node-fetch");

function setupModIPC(mainWindow) {
	ipcMain.on("get-mods", async (event) => {
		try {
			const mods = await getMods();
			event.reply("get-mods-result", { success: true, mods });
		} catch (error) {
			event.reply("get-mods-result", { success: false, error: error.message });
		}
	});

	ipcMain.on("add-mod", async (event, modId) => {
		try {
			const apiKey = await getSetting("curseforge_api_key");
			if (!apiKey) {
				throw new Error("CurseForge API key not set");
			}

			const response = await fetch(
				`https://api.curseforge.com/v1/mods/${modId}`,
				{
					headers: { "x-api-key": apiKey },
				}
			);
			const data = await response.json();

			if (!data.data) {
				throw new Error(
					`Invalid API response structure: ${JSON.stringify(data)}`
				);
			}

			// Fetch game information
			const gameResponse = await fetch(
				`https://api.curseforge.com/v1/games/${data.data.gameId}`,
				{
					headers: { "x-api-key": apiKey },
				}
			);
			const gameData = await gameResponse.json();

			if (!gameData.data) {
				throw new Error(
					`Invalid game API response structure: ${JSON.stringify(gameData)}`
				);
			}

			const gameName = gameData.data.name;

			await addMod(
				modId,
				data.data.name,
				gameName,
				data.data.summary,
				data.data.authors[0].name,
				data.data.downloadCount,
				data.data.links?.websiteUrl || "https://www.curseforge.com",
				data.data.dateReleased || "N/A",
				data.data.dateReleased || "N/A",
				data.data.dateModified || new Date().toISOString()
			);
			event.reply("add-mod-result", { success: true, mod: data.data });
		} catch (error) {
			event.reply("add-mod-result", { success: false, error: error.message });
		}
	});

	ipcMain.on("delete-mod", async (event, modId) => {
		try {
			await deleteMod(modId);
			event.reply("delete-mod-result", { success: true, modId });
		} catch (error) {
			event.reply("delete-mod-result", {
				success: false,
				error: error.message,
			});
		}
	});
}

module.exports = setupModIPC;
