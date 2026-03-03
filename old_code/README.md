# Legacy Code Archive

## Purpose
This directory contains the original Chrome-only extension code that was developed before the architectural refactor. It is preserved for reference and migration purposes.

## Contents
- **background.js**: Original service worker with basic logging
- **utils.js**: Gmail API scanner implementation (OAuth2 + subscription detection)
- **sidepanel.html/js**: Original popup UI for displaying subscriptions
- **manifest.json**: Chrome Manifest V3 configuration with Gmail OAuth2
- **hello.html**: Test file (unused)
- **hello_extensions.png**: Original extension icon

## Status
- **Last Maintained**: March 2026
- **Not for Production Use**: This code is deprecated and should not be used in new features
- **Migration Status**: Core Gmail scanning logic to be migrated to `/src/providers/gmail.js`

## Known Limitations
- Chrome-only (not cross-platform)
- No user authentication system
- No payment integration
- Missing unsubscribe link display in UI
- Limited to Gmail only

## Active Development
All new development happens in the `/src` and `/backend` directories following the new modular architecture. See `/STRUCTURE.md` for the current project structure.