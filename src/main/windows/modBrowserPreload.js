const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
	minimize: () => ipcRenderer.send("minimize-mod-window"),
	maximize: () => ipcRenderer.send("maximize-mod-window"),
	close: () => ipcRenderer.send("close-mod-window"),
	goBack: () => ipcRenderer.send("go-back"),
	goForward: () => ipcRenderer.send("go-forward"),
	reload: () => ipcRenderer.send("reload"),
	onUpdateUrl: (callback) =>
		ipcRenderer.on("update-url", (event, url) => callback(url)),
});
