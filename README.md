# Landslide Risk Assessment Website

This README will guide you through the process of setting up and running the Landslide Risk Assessment website.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [File Structure](#file-structure)
3. [Setup Instructions](#setup-instructions)
4. [Running the Website](#running-the-website)
5. [Firebase Setup](#firebase-setup)
6. [Google Form Setup](#google-form-setup)
7. [Usage](#usage)
8. [Contributing](#contributing)
9. [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed on your computer:

- A web browser (like Chrome, Firefox, or Edge)
- A text editor (like Visual Studio Code, Sublime Text, or Notepad++)
- Basic knowledge of HTML, CSS, and JavaScript (optional but helpful)

## File Structure

Create a new folder for your project and inside that folder, create the following files:


## Setup Instructions

1. **Create the HTML File**:
   - Create a file named `index.html` and add the HTML structure for the website.

2. **Create the CSS File**:
   - Create a file named `styles.css` and add the styles for the website.

3. **Create the JavaScript File**:
   - Create a file named `script.js` and add the JavaScript functionality.

## Running the Website

1. Open the `index.html` file in your web browser. You can do this by right-clicking the file and selecting "Open with" and then choosing your web browser.
2. You should see the login form for the Landslide Risk Assessment tool.

## Firebase Setup

To use Firebase for data storage, follow these steps:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. In the project settings, find the "Database" section and create a new Realtime Database.
4. Set the database rules to allow read and write access (for testing purposes only).
5. Copy the database URL and replace the `databaseURL` in the `script.js` file with your own.

## Google Form Setup

To submit data to a Google Form, follow these steps:

1. Create a new Google Form.
2. Add fields that correspond to the data you want to collect (e.g., Rainfall, Water Volume, etc.).
3. After creating the form, click on the "Send" button and copy the form link.
4. In the form's settings, get a pre-filled link and submit it with dummy data.
5. Go to the responses tab and create a Google Sheet.
6. In the Google Sheet, get the link to the form and replace the URL in the `fetch` function in `script.js`.

## Usage

1. Open the website in your browser.
2. Log in using the credentials:
   - Username: `LP`
   - Password: `12345678`
3. After logging in, the main content will display the landslide risk assessment data.
4. Click the "Refresh Data" button to fetch the latest data from Firebase.

## Contributing

If you would like to contribute to this project, feel free to fork the repository and submit a pull request. Any improvements or suggestions are welcome!

## License

This project is open-source and available under the MIT License.
