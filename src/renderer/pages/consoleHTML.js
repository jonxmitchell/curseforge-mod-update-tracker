module.exports = function console() {
	return `
    <div class="hidden p-4 rounded-lg" id="console" role="tabpanel" aria-labelledby="console-tab">
      <h3 class="text-xl font-bold mb-4">Console</h3>
      <div id="consoleContainer" class="console-container">
        <div id="consoleOutput" class="bg-darker-surface text-gray-300 p-4 rounded overflow-y-auto font-mono text-sm mb-4 border border-gray-700"></div>
        <div class="flex justify-between">
          <button id="clearConsoleButton" class="custom-button">Clear Console</button>
          <button id="openLogsFolder" class="custom-button">Open Logs Folder</button>
        </div>
      </div>
    </div>
  `;
};
