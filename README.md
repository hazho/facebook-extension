# 📱 Facebook Business Manager - Browser Extension

A comprehensive, fully-dynamic browser extension for managing Facebook Pages, Groups, Posts, and Messages using the official Facebook Graph API.

## ✨ Features

### Core Functionality
- **📄 Pages Management** - Manage multiple Facebook pages, view metrics
- **👥 Groups Management** - View and manage your groups
- **📝 Posts Management** - Create, edit, schedule, and delete posts
- **💬 Messages Management** - Send and manage conversations

### Advanced Features
- **🔔 Notifications** - Real-time browser notifications
- **⏰ Post Scheduling** - Schedule posts for future publishing
- **🔄 Auto-Refresh** - Automatic data synchronization
- **💾 Caching** - Smart caching for better performance
- **🐛 Debug Mode** - Detailed logging for troubleshooting

## 🔐 Security & Compliance

✅ **Official Graph API Only** - No DOM scraping  
✅ **User-Controlled Credentials** - Stored locally in browser  
✅ **No Data Collection** - No external servers  
✅ **Chrome Storage API** - Encrypted local storage  
✅ **HTTPS Only** - All API calls are encrypted  
✅ **Manifest V3** - Latest security standards  

## 📋 Requirements

- Chrome/Chromium browser (v88+)
- Facebook Developer Account
- Facebook App with appropriate permissions

## 🚀 Installation

### 1. Prepare Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create or select your app
3. Go to **Settings → Basic** to get:
   - App ID
   - App Secret
4. Go to **Tools → Graph API Explorer** to generate:
   - Access Token (with appropriate permissions)

### Required Permissions
```
pages_manage_metadata
pages_read_engagement
pages_read_posts
pages_manage_posts
instagram_manage_messages
messages_read
```

### 2. Install Extension

**Option A: Load Unpacked (Development)**

1. Clone this repository
2. Open `chrome://extensions`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the extension folder

**Option B: Chrome Web Store (When Published)**

Search for "Facebook Business Manager" in Chrome Web Store

### 3. Configure Extension

1. Click the extension icon → ⚙️ Settings
2. Enter your API credentials:
   - App ID
   - App Secret
   - Access Token
   - API Version (default: v18.0)
3. Toggle features on/off as needed
4. Click "Test Connection" to verify
5. Save settings

## 💻 Usage

### Pages Tab
- View all managed pages with real-time metrics
- Create new posts
- Schedule posts for future publishing
- Edit/delete existing posts

### Groups Tab
- List all your groups
- View member counts
- Access group information

### Posts Tab
- View recent posts from all pages
- See engagement statistics (likes, comments)
- Edit or delete posts

### Messages Tab
- View all conversations
- Send new messages
- View message history

## ⚙️ Configuration

### API Settings
- **App ID**: Your Facebook App ID
- **App Secret**: Your Facebook App Secret (kept confidential)
- **Access Token**: Authentication token for API calls
- **API Version**: Select the Graph API version (v15.0-v18.0)

### Feature Toggles
Enable/disable each feature independently:
- Pages Management
- Groups Management
- Posts Management
- Messages Management
- Notifications
- Post Scheduling
- Auto-Refresh

### Advanced Options
- **Debug Mode**: Enable detailed logging
- **Refresh Interval**: 1-60 minutes
- **Cache Duration**: 0-1440 minutes (0 = disabled)
- **Request Timeout**: 5-120 seconds

## 🔄 Auto-Refresh

When enabled, the extension automatically:
- Syncs data at specified intervals
- Updates pages, groups, posts, and messages
- Maintains cache efficiently
- Sends notifications for new messages

## 📊 Data & Privacy

- All data is stored locally in your browser
- No data is collected or sent to external servers
- No tracking or analytics
- Full user control over data

## 💾 Export/Import Settings

In Settings page:
- **Export Settings**: Download your configuration (excludes sensitive credentials)
- **Import Settings**: Restore previous configuration
- **Clear Cache**: Remove all cached data
- **Reset All**: Restore to factory defaults

## 🐛 Troubleshooting

### Connection Failed
1. Verify App ID is correct
2. Check Access Token is valid and not expired
3. Ensure token has required permissions
4. Generate a new token in Graph API Explorer
5. Enable Debug Mode to see detailed errors

### Posts Not Appearing
1. Check if Pages feature is enabled
2. Verify page selection in dropdown
3. Clear cache and refresh
4. Check Facebook API status

### Messages Not Loading
1. Verify Messages feature is enabled
2. Ensure access token has message permissions
3. Check browser console (F12) for errors
4. Try refreshing manually

## 📁 File Structure

```
facebook-extension/
├── manifest.json              # Extension configuration
├── popup.html                 # Main popup interface
├── popup.js                   # Popup logic
├── options.html               # Settings page
├── options.js                 # Settings logic
├── background.js              # Service worker
├── utils/
│   ├── storage.js            # Local storage management
│   └── api.js                # Facebook API wrapper
├── styles/
│   ├── popup.css             # Popup styling
│   └── options.css           # Settings styling
├── images/
│   ├── icon-16.png           # 16x16 icon
│   ├── icon-48.png           # 48x48 icon
│   └── icon-128.png          # 128x128 icon
└── README.md                 # This file
```

## 🛠️ Development

### Enable Debug Mode
1. Go to Settings
2. Check "Debug Mode"
3. Open Chrome DevTools (F12)
4. Check Console tab for detailed logs

### Testing
- Use Chrome DevTools to inspect extension
- Check Network tab for API requests
- Review Console for errors

## 📱 API Endpoints Used

- `GET /me` - User info
- `GET /me/accounts` - User's pages
- `GET /me/groups` - User's groups
- `GET /me/posts` - User's posts
- `GET /me/conversations` - User's conversations
- `POST /[page-id]/feed` - Create post
- `POST /[user-id]/messages` - Send message
- `POST /[post-id]` - Update post
- `DELETE /[post-id]` - Delete post

## 📄 License

MIT License - Feel free to modify and distribute

## 🤝 Contributing

Contributions are welcome! Please feel free to submit Pull Requests.

## ⚠️ Disclaimer

This extension is not affiliated with Facebook/Meta. Use at your own risk and ensure compliance with Facebook's Platform Policies and terms of service.

## 📞 Support

For issues and feature requests, please open an issue on GitHub.

## 🔗 Useful Links

- [Facebook Developers](https://developers.facebook.com)
- [Graph API Documentation](https://developers.facebook.com/docs/graph-api)
- [Chrome Extensions Guide](https://developer.chrome.com/docs/extensions/)
- [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)

---

**Made with ❤️ for Facebook Business Managers**
