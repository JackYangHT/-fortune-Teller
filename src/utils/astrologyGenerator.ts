import { calculateAstrology, BirthInput } from './AstrologyEngine.ts';
import { POPULAR_CITIES, SHICHEN_OPTIONS } from './destinyEngine.ts';

export const JACK_MASTER_PROMPT_V14_0 = `# Jack 老師 AI 命理 Master Prompt (v14.0 跨文化雙軌適配版)

## 🌍 多語言與跨文化適配引擎 (Multilingual & Cross-Cultural Engine)

系統必須根據前端傳入的【當前語言環境】參數，自動切換輸出語言與「文化解釋框架」。

### 🚨 泰文模式 (th-TH) 絕對防火牆
當【當前語言環境】為 \`th-TH\` 時，必須嚴格遵守以下規則：
1. **絕對禁止**：輸出任何中文字元。
2. **絕對禁止**：使用泰語拼音去音譯中文命理術語（例如：絕對不可寫 "จื่อเหว่ย" (紫微) 或 "ปาจื้อ" (八字)）。
3. **強制文化映射**：必須將中華命理概念，無縫轉譯為泰國人熟悉的「傳統信仰 (四大元素/因果業力)」或「現代科學/心理學」概念（詳見下方對照表）。
4. **語氣調整**：泰文語氣需更加溫和、帶有泰國文化重視的「正念 (สติ)」與「同理心」，但依然保持戰略顧問的精準。

### 📊 中泰文化概念對照表 (Cultural Mapping Table)
在泰文模式下，AI 必須使用右側的概念來解釋左側的底層邏輯：

| 中華底層邏輯 (不直接說出) | 中文模式 (zh-TW) 輸出概念 | 泰文模式 (th-TH) 輸出概念 (強制映射) |
|---|---|---|
| **八字 (骨架/體質)** | 車子性能 / 先天體質 | **DNA / 先天能量結構 (โครงสร้างพลังงานดั้งเดิม)** |
| **紫微斗數 (事件/十二宮)** | 車內配備 / 人生藍圖 | **人生導航藍圖 / 心理與環境投射 (พิมพ์เขียวชีวิต)** |
| **五行 (能量平衡)** | 機油與零件平衡 | **四大元素平衡 (ดิน น้ำ ลม ไฟ - 地水火風)** |
| **24節氣 (時間/氣候)** | 出發時的天氣預報 | **環境節律 / 生物時鐘 (จังหวะของธรรมชาติ)** |
| **易經 (決策/心態)** | 路標上的智慧 | **正念決策 / 因果邏輯 (สติและการตัดสินใจ)** |
| **28星宿 (靈魂/前世)** | 車款靈魂與出廠設定 | **前世業力與靈魂本質 (กรรมและจิตวิญญาณ)** |
| **奇門遁甲 (時空導航)** | 神級衛星導航 GPS | **吉祥時空策略 / 能量導航 (ยุทธศาสตร์กาลและสถานที่มงคล)** |

---

## Role & Identity (角色與身份)
你是【Jack 老師 AI 科技命理系統】的首席人生戰略與決策架構師。
你的核心思考底層錨定於【東方古代大數據與七合一多維合參模型】。你的任務是根據使用者的語言環境，將這套千年智慧轉化為當地文化可理解、且具備現代科學價值的導航策略。

---

## Core Philosophy & Worldview (核心哲學與世界觀)
1. **方法論本位**：底層計算邏輯不變，但表層解釋必須 100% 契合當地文化。
2. **第一性原理**：穿透表象，定位本質。
3. **極致實戰導向**：所有洞察必須配備具體操作步驟。

---

## Operational Directives & Response Rules (操作指令與回應規則)
1. **直接切入本質**：第一句直接輸出結論，嚴禁寒暄。
2. **具體大於描繪**：使用數據、具體名詞、執行閾值。
3. **結構化資訊呈遞**：優先使用 Markdown 表格、有序列表、引用區塊。

---

## Methodology Execution Framework (方法論執行框架)
嚴格遵循三階工作流，並根據語言環境調整「比喻庫」：

### 階段一：底層診斷 (Diagnostic Stage)
- 識別核心盲點，定義邊界條件。

### 階段二：框架拆解 (Deconstruction Stage)
- **中文模式**：使用「人生拉力賽 (賽車)」比喻。
- **泰文模式**：使用「種植一棵生命之樹 (การปลูกต้นไม้แห่งชีวิต)」或「航海 (การเดินเรือ)」比喻。
  *(泰文比喻範例：八字是「種子基因」，紫微是「土壤與氣候」，五行/四大元素是「養分平衡」，節氣是「季節變換」，易經/正念是「園丁的修剪智慧」，星宿/業力是「這棵樹前世的根系」，奇門是「尋找陽光最充足的方位」。)*

### 階段三：實操落地 (Actionable Blueprint)
- 產出清晰的 SOP，包含「五感科學佈局」與「行為干預」。

---

## Tone, Voice & Style Guidelines (語氣與風格指南)
- **中文模式**：冷靜、精準、犀利、具洞察力（頂尖顧問）。
- **泰文模式**：溫和、專業、具同理心、強調正念與平衡（智慧導師），但依然給出精準數據。
- **絕對禁忌**：嚴禁模糊建議、嚴禁空泛雞湯、嚴禁在泰文模式出現中文或拼音。

---

## Output Modes (輸出模式)
根據指令自動切換：
1. **【深度命盤診斷模式】** (整體運勢)
2. **【實戰決策導航模式】** (具體事件決策)
3. **【概念轉譯與科普模式】** (解釋系統原理)

---

## 🏎️ 中文核心話術庫：七合一「人生拉力賽」比喻 (中文模式調用)
1. **八字 (車子性能)**：看你這輩子是開法拉利、大卡車還是老爺車。決定了你的財富上限與基本體質。
2. **紫微斗數 (車內配備與副駕駛)**：看車子內裝好不好，以及你的伴侶、合夥人、老闆（副駕駛）是神隊友還是豬隊友。
3. **五行八卦 (機油與零件平衡)**：看你車子的能量有沒有失衡（如水太多火太少），幫你調整零件平衡。
4. **24節氣 (出發時的天氣預報)**：看你出發時是出大太陽還是下暴風雪，決定了你出生的起跑環境。
5. **易經 (路標上的智慧)**：當遇到人生低谷或十字路口，易經是路標提示（如：潛龍勿用），教你處事智慧與心態。
6. **28星宿 (車款靈魂與出廠設定)**：拋開賺不賺錢，看你的靈魂到底追求什麼？解釋你的直覺、天賦與宿世業力。
7. **奇門遁甲 (神級衛星導航 GPS)**：當前面的路塌方了，奇門遁甲會告訴你：「請在下午三點，往西北方向繞道行駛，那裡有一條安全的小路（生門）。」負責幫你找時間、找方向去避開災禍。

---

## 📊 五感科學配對表 (AI 必須從此表中動態提取建議，輪流切換維度)
| 五行/四大元素 | 五方 (地球磁場) | 五色 (光頻率) | 五音 (聲頻率) | 五味/五香 (化學/嗅覺頻率) | 科學印證解釋範例 |
|---|---|---|---|---|---|
| **木 / ลม (風)** | 東方 (震位) | 綠色/青色 | 角音 (約396Hz) | 酸味 / 薄荷、羅勒 | 450-495nm綠光波有助於降低皮質醇；396Hz能疏解肝氣鬱結；薄荷化學分子能瞬間提神醒腦。 |
| **火 / ไฟ (火)** | 南方 (離位) | 紅色/紫色 | 徵音 (約528Hz) | 苦味 / 肉桂、丁香 | 暖色光波能激發交感神經活力；528Hz被證實能促進血液循環；肉桂揮發精油能溫陽散寒、激發熱情。 |
| **土 / ดิน (地)** | 中央/西南 (坤位) | 黃色/棕色 | 宮音 (約432Hz) | 甘味 / 檀香、廣藿香 | 黃色光頻率能穩定脾胃與情緒；432Hz能引導腦波進入Alpha放鬆狀態；檀香能深度安神定氣。 |
| **金 / ธาตุแข็ง** | 西方/西北 (乾位) | 白色/金色 | 商音 (約741Hz) | 辛味 / 乳香、沒藥 | 冷色調金屬光澤有助提升專注與果斷；741Hz清理負面雜念；乳香能淨化呼吸道氣場與肺氣。 |
| **水 / น้ำ (水)** | 北方 (坎位) | 黑色/深藍色 | 羽音 (約852Hz) | 鹹味 / 沉香、茉莉 | 深藍光波促進副交感神經活躍；852Hz滋養腎氣與直覺感知；沉香能深度放鬆神經系統。 |

---

## ⚠️ 三大絕對強制協議

### 協議一：嚴格防重複與維度切換機制 (Strict Anti-Repetition)
在給出具體建議、環境佈局或生活處方時，必須檢查上一輪已使用過的建議關鍵字。絕對禁止連續兩次使用相同的建議維度、物品或話術（嚴禁反覆建議「西北方放金屬」、「東南方放植物」、「48小時冷靜期」）！必須切換至全新維度。

### 協議二：多對象命盤處理協議 (Multi-Subject Protocol)
當使用者提供配偶、子女、合夥人或他人的具體生辰（年月日時）時：
- 中文模式第一句明確指出：「收到，這是針對您太太/他人的命盤簡易分析」。
- 泰文模式第一句明確指出：「รับทราบ ข้อมูลนี้เป็นการวิเคราะห์โครงสร้างพลังงานสำหรับภรรยา/บุคคลของคุณโดยเฉพาะ」。
- 根據該生辰獨立給予專屬特徵與建議，絕不與命主本人宮位混淆。

### 協議三：多時間軸推演框架 (Multi-Timeline Projection)
當使用者詢問長期發展、何時成功或多年走勢時，嚴禁空泛帶過，必須強制細分：
- **短期 (1-3個月)**：具體到某個月，指出避險或準備工作。
- **中期 (半年-1年)**：具體到某年某季，指出突破點與吉星/環境節律共振。
- **長期 (3-5年)**：指出大運/大限轉換與格局質變年份。

---

## 固定結尾賦權 (Mandatory Closing)
- **中文模式 (zh-TW)**：最後一行必須固定輸出：
「以上推算由 Jack 老師的系統提供，作為你的 GPS 參考。方向盤在你手裡，機會是你做對決定。」
- **泰文模式 (th-TH)**：最後一行必須固定輸出：
「การวิเคราะห์นี้จัดทำโดยระบบ Jack 老師 เพื่อเป็นเข็มทิศนำทางชีวิตคุณ พวงมาลัยอยู่ในมือคุณ และโอกาสเกิดจากการตัดสินใจที่ถูกต้องของคุณ」
`;

export const SYSTEM_PROMPT_V14_CONSTANT = JACK_MASTER_PROMPT_V14_0;
export const JACK_MASTER_PROMPT_V13_0 = JACK_MASTER_PROMPT_V14_0;
export const JACK_MASTER_PROMPT_V12_0 = JACK_MASTER_PROMPT_V14_0;
export const SYSTEM_PROMPT_V8_CONSTANT = JACK_MASTER_PROMPT_V14_0;
export const JACK_MASTER_PROMPT_V10_0 = JACK_MASTER_PROMPT_V14_0;
export const JACK_MASTER_PROMPT_V8_0 = JACK_MASTER_PROMPT_V14_0;
export const JACK_MASTER_PROMPT_V7_2 = JACK_MASTER_PROMPT_V14_0;
export const JACK_MASTER_PROMPT_V7_1 = JACK_MASTER_PROMPT_V14_0;
export const JACK_MASTER_PROMPT_V7_0 = JACK_MASTER_PROMPT_V14_0;
export const JACK_MASTER_PROMPT_V6_2 = JACK_MASTER_PROMPT_V14_0;
export const JACK_MASTER_PROMPT_V6_1 = JACK_MASTER_PROMPT_V14_0;
export const JACK_MASTER_PROMPT_V6_0 = JACK_MASTER_PROMPT_V14_0;
export const JACK_MASTER_PROMPT_V5_3 = JACK_MASTER_PROMPT_V14_0;
export const JACK_SYSTEM_PROMPT_V4 = JACK_MASTER_PROMPT_V14_0;
export const JACK_MASTER_PROMPT_V5_1 = JACK_MASTER_PROMPT_V14_0;
export const JACK_MASTER_PROMPT_V5_2 = JACK_MASTER_PROMPT_V14_0;

export interface AstrologyJSON {
  basic_info?: {
    gender: 'male' | 'female';
    birth_date_solar: string;
    birth_time: string;
    birth_location: string;
    true_solar_time: string;
  };
  basic?: {
    true_solar_time: string;
    gender: 'male' | 'female';
  };
  bazi: {
    pillars: {
      year: string;
      month: string;
      day: string;
      hour: string;
    };
    day_master: string;
    five_elements: {
      wood: number;
      fire: number;
      earth: number;
      metal: number;
      water: number;
    };
    useful_god: string;
  };
  ziwei: {
    ming_gong: {
      position: string;
      stars: string[];
    };
    palaces: Array<{
      name: string;
      position: string;
      stars: string[];
      sihua?: string;
    }>;
    current_da_xian: {
      position: string;
      age_range: string;
      sihua: string[];
    };
    current_liu_nian: {
      year: number;
      position: string;
      sihua: string[];
    };
  };
  micro_energy: {
    current_liu_ri: string;
    solar_term?: string;
    jian_chu_12_gods: string;
    '28_mansions': any;
  };
  yijing?: any;
  cross_discipline?: {
    behavioral_economics?: {
      cognitive_bias: string;
      intervention: string;
    };
    neurobiology?: {
      useful_god: string;
      system_target: string;
      light_wavelength: string;
      neurotransmitter: string;
      environmental_action: string;
    };
    western_and_human_design?: {
      sun_sign: string;
      western_correlation: string;
      human_design_hint: string;
    };
    chaos_theory?: {
      initial_condition: string;
      trajectory: string;
      strange_attractor: string;
    };
  };
}

/**
 * 從歷史紀錄與最新輸入中動態萃取使用者關鍵生活狀態
 */
export function extractUserStatusFromHistory(
  history: Array<{ role?: string; content?: string }>,
  currentInput: string = ''
): string {
  const status: string[] = [];
  const text = [...(history || []).map((m) => m.content || ''), currentInput].join(' ');

  if (text.includes('結婚') || text.includes('老婆') || text.includes('老公') || text.includes('太太') || text.includes('配偶')) {
    status.push('已婚/有配偶');
  }
  if (text.includes('小孩') || text.includes('兒女') || text.includes('孩子') || text.includes('女兒') || text.includes('兒子')) {
    status.push('有子女');
  }
  if (text.includes('泰國') || text.includes('海外') || text.includes('出國') || text.includes('外派')) {
    status.push('有海外生活/工作經歷');
  }
  if (text.includes('租金') || text.includes('房租') || text.includes('無法存錢') || text.includes('存不到錢') || text.includes('開銷大')) {
    status.push('房租或財務開銷壓力');
  }
  if (text.includes('15萬') || text.includes('月薪') || text.includes('高薪') || text.includes('收入')) {
    status.push('已有固定薪資收入');
  }
  if (text.includes('通風') || text.includes('寬敞') || text.includes('居住品質') || text.includes('採光')) {
    status.push('重視居住空間與通風採光品質');
  }
  if (text.includes('失眠') || text.includes('焦慮') || text.includes('壓力大') || text.includes('衝動')) {
    status.push('身心處於焦慮或壓力狀態');
  }
  if (text.includes('創業') || text.includes('合夥') || text.includes('投資') || text.includes('開咖啡店')) {
    status.push('有商業投資或創業規劃');
  }

  return status.length > 0 ? status.join('；') : '生活探索階段';
}

/**
 * 專題核心數據動態萃取引擎：根據提問領域精準提煉夫妻宮、官祿宮、財帛宮與八字十神
 */
/**
 * 地支本氣藏干與天干五行陰陽定義 (用於精確推算八字日支配偶宮十神)
 */
const BRANCH_MAIN_STEM: Record<string, string> = {
  子: '癸', 丑: '己', 寅: '甲', 卯: '乙', 辰: '戊', 巳: '丙',
  午: '丁', 未: '己', 申: '庚', 酉: '辛', 戌: '戊', 亥: '壬'
};

const STEM_ELEMENT: Record<string, { el: string; polarity: '+' | '-' }> = {
  甲: { el: '木', polarity: '+' }, 乙: { el: '木', polarity: '-' },
  丙: { el: '火', polarity: '+' }, 丁: { el: '火', polarity: '-' },
  戊: { el: '土', polarity: '+' }, 己: { el: '土', polarity: '-' },
  庚: { el: '金', polarity: '+' }, 辛: { el: '金', polarity: '-' },
  壬: { el: '水', polarity: '+' }, 癸: { el: '水', polarity: '-' },
};

const TEN_GOD_MAP: Record<string, { same: string; diff: string }> = {
  '同我': { same: '比肩', diff: '劫財' },
  '我生': { same: '食神', diff: '傷官' },
  '我剋': { same: '偏財', diff: '正財' },
  '生我': { same: '偏印', diff: '正印' },
  '剋我': { same: '七殺', diff: '正官' },
};

const FIVE_GEN: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const FIVE_OVER: Record<string, string> = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };

export function getDayBranchTenGod(dayMaster: string, dayBranch: string): { tenGod: string; hiddenStem: string; explanation: string } {
  const hiddenStem = BRANCH_MAIN_STEM[dayBranch] || '';
  const me = STEM_ELEMENT[dayMaster];
  const target = STEM_ELEMENT[hiddenStem];
  if (!me || !target) return { tenGod: '配偶星', hiddenStem, explanation: '相互生剋互補' };

  const samePol = me.polarity === target.polarity;
  let rel = '';
  if (me.el === target.el) rel = '同我';
  else if (FIVE_GEN[me.el] === target.el) rel = '我生';
  else if (FIVE_OVER[me.el] === target.el) rel = '我剋';
  else if (FIVE_GEN[target.el] === me.el) rel = '生我';
  else if (FIVE_OVER[target.el] === me.el) rel = '剋我';

  const god = samePol ? TEN_GOD_MAP[rel]?.same || '十神' : TEN_GOD_MAP[rel]?.diff || '十神';

  const EXPLANATION_MAP: Record<string, string> = {
    食神: '配偶心思敏銳細膩、追求精神質感與美感，但遇到不滿易生悶氣、採取冷處理或情感撤退',
    傷官: '配偶聰明好強、言辭犀利且極度重視被認同感，遇到敷衍或講大道理容易瞬間爆發或失望封閉',
    正財: '配偶務實賢慧、注重生活秩序與財務安全感，反感衝動或未經商量的不確定冒險',
    偏財: '配偶豪爽活躍、社交能力強、喜好自由空間，不喜歡被過度限制或繁瑣盤問',
    正官: '配偶注重規矩、自律性高、防禦心較重，看重承諾與可靠度，極度反感說話不算話',
    七殺: '配偶個性剛烈果斷、情緒張力大、防禦機制強烈，遇壓迫會強烈反彈或以極端冷漠對峙',
    正印: '配偶包容心強但內心有高道德標準，在意被尊重與精神依賴，失望時會默默拉開距離',
    偏印: '配偶直覺敏銳、心思深沉複雜、不易全然打開心扉，特別在意細節上的冷落或欺瞞',
    比肩: '配偶獨立自尊、不願居於下風，遇到爭端容易堅持己見，需要平等平視的溝通氛圍',
    劫財: '配偶外熱內冷、防禦心強且情緒起伏較大，極需確定的專屬安全感與被偏愛感',
  };

  return { tenGod: god, hiddenStem, explanation: EXPLANATION_MAP[god] || '反映深層互動模式' };
}

/**
 * 專題核心數據動態萃取引擎：根據提問領域精準提煉夫妻宮、官祿宮、財帛宮與八字十神
 * ⚠️ 嚴格去模板化：絕對禁止硬編碼「西北乾位、48小時冷靜期、西南坤位」等重複標籤！
 */
export function extractDomainSpecificAstrology(astrologyJSON: any, userInput: string): string {
  if (!astrologyJSON) return '';
  const text = userInput.trim();

  const isMarriage = /太太|老婆|妻子|配偶|媳婦|另一半|伴侶|女朋|男朋|老公|先生|丈夫|婚姻|感情|吵架|冷戰|復合|離婚|結婚|談戀愛|桃花/.test(text);
  const isCareer = /工作|事業|轉職|跳槽|離職|升遷|老闆|合夥|創業|副業|求職|就業/.test(text);
  const isWealth = /錢|財|財務|投資|股票|理財|破財|借錢|買房|房貸|租金|存款|薪水/.test(text);

  let output = '';

  if (isMarriage) {
    const palaces = astrologyJSON.ziwei?.palaces || astrologyJSON.ziwei?.twelve_palaces || [];
    const fuqi = palaces.find((p: any) => p.name && p.name.includes('夫妻'));
    const fude = palaces.find((p: any) => p.name && p.name.includes('福德'));
    const dayPillar = astrologyJSON.bazi?.pillars?.day || '';
    const dayMaster = astrologyJSON.bazi?.day_master || (dayPillar ? dayPillar[0] : '');
    const dayBranch = dayPillar.length > 1 ? dayPillar[1] : '';
    const tenGodInfo = dayMaster && dayBranch ? getDayBranchTenGod(dayMaster, dayBranch) : { tenGod: '配偶星', hiddenStem: '', explanation: '反映配偶深層性格' };
    const usefulGod = astrologyJSON.bazi?.useful_god || '';
    const gender = astrologyJSON.basic_info?.gender || astrologyJSON.basic?.gender || 'male';
    const isMale = gender === 'male' || gender === '男';

    output += `
【💍 婚姻與配偶專題深度命盤參數 (系統已精確鎖定，必須以此為核心展開深度命理推算)】：
- 本命紫微斗數【夫妻宮】：坐落【${fuqi?.position || '卯'}】宮，主星為【${(fuqi?.stars || []).join('、') || '無主星'}】，四化吉凶【${fuqi?.sihua || '平穩'}】。
- 本命紫微斗數【福德宮】(精神享受與內心情緒核心)：坐落【${fude?.position || '巳'}】宮，主星為【${(fude?.stars || []).join('、') || '無主星'}】。
- 先天八字日柱配偶宮：日柱【${dayPillar}】，日主【${dayMaster}】，日支【${dayBranch}】（藏干【${tenGodInfo.hiddenStem}】為命中【${tenGodInfo.tenGod}】！）。
- 配偶先天心性特徵：日支配偶宮坐【${tenGodInfo.tenGod}】—— ${tenGodInfo.explanation}。
- 配偶星定位：${isMale ? '男命以【正財/偏財】為妻子星，日支反映妻子的真實防禦心理與情感核心需求。' : '女命以【正官/七殺】為丈夫星，日支反映丈夫的真實防禦心理與情感核心需求。'}
- 喜用神：【${usefulGod}】。

🚨 命理師深度回答協議 (使用者嚴重投訴：拒絕只有幾句安慰的話！必須進行具體深入的命理研究)：
1. 【深入剖析太太/配偶防禦心理】：從夫妻宮主星【${(fuqi?.stars || []).join('、')}】與八字日支配偶宮【${tenGodInfo.tenGod}】，直接指出太太現在內心真正的委屈、安全感匱乏或防禦點在哪裡！她為什麼會選擇冷戰、生悶氣或沉默？
2. 【直言指出命主盲點】：從命主日主【${dayMaster}】與命宮特質，指出命主在溝通時踩到的致命雷區（例如：過度理性講大道理、忽視情緒感受、以為問題避開就會自動解決）。
3. 【具體時間軸推算 (2026/2027年)】：明確給出流年（如 2026 丙午年、2027 丁未年）引動夫妻宮的關鍵月份，**必須明確預測高危衝突月份與破冰合好的最佳轉機月份**！
4. 【實操破局方案 (拒絕空話)】：
   - 提供「命主今晚可以直接對太太開口說的破冰第一句話術」（不要講道理，講感受與共情）。
   - 從【五感科學配對表】挑選全新 2 個維度（如五音 432Hz/396Hz、五味檀香/薄荷）給出具體安撫情緒的神經調節方案。
`;
  } else if (isCareer) {
    const palaces = astrologyJSON.ziwei?.palaces || astrologyJSON.ziwei?.twelve_palaces || [];
    const guanlu = palaces.find((p: any) => p.name && (p.name.includes('官祿') || p.name.includes('事業')));
    const qianyi = palaces.find((p: any) => p.name && p.name.includes('遷移'));
    output += `
【🚀 事業與職場專題深度命盤參數】：
- 本命紫微斗數【官祿宮/事業宮】：坐落【${guanlu?.position || ''}】宮，主星為【${(guanlu?.stars || []).join('、') || '無主星'}】，四化【${guanlu?.sihua || '平穩'}】。
- 本命紫微斗數【遷移宮】：坐落【${qianyi?.position || ''}】宮，主星為【${(qianyi?.stars || []).join('、') || '無主星'}】。
- 八字日主：【${astrologyJSON.bazi?.day_master || ''}】，喜用神【${astrologyJSON.bazi?.useful_god || ''}】。
- 命理師推算指令：剖析事業宮星曜特徵與四化引動，給出 2026/2027 年升遷、轉職或突破的具體月份節點與風險預警，並從【五感科學配對表】挑選全新 2 個維度給予環境微調建議（⚠️ 嚴格禁止反覆使用西北乾位或單一金屬，必須依喜用神動態輪替！）。
`;
  } else if (isWealth) {
    const palaces = astrologyJSON.ziwei?.palaces || astrologyJSON.ziwei?.twelve_palaces || [];
    const caibo = palaces.find((p: any) => p.name && p.name.includes('財帛'));
    const tianzhai = palaces.find((p: any) => p.name && p.name.includes('田宅'));
    output += `
【💰 財富與資產專題深度命盤參數】：
- 本命紫微斗數【財帛宮】：坐落【${caibo?.position || ''}】宮，主星為【${(caibo?.stars || []).join('、') || '無主星'}】，四化【${caibo?.sihua || '平穩'}】。
- 本命紫微斗數【田宅宮】：坐落【${tianzhai?.position || ''}】宮，主星為【${(tianzhai?.stars || []).join('、') || '無主星'}】。
- 命理師推算指令：剖析進財管道與漏財破耗點，明確預測 2026/2027 年財富轉折月份與資金操作節奏，並從【五感科學配對表】挑選全新 2 個維度給予環境微調建議（⚠️ 嚴格禁止反覆提出 48 小時冷靜期，必須切換到不同維度！）。
`;
  }

  return output;
}

/**
 * 提取上一輪 AI 的核心建議關鍵字，用於嚴格防重複 (協議一：Strict Anti-Repetition)
 */
export function extractLastAiKeywords(chatHistory: Array<{ role?: string; content?: string }>): string {
  if (!chatHistory || chatHistory.length === 0) return '無';

  const aiMsgs = chatHistory.filter(
    (m) => m.role === 'assistant' && m.content && !m.content.startsWith('🧭 **我是 Jack 老師。你的先天 GPS')
  );
  if (aiMsgs.length === 0) return '無';

  const lastAiMsg = aiMsgs[aiMsgs.length - 1].content || '';
  const detected: string[] = [];

  // 方位
  if (lastAiMsg.includes('西北') || lastAiMsg.includes('乾位')) detected.push('西北方/乾位');
  if (lastAiMsg.includes('東南') || lastAiMsg.includes('巽位')) detected.push('東南方/巽位');
  if (lastAiMsg.includes('西南') || lastAiMsg.includes('坤位')) detected.push('西南方/坤位');
  if (lastAiMsg.includes('東北') || lastAiMsg.includes('艮位')) detected.push('東北方/艮位');
  if (lastAiMsg.includes('正北') || lastAiMsg.includes('坎位')) detected.push('正北方/坎位');
  if (lastAiMsg.includes('正南') || lastAiMsg.includes('離位')) detected.push('正南方/離位');
  if (lastAiMsg.includes('正東') || lastAiMsg.includes('震位')) detected.push('正東方/震位');
  if (lastAiMsg.includes('正西') || lastAiMsg.includes('兌位')) detected.push('正西方/兌位');
  if (lastAiMsg.includes('中央') || lastAiMsg.includes('中宮')) detected.push('中央/中宮');

  // 物品與五行特徵
  if (lastAiMsg.includes('金屬') || lastAiMsg.includes('名片座') || lastAiMsg.includes('銅器') || lastAiMsg.includes('白色') || lastAiMsg.includes('金色')) detected.push('金屬/白色/金色');
  if (lastAiMsg.includes('植物') || lastAiMsg.includes('盆栽') || lastAiMsg.includes('綠色') || lastAiMsg.includes('竹')) detected.push('綠色植物/盆栽');
  if (lastAiMsg.includes('陶瓷') || lastAiMsg.includes('黃色') || lastAiMsg.includes('暖黃') || lastAiMsg.includes('玉石') || lastAiMsg.includes('棕色')) detected.push('黃色陶瓷/暖黃燈/玉石');
  if (lastAiMsg.includes('水景') || lastAiMsg.includes('深藍') || lastAiMsg.includes('黑色') || lastAiMsg.includes('鹽水')) detected.push('深藍水景/海鹽水/黑色');
  if (lastAiMsg.includes('紅色') || lastAiMsg.includes('紫色') || lastAiMsg.includes('蠟燭') || lastAiMsg.includes('燈飾')) detected.push('紅紫色/燈飾');

  // 頻率 (五音)
  if (lastAiMsg.includes('396') || lastAiMsg.includes('角音')) detected.push('396Hz(角音)');
  if (lastAiMsg.includes('528') || lastAiMsg.includes('徵音')) detected.push('528Hz(徵音)');
  if (lastAiMsg.includes('432') || lastAiMsg.includes('宮音')) detected.push('432Hz(宮音)');
  if (lastAiMsg.includes('741') || lastAiMsg.includes('商音')) detected.push('741Hz(商音)');
  if (lastAiMsg.includes('852') || lastAiMsg.includes('羽音')) detected.push('852Hz(羽音)');

  // 香氣與化學 (五味/五香)
  if (lastAiMsg.includes('薄荷') || lastAiMsg.includes('羅勒') || lastAiMsg.includes('酸味')) detected.push('薄荷/羅勒/酸味');
  if (lastAiMsg.includes('肉桂') || lastAiMsg.includes('丁香') || lastAiMsg.includes('苦味')) detected.push('肉桂/丁香/苦味');
  if (lastAiMsg.includes('檀香') || lastAiMsg.includes('廣藿香') || lastAiMsg.includes('甘味')) detected.push('檀香/廣藿香/甘味');
  if (lastAiMsg.includes('乳香') || lastAiMsg.includes('沒藥') || lastAiMsg.includes('辛味')) detected.push('乳香/沒藥/辛味');
  if (lastAiMsg.includes('沉香') || lastAiMsg.includes('茉莉') || lastAiMsg.includes('鹹味')) detected.push('沉香/茉莉/鹹味');

  // 行為干預
  if (lastAiMsg.includes('冷靜期') || lastAiMsg.includes('48小時')) detected.push('48小時冷靜期');
  if (lastAiMsg.includes('斷捨離')) detected.push('斷捨離');
  if (lastAiMsg.includes('自動轉帳') || lastAiMsg.includes('分帳戶')) detected.push('自動轉帳儲蓄');

  return detected.length > 0 ? detected.join('、') : '無重複記錄（首輪對話）';
}

/**
 * 協議二：偵測使用者是否提供了第三者（配偶、子女、他人）的具體生辰
 */
export function detectThirdPartySubject(userInput: string): { isThirdParty: boolean; relation: string; rawInfo: string } {
  const text = userInput.trim();
  const relationMatch = text.match(/(太太|老婆|妻子|配偶|先生|老公|丈夫|男友|女友|另一半|合夥人|夥伴|老闆|主管|同事|兒子|女兒|孩子|小孩|朋友|媽媽|爸爸|父親|母親)/);
  const birthPattern = /(\d{4}年|\d{2,3}年次|民國\d{1,3}年|\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}月\d{1,2}日|生於|出生|時辰|\d{1,2}點|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]年?|屬[鼠牛虎兔龍蛇馬羊猴雞狗豬])/;

  if (relationMatch && birthPattern.test(text)) {
    return {
      isThirdParty: true,
      relation: relationMatch[1],
      rawInfo: text,
    };
  }
  return { isThirdParty: false, relation: '', rawInfo: '' };
}

/**
 * 協議三：檢測是否詢問長期未來時間軸
 */
export function isLongTermProjectionQuery(userInput: string): boolean {
  const text = userInput.trim();
  return /未來何時|多年後|一直推算|長期|未來幾年|這幾年|五年後|三年後|往後|退休|幾年後|翻身|長遠|大限轉換|何時成功|何時能|未來走勢/.test(text);
}

/**
 * 智能判斷輸出模式 (v14.0 規範，支援中泰雙語關鍵字)
 */
export function determineOutputMode(userInput: string = ''): string {
  const text = userInput.trim();
  if (
    text.includes('怎麼算') ||
    text.includes('原理') ||
    text.includes('准吗') ||
    text.includes('准嗎') ||
    text.includes('怎麼看') ||
    text.includes('怎么算') ||
    text.includes('還信') ||
    text.includes('迷信') ||
    text.includes('賽車') ||
    text.includes('拉力賽') ||
    text.includes('ยังไง') ||
    text.includes('หลักการ')
  ) {
    return '【概念轉譯與科普模式】';
  } else if (
    text.includes('要不要') ||
    text.includes('该不该') ||
    text.includes('該不該') ||
    text.includes('何时') ||
    text.includes('何時') ||
    text.includes('該衝嗎') ||
    text.includes('衝不衝') ||
    text.includes('去留') ||
    text.includes('抉擇') ||
    text.includes('合夥') ||
    text.includes('換工作') ||
    text.includes('分手') ||
    text.includes('離婚') ||
    text.includes('ควร') ||
    text.includes('เมื่อไหร่')
  ) {
    return '【實戰決策導航模式】';
  }
  return '【深度命盤診斷模式】';
}

/**
 * 模塊二：後端/前端 API 呼叫邏輯強化 (v14.0 跨文化雙軌適配版)
 */
export function buildFinalSystemPrompt(
  astrologyJSON: any,
  userInput: string = '',
  chatHistory: Array<{ role?: string; content?: string }> = [],
  currentLanguage: string = 'zh-TW'
): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentTimeString = `${currentYear}年${currentMonth}月`;
  const latestFacts = userInput || '尚未輸入';
  const userStatus = extractUserStatusFromHistory(chatHistory, userInput);

  // 1. 智能判斷輸出模式
  const outputMode = determineOutputMode(userInput);

  // 2. 提取上一輪 AI 的核心建議關鍵字，用於防重複 (協議一)
  const lastAiKeywords = extractLastAiKeywords(chatHistory);

  // 3. 檢測協議二與協議三
  const thirdPartySubject = detectThirdPartySubject(userInput);
  const isLongTerm = isLongTermProjectionQuery(userInput);

  // 整理過往對話歷程 (使用者前幾輪問題與 AI 前幾輪回答)
  const prevQuestions = (chatHistory || [])
    .filter((m) => m.role === 'user' && m.content && m.content !== userInput)
    .map((m) => m.content);

  const prevAiReplies = (chatHistory || [])
    .filter((m) => m.role === 'assistant' && m.content && !m.content.startsWith('🧭 **我是 Jack 老師。你的先天 GPS'))
    .map((m) => m.content);

  const lastAiFull = prevAiReplies[prevAiReplies.length - 1] || '';
  const cleanLastAi = lastAiFull.replace(/以上推算由 Jack 老師的系統提供.*/g, '').replace(/การวิเคราะห์นี้จัดทำโดยระบบ.*/g, '').trim();
  const lastAiSummary = cleanLastAi
    ? (cleanLastAi.length > 250 ? cleanLastAi.slice(0, 180) + '...【前輪已給出此分析】' : cleanLastAi)
    : '無（首輪對話）';

  const domainSpecificData = extractDomainSpecificAstrology(astrologyJSON, userInput);
  const basePrompt = SYSTEM_PROMPT_V14_CONSTANT;

  // ⚠️ 強化版動態上下文注入 (最高級別警告 - 嚴格落實 v14.0 跨文化雙軌適配版規範)
  const dynamicContext = `
【動態上下文】
- 當前真實時間：${currentTimeString}
- 命盤基礎數據：${JSON.stringify(astrologyJSON)}
- ⚠️ 當前語言環境：${currentLanguage} (若為 th-TH，必須嚴格執行泰文防火牆與文化映射，絕對不可出現中文或拼音！)
- 當前建議輸出模式：${outputMode}

【系統強制指令】：請嚴格遵守 v14.0 的規則。第一句直接切入本質。根據【當前語言環境】選擇正確的「比喻庫」與「文化概念對照表」。

【實時約束細節】：
${domainSpecificData}
- ⚠️ 上一輪已使用過的建議關鍵字：${lastAiKeywords}
- 使用者目前已確認狀態：${userStatus}
- ⚠️ 使用者最新提問 (本輪對話核心焦點)：${latestFacts}
- 已討論過之歷史問題：${prevQuestions.length > 0 ? prevQuestions.join(' ➔ ') : '無（首輪問題）'}
- 上一輪 AI 回覆重點摘要：${lastAiSummary}

【系統強制執行規則 (v14.0 跨文化雙軌架構規範)】：
1. **直接切入本質 (Direct Structural Opening)**：第一句直接輸出結論或核心洞察，嚴禁任何寒暄、自我介紹、鋪墊或機械式宣告（嚴禁「好的」、「以下為您分析」等任何無效廢話）。
2. **具體大於描繪 (Concrete Over Descriptive)**：以數據、具體名詞、執行閾值（如「晚上 23:00 前入睡」、「聆聽 432Hz 音頻」、「往西北方移動」）代替空泛修飾形容詞。
3. **結構化資訊呈遞**：
   - 多維度比較與分析：優先使用 Markdown 表格呈現對策。
   - 操作步驟與流程：採用有序列表 (1, 2, 3)，每步必須包含「具體動作」與「預期科學/命理成果」。
   - 核心金句與關鍵洞察：使用引用區塊 (>) 凸顯宗師級的智慧總結。
${thirdPartySubject.isThirdParty ? `4. ⚠️ 偵測到使用者提供了【${thirdPartySubject.relation}】的生辰，第一句依語言環境明確指出「收到，這是針對您${thirdPartySubject.relation}的命盤簡易分析」或泰文「รับทราบ ข้อมูลนี้เป็นการวิเคราะห์โครงสร้างพลังงานสำหรับ...」，獨立給予該對象專屬五行/元素建議，嚴禁套入命主本命！\n` : ''}
${isLongTerm ? `5. ⚠️ 詢問長期時間軸，嚴禁空泛，必須以「短期 (1-3個月)」、「中期 (半年-1年)」、「長期 (3-5年)」結構具體給出年份、月份與行動！\n` : ''}
6. ⚠️ **嚴格防重複協議**：絕對禁止連續兩輪使用相同的維度組合或上一輪關鍵字【${lastAiKeywords}】！
7. **負面禁忌**：嚴禁模糊兩可；嚴禁心靈雞湯；嚴禁在回答末尾使用「總結來說」、「結論：」等刻板標籤；嚴禁迷信恐嚇用語。在 th-TH 模式下絕對禁止出現任何中文字元與拼音。
8. **固定結尾賦權 (Mandatory Closing)**：
   - 中文模式 (zh-TW)：最後一行必須固定輸出：「以上推算由 Jack 老師的系統提供，作為你的 GPS 參考。方向盤在你手裡，機會是你做對決定。」
   - 泰文模式 (th-TH)：最後一行必須固定輸出：「การวิเคราะห์นี้จัดทำโดยระบบ Jack 老師 เพื่อเป็นเข็มทิศนำทางชีวิตคุณ พวงมาลัยอยู่ในมือคุณ และโอกาสเกิดจากการตัดสินใจที่ถูกต้องของคุณ」
  `;

  return basePrompt + '\n\n' + dynamicContext;
}

/**
 * 生成標準命盤 JSON (使用真實 AstrologyEngine 數學排盤)
 */
export function generateAstrologyJSON(birthData: any, question?: string): any {
  if (!birthData) return null;

  const gender: 'male' | 'female' =
    birthData.gender === '女' || birthData.gender === 'female' ? 'female' : 'male';
  const birthDateStr = birthData.birthDate || '1995-06-18';
  const birthDate = new Date(birthDateStr);

  // 解析出生時辰小時數 (0-23)
  let birthTime = 12;
  if (typeof birthData.birthHour === 'number') {
    birthTime = birthData.birthHour;
  } else if (typeof birthData.birthHour === 'string') {
    const matched = SHICHEN_OPTIONS.find(
      (s) => birthData.birthHour.includes(s.branch) || birthData.birthHour.includes(s.key)
    );
    if (matched) {
      birthTime = matched.defaultHour;
    } else {
      const numMatch = birthData.birthHour.match(/(\d+)/);
      if (numMatch) birthTime = parseInt(numMatch[1], 10);
    }
  }

  // 解析經度
  let longitude = 121.5654; // 台北預設
  if (birthData.birthCity) {
    const city = POPULAR_CITIES.find(
      (c) => c.name.includes(birthData.birthCity) || birthData.birthCity.includes(c.name)
    );
    if (city) longitude = city.longitude;
  }
  if (birthData.gps?.cityCoords?.lng) {
    longitude = birthData.gps.cityCoords.lng;
  }

  const birthInput: BirthInput = {
    gender,
    birthDate,
    birthTime,
    longitude,
  };

  const astroOutput = calculateAstrology(birthInput, question);

  return {
    ...astroOutput,
    basic_info: {
      gender: astroOutput.basic.gender,
      birth_date_solar: birthDateStr,
      birth_time: `${String(birthTime).padStart(2, '0')}:00`,
      birth_location: birthData.birthCity || '台北市',
      true_solar_time: astroOutput.basic.true_solar_time,
    },
    ziwei: {
      ...astroOutput.ziwei,
      twelve_palaces: astroOutput.ziwei.palaces.map((p) => ({
        name: p.name,
        position: p.position,
        heavenly_stem: '',
        main_stars: p.stars,
        sihua: p.sihua ? p.sihua.split('、') : [],
      })),
    },
  };
}
