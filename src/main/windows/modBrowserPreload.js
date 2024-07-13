const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
	minimize: () => ipcRenderer.send("minimize-mod-window"),
	maximize: () => ipcRenderer.send("maximize-mod-window"),
	close: () => ipcRenderer.send("close-mod-window"),
	loadURL: (url) => ipcRenderer.send("load-url", url),
	onUpdateUrl: (callback) => ipcRenderer.on("update-url", callback),
});
