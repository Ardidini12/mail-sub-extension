# Project Structure Overview

## Complete Folder Tree

```
mail-sub-extension/
├── .windsurf                    # Root context: goals, memory, progress
├── .gitignore                   # Git ignore rules
├── package.json                 # Root package configuration
├── README.md                    # Project documentation
├── ARCHITECTURE.md              # Architecture decisions
├── STRUCTURE.md                 # This file
│
├── src/                         # Frontend Extension Code
│   ├── .windsurf               # Frontend module context
│   │
│   ├── core/                   # Business Logic (Platform-agnostic)
│   │   └── .windsurf          # Core module context
│   │   ├── scanner.js         # [TODO] Email scanning orchestrator
│   │   ├── auth.js            # [TODO] Authentication manager
│   │   ├── storage.js         # [TODO] Local storage wrapper
│   │   └── subscription.js    # [TODO] Subscription data models
│   │
│   ├── providers/              # Email Provider Adapters
│   │   └── .windsurf          # Providers module context
│   │   ├── base-provider.js   # [TODO] Abstract provider interface
│   │   ├── gmail.js           # [TODO] Gmail implementation
│   │   ├── outlook.js         # [TODO] Outlook implementation
│   │   └── yahoo.js           # [TODO] Yahoo implementation
│   │
│   ├── ui/                     # User Interface
│   │   ├── .windsurf          # UI module context
│   │   │
│   │   ├── popup/             # Main Popup Window
│   │   │   └── .windsurf     # Popup context
│   │   │   ├── popup.html    # [TODO] Popup HTML
│   │   │   ├── popup.js      # [TODO] Popup logic
│   │   │   └── popup.css     # [TODO] Popup styles
│   │   │
│   │   ├── components/        # Reusable Components
│   │   │   └── .windsurf     # Components context
│   │   │   ├── SubscriptionCard.js  # [TODO] Subscription display
│   │   │   ├── Button.js            # [TODO] Button component
│   │   │   ├── Loader.js            # [TODO] Loading spinner
│   │   │   ├── ErrorMessage.js      # [TODO] Error display
│   │   │   └── PaymentModal.js      # [TODO] Payment modal
│   │   │
│   │   └── styles/            # Shared Styles
│   │       └── .windsurf     # Styles context
│   │       ├── global.css    # [TODO] Global styles
│   │       ├── variables.css # [TODO] CSS variables
│   │       └── utilities.css # [TODO] Utility classes
│   │
│   ├── background/             # Service Worker
│   │   └── .windsurf          # Background context
│   │   └── service-worker.js  # [TODO] Background script
│   │
│   └── api/                    # Backend API Client
│       └── .windsurf          # API client context
│       ├── client.js          # [TODO] Base API client
│       ├── user.js            # [TODO] User operations
│       ├── payment.js         # [TODO] Payment operations
│       └── subscription.js    # [TODO] Subscription sync
│
├── backend/                    # Backend Server
│   ├── .windsurf              # Backend module context
│   ├── .env.example           # Environment variables template
│   ├── package.json           # Backend dependencies
│   ├── server.js              # [TODO] Main server file
│   │
│   ├── routes/                # API Routes
│   │   └── .windsurf         # Routes context
│   │   ├── auth.js           # [TODO] Auth endpoints
│   │   ├── user.js           # [TODO] User endpoints
│   │   ├── payment.js        # [TODO] Payment endpoints
│   │   └── subscription.js   # [TODO] Subscription endpoints
│   │
│   ├── models/                # Database Models
│   │   └── .windsurf         # Models context
│   │   ├── User.js           # [TODO] User model
│   │   ├── Payment.js        # [TODO] Payment model
│   │   └── Subscription.js   # [TODO] Subscription model
│   │
│   ├── middleware/            # Express Middleware
│   │   └── .windsurf         # Middleware context
│   │   ├── auth.js           # [TODO] JWT authentication
│   │   ├── validate.js       # [TODO] Input validation
│   │   ├── errorHandler.js   # [TODO] Error handling
│   │   └── rateLimiter.js    # [TODO] Rate limiting
│   │
│   ├── config/                # Configuration
│   │   └── .windsurf         # Config context
│   │   ├── database.js       # [TODO] DB connection
│   │   ├── stripe.js         # [TODO] Stripe config
│   │   └── jwt.js            # [TODO] JWT config
│   │
│   └── utils/                 # Utilities
│       └── .windsurf         # Utils context
│       ├── logger.js         # [TODO] Logging utility
│       ├── emailValidator.js # [TODO] Email validation
│       ├── tokenGenerator.js # [TODO] Token generation
│       └── errorFormatter.js # [TODO] Error formatting
│
├── assets/                     # Static Assets
│   └── .windsurf              # Assets context
│   └── icons/                 # Extension Icons
│       ├── icon16.png        # [TODO] 16x16 icon
│       ├── icon32.png        # [TODO] 32x32 icon
│       ├── icon48.png        # [TODO] 48x48 icon
│       └── icon128.png       # [TODO] 128x128 icon
│
└── old/                        # Legacy Code (DO NOT MODIFY)
    ├── background.js          # Old background script
    ├── hello.html             # Old test file
    ├── hello_extensions.png   # Old icon
    ├── manifest.json          # Old manifest
    ├── popup.js               # Old popup (empty)
    ├── README.md              # Old readme
    ├── sidepanel.html         # Old UI
    ├── sidepanel.js           # Old UI logic
    └── utils.js               # Old Gmail scanner
```

## Windsurf Context System

Every module has a `.windsurf` file that contains:
- **Purpose**: What this module does
- **Contains**: Files and components in this module
- **Responsibilities**: What this module is responsible for
- **References**: Parent and child modules
- **Rules**: Coding standards and guidelines

### Context Hierarchy

```
Root (.windsurf)
├── src/ (.windsurf)
│   ├── core/ (.windsurf)
│   ├── providers/ (.windsurf)
│   ├── ui/ (.windsurf)
│   │   ├── popup/ (.windsurf)
│   │   ├── components/ (.windsurf)
│   │   └── styles/ (.windsurf)
│   ├── background/ (.windsurf)
│   └── api/ (.windsurf)
├── backend/ (.windsurf)
│   ├── routes/ (.windsurf)
│   ├── models/ (.windsurf)
│   ├── middleware/ (.windsurf)
│   ├── config/ (.windsurf)
│   └── utils/ (.windsurf)
└── assets/ (.windsurf)
```

## Development Workflow

1. **Check Memory**: Read `/.windsurf` for project context
2. **Find Module**: Navigate to relevant module's `.windsurf` file
3. **Understand Context**: Read module's purpose and responsibilities
4. **Implement**: Write code following module rules
5. **Update Progress**: Check off completed items in `/.windsurf`

## Next Steps

All folders and context files are created. Ready to implement:

1. **Phase 1**: Core functionality
   - Implement scanner and provider pattern
   - Create Gmail provider
   - Build basic UI

2. **Phase 2**: Backend
   - Set up Express server
   - Implement authentication
   - Create database models

3. **Phase 3**: Payment
   - Integrate Stripe
   - Implement free tier logic
   - Add payment UI

4. **Phase 4**: Cross-platform
   - Add Outlook provider
   - Add Yahoo provider
   - Test on multiple browsers

## File Status Legend

- `[TODO]` - File needs to be created
- No marker - File exists
