module.exports = function console() {
	return `
      <div class="hidden p-4 rounded-lg" id="console" role="tabpanel" aria-labelledby="console-tab">
        <h3 class="text-xl font-bold mb-4">Console</h3>
        <div id="consoleOutput" class="bg-gray-900 p-4 rounded h-64 overflow-y-auto font-mono text-sm mb-4"></div>
        <button id="clearConsoleButton" class="custom-button">Clear Console</button>
      </div>
    `;
};
