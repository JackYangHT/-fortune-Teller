import { UserBirthData } from '../types/destiny';

export interface DailyTrendData {
  date: Date;
  dateString: string;          // e.g. "2026年10月10日"
  dayOfWeek: string;           // e.g. "週六"
  solarTerm: string;           // e.g. "寒露"
  ganZhiYear: string;          // e.g. "丙午"
  ganZhiMonth: string;         // e.g. "戊戌"
  ganZhiDay: string;           // e.g. "己酉"
  dayElement: string;          // e.g. "土金"
  tenGod: string;              // e.g. "傷官"
  tenGodPattern: string;       // e.g. "傷官生財 · 靈感生發格"
  branchRelation: string;      // e.g. "酉酉自刑" or "辰酉六合" or "金氣旺相"
  overallScore: number;        // e.g. 88
  keyword: string;             // e.g. "乘勢破局 · 借力貴人"
  summary: string;             // e.g. "今日靈感充沛，適合推進關鍵方案，但言辭需留三分餘地。"
  auspicious: string[];        // 宜
  inauspicious: string[];      // 忌
  luckyDirection: string;      // 今日生門/吉方
  luckyElement: string;        // 今日五感與配色
  luckyHours: string[];        // 今日黃金吉時
  scores: {
    career: number;
    wealth: number;
    mentor: number;
    mind: number;
    relationship: number;
  };
  jackAdvice: string;          // Jack 老師的深度解讀與建議
  notificationTitle: string;   // 適合瀏覽器 Notification 的標題
  notificationBody: string;    // 適合瀏覽器 Notification 的簡短內文 (不超長)
  suggestedPrompt: string;     // 點擊後可一鍵問 Jack 的提問句
}

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const STEM_ELEMENTS: Record<string, string> = {
  甲: '木', 乙: '木',
  丙: '火', 丁: '火',
  戊: '土', 己: '土',
  庚: '金', 辛: '金',
  壬: '水', 癸: '水',
};

const BRANCH_ELEMENTS: Record<string, string> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木',
  辰: '土', 巳: '火', 午: '火', 未: '土',
  申: '金', 酉: '金', 戌: '土', 亥: '水',
};

const ELEMENT_GENERATES: Record<string, string> = {
  木: '火', 火: '土', 土: '金', 金: '水', 水: '木',
};

const ELEMENT_OVERCOMES: Record<string, string> = {
  木: '土', 土: '水', 水: '火', 火: '金', 金: '木',
};

const LIU_HE: Record<string, string> = {
  子: '丑', 丑: '子',
  寅: '亥', 亥: '寅',
  卯: '戌', 戌: '卯',
  辰: '酉', 酉: '辰',
  巳: '申', 申: '巳',
  午: '未', 未: '午',
};

const LIU_CHONG: Record<string, string> = {
  子: '午', 午: '子',
  丑: '未', 未: '丑',
  寅: '申', 申: '寅',
  卯: '酉', 酉: '卯',
  辰: '戌', 戌: '辰',
  巳: '亥', 亥: '巳',
};

/**
 * 簡易 24 節氣對照 (月份與大致日期)
 */
function getApproxSolarTerm(month: number, day: number): string {
  const terms: Array<{ name: string; m: number; d: number }> = [
    { name: '小寒', m: 1, d: 5 }, { name: '大寒', m: 1, d: 20 },
    { name: '立春', m: 2, d: 4 }, { name: '雨水', m: 2, d: 19 },
    { name: '驚蟄', m: 3, d: 5 }, { name: '春分', m: 3, d: 20 },
    { name: '清明', m: 4, d: 4 }, { name: '穀雨', m: 4, d: 20 },
    { name: '立夏', m: 5, d: 5 }, { name: '小滿', m: 5, d: 21 },
    { name: '芒種', m: 6, d: 5 }, { name: '夏至', m: 6, d: 21 },
    { name: '小暑', m: 7, d: 7 }, { name: '大暑', m: 7, d: 22 },
    { name: '立秋', m: 8, d: 7 }, { name: '處暑', m: 8, d: 23 },
    { name: '白露', m: 9, d: 7 }, { name: '秋分', m: 9, d: 23 },
    { name: '寒露', m: 10, d: 8 }, { name: '霜降', m: 10, d: 23 },
    { name: '立冬', m: 11, d: 7 }, { name: '小雪', m: 11, d: 22 },
    { name: '大雪', m: 12, d: 7 }, { name: '冬至', m: 12, d: 21 },
  ];

  for (let i = terms.length - 1; i >= 0; i--) {
    const t = terms[i];
    if (month > t.m || (month === t.m && day >= t.d)) {
      return t.name;
    }
  }
  return '冬至';
}

/**
 * 計算指定日期的農曆干支（流年、流月、流日）
 */
export function calculateDateGanZhi(targetDate: Date = new Date()) {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1; // 1-12
  const day = targetDate.getDate();

  // 1. 流年 (以立春約 2/4 為界)
  let yearStemIdx = (year - 4) % 10;
  let yearBranchIdx = (year - 4) % 12;
  if (month === 1 || (month === 2 && day < 4)) {
    yearStemIdx = (yearStemIdx - 1 + 10) % 10;
    yearBranchIdx = (yearBranchIdx - 1 + 12) % 12;
  }
  const ganZhiYear = `${HEAVENLY_STEMS[(yearStemIdx + 10) % 10]}${EARTHLY_BRANCHES[(yearBranchIdx + 12) % 12]}`;

  // 2. 流月 (五虎遁日起月)
  // 寅月(立春)起正月
  const monthBranchOrder = (month + 1) % 12; // 2月對應寅(2), 3月卯(3)...
  const monthStemIdx = (yearStemIdx * 2 + month) % 10;
  const ganZhiMonth = `${HEAVENLY_STEMS[(monthStemIdx + 10) % 10]}${EARTHLY_BRANCHES[(monthBranchOrder + 12) % 12]}`;

  // 3. 流日 (1970-01-01 UTC 為 癸酉日)
  const utcDays = Math.floor(Date.UTC(year, month - 1, day) / 86400000);
  const dayStemIdx = (utcDays + 9) % 10;
  const dayBranchIdx = (utcDays + 9) % 12;
  const dayStem = HEAVENLY_STEMS[(dayStemIdx + 10) % 10];
  const dayBranch = EARTHLY_BRANCHES[(dayBranchIdx + 12) % 12];
  const ganZhiDay = `${dayStem}${dayBranch}`;

  return {
    ganZhiYear,
    ganZhiMonth,
    ganZhiDay,
    dayStem,
    dayBranch,
    solarTerm: getApproxSolarTerm(month, day),
  };
}

/**
 * 十神解析 (日主 vs 流日天干)
 */
function getTenGodInfo(dayMaster: string, flowStem: string): { name: string; pattern: string; desc: string } {
  const dmElem = STEM_ELEMENTS[dayMaster] || '木';
  const flowElem = STEM_ELEMENTS[flowStem] || '土';

  const dmIdx = HEAVENLY_STEMS.indexOf(dayMaster);
  const flowIdx = HEAVENLY_STEMS.indexOf(flowStem);
  const isSamePolarity = (dmIdx % 2) === (flowIdx % 2);

  if (dmElem === flowElem) {
    if (isSamePolarity) {
      return {
        name: '比肩',
        pattern: '比肩幫身 · 志同道合日',
        desc: '同儕貴人現身，適合團隊協作、合力攻堅；切忌過度固執。',
      };
    } else {
      return {
        name: '劫財',
        pattern: '劫財引動 · 競爭開拓日',
        desc: '行動力倍增，開疆拓土有利；但須管好錢包，慎防衝動借貸。',
      };
    }
  }

  if (ELEMENT_GENERATES[dmElem] === flowElem) {
    if (isSamePolarity) {
      return {
        name: '食神',
        pattern: '食神生財 · 才華自溢日',
        desc: '思考靈動、語氣溫和，適合提案、創作或享受生活，財源自然潤澤。',
      };
    } else {
      return {
        name: '傷官',
        pattern: '傷官破局 · 靈感爆發日',
        desc: '打破常規的突破點，敏銳度極高；言辭宜留三分餘地，避免直言傷人。',
      };
    }
  }

  if (ELEMENT_OVERCOMES[dmElem] === flowElem) {
    if (isSamePolarity) {
      return {
        name: '偏財',
        pattern: '偏財逢喜 · 機遇機變日',
        desc: '外在商機浮現，溝通談判勝算高；勿抱賭徒心態，專注把握正向金流。',
      };
    } else {
      return {
        name: '正財',
        pattern: '正財入庫 · 步步為營日',
        desc: '本職技能踏實變現之日，適合盤點預算、簽署正式合約，累積紮實。',
      };
    }
  }

  if (ELEMENT_OVERCOMES[flowElem] === dmElem) {
    if (isSamePolarity) {
      return {
        name: '七殺',
        pattern: '七殺魄力 · 披荊斬棘日',
        desc: '責任與壓力湧來，但亦是掌權立威契機；沉著應戰，切勿心浮氣躁。',
      };
    } else {
      return {
        name: '正官',
        pattern: '正官顯耀 · 秩序聲譽日',
        desc: '獲長官、公家或規章體系認可，守正道行事必有所獲，名聲有進。',
      };
    }
  }

  // flowElem generates dmElem
  if (isSamePolarity) {
    return {
      name: '偏印',
      pattern: '偏印蓄力 · 獨闢蹊徑日',
      desc: '洞察直覺敏銳，適合研究攻堅、自我充電；稍離喧囂，心神更明。',
    };
  } else {
    return {
      name: '正印',
      pattern: '正印生輝 · 貴人照拂日',
      desc: '慈悲與福德加身，易得長輩提攜支持；凡事以退為進，後福無窮。',
    };
  }
}

/**
 * 根據使用者命盤與當前真實日期計算今日流日關鍵趨勢
 */
export function calculateDailyTrend(birthData: UserBirthData, targetDate: Date = new Date()): DailyTrendData {
  const { ganZhiYear, ganZhiMonth, ganZhiDay, dayStem, dayBranch, solarTerm } = calculateDateGanZhi(targetDate);

  const astro = birthData.astrologyJSON;
  const gps = birthData.gps;

  // 使用者日柱資訊
  const userBaziDay = gps?.baziDay || astro?.bazi?.pillars?.day || '丙申';
  const userDayMaster = userBaziDay.charAt(0) || '丙';
  const userDayBranch = userBaziDay.charAt(1) || '申';
  const userMajorStar = gps?.majorStarsDisplay || '紫微';

  // 1. 十神分析
  const tenGodInfo = getTenGodInfo(userDayMaster, dayStem);

  // 2. 地支關係分析 (六合 / 六衝 / 三合 / 自刑)
  let branchRelation = '五行流通平穩';
  let branchScoreDelta = 0;

  if (LIU_HE[userDayBranch] === dayBranch) {
    branchRelation = `與本命日支【${userDayBranch}${dayBranch}六合】· 人際和諧互信`;
    branchScoreDelta += 6;
  } else if (LIU_CHONG[userDayBranch] === dayBranch) {
    branchRelation = `與本命日支【${userDayBranch}${dayBranch}相衝】· 磁場位移震盪，需防心浮氣躁`;
    branchScoreDelta -= 5;
  } else if (userDayBranch === dayBranch) {
    branchRelation = `逢日支【${dayBranch}重疊】· 伏吟沈澱，宜反思專注自身`;
    branchScoreDelta += 1;
  } else {
    branchRelation = `流日地支坐【${dayBranch}】· 氣流徐引`;
  }

  // 3. 評分計算 (Base 80)
  let overallScore = 80 + branchScoreDelta;
  if (['正財', '正官', '正印', '食神'].includes(tenGodInfo.name)) {
    overallScore += 6;
  } else if (['偏財', '比肩'].includes(tenGodInfo.name)) {
    overallScore += 4;
  } else if (['傷官', '七殺'].includes(tenGodInfo.name)) {
    overallScore += 2; // high energy, high volatility
  }
  overallScore = Math.min(98, Math.max(68, overallScore));

  // 4. 五維分數
  const scores = {
    career: Math.min(99, Math.max(65, overallScore + (['七殺', '正官', '傷官'].includes(tenGodInfo.name) ? 6 : -2))),
    wealth: Math.min(99, Math.max(65, overallScore + (['正財', '偏財', '食神'].includes(tenGodInfo.name) ? 7 : -3))),
    mentor: Math.min(99, Math.max(65, overallScore + (['正印', '偏印', '比肩'].includes(tenGodInfo.name) ? 8 : 1))),
    mind: Math.min(99, Math.max(65, overallScore + (['正印', '食神'].includes(tenGodInfo.name) ? 5 : -4))),
    relationship: Math.min(99, Math.max(65, overallScore + (LIU_HE[userDayBranch] === dayBranch ? 8 : -2))),
  };

  // 5. 宜 / 忌
  const auspiciousList = [
    ['正財', '偏財'].includes(tenGodInfo.name) ? '盤點資金收支與開拓新客源' : '推進重點專案與主動匯報',
    LIU_HE[userDayBranch] === dayBranch ? '邀約重要合作夥伴共進午餐' : '靜心覆盤目前工作流程',
    '辦公桌整理乾淨以暢通氣場',
    '午後曬太陽或補充溫水淨化磁場',
  ];

  const inauspiciousList = [
    LIU_CHONG[userDayBranch] === dayBranch ? '情緒激動時做出重大決定或簽署合約' : '深夜熬夜討論敏感金錢問題',
    ['傷官', '七殺'].includes(tenGodInfo.name) ? '口角直言不諱而得罪同仁主管' : '未經核算衝動擴大非必要開銷',
    '輕信未經驗證的快速致富資訊',
  ];

  // 6. 今日吉方與五感佈置 (結合奇門與五行生剋)
  const dirMap: Record<string, { dir: string; element: string; hours: string[] }> = {
    木: { dir: '正東 / 東南 (生門震巽方)', element: '綠色植栽、清晨深呼吸、柑橘香氛', hours: ['卯時 (05:00-07:00)', '辰時 (07:00-09:00)'] },
    火: { dir: '正南 (離宮旺氣方)', element: '溫暖色調、明亮採光、咖啡或肉桂香氣', hours: ['巳時 (09:00-11:00)', '午時 (11:00-13:00)'] },
    土: { dir: '東北 / 西南 (艮坤開門方)', element: '大地色系、陶瓷茶具、沉香或檀香', hours: ['辰時 (07:00-09:00)', '未時 (13:00-15:00)'] },
    金: { dir: '正西 / 西北 (乾宮開門生財方)', element: '金屬圓形小物、極簡灰白穿搭、薄荷精油', hours: ['申時 (15:00-17:00)', '酉時 (17:00-19:00)'] },
    水: { dir: '正北 (坎宮靜水生慧方)', element: '深藍色配件、靜態淨水杯、海洋或雪松香氛', hours: ['子時 (23:00-01:00)', '亥時 (21:00-23:00)'] },
  };

  const dayMasterElement = STEM_ELEMENTS[userDayMaster] || '金';
  const favorableElement = ELEMENT_GENERATES[dayMasterElement] || '水';
  const layoutInfo = dirMap[favorableElement] || dirMap['金'];

  // 7. 日期格式化
  const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
  const dayOfWeek = weekdays[targetDate.getDay()];
  const dateString = `${targetDate.getFullYear()}年${targetDate.getMonth() + 1}月${targetDate.getDate()}日`;

  const keyword = `${tenGodInfo.pattern.split('·')[0].trim()} · ${overallScore >= 85 ? '乘勢順遂' : '穩健守成'}`;
  const summary = `${tenGodInfo.desc} ${branchRelation}。`;

  // Jack 老師解讀
  const jackAdvice = `早安！我是 Jack 老師。今天是 ${dateString} ${dayOfWeek}（${ganZhiYear}年 ${ganZhiMonth}月 ${ganZhiDay}日，節氣逢${solarTerm}）。
今日流日天干【${dayStem}】引動你本命【${userDayMaster}】日元的【${tenGodInfo.name}】氣場，命盤主星【${userMajorStar}】亦在此時空下共振。

🧭 **今日時空定位：**
- **流日核心氣候**：${tenGodInfo.pattern}。${tenGodInfo.desc}
- **地支磁場感應**：${branchRelation}。
- **行動指針**：宜「${auspiciousList[0]}」，忌「${inauspiciousList[0]}」。
- **吉時與生門**：建議在 ${layoutInfo.hours[0] || '上午'} 處理最棘手的事項，面朝【${layoutInfo.dir}】深呼吸三次，穩住心神。

把精力專注在你可以掌控的 20% 核心事務上，今天會是順水推舟的一天。`;

  // 瀏覽器推播精簡標題與內文 (針對各作業系統通知欄長度最佳化)
  const notificationTitle = `🧭 Jack 老師 · 今日流日指針 (${ganZhiDay}日)`;
  const notificationBody = `【${tenGodInfo.name}引動】${tenGodInfo.pattern.split('·')[1]?.trim() || tenGodInfo.desc}｜宜：${auspiciousList[0]}｜吉方：${layoutInfo.dir.split(' ')[0]}`;

  const suggestedPrompt = `Jack 老師早安！今日是【${ganZhiDay}日】，引動我本命【${tenGodInfo.name}】氣場。請根據我的紫微【${userMajorStar}】與今日流日能量，給我今天在工作與人際決策上的具體應對建議。`;

  return {
    date: targetDate,
    dateString,
    dayOfWeek,
    solarTerm,
    ganZhiYear,
    ganZhiMonth,
    ganZhiDay,
    dayElement: `${STEM_ELEMENTS[dayStem]}${BRANCH_ELEMENTS[dayBranch]}`,
    tenGod: tenGodInfo.name,
    tenGodPattern: tenGodInfo.pattern,
    branchRelation,
    overallScore,
    keyword,
    summary,
    auspicious: auspiciousList,
    inauspicious: inauspiciousList,
    luckyDirection: layoutInfo.dir,
    luckyElement: layoutInfo.element,
    luckyHours: layoutInfo.hours,
    scores,
    jackAdvice,
    notificationTitle,
    notificationBody,
    suggestedPrompt,
  };
}
