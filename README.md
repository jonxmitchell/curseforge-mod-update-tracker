# CurseForge Mod Tracker

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Electron](https://img.shields.io/badge/electron-28.0.0-brightgreen.svg)

## Overview 🌟

CurseForge Mod Tracker is a useful desktop application designed to help mod enthusiasts stay up-to-date with their favorite mods. Built with Electron, this app provides real-time tracking and notifications for mod updates from CurseForge.

## Features ✨

- 📊 **Mod Tracking**: Easily add and manage your favorite CurseForge mods.
- 🔔 **Real-time Notifications**: Get instant alerts when your tracked mods are updated.
- 🌐 **Discord Webhook Integration**: Send update notifications directly to your Discord server.
- 🎨 **Customizable Webhooks**: Personalize your Discord notifications with a user-friendly webhook formatter.
- 🔄 **Automatic Updates**: Set custom intervals for checking mod updates.
- 🖥️ **In-App Browser**: View mod pages without leaving the application.
- 🌙 **Dark Mode**: Easy on the eyes with a sleek dark interface.
- 📜 **Console Logging**: Keep track of all activities and errors within the app.

## Technology Stack 💻

- **Electron**: For cross-platform desktop application development.
- **Node.js**: Backend runtime environment.
- **SQLite (better-sqlite3)**: Local database for storing mod and webhook information.
- **Tailwind CSS**: For responsive and modern UI design.
- **Flowbite**: UI component library for Tailwind CSS.

## Getting Started 🚀

1. **Prerequisites**:

   - `Node.js (v14 or later)`
   - `npm (v6 or later)`

2. **Installation**:

   ```bash
   git clone https://github.com/your-username/curseforge-mod-tracker.git
   cd curseforge-mod-tracker
   npm install

   ```

3. **Configuration:**

   - `Obtain a CurseForge API key from CurseForge API. get the API key.`
   - `Set up your Discord webhook URLs (optional for notifications).`

4. **Bulid HTML & CSS:**

   ```bash
   npm run build:html
   npm run build:css
   ```

5. **Running the Application:**

   ```bash
   npm start
   ```

6. **Building for Production:**

   ```bash
   npm run build:win
   ```

## Configuration ⚙️

- **CurseForge API Key**: Required for fetching mod data. Set this in the app settings.
- **Update Interval**: Customize how often the app checks for mod updates.
- **Discord Webhooks**: Set up and customize Discord notifications in the app.

## Usage Guide 📘

### Adding Mods:

- Click the "Add Mod" button and enter the CurseForge mod ID.

### Configuring Webhooks:

- Navigate to the Webhooks tab.
- Add your Discord webhook URLs and give it a name.

### Customising webhook notifications

- Navigate to Webhook Formatter.
- Use the Webhook Formatter to design your Discord notifications.
- Utilize variables like `{modName}` and `{newVersion}` for dynamic content.

### Setting Update Intervals:

- Go to Settings tab and adjust the "Update Interval" slider in enter value in the input.
- You can set intervals from 15 minutes to 24 hours.

### Using the In-App Browser:

- Click on a mod's name to open its CurseForge page in the built-in browser.

## Locating the CFMTData Folder 🔎

The application data is stored in the `CFMTData` folder within your system's AppData directory. Here's how to find it:

1.  Press `Win + R` to open the Run dialog.
2.  Type `%APPDATA%\CFMTData` and press Enter.
3.  This will open the CFMTData folder in File Explorer.

Alternatively, you can navigate to this folder manually:

- Open File Explorer
- Navigate to `C:\Users\YourUsername\AppData\Roaming\CFMTData`

Note: The `AppData` folder is hidden by default. You may need to enable "Show hidden files and folders" in File Explorer options to see it.

## Contents of the CFMTData Folder 📂

Inside the CFMTData folder, you'll find several important files and directories:

1.  **mods.db**: This is the SQLite database file that stores information about your tracked mods, webhooks, and application settings.
2.  **logs/**: This directory contains log files that record application activities and errors. These can be useful for troubleshooting.

    - Log files are named in the format `log_YYYY-MM-DD_HH-MM-SS.txt`.

3.  **config.json**: (If applicable) This file stores user configuration settings that persist between application launches.
4.  **cache/**: (If applicable) This directory may contain cached data to improve application performance.

## Backing Up Your Data ⤴️

It's a good practice to periodically back up your CFMTData folder, especially before updating the application or making significant changes. To do this:

1.  Navigate to the CFMTData folder as described above.
2.  Copy the entire folder to a safe location (e.g., an external drive or cloud storage).

## Resetting the Application 🔄

If you need to reset the application to its default state:

1.  Close the CurseForge Mod Tracker application completely.
2.  Navigate to the CFMTData folder.
3.  Rename or delete the folder (renaming is safer as it allows you to recover data if needed).
4.  Restart the application. A new CFMTData folder will be created with default settings.

⚠️ **Warning**: Deleting or modifying files in the CFMTData folder can result in loss of your tracked mods, settings, and webhook configurations. Always create a backup before making changes.

## Contributing 🤝

Contributions are welcome to the CurseForge Mod Tracker! Here's how you can help:

    1. Fork the repository.
    2. Create a new branch: git checkout -b feature/your-feature-name.
    3. Make your changes and commit them: git commit -m 'Add some feature'.
    4. Push to the branch: git push origin feature/your-feature-name.
    5. Submit a pull request.

Please read our Contributing Guidelines for more details.

## Troubleshooting 🔧

- **API Key Issues:** Ensure your CurseForge API key is correctly entered in the settings.
- **Update Check Failures:** Check your internet connection and firewall settings.
- **Discord Webhook Errors:** Verify that your webhook URLs are correct and have the necessary permissions.

For more issues, please check our FAQ or open an issue on GitHub.

## License 📄

This project is licensed under the MIT License.

## Guides 👏

- Get your CurseForge API key [here](https://support.curseforge.com/en/support/solutions/articles/9000208346-about-the-curseforge-api-and-how-to-apply-for-a-key).
- How to set up a discord webhook [here](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)

## Support the Project ❤️

If you find this tool useful, consider:

- Starring the repository on GitHub
- Reporting bugs or suggesting features
- Contributing to the codebase
- Sharing the project with other mod enthusiasts
