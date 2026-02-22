# Chrome Web Store Submission Guide

## Quick Checklist

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Developer account ($5 one-time) | ✅ | https://chrome.google.com/webstore/devconsole |
| 2 | Extension ZIP (dist/ folder) | ✅ | `cd dist && zip -r ../scamlens.zip .` |
| 3 | Store icon (128x128 PNG) | ✅ | `icons/icon128.png` |
| 4 | Screenshots (1280x800 or 640x400) | ✅ | 5 images ready, min 1 / max 5 |
| 5 | Promotional tile (1400x560) | ⬜ | Optional, recommended for Featured listing |
| 6 | Short description (≤132 chars) | ✅ | See `store-assets/descriptions/en.md` |
| 7 | Detailed description (≤16000 chars) | ✅ | See `store-assets/descriptions/en.md` |
| 8 | Privacy policy URL | ✅ | `https://scamlens.org/privacy` |
| 9 | Category | ✅ | Productivity |
| 10 | Permission justifications | ✅ | See below |
| 11 | Data handling disclosure | ✅ | See below |
| 12 | Single purpose description | ✅ | "Bookmark management with AI-powered organization" |

---

## Build & Package

```bash
# Build production bundle
cd smart-bookmarks
npm run build

# Create ZIP for upload
cd dist
zip -r ../scamlens-v1.0.1.zip . -x "*.DS_Store" -x ".vite/*"
```

Upload `scamlens-v1.0.1.zip` on the Developer Dashboard.

---

## Permission Justifications

Paste these into the "Permission justification" fields on the Developer Dashboard.

### Required Permissions

**storage** — Stores bookmark data, user settings (theme, language, AI configuration), and cached domain lookup results locally on the user's device using chrome.storage.local. Essential for all core functionality.

**contextMenus** — Adds a "Save to ScamLens" option to the right-click context menu, allowing users to quickly save the current page as a bookmark without opening the popup.

**alarms** — Schedules periodic health checks for bookmarked URLs to verify they are still accessible. The interval is user-configurable (daily/weekly/monthly/never) in extension settings.

**tabs** — Required to read the current tab's URL and title when saving a bookmark, to send messages to content scripts for page content extraction, and to open extension pages (manager, options, auth) in new tabs.

**scripting** — Used as a fallback to inject content scripts into tabs where the declarative content script has not loaded yet (e.g., tabs opened before the extension was installed). Required for reliable page content extraction.

**activeTab** — Grants temporary access to the active tab when the user clicks the extension icon or uses a keyboard shortcut. Used to read the current page's URL and title for bookmark saving.

### Optional Permissions (requested at runtime)

**bookmarks** — Requested only when the user chooses to import from or export to Chrome's native bookmark system. Not needed for the extension's own bookmark storage.

**identity** — Enables Google OAuth sign-in via chrome.identity.launchWebAuthFlow(). Requested only when the user initiates Google sign-in for cloud backup and sync features.

**notifications** — Displays system notifications when health checks detect that a bookmarked URL is no longer accessible. Requested only when the user enables health check alerts.

### Host Permissions

**\<all_urls\>** — Required for three core features: (1) **Health checks** — makes HEAD requests to bookmarked URLs across any domain to verify accessibility; (2) **Page content extraction** — content script reads page text for AI summarization when the user saves a bookmark; (3) **Favicon fetching** — downloads website icons from arbitrary domains. Users bookmark pages across all domains, so a narrower host pattern would break core functionality.

---

## Data Handling Disclosure

Fill in the "Privacy practices" tab on the Developer Dashboard.

### Does your extension collect data?
**Yes**

### Data collected:

| Data Type | Collected? | Usage |
|---|---|---|
| Personally identifiable info | Yes (email for account) | Account management, cloud sync authentication |
| Authentication info | Yes (hashed passwords, OAuth tokens) | User authentication |
| Web history | No (only explicitly saved bookmarks) | — |
| User activity | No | — |
| Website content | Yes (page text for AI analysis) | Core functionality: AI summarization & tagging |
| Location | No | — |
| Financial info | No (payments handled by Stripe) | — |
| Health info | No | — |
| Personal communications | No | — |

### Certifications:
- [x] Data is NOT sold to third parties or used for purposes unrelated to the item's core functionality
- [x] Data is NOT used or transferred for determining creditworthiness or for lending purposes
- [x] Data transfer to third parties is limited to: AI API providers (user-configured) for content analysis

---

## Single Purpose Description

> ScamLens is a bookmark management extension that uses AI to help users organize, search, and protect their bookmarks with features like auto-summarization, dead link detection, page snapshots, and domain safety analysis.

---

## Store Listing Fields

### Name (max 75 chars)
```
ScamLens - Smart Bookmarks
```

### Short description (max 132 chars)
```
AI bookmark manager: auto-summarize, dead link detection, page snapshots, semantic search & scam protection. Free to use.
```

### Detailed description
→ See `store-assets/descriptions/en.md`

### Category
Productivity

### Language
English (default), Chinese, Vietnamese

### Privacy policy URL
```
https://scamlens.org/privacy
```

### Homepage URL
```
https://scamlens.org
```

### Support URL
```
https://scamlens.org
```
