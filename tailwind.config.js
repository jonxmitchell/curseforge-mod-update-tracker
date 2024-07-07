module.exports = {
	content: ["./src/**/*.{html,js}", "./node_modules/flowbite/**/*.js"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"dark-bg": "#1e1e1e",
				"dark-surface": "#2a2a2a",
				"dark-border": "#555555",
			},
		},
	},
	plugins: [require("flowbite/plugin")],
};
