// Facebook Graph API Wrapper

class FacebookAPI {
    constructor(credentials) {
        this.appId = credentials.appId;
        this.appSecret = credentials.appSecret;
        this.accessToken = credentials.accessToken;
        this.apiVersion = credentials.apiVersion || 'v18.0';
        this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
        this.debug = false;
    }
    
    // Test API connection
    async testConnection() {
        try {
            const response = await this._makeRequest('/me', { fields: 'id,name,email' });
            this.log('Connection test successful:', response);
            return {
                success: true,
                name: response.name,
                email: response.email
            };
        } catch (error) {
            this.log('Connection test failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Get user's pages
    async getPages() {
        try {
            const cacheKey = 'pages_' + this.accessToken;
            const cached = await StorageManager.getCache(cacheKey);
            if (cached) return cached;
            
            const response = await this._makeRequest('/me/accounts', {
                fields: 'id,name,category,fan_count,followers_count'
            });
            
            const pages = response.data || [];
            await StorageManager.setCache(cacheKey, pages);
            return pages;
        } catch (error) {
            this.log('Error getting pages:', error);
            return [];
        }
    }
    
    // Get user's groups
    async getGroups() {
        try {
            const cacheKey = 'groups_' + this.accessToken;
            const cached = await StorageManager.getCache(cacheKey);
            if (cached) return cached;
            
            const response = await this._makeRequest('/me/groups', {
                fields: 'id,name,member_count,updated_time'
            });
            
            const groups = response.data || [];
            await StorageManager.setCache(cacheKey, groups);
            return groups;
        } catch (error) {
            this.log('Error getting groups:', error);
            return [];
        }
    }
    
    // Get user's posts
    async getPosts(pageId = null) {
        try {
            const endpoint = pageId ? `/${pageId}/posts` : '/me/posts';
            const cacheKey = 'posts_' + (pageId || 'me');
            const cached = await StorageManager.getCache(cacheKey);
            if (cached) return cached;
            
            const response = await this._makeRequest(endpoint, {
                fields: 'id,message,created_time,type,likes.summary(total_count).limit(0),comments.summary(total_count).limit(0)',
                limit: 25
            });
            
            const posts = (response.data || []).map(post => ({
                ...post,
                likes: post.likes?.summary?.total_count || 0,
                comments: post.comments?.summary?.total_count || 0
            }));
            
            await StorageManager.setCache(cacheKey, posts);
            return posts;
        } catch (error) {
            this.log('Error getting posts:', error);
            return [];
        }
    }
    
    // Get user's messages
    async getMessages() {
        try {
            const cacheKey = 'messages_' + this.accessToken;
            const cached = await StorageManager.getCache(cacheKey);
            if (cached) return cached;
            
            const response = await this._makeRequest('/me/conversations', {
                fields: 'id,name,senders,updated_time,former_participants',
                limit: 25
            });
            
            const conversations = response.data || [];
            await StorageManager.setCache(cacheKey, conversations);
            return conversations;
        } catch (error) {
            this.log('Error getting messages:', error);
            return [];
        }
    }
    
    // Create post
    async createPost(pageId, message, scheduledTime = null) {
        try {
            const params = {
                message: message,
                access_token: this.accessToken
            };
            
            if (scheduledTime) {
                params.scheduled_publish_time = Math.floor(new Date(scheduledTime).getTime() / 1000);
                params.is_hidden = true;
            }
            
            const response = await this._makeRequest(
                `/${pageId}/feed`,
                params,
                'POST'
            );
            
            // Clear cache
            await StorageManager.clearCache();
            
            return response;
        } catch (error) {
            this.log('Error creating post:', error);
            throw error;
        }
    }
    
    // Send message
    async sendMessage(recipientId, message) {
        try {
            const response = await this._makeRequest(
                `/${recipientId}/messages`,
                {
                    message: message,
                    access_token: this.accessToken
                },
                'POST'
            );
            
            return response;
        } catch (error) {
            this.log('Error sending message:', error);
            throw error;
        }
    }
    
    // Delete post
    async deletePost(postId) {
        try {
            const response = await this._makeRequest(
                `/${postId}`,
                { access_token: this.accessToken },
                'DELETE'
            );
            
            // Clear cache
            await StorageManager.clearCache();
            
            return response;
        } catch (error) {
            this.log('Error deleting post:', error);
            throw error;
        }
    }
    
    // Update post
    async updatePost(postId, message) {
        try {
            const response = await this._makeRequest(
                `/${postId}`,
                {
                    message: message,
                    access_token: this.accessToken
                },
                'POST'
            );
            
            // Clear cache
            await StorageManager.clearCache();
            
            return response;
        } catch (error) {
            this.log('Error updating post:', error);
            throw error;
        }
    }
    
    // Private method to make API requests
    async _makeRequest(endpoint, params = {}, method = 'GET') {
        const settings = await StorageManager.getSettings();
        const url = new URL(this.baseUrl + endpoint);
        
        // Add access token to params
        params.access_token = this.accessToken;
        
        if (method === 'GET') {
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        }
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: (settings.requestTimeout || 30) * 1000
        };
        
        if (method !== 'GET') {
            options.body = JSON.stringify(params);
        }
        
        this.log(`${method} ${url.toString()}`);
        
        const response = await Promise.race([
            fetch(url.toString(), options),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), options.timeout)
            )
        ]);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`API Error (${response.status}): ${error.error?.message || 'Unknown error'}`);
        }
        
        const data = await response.json();
        this.log('Response:', data);
        return data;
    }
    
    // Logging utility
    log(...args) {
        if (this.debug) {
            console.log('[Facebook API]', ...args);
        }
    }
}
