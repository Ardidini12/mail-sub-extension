# Architecture Documentation

## Overview
This document describes the architectural decisions and structure of the Mail Subscription Manager extension.

## Design Principles

### 1. Separation of Concerns
- **Frontend (Extension)**: UI and user interactions
- **Backend (API)**: Business logic, authentication, payments
- **Providers**: Email service integrations

### 2. Provider Pattern
Each email provider (Gmail, Outlook, Yahoo) implements the same interface:
```javascript
interface EmailProvider {
  authenticate(): Promise<token>
  searchEmails(query): Promise<emails[]>
  getEmailDetails(emailId): Promise<emailData>
  extractUnsubscribeLink(email): string|null
}
```

### 3. Modular Structure
Each module is self-contained with:
- Clear responsibilities
- `.windsurf` context file
- Minimal dependencies on other modules

## Data Flow

### Subscription Scanning Flow
1. User clicks "Scan" in popup
2. UI calls `scanner.js` in core
3. Scanner determines email provider
4. Provider-specific adapter fetches emails
5. Parser extracts subscription data
6. Results sent to UI for display
7. Data synced to backend (if authenticated)

### Payment Flow
1. User scans inbox, sees >5 subscriptions
2. Paywall modal appears
3. User clicks "Pay $5"
4. Frontend calls backend `/api/payment/create-checkout`
5. Backend creates Stripe checkout session
6. User redirected to Stripe
7. After payment, Stripe webhook notifies backend
8. Backend updates user's `hasPaid` status
9. Extension unlocks unlimited scans

### Authentication Flow
1. User opens extension
2. Extension checks for stored JWT token
3. If no token, show login/register UI
4. User enters credentials
5. Backend validates and returns JWT
6. Token stored in chrome.storage
7. Token included in all API requests

## Technology Stack

### Frontend
- **Language**: Vanilla JavaScript (ES6+)
- **APIs**: WebExtension APIs, Chrome Storage API
- **Build**: None (native browser support)

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose) or PostgreSQL (Sequelize)
- **Authentication**: JWT (jsonwebtoken)
- **Payment**: Stripe
- **Security**: Helmet, CORS, Rate Limiting

### Infrastructure
- **Hosting**: Backend on Heroku/Railway/Render
- **Database**: MongoDB Atlas or PostgreSQL on Railway
- **CDN**: Extension distributed via browser stores

## Security Considerations

### Frontend
- No sensitive data in localStorage
- OAuth2 for email provider authentication
- JWT tokens in chrome.storage (encrypted)
- Content Security Policy in manifest

### Backend
- Bcrypt password hashing (10 rounds)
- JWT with strong secret and expiration
- Rate limiting on auth endpoints
- HTTPS only in production
- Input validation on all endpoints
- Stripe webhook signature verification

## Scalability

### Current Limitations
- Single backend server
- No caching layer
- Synchronous email scanning

### Future Improvements
- Redis caching for user sessions
- Queue system for background scans (Bull/BullMQ)
- Horizontal scaling with load balancer
- CDN for static assets
- Database read replicas

## Cross-Platform Support

### Browser Compatibility
- Chrome: Full support (Manifest V3)
- Firefox: WebExtension API compatibility
- Edge: Chromium-based, same as Chrome
- Safari: Requires Safari Web Extension conversion

### Email Provider Support
- **Phase 1**: Gmail (OAuth2)
- **Phase 2**: Outlook/Hotmail (Microsoft Graph API)
- **Phase 3**: Yahoo Mail (Yahoo Mail API)
- **Future**: IMAP/POP3 for generic providers

## Module Dependencies

```
Root
├── src/
│   ├── core/ (no dependencies)
│   ├── providers/ (depends on core)
│   ├── ui/ (depends on core, api)
│   ├── background/ (depends on core)
│   └── api/ (no dependencies)
└── backend/
    ├── routes/ (depends on models, middleware)
    ├── models/ (no dependencies)
    ├── middleware/ (depends on models)
    ├── config/ (no dependencies)
    └── utils/ (no dependencies)
```

## Testing Strategy

### Frontend Testing
- Unit tests for core logic (Jest)
- Integration tests for providers
- E2E tests for UI flows (Playwright)

### Backend Testing
- Unit tests for utilities (Jest)
- Integration tests for API routes (Supertest)
- Database tests with test DB

## Deployment

### Extension Deployment
1. Build extension (if using bundler)
2. Test in all target browsers
3. Submit to Chrome Web Store
4. Submit to Firefox Add-ons
5. Submit to Edge Add-ons

### Backend Deployment
1. Set environment variables
2. Run database migrations
3. Deploy to hosting platform
4. Configure Stripe webhooks
5. Set up monitoring and logging

## Monitoring

### Metrics to Track
- Active users
- Scan success rate
- Payment conversion rate
- API response times
- Error rates
- Provider API failures

### Logging
- Winston for structured logging
- Log levels: error, warn, info, debug
- Separate logs for payments and auth
