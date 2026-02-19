# Chrome Web Store Submission Guide

## Permission Justifications

Use these texts in the Chrome Web Store Developer Dashboard "Permission justification" field.

### Required Permissions

**storage** — Stores bookmark data, user settings (theme, language, AI configuration), and cached domain lookup results locally on the user's device using chrome.storage.local. Essential for all core functionality.

**contextMenus** — Adds a "Save to Smart Bookmarks" option to the right-click context menu, allowing users to quickly save the current page as a bookmark without opening the popup.

**alarms** — Schedules periodic health checks for bookmarked URLs to verify they are still accessible. The interval is user-configurable (daily/weekly/monthly/never) in extension settings.

**tabs** — Required to read the current tab's URL and title when saving a bookmark, to send messages to content scripts for page content extraction, and to open extension pages (manager, options, auth) in new tabs.

**notifications** — Displays system notifications when a bookmark is saved successfully or when health checks detect that a bookmarked URL is no longer accessible.

**scripting** — Used as a fallback to inject content scripts into tabs where the declarative content script has not loaded yet (e.g., tabs opened before the extension was installed). Required for reliable page content extraction.

**identity** — Enables Google OAuth sign-in via chrome.identity.launchWebAuthFlow(). Users can optionally create an account to access cloud backup, semantic search, and subscription features.

### Host Permissions

**\<all_urls\>** — Required for three features: (1) Health checks — the extension makes HEAD requests to bookmarked URLs across any domain to verify accessibility. (2) Page content extraction — the content script reads page text for AI summarization when the user saves a bookmark. (3) Favicon fetching — downloads website icons from arbitrary domains. Users bookmark pages across all domains, so a narrower pattern would break core functionality.

### Optional Permissions

**bookmarks** — Requested at runtime only when the user chooses to import from or export to Chrome's native bookmark system. Not needed for the extension's own bookmark storage.

---

## Store Listing

### Name (max 75 chars)
Smart Bookmarks — AI Bookmark Manager

### Short Description (max 132 chars)
AI-powered bookmark manager with smart summaries, tags, health checks, and semantic search. Your new tab, reimagined.

### Detailed Description
Smart Bookmarks transforms how you organize and find your bookmarks using AI.

**Key Features:**
• AI Summarization — Automatically generates concise summaries for every saved page
• Smart Tags — AI analyzes content and suggests relevant tags
• Semantic Search — Find bookmarks by meaning, not just keywords
• Health Checks — Monitors bookmarked URLs and alerts you when pages go offline
• Page Snapshots — Capture full-page screenshots and content for offline reference
• Cloud Backup — Encrypted backups keep your bookmarks safe across devices
• New Tab Dashboard — Beautiful bookmark manager replaces your new tab page
• Duplicate Detection — Find and merge duplicate bookmarks intelligently
• Multi-language — English, 中文, Tiếng Việt

**Privacy First:**
All bookmark data is stored locally on your device. AI features work through your own API keys or our optional proxy service. No tracking, no ads.

**Flexible AI:**
Use our proxy service with included free tokens, or bring your own API key from Anthropic Claude, OpenAI, Google Gemini, Grok, or any OpenAI-compatible provider.

### Category
Productivity

---

## Data Handling Disclosure

### Data collected:

| Data Type | Collected? | Purpose |
|---|---|---|
| Personally identifiable info | YES (email for account) | Account management |
| Authentication info | YES (hashed passwords, OAuth tokens) | User authentication |
| Web history | NO (only explicitly saved bookmarks) | — |
| User activity | NO | — |
| Website content | YES (page text for AI analysis) | Core functionality (summarization) |
| Location | NO | — |
| Financial info | NO (payments via Stripe, not stored) | — |
| Health info | NO | — |
| Personal communications | NO | — |

### Certifications:
- Data is NOT sold to third parties
- Data is NOT used for advertising
- Data is NOT used for creditworthiness or lending purposes
- Data transfer to third parties is limited to: AI API providers (user-configured) for content analysis
