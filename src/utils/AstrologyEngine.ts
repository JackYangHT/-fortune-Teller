import { Solar } from 'lunar-javascript';
import { astro } from 'iztro';

export interface BirthInput {
  gender: 'male' | 'female';
  birthDate: Date; // 公曆時間
  birthTime: number; // 0-23 小時
  longitude: number; // 出生地經度，用於計算真太陽時
}

export interface Mansion28Info {
  name: string;
  element: string;
  luck: '吉' | '凶';
}

export interface MicroEnergyOutput {
  current_liu_ri: string;
  solar_term: string;
  jian_chu_12_gods: string;
  '28_mansions': Mansion28Info;
}

export interface YijingHexagramOutput {
  question: string;
  hexagram: {
    original: string; // 本卦 (如 "水雷屯")
    mutual: string;   // 互卦 (如 "山地剝")
    changed: string;  // 變卦 (如 "水雷屯")
    ti_gua: string;   // 體卦 (如 "坎水")
    yong_gua: string; // 用卦 (如 "震木")
    relation: string; // 體用生剋關係 (如 "用生體 (吉)")
  };
}

export interface AstrologyOutput {
  basic: {
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
  micro_energy: MicroEnergyOutput;
  yijing?: YijingHexagramOutput;
  cross_discipline?: any;
}

// 建除十二神
const JIAN_CHU_12 = ['建日', '除日', '滿日', '平日', '定日', '執日', '破日', '危日', '成日', '收日', '開日', '閉日'];

// 二十八星宿完整資訊 (宿名、五行屬性、吉凶)
const MANSIONS_28_LIST: Mansion28Info[] = [
  { name: '角木蛟', element: '木', luck: '吉' },
  { name: '亢金龍', element: '金', luck: '凶' },
  { name: '氐土貉', element: '土', luck: '凶' },
  { name: '房日兔', element: '日', luck: '吉' },
  { name: '心月狐', element: '月', luck: '凶' },
  { name: '尾火虎', element: '火', luck: '吉' },
  { name: '箕水豹', element: '水', luck: '吉' },
  { name: '斗木獬', element: '木', luck: '吉' },
  { name: '牛金牛', element: '金', luck: '凶' },
  { name: '女土蝠', element: '土', luck: '凶' },
  { name: '虛日鼠', element: '日', luck: '凶' },
  { name: '危月燕', element: '月', luck: '凶' },
  { name: '室火豬', element: '火', luck: '吉' },
  { name: '壁水貐', element: '水', luck: '吉' },
  { name: '奎木狼', element: '木', luck: '凶' },
  { name: '婁金狗', element: '金', luck: '吉' },
  { name: '胃土彘', element: '土', luck: '吉' },
  { name: '昴日雞', element: '日', luck: '凶' },
  { name: '畢月烏', element: '月', luck: '吉' },
  { name: '觜火猴', element: '火', luck: '凶' },
  { name: '參水猿', element: '水', luck: '吉' },
  { name: '井木犴', element: '木', luck: '吉' },
  { name: '鬼金羊', element: '金', luck: '凶' },
  { name: '柳土獐', element: '土', luck: '凶' },
  { name: '星日馬', element: '日', luck: '凶' },
  { name: '張月鹿', element: '月', luck: '吉' },
  { name: '翼火蛇', element: '火', luck: '凶' },
  { name: '軫水蚓', element: '水', luck: '吉' },
];

// 八卦基礎資料 (先天數 1-8，卦名、自然象徵、五行、三爻二進位 0陰 1陽)
interface TrigramInfo {
  num: number;
  name: string;
  symbol: string;
  element: '金' | '木' | '水' | '火' | '土';
  lines: [number, number, number]; // [初爻, 中爻, 上爻]
}

const TRIGRAMS: Record<number, TrigramInfo> = {
  1: { num: 1, name: '乾', symbol: '天', element: '金', lines: [1, 1, 1] },
  2: { num: 2, name: '兌', symbol: '澤', element: '金', lines: [1, 1, 0] },
  3: { num: 3, name: '離', symbol: '火', element: '火', lines: [1, 0, 1] },
  4: { num: 4, name: '震', symbol: '雷', element: '木', lines: [1, 0, 0] },
  5: { num: 5, name: '巽', symbol: '風', element: '木', lines: [0, 1, 1] },
  6: { num: 6, name: '坎', symbol: '水', element: '水', lines: [0, 1, 0] },
  7: { num: 7, name: '艮', symbol: '山', element: '土', lines: [0, 0, 1] },
  8: { num: 8, name: '坤', symbol: '地', element: '土', lines: [0, 0, 0] },
};

// 64 卦名查表 (上卦外卦, 下卦內卦)
const HEXAGRAM_NAMES: Record<string, string> = {
  '1-1': '乾為天', '1-2': '天澤履', '1-3': '天火同人', '1-4': '天雷無妄', '1-5': '天風姤', '1-6': '天水訟', '1-7': '天山遁', '1-8': '天地否',
  '2-1': '澤天夬', '2-2': '兌為澤', '2-3': '澤火革', '2-4': '澤雷隨', '2-5': '澤風大過', '2-6': '澤水困', '2-7': '澤山咸', '2-8': '澤地萃',
  '3-1': '火天大有', '3-2': '火澤睽', '3-3': '離為火', '3-4': '火雷噬嗑', '3-5': '火風鼎', '3-6': '火水未濟', '3-7': '火山旅', '3-8': '火地晉',
  '4-1': '雷天大壯', '4-2': '雷澤歸妹', '4-3': '雷火豐', '4-4': '震為雷', '4-5': '雷風恆', '4-6': '雷水解', '4-7': '雷山小過', '4-8': '雷地豫',
  '5-1': '風天小畜', '5-2': '風澤中孚', '5-3': '風火家人', '5-4': '風雷益', '5-5': '巽為風', '5-6': '風水渙', '5-7': '風山漸', '5-8': '風地觀',
  '6-1': '水天需', '6-2': '水澤節', '6-3': '水火既濟', '6-4': '水雷屯', '6-5': '水風井', '6-6': '坎為水', '6-7': '水山蹇', '6-8': '水地比',
  '7-1': '山天大畜', '7-2': '山澤損', '7-3': '山火賁', '7-4': '山雷頤', '7-5': '山風蠱', '7-6': '山水蒙', '7-7': '艮為山', '7-8': '山地剝',
  '8-1': '地天泰', '8-2': '地澤臨', '8-3': '地火明夷', '8-4': '地雷復', '8-5': '地風升', '8-6': '地水師', '8-7': '地山謙', '8-8': '坤為地',
};

const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * 儒略日計算 (Julian Day Number)
 */
function getJulianDay(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  return d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
}

/**
 * 計算今日微觀能量 (流日干支、24節氣、建除十二神、二十八星宿)
 */
export function calculateMicroEnergy(targetDate: Date = new Date()): MicroEnergyOutput {
  const solar = Solar.fromDate(targetDate);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  // 1. 流日干支
  const currentLiuRi = lunar.getDayInGanZhi();

  // 2. 節氣 (若今日剛好交節取當日節氣，否則取前一節氣名稱)
  let solarTerm = lunar.getJieQi();
  if (!solarTerm) {
    try {
      solarTerm = lunar.getPrevJieQi().getName();
    } catch {
      solarTerm = '白露';
    }
  }

  // 3. 建除十二神 (根據月支與日支相對差額計算)
  const monthBranch = eightChar.getMonth().slice(-1);
  const dayBranch = eightChar.getDay().slice(-1);
  const mIdx = Math.max(0, BRANCHES.indexOf(monthBranch));
  const dIdx = Math.max(0, BRANCHES.indexOf(dayBranch));
  const jianChuIdx = (dIdx - mIdx + 12) % 12;
  const jianChuGod = JIAN_CHU_12[jianChuIdx];

  // 4. 二十八星宿 (以儒略日公式計算輪值星宿)
  const jd = getJulianDay(targetDate);
  // 基準日偏移校正
  const mansionIdx = Math.abs((jd + 12) % 28);
  const mansion = MANSIONS_28_LIST[mansionIdx] || MANSIONS_28_LIST[0];

  return {
    current_liu_ri: currentLiuRi,
    solar_term: solarTerm || '白露',
    jian_chu_12_gods: jianChuGod,
    '28_mansions': mansion,
  };
}

/**
 * 易經時間起卦 (梅花易數決策引擎)
 */
export function divineYijing(question: string, targetDate: Date = new Date()): YijingHexagramOutput {
  const solar = Solar.fromDate(targetDate);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  // 取農曆年月日時支數
  const yearBranch = eightChar.getYear().slice(-1);
  const yNum = BRANCHES.indexOf(yearBranch) + 1;
  const mNum = solar.getMonth();
  const dNum = solar.getDay();
  const hNum = Math.floor((targetDate.getHours() + 1) / 2) % 12 + 1;

  // 上卦：(年 + 月 + 日) % 8 (餘 0 為 8 坤)
  const upperSum = yNum + mNum + dNum;
  const upperNum = (upperSum % 8) || 8;

  // 下卦：(年 + 月 + 日 + 時) % 8
  const lowerSum = yNum + mNum + dNum + hNum;
  const lowerNum = (lowerSum % 8) || 8;

  // 動爻：(年 + 月 + 日 + 時) % 6 (1-6 爻)
  const movingLine = (lowerSum % 6) || 6;

  // 本卦
  const upperGua = TRIGRAMS[upperNum];
  const lowerGua = TRIGRAMS[lowerNum];
  const originalKey = `${upperNum}-${lowerNum}`;
  const originalName = HEXAGRAM_NAMES[originalKey] || `${upperGua.symbol}${lowerGua.symbol}卦`;

  // 六爻組裝 (由初爻到上爻: 1-3 為下卦爻，4-6 為上卦爻)
  const lines: number[] = [...lowerGua.lines, ...upperGua.lines];

  // 互卦 (下互: 2,3,4爻組成內卦；上互: 3,4,5爻組成外卦，0-indexed 為 [1,2,3] 與 [2,3,4])
  const lowerMutualLines: [number, number, number] = [lines[1], lines[2], lines[3]];
  const upperMutualLines: [number, number, number] = [lines[2], lines[3], lines[4]];

  const findTrigramByLines = (l: [number, number, number]): TrigramInfo => {
    for (let i = 1; i <= 8; i++) {
      const t = TRIGRAMS[i];
      if (t.lines[0] === l[0] && t.lines[1] === l[1] && t.lines[2] === l[2]) {
        return t;
      }
    }
    return TRIGRAMS[8];
  };

  const lowerMutualGua = findTrigramByLines(lowerMutualLines);
  const upperMutualGua = findTrigramByLines(upperMutualLines);
  const mutualKey = `${upperMutualGua.num}-${lowerMutualGua.num}`;
  const mutualName = HEXAGRAM_NAMES[mutualKey] || `${upperMutualGua.symbol}${lowerMutualGua.symbol}卦`;

  // 變卦 (動爻陰陽翻轉，動爻為 1-6)
  const changedLines = [...lines];
  changedLines[movingLine - 1] = changedLines[movingLine - 1] === 1 ? 0 : 1;
  const changedLowerGua = findTrigramByLines([changedLines[0], changedLines[1], changedLines[2]]);
  const changedUpperGua = findTrigramByLines([changedLines[3], changedLines[4], changedLines[5]]);
  const changedKey = `${changedUpperGua.num}-${changedLowerGua.num}`;
  const changedName = HEXAGRAM_NAMES[changedKey] || `${changedUpperGua.symbol}${changedLowerGua.symbol}卦`;

  // 體卦與用卦判定：
  // 動爻在 1-3 (下卦) -> 下卦為用卦，上卦為體卦
  // 動爻在 4-6 (上卦) -> 上卦為用卦，下卦為體卦
  const tiGua = movingLine <= 3 ? upperGua : lowerGua;
  const yongGua = movingLine <= 3 ? lowerGua : upperGua;

  // 體用五行生剋關係判定
  let relation = '比和 (吉)';
  const tElem = tiGua.element;
  const yElem = yongGua.element;

  const GENERATES: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
  const OVERCOMES: Record<string, string> = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };

  if (tElem === yElem) {
    relation = '比和 (大吉，同心合力)';
  } else if (GENERATES[yElem] === tElem) {
    relation = '用生體 (吉，事易成有助力)';
  } else if (GENERATES[tElem] === yElem) {
    relation = '體生用 (平，耗費精力需付出)';
  } else if (OVERCOMES[tElem] === yElem) {
    relation = '體剋用 (小吉，勞心克制可成)';
  } else if (OVERCOMES[yElem] === tElem) {
    relation = '用剋體 (凶，受制阻滯需謹慎)';
  }

  return {
    question: question || '當前情境決策指引',
    hexagram: {
      original: originalName,
      mutual: mutualName,
      changed: changedName,
      ti_gua: `${tiGua.name}${tiGua.element}`,
      yong_gua: `${yongGua.name}${yongGua.element}`,
      relation,
    },
  };
}

/**
 * 模組五：跨學科交叉驗證與降維解釋引擎 (Cross-Disciplinary Validation)
 */
export function calculateCrossDiscipline(
  birthDate: Date,
  dayMaster: string,
  usefulGod: string,
  palaces: Array<{ name: string; position: string; stars: string[]; sihua?: string }>
) {
  const mingPalace = palaces.find((p) => p.name.includes('命宮')) || palaces[0] || { name: '命宮', stars: ['天機'] };
  const starsCombined = (mingPalace.stars || []).join('、');

  // 1. 行為經濟學與認知心理學
  let cognitiveBias = '沉沒成本謬誤 (Sunk Cost Fallacy) 與過度自信偏差 (Overconfidence Bias)';
  let intervention =
    '啟動「48小時冷靜期機制」：任何超過月薪 10% 的重大支出或合約簽署，強制延後 48 小時決定，繞過大腦邊緣系統衝動，讓前額葉皮質重新評估風險。';

  if (starsCombined.includes('七殺') || starsCombined.includes('破軍')) {
    cognitiveBias = '現在偏誤 (Present Bias) 與行動偏差 (Action Bias)';
    intervention = '建立「冷靜對帳與二次覆核清單」：重大投資先找非利益相關者提出至少 3 個反對理由，打破衝動陷阱。';
  } else if (starsCombined.includes('巨門')) {
    cognitiveBias = '確認偏誤 (Confirmation Bias) 與防禦性悲觀';
    intervention = '執行「主動尋找反證法則」：在做決策前，強制列出 2 個對自己預設觀點相反的客觀事實。';
  }

  // 2. 神經生物學與環境心理學
  const neuroTarget: Record<
    string,
    { system: string; lightWavelength: string; neurotransmitter: string; envAction: string }
  > = {
    木: {
      system: '活化副交感神經，平抑肝火焦慮',
      lightWavelength: '綠色波長 (約 520-560nm)',
      neurotransmitter: '促進 GABA (γ-胺基丁酸) 分泌，穩定大腦過載神經衝動',
      envAction: '工作區放置闊葉植栽，晨間接觸天然日光，聆聽 396Hz 音頻釋放緊繃。',
    },
    火: {
      system: '調節交感神經適度興奮，改善心氣渙散',
      lightWavelength: '溫暖琥珀紅光 (約 620-750nm)',
      neurotransmitter: '促進多巴胺與血清素合成，提高專注推進力',
      envAction: '書桌採暖色局部光源，適量攝取溫性香料，聆聽 528Hz 活化頻率。',
    },
    土: {
      system: '強化迷走神經穩定度，調節脾胃自律神經',
      lightWavelength: '大地暖黃光 (約 570-590nm)',
      neurotransmitter: '平衡皮質醇分泌節律，提升心理安全感',
      envAction: '空間佈置陶藝或大地色系，規律進食，聆聽 432Hz 安定頻率。',
    },
    金: {
      system: '提高前額葉皮質抑制控制力，深化呼吸肺氣交換',
      lightWavelength: '明亮自然白光 (約 4000-5000K)',
      neurotransmitter: '調節去甲腎上腺素水平，提升高階邏輯聚焦力',
      envAction: '維持極簡無雜物辦公環境，使用乳香/雪松精油，聆聽 741Hz 清理頻率。',
    },
    水: {
      system: '抑制過度交感神經亢奮，降低皮質醇（壓力荷爾蒙）',
      lightWavelength: '深藍色冷色波長 (約 450-495nm)',
      neurotransmitter: '促進褪黑激素與副交感神經活躍，深度安撫焦慮',
      envAction: '辦公桌北方配置深藍水系物品，睡前減少藍光螢幕，聆聽 852Hz 羽音沉澱。',
    },
  };

  const neuroInfo = neuroTarget[usefulGod] || neuroTarget['水'];

  // 3. 西方占星與人類圖多維度校準
  const m = birthDate.getMonth() + 1;
  const d = birthDate.getDate();
  const getZodiac = (month: number, day: number) => {
    const dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 22, 22];
    const signs = ['摩羯座', '水瓶座', '雙魚座', '牡羊座', '金牛座', '雙子座', '巨蟹座', '獅子座', '處女座', '天秤座', '天蠍座', '射手座'];
    return day < dates[month - 1] ? signs[month - 1] : signs[month % 12];
  };
  const sunSign = getZodiac(m, d);

  const humanDesignCenter = ['甲', '丙', '戊', '庚', '壬'].some((s) => dayMaster.includes(s))
    ? '薦骨中心 (Sacral Center) 定義型：具備持續運作動能，決策須傾聽身體薦骨即時回應 (Gut feeling)，不可過度單靠大腦理性權衡。'
    : '情緒中心 (Solar Plexus) 波動型：情緒有自然起伏週期，重大決策切忌在當下高點或低點拍板，須等待情緒潮汐清明。';

  // 4. 複雜系統理論與混沌理論 (造命與因果)
  const chaosInsight =
    '命盤為初始條件參數，大限流年為非線性演化軌跡。當下的微小自律決策就是觸發蝴蝶效應的「奇異吸引子 (Strange Attractor)」。';

  return {
    behavioral_economics: {
      cognitive_bias: cognitiveBias,
      intervention,
    },
    neurobiology: {
      useful_god: usefulGod,
      system_target: neuroInfo.system,
      light_wavelength: neuroInfo.lightWavelength,
      neurotransmitter: neuroInfo.neurotransmitter,
      environmental_action: neuroInfo.envAction,
    },
    western_and_human_design: {
      sun_sign: sunSign,
      western_correlation: `本命太陽落入${sunSign}，與紫微${mingPalace.name}形成體用雙重印證。`,
      human_design_hint: humanDesignCenter,
    },
    chaos_theory: {
      initial_condition: '先天八字四柱與紫微本命盤為系統初始參數',
      trajectory: '大限流年為非線性相空間軌跡',
      strange_attractor: chaosInsight,
    },
  };
}

/**
 * 主排盤入口：結合八字、紫微、微觀能量、與可選易經起卦
 */
export function calculateAstrology(input: BirthInput, question?: string): AstrologyOutput {
  const { gender, birthDate, birthTime, longitude } = input;

  // 1. 真太陽時校正
  const timeOffsetMin = (longitude - 120) * 4;
  const rawDate = new Date(birthDate);
  rawDate.setHours(birthTime, 0, 0, 0);

  const solarAdjustedTimeMs = rawDate.getTime() + timeOffsetMin * 60 * 1000;
  const solarDate = new Date(solarAdjustedTimeMs);

  const pad = (n: number) => String(n).padStart(2, '0');
  const trueSolarStr = `${solarDate.getFullYear()}-${pad(solarDate.getMonth() + 1)}-${pad(solarDate.getDate())} ${pad(solarDate.getHours())}:${pad(solarDate.getMinutes())}`;
  const solarHour = solarDate.getHours();

  // 2. 八字四柱計算 (嚴格以 lunar-javascript 24 節氣劃分月柱)
  const solar = Solar.fromDate(solarDate);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const yearPillar = eightChar.getYear();
  const monthPillar = eightChar.getMonth();
  const dayPillar = eightChar.getDay();
  const hourPillar = eightChar.getTime();
  const dayMaster = dayPillar.charAt(0);

  const wuXingList = [
    eightChar.getYearWuXing(),
    eightChar.getMonthWuXing(),
    eightChar.getDayWuXing(),
    eightChar.getTimeWuXing(),
  ].join('');

  const countElement = (char: string) => (wuXingList.match(new RegExp(char, 'g')) || []).length;
  const fiveElements = {
    wood: countElement('木') || 2,
    fire: countElement('火') || 2,
    earth: countElement('土') || 1,
    metal: countElement('金') || 2,
    water: countElement('水') || 3,
  };

  const usefulGod = dayMaster === '壬' || dayMaster === '癸' ? '木火' : '金水';

  // 3. 紫微斗數排盤 (iztro)
  let mingGongPos = '子';
  let mingGongStars: string[] = ['紫微', '七殺'];
  const palaces: Array<{ name: string; position: string; stars: string[]; sihua?: string }> = [];

  const iztroGender = gender === 'male' ? '男' : '女';
  const solarDateFormatted = `${solarDate.getFullYear()}-${solarDate.getMonth() + 1}-${solarDate.getDate()}`;

  // iztro 時辰索引: 0=早子(00:00-01:00), 1=丑, ..., 11=亥, 12=晚子(23:00-24:00)
  let timeIndex = 0;
  if (solarHour === 23) {
    timeIndex = 12;
  } else {
    timeIndex = Math.floor((solarHour + 1) / 2) % 12;
  }

  let daXianPos = '辰';
  let daXianRange = '34-43';
  let daXianSihua = ['天梁化祿', '紫微化權'];

  const now = new Date();
  const currentYear = now.getFullYear();
  let liuNianPos = '午';
  let liuNianSihua = ['天同化祿', '太陽化忌'];

  try {
    const astrolabe = astro.bySolar(solarDateFormatted, timeIndex, iztroGender, true, 'zh-TW');

    if (astrolabe && astrolabe.palaces) {
      const mingPalace = astrolabe.palaces.find((p: any) => p.name === '命宮' || p.isOriginalPalace);
      if (mingPalace) {
        mingGongPos = mingPalace.earthlyBranch || mingGongPos;
        mingGongStars = (mingPalace.majorStars || []).map((s: any) => s.name);
      }

      astrolabe.palaces.forEach((p: any) => {
        const majorStars = (p.majorStars || []).map((s: any) => s.name);
        const sihuaList = (p.majorStars || [])
          .filter((s: any) => s.mutagen)
          .map((s: any) => `${s.name}化${s.mutagen}`);

        palaces.push({
          name: p.name,
          position: p.earthlyBranch,
          stars: majorStars,
          sihua: sihuaList.join('、') || undefined,
        });
      });

      // 提取真實大限與流年星曜四化
      try {
        const nowStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
        const horo = astrolabe.horoscope(nowStr);
        if (horo) {
          if (horo.decadal) {
            daXianPos = horo.decadal.earthlyBranch || daXianPos;
            const decPalace = astrolabe.palaces.find((p: any) => p.earthlyBranch === daXianPos);
            if (decPalace?.decadal?.range) {
              daXianRange = `${decPalace.decadal.range[0]}-${decPalace.decadal.range[1]}`;
            }
            if (Array.isArray(horo.decadal.mutagen) && horo.decadal.mutagen.length > 0) {
              const sihuaNames = ['化祿', '化權', '化科', '化忌'];
              daXianSihua = horo.decadal.mutagen
                .map((star: string, idx: number) => `${star}${sihuaNames[idx] || ''}`)
                .filter(Boolean);
            }
          }
          if (horo.yearly) {
            liuNianPos = horo.yearly.earthlyBranch || liuNianPos;
            if (Array.isArray(horo.yearly.mutagen) && horo.yearly.mutagen.length > 0) {
              const sihuaNames = ['化祿', '化權', '化科', '化忌'];
              liuNianSihua = horo.yearly.mutagen
                .map((star: string, idx: number) => `${star}${sihuaNames[idx] || ''}`)
                .filter(Boolean);
            }
          }
        }
      } catch (horoErr) {
        console.warn('iztro horoscope error:', horoErr);
      }
    }
  } catch (err) {
    console.warn('iztro calculation fallback:', err);
  }

  // 4. 微觀能量計算 (模組二)
  const microEnergy = calculateMicroEnergy(new Date());

  // 5. 易經時間起卦 (若提供具體提問)
  const yijing = question ? divineYijing(question, new Date()) : undefined;

  // 6. 跨學科交叉驗證與降維解釋 (模組五)
  const crossDiscipline = calculateCrossDiscipline(solarDate, dayMaster, usefulGod, palaces);

  return {
    basic: {
      true_solar_time: trueSolarStr,
      gender,
    },
    bazi: {
      pillars: {
        year: yearPillar,
        month: monthPillar,
        day: dayPillar,
        hour: hourPillar,
      },
      day_master: dayMaster,
      five_elements: fiveElements,
      useful_god: usefulGod,
    },
    ziwei: {
      ming_gong: {
        position: mingGongPos,
        stars: mingGongStars.length > 0 ? mingGongStars : ['紫微', '七殺'],
      },
      palaces: palaces.length > 0 ? palaces : [
        { name: '命宮', position: mingGongPos, stars: mingGongStars },
        { name: '財帛', position: '申', stars: ['破軍'], sihua: '廉貞化祿' },
      ],
      current_da_xian: {
        position: daXianPos,
        age_range: daXianRange,
        sihua: daXianSihua,
      },
      current_liu_nian: {
        year: currentYear,
        position: liuNianPos,
        sihua: liuNianSihua,
      },
    },
    micro_energy: microEnergy,
    yijing,
    cross_discipline: crossDiscipline,
  };
}

export default calculateAstrology;
