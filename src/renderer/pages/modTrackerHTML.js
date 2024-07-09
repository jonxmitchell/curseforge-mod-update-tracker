module.exports = function modTracker() {
	return `
      <div class="hidden p-4 rounded-lg" id="mods" role="tabpanel" aria-labelledby="mods-tab">
        <h3 class="text-xl font-bold mb-4">Mod Tracker</h3>
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="relative z-0 flex-grow min-w-[200px]">
            <input type="text" id="modSearchInput" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
            <label for="modSearchInput" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Enter mod ID</label>
          </div>
          <button id="addModButton" class="custom-button">Add Mod</button>
        </div>
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="relative z-0 flex-grow min-w-[200px]">
            <input type="text" id="filterModInput" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer pr-8" placeholder=" " />
            <label for="filterModInput" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Search tracked mods</label>
            <button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 clear-mod-search">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <button id="pauseResumeButton" class="custom-button">Pause</button>
          <button id="checkUpdatesButton" class="custom-button">Check for updates</button>
        </div>
        <div id="updateCountdown" class="flex flex-wrap justify-between items-center mb-6">
          <div class="flex items-center mb-2 sm:mb-0">
            <span>Checking for updates in:</span>
            <span class="bg-gray-700 px-2 py-1 mx-2 rounded" id="hours">00</span>
            <span class="bg-gray-700 px-2 py-1 mx-2 rounded" id="minutes">00</span>
            <span class="bg-gray-700 px-2 py-1 mx-2 rounded" id="seconds">00</span>
          </div>
          <span class="total-mods">Total mods: <span class="mod-count bg-gray-700 px-2 py-1 rounded">0</span></span>
        </div>
        <div id="modList" class="space-y-4"></div>
      </div>
    `;
};
