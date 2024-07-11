module.exports = function webhookLayout() {
	return `
    <div class="hidden p-4 rounded-lg" id="webhook-layout" role="tabpanel" aria-labelledby="webhook-layout-tab">
      <h3 class="text-xl font-bold mb-4">Webhook Layout</h3>
      <div class="space-y-4">
        <div>
          <label for="webhookText" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Webhook Text (outside embed)</label>
          <textarea id="webhookText" rows="3" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-800 rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter webhook text..."></textarea>
        </div>
        <div>
          <label for="embedTitle" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Embed Title</label>
          <input type="text" id="embedTitle" class="bg-gray-800 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400 dark:text-white" placeholder="Enter embed title...">
        </div>
        <div>
          <label for="embedText" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Embed Text</label>
          <textarea id="embedText" rows="3" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-800 rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter embed text..."></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="footerText" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Footer Text</label>
            <input type="text" id="footerText" class="bg-gray-800 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400 dark:text-white" placeholder="Enter footer text...">
          </div>
          <div>
            <label for="footerIcon" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Footer Icon URL</label>
            <input type="url" id="footerIcon" class="bg-gray-800 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400 dark:text-white" placeholder="Enter footer icon URL...">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="authorName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Author Name</label>
            <input type="text" id="authorName" class="bg-gray-800 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400 dark:text-white" placeholder="Enter author name...">
          </div>
          <div>
            <label for="authorIcon" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Author Icon URL</label>
            <input type="url" id="authorIcon" class="bg-gray-800 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400 dark:text-white" placeholder="Enter author icon URL...">
          </div>
        </div>
        <div>
          <label for="embedColor" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Embed Color</label>
          <div class="relative flex items-center w-1/2">
            <div id="colorPreview" class="absolute left-2 w-6 h-6 rounded pointer-events-none"></div>
            <input type="text" id="embedColor" class="bg-gray-800 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:placeholder-gray-400 dark:text-white" placeholder="#03EAF7">
            <input type="color" id="embedColorPicker" class="absolute left-2 opacity-0 w-6 h-6 cursor-pointer">
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" id="showDate" value="" class="sr-only peer">
            <div class="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Show date in footer</span>
          </label>
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" id="showImage" value="" class="sr-only peer">
            <div class="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Show mod image in embed</span>
          </label>
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
            <li>{&roleID} - Mention a role (e.g., {&123456789})</li>
            <li>{#channelID} - Channel link (e.g., {#987654321})</li>
            <li>{lastestModFileName} - Latest mod file name</li>
            <li>{modAuthorName} - Mod author name</li>
          </ul>
        </div>
        <button id="saveWebhookLayout" class="custom-button">Save Webhook Layout</button>
      </div>
    </div>
  `;
};
