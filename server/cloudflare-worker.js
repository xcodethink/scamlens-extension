/**
 * Smart Bookmarks Proxy - Cloudflare Worker 示例
 *
 * 部署步骤:
 * 1. 在 Cloudflare Dashboard 创建 Worker
 * 2. 添加环境变量: CLAUDE_API_KEY
 * 3. 绑定 KV namespace: USERS (用于存储用户数据)
 * 4. 复制此代码到 Worker
 *
 * 注意: 这是一个简化示例，生产环境需要更完善的用户认证和数据库
 */

// 配置
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Token 消耗配置
const TOKEN_COST = {
  'claude-3-haiku-20240307': 1,
  'claude-3-5-sonnet-20241022': 5,
  'claude-3-opus-20240229': 15,
};

export default {
  async fetch(request, env) {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // 路由
      if (path === '/v1/summarize' && request.method === 'POST') {
        return await handleSummarize(request, env);
      }

      if (path === '/v1/balance' && request.method === 'GET') {
        return await handleBalance(request, env);
      }

      if (path === '/v1/register' && request.method === 'POST') {
        return await handleRegister(request, env);
      }

      return jsonResponse({ error: 'Not Found' }, 404);
    } catch (error) {
      console.error('Error:', error);
      return jsonResponse({ error: error.message }, 500);
    }
  },
};

// 验证用户 Token
async function verifyUser(request, env) {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    throw new Error('未授权访问');
  }

  const token = auth.slice(7);

  // 从 KV 获取用户信息
  const userData = await env.USERS.get(token, { type: 'json' });
  if (!userData) {
    throw new Error('无效的用户令牌');
  }

  return { token, ...userData };
}

// 处理摘要请求
async function handleSummarize(request, env) {
  const user = await verifyUser(request, env);
  const { content, title, model = 'claude-3-haiku-20240307' } = await request.json();

  // 检查余额
  const cost = TOKEN_COST[model] || 1;
  if (user.balance < cost) {
    return jsonResponse({
      success: false,
      error: '余额不足，请充值后继续使用'
    }, 402);
  }

  // 截断内容
  const truncatedContent = content.length > 4000
    ? content.substring(0, 4000) + '...'
    : content;

  // 调用 Claude API
  const claudeResponse = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Analyze the following webpage content and return a JSON object with these fields:
- "summary": A concise summary in 100-200 words (use the same language as the content)
- "tags": An array of 3-5 relevant tags/keywords
- "category": A suggested category for this content

Title: ${title}

Content:
${truncatedContent}

Return ONLY a valid JSON object, no additional text:`,
      }],
    }),
  });

  if (!claudeResponse.ok) {
    const error = await claudeResponse.text();
    console.error('Claude API error:', error);
    throw new Error('AI 服务暂时不可用');
  }

  const claudeData = await claudeResponse.json();
  const textContent = claudeData.content?.find(c => c.type === 'text');

  if (!textContent) {
    throw new Error('AI 返回格式错误');
  }

  // 解析 JSON
  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('无法解析 AI 返回结果');
  }

  const result = JSON.parse(jsonMatch[0]);

  // 扣除 Token
  const newBalance = user.balance - cost;
  await env.USERS.put(user.token, JSON.stringify({
    ...user,
    balance: newBalance,
  }));

  return jsonResponse({
    success: true,
    data: {
      summary: result.summary,
      tags: result.tags?.slice(0, 5) || [],
      category: result.category || 'Uncategorized',
    },
    balance: newBalance,
  });
}

// 查询余额
async function handleBalance(request, env) {
  const user = await verifyUser(request, env);
  return jsonResponse({ balance: user.balance });
}

// 注册新用户（简化示例）
async function handleRegister(request, env) {
  const { email } = await request.json();

  if (!email) {
    return jsonResponse({ error: '请提供邮箱' }, 400);
  }

  // 生成简单 token（生产环境应使用更安全的方式）
  const token = crypto.randomUUID();

  // 新用户赠送 10 个 token
  const userData = {
    email,
    balance: 10,
    createdAt: new Date().toISOString(),
  };

  await env.USERS.put(token, JSON.stringify(userData));

  return jsonResponse({
    success: true,
    token,
    balance: userData.balance,
  });
}

// 辅助函数：返回 JSON 响应
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}
