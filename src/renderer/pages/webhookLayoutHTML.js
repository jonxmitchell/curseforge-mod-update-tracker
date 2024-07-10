module.exports = function webhookLayout() {
	return `
      <div class="hidden p-4 rounded-lg" id="webhook-layout" role="tabpanel" aria-labelledby="webhook-layout-tab">
        <h3 class="text-xl font-bold mb-4">Webhook Layout</h3>
        <div class="space-y-4">
          <div>
            <label for="webhookText" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Webhook Text (outside embed)</label>
            <textarea id="webhookText" rows="3" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter webhook text..."></textarea>
          </div>
          <div>
            <label for="embedTitle" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Embed Title</label>
            <input type="text" id="embedTitle" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter embed title...">
          </div>
          <div>
            <label for="embedText" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Embed Text</label>
            <textarea id="embedText" rows="3" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter embed text..."></textarea>
          </div>
          <div class="flex items-center">
            <input id="showDate" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="showDate" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Show date in footer</label>
          </div>
          <div class="flex items-center">
            <input id="showImage" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="showImage" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Show mod image in embed</label>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-2">Available Variables</h4>
            <ul class="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
              <li>{modID} - Mod ID</li>
              <li>{newReleaseDate} - New release date</li>
              <li>{oldPreviousDate} - Previous release date</li>
              <li>{modName} - Mod name</li>
              <li>{everyone} - @everyone mention</li>
              <li>{here} - @here mention</li>
              <li>{&role} - Mention a role (e.g., {&Gamers})</li>
              <li>{#channel} - Channel link (e.g., {#testing})</li>
              <li>{modUrlDownloadLink} - Mod download link</li>
            </ul>
          </div>
          <button id="saveWebhookLayout" class="custom-button">Save Webhook Layout</button>
        </div>
      </div>
    `;
};
