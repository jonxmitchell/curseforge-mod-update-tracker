// src/renderer/components/WebhookLayout.js

const { ipcRenderer } = require("electron");
const { showToast } = require("../utils/toast");
const { initializeCharacterCounters } = require("../utils/characterCounter");

function initializeWebhookLayout() {
	const saveButton = document.getElementById("saveWebhookLayout");
	if (saveButton) {
		saveButton.addEventListener("click", saveWebhookLayout);
	}

	setupColorPicker();
	setupFormattingButtons();
	setupFormattedContentListeners();
	setupUrlValidation();
	loadWebhookLayout();
	initializeCharacterCounters();
	setupDynamicTextareas();

	// Adjust heights when the window is resized
	window.addEventListener("resize", adjustAllTextareaHeights);
}

function initializeFormattedContent() {
	setupFormattedContentListeners();
}

function setupColorPicker() {
	const embedColorPicker = document.getElementById("embedColorPicker");
	const embedColor = document.getElementById("embedColor");
	const colorPreview = document.getElementById("colorPreview");

	if (embedColorPicker && embedColor && colorPreview) {
		// Set default color
		const defaultColor = "#7289DA"; // Discord's blurple color
		embedColorPicker.value = defaultColor;
		embedColor.value = defaultColor;
		colorPreview.style.backgroundColor = defaultColor;

		embedColorPicker.addEventListener("input", (event) => {
			const color = event.target.value;
			colorPreview.style.backgroundColor = color;
			embedColor.value = color;
		});

		embedColor.addEventListener("input", (event) => {
			const color = event.target.value;
			if (/^#[0-9A-F]{6}$/i.test(color)) {
				colorPreview.style.backgroundColor = color;
				embedColorPicker.value = color;
			}
		});
	}
}

function setupFormattingButtons() {
	const formatButtons = document.querySelectorAll("[data-format]");
	formatButtons.forEach((button) => {
		button.addEventListener("click", (event) => {
			event.preventDefault();
			const format = button.getAttribute("data-format");
			const container = button.closest(".formatting-container");
			if (container) {
				const textarea = container.querySelector("textarea");
				if (textarea) {
					textarea.focus();
					applyFormatting(format, textarea);
				}
			}
		});
	});
}

function applyFormatting(format, textarea) {
	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const selectedText = textarea.value.substring(start, end);

	let formattedText = "";
	switch (format) {
		case "bold":
			formattedText = `**${selectedText}**`;
			break;
		case "italic":
			formattedText = `*${selectedText}*`;
			break;
		case "underline":
			formattedText = `__${selectedText}__`;
			break;
		case "strikethrough":
			formattedText = `~~${selectedText}~~`;
			break;
		case "list":
			formattedText = selectedText
				.split("\n")
				.map((line) => `- ${line}`)
				.join("\n");
			break;
		case "code":
			formattedText = `\`\`\`\n${selectedText}\n\`\`\``;
			break;
		case "quote":
			formattedText = selectedText
				.split("\n")
				.map((line) => `> ${line}`)
				.join("\n");
			break;
		default:
			console.log(`Unknown format: ${format}`);
			return;
	}

	textarea.value =
		textarea.value.substring(0, start) +
		formattedText +
		textarea.value.substring(end);
	textarea.focus();
	textarea.selectionStart = start + formattedText.length;
	textarea.selectionEnd = start + formattedText.length;
	adjustTextareaHeight(textarea);
}

function setupFormattedContentListeners() {
	const textareas = document.querySelectorAll(".formatting-container textarea");
	textareas.forEach((textarea) => {
		textarea.addEventListener("input", function () {
			this.dataset.formattedText = this.value;
			adjustTextareaHeight(this);
		});
	});
}

function setupUrlValidation() {
	const urlInputs = ["authorIcon", "footerIcon"];
	urlInputs.forEach((id) => {
		const input = document.getElementById(id);
		if (input) {
			input.addEventListener("input", function () {
				validateUrl(this);
			});
		}
	});
}

function validateUrl(input) {
	const value = input.value.trim();
	const label = document.querySelector(`label[for="${input.id}"]`);
	const errorMessage = document.getElementById(`${input.id}Error`);

	if (value === "" || isValidUrl(value)) {
		input.classList.remove(
			"border-red-500",
			"text-red-900",
			"placeholder-red-700",
			"focus:ring-red-500",
			"focus:border-red-500"
		);
		input.classList.add(
			"border-gray-600",
			"focus:ring-blue-500",
			"focus:border-blue-500"
		);
		label.classList.remove("text-red-700", "dark:text-red-500");
		if (errorMessage) errorMessage.remove();
	} else {
		input.classList.add(
			"border-red-500",
			"text-red-900",
			"placeholder-red-700",
			"focus:ring-red-500",
			"focus:border-red-500"
		);
		input.classList.remove(
			"border-gray-600",
			"focus:ring-blue-500",
			"focus:border-blue-500"
		);
		label.classList.add("text-red-700", "dark:text-red-500");
		if (!errorMessage) {
			const error = document.createElement("p");
			error.id = `${input.id}Error`;
			error.className = "mt-2 text-sm text-red-600 dark:text-red-500";
			error.innerHTML =
				'<span class="font-medium">Error:</span> Please enter a valid URL or leave it blank.';
			input.parentNode.insertBefore(error, input.nextSibling);
		}
	}
}

function isValidUrl(string) {
	try {
		new URL(string);
		return true;
	} catch (_) {
		return false;
	}
}

async function saveWebhookLayout() {
	const authorIconInput = document.getElementById("authorIcon");
	const footerIconInput = document.getElementById("footerIcon");

	const invalidFields = [];

	if (!isValidUrl(authorIconInput.value) && authorIconInput.value !== "") {
		invalidFields.push("Author Icon URL");
	}
	if (!isValidUrl(footerIconInput.value) && footerIconInput.value !== "") {
		invalidFields.push("Footer Icon URL");
	}

	if (invalidFields.length > 0) {
		showToast(
			`Please enter valid URLs for ${invalidFields.join(
				" and "
			)} or leave them blank.`,
			"error"
		);
		return;
	}

	const layout = {
		webhookText: document.getElementById("webhookText").value,
		embedTitle: document.getElementById("embedTitle").value,
		embedText: document.getElementById("embedText").value,
		showDate: document.getElementById("showDate").checked,
		showImage: document.getElementById("showImage").checked,
		embedColor: document.getElementById("embedColor").value,
		footerText: document.getElementById("footerText").value,
		footerIcon: footerIconInput.value,
		authorName: document.getElementById("authorName").value,
		authorIcon: authorIconInput.value,
	};

	try {
		await ipcRenderer.invoke("save-webhook-layout", layout);
		showToast("Webhook layout saved successfully", "success");
	} catch (error) {
		console.error("Failed to save webhook layout:", error);
		showToast(`Failed to save webhook layout: ${error.message}`, "error");
	}
}

async function loadWebhookLayout() {
	try {
		const result = await ipcRenderer.invoke("get-webhook-layout");
		if (result.success && result.layout) {
			const layout = result.layout;
			setElementValue("webhookText", layout.webhookText);
			setElementValue("embedTitle", layout.embedTitle);
			setElementValue("embedText", layout.embedText);
			setElementChecked("showDate", layout.showDate);
			setElementChecked("showImage", layout.showImage);
			setElementValue("embedColor", layout.embedColor || "#7289DA");
			setElementValue("embedColorPicker", layout.embedColor || "#7289DA");
			setElementBackgroundColor("colorPreview", layout.embedColor || "#7289DA");
			setElementValue("footerText", layout.footerText);
			setElementValue("footerIcon", layout.footerIcon);
			setElementValue("authorName", layout.authorName);
			setElementValue("authorIcon", layout.authorIcon);
			console.log("Webhook layout loaded successfully");

			// Adjust all textareas after a short delay
			setTimeout(adjustAllTextareaHeights, 100);
		}
	} catch (error) {
		console.error("Failed to load webhook layout:", error);
		showToast(`Failed to load webhook layout: ${error.message}`, "error");
	}
}

function setElementValue(id, value) {
	const element = document.getElementById(id);
	if (element) {
		element.value = value || "";
		if (element.tagName.toLowerCase() === "textarea") {
			// Trigger resize after a short delay
			setTimeout(() => adjustTextareaHeight(element), 0);
		}
	}
}

function setElementChecked(id, checked) {
	const element = document.getElementById(id);
	if (element) element.checked = checked || false;
}

function setElementBackgroundColor(id, color) {
	const element = document.getElementById(id);
	if (element) element.style.backgroundColor = color || "";
}

function setupDynamicTextareas() {
	const textareas = document.querySelectorAll("textarea");
	textareas.forEach((textarea) => {
		// Set up ResizeObserver
		const resizeObserver = new ResizeObserver(() => {
			adjustTextareaHeight(textarea);
		});
		resizeObserver.observe(textarea);

		// Adjust on input as well (for immediate feedback)
		textarea.addEventListener("input", () => adjustTextareaHeight(textarea));
	});

	// Adjust all textareas on window load
	window.addEventListener("load", () => {
		setTimeout(adjustAllTextareaHeights, 100);
	});
}

function adjustTextareaHeight(textarea) {
	requestAnimationFrame(() => {
		textarea.style.height = "auto";
		const newHeight = Math.max(textarea.scrollHeight, 40) + "px"; // 40px = 2.5rem
		if (textarea.style.height !== newHeight) {
			textarea.style.height = newHeight;
			console.log(`Adjusted height for ${textarea.id}: ${newHeight}`);
		}
	});
}

function adjustAllTextareaHeights() {
	const textareas = document.querySelectorAll("textarea");
	textareas.forEach(adjustTextareaHeight);
}

module.exports = {
	initializeWebhookLayout,
	initializeFormattedContent,
};
