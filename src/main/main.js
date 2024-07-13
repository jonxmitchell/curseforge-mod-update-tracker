const { app, BrowserWindow, ipcMain, shell, Menu } = require("electron");
const path = require("path");
const { initDatabase } = require("../database/connection");
const setupModIPC = require("./ipc/modIPC");
const setupWebhookIPC = require("./ipc/webhookIPC");
const setupSettingsIPC = require("./ipc/settingsIPC");
const { setupUpdateIPC } = require("./ipc/updateIPC");
const { getWebhooks } = require("../database/webhooksDB");
const { getModWebhooks } = require("../database/modWebhooksDB");
const logger = require("../renderer/utils/logger");
const createModBrowserWindow = require("./windows/modBrowserWindow");

let mainWindow;
let modBrowserView = null;

function createWindow() {
	mainWindow = new BrowserWindow({
		minWidth: 800,
		minHeight: 600,
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
		if (modBrowserView && !modBrowserView.window.isDestroyed()) {
			modBrowserView.view.webContents.loadURL(url);
			modBrowserView.window.show();
		} else {
			const { window, view } = createModBrowserWindow(url);
			modBrowserView = { window, view };

			modBrowserView.window.on("closed", () => {
				if (modBrowserView) {
					modBrowserView.view = null;
					modBrowserView.window = null;
					modBrowserView = null;
				}
			});

			ipcMain.on("minimize-mod-window", () => {
				if (modBrowserView && !modBrowserView.window.isDestroyed()) {
					modBrowserView.window.minimize();
				}
			});
			ipcMain.on("maximize-mod-window", () => {
				if (modBrowserView && !modBrowserView.window.isDestroyed()) {
					if (modBrowserView.window.isMaximized()) {
						modBrowserView.window.unmaximize();
					} else {
						modBrowserView.window.maximize();
					}
				}
			});
			ipcMain.on("close-mod-window", () => {
				if (modBrowserView && !modBrowserView.window.isDestroyed()) {
					modBrowserView.window.close();
				}
			});
			ipcMain.on("load-url", (event, newUrl) => {
				if (modBrowserView && !modBrowserView.window.isDestroyed()) {
					modBrowserView.view.webContents.loadURL(newUrl);
					modBrowserView.window.webContents.send("update-url", newUrl);
				}
			});

			modBrowserView.window.on("resize", () => {
				if (modBrowserView && !modBrowserView.window.isDestroyed()) {
					const { width, height } = modBrowserView.window.getBounds();
					modBrowserView.view.setBounds({
						x: 0,
						y: 30,
						width,
						height: height - 30,
					});
				}
			});
		}
	});

	ipcMain.on("open-external", (event, url) => {
		shell.openExternal(url);
	});

	mainWindow.webContents.on("did-finish-load", () => {
		mainWindow.webContents.send("initialize-pause-resume-button");
	});
});

app.on("window-all-closed", () => {
	modBrowserView = null;
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

ipcMain.on("open-dev-tools", () => {
	if (modBrowserView && !modBrowserView.window.isDestroyed()) {
		modBrowserView.view.webContents.openDevTools();
	}
});

ipcMain.on("go-back", () => {
	if (
		modBrowserView &&
		!modBrowserView.window.isDestroyed() &&
		modBrowserView.view.webContents.canGoBack()
	) {
		modBrowserView.view.webContents.goBack();
	}
});

ipcMain.on("go-forward", () => {
	if (
		modBrowserView &&
		!modBrowserView.window.isDestroyed() &&
		modBrowserView.view.webContents.canGoForward()
	) {
		modBrowserView.view.webContents.goForward();
	}
});
