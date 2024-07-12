const fs = require("fs");
const path = require("path");

const headerHTML = require("../templates/headerHTML");
const footerHTML = require("../templates/footerHTML");
const tabNavigationHTML = require("../templates/tabNavigationHTML");
const modTrackerHTML = require("../pages/modTrackerHTML");
const webhooksHTML = require("../pages/webhooksHTML");
const settingsHTML = require("../pages/settingsHTML");
const consoleHTML = require("../pages/consoleHTML");
const webhookLayoutHTML = require("../pages/webhookLayoutHTML");

function buildHTML() {
	const html = `
<!DOCTYPE html>
<html class="dark">
  <head>
    <title>Mod Update Tracker</title>
    <link rel="stylesheet" href="styles/styles.css" />
    <link rel="stylesheet" type="text/css" href="../../node_modules/toastify-js/src/toastify.css" />
  </head>
  <body class="bg-dark-bg text-white">
    ${headerHTML()}
    <div class="app-container">
      ${tabNavigationHTML()}
      <div id="myTabContent" class="flex-1 overflow-y-auto">
        ${modTrackerHTML()}
        ${webhooksHTML()}
        ${webhookLayoutHTML()}
        ${settingsHTML()}
        ${consoleHTML()}
      </div>
    </div>
    ${footerHTML()}
    <script src="renderer.js"></script>
  </body>
</html>
  `.trim();

	fs.writeFileSync(path.join(__dirname, "../index.html"), html);
	console.log("HTML file built successfully!");
}

buildHTML();
