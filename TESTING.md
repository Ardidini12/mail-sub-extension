# Testing Guide - Mail Subscription Manager

## Quick Start

### 1. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `mail-sub-extension` folder
5. The extension should now appear in your extensions list

### 2. Test Gmail Integration

1. Click the extension icon in your Chrome toolbar
2. Click the **Scan Inbox** button
3. You'll be prompted to sign in with your Google account (if not already signed in)
4. Grant permission to read your Gmail (readonly access)
5. Wait for the scan to complete (may take 10-30 seconds)

### 3. Expected Results

**If subscriptions are found:**
- You'll see a list of email subscriptions
- Each item shows:
  - Sender name
  - Email address
  - Subject line
  - **Unsubscribe button** (red button on the right)
- Click any "Unsubscribe →" button to open the unsubscribe link in a new tab

**If no subscriptions found:**
- You'll see a message: "🎉 No subscriptions found! Your inbox is clean."

**If an error occurs:**
- Check the browser console for error messages
- Verify you granted Gmail permissions
- Try clicking "Try Again"

## Features Implemented

✅ **Gmail OAuth2 Authentication**
- Uses Chrome identity API
- Secure token-based authentication
- No password storage

✅ **Email Scanning**
- Searches last 30 days of emails
- Looks for emails with "unsubscribe" keyword
- Validates List-Unsubscribe headers
- Deduplicates by sender email

✅ **Unsubscribe Link Extraction**
- Parses List-Unsubscribe headers
- Extracts HTTP/HTTPS links
- Displays clickable unsubscribe buttons

✅ **Modern UI**
- Clean, responsive design
- Loading states
- Error handling
- Persistent storage (results saved locally)

## Architecture

```text
Extension Flow:
1. User clicks "Scan Inbox"
2. popup.js → scanner.js → GmailProvider
3. GmailProvider authenticates via OAuth2
4. Fetches emails from Gmail API
5. Parses headers for unsubscribe links
6. Returns subscription list
7. Displays in popup with unsubscribe buttons
8. Saves to chrome.storage.local
```

## Troubleshooting

### "Authentication failed"
- Clear browser cache and cookies
- Remove and re-add the extension
- Check OAuth2 client ID in manifest.json

### "No subscriptions found" (but you know you have some)
- The scan looks for emails with "unsubscribe" in the last 30 days
- Only emails with valid List-Unsubscribe headers are detected
- Try adjusting `daysBack` parameter in scanner options

### Extension won't load
- Check for JavaScript errors in console
- Verify all files are present
- Ensure manifest.json is valid JSON

## Next Steps

### Phase 2 - Backend Integration
- [ ] User authentication system
- [ ] Payment integration (Stripe)
- [ ] Free tier limits (5 subscriptions)
- [ ] Subscription sync to backend

### Phase 3 - Multi-Provider
- [ ] Outlook/Hotmail support
- [ ] Yahoo Mail support
- [ ] Generic IMAP support

### Phase 4 - Enhanced Features
- [ ] Bulk unsubscribe
- [ ] Subscription categories
- [ ] Analytics dashboard
- [ ] Export subscription list

## Development Notes

- All code follows the modular architecture defined in ARCHITECTURE.md
- Provider pattern allows easy addition of new email services
- Core logic is platform-agnostic and testable
- UI is built with vanilla JavaScript (no frameworks)

## File Structure

```text
src/
├── core/
│   ├── scanner.js          # Main scanning orchestrator
│   ├── storage.js          # Chrome storage wrapper
│   └── subscription.js     # Data models
├── providers/
│   ├── base-provider.js    # Abstract provider interface
│   └── gmail.js            # Gmail implementation
├── ui/popup/
│   ├── popup.html          # Extension popup UI
│   ├── popup.css           # Styles
│   └── popup.js            # UI logic
└── background/
    └── service-worker.js   # Background script
```

## API Usage

The extension uses Gmail API v1:
- **Endpoint**: `https://gmail.googleapis.com/gmail/v1`
- **Scope**: `gmail.readonly` (read-only access)
- **Rate Limits**: 250 quota units per user per second
- **Quota**: 1 billion quota units per day (free tier)

Each message fetch costs 5 quota units, so scanning 50 emails = 250 units.
