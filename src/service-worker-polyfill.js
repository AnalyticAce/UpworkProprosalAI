/**
 * Service Worker Browser API compatibility layer
 * Provides a consistent way to access browser APIs in service worker context
 */

// Check if browserAPI is already defined
if (typeof self.browserAPI === 'undefined') {
    // Define browserAPI if it doesn't exist yet
    self.browserAPI = self.chrome;
}
