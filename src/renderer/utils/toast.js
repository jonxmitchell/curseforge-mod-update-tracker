const Toastify = require("toastify-js");

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
		style: {
			background: background,
			padding: "12px 20px",
			borderRadius: "4px",
			fontSize: "14px",
			lineHeight: "1.5",
		},
		stopOnFocus: true,
	}).showToast();
}

module.exports = {
	showToast,
};
