const { app, BrowserWindow } = require("electron");
const path = require("path");
const { initDatabase } = require("../database/connection");
const setupModIPC = require("./ipc/modIPC");
const setupWebhookIPC = require("./ipc/webhookIPC");
const setupSettingsIPC = require("./ipc/settingsIPC");
const { setupUpdateIPC } = require("./ipc/updateIPC");

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
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
