# Mail Subscription Manager

Cross-platform browser extension for managing email subscriptions across Gmail, Outlook, Yahoo, and more.

## Features

- 🔍 **One-Click Scan**: Scan your entire inbox for subscriptions
- 🔗 **Unsubscribe Links**: Get direct unsubscribe links for all subscriptions
- 💰 **Affordable**: $5 lifetime access (first 5 subscriptions free)
- 🌐 **Cross-Platform**: Works with Gmail, Outlook, Yahoo, and more
- 🔒 **Secure**: OAuth2 authentication, no password storage

## Project Structure

```
mail-sub-extension/
├── src/                    # Frontend extension code
│   ├── core/              # Business logic
│   ├── providers/         # Email provider adapters
│   ├── ui/                # User interface
│   ├── background/        # Service worker
│   └── api/               # Backend API client
├── backend/               # Node.js backend server
│   ├── routes/            # API endpoints
│   ├── models/            # Database models
│   ├── middleware/        # Auth & validation
│   ├── config/            # Configuration
│   └── utils/             # Helper functions
├── assets/                # Icons and images
└── old/                   # Legacy code (archived)
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB or PostgreSQL
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mail-sub-extension
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   ```

3. **Configure environment**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start backend server**
   ```bash
   cd backend
   npm run dev
   ```

5. **Load extension in browser**
   - Chrome: Go to `chrome://extensions/`, enable Developer Mode, click "Load unpacked", select project folder
   - Firefox: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on"

## Development

### Extension Development
- Frontend code is in `/src`
- Each module has a `.windsurf` file explaining its purpose
- Follow the provider pattern for adding new email services

### Backend Development
- API server in `/backend`
- Uses Express.js with MongoDB/PostgreSQL
- Stripe integration for payments
- JWT authentication

### Adding a New Email Provider

1. Create new file in `/src/providers/`
2. Implement the provider interface
3. Register provider in `/src/core/scanner.js`
4. Update manifest.json with required permissions

## Architecture

The project follows a modular architecture with clear separation of concerns:

- **Frontend**: Browser extension with provider-agnostic core
- **Backend**: REST API for user management and payments
- **Database**: User accounts, payment status, subscription data
- **Payment**: Stripe integration for one-time $5 payment

## Windsurf Context Files

Each folder contains a `.windsurf` file that:
- Describes the module's purpose
- Lists responsibilities
- References parent/child modules
- Defines coding rules

This helps maintain context and consistency across the codebase.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
