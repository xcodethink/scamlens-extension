# Smart Bookmarks Proxy Server

这是一个简单的代理服务器示例，用于处理用户认证和 Claude API 调用。

## 架构说明

```
用户浏览器 (Chrome Extension)
    ↓
代理服务器 (你的服务器)
    ↓
Claude API (Anthropic)
```

## 为什么需要代理服务器？

1. **API Key 安全** - 用户无需获取 Claude API Key
2. **计费管理** - 你可以对用户收费，自己向 Anthropic 付费
3. **使用限制** - 可以控制用户的调用频率和额度
4. **统计分析** - 可以收集使用数据

## 快速部署

### 方案 1: Cloudflare Workers (推荐)

参考 `cloudflare-worker.js` 文件，可以免费部署到 Cloudflare Workers。

### 方案 2: Node.js 服务器

参考 `express-server.js` 文件，可以部署到任何 Node.js 环境。

### 方案 3: Serverless (Vercel/AWS Lambda)

参考 `vercel-api.js` 文件。

## API 接口规范

### 1. POST /v1/summarize

AI 摘要接口

**Request:**
```json
{
  "content": "网页内容",
  "title": "网页标题",
  "model": "claude-3-haiku-20240307"
}
```

**Headers:**
```
Authorization: Bearer <user_token>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "AI 生成的摘要",
    "tags": ["标签1", "标签2"],
    "category": "分类"
  },
  "balance": 99  // 剩余 token 数
}
```

### 2. GET /v1/balance

查询余额

**Response:**
```json
{
  "balance": 100
}
```

### 3. POST /v1/recharge

充值接口 (对接支付系统)

## 用户认证

示例使用简单的 JWT Token 认证，生产环境建议：

1. 对接微信/支付宝登录
2. 使用更完善的 JWT 验证
3. 添加 rate limiting

## 数据库设计

```sql
-- 用户表
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  balance INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 使用记录表
CREATE TABLE usage_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  model VARCHAR(50),
  tokens_used INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 充值记录表
CREATE TABLE recharge_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  amount INT,
  order_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 定价建议

| 模型 | Anthropic 成本 | 建议售价 | 毛利 |
|------|---------------|----------|------|
| Haiku | ~$0.0005/次 | 1 token (~$0.01) | 95% |
| Sonnet | ~$0.003/次 | 5 tokens (~$0.05) | 94% |
| Opus | ~$0.015/次 | 15 tokens (~$0.15) | 90% |

Token 建议定价: 1 token = $0.01 (或 ¥0.1)

## 注意事项

1. **保护 API Key** - Claude API Key 只存在服务器端
2. **错误处理** - 对用户友好的错误信息
3. **日志记录** - 记录所有 API 调用便于排查问题
4. **安全加固** - HTTPS、CORS、Rate Limiting
