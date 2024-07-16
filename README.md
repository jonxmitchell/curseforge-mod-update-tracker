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

## Security and SmartScreen Alert 🛡️

### Microsoft Defender SmartScreen Warning

When you first run CurseForge Mod Tracker, you may encounter a warning from Microsoft Defender SmartScreen. This is a common occurrence for new or less common applications, especially those distributed outside the Microsoft Store.

### Why Does This Happen?

1. **New Application**: Our application is relatively new and may not have established a reputation with Microsoft yet.
2. **Code Signing**: As an open-source project, we currently do not use an expensive code signing certificate.
3. **Distribution Method**: We distribute directly rather than through the Microsoft Store, which can trigger additional scrutiny.

### Is CurseForge Mod Tracker Safe?

**Yes, CurseForge Mod Tracker is safe to use.** Here's why you can trust our application:

1. **Open Source**: Our entire codebase is open source and available for review on GitHub. You can inspect every line of code we use.
2. **Transparent Development**: All development is done in the open, with public pull requests and issue discussions.
3. **No Data Collection**: We do not collect any personal data or telemetry from your system.
4. **Local Operation**: The app operates locally on your machine, only connecting to CurseForge APIs for mod data.

### How to Bypass the SmartScreen Warning

If you encounter the SmartScreen warning, you can safely bypass it:

1. Click on "More info" in the SmartScreen popup.
2. Then click on "Run anyway".

### Build It Yourself

For maximum security assurance, you can build the application yourself:

1. Clone the repository: `git clone https://github.com/your-username/curseforge-mod-tracker.git`
2. Install dependencies: `npm install`
3. Build the application: `npm run build:win` (or relevant command for your OS)

This way, you're running a version of the software that you've personally built from the source code.

## Support the Project ❤️

If you find this tool useful, consider:

- Starring the repository on GitHub
- Reporting bugs or suggesting features
- Contributing to the codebase
- Sharing the project with other mod enthusiasts

## Screenshots 📸

Here are some screenshots of CurseForge Mod Tracker in action:

### Main Interface

_The main interface showing the mod list and update status._
![Main Interface](/assets/imgs/app_screenshots/mod%20tracker.png)

### Webhook Configuration

_Setting up Discord webhooks for mod update notifications._
![Webhook Setup](/assets/imgs/app_screenshots/Webhooks.png)

### In-App Browser

_The built-in browser for viewing mod pages without leaving the application._
![In-App Browser](screenshots/in_app_browser.png)

### Settings Panel

_Customizable settings to tailor the application to your needs._
![Settings](/assets/imgs/app_screenshots/settings.png)

### In- App Console

_In-app console so you can keep track of whats happening within the application_
![In-App Console](/assets/imgs/app_screenshots/console.png)

### Webhook Formatter

_Customise your webhooks to look the way you want_
![Webhook Formatter](/assets/imgs/app_screenshots/webhook%20formatter%201.png)
![Webhook Formatter](/assets/imgs/app_screenshots/webhook%20formatter%202.png)

For more visual previews, check out our [Gallery](link-to-gallery) or watch our [Demo Video](link-to-video).
