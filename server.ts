import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  buildFinalSystemPrompt,
  generateAstrologyJSON
} from './src/utils/astrologyGenerator.ts';
import { divineYijing } from './src/utils/AstrologyEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

function getAppPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    return Number(process.argv[portArgIndex + 1]);
  }
  if (process.env.APP_PORT) {
    return Number(process.env.APP_PORT);
  }
  if (process.env.DEFAULT_APP_PORT) {
    return Number(process.env.DEFAULT_APP_PORT);
  }
  // If PORT is 8080, that is the Nginx outer reverse proxy port, so the app server must bind to 3000
  if (process.env.PORT && process.env.PORT !== '8080') {
    return Number(process.env.PORT);
  }
  return 3000;
}

const PORT = getAppPort();

app.use(express.json());

/**
 * POST /api/chat
 * Strictly adheres to Master Prompt v5.1 Module 2 & Module 3
 */
app.post('/api/chat', async (req, res) => {
  const { userInput, chatHistory, astrologyJSON, birthData, customApiKey, currentLanguage = 'zh-TW' } = req.body;

  if (!userInput && (!chatHistory || chatHistory.length === 0)) {
    return res.status(400).json({ error: 'userInput or chatHistory is required.' });
  }

  // Set SSE headers for typewriter streaming
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // 1. 取得命盤 JSON (模塊二)
  const effectiveAstrologyJSON = astrologyJSON || (birthData ? generateAstrologyJSON(birthData) : null);
  if (effectiveAstrologyJSON && userInput && !effectiveAstrologyJSON.yijing) {
    try {
      effectiveAstrologyJSON.yijing = divineYijing(userInput, new Date());
    } catch (e) {
      console.warn('divineYijing fallback:', e);
    }
  }

  // 2. 嚴謹清洗歷史對話 (過濾空訊息、移除最前方的初始化問候卡片、避免重複當前 userInput)
  const history = Array.isArray(chatHistory) ? chatHistory : [];
  const cleanTurns: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  for (const item of history) {
    if (!item || !item.content || !item.content.trim()) continue;
    const role: 'user' | 'assistant' = item.role === 'assistant' ? 'assistant' : 'user';
    // 若為開場白卡片，不當作對話輪次以確保 Gemini 等 API 從 user 輪次起手
    if (role === 'assistant' && item.content.startsWith('🧭 **我是 Jack 老師。你的先天 GPS')) {
      continue;
    }
    cleanTurns.push({ role, content: item.content.trim() });
  }

  // 若前端歷史最後一條恰好等於當前 userInput，予以移除以防 user 角色連續重複兩次
  if (
    cleanTurns.length > 0 &&
    cleanTurns[cleanTurns.length - 1].role === 'user' &&
    cleanTurns[cleanTurns.length - 1].content === userInput
  ) {
    cleanTurns.pop();
  }

  // 保留稍多一點歷史（最近 8 輪對話，約 4 輪問答），以利防重複檢查 (v14.0)
  const recentHistory = cleanTurns.slice(-8);

  // 3. 模塊二：提取歷史狀態與使用者最新輸入，構建真人對話流防重複 System Prompt (傳入 currentLanguage)
  const finalSystemPrompt = buildFinalSystemPrompt(effectiveAstrologyJSON, userInput || '', recentHistory, currentLanguage);

  // 4. 組裝 Messages 陣列 (DeepInfra / OpenAI 格式)
  const messages = [
    { role: 'system', content: finalSystemPrompt },
    ...recentHistory,
    ...(userInput ? [{ role: 'user', content: userInput }] : [])
  ];

  // 5. 決定 API 金鑰與模型
  const deepInfraKey = customApiKey || birthData?.deepInfraApiKey || process.env.DEEPINFRA_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  // 6. 呼叫 DeepInfra API (DeepSeek-V3, stream: true, v14.0 參數配置)
  if (deepInfraKey) {
    try {
      const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${deepInfraKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-ai/DeepSeek-V3',
          messages: messages,
          stream: true,
          temperature: 0.65,
          top_p: 0.9,
          presence_penalty: 0.4,
          frequency_penalty: 0.4,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`DeepInfra 回應異常 (${response.status}): ${errText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      let chunksWritten = 0;
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const cleanLine = line.trim();
            if (cleanLine.startsWith('data: ')) {
              const dataStr = cleanLine.slice(6);
              if (dataStr === '[DONE]') {
                if (chunksWritten > 0) {
                  res.write('data: [DONE]\n\n');
                  res.end();
                  return;
                }
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                const delta = parsed.choices?.[0]?.delta?.content || '';
                if (delta) {
                  chunksWritten++;
                  res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
                }
              } catch {
                // Ignore partial chunks
              }
            }
          }
        }

        // 沖刷剩餘的 buffer，防止結尾殘留未解析字串
        if (buffer.trim()) {
          const cleanLine = buffer.trim();
          if (cleanLine.startsWith('data: ')) {
            const dataStr = cleanLine.slice(6);
            if (dataStr !== '[DONE]') {
              try {
                const parsed = JSON.parse(dataStr);
                const delta = parsed.choices?.[0]?.delta?.content || '';
                if (delta) {
                  chunksWritten++;
                  res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
                }
              } catch {
                // Ignore
              }
            }
          }
        }
      }

      if (chunksWritten > 0) {
        res.write('data: [DONE]\n\n');
        res.end();
        return;
      }
      console.warn('DeepInfra returned 0 text chunks, falling back to Gemini...');
    } catch (err: any) {
      console.error('DeepInfra API call error:', err.message);
      if (!geminiKey) {
        const errorMsg = '🧭 **網路連線不穩定，Jack 老師正在重新校準能量場，請稍後再試一次。**';
        res.write(`data: ${JSON.stringify({ text: errorMsg })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
        return;
      }
      console.log('DeepInfra failed, falling back to Gemini API...');
    }
  }

  // Fallback to Gemini if no DeepInfra key or DeepInfra failed or gave 0 tokens
  if (geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });

      // 組裝 Gemini contents 格式：確保首條必為 'user' 且相鄰同角色自動合併交替
      const rawGemini: Array<{ role: 'user' | 'model'; text: string }> = [];
      for (const turn of recentHistory) {
        if (!turn.content || !turn.content.trim()) continue;
        rawGemini.push({
          role: turn.role === 'assistant' ? 'model' : 'user',
          text: turn.content.trim(),
        });
      }
      if (userInput && userInput.trim()) {
        rawGemini.push({
          role: 'user',
          text: userInput.trim(),
        });
      }

      const geminiContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
      for (const turn of rawGemini) {
        if (geminiContents.length === 0) {
          if (turn.role === 'model') {
            geminiContents.push({
              role: 'user',
              parts: [{ text: '請為我進行命理分析。' }],
            });
          }
          geminiContents.push({
            role: turn.role,
            parts: [{ text: turn.text }],
          });
        } else {
          const prev = geminiContents[geminiContents.length - 1];
          if (prev.role === turn.role) {
            prev.parts[0].text += `\n\n${turn.text}`;
          } else {
            geminiContents.push({
              role: turn.role,
              parts: [{ text: turn.text }],
            });
          }
        }
      }

      // 如果 geminiContents 仍為空，補上預設問句
      if (geminiContents.length === 0) {
        geminiContents.push({
          role: 'user',
          parts: [{ text: '請為我進行命理分析。' }],
        });
      }

      // 多模型容錯降級列表 (優先極速且高可用模型，配合重試機制防範 503 尖峰)
      const candidateModels = [
        'gemini-3.1-flash-lite',
        'gemini-flash-latest',
        'gemini-3.8-flash',
        'gemini-3.1-pro-preview',
      ];

      let responseStream = null;
      let lastStreamError: any = null;

      for (const modelName of candidateModels) {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            responseStream = await ai.models.generateContentStream({
              model: modelName,
              contents: geminiContents,
              config: {
                systemInstruction: finalSystemPrompt,
                temperature: 0.8,
                maxOutputTokens: 2048,
              },
            });
            if (responseStream) {
              break;
            }
          } catch (streamErr: any) {
            lastStreamError = streamErr;
            const is503 = streamErr?.status === 503 || String(streamErr?.message).includes('503');
            if (attempt === 0 && is503) {
              await new Promise((r) => setTimeout(r, 600));
              continue;
            }
            console.warn(`Model ${modelName} unavailable (${streamErr?.message}), trying next...`);
          }
        }
        if (responseStream) break;
      }

      if (!responseStream) {
        throw lastStreamError || new Error('所有 Gemini 模型暫時不可用，請稍後再試。');
      }

      for await (const chunk of responseStream) {
        const chunkText = chunk.text || '';
        if (chunkText) {
          res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();
      return;
    } catch (err: any) {
      console.error('Gemini fallback failed:', err.message);
      const errorMsg = currentLanguage === 'th-TH'
        ? 'การเชื่อมต่อไม่เสถียร กรุณาลองใหม่อีกครั้ง'
        : '🧭 **網路連線不穩定，Jack 老師正在重新校準能量場，請稍後再試一次。**';
      res.write(`data: ${JSON.stringify({ text: errorMsg })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }
  }

  // Neither key configured
  const noKeyMsg = `🧭 **Jack 老師提示：尚未配置 DeepInfra API 金鑰**\n\n目前系統未檢測到有效的 DeepInfra API Key。\n\n**如何開始：**\n1. 請於登入生辰表單或右上角 **「🔑 API 設定」** 填入您的 **DeepInfra API Token**（用於串接 DeepSeek-V3）。\n2. 系統將嚴格遵循 Master Prompt v5.1 核心算命推演規則進行高精度解盤！`;
  res.write(`data: ${JSON.stringify({ text: noKeyMsg })}\n\n`);
  res.write('data: [DONE]\n\n');
  res.end();
});

/**
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    hasDeepInfraKey: Boolean(process.env.DEEPINFRA_API_KEY),
  });
});

// Mount Vite or static server
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
} else {
  import('vite').then(async ({ createServer }) => {
    const vite = await createServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    const serverInstance = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Dev Server listening on http://0.0.0.0:${PORT}`);
    });
    serverInstance.on('error', (err: any) => {
      console.error('Server listen error:', err);
    });
  });
}
