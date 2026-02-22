# Chrome Web Store Listing Draft

> Copy the sections below into the Chrome Developer Dashboard.

---

## Extension Name

Smart Bookmarks

## Short Description (132 chars max)

AI-powered bookmark manager — auto-summary, semantic search, page snapshots, health check, deduplication, and smart classification.

---

## Detailed Description (English)

Smart Bookmarks turns your browser bookmarks into an organized, AI-powered knowledge base.

★ AI Summary — Save any page and get an instant summary, auto-generated tags, and smart category suggestions. Works with Claude, OpenAI, Gemini, Grok, or any OpenAI-compatible API.

★ Semantic Search — Find bookmarks by meaning, not just exact keywords. Search "frontend framework" and match React, Vue, Angular results.

★ Page Snapshots (3 Levels)
  • L1 Text — saves page text
  • L2 +Images — saves text + images
  • L3 Full — saves complete HTML
  View saved snapshots even after the original site goes offline.

★ Health Check — Automatically detects dead links. View the snapshot of any offline page with one click.

★ Smart Deduplication — Finds duplicates by exact URL, same domain, or similar content. Merge or delete in bulk.

★ Auto Classify — AI analyzes all your bookmarks and organizes them into folders automatically. Drag-and-drop to adjust before applying.

★ Tag Manager — Tags are auto-generated when you save a page. Rename, merge, or delete tags across all bookmarks at once.

★ Import & Export — Import from Chrome bookmark bar, Safari (HTML), or JSON. Export as JSON (full backup) or HTML (universal format).

★ Timeline View — Browse your bookmarks chronologically.

★ Keyboard Shortcuts — Ctrl+Shift+S to save, Ctrl+Shift+B to open manager, and many more.

★ Privacy First — All data stored locally on your device. Page content is only sent to the AI provider you choose and configure. No analytics, no tracking, no ads. Full privacy policy: https://github.com/nicekid1/AutoMark/blob/main/smart-bookmarks/PRIVACY.md

★ Multi-language — English, 中文, Tiếng Việt.

Two API modes:
• Official Proxy — Pay-as-you-go, no technical setup needed.
• Own API Key — Bring your own key for Claude, OpenAI, Gemini, Grok, or any custom endpoint.

---

## Detailed Description (中文)

Smart Bookmarks 将浏览器收藏夹打造成 AI 驱动的知识管理工具。

★ AI 摘要 — 保存任意网页，自动生成摘要、标签和分类建议。支持 Claude、OpenAI、Gemini、Grok 或任何兼容 OpenAI 的 API。

★ 语义搜索 — 按含义搜索，而非仅匹配关键字。搜索"前端框架"即可匹配 React、Vue、Angular 等结果。

★ 页面快照（3 个级别）
  • L1 文本 — 保存页面文字
  • L2 +图片 — 保存文字 + 图片
  • L3 完整 — 保存完整 HTML
  即使原始网站下线，也能查看已保存的快照。

★ 健康检查 — 自动检测失效链接。一键查看离线页面的快照。

★ 智能去重 — 按相同 URL、相同域名或相似内容查找重复项。批量合并或删除。

★ AI 自动分类 — AI 分析所有书签并自动创建文件夹。支持拖拽调整后再应用。

★ 标签管理 — 保存页面时自动生成标签。支持跨所有书签批量重命名、合并或删除标签。

★ 导入导出 — 支持从 Chrome 书签栏、Safari（HTML）或 JSON 导入。导出为 JSON（完整备份）或 HTML（通用格式）。

★ 时间线视图 — 按时间顺序浏览书签。

★ 键盘快捷键 — Ctrl+Shift+S 保存，Ctrl+Shift+B 打开管理界面，以及更多。

★ 隐私优先 — 所有数据存储在本地设备。页面内容仅发送至您选择和配置的 AI 供应商。无分析、无跟踪、无广告。完整隐私政策：https://github.com/nicekid1/AutoMark/blob/main/smart-bookmarks/PRIVACY.md

★ 多语言 — English、中文、Tiếng Việt。

两种 API 模式：
• 官方代理 — 按需付费，无需技术背景。
• 自有密钥 — 使用您自己的 Claude、OpenAI、Gemini、Grok 或自定义端点密钥。

---

## Category

Productivity

---

## Language

English, Chinese (Simplified), Vietnamese

---

## Permission Justifications

| Permission | Justification |
|---|---|
| `storage` | Store bookmarks, folders, tags, settings, and API keys locally on the user's device. |
| `contextMenus` | Add a "Save to Smart Bookmarks" item to the right-click context menu. |
| `alarms` | Schedule periodic health checks (HEAD requests) to detect dead bookmark links. |
| `tabs` | Read the current tab's URL and title when the user saves a bookmark; open bookmarked URLs. |
| `notifications` | Display a notification after a bookmark is saved or when a health check finds dead links. |
| `scripting` | Inject a content script to extract page content (text, images) for AI summarization and snapshots. |
| `<all_urls>` (host) | Fetch page content from any URL the user explicitly bookmarks; make health-check HEAD requests; connect to user-configured AI API endpoints. |
| `bookmarks` (optional) | Import bookmarks from the Chrome bookmark bar. Requested only when the user initiates import. |

---

## Privacy Policy URL

https://github.com/nicekid1/AutoMark/blob/main/smart-bookmarks/PRIVACY.md

---

## Single Purpose Description

Smart Bookmarks is an AI-powered bookmark manager. Every feature — saving, summarizing, searching, classifying, deduplicating, health-checking, snapshotting, importing, and exporting bookmarks — directly serves the single purpose of helping users organize and manage their bookmarks.
