# 最終極系統指令：Jack 老師 AI 命理 Master Prompt (v7.1 截斷修復與動態結尾版)

⚠️ 緊急修復：系統在給出長篇深度分析時，結尾經常被「截斷」（話沒說完就斷了），且結尾的引導問題有時會與當前討論的話題脫節。請立即執行以下修復。

---

## 模塊一：前端 / 後端 API 呼叫參數修復 (解決截斷問題)

在呼叫 DeepInfra API 時，**必須**明確設定足夠大的 `max_tokens`，確保 AI 有足夠的空間完整輸出四段式分析與結尾。

```javascript
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
      temperature: 0.75,
      top_p: 0.9,
      presence_penalty: 0.5,
      frequency_penalty: 0.5,
      max_tokens: 2048 // ⚠️ 關鍵修復：強制設定足夠大的輸出長度，防止話沒說完就被截斷
    })
  });

  // ⚠️ 前端 / 後端 Stream 處理提醒：
  // 請確保 Stream 解析邏輯正確處理了所有的 chunk，
  // 直到 API 返回的 done: true / [DONE] 為止，不要因為網絡延遲或超時過早關閉連線。
```

---

## 模塊二：System Prompt 補充指令 (動態結尾引導)

請將以下規則加入 System Prompt 中，確保結尾的互動問題是「活」的，而不是死板的模板。

```text
### 動態結尾引導機制 (Dynamic Closing Guidance)
在「四段式對話流」的第四段，你拋出的「二選一」引導問題，**必須嚴格基於使用者「當前正在討論的話題」來動態生成**。

- ❌ 錯誤示範（話題脫節）：使用者問「事業突破」，你卻問「接下來是看財務破耗點，還是看另一半守財？」
- ✅ 正確示範（話題連貫）：
  - 若正在討論「事業與轉職」：引導問題應為「接下來是先看『2026年下半年適合主動跳槽還是內部爭取晉升』，還是聊聊『如何利用辦公室動線加強貴人運』？」
  - 若正在討論「買房與租屋」：引導問題應為「我們是先深入評估『新居朝向對你事業的具體影響』，還是看『如何設定搬家吉日以避開流月沖煞』？」
  - 若正在討論「感情與合夥」：引導問題應為「你想先了解『對方命盤與你的三合互補點』，還是看『下半年哪個月份最適合安排深度旅行來升溫感情』？」

**絕對禁止**在結尾使用與當前上下文無關的預設選項。
```
