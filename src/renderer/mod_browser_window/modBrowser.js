// src/renderer/mod_browser_window/modBrowser.js

function createModBrowserHeader() {
	const header = document.createElement("header");
	header.className =
		"app-header bg-darker-surface text-white p-1 flex justify-between items-center w-full fixed top-0 left-0 right-0 z-50";
	header.innerHTML = `
	  <div class="navigation-controls flex items-center ml-2">
		<button id="backBtn" class="nav-button" aria-label="Go Back">
		  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
			<path d="M3.828 7l3.586-3.586L6 2 0 8l6 6 1.414-1.414L3.828 9H16V7H3.828z"/>
		  </svg>
		</button>
		<button id="forwardBtn" class="nav-button" aria-label="Go Forward">
		  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
			<path d="M12.172 7H0v2h12.172l-3.586 3.586L10 14l6-6-6-6-1.414 1.414L12.172 7z"/>
		  </svg>
		</button>
	  </div>
	  <div class="flex-grow drag-handle"></div>
	  <div class="window-controls flex items-center mr-4">
		<button id="minimizeBtn" class="mac-button minimize" aria-label="Minimize"></button>
		<button id="maximizeBtn" class="mac-button maximize" aria-label="Maximize"></button>
		<button id="closeBtn" class="mac-button close" aria-label="Close"></button>
	  </div>
	`;
	return header;
}

document.addEventListener("DOMContentLoaded", () => {
	console.log("ModBrowser DOM loaded");
	const headerContainer = document.getElementById("header-container");
	headerContainer.appendChild(createModBrowserHeader());

	// Add styles
	const style = document.createElement("style");
	style.textContent = `
	  body {
		margin: 0;
		padding: 0;
		overflow: hidden;
	  }
	  .app-header {
		-webkit-app-region: drag;
		height: 30px;
		background-color: #1e1e1e;
		display: flex;
		justify-content: space-between;
		align-items: center;
	  }
	  .app-header button {
		-webkit-app-region: no-drag;
	  }
	  .navigation-controls, .window-controls {
		display: flex;
		align-items: center;
		margin-right: 15px;
	  }
	  .nav-button {
		background: none;
		border: none;
		color: #ffffff;
		padding: 10px;
		margin: 0 10px;
		cursor: pointer;
		opacity: 0.7;
		transition: all 0.2s;
		border-radius: 4px;
	  }
	  .nav-button:hover {
		opacity: 1;
		background-color: rgba(255, 255, 255, 0.1);
	  }
	  .nav-button:active {
		background-color: rgba(255, 255, 255, 0.2);
	  }
	  .mac-button {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		margin-left: 8px;
		border: none;
		outline: none;
		transition: opacity 0.2s;
		cursor: pointer;
	  }
	  .mac-button:hover {
		opacity: 0.7;
	  }
	  .mac-button.close {
		background-color: #ff5f56;
	  }
	  .mac-button.minimize {
		background-color: #ffbd2e;
	  }
	  .mac-button.maximize {
		background-color: #27c93f;
	  }
	  #content-container {
		position: fixed;
		top: 30px;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: white;
	  }
	  
	  /* Scrollbar styles */
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
	`;
	document.head.appendChild(style);

	const backBtn = document.getElementById("backBtn");
	const forwardBtn = document.getElementById("forwardBtn");
	const minimizeBtn = document.getElementById("minimizeBtn");
	const maximizeBtn = document.getElementById("maximizeBtn");
	const closeBtn = document.getElementById("closeBtn");

	console.log("Window controls:", {
		backBtn,
		forwardBtn,
		minimizeBtn,
		maximizeBtn,
		closeBtn,
	});

	if (backBtn)
		backBtn.addEventListener("click", () => window.electron.goBack());
	if (forwardBtn)
		forwardBtn.addEventListener("click", () => window.electron.goForward());
	if (minimizeBtn)
		minimizeBtn.addEventListener("click", () => window.electron.minimize());
	if (maximizeBtn)
		maximizeBtn.addEventListener("click", () => window.electron.maximize());
	if (closeBtn)
		closeBtn.addEventListener("click", () => window.electron.close());

	console.log("ModBrowser script executed");
});
