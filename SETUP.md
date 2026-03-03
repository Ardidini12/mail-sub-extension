# Setup Instructions

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Chrome browser for testing

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend` directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and replace `<db_password>` with your actual MongoDB password:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database - MongoDB Atlas
DATABASE_URL=mongodb+srv://eduardiardidini12:YOUR_PASSWORD_HERE@ardi12.hvafy8n.mongodb.net/mail-sub-manager?retryWrites=true&w=majority&appName=Ardi12

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Stripe Configuration (for future payment integration)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
PAYMENT_AMOUNT=500

# CORS
FRONTEND_URL=chrome-extension://your-extension-id

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Start Backend Server
```bash
npm run dev
```

The server should start on `http://localhost:3000`. You should see:
```
MongoDB Connected: ardi12.hvafy8n.mongodb.net
Pinged your deployment. You successfully connected to MongoDB!
Server running on port 3000
```

## Extension Setup

### 1. Load Extension in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `mail-sub-extension` folder

### 2. Test the Extension
1. Click the extension icon in Chrome toolbar
2. You should see the login/register interface
3. Register a new account or login
4. Click "Scan Inbox" to scan your Gmail for subscriptions

## Features Implemented

### ✅ User Authentication
- User registration with email/password
- Login with JWT token authentication
- Logout functionality
- Persistent sessions using chrome.storage

### ✅ Subscription Management
- Scan Gmail inbox for subscriptions
- Display subscription list with sender info
- Unsubscribe links for each subscription
- Track unsubscribed items (removed from list when clicked)

### ✅ History & Statistics
- **Email Count Display**: Shows total number of emails scanned
- **Subscription Count**: Shows active subscriptions
- **Scan History**: Tracks each scan with timestamp
- **Persistent Storage**: All data saved to MongoDB

### ✅ Database Integration
- MongoDB Atlas connection
- User model with authentication
- Subscription model with unsubscribe tracking
- ScanHistory model for email count tracking

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Subscriptions
- `POST /api/subscriptions` - Save scanned subscriptions
- `GET /api/subscriptions` - Get user's active subscriptions
- `GET /api/subscriptions/history` - Get scan history with email counts
- `DELETE /api/subscriptions/:id` - Mark subscription as unsubscribed

### User
- `GET /api/user/profile` - Get user profile
- `GET /api/user/status` - Get user stats (scan count, subscription count)

## How It Works

### Scanning Flow
1. User clicks "Scan Inbox" button
2. Extension authenticates with Gmail API (OAuth2)
3. Searches for emails with "unsubscribe" keyword
4. Extracts sender info and unsubscribe links
5. Saves to local storage AND backend database (if logged in)
6. Displays results with email count: "Last scanned: 10:30 AM (50 emails scanned)"

### Unsubscribe Tracking
1. User clicks unsubscribe link on a subscription
2. Link opens in new tab for user to unsubscribe
3. Backend marks subscription as `isUnsubscribed: true`
4. Item fades out and removes from list
5. Subscription count updates automatically

### Email Count Display
- Shows in scan info: "Last scanned: 10:30 AM (50 emails scanned)"
- Stats bar displays total emails scanned across all scans
- Stored in ScanHistory model with each scan

## Troubleshooting

### Backend won't start
- Check MongoDB connection string in `.env`
- Ensure MongoDB Atlas IP whitelist includes your IP (or use 0.0.0.0/0 for development)
- Verify Node.js version: `node --version` (should be 18+)

### Extension not loading
- Check Chrome DevTools console for errors
- Verify manifest.json is valid
- Ensure all file paths are correct

### Authentication fails
- Check backend server is running on port 3000
- Verify CORS settings allow extension origin
- Check browser console for API errors

### Subscriptions not saving
- Ensure user is logged in
- Check backend logs for errors
- Verify MongoDB connection is active

## Next Steps

### Payment Integration (TODO)
- Integrate Stripe for $5 lifetime payment
- Implement free tier limit (5 subscriptions)
- Add payment verification middleware

### Additional Providers (TODO)
- Implement Outlook/Hotmail provider
- Implement Yahoo Mail provider
- Add provider selection in UI

### Cross-Browser Support (TODO)
- Test on Firefox
- Test on Edge
- Convert for Safari (if needed)
