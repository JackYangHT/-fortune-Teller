# 模組一：前端硬排盤引擎 (Astrology Calculation Engine)

## 任務目標
實作一個前端 TypeScript/JavaScript 模組 `AstrologyEngine.ts`，負責將使用者的出生資訊轉換為標準化的命盤 JSON 數據。絕對不可使用 LLM 進行數學排盤。

## 依賴套件建議
- 紫微斗數：`iztro`
- 農曆/八字/節氣：`lunar-javascript` (或 `lunar`)

## 輸入參數
```typescript
interface BirthInput {
  gender: 'male' | 'female';
  birthDate: Date; // 公曆時間
  birthTime: number; // 0-23 小時
  longitude: number; // 出生地經度，用於計算真太陽時
}
```

## 核心運算邏輯
1. **真太陽時校正**：根據 `longitude` 與標準時區（如台北 120度）的經度差，將 `birthDate` 校正為真太陽時。
2. **八字四柱計算**：
   - 嚴格以「24節氣」劃分月柱（例如：立春才算正月，驚蟄才算二月）。
   - 計算年、月、日、時四柱的天干地支。
   - 計算日主五行旺衰與十神。
3. **紫微斗數排盤**：
   - 根據真太陽時與農曆，計算命宮、身宮位置。
   - 安十二宮（命、兄、夫、子、財、疾、遷、僕、官、田、福、父）。
   - 安十四主星、輔星、煞星。
   - 計算大限（十年運）與流年（當年運）的宮位與天干四化。

## 輸出 JSON 結構規範
```json
{
  "basic": { "true_solar_time": "1990-08-15 07:52", "gender": "male" },
  "bazi": {
    "pillars": { "year": "庚午", "month": "甲申", "day": "壬子", "hour": "甲辰" },
    "day_master": "壬",
    "five_elements": { "wood": 2, "fire": 2, "earth": 1, "metal": 2, "water": 3 },
    "useful_god": "木火"
  },
  "ziwei": {
    "ming_gong": { "position": "子", "stars": ["紫微", "七殺"] },
    "palaces": [
      { "name": "財帛", "position": "申", "stars": ["破軍"], "sihua": "廉貞化祿" }
    ],
    "current_da_xian": { "position": "辰", "age_range": "34-43", "sihua": ["天梁化祿", "紫微化權"] },
    "current_liu_nian": { "year": 2024, "position": "辰", "sihua": ["廉貞化祿", "太陽化忌"] }
  }
}
```
