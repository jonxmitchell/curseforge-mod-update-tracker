const { ipcMain } = require("electron");
const {
	getWebhooks,
	addWebhook,
	deleteWebhook,
} = require("../../database/webhooksDB");
const {
	getModWebhooks,
	assignWebhooks,
} = require("../../database/modWebhooksDB");
const fetch = require("node-fetch");

function setupWebhookIPC(mainWindow) {
	ipcMain.on("get-webhooks", async (event) => {
		try {
			const webhooks = await getWebhooks();
			event.reply("get-webhooks-result", { success: true, webhooks });
		} catch (error) {
			event.reply("get-webhooks-result", {
				success: false,
				error: error.message,
			});
		}
	});

	ipcMain.on("add-webhook", async (event, { name, url }) => {
		try {
			await addWebhook(name, url);
			event.reply("add-webhook-result", { success: true });
		} catch (error) {
			event.reply("add-webhook-result", {
				success: false,
				error: error.message,
			});
		}
	});

	ipcMain.on("delete-webhook", async (event, id) => {
		try {
			await deleteWebhook(id);
			event.reply("delete-webhook-result", { success: true, id });
		} catch (error) {
			event.reply("delete-webhook-result", {
				success: false,
				error: error.message,
			});
		}
	});

	ipcMain.on("test-webhook", async (event, webhookId) => {
		try {
			const webhooks = await getWebhooks();
			const webhook = webhooks.find((w) => w.id === webhookId);
			if (!webhook) {
				throw new Error("Webhook not found");
			}

			const message = {
				content:
					"This is a test message from the Mod Update Tracker application.",
				embeds: [
					{
						title: "Webhook Test",
						description:
							"If you can see this message, your webhook is working correctly.",
						color: 5814783,
						timestamp: new Date().toISOString(),
					},
				],
			};

			const response = await fetch(webhook.url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(message),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			event.reply("test-webhook-result", { success: true });
		} catch (error) {
			event.reply("test-webhook-result", {
				success: false,
				error: error.message,
			});
		}
	});

	ipcMain.handle("get-mod-webhooks", async (event, modId) => {
		try {
			return await getModWebhooks(modId);
		} catch (error) {
			console.error("Error getting mod webhooks:", error);
			throw error;
		}
	});

	ipcMain.handle("assign-webhooks", async (event, { modId, webhookIds }) => {
		try {
			await assignWebhooks(modId, webhookIds);
			return { success: true };
		} catch (error) {
			console.error("Error assigning webhooks:", error);
			return { success: false, error: error.message };
		}
	});
}

module.exports = setupWebhookIPC;