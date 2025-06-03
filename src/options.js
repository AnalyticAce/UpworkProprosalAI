/**
 * Options page script for Upwork Proposal AI extension
 * Manages storage and retrieval of user settings (API key and freelancer profile)
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load settings when the page loads
    loadSettings();
    
    // Add event listener to save button
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    
    // Add event listener to toggle API key visibility
    document.getElementById('toggle-key-visibility').addEventListener('click', toggleApiKeyVisibility);
    
    // Add event listener to update masked display when API key input changes
    document.getElementById('api-key').addEventListener('input', function() {
        if (this.type === 'password') {
            updateMaskedKeyDisplay(this.value);
        }
    });
});

// Use the browser namespace if available (Firefox, some Edge)
// Otherwise fallback to chrome (Chrome, Edge, Opera)
const browserAPI = window.browser || window.chrome || null;

/**
 * Load settings from storage and populate the form
 */
async function loadSettings() {
    browserAPI.storage.sync.get([
        'openaiApiKey',
        'openaiModel',
        'freelancerExperience',
        'freelancerSpecialty',
        'freelancerAchievements'
    ], (result) => {
        // Set API key (ensuring the input type is password for security)
        const apiKeyInput = document.getElementById('api-key');
        apiKeyInput.type = 'password';
        
        if (result.openaiApiKey) {
            apiKeyInput.value = result.openaiApiKey;
            // Update the masked display
            updateMaskedKeyDisplay(result.openaiApiKey);
        }
        
        // Set model
        if (result.openaiModel) {
            document.getElementById('model').value = result.openaiModel;
        }
        
        // Set freelancer details
        if (result.freelancerExperience) {
            document.getElementById('experience').value = result.freelancerExperience;
        }
        
        if (result.freelancerSpecialty) {
            document.getElementById('specialty').value = result.freelancerSpecialty;
        }
        
        if (result.freelancerAchievements) {
            document.getElementById('achievements').value = result.freelancerAchievements;
        }
    });
}

/**
 * Save settings to Chrome storage
 */
async function saveSettings() {
    const apiKey = document.getElementById('api-key').value.trim();
    const model = document.getElementById('model').value;
    const experience = document.getElementById('experience').value.trim();
    const specialty = document.getElementById('specialty').value.trim();
    const achievements = document.getElementById('achievements').value.trim();
    
    // Basic validation for API key
    if (!apiKey || !apiKey.startsWith('sk-')) {
        showStatusMessage('Please enter a valid OpenAI API key starting with "sk-"', 'error');
        return;
    }
    
    try {
        // Save to storage
        await browserAPI.storage.sync.set({
            'openaiApiKey': apiKey,
            'openaiModel': model,
            'freelancerExperience': experience,
            'freelancerSpecialty': specialty,
            'freelancerAchievements': achievements
        });
        
        // Notify background script about the API key update
        browserAPI.runtime.sendMessage({ action: 'saveApiKey', apiKey });
        
        showStatusMessage('Settings saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving settings:', error);
        showStatusMessage('Failed to save settings. Please try again.', 'error');
    }
}

/**
 * Show status message to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of message ('success' or 'error')
 */
function showStatusMessage(message, type) {
    const statusElement = document.getElementById('status-message');
    
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;
    statusElement.classList.remove('hidden');
    
    // Hide the message after 3 seconds
    setTimeout(() => {
        statusElement.classList.add('hidden');
    }, 3000);
}

/**
 * Toggle the visibility of the API key input field
 */
function toggleApiKeyVisibility() {
    const apiKeyInput = document.getElementById('api-key');
    const toggleButton = document.getElementById('toggle-key-visibility');
    const maskedDisplay = document.getElementById('masked-key-display');
    
    if (apiKeyInput.type === 'password') {
        // Show the key
        apiKeyInput.type = 'text';
        toggleButton.textContent = 'Hide';
        maskedDisplay.textContent = ''; // Clear masked display when showing full key
    } else {
        // Hide the key
        apiKeyInput.type = 'password';
        toggleButton.textContent = 'Show';
        updateMaskedKeyDisplay(apiKeyInput.value); // Update masked display
    }
}

/**
 * Update the masked key display element
 * @param {string} key - The API key to mask and display
 */
function updateMaskedKeyDisplay(key) {
    const maskedDisplay = document.getElementById('masked-key-display');
    if (!key) {
        maskedDisplay.textContent = '';
        return;
    }
    
    maskedDisplay.textContent = maskApiKey(key);
}

/**
 * Create a masked version of the API key for display
 * @param {string} apiKey - The full API key
 * @return {string} The masked API key
 */
function maskApiKey(apiKey) {
    if (!apiKey || apiKey.length < 10) return apiKey;
    
    // Show first 3 and last 4 characters, mask the rest
    const firstPart = apiKey.substring(0, 3);
    const lastPart = apiKey.substring(apiKey.length - 4);
    const maskedPart = '●'.repeat(Math.min(15, apiKey.length - 7)); // Limit the number of bullets for long keys
    
    return `${firstPart}${maskedPart}${lastPart}`;
}
