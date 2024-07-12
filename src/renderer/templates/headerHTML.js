module.exports = function header() {
	return `
  <header class="app-header bg-darker-surface text-white p-1 flex justify-end items-center w-full fixed top-0 left-0 z-50">
      <div class="window-controls flex mr-2">
          <button id="minimizeBtn" class="mac-button minimize" aria-label="Minimize"></button>
          <button id="maximizeBtn" class="mac-button maximize" aria-label="Maximize"></button>
          <button id="closeBtn" class="mac-button close" aria-label="Close"></button>
          </div>
  </header>
`;
};
