// Popup Script for Facebook Business Manager Extension

const TABS = ['pages', 'groups', 'posts', 'messages'];

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        switchTab(tabName);
    });
});

function switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update active tab content
    TABS.forEach(tab => {
        const content = document.getElementById(tab + '-tab');
        content.classList.toggle('active', tab === tabName);
    });
    
    // Load data based on tab
    loadTabData(tabName);
}

// Settings button
document.getElementById('settingsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});

// Verify API connection on load
window.addEventListener('DOMContentLoaded', async () => {
    await verifyConnection();
    loadTabData('pages');
});

async function verifyConnection() {
    try {
        const credentials = await StorageManager.getCredentials();
        
        if (!credentials.appId || !credentials.accessToken) {
            setStatus('❌ API credentials not configured. Go to settings.', 'error');
            return false;
        }
        
        const api = new FacebookAPI(credentials);
        const result = await api.testConnection();
        
        if (result.success) {
            setStatus('✅ Connected to Facebook API', 'success');
            return true;
        } else {
            setStatus('❌ Failed to connect: ' + result.error, 'error');
            return false;
        }
    } catch (error) {
        console.error('Connection error:', error);
        setStatus('❌ Error: ' + error.message, 'error');
        return false;
    }
}

function setStatus(message, type = 'info') {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = 'status ' + type;
}

// Load tab data
async function loadTabData(tabName) {
    const credentials = await StorageManager.getCredentials();
    const api = new FacebookAPI(credentials);
    
    switch(tabName) {
        case 'pages':
            await loadPages(api);
            break;
        case 'groups':
            await loadGroups(api);
            break;
        case 'posts':
            await loadPosts(api);
            break;
        case 'messages':
            await loadMessages(api);
            break;
    }
}

// PAGES
async function loadPages(api) {
    try {
        setStatus('Loading pages...', 'info');
        const pages = await api.getPages();
        const pagesList = document.getElementById('pagesList');
        const pageSelect = document.getElementById('pageSelect');
        
        pagesList.innerHTML = '';
        pageSelect.innerHTML = '<option value="">Select a page...</option>';
        
        pages.forEach(page => {
            // Add to list
            const pageEl = document.createElement('div');
            pageEl.className = 'item';
            pageEl.innerHTML = `
                <strong>${page.name}</strong>
                <p>ID: ${page.id}</p>
                <p>Likes: ${page.fan_count || 'N/A'} | Followers: ${page.followers_count || 'N/A'}</p>
                <button onclick="editPage('${page.id}')">Edit</button>
                <button onclick="deletePage('${page.id}')">Delete</button>
            `;
            pagesList.appendChild(pageEl);
            
            // Add to select
            const option = document.createElement('option');
            option.value = page.id;
            option.textContent = page.name;
            pageSelect.appendChild(option);
        });
        
        setStatus(`✅ Loaded ${pages.length} pages`, 'success');
    } catch (error) {
        console.error('Error loading pages:', error);
        setStatus('❌ Error loading pages: ' + error.message, 'error');
    }
}

async function loadGroups(api) {
    try {
        setStatus('Loading groups...', 'info');
        const groups = await api.getGroups();
        const groupsList = document.getElementById('groupsList');
        
        groupsList.innerHTML = '';
        groups.forEach(group => {
            const groupEl = document.createElement('div');
            groupEl.className = 'item';
            groupEl.innerHTML = `
                <strong>${group.name}</strong>
                <p>ID: ${group.id}</p>
                <p>Members: ${group.member_count || 'N/A'}</p>
                <button onclick="viewGroup('${group.id}')">View</button>
            `;
            groupsList.appendChild(groupEl);
        });
        
        setStatus(`✅ Loaded ${groups.length} groups`, 'success');
    } catch (error) {
        console.error('Error loading groups:', error);
        setStatus('❌ Error loading groups: ' + error.message, 'error');
    }
}

async function loadPosts(api) {
    try {
        setStatus('Loading posts...', 'info');
        const posts = await api.getPosts();
        const postsList = document.getElementById('postsList');
        
        postsList.innerHTML = '';
        posts.forEach(post => {
            const postEl = document.createElement('div');
            postEl.className = 'item';
            postEl.innerHTML = `
                <strong>${post.message || 'No content'}</strong>
                <p>Created: ${new Date(post.created_time).toLocaleString()}</p>
                <p>Likes: ${post.likes || 0} | Comments: ${post.comments || 0}</p>
                <button onclick="editPost('${post.id}')">Edit</button>
                <button onclick="deletePost('${post.id}')">Delete</button>
            `;
            postsList.appendChild(postEl);
        });
        
        setStatus(`✅ Loaded ${posts.length} posts`, 'success');
    } catch (error) {
        console.error('Error loading posts:', error);
        setStatus('❌ Error loading posts: ' + error.message, 'error');
    }
}

async function loadMessages(api) {
    try {
        setStatus('Loading conversations...', 'info');
        const conversations = await api.getMessages();
        const messagesList = document.getElementById('messagesList');
        
        messagesList.innerHTML = '';
        conversations.forEach(conv => {
            const convEl = document.createElement('div');
            convEl.className = 'item';
            convEl.innerHTML = `
                <strong>${conv.name || 'Conversation'}</strong>
                <p>Last message: ${conv.updated_time ? new Date(conv.updated_time).toLocaleString() : 'N/A'}</p>
                <button onclick="viewMessages('${conv.id}')">View</button>
            `;
            messagesList.appendChild(convEl);
        });
        
        setStatus(`✅ Loaded ${conversations.length} conversations`, 'success');
    } catch (error) {
        console.error('Error loading messages:', error);
        setStatus('❌ Error loading messages: ' + error.message, 'error');
    }
}

// Refresh buttons
document.getElementById('refreshPages').addEventListener('click', async () => {
    const credentials = await StorageManager.getCredentials();
    const api = new FacebookAPI(credentials);
    await loadPages(api);
});

document.getElementById('refreshGroups').addEventListener('click', async () => {
    const credentials = await StorageManager.getCredentials();
    const api = new FacebookAPI(credentials);
    await loadGroups(api);
});

document.getElementById('refreshPosts').addEventListener('click', async () => {
    const credentials = await StorageManager.getCredentials();
    const api = new FacebookAPI(credentials);
    await loadPosts(api);
});

document.getElementById('refreshMessages').addEventListener('click', async () => {
    const credentials = await StorageManager.getCredentials();
    const api = new FacebookAPI(credentials);
    await loadMessages(api);
});

// Create post
document.getElementById('createPost').addEventListener('click', async () => {
    const credentials = await StorageManager.getCredentials();
    const api = new FacebookAPI(credentials);
    const pageId = document.getElementById('pageSelect').value;
    const content = document.getElementById('postContent').value;
    const scheduledTime = document.getElementById('scheduleTime').value;
    
    if (!pageId || !content) {
        alert('Please select a page and enter content');
        return;
    }
    
    try {
        const result = await api.createPost(pageId, content, scheduledTime);
        alert('Post created successfully!');
        document.getElementById('postContent').value = '';
        await loadPages(api);
    } catch (error) {
        alert('Error creating post: ' + error.message);
    }
});

// Send message
document.getElementById('sendMessage').addEventListener('click', async () => {
    const credentials = await StorageManager.getCredentials();
    const api = new FacebookAPI(credentials);
    const recipientId = document.getElementById('recipientId').value;
    const message = document.getElementById('messageContent').value;
    
    if (!recipientId || !message) {
        alert('Please enter recipient ID and message');
        return;
    }
    
    try {
        await api.sendMessage(recipientId, message);
        alert('Message sent!');
        document.getElementById('messageContent').value = '';
        document.getElementById('recipientId').value = '';
        await loadMessages(api);
    } catch (error) {
        alert('Error sending message: ' + error.message);
    }
});

// Placeholder functions for edit/delete
function editPage(pageId) { alert('Edit page ' + pageId); }
function deletePage(pageId) { alert('Delete page ' + pageId); }
function viewGroup(groupId) { alert('View group ' + groupId); }
function editPost(postId) { alert('Edit post ' + postId); }
function deletePost(postId) { alert('Delete post ' + postId); }
function viewMessages(conversationId) { alert('View messages ' + conversationId); }
