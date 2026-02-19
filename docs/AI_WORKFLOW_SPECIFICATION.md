# Smart Bookmarks AI 工作流规范

## 概述

本文档定义了 Smart Bookmarks 扩展中所有 AI 辅助功能的工作逻辑和要求。

---

## 1. 内容提取流程

### 1.1 页面内容提取

**触发时机**: 用户保存书签时

**提取步骤**:
1. 克隆 DOM 文档（避免修改原页面）
2. 移除无关元素（广告、导航、侧边栏等）
3. 识别主内容区域
4. 提取并清理文本

**移除的元素选择器**:
```javascript
['script', 'style', 'noscript', 'iframe', 'nav', 'header', 'footer', 'aside',
 '.sidebar', '.advertisement', '.ads', '.ad', '#comments', '.comments',
 '.social-share', '.related-posts']
```

**主内容识别优先级**:
```javascript
['article', '[role="main"]', 'main', '.post-content', '.entry-content',
 '.article-content', '.content', '#content', '.post', '.article']
```

### 1.2 提取的数据结构

| 字段 | 类型 | 说明 |
|------|------|------|
| title | string | 页面标题，优先取 `<title>`，回退到 `<h1>` |
| textContent | string | 清理后的纯文本内容 |
| content | string | 保留格式的 HTML 内容（L3快照用） |
| images | string[] | 最多5张主图URL |
| canonicalUrl | string? | 规范化URL（如果存在） |
| favicon | string | 网站图标URL |

---

## 2. AI 摘要生成

### 2.1 调用条件

```
用户保存书签
    ↓
检查 AI 服务是否已配置
    ├── 代理模式: 检查 userToken 是否存在
    └── 自有API模式: 检查 apiKey 是否存在
    ↓
已配置 → 调用 AI 生成摘要
未配置 → 使用降级策略
```

### 2.2 AI 分析提示词 (Prompt)

```
Analyze the following webpage content and return a JSON object with these fields:
- "summary": A concise summary in 100-200 words (use the same language as the content)
- "tags": An array of 3-5 relevant tags/keywords
- "category": A suggested category for this content

Title: {title}

Content:
{truncatedContent}

Return ONLY a valid JSON object, no additional text:
```

### 2.3 摘要生成要求

| 要求 | 规范 |
|------|------|
| **字数** | 100-200 字（中文）/ 100-200 words（英文） |
| **语言** | 自动匹配内容语言（中文内容用中文摘要） |
| **风格** | 简洁客观，突出核心信息 |
| **结构** | 一段话，无分点列表 |
| **内容截断** | 输入内容超过4000字符时截断 |

### 2.4 降级策略

当 AI 服务不可用时:
```javascript
{
  summary: `${title} - Content saved for later reading.`,
  tags: ['uncategorized'],
  category: 'Uncategorized'
}
```

---

## 3. 标签生成

### 3.1 标签要求

| 要求 | 规范 |
|------|------|
| **数量** | 3-5 个标签 |
| **长度** | 每个标签 2-20 字符 |
| **格式** | 小写，无特殊字符 |
| **语言** | 匹配内容语言 |
| **类型** | 关键词、主题、技术栈、领域等 |

### 3.2 标签生成策略

**优先级**:
1. 核心主题词（如 "react", "机器学习"）
2. 内容类型（如 "tutorial", "documentation", "news"）
3. 领域标识（如 "frontend", "ai", "design"）
4. 技术栈/工具（如 "typescript", "docker"）
5. 特征词（如 "best-practices", "beginner"）

### 3.3 标签示例

**技术文章**:
```json
["react", "hooks", "state-management", "frontend", "tutorial"]
```

**新闻文章**:
```json
["ai", "openai", "technology", "news", "2024"]
```

**设计资源**:
```json
["ui-design", "figma", "components", "design-system"]
```

---

## 4. 分类生成

### 4.1 分类要求

| 要求 | 规范 |
|------|------|
| **格式** | 首字母大写的单词或短语 |
| **用途** | 建议的文件夹分类 |
| **范围** | 通用分类，非过于具体 |

### 4.2 推荐分类列表

```
Technology      技术
Programming     编程
Design          设计
Business        商业
News            新闻
Education       教育
Entertainment   娱乐
Reference       参考资料
Tools           工具
Research        研究
Personal        个人
Shopping        购物
Social          社交
Finance         金融
Health          健康
Travel          旅行
Food            美食
Sports          体育
Uncategorized   未分类
```

---

## 5. 内容相似度检测

### 5.1 算法说明

**组合相似度** = Jaccard × 0.3 + Cosine × 0.7

**Jaccard 相似度**:
```
intersection(tokens_A, tokens_B) / union(tokens_A, tokens_B)
```

**Cosine 相似度**:
```
dot_product(freq_A, freq_B) / (magnitude_A × magnitude_B)
```

### 5.2 判定阈值

| 相似度 | 判定 |
|--------|------|
| ≥ 85% | 高度相似，标记为重复 |
| 70-84% | 部分相似，提示用户 |
| < 70% | 不相似，独立内容 |

### 5.3 重复检测类型

1. **完全重复**: URL规范化后相同
2. **内容重复**: 相似度 ≥ 85%
3. **同域名**: 同一网站的多个页面（仅分组显示）

---

## 6. 网站信任度评估

### 6.1 评分规则

| 因素 | 分值变化 |
|------|----------|
| 基础分 | +50 |
| HTTPS 加密 | +15 |
| 可信域名（Google, GitHub等） | +25 |
| 可信顶级域名（.com, .org, .edu, .gov） | +5 |
| 可疑顶级域名（.xyz, .top, .club） | -15 |
| 内容充实（>500字符） | +5 |
| 自定义 favicon | +5 |

### 6.2 信任等级

| 分数 | 等级 | 显示 |
|------|------|------|
| 70-100 | 安全 | 绿色 ✓ |
| 40-69 | 谨慎 | 黄色 ⚠ |
| 0-39 | 危险 | 红色 ✕ |

---

## 7. 语义搜索扩展

### 7.1 语义映射表

```javascript
{
  'frontend framework': ['react', 'vue', 'angular', 'svelte', 'hooks', 'component'],
  'artificial intelligence': ['ai', 'gpt', 'llm', 'deep learning', 'neural', 'ml'],
  'machine learning': ['ai', 'deep learning', 'neural', 'ml', 'tensorflow', 'pytorch'],
  '前端框架': ['react', 'vue', 'angular', '组件', '状态管理'],
  '人工智能': ['ai', 'gpt', '大模型', '深度学习', '神经网络', '机器学习'],
}
```

### 7.2 搜索扩展逻辑

```
用户搜索 "react"
    ↓
匹配语义组 "frontend framework"
    ↓
扩展搜索词: ["react", "vue", "angular", "svelte", "hooks", "component"]
    ↓
返回所有匹配结果（标记相关性）
```

---

## 8. API 调用规范

### 8.1 模型选择

| 模型 | 代理消耗 | 适用场景 |
|------|----------|----------|
| claude-3-haiku | ~1 token | 日常使用，快速响应 |
| claude-3-sonnet | ~5 tokens | 复杂内容，更好理解 |
| claude-3-opus | ~15 tokens | 最高质量，专业内容 |

### 8.2 请求限制

| 限制项 | 数值 |
|--------|------|
| 内容截断长度 | 4000 字符 |
| 最大响应 tokens | 1024 |
| 请求超时 | 30 秒 |
| 重试次数 | 1 次 |

### 8.3 错误代码

| 代码 | 含义 | 处理方式 |
|------|------|----------|
| AUTH_TOKEN_REQUIRED | 未配置代理令牌 | 提示用户配置 |
| INSUFFICIENT_BALANCE | 余额不足 | 提示用户充值 |
| AUTH_EXPIRED | 令牌过期 | 提示重新登录 |
| API_KEY_REQUIRED | 未配置API密钥 | 提示用户配置 |

---

## 9. 数据存储规范

### 9.1 书签数据结构

```typescript
interface Bookmark {
  id: string;
  url: string;
  normalizedUrl: string;      // URL规范化，用于去重
  canonicalUrl?: string;
  domain: string;
  title: string;
  favicon: string;
  summary: string;            // AI生成的摘要
  tags: string[];             // AI生成的标签
  content: {
    text: string;             // 纯文本内容
    images?: string[];        // 图片URL列表
    html?: string;            // HTML内容（L3）
  };
  snapshot: {
    level: 'L1' | 'L2' | 'L3';
    size: string;
    createdAt: string;
  };
  status: 'healthy' | 'dead' | 'checking';
  folderId: string;           // 基于category分配
  createdAt: string;
  refreshedAt: string;
  lastVisitedAt?: string;
  lastCheckedAt?: string;
}
```

### 9.2 索引字段

```
id, url, normalizedUrl, domain, folderId, status, createdAt, refreshedAt, *tags
```

---

## 10. 未来扩展计划

### 10.1 计划中的 AI 功能

- [ ] **智能文件夹推荐**: 基于历史分类习惯推荐文件夹
- [ ] **批量标签优化**: 分析所有书签，统一标签命名
- [ ] **阅读时间估算**: 基于内容长度和复杂度估算
- [ ] **关联书签推荐**: 基于内容相似度推荐相关书签
- [ ] **摘要个性化**: 支持用户自定义摘要风格/长度

### 10.2 性能优化计划

- [ ] 本地 AI 模型支持（离线摘要）
- [ ] 增量内容分析（仅分析变更部分）
- [ ] 批量 AI 请求合并

---

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0 | 2024-02 | 初始规范 |
