// tailwind.config.js

module.exports = {
	content: ["./src/**/*.{html,js}", "./node_modules/flowbite/**/*.js"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"dark-bg": "#1e1e1e",
				"dark-surface": "#2a2a2a",
				"dark-border": "#555555",
				"darker-surface": "#252525",
			},
		},
	},
	plugins: [require("flowbite/plugin")],
	safelist: [
		"text-purple-400",
		"text-red-500",
		"text-green-500",
		"text-cyan-500",
		"text-amber-500",
		"text-pink-500",
		"text-red-700",
	],
};
