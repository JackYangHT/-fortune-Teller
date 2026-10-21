import { Solar } from 'lunar-javascript';
import { UserBirthData } from '../types/destiny';
import { POPULAR_CITIES, SHICHEN_OPTIONS } from './destinyEngine.ts';

export interface HiddenStemItem {
  stem: string;
  element: string;
  tenGod: string;
  role: '本氣' | '中氣' | '餘氣';
}

export interface BaZiPillarData {
  key: 'year' | 'month' | 'day' | 'hour';
  name: string;
  subLabel: string;
  ageSpan: string;
  pillarText: string;
  stem: string;
  stemYinYang: '陽' | '陰';
  stemElement: string;
  stemTenGod: string;
  branch: string;
  branchZodiac: string;
  branchYinYang: '陽' | '陰';
  branchElement: string;
  hiddenStems: HiddenStemItem[];
  stage: string;       // 十二長生 / 地勢
  naYin: string;       // 納音五行
  xunKong: string;     // 旬空 / 空亡
}

export interface FiveElementStat {
  element: '木' | '火' | '土' | '金' | '水';
  color: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  count: number;
  percentage: number;
  status: '過弱' | '適中' | '強旺';
}

export interface ChartInteraction {
  type: '六合' | '三合' | '六沖' | '相刑' | '自刑' | '暗合';
  title: string;
  pillars: string[];
  description: string;
  isHarmonious: boolean;
}

export interface BaZiDetailedChart {
  genderText: string;
  trueSolarTime: string;
  lunarDateStr: string;
  solarDateStr: string;
  dayMaster: string;          // e.g. '庚'
  dayMasterElement: string;   // e.g. '金'
  dayMasterYinYang: string;   // e.g. '陽'
  dayMasterFull: string;      // e.g. '庚金'
  dayMasterTitle: string;
  dayMasterDescription: string;
  usefulGod: string;
  avoidGod: string;
  patternName: string;
  pillars: {
    year: BaZiPillarData;
    month: BaZiPillarData;
    day: BaZiPillarData;
    hour: BaZiPillarData;
  };
  pillarsList: BaZiPillarData[]; // [year, month, day, hour] or [hour, day, month, year]
  fiveElements: Record<'木' | '火' | '土' | '金' | '水', FiveElementStat>;
  fiveElementsList: FiveElementStat[];
  interactions: ChartInteraction[];
}

// 繁簡與常規化對照表
const TRAD_MAP: Record<string, string> = {
  正财: '正財',
  偏财: '偏財',
  伤官: '傷官',
  长生: '長生',
  头: '頭',
  杨柳: '楊柳',
  白蜡: '白蠟',
  炉: '爐',
  铁: '鐵',
  养: '養',
};

const toTrad = (str: string): string => {
  if (!str) return '';
  let res = str;
  for (const [k, v] of Object.entries(TRAD_MAP)) {
    res = res.replaceAll(k, v);
  }
  return res;
};

// 生肖對照
const ZODIAC_MAP: Record<string, string> = {
  子: '鼠',
  丑: '牛',
  寅: '虎',
  卯: '兔',
  辰: '龍',
  巳: '蛇',
  午: '馬',
  未: '羊',
  申: '猴',
  酉: '雞',
  戌: '狗',
  亥: '豬',
};

// 天干陰陽與五行
const STEM_INFO: Record<string, { yinYang: '陽' | '陰'; element: string }> = {
  甲: { yinYang: '陽', element: '木' },
  乙: { yinYang: '陰', element: '木' },
  丙: { yinYang: '陽', element: '火' },
  丁: { yinYang: '陰', element: '火' },
  戊: { yinYang: '陽', element: '土' },
  己: { yinYang: '陰', element: '土' },
  庚: { yinYang: '陽', element: '金' },
  辛: { yinYang: '陰', element: '金' },
  壬: { yinYang: '陽', element: '水' },
  癸: { yinYang: '陰', element: '水' },
};

// 地支陰陽與五行
const BRANCH_INFO: Record<string, { yinYang: '陽' | '陰'; element: string }> = {
  子: { yinYang: '陽', element: '水' },
  丑: { yinYang: '陰', element: '土' },
  寅: { yinYang: '陽', element: '木' },
  卯: { yinYang: '陰', element: '木' },
  辰: { yinYang: '陽', element: '土' },
  巳: { yinYang: '陰', element: '火' },
  午: { yinYang: '陽', element: '火' },
  未: { yinYang: '陰', element: '土' },
  申: { yinYang: '陽', element: '金' },
  酉: { yinYang: '陰', element: '金' },
  戌: { yinYang: '陽', element: '土' },
  亥: { yinYang: '陰', element: '水' },
};

// 十天干日主性格與特質解析
const DAY_MASTER_PROFILES: Record<string, { title: string; desc: string }> = {
  甲: {
    title: '參天巨木 · 開拓領袖',
    desc: '如參天大樹，仁慈正直、原則堅定、具有強大向上突破力與領導風範，喜受滋養而不喜被折。',
  },
  乙: {
    title: '柔韌藤蘿 · 敏捷共生',
    desc: '如蔓藤花草，適應力強、靈活通變、擅長借力使力與人際協調，韌性極高，遇逆境能屈能伸。',
  },
  丙: {
    title: '烈日當空 · 熱情光明',
    desc: '如太陽普照，光明磊落、豪爽熱情、具感染力與創造力，思維敏捷，但需注意防範急躁耗神。',
  },
  丁: {
    title: '幽微明燭 · 溫潤智慧',
    desc: '如燈燭燭火，外柔內剛、心思縝密、洞察敏銳，擅長專注鑽研與默默奉獻，有恆久照亮他人的熱忱。',
  },
  戊: {
    title: '厚重崇山 · 沉穩承載',
    desc: '如高山大地，厚重穩健、包容沉著、重信守諾，具強大包容力與組織管理力，行事步步為營。',
  },
  己: {
    title: '溫潤田園 · 涵養包容',
    desc: '如田園沃土，溫和細緻、包容孕育、富同理心，多才多藝且具備強大服務精神與適應協調力。',
  },
  庚: {
    title: '剛銳頑金 · 仗義開拓',
    desc: '如刀劍金石，剛毅果斷、豪邁仗義、開拓力強，經磨礪後愈顯光華，做事重視效率與實質結果。',
  },
  辛: {
    title: '溫潤珠玉 · 精緻求精',
    desc: '如璀璨珠寶，溫潤自尊、細膩求精、審美出眾，重視自尊與生活品質，善於在細節中精益求精。',
  },
  壬: {
    title: '奔騰江海 · 宏大智慧',
    desc: '如奔騰大江，胸襟寬廣、足智多謀、善於隨機應變，具極強流動性與前瞻遠見，不喜受條框束縛。',
  },
  癸: {
    title: '甘霖朝露 · 潤物無聲',
    desc: '如雨露清泉，柔和滋潤、靈性直覺、心思靈巧，善於體察人微，具強大同理心與默默滲透力。',
  },
};

/**
 * 計算詳細八字四柱命盤數據
 */
export function calculateDetailedBaZi(birthData: UserBirthData): BaZiDetailedChart {
  const birthDateStr = birthData.birthDate || '1995-06-18';
  const birthDate = new Date(birthDateStr);

  // 解析出生時辰
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

  // 解析經度並計算真太陽時
  let longitude = 121.5654;
  if (birthData.birthCity) {
    const city = POPULAR_CITIES.find(
      (c) => c.name.includes(birthData.birthCity) || birthData.birthCity.includes(c.name)
    );
    if (city) longitude = city.longitude;
  }
  if (birthData.gps?.cityCoords?.longitude) {
    longitude = birthData.gps.cityCoords.longitude;
  }

  const timeOffsetMin = (longitude - 120) * 4;
  const rawDate = new Date(birthDate);
  rawDate.setHours(birthTime, 0, 0, 0);

  const solarAdjustedMs = rawDate.getTime() + timeOffsetMin * 60 * 1000;
  const solarDate = new Date(solarAdjustedMs);

  const pad = (n: number) => String(n).padStart(2, '0');
  const trueSolarStr = `${solarDate.getFullYear()}-${pad(solarDate.getMonth() + 1)}-${pad(solarDate.getDate())} ${pad(solarDate.getHours())}:${pad(solarDate.getMinutes())}`;

  // 使用 lunar-javascript 嚴格節氣排盤
  const solar = Solar.fromDate(solarDate);
  const lunar = solar.getLunar();
  const eightChar: any = lunar.getEightChar();

  const yearPillar = eightChar.getYear();
  const monthPillar = eightChar.getMonth();
  const dayPillar = eightChar.getDay();
  const hourPillar = eightChar.getTime();

  const yearGan = eightChar.getYearGan();
  const monthGan = eightChar.getMonthGan();
  const dayGan = eightChar.getDayGan();
  const hourGan = eightChar.getTimeGan();

  const yearZhi = eightChar.getYearZhi();
  const monthZhi = eightChar.getMonthZhi();
  const dayZhi = eightChar.getDayZhi();
  const hourZhi = eightChar.getTimeZhi();

  const yearShiShenGan = toTrad(eightChar.getYearShiShenGan());
  const monthShiShenGan = toTrad(eightChar.getMonthShiShenGan());
  const dayShiShenGan = '日主';
  const hourShiShenGan = toTrad(eightChar.getTimeShiShenGan());

  const yearHideGan: string[] = eightChar.getYearHideGan() || [];
  const monthHideGan: string[] = eightChar.getMonthHideGan() || [];
  const dayHideGan: string[] = eightChar.getDayHideGan() || [];
  const hourHideGan: string[] = eightChar.getTimeHideGan() || [];

  const yearShiShenZhi: string[] = (eightChar.getYearShiShenZhi() || []).map(toTrad);
  const monthShiShenZhi: string[] = (eightChar.getMonthShiShenZhi() || []).map(toTrad);
  const dayShiShenZhi: string[] = (eightChar.getDayShiShenZhi() || []).map(toTrad);
  const hourShiShenZhi: string[] = (eightChar.getTimeShiShenZhi() || []).map(toTrad);

  const roles: Array<'本氣' | '中氣' | '餘氣'> = ['本氣', '中氣', '餘氣'];

  const buildHiddenStems = (stems: string[], gods: string[]): HiddenStemItem[] => {
    return stems.map((st, idx) => ({
      stem: st,
      element: STEM_INFO[st]?.element || '土',
      tenGod: gods[idx] || '比肩',
      role: roles[idx] || '餘氣',
    }));
  };

  const yearPillarData: BaZiPillarData = {
    key: 'year',
    name: '年柱',
    subLabel: '祖蔭根基',
    ageSpan: '0 - 16 歲',
    pillarText: yearPillar,
    stem: yearGan,
    stemYinYang: STEM_INFO[yearGan]?.yinYang || '陽',
    stemElement: STEM_INFO[yearGan]?.element || '金',
    stemTenGod: yearShiShenGan,
    branch: yearZhi,
    branchZodiac: ZODIAC_MAP[yearZhi] || '龍',
    branchYinYang: BRANCH_INFO[yearZhi]?.yinYang || '陽',
    branchElement: BRANCH_INFO[yearZhi]?.element || '水',
    hiddenStems: buildHiddenStems(yearHideGan, yearShiShenZhi),
    stage: toTrad(eightChar.getYearDiShi() || '養'),
    naYin: toTrad(eightChar.getYearNaYin() || '海中金'),
    xunKong: toTrad(eightChar.getYearXunKong() || '戌亥'),
  };

  const monthPillarData: BaZiPillarData = {
    key: 'month',
    name: '月柱',
    subLabel: '提綱事業',
    ageSpan: '17 - 32 歲',
    pillarText: monthPillar,
    stem: monthGan,
    stemYinYang: STEM_INFO[monthGan]?.yinYang || '陽',
    stemElement: STEM_INFO[monthGan]?.element || '水',
    stemTenGod: monthShiShenGan,
    branch: monthZhi,
    branchZodiac: ZODIAC_MAP[monthZhi] || '馬',
    branchYinYang: BRANCH_INFO[monthZhi]?.yinYang || '陽',
    branchElement: BRANCH_INFO[monthZhi]?.element || '火',
    hiddenStems: buildHiddenStems(monthHideGan, monthShiShenZhi),
    stage: toTrad(eightChar.getMonthDiShi() || '沐浴'),
    naYin: toTrad(eightChar.getMonthNaYin() || '楊柳木'),
    xunKong: toTrad(eightChar.getMonthXunKong() || '申酉'),
  };

  const dayPillarData: BaZiPillarData = {
    key: 'day',
    name: '日柱',
    subLabel: '日元本命',
    ageSpan: '33 - 48 歲',
    pillarText: dayPillar,
    stem: dayGan,
    stemYinYang: STEM_INFO[dayGan]?.yinYang || '陽',
    stemElement: STEM_INFO[dayGan]?.element || '金',
    stemTenGod: dayShiShenGan,
    branch: dayZhi,
    branchZodiac: ZODIAC_MAP[dayZhi] || '龍',
    branchYinYang: BRANCH_INFO[dayZhi]?.yinYang || '陽',
    branchElement: BRANCH_INFO[dayZhi]?.element || '土',
    hiddenStems: buildHiddenStems(dayHideGan, dayShiShenZhi),
    stage: toTrad(eightChar.getDayDiShi() || '養'),
    naYin: toTrad(eightChar.getDayNaYin() || '白蠟金'),
    xunKong: toTrad(eightChar.getDayXunKong() || '申酉'),
  };

  const hourPillarData: BaZiPillarData = {
    key: 'hour',
    name: '時柱',
    subLabel: '歸宿晚運',
    ageSpan: '49 歲以後',
    pillarText: hourPillar,
    stem: hourGan,
    stemYinYang: STEM_INFO[hourGan]?.yinYang || '陽',
    stemElement: STEM_INFO[hourGan]?.element || '水',
    stemTenGod: hourShiShenGan,
    branch: hourZhi,
    branchZodiac: ZODIAC_MAP[hourZhi] || '馬',
    branchYinYang: BRANCH_INFO[hourZhi]?.yinYang || '陽',
    branchElement: BRANCH_INFO[hourZhi]?.element || '火',
    hiddenStems: buildHiddenStems(hourHideGan, hourShiShenZhi),
    stage: toTrad(eightChar.getTimeDiShi() || '沐浴'),
    naYin: toTrad(eightChar.getTimeNaYin() || '楊柳木'),
    xunKong: toTrad(eightChar.getTimeXunKong() || '申酉'),
  };

  // 五行統計 (8個字: 4個天干 + 4個地支)
  const allElements = [
    STEM_INFO[yearGan]?.element,
    STEM_INFO[monthGan]?.element,
    STEM_INFO[dayGan]?.element,
    STEM_INFO[hourGan]?.element,
    BRANCH_INFO[yearZhi]?.element,
    BRANCH_INFO[monthZhi]?.element,
    BRANCH_INFO[dayZhi]?.element,
    BRANCH_INFO[hourZhi]?.element,
  ].filter(Boolean) as string[];

  const countElem = (e: string) => allElements.filter((item) => item === e).length;

  const woodCount = countElem('木');
  const fireCount = countElem('火');
  const earthCount = countElem('土');
  const metalCount = countElem('金');
  const waterCount = countElem('水');

  const getStatus = (count: number): '過弱' | '適中' | '強旺' => {
    if (count <= 1) return '過弱';
    if (count <= 3) return '適中';
    return '強旺';
  };

  const fiveElements: Record<'木' | '火' | '土' | '金' | '水', FiveElementStat> = {
    木: {
      element: '木',
      color: '#22c55e',
      badgeBg: 'bg-emerald-950/80',
      badgeText: 'text-emerald-400',
      borderColor: 'border-emerald-700/50',
      count: woodCount,
      percentage: Math.round((woodCount / 8) * 100),
      status: getStatus(woodCount),
    },
    火: {
      element: '火',
      color: '#ef4444',
      badgeBg: 'bg-rose-950/80',
      badgeText: 'text-rose-400',
      borderColor: 'border-rose-700/50',
      count: fireCount,
      percentage: Math.round((fireCount / 8) * 100),
      status: getStatus(fireCount),
    },
    土: {
      element: '土',
      color: '#f59e0b',
      badgeBg: 'bg-amber-950/80',
      badgeText: 'text-amber-400',
      borderColor: 'border-amber-700/50',
      count: earthCount,
      percentage: Math.round((earthCount / 8) * 100),
      status: getStatus(earthCount),
    },
    金: {
      element: '金',
      color: '#e2e8f0',
      badgeBg: 'bg-stone-800',
      badgeText: 'text-stone-200',
      borderColor: 'border-stone-600/70',
      count: metalCount,
      percentage: Math.round((metalCount / 8) * 100),
      status: getStatus(metalCount),
    },
    水: {
      element: '水',
      color: '#0ea5e9',
      badgeBg: 'bg-sky-950/80',
      badgeText: 'text-sky-400',
      borderColor: 'border-sky-700/50',
      count: waterCount,
      percentage: Math.round((waterCount / 8) * 100),
      status: getStatus(waterCount),
    },
  };

  // 喜用神粗判 (日主五行生剋平衡法則)
  const dayMasterElem = STEM_INFO[dayGan]?.element || '金';
  let usefulGod = '土金';
  let avoidGod = '火木';

  if (dayMasterElem === '金') {
    if (metalCount + earthCount >= 4) {
      usefulGod = '水木火 (洩秀克制)';
      avoidGod = '土金 (生助過強)';
    } else {
      usefulGod = '土金 (扶身資助)';
      avoidGod = '火木 (克洩交加)';
    }
  } else if (dayMasterElem === '木') {
    if (woodCount + waterCount >= 4) {
      usefulGod = '火土金';
      avoidGod = '水木';
    } else {
      usefulGod = '水木';
      avoidGod = '金土火';
    }
  } else if (dayMasterElem === '水') {
    if (waterCount + metalCount >= 4) {
      usefulGod = '木火土';
      avoidGod = '金水';
    } else {
      usefulGod = '金水';
      avoidGod = '土火木';
    }
  } else if (dayMasterElem === '火') {
    if (fireCount + woodCount >= 4) {
      usefulGod = '土金水';
      avoidGod = '木火';
    } else {
      usefulGod = '木火';
      avoidGod = '水金土';
    }
  } else if (dayMasterElem === '土') {
    if (earthCount + fireCount >= 4) {
      usefulGod = '金水木';
      avoidGod = '火土';
    } else {
      usefulGod = '火土';
      avoidGod = '木水金';
    }
  }

  // 地支合沖刑害分析
  const interactions: ChartInteraction[] = [];
  const branches = [
    { p: '年支', z: yearZhi },
    { p: '月支', z: monthZhi },
    { p: '日支', z: dayZhi },
    { p: '時支', z: hourZhi },
  ];

  // 檢測六合
  const LIU_HE: Record<string, { partner: string; elem: string }> = {
    子: { partner: '丑', elem: '土' },
    丑: { partner: '子', elem: '土' },
    寅: { partner: '亥', elem: '木' },
    亥: { partner: '寅', elem: '木' },
    卯: { partner: '戌', elem: '火' },
    戌: { partner: '卯', elem: '火' },
    辰: { partner: '酉', elem: '金' },
    酉: { partner: '辰', elem: '金' },
    巳: { partner: '申', elem: '水' },
    申: { partner: '巳', elem: '水' },
    午: { partner: '未', elem: '火/土' },
    未: { partner: '午', elem: '火/土' },
  };

  // 檢測六沖
  const LIU_CHONG: Record<string, string> = {
    子: '午',
    午: '子',
    丑: '未',
    未: '丑',
    寅: '申',
    申: '寅',
    卯: '酉',
    酉: '卯',
    辰: '戌',
    戌: '辰',
    巳: '亥',
    亥: '巳',
  };

  // 檢測自刑
  const ZI_XING = ['辰', '午', '酉', '亥'];

  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const b1 = branches[i];
      const b2 = branches[j];

      // 六合
      if (LIU_HE[b1.z]?.partner === b2.z) {
        interactions.push({
          type: '六合',
          title: `${b1.z}${b2.z}六合`,
          pillars: [b1.p, b2.p],
          description: `${b1.p}【${b1.z}】與${b2.p}【${b2.z}】形成六合化${LIU_HE[b1.z].elem}，象徵暗中有貴人相助與聚合之力。`,
          isHarmonious: true,
        });
      }

      // 六沖
      if (LIU_CHONG[b1.z] === b2.z) {
        interactions.push({
          type: '六沖',
          title: `${b1.z}${b2.z}相沖`,
          pillars: [b1.p, b2.p],
          description: `${b1.p}【${b1.z}】與${b2.p}【${b2.z}】逢六沖，主氣場動盪、驛馬奔波或觀點衝突，宜以靜制動化解。`,
          isHarmonious: false,
        });
      }

      // 自刑
      if (b1.z === b2.z && ZI_XING.includes(b1.z)) {
        interactions.push({
          type: '自刑',
          title: `${b1.z}${b2.z}自刑`,
          pillars: [b1.p, b2.p],
          description: `${b1.p}與${b2.p}同逢【${b1.z}】，形成地支自刑，容易在該領域產生自我糾結或思慮過甚，需調和心神。`,
          isHarmonious: false,
        });
      }
    }
  }

  // 格局名稱推論
  let patternName = `${monthShiShenGan}格`;
  if (monthShiShenGan === '比肩' || monthShiShenGan === '劫財') {
    patternName = '建祿格 / 陽刃格';
  } else if (monthShiShenGan === '日主') {
    patternName = `${yearShiShenGan}生旺格`;
  }

  const dmProfile = DAY_MASTER_PROFILES[dayGan] || {
    title: `${dayGan}${dayMasterElem} · 本命中和`,
    desc: '五行流轉有情，注重自律修為與平衡發展。',
  };

  return {
    genderText: birthData.gender === '男' ? '乾造 (男命)' : '坤造 (女命)',
    trueSolarTime: trueSolarStr,
    lunarDateStr: `${(lunar as any).getYearInGanZhi?.() || ''}年 農曆${(lunar as any).getMonthInChinese?.() || ''}月${(lunar as any).getDayInChinese?.() || ''}日`,
    solarDateStr: birthDateStr,
    dayMaster: dayGan,
    dayMasterElement: dayMasterElem,
    dayMasterYinYang: STEM_INFO[dayGan]?.yinYang || '陽',
    dayMasterFull: `${dayGan}${dayMasterElem}`,
    dayMasterTitle: dmProfile.title,
    dayMasterDescription: dmProfile.desc,
    usefulGod,
    avoidGod,
    patternName,
    pillars: {
      year: yearPillarData,
      month: monthPillarData,
      day: dayPillarData,
      hour: hourPillarData,
    },
    // 標準傳統四柱展示：年柱、月柱、日柱、時柱 (亦可按時日由右至左)
    pillarsList: [yearPillarData, monthPillarData, dayPillarData, hourPillarData],
    fiveElements,
    fiveElementsList: Object.values(fiveElements),
    interactions,
  };
}
