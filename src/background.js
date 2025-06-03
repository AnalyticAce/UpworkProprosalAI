/**
 * Background script for the Upwork Proposal AI Extension
 * Handles communication between content script and AI service
 */

// Import scripts in service worker environment
try {
    importScripts('./service-worker-polyfill.js');
    importScripts('./ai-service.js');
} catch (e) {
    console.error('Error importing scripts:', e);
}

// Initialize the AI service
let aiService = null;

// Load the API key on extension start
initializeAIService();

// Listen for messages from content scripts
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background script received message:', message);

    // Handle different message actions
    switch (message.action) {
        case 'generateProposal':
            handleProposalGeneration(message, sendResponse);
            return true; // Keep the message channel open for async response
        
        case 'saveApiKey':
            saveApiKey(message.apiKey, sendResponse);
            return true;
        
        case 'getApiKey':
            getApiKey(sendResponse);
            return true;

        case 'getFreelancerProfile':
            getFreelancerProfile(sendResponse);
            return true;
    }
});

/**
 * Initialize the AI service with the API key and selected model
 */
async function initializeAIService() {
    try {
        // Get settings from storage
        const settings = await new Promise((resolve) => {
            browserAPI.storage.sync.get(['openaiApiKey', 'openaiModel'], resolve);
        });
        
        if (settings.openaiApiKey) {
            // Initialize the service
            aiService = new AIService(settings.openaiApiKey);
            
            // Set the model if specified
            if (settings.openaiModel) {
                aiService.setModel(settings.openaiModel);
            }
            
            console.log('AI service initialized successfully with model:', settings.openaiModel || 'default');
        } else {
            console.log('No API key found, AI service not initialized');
        }
    } catch (error) {
        console.error('Error initializing AI service:', error);
    }
}

/**
 * Handle proposal generation request
 * @param {Object} message - The message containing job data and options
 * @param {Function} sendResponse - Function to send response back to content script
 */
async function handleProposalGeneration(message, sendResponse) {
    try {
        // Get settings from storage
        const settings = await new Promise((resolve) => {
            browserAPI.storage.sync.get(['openaiApiKey', 'openaiModel'], resolve);
        });
        
        // Initialize AI service if not already done or if settings have changed
        if (!aiService || aiService.apiKey !== settings.openaiApiKey) {
            if (!settings.openaiApiKey) {
                sendResponse({ error: 'API key not configured. Please set up your OpenAI API key in the extension options.' });
                return;
            }
            aiService = new AIService(settings.openaiApiKey);
        }
        
        // Set the model if specified
        if (settings.openaiModel) {
            aiService.setModel(settings.openaiModel);
        }
        
        // Log the request (without API keys)
        console.log('Generating proposal with options:', {
            ...message.options,
            model: settings.openaiModel || 'default'
        });
        
        // Generate proposal
        const proposal = await aiService.generateProposal(message.jobData, message.options);
        
        // Send response back to content script
        sendResponse({ proposal });
    } catch (error) {
        // Ensure error messages are redacted before logging
        console.error('Error generating proposal:', redactApiKey(error.message));
        sendResponse({ error: error.message }); // Original error to UI (doesn't expose API key)
    }
}

/**
 * Save the API key
 * @param {string} apiKey - The API key to save
 * @param {Function} sendResponse - Function to send response
 */
async function saveApiKey(apiKey, sendResponse) {
    try {
        await AIService.saveApiKeyToStorage(apiKey);
        aiService = new AIService(apiKey);
        sendResponse({ success: true });
    } catch (error) {
        console.error('Error saving API key:', error);
        sendResponse({ error: error.message });
    }
}

/**
 * Get the current API key
 * @param {Function} sendResponse - Function to send response
 */
async function getApiKey(sendResponse) {
    try {
        const apiKey = await AIService.getApiKeyFromStorage();
        sendResponse({ apiKey });
    } catch (error) {
        console.error('Error getting API key:', error);
        sendResponse({ error: error.message });
    }
}

/**
 * Get the freelancer profile data from storage
 * @param {Function} sendResponse - Function to send response
 */
async function getFreelancerProfile(sendResponse) {
    try {
        const profileData = await new Promise((resolve) => {
            browserAPI.storage.sync.get([
                'freelancerExperience',
                'freelancerSpecialty',
                'freelancerAchievements'
            ], resolve);
        });
        
        sendResponse({ 
            success: true,
            profileData: profileData 
        });
    } catch (error) {
        console.error('Error getting freelancer profile data:', error);
        sendResponse({ 
            error: error.message,
            success: false
        });
    }
}

/**
 * Utility to redact sensitive information like API keys from logs
 * @param {string} text - Text that might contain an API key
 * @return {string} Redacted text
 */
function redactApiKey(text) {
    if (!text) return text;
    
    // Pattern for OpenAI API keys
    const apiKeyPattern = /sk-[a-zA-Z0-9]{20,}/g;
    
    // Replace with redacted version
    return text.toString().replace(apiKeyPattern, key => {
        // Show only first 3 and last 4 characters
        return `${key.substring(0, 5)}...${key.substring(key.length - 4)}`;
    });
}

// Override console.log to redact API keys
const originalConsoleLog = console.log;
console.log = function() {
    const args = Array.from(arguments).map(arg => {
        if (typeof arg === 'string') {
            return redactApiKey(arg);
        }
        return arg;
    });
    originalConsoleLog.apply(console, args);
};