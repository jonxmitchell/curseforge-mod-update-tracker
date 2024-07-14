const {
	app,
	BrowserWindow,
	BrowserView,
	ipcMain,
	shell,
	Menu,
} = require("electron");
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
let modBrowserWindow = null;
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

	mainWindow.on("close", (event) => {
		if (modBrowserWindow && !modBrowserWindow.isDestroyed()) {
			event.preventDefault(); // Prevent the main window from closing immediately
			modBrowserWindow.close(); // Close the mod browser window
			modBrowserWindow = null;
			modBrowserView = null;
			mainWindow.close(); // Now close the main window
		}
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
		if (modBrowserWindow && !modBrowserWindow.isDestroyed()) {
			modBrowserView.webContents.loadURL(url);
			modBrowserWindow.show();
		} else {
			const { window, view } = createModBrowserWindow(url);
			modBrowserWindow = window;
			modBrowserView = view;

			modBrowserWindow.on("closed", () => {
				modBrowserWindow = null;
				modBrowserView = null;
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
	if (modBrowserWindow && !modBrowserWindow.isDestroyed()) {
		modBrowserWindow.destroy();
	}
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
	if (modBrowserWindow && !modBrowserWindow.isDestroyed()) {
		modBrowserWindow.webContents.openDevTools();
	}
});

ipcMain.on("minimize-mod-window", () => {
	if (modBrowserWindow && !modBrowserWindow.isDestroyed()) {
		modBrowserWindow.minimize();
	}
});

ipcMain.on("maximize-mod-window", () => {
	if (modBrowserWindow && !modBrowserWindow.isDestroyed()) {
		if (modBrowserWindow.isMaximized()) {
			modBrowserWindow.unmaximize();
		} else {
			modBrowserWindow.maximize();
		}
	}
});

ipcMain.on("close-mod-window", () => {
	if (modBrowserWindow && !modBrowserWindow.isDestroyed()) {
		modBrowserWindow.close();
	}
});

ipcMain.on("go-back", () => {
	if (modBrowserView && modBrowserView.webContents.canGoBack()) {
		modBrowserView.webContents.goBack();
	}
});

ipcMain.on("go-forward", () => {
	if (modBrowserView && modBrowserView.webContents.canGoForward()) {
		modBrowserView.webContents.goForward();
	}
});

ipcMain.on("reload", () => {
	if (modBrowserView) {
		modBrowserView.webContents.reload();
	}
});

ipcMain.on("open-external-link", (event, url) => {
	shell.openExternal(url);
});
