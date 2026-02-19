# Changelog

## v1.0.0 — 2025-02-05

Initial public release.

### Features
- AI-powered bookmark summarization (Claude, OpenAI, Gemini, Grok, custom API)
- Semantic search across bookmarks
- Page snapshots at 3 levels (text / images / full HTML)
- Health check — automatic dead link detection
- Smart deduplication (same URL, same domain, similar content)
- AI auto-classify into folders
- Tag manager with merge, rename, and bulk operations
- Timeline view
- Import from Chrome bookmarks, Safari HTML, JSON files
- Export as JSON (full backup) or HTML (universal format)
- Batch select, move, delete, and tag operations
- Keyboard shortcuts (Ctrl+Shift+S to save, Ctrl+Shift+B to open manager)
- Multi-language support (English, 中文, Tiếng Việt)
- Dark / light / system theme
- Two API modes: Official Proxy (pay-as-you-go) and Own API Key
- Site intelligence panel with trust analysis
- Privacy-first: all data stored locally, no analytics, no tracking

### Security
- URL scheme whitelisting (http/https only)
- API base URL protocol validation
- Message sender origin verification
- Sandboxed snapshot viewer (iframe sandbox="")
- No eval, no remote code execution, no CDN scripts

### Compliance
- Chrome Manifest V3
- Chrome Web Store user data policy (Clear All Data in Settings)
- Bilingual privacy policy (PRIVACY.md)
