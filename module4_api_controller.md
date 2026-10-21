# 模組四：API 串接與動態上下文控制器 (API Controller)

## 任務目標
實作 `callLLM` 函數，負責組裝 Payload 並呼叫 DeepInfra API (DeepSeek-V3)。

## 核心邏輯
1. **動態時間注入**：獲取當前真實時間 (YYYY年MM月)，注入 System Prompt，防止 AI 給出「回到過去」的建議。
2. **狀態提取**：從 `chatHistory` 中提取使用者的關鍵狀態（如：已婚、有兒女、租金高），注入 System Prompt，強制 AI 進行交叉分析。
3. **防重複機制**：提取上一輪 AI 回答的最後 100 字，作為 Negative Prompt 注入，強制 AI 給出新視角。
4. **Context 截斷**：只保留最近 4-6 輪對話，避免 Context 過長導致 LLM 注意力分散。

## 程式碼實作規範 (JavaScript/TypeScript)

```javascript
async function callLLM(userInput, chatHistory, astrologyJSON) {
  // 1. 獲取動態變數
  const now = new Date();
  const currentTime = `${now.getFullYear()}年${now.getMonth() + 1}月`;
  const userStatus = extractStatus(chatHistory); // 自定義函數，提取關鍵字
  const lastAiAdvice = chatHistory.length >= 2 ? chatHistory[chatHistory.length - 2].content.slice(-100) : "無";

  // 2. 讀取 Module 3 的 System Prompt
  const basePrompt = SYSTEM_PROMPT_CONSTANT; 

  // 3. 組裝最終 System Prompt
  const finalPrompt = `
${basePrompt}

【動態上下文 (最高優先級)】
- 當前真實時間：${currentTime}
- 使用者狀態：${userStatus}
- 命盤數據：${JSON.stringify(astrologyJSON)}
- 上一輪 AI 建議摘要：${lastAiAdvice}
⚠️ 強制指令：你的回答必須直接回應使用者最新輸入的細節。絕對禁止複製「上一輪 AI 建議摘要」中的句子！必須給出全新的視角與行動方案。
  `;

  // 4. 組裝 Messages
  const messages = [
    { role: "system", content: finalPrompt },
    ...chatHistory.slice(-6), // 只保留最近 6 輪
    { role: "user", content: userInput }
  ];

  // 5. 呼叫 DeepInfra API
  const response = await fetch("https://api.deepinfra.com/v1/openai/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.DEEPINFRA_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "deepseek-ai/DeepSeek-V3",
      messages: messages,
      stream: true,
      temperature: 0.75, // 保持多樣性
      top_p: 0.9
    })
  });

  // 6. 處理 Streaming (省略具體解析代碼，請使用標準 ReadableStream 解析)
  return response;
}
```
