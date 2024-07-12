const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const { initDatabase } = require("../database/connection");
const setupModIPC = require("./ipc/modIPC");
const setupWebhookIPC = require("./ipc/webhookIPC");
const setupSettingsIPC = require("./ipc/settingsIPC");
const { setupUpdateIPC } = require("./ipc/updateIPC");
const { getWebhooks } = require("../database/webhooksDB");
const { getModWebhooks } = require("../database/modWebhooksDB");
const logger = require("../renderer/utils/logger");

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		icon: path.join(__dirname, "../../assets/imgs/logo.png"),
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			contentSecurityPolicy: "script-src 'self' 'unsafe-inline';",
		},
	});

	mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));

	const originalConsoleLog = console.log;
	console.log = function (...args) {
		originalConsoleLog.apply(console, args);
		if (mainWindow && mainWindow.webContents) {
			mainWindow.webContents.send("main-process-log", args.join(" "));
		}
	};

	// Enable right-click context menu
	mainWindow.webContents.on("context-menu", (event, params) => {
		const menu = Menu.buildFromTemplate([
			{ role: "cut" },
			{ role: "copy" },
			{ role: "paste" },
			{ type: "separator" },
			{ role: "selectAll" },
		]);

		menu.popup(mainWindow, params.x, params.y);
	});
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

ipcMain.on("log-to-file", (event, message) => {
	logger.log(message);
});

ipcMain.on("minimize-window", () => {
	mainWindow.minimize();
});

ipcMain.on("maximize-window", () => {
	if (mainWindow.isMaximized()) {
		mainWindow.unmaximize();
	} else {
		mainWindow.maximize();
	}
});

ipcMain.on("close-window", () => {
	mainWindow.close();
});
