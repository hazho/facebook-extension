// Options Page Script

// Load settings on page load
window.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
});

async function loadSettings() {
    const settings = await StorageManager.getSettings();
    const credentials = await StorageManager.getCredentials();
    
    // Load credentials
    document.getElementById('appId').value = credentials.appId || '';
    document.getElementById('appSecret').value = credentials.appSecret || '';
    document.getElementById('accessToken').value = credentials.accessToken || '';
    document.getElementById('apiVersion').value = credentials.apiVersion || 'v18.0';
    
    // Load feature settings
    document.getElementById('enablePages').checked = settings.features.pages !== false;
    document.getElementById('enableGroups').checked = settings.features.groups !== false;
    document.getElementById('enablePosts').checked = settings.features.posts !== false;
    document.getElementById('enableMessages').checked = settings.features.messages !== false;
    document.getElementById('enableNotifications').checked = settings.features.notifications !== false;
    document.getElementById('enableScheduling').checked = settings.features.scheduling !== false;
    document.getElementById('enableAutoRefresh').checked = settings.features.autoRefresh !== false;
    document.getElementById('enableDebug').checked = settings.debug !== false;
    
    // Load advanced settings
    document.getElementById('refreshInterval').value = settings.refreshInterval || '10';
    document.getElementById('cacheDuration').value = settings.cacheDuration || '60';
    document.getElementById('requestTimeout').value = settings.requestTimeout || '30';
}

// Save settings
document.getElementById('saveSettings').addEventListener('click', async () => {
    const credentials = {
        appId: document.getElementById('appId').value,
        appSecret: document.getElementById('appSecret').value,
        accessToken: document.getElementById('accessToken').value,
        apiVersion: document.getElementById('apiVersion').value
    };
    
    const settings = {
        features: {
            pages: document.getElementById('enablePages').checked,
            groups: document.getElementById('enableGroups').checked,
            posts: document.getElementById('enablePosts').checked,
            messages: document.getElementById('enableMessages').checked,
            notifications: document.getElementById('enableNotifications').checked,
            scheduling: document.getElementById('enableScheduling').checked,
            autoRefresh: document.getElementById('enableAutoRefresh').checked
        },
        debug: document.getElementById('enableDebug').checked,
        refreshInterval: parseInt(document.getElementById('refreshInterval').value),
        cacheDuration: parseInt(document.getElementById('cacheDuration').value),
        requestTimeout: parseInt(document.getElementById('requestTimeout').value)
    };
    
    try {
        await StorageManager.saveCredentials(credentials);
        await StorageManager.saveSettings(settings);
        showStatus('✅ Settings saved successfully!', 'success');
    } catch (error) {
        showStatus('❌ Error saving settings: ' + error.message, 'error');
    }
});

// Test connection
document.getElementById('testConnection').addEventListener('click', async () => {
    const credentials = {
        appId: document.getElementById('appId').value,
        appSecret: document.getElementById('appSecret').value,
        accessToken: document.getElementById('accessToken').value,
        apiVersion: document.getElementById('apiVersion').value
    };
    
    if (!credentials.appId || !credentials.accessToken) {
        showConnectionResult('❌ Please enter App ID and Access Token', 'error');
        return;
    }
    
    try {
        showConnectionResult('⏳ Testing connection...', 'info');
        const api = new FacebookAPI(credentials);
        const result = await api.testConnection();
        
        if (result.success) {
            showConnectionResult('✅ Connection successful! You are logged in as: ' + (result.name || 'User'), 'success');
        } else {
            showConnectionResult('❌ Connection failed: ' + result.error, 'error');
        }
    } catch (error) {
        showConnectionResult('❌ Error: ' + error.message, 'error');
    }
});

// Export settings
document.getElementById('exportSettings').addEventListener('click', async () => {
    const credentials = await StorageManager.getCredentials();
    const settings = await StorageManager.getSettings();
    
    // NOTE: Don't export sensitive data in production
    const exportData = { settings }; // Exclude credentials for security
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fb-extension-settings.json';
    link.click();
    
    showStatus('✅ Settings exported', 'success');
});

// Import settings
document.getElementById('importSettings').addEventListener('click', () => {
    document.getElementById('settingsFile').click();
});

document.getElementById('settingsFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        if (data.settings) {
            await StorageManager.saveSettings(data.settings);
            await loadSettings();
            showStatus('✅ Settings imported successfully', 'success');
        }
    } catch (error) {
        showStatus('❌ Error importing settings: ' + error.message, 'error');
    }
});

// Clear cache
document.getElementById('clearCache').addEventListener('click', async () => {
    if (confirm('Clear all cached data?')) {
        await StorageManager.clearCache();
        showStatus('✅ Cache cleared', 'success');
    }
});

// Reset all
document.getElementById('resetAll').addEventListener('click', async () => {
    if (confirm('⚠️ This will reset ALL settings and credentials. Are you sure?')) {
        if (confirm('This action cannot be undone. Continue?')) {
            await StorageManager.reset();
            await loadSettings();
            showStatus('✅ All settings reset to defaults', 'success');
        }
    }
});

// Cancel
document.getElementById('cancelSettings').addEventListener('click', () => {
    loadSettings();
});

function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = 'status-message ' + type;
    setTimeout(() => {
        statusEl.textContent = '';
    }, 3000);
}

function showConnectionResult(message, type = 'info') {
    const resultEl = document.getElementById('connectionResult');
    resultEl.textContent = message;
    resultEl.className = 'result-message ' + type;
}
