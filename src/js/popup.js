// Popup script for Upwork Job Data Extractor
// Checks if the current tab is an Upwork job page and updates the status

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on an Upwork job page
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        const statusElement = document.getElementById('status');
        
        if (currentTab && currentTab.url && currentTab.url.includes('upwork.com/jobs/')) {
            statusElement.textContent = 'Active on Job Page';
            statusElement.className = 'status-active';
        } else {
            statusElement.textContent = 'Navigate to Job Page';
            statusElement.className = 'status-inactive';
        }
    });
    
    // Add event listener for settings button
    const settingsBtn = document.getElementById('open-settings');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            // Open the options page
            if (chrome.runtime.openOptionsPage) {
                chrome.runtime.openOptionsPage();
            } else {
                // Fallback for browsers that don't support openOptionsPage
                window.open(chrome.runtime.getURL('src/options.html'));
            }
        });
    }
});
