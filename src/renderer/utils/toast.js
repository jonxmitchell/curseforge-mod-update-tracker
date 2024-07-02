const Toastify = require("toastify-js");

let toastTimeout;
let lastToastMessage = "";

function showToast(message, type = "info") {
	let background;
	switch (type) {
		case "success":
			background = "linear-gradient(to right, #00b09b, #96c93d)";
			break;
		case "error":
			background = "linear-gradient(to right, #ff5f6d, #ffc371)";
			break;
		case "warning":
			background = "linear-gradient(to right, #f2994a, #f2c94c)";
			break;
		default:
			background = "linear-gradient(to right, #00b4db, #0083b0)";
	}

	Toastify({
		text: message,
		duration: 3000,
		close: true,
		gravity: "top",
		position: "center",
		style: { background: background },
		stopOnFocus: true,
	}).showToast();
}

function showToastDebounced(message, type = "info") {
	if (toastTimeout) {
		clearTimeout(toastTimeout);
	}
	if (lastToastMessage !== message) {
		showToast(message, type);
		lastToastMessage = message;
	}
	toastTimeout = setTimeout(() => {
		lastToastMessage = "";
	}, 3000);
}

module.exports = {
	showToast,
	showToastDebounced,
};
