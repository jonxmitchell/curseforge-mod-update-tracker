function createModBrowserHeader() {
	const header = document.createElement("header");
	header.className =
		"app-header bg-darker-surface text-white p-1 flex justify-between items-center w-full fixed top-0 left-0 right-0 z-50";
	header.innerHTML = `
    <div class="flex-grow drag-handle"></div>
    <div class="window-controls flex mr-2">
      <button id="minimizeBtn" class="window-control-button" aria-label="Minimize">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
      </button>
      <button id="maximizeBtn" class="window-control-button" aria-label="Maximize">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm1 0v12h12V4H4z" clip-rule="evenodd"></path></svg>
      </button>
      <button id="closeBtn" class="window-control-button" aria-label="Close">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
      </button>
    </div>
  `;
	return header;
}

module.exports = createModBrowserHeader;
