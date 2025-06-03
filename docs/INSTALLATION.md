# Installation Guide

## Step-by-Step Installation

### 1. Prepare the Extension Files
Make sure you have all the required files in your extension folder:
- ✅ `manifest.json` (root level)
- ✅ `src/content.js` (main extension logic)
- ✅ `src/popup.html` (popup interface)
- ✅ Icon files in `assets/icons/` (icon16.png, icon48.png, icon128.png) - ✅ **CREATED!**

### 2. Open Chrome Extensions Page
1. Open Google Chrome
2. Type `chrome://extensions/` in the address bar
3. Press Enter

### 3. Enable Developer Mode
1. Look for the "Developer mode" toggle in the top-right corner
2. Click to enable it (the toggle should turn blue)

### 4. Load the Extension
1. Click the "Load unpacked" button that appears
2. Navigate to your extension folder (`UpworkProprosalAi`)
3. Select the folder and click "Select Folder" (or "Open")

### 5. Verify Installation
1. You should see your extension appear in the list
2. Make sure it's enabled (toggle should be blue)
3. The extension icon (green "U") should now appear properly ✅

### 6. Test the Extension
1. Navigate to any Upwork job page (example: `https://www.upwork.com/jobs/~[job-id]`)
2. Wait a moment for the page to load
3. You should see a floating panel appear on the right side of the page
4. The panel should display extracted job information

## Troubleshooting

### Extension Doesn't Load
- Check that all files are in the correct folder
- Make sure `manifest.json` is valid JSON
- Look for error messages in the Chrome Extensions page

### Panel Doesn't Appear
- Make sure you're on a valid Upwork job page (URL contains `/jobs/~`)
- Refresh the page
- Check the browser console (F12) for error messages

### Data Not Extracting Properly
- Upwork may have changed their page structure
- Check the browser console for errors
- The extension works best on English language Upwork pages

### Permission Issues
- Make sure the extension has permission to run on Upwork.com
- Check that "Allow access to file URLs" is enabled if needed

## Updating the Extension

When you make changes to the code:
1. Save your changes
2. Go to `chrome://extensions/`
3. Find your extension
4. Click the refresh/reload button (🔄)
5. The extension will reload with your changes

## Uninstalling

To remove the extension:
1. Go to `chrome://extensions/`
2. Find the extension
3. Click "Remove"
4. Confirm the removal

## Need Help?

If you encounter issues:
1. Check the browser console (F12 → Console tab)
2. Look for error messages in the Chrome Extensions page
3. Make sure you're using the latest version of Chrome
4. Verify you're on a valid Upwork job page
