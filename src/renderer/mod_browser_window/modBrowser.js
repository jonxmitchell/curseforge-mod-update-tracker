document.addEventListener("DOMContentLoaded", () => {
	console.log("DOM fully loaded and parsed");

	const backBtn = document.getElementById("backBtn");
	const forwardBtn = document.getElementById("forwardBtn");
	const reloadBtn = document.getElementById("reloadBtn");
	const minimizeBtn = document.getElementById("minimizeBtn");
	const maximizeBtn = document.getElementById("maximizeBtn");
	const closeBtn = document.getElementById("closeBtn");
	const urlBar = document.getElementById("urlBar");

	if (backBtn)
		backBtn.addEventListener("click", () => window.electron.goBack());
	if (forwardBtn)
		forwardBtn.addEventListener("click", () => window.electron.goForward());
	if (reloadBtn)
		reloadBtn.addEventListener("click", () => window.electron.reload());
	if (minimizeBtn)
		minimizeBtn.addEventListener("click", () => window.electron.minimize());
	if (maximizeBtn)
		maximizeBtn.addEventListener("click", () => window.electron.maximize());
	if (closeBtn)
		closeBtn.addEventListener("click", () => window.electron.close());

	window.electron.onUpdateUrl((url) => {
		console.log("URL updated:", url);
		urlBar.value = url;
	});

	console.log("Event listeners set up");
});
