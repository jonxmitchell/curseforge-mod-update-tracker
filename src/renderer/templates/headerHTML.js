// src/renderer/templates/headerHTML.js

module.exports = function header() {
	return `
    <header class="app-header bg-darker-surface text-white p-1 flex justify-end items-center w-full fixed top-0 left-0 z-50">
      <div class="window-controls flex">
        <button id="minimizeBtn" class="px-3 py-1 hover:bg-gray-700 focus:outline-none">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
          </svg>
        </button>
        <button id="maximizeBtn" class="px-3 py-1 hover:bg-gray-700 focus:outline-none">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"></path>
          </svg>
        </button>
        <button id="closeBtn" class="px-3 py-1 hover:bg-red-600 focus:outline-none">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </header>
  `;
};
