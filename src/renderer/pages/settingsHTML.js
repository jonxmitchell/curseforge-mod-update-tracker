// src/renderer/pages/settingsHTML.js

module.exports = function settings() {
	return `
    <div class="hidden p-4 rounded-lg" id="settings" role="tabpanel" aria-labelledby="settings-tab">
      <h3 class="text-xl font-bold mb-4">Settings</h3>
      <div class="space-y-6">
        <div class="bg-lighter-black p-4 rounded">
          <h4 class="text-lg font-semibold mb-2">CurseForge API Key</h4>
          <div class="flex flex-wrap items-center gap-4">
            <div class="relative flex-grow min-w-[200px]">
              <div class="flex">
                <input type="password" id="apiKeyInput" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 pr-10" placeholder="Enter API Key" />
                <button id="toggleApiKeyVisibility" type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500">
                  <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 14">
                    <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                      <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      <path d="M10 13c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6Z" />
                    </g>
                  </svg>
                </button>
              </div>
            </div>
            <button id="saveApiKeyButton" class="custom-button">Save API Key</button>
          </div>
        </div>
        <div class="bg-lighter-black p-4 rounded">
          <h4 class="text-lg font-semibold mb-2">Update Interval</h4>
          <div class="flex flex-wrap gap-4 items-center">
            <div class="flex-grow min-w-[200px]">
              <input type="range" id="intervalSlider" min="1" max="3600" value="3600" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>
            <div class="flex gap-2">
              <input type="text" id="intervalInput" class="block py-2.5 px-0 w-20 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 text-center" placeholder="Interval" />
              <button id="setIntervalButton" class="custom-button">Set Interval</button>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap gap-4">
          <div class="bg-lighter-black p-4 rounded flex-grow">
            <h4 class="text-lg font-semibold mb-2">Tooltips</h4>
            <label class="inline-flex items-center cursor-pointer">
              <input type="checkbox" id="tooltipToggle" value="" class="sr-only peer">
              <div class="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Enable Tooltips</span>
            </label>
          </div>
          <div class="bg-lighter-black p-4 rounded flex-grow">
            <h4 class="text-lg font-semibold mb-2">Open Mod Links</h4>
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <input id="inApp" type="radio" value="inApp" name="openLinkPreference" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label for="inApp" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">In Application</label>
              </div>
              <div class="flex items-center">
                <input id="inBrowser" type="radio" value="inBrowser" name="openLinkPreference" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label for="inBrowser" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">In Browser</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};
