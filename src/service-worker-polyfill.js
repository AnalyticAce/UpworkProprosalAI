/**
 * Service Worker Browser API compatibility layer
 * Provides a consistent way to access browser APIs in service worker context
 */

const browserAPI = (function() {
    // In service worker context
    return self.chrome;
})();

// Make browserAPI available globally in the service worker scope
self.browserAPI = browserAPI;
