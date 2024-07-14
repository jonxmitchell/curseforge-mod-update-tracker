const { BrowserWindow, BrowserView, session, Menu } = require("electron");
const path = require("path");

function createModBrowserWindow(url) {
	const win = new BrowserWindow({
		width: 1300,
		height: 800,
		frame: false,
		show: false,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, "modBrowserPreload.js"),
		},
	});

	const view = new BrowserView({
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	win.setBrowserView(view);
	view.setBounds({ x: 0, y: 30, width: 1300, height: 770 });
	view.setAutoResize({ width: true, height: true });

	const htmlPath = path.join(
		__dirname,
		"../../renderer/mod_browser_window/modBrowser.html"
	);
	win.loadFile(htmlPath);

	// Define scrollbar CSS
	const scrollbarCSS = `
        ::-webkit-scrollbar {
            width: 3px !important;
            height: 3px !important;
        }
        ::-webkit-scrollbar-track {
            background: #1e1e1e !important;
        }
        ::-webkit-scrollbar-thumb {
            background: #888 !important;
            border-radius: 5px !important;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555 !important;
        }
        * {
            scrollbar-width: thin !important;
            scrollbar-color: #888 #1e1e1e !important;
        }
    `;

	// Inject CSS as soon as possible
	view.webContents.on("did-start-loading", () => {
		view.webContents.insertCSS(scrollbarCSS);
	});

	// Load the URL
	view.webContents.loadURL(url);

	view.webContents.on("did-finish-load", () => {
		win.webContents.send("update-url", view.webContents.getURL());
	});

	// Handle new window creation
	view.webContents.setWindowOpenHandler(({ url }) => {
		view.webContents.loadURL(url);
		return { action: "deny" };
	});

	// Allow all navigation
	view.webContents.on("will-navigate", (event, navigationUrl) => {
		win.webContents.send("update-url", navigationUrl);
	});

	win.once("ready-to-show", () => {
		win.show();
	});

	// Add context menu
	view.webContents.on("context-menu", (event, params) => {
		const menu = Menu.buildFromTemplate([
			{ role: "cut" },
			{ role: "copy" },
			{ role: "paste" },
			{ type: "separator" },
			{ role: "selectAll" },
		]);

		menu.popup(view.webContents);
	});

	// Clear session data when window is closed
	win.on("closed", () => {
		session.defaultSession.clearStorageData({
			storages: [
				"appcache",
				"filesystem",
				"indexdb",
				"localstorage",
				"shadercache",
				"websql",
				"serviceworkers",
				"cachestorage",
			],
		});
	});

	return { window: win, view: view };
}

module.exports = createModBrowserWindow;
