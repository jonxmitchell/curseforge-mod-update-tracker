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
        <div class="bg-lighter-black p-4 rounded mt-8">
          <h4 class="text-lg font-semibold mb-2">Credits</h4>
          <p class="text-sm text-gray-300 mb-2">Developed by <a id="openArtiDiscord" rel="noopener noreferrer" class="cursor-pointer text-blue-400 hover:text-blue-300">arti.artificial</a></p>
          <p class="text-sm text-gray-300 mb-2">Code logic assistance by <a id="openVasGithub" rel="noopener noreferrer" class="cursor-pointer text-blue-400 hover:text-blue-300">vasilejianu</a></p>
          <div class="flex space-x-4">
            <button id="openGithub" class="text-blue-500 hover:text-blue-400 transition-colors">
              <svg class="w-6 h-6 inline-block mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub Repo
            </button>
            <button id="openKofi" class="text-blue-500 hover:text-blue-400 transition-colors">
              <svg class="w-6 h-6 inline-block mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
              </svg>
              Support me on Ko-fi
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
};
