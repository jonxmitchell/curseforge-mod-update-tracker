const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const { initDatabase } = require("../database/connection");
const setupModIPC = require("./ipc/modIPC");
const setupWebhookIPC = require("./ipc/webhookIPC");
const setupSettingsIPC = require("./ipc/settingsIPC");
const { setupUpdateIPC } = require("./ipc/updateIPC");
const { getWebhooks } = require("../database/webhooksDB");
const { getModWebhooks } = require("../database/modWebhooksDB");

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			contentSecurityPolicy: "script-src 'self' 'unsafe-inline';",
		},
	});

	mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
}

app.whenReady().then(() => {
	createWindow();
	initDatabase();

	setupModIPC(mainWindow);
	setupWebhookIPC(mainWindow);
	setupSettingsIPC(mainWindow);
	setupUpdateIPC(mainWindow);

	ipcMain.handle("get-webhooks", async () => {
		try {
			return await getWebhooks();
		} catch (error) {
			console.error("Error getting webhooks:", error);
			throw error;
		}
	});

	ipcMain.on("open-in-app", (event, url) => {
		const win = new BrowserWindow({
			width: 800,
			height: 600,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
			},
		});
		win.loadURL(url);
	});

	mainWindow.webContents.on("did-finish-load", () => {
		mainWindow.webContents.send("initialize-pause-resume-button");
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
