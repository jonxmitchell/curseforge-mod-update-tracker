document.addEventListener("DOMContentLoaded", () => {
	console.log("ModBrowser DOM loaded");
	const headerContainer = document.getElementById("header-container");

	// Create header manually
	const header = document.createElement("header");
	header.className =
		"app-header bg-darker-surface text-white p-1 flex justify-between items-center w-full fixed top-0 left-0 right-0 z-50";
	header.innerHTML = `
	  <div class="flex-grow drag-handle"></div>
	  <div class="window-controls flex mr-2">
		<button id="minimizeBtn" class="mac-button minimize" aria-label="Minimize"></button>
		<button id="maximizeBtn" class="mac-button maximize" aria-label="Maximize"></button>
		<button id="closeBtn" class="mac-button close" aria-label="Close"></button>
	  </div>
	`;
	headerContainer.appendChild(header);

	// Add styles
	const style = document.createElement("style");
	style.textContent = `
	  .app-header {
		-webkit-app-region: drag;
		height: 30px;
	  }
	  .app-header input,
	  .app-header button {
		-webkit-app-region: no-drag;
	  }
	  .window-controls {
		display: flex;
		align-items: center;
	  }
	  .mac-button {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		margin-left: 8px;
		border: none;
		outline: none;
		transition: opacity 0.2s;
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
	  #urlInput {
		width: 100%;
		max-width: 600px;
	  }
  
	  /* Custom Scrollbar Styles */
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

	const minimizeBtn = document.getElementById("minimizeBtn");
	const maximizeBtn = document.getElementById("maximizeBtn");
	const closeBtn = document.getElementById("closeBtn");
	const urlInput = document.getElementById("urlInput");

	console.log("Window controls:", { minimizeBtn, maximizeBtn, closeBtn });

	if (minimizeBtn)
		minimizeBtn.addEventListener("click", () => window.electron.minimize());
	if (maximizeBtn)
		maximizeBtn.addEventListener("click", () => window.electron.maximize());
	if (closeBtn)
		closeBtn.addEventListener("click", () => window.electron.close());

	if (urlInput) {
		urlInput.addEventListener("keypress", (e) => {
			if (e.key === "Enter") {
				const url = urlInput.value;
				if (url) {
					window.electron.loadURL(url);
				}
			}
		});

		// Prevent dragging on input field
		urlInput.addEventListener("mousedown", (e) => {
			e.stopPropagation();
		});
	}

	window.electron.onUpdateUrl((event, url) => {
		if (urlInput) urlInput.value = url;
	});

	console.log("ModBrowser script executed");
});
