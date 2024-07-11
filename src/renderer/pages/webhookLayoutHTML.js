// src/renderer/pages/webhookLayoutHTML.js

function webhookLayout() {
	return `
    <div class="hidden p-4 rounded-lg" id="webhook-layout" role="tabpanel" aria-labelledby="webhook-layout-tab">
      <h3 class="text-xl font-bold mb-4">Webhook Layout</h3>
      <div class="space-y-4">
        <div class="formatting-container">
          <label for="webhookText" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Webhook Text (outside embed)</label>
          <div class="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div class="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
              <div class="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse dark:divide-gray-600">
                <div class="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
                  <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600" data-format="bold">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.387 7.505a3.129 3.129 0 0 0-1.554-1.253 3.55 3.55 0 0 0 1.355-1.154 3.053 3.053 0 0 0 .484-1.727 3.117 3.117 0 0 0-.412-1.622 2.616 2.616 0 0 0-1.159-1.078 3.72 3.72 0 0 0-1.262-.36 23.113 23.113 0 0 0-2.813-.074H5.948c-.452 0-.837.156-1.155.469a1.543 1.543 0 0 0-.474 1.14v9.201c0 .452.156.837.469 1.154.312.318.697.477 1.155.477h3.404c1.228 0 2.34-.037 3.336-.11a4.388 4.388 0 0 0 1.855-.576 3.208 3.208 0 0 0 1.227-1.314c.297-.558.445-1.204.445-1.94a3.217 3.217 0 0 0-.823-2.233zm-5.726-2.778h1.424c.709 0 1.227.127 1.552.38.326.254.489.665.489 1.232 0 .567-.163.977-.489 1.23-.325.254-.843.38-1.552.38H7.661V4.727zm3.73 7.754a1.84 1.84 0 0 1-.823.715 3.155 3.155 0 0 1-1.272.246H7.661v-3.509h1.716c.49 0 .926.058 1.308.174.381.117.68.28.897.49.217.21.38.458.49.741.109.284.163.598.163.942 0 .672-.163 1.184-.489 1.535z"/>
                    </svg>
                    <span class="sr-only">Bold</span>
                  </button>
                  <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600" data-format="italic">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.386 5.281c-.104-.25-.348-.391-.644-.391H9.12c-.296 0-.54.141-.644.391L4.38 15.27c-.083.208-.02.441.156.578.177.137.426.137.603 0l1.146-.883c.083-.062.187-.098.291-.098h5.833c.104 0 .208.036.291.098l1.146.883c.089.068.194.104.302.104.104 0 .208-.036.301-.104.176-.137.239-.37.156-.578l-1.219-3.05h-2.385l-1.219-3.05h4.771l-1.219-3.05h-2.385l-.521-1.303z"/>
                    </svg>
                    <span class="sr-only">Italic</span>
                  </button>
                  <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600" data-format="underline">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
<path d="M15 17H5a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2ZM6.13 12.702c.203.27.454.509.752.716.297.207.636.368 1.016.483.38.115.79.173 1.228.173.39 0 .753-.042 1.087-.126.335-.084.624-.212.87-.384.244-.172.436-.39.575-.652.139-.262.208-.571.208-.927 0-.29-.051-.53-.152-.723a1.491 1.491 0 0 0-.408-.485 2.457 2.457 0 0 0-.6-.323 7.936 7.936 0 0 0-.726-.221l-1.112-.293a8.036 8.036 0 0 1-.69-.208 1.806 1.806 0 0 1-.497-.258.995.995 0 0 1-.296-.345.98.98 0 0 1-.098-.45c0-.15.034-.282.104-.399.07-.117.168-.216.296-.297.127-.08.28-.142.457-.185.178-.044.374-.066.59-.066.238 0 .455.025.65.074.196.05.366.122.512.216.145.095.26.21.344.348a.98.98 0 0 1 .152.423h1.936a2.131 2.131 0 0 0-.256-.92 2.161 2.161 0 0 0-.608-.715 2.82 2.82 0 0 0-.928-.464 4.098 4.098 0 0 0-1.218-.165c-.38 0-.737.042-1.072.126a2.625 2.625 0 0 0-.864.374 1.84 1.84 0 0 0-.58.627c-.14.247-.21.534-.21.86 0 .293.052.54.157.738.105.2.249.366.432.502.182.135.395.246.638.333.244.087.504.162.782.227l1.144.294c.218.055.414.118.59.188.175.07.324.153.448.248.124.095.22.21.288.345.067.135.101.294.101.477 0 .165-.037.313-.11.445a.993.993 0 0 1-.312.34c-.134.091-.296.16-.488.208a2.632 2.632 0 0 1-.638.072c-.28 0-.536-.03-.768-.092a1.77 1.77 0 0 1-.596-.268 1.284 1.284 0 0 1-.388-.428 1.266 1.266 0 0 1-.14-.569H5c.01.42.094.796.25 1.13.156.333.371.615.645.846Z"/>
                    </svg>
                    <span class="sr-only">Underline</span>
                  </button>
                  <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600" data-format="strikethrough">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M12.893 2.234a1 1 0 0 0-1.886-.468L5.106 16.234a1 1 0 1 0 1.886.468l5.901-14.468ZM16 10a1 1 0 0 1-1 1H5a1 1 0 1 1 0-2h10a1 1 0 0 1 1 1Z"/>
                    </svg>
                    <span class="sr-only">Strikethrough</span>
                  </button>
                </div>
                <div class="flex flex-wrap items-center space-x-1 rtl:space-x-reverse sm:ps-4">
                  <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600" data-format="list">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 18">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.5 3h9.563M9.5 9h9.563M9.5 15h9.563M1.5 13a2 2 0 1 1 3.321 1.5L1.5 17h5m-5-15 2-1v6m-2 0h4"/>
                    </svg>
                    <span class="sr-only">Add list</span>
                  </button>
                  <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600" data-format="code">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.5 19 12 4.5l6.5 14.5m-13 0h13m-5-4h5M9.5 9.5h5"/>
                    </svg>
                    <span class="sr-only">Code block</span>
                  </button>
                  <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600" data-format="quote">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                      <path d="M15.685 3.316A9.004 9.004 0 0 0 8.997 0c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-3.868-2.444-7.163-5.87-8.429zm-1.388 13.02a7.502 7.502 0 1 1 0-12.672 7.502 7.502 0 0 1 0 12.672z"/>
                      <path d="M8.997 3.6c-2.97 0-5.4 2.43-5.4 5.4s2.43 5.4 5.4 5.4 5.4-2.43 5.4-5.4-2.43-5.4-5.4-5.4zm0 9.6c-2.316 0-4.2-1.884-4.2-4.2s1.884-4.2 4.2-4.2 4.2 1.884 4.2 4.2-1.884 4.2-4.2 4.2z"/>
                    </svg>
                    <span class="sr-only">Quote</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
              <textarea id="webhookText" rows="4" class="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Write webhook text..." required></textarea>
            </div>
          </div>
        </div>
        
        <div>
          <label for="embedTitle" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Embed Title</label>
          <input type="text" id="embedTitle" class="bg-gray-800 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400 dark:text-white" placeholder="Enter embed title...">
        </div>
        
        <div class="formatting-container">
          <label for="embedText" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Embed Text</label>
          <div class="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div class="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
              <div class="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse dark:divide-gray-600">
                <div class="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
                  <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600" data-format="bold">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.387 7.505a3.129 3.129 0 0 0-1.554-1.253 3.55 3.55 0 0 0 1.355-1.154 3.053 3.053 0 0 0 .484-1.727 3.117 3.117 0 0 0-.412-1.622 2.616 2.616 0 0 0-1.159-1.078 3.72 3.72 0 0 0-1.262-.36 23.113 23.113 0 0 0-2.813-.074H5.948c-.452 0-.837.156-1.155.469a1.543 1.543 0 0 0-.474 1.14v9.201c0 .452.156.837.469 1.154.312.318.697.477 1.155.477h3.404c1.228 0 2.34-.037 3.336-.11a4.388 4.388 0 0 0 1.855-.576 3.208 3.208 0 0 0 1.227-1.314c.297-.558.445-1.204.445-1.94a3.217 3.217 0 0 0-.823-2.233zm-5.726-2.778h1.424c.709 0 1.227.127 1.552.38.326.254.489.665.489 1.232 0 .567-.163.977-.489 1.23-.325.254-.843.38-1.552.38H7.661V4.727zm3.73 7.754a1.84 1.84 0 0 1-.823.715 3.155 3.155 0 0 1-1.272.246H7.661v-3.509h1.716c.49 0 .926.058 1.308.174.381.117.68.28.897.49.217.21.38.458.49.741.109.284.163.598.163.942 0 .672-.163 1.184-.489 1.535z"/>
                    </svg>
                    <span class="sr-only">Bold</span>
                  </button>
                  <!-- Add other formatting buttons for embedText here, similar to webhookText -->
                </div>
              </div>
            </div>
            <div class="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
              <textarea id="embedText" rows="4" class="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Write embed text..." required></textarea>
            </div>
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
        
        <button id="saveWebhookLayout" class="custom-button">Save Webhook Layout</button>
      </div>
    </div>
  `;
}

module.exports = webhookLayout;
