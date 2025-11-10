/** @type {import('tailwindcss').Config} */
module.exports = {
	// v4 doesn't need content, but leaving it is harmless if present
	content: [
		"./index.html",
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	corePlugins: {
		// Avoids reading preflight.css when an older plugin is accidentally used
		preflight: false,
	},
	theme: {
		extend: {},
	},
};

