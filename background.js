// Service Worker for Facebook Business Manager Extension

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('Facebook Business Manager Extension installed');
    chrome.runtime.openOptionsPage();
});

// Set up auto-refresh alarm
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'autoRefresh') {
        performAutoRefresh();
    }
});

async function performAutoRefresh() {
    const settings = await chrome.storage.sync.get('fb_settings');
    const refreshInterval = (settings.fb_settings?.refreshInterval || 10) * 60 * 1000;
    
    if (settings.fb_settings?.features?.autoRefresh) {
        // Perform refresh tasks
        console.log('Auto-refresh triggered');
        // TODO: Implement actual refresh logic
    }
    
    // Schedule next refresh
    chrome.alarms.create('autoRefresh', { periodInMinutes: settings.fb_settings?.refreshInterval || 10 });
}

// Listen for messages from popup/options pages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'log' && request.debug) {
        console.log('[FB Extension]', request.data);
    }
});

// Start auto-refresh on installation
performAutoRefresh();
