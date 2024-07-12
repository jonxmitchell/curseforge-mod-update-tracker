const { ipcMain } = require("electron");
const {
	getWebhooks,
	addWebhook,
	deleteWebhook,
	renameWebhook,
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

			event.reply("test-webhook-result", {
				success: true,
				webhookName: webhook.name,
			});
		} catch (error) {
			console.error(
				`Webhook test failed for ${
					webhook ? webhook.name : "unknown webhook"
				}: ${error.message}`
			);
			event.reply("test-webhook-result", {
				success: false,
				error: error.message,
				webhookName: webhook ? webhook.name : "unknown webhook",
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

	ipcMain.handle(
		"assign-webhooks",
		async (event, { modId, webhookIds, previousWebhookIds }) => {
			try {
				await assignWebhooks(modId, webhookIds);

				const assignedWebhooks = webhookIds.filter(
					(id) => !previousWebhookIds.includes(id)
				);
				const unassignedWebhooks = previousWebhookIds.filter(
					(id) => !webhookIds.includes(id)
				);

				if (assignedWebhooks.length > 0) {
					const assignLogMessage = `Webhooks assigned to mod ${modId}: ${assignedWebhooks.join(
						", "
					)}`;
					console.log(assignLogMessage);
				}

				if (unassignedWebhooks.length > 0) {
					const unassignLogMessage = `Webhooks unassigned from mod ${modId}: ${unassignedWebhooks.join(
						", "
					)}`;
					console.log(unassignLogMessage);
				}

				return { success: true };
			} catch (error) {
				console.error("Error assigning/unassigning webhooks:", error);
				return { success: false, error: error.message };
			}
		}
	);

	ipcMain.handle("rename-webhook", async (event, { id, newName }) => {
		try {
			await renameWebhook(id, newName);
			return { success: true };
		} catch (error) {
			console.error("Error renaming webhook:", error);
			return { success: false, error: error.message };
		}
	});
}

module.exports = setupWebhookIPC;
