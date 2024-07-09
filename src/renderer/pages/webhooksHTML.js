module.exports = function webhooks() {
	return `
      <div class="hidden p-4 rounded-lg" id="webhooks" role="tabpanel" aria-labelledby="webhooks-tab">
        <div id="webhookSection" class="space-y-4">
          <h3 class="text-xl font-bold mb-4">Discord Webhooks</h3>
          <div class="flex flex-wrap gap-4">
            <div class="relative z-0 flex-grow min-w-[200px]">
              <input type="text" id="webhookNameInput" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
              <label for="webhookNameInput" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Enter webhook name</label>
            </div>
            <div class="relative z-0 flex-grow min-w-[200px]">
              <input type="text" id="webhookInput" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
            <label for="webhookInput" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Enter Discord webhook URL</label>
          </div>
          <button id="addWebhookButton" class="custom-button">Add Webhook</button>
        </div>
        <div id="webhookList" class="space-y-4"></div>
      </div>
    </div>
  `;
};
