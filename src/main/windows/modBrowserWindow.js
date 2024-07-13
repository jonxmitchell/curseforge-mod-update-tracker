const { BrowserWindow, BrowserView } = require("electron");
const path = require("path");

function createModBrowserWindow(url) {
	console.log("Creating mod browser window");
	const win = new BrowserWindow({
		width: 1300,
		height: 800,
		frame: false,
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
			devTools: true,
		},
	});

	win.setBrowserView(view);
	view.setBounds({ x: 0, y: 30, width: 1300, height: 800 });
	view.webContents.loadURL(url);

	const htmlPath = path.join(__dirname, "../../renderer/modBrowser.html");
	console.log("Loading HTML file:", htmlPath);
	win.loadFile(htmlPath);

	win.webContents.on("did-finish-load", () => {
		console.log("Mod browser window finished loading");
		win.webContents.send("update-url", url);
	});

	view.webContents.on("did-finish-load", () => {
		view.webContents.insertCSS(`
      ::-webkit-scrollbar {
        width: 3px;
      }
      
      ::-webkit-scrollbar-track {
        background: #1e1e1e;
      }
      
      ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 5px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    `);
	});

	win.on("resize", () => {
		const { width, height } = win.getBounds();
		view.setBounds({ x: 0, y: 30, width, height: height - 30 });
	});

	return { window: win, view: view };
}

module.exports = createModBrowserWindow;
