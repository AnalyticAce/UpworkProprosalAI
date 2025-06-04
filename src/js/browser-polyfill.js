/**
 * Browser API compatibility layer
 * Provides a consistent way to access browser APIs across different browsers
 */

const browserAPI = (function() {
    // Service workers (background) don't have window object
    if (typeof self !== 'undefined' && typeof window === 'undefined') {
        // In service worker context
        return self.browser || self.chrome;
    } else if (typeof window !== 'undefined') {
        // In window context (content scripts, popup, options)
        return window.browser || window.chrome;
    } else {
        console.error('No browser extension API detected');
        return null;
    }
})();

// Export the standardized browser API
if (typeof module !== 'undefined') {
    module.exports = browserAPI;
}

// Make browserAPI available globally
if (typeof window !== 'undefined') {
    window.browserAPI = browserAPI;
} else if (typeof self !== 'undefined') {
    self.browserAPI = browserAPI;
}
