// src/renderer/pages/webhookLayoutHTML.js

module.exports = function webhookLayout() {
	return `
    <div class="hidden p-4 rounded-lg" id="webhook-layout" role="tabpanel" aria-labelledby="webhook-layout-tab">
      <h3 class="text-xl font-bold mb-4">Webhook Formatter</h3>
      <div class="space-y-4">
        <div class="formatting-container bg-lighter-black p-4 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <label for="webhookText" class="block text-sm font-medium text-gray-900 dark:text-white">Webhook Text (outside embed)</label>
            <span id="webhookTextCounter" class="text-xs text-gray-500 dark:text-gray-400">0/2000</span>
          </div>
          <div class="w-full mb-4 border border-gray-600 rounded-lg bg-darker-surface">
            <div class="flex items-center justify-between px-3 py-2 border-b rounded-t-lg border-gray-600 bg-darker-surface">
              <div class="flex flex-wrap items-center divide-gray-600 sm:divide-x sm:rtl:divide-x-reverse">
                <div class="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
                  <button type="button" class="p-2 text-gray-400 rounded cursor-pointer hover:text-white hover:bg-gray-700" data-format="bold">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5h4.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0-7H6m2 7h6.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0 0H6"/>
                    </svg>
                    <span class="sr-only">Bold</span>
                  </button>
                  <button type="button" class="p-2 text-gray-400 rounded cursor-pointer hover:text-white hover:bg-gray-700" data-format="italic">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8.874 19 6.143-14M6 19h6.33m-.66-14H18"/>
                    </svg>
                    <span class="sr-only">Italic</span>
                  </button>
                  <button type="button" class="p-2 text-gray-400 rounded cursor-pointer hover:text-white hover:bg-gray-700" data-format="underline">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 19h12M8 5v9a4 4 0 0 0 8 0V5M6 5h4m4 0h4"/>
                    </svg>
                    <span class="sr-only">Underline</span>
                  </button>
                  <button type="button" class="p-2 text-gray-400 rounded cursor-pointer hover:text-white hover:bg-gray-700" data-format="strikethrough">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 6.2V5h12v1.2M7 19h6m.2-14-1.677 6.523M9.6 19l1.029-4M5 5l6.523 6.523M19 19l-7.477-7.477"/>
                    </svg>
                    <span class="sr-only">Strikethrough</span>
                  </button>
                </div>
                <div class="flex flex-wrap items-center space-x-1 rtl:space-x-reverse sm:ps-4">
                  <button type="button" class="p-2 text-gray-400 rounded cursor-pointer hover:text-white hover:bg-gray-700" data-format="list">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"/>
                    </svg>
                    <span class="sr-only">Add list</span>
                  </button>
                  <button type="button" class="p-2 text-gray-400 rounded cursor-pointer hover:text-white hover:bg-gray-700" data-format="code">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14"/>
                    </svg>
                    <span class="sr-only">Code block</span>
                  </button>
                  <button type="button" class="p-2 text-gray-400 rounded cursor-pointer hover:text-white hover:bg-gray-700" data-format="quote">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M6 6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3H5a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2H6Zm9 0a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3h-1a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3Z" clip-rule="evenodd"/>
                    </svg>
                    <span class="sr-only">Quote</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="px-4 py-2 bg-dark-bg rounded-b-lg dark:bg-dark-bg">
              <textarea id="webhookText" rows="1" maxlength="2000" class="block w-full px-0 text-sm text-gray-300 bg-dark-bg border-0 dark:bg-dark-bg focus:ring-0 dark:text-gray-300 dark:placeholder-gray-400 resize-none overflow-hidden" placeholder="Write webhook text..." required></textarea>
            </div>
          </div>
        </div>
        
        <div class="bg-lighter-black p-4 rounded-lg space-y-4">
          <label class="inline-flex items-center mb-5 cursor-pointer">
            <input type="checkbox" id="useEmbed" value="" class="sr-only peer">
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Use Discord Embed</span>
          </label>
        
          <div id="embedOptions" class="space-y-4">
            <div>
              <div class="flex justify-between items-center mb-2">
                <label for="embedTitle" class="text-sm font-medium text-gray-900 dark:text-white">Embed Title</label>
                <span id="embedTitleCounter" class="text-xs text-gray-500 dark:text-gray-400">0/256</span>
              </div>
              <input type="text" id="embedTitle" maxlength="256" class="bg-dark-bg border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-dark-bg dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter embed title...">
            </div>
            
            <div class="formatting-container">
              <div class="flex justify-between items-center mb-2">
                <label for="embedText" class="text-sm font-medium text-gray-900 dark:text-white">Embed Text</label>
                <span id="embedTextCounter" class="text-xs text-gray-500 dark:text-gray-400">0/4096</span>
              </div>
              <div class="w-full mb-4 border border-gray-600 rounded-lg bg-darker-surface">
                <div class="flex items-center justify-between px-3 py-2 border-b rounded-t-lg border-gray-600 bg-darker-surface">
                  <div class="flex flex-wrap items-center divide-gray-600 sm:divide-x sm:rtl:divide-x-reverse">
                    <div class="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
                      <button type="button" class="p-2 text-gray-400 rounded cursor-pointer hover:text-white hover:bg-gray-700" data-format="bold">
                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5h4.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0-7H6m2 7h6.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0 0H6"/>
                        </svg>
                        <span class="sr-only">Bold</span>
                      </button>
                      <button type="button" class="p-2 text-gray-400 rounded cursor-pointer hover:text-white hover:bg-gray-700" data-format="italic">
                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8.874 19 6.143-14M6 19h6.33m-.66-14H18"/>
                        </svg>
                        <span class="sr-only">Italic</span>
                      </button>
                      <button type="button" class="p-2 text-gray-400 rounded cursor-pointer hover:text-white hover:bg-gray-700" data-format="underline">
                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 19h12M8 5v9a4 4 0 0 0 8 0V5M6 5h4m4 0h4"/>
                        </svg>
                        <span class="sr-only">Underline</span>
                      </button>
                      <button type="button" class="p-2 text-gray-400 rounded cursor-pointer hover:text-white hover:bg-gray-700" data-format="strikethrough">
                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 6.2V5h12v1.2M7 19h6m.2-14-1.677 6.523M9.6 19l1.029-4M5 5l6.523 6.523M19 19l-7.477-7.477"/>
                        </svg>
                        <span class="sr-only">Strikethrough</span>
                      </button>
                    </div>
                    <div class="flex flex-wrap items-center space-x-1 rtl:space-x-reverse sm:ps-4">
                      <button type="button" class="p-2 text-gray-400 rounded cursor-pointer hover:text-white hover:bg-gray-700" data-format="list">
                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"/>
                        </svg>
                        <span class="sr-only">Add list</span>
                      </button>
                      <button type="button" class="p-2 text-gray-400 rounded cursor-pointer hover:text-white hover:bg-gray-700" data-format="code">
<svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14"/>
                        </svg>
                        <span class="sr-only">Code block</span>
                      </button>
                      <button type="button" class="p-2 text-gray-400 rounded cursor-pointer hover:text-white hover:bg-gray-700" data-format="quote">
                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                          <path fill-rule="evenodd" d="M6 6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3H5a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2H6Zm9 0a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3h-1a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3Z" clip-rule="evenodd"/>
                        </svg>
                        <span class="sr-only">Quote</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="px-4 py-2 bg-dark-bg rounded-b-lg dark:bg-dark-bg">
                  <textarea id="embedText" rows="1" maxlength="4096" class="block w-full px-0 text-sm text-gray-300 bg-dark-bg border-0 dark:bg-dark-bg focus:ring-0 dark:text-gray-300 dark:placeholder-gray-400 resize-none overflow-hidden" placeholder="Write embed text..." required></textarea>
                </div>
              </div>
            </div>
            
            <div>
              <label for="embedColor" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Embed Color</label>
              <div class="relative flex items-center w-1/2">
                <div id="colorPreview" class="absolute left-2 w-6 h-6 rounded pointer-events-none"></div>
                <input type="text" id="embedColor" class="bg-dark-bg border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-dark-bg dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="#03EAF7">
                <input type="color" id="embedColorPicker" class="absolute left-2 opacity-0 w-6 h-6 cursor-pointer">
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <label for="authorName" class="text-sm font-medium text-gray-900 dark:text-white">Author Name</label>
                  <span id="authorNameCounter" class="text-xs text-gray-500 dark:text-gray-400">0/256</span>
                </div>
                <input type="text" id="authorName" maxlength="256" class="bg-dark-bg border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-dark-bg dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter author name...">
              </div>
              <div>
                <label for="authorIcon" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Author Icon URL</label>
                <input type="url" id="authorIcon" class="bg-dark-bg border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-dark-bg dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter author icon URL...">
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <label for="footerText" class="text-sm font-medium text-gray-900 dark:text-white">Footer Text</label>
                  <span id="footerTextCounter" class="text-xs text-gray-500 dark:text-gray-400">0/2048</span>
                </div>
                <input type="text" id="footerText" maxlength="2048" class="bg-dark-bg border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-dark-bg dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter footer text...">
              </div>
              <div>
                <label for="footerIcon" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Footer Icon URL</label>
                <input type="url" id="footerIcon" class="bg-dark-bg border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-dark-bg dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter footer icon URL...">
              </div>
            </div>
            
            <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div class="flex items-center">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="showDate" value="" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Show date in footer</span>
                </label>
              </div>
              <div class="flex items-center">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="showImage" value="" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Show mod image in embed</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-lighter-black p-4 rounded-lg">
          <h4 class="text-lg font-semibold mb-2">Available Variables</h4>
          <ul class="space-y-1 text-sm text-white">
            <li><span class="text-purple-400">{modID}</span> - Mod ID</li>
            <li><span class="text-purple-400">{newReleaseDate}</span> - New release date</li>
            <li><span class="text-purple-400">{oldPreviousDate}</span> - Previous release date</li>
            <li><span class="text-purple-400">{modName}</span> - Mod name</li>
            <li><span class="text-purple-400">{everyone}</span> - @everyone mention</li>
            <li><span class="text-purple-400">{here}</span> - @here mention</li>
            <li><span class="text-purple-400">{&roleID}</span> - Mention a role (e.g., {&123456789})</li>
            <li><span class="text-purple-400">{#channelID}</span> - Channel link (e.g., {#987654321})</li>
            <li><span class="text-purple-400">{lastestModFileName}</span> - Latest mod file name</li>
            <li><span class="text-purple-400">{modAuthorName}</span> - Mod author name</li>
          </ul>
        </div>
        
        <div class="flex justify-center w-full">
          <button id="saveWebhookLayout" class="custom-button w-full">Save Webhook Format</button>
        </div>
      </div>
    </div>
  `;
};
