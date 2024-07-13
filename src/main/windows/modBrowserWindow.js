const { BrowserWindow, BrowserView } = require("electron");
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
			devTools: true,
		},
	});

	win.setBrowserView(view);
	view.setBounds({ x: 0, y: 30, width: 1300, height: 770 });

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

	const preloadScript = `
        (function() {
            const style = document.createElement('style');
            style.textContent = ${JSON.stringify(scrollbarCSS)};
            (document.head || document.documentElement).appendChild(style);
            
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                node.style.setProperty('scrollbar-width', 'thin', 'important');
                                node.style.setProperty('scrollbar-color', '#888 #1e1e1e', 'important');
                            }
                        });
                    }
                });
            });
            
            observer.observe(document.documentElement, { 
                childList: true, 
                subtree: true 
            });
        })();
    `;

	view.webContents.on("dom-ready", () => {
		view.webContents.executeJavaScript(preloadScript);
	});

	view.webContents.on("did-start-navigation", () => {
		view.webContents.insertCSS(scrollbarCSS);
	});

	view.webContents.on("did-finish-load", () => {
		view.webContents.insertCSS(scrollbarCSS);
		if (!win.isVisible()) {
			win.show();
		}
	});

	view.webContents.loadURL(url);

	const htmlPath = path.join(
		__dirname,
		"../../renderer/mod_browser_window/modBrowser.html"
	);
	win.loadFile(htmlPath);

	win.webContents.on("did-finish-load", () => {
		win.webContents.send("update-url", url);
	});

	win.on("resize", () => {
		const { width, height } = win.getBounds();
		view.setBounds({ x: 0, y: 30, width, height: height - 30 });
	});

	return { window: win, view: view };
}

module.exports = createModBrowserWindow;
