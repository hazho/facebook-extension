// Storage Manager - Handles all local storage for the extension

const StorageManager = {
    // Keys
    KEYS: {
        CREDENTIALS: 'fb_credentials',
        SETTINGS: 'fb_settings',
        CACHE: 'fb_cache',
        LAST_SYNC: 'fb_last_sync'
    },
    
    // Default credentials
    DEFAULT_CREDENTIALS: {
        appId: '',
        appSecret: '',
        accessToken: '',
        apiVersion: 'v18.0'
    },
    
    // Default settings
    DEFAULT_SETTINGS: {
        features: {
            pages: true,
            groups: true,
            posts: true,
            messages: true,
            notifications: true,
            scheduling: true,
            autoRefresh: true
        },
        debug: false,
        refreshInterval: 10,
        cacheDuration: 60,
        requestTimeout: 30
    },
    
    // Get credentials
    async getCredentials() {
        const data = await chrome.storage.sync.get(this.KEYS.CREDENTIALS);
        return data[this.KEYS.CREDENTIALS] || this.DEFAULT_CREDENTIALS;
    },
    
    // Save credentials
    async saveCredentials(credentials) {
        return new Promise((resolve) => {
            const obj = {};
            obj[this.KEYS.CREDENTIALS] = credentials;
            chrome.storage.sync.set(obj, resolve);
        });
    },
    
    // Get settings
    async getSettings() {
        const data = await chrome.storage.sync.get(this.KEYS.SETTINGS);
        return { ...this.DEFAULT_SETTINGS, ...data[this.KEYS.SETTINGS] };
    },
    
    // Save settings
    async saveSettings(settings) {
        return new Promise((resolve) => {
            const obj = {};
            obj[this.KEYS.SETTINGS] = settings;
            chrome.storage.sync.set(obj, resolve);
        });
    },
    
    // Get cache
    async getCache(key) {
        const data = await chrome.storage.local.get(this.KEYS.CACHE);
        const cache = data[this.KEYS.CACHE] || {};
        
        if (cache[key]) {
            const { value, timestamp } = cache[key];
            const settings = await this.getSettings();
            const cacheAge = (Date.now() - timestamp) / 1000 / 60; // minutes
            
            if (cacheAge < settings.cacheDuration) {
                return value;
            }
        }
        return null;
    },
    
    // Set cache
    async setCache(key, value) {
        const data = await chrome.storage.local.get(this.KEYS.CACHE);
        const cache = data[this.KEYS.CACHE] || {};
        
        cache[key] = {
            value: value,
            timestamp: Date.now()
        };
        
        return new Promise((resolve) => {
            const obj = {};
            obj[this.KEYS.CACHE] = cache;
            chrome.storage.local.set(obj, resolve);
        });
    },
    
    // Clear cache
    async clearCache() {
        return new Promise((resolve) => {
            chrome.storage.local.remove(this.KEYS.CACHE, resolve);
        });
    },
    
    // Get last sync time
    async getLastSync(key) {
        const data = await chrome.storage.local.get(this.KEYS.LAST_SYNC);
        const syncs = data[this.KEYS.LAST_SYNC] || {};
        return syncs[key] || 0;
    },
    
    // Set last sync time
    async setLastSync(key) {
        const data = await chrome.storage.local.get(this.KEYS.LAST_SYNC);
        const syncs = data[this.KEYS.LAST_SYNC] || {};
        
        syncs[key] = Date.now();
        
        return new Promise((resolve) => {
            const obj = {};
            obj[this.KEYS.LAST_SYNC] = syncs;
            chrome.storage.local.set(obj, resolve);
        });
    },
    
    // Reset all
    async reset() {
        return new Promise((resolve) => {
            chrome.storage.sync.clear(() => {
                chrome.storage.local.clear(resolve);
            });
        });
    }
};
