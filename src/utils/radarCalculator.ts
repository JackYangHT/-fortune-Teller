import { UserBirthData } from '../types/destiny';

export interface RadarDimensionItem {
  dimension: string;
  name: string;
  score: number;
  fullMark: number;
  level: string;
  highlight: string;
  description: string;
  tag: string;
  color: string;
}

export interface DestinyRadarResult {
  currentYear: number;
  liuNianGanZhi: string;
  overallScore: number;
  overallTitle: string;
  summary: string;
  dimensions: RadarDimensionItem[];
}

/**
 * 天乙貴人對照表 (口訣：甲戊庚牛羊，乙己鼠猴鄉，丙丁豬雞位，壬癸兔蛇藏，六辛逢馬虎)
 */
const TIAN_YI_GUI_REN: Record<string, string[]> = {
  甲: ['丑', '未'],
  戊: ['丑', '未'],
  庚: ['丑', '未'],
  乙: ['子', '申'],
  己: ['子', '申'],
  丙: ['亥', '酉'],
  丁: ['亥', '酉'],
  壬: ['卯', '巳'],
  癸: ['卯', '巳'],
  辛: ['午', '寅'],
};

/**
 * 根據使用者的八字四柱、紫微宮位與 2026 當前流年運勢，計算『事業、財運、健康、感情、貴人』五維度命理評分
 */
export function calculateDestinyRadar(birthData: UserBirthData): DestinyRadarResult {
  const currentYear = new Date().getFullYear(); // e.g. 2026
  const liuNianGanZhi = '丙午'; // 2026 流年

  const astro = birthData.astrologyJSON;
  const gps = birthData.gps;

  // 1. 取得八字與五行基礎
  const baziYear = gps?.baziYear || astro?.bazi?.pillars?.year || '甲子';
  const baziMonth = gps?.baziMonth || astro?.bazi?.pillars?.month || '庚午';
  const baziDay = gps?.baziDay || astro?.bazi?.pillars?.day || '丙申';
  const baziHour = gps?.baziHour || astro?.bazi?.pillars?.hour || '甲午';
  const dayMaster = baziDay.charAt(0) || astro?.bazi?.day_master || '丙';
  const dayBranch = baziDay.charAt(1) || '申';

  // 五行分佈
  const fiveElements = astro?.bazi?.five_elements || {
    wood: 2,
    fire: 2,
    earth: 1,
    metal: 2,
    water: 2,
  };

  // 2. 取得紫微宮位資訊
  const palaces: Array<{ name: string; position: string; stars: string[]; sihua?: string }> =
    astro?.ziwei?.palaces || [];

  const findPalace = (keywords: string[]) => {
    return palaces.find((p) => keywords.some((k) => p.name?.includes(k)));
  };

  const mingPalace = findPalace(['命宮']) || { name: '命宮', stars: gps?.majorStars || ['紫微'], sihua: '' };
  const careerPalace = findPalace(['官祿', '事業']) || { name: '官祿宮', stars: [], sihua: '' };
  const wealthPalace = findPalace(['財帛']) || { name: '財帛宮', stars: [], sihua: '' };
  const healthPalace = findPalace(['疾厄']) || { name: '疾厄宮', stars: [], sihua: '' };
  const spousePalace = findPalace(['夫妻']) || { name: '夫妻宮', stars: [], sihua: '' };
  const mentorPalace = findPalace(['遷移', '僕役', '交友']) || { name: '遷移宮', stars: [], sihua: '' };

  const currentLiuNian = astro?.ziwei?.current_liu_nian || {
    year: currentYear,
    position: '午',
    sihua: ['天同化祿', '天機化權', '文昌化科', '廉貞化忌'],
  };
  const liuNianSihua: string[] = currentLiuNian.sihua || [];

  // ===================== 【維度一：事業 (Career)】 =====================
  let careerScore = 72;
  const careerStars = [...(careerPalace.stars || []), ...(mingPalace.stars || [])];

  // 主星吉凶加成
  if (careerStars.some((s) => ['紫微', '天府', '武曲', '太陽', '七殺', '天相'].includes(s))) {
    careerScore += 8;
  }
  if (careerStars.some((s) => ['破軍', '貪狼', '巨門'].includes(s))) {
    careerScore += 5;
  }
  // 四化影響 (化祿、化權大旺事業，化忌則需防衝動)
  if (careerPalace.sihua?.includes('化祿') || mingPalace.sihua?.includes('化祿')) {
    careerScore += 9;
  }
  if (careerPalace.sihua?.includes('化權') || mingPalace.sihua?.includes('化權')) {
    careerScore += 8;
  }
  if (careerPalace.sihua?.includes('化忌')) {
    careerScore -= 6;
  }
  // 流年四化共振
  if (liuNianSihua.some((s) => s.includes('化權') || s.includes('化祿'))) {
    careerScore += 5;
  }
  careerScore = Math.min(96, Math.max(52, careerScore));

  const careerLevel =
    careerScore >= 88 ? '勢如破竹' : careerScore >= 78 ? '順遂開創' : careerScore >= 68 ? '厚積薄發' : '需防躁進';
  const careerHighlight =
    careerScore >= 85
      ? '流年權祿同會，專業決策力強，開拓新領域具強大推進力'
      : '官祿磁場蓄勢待發，宜專注深耕核心專業技能，避免盲目跨界';

  // ===================== 【維度二：財運 (Wealth)】 =====================
  let wealthScore = 70;
  const wealthStars = [...(wealthPalace.stars || [])];

  if (wealthStars.some((s) => ['武曲', '太陰', '祿存', '天府'].includes(s))) {
    wealthScore += 10;
  }
  if (wealthStars.some((s) => ['廉貞', '貪狼', '太陽'].includes(s))) {
    wealthScore += 5;
  }
  // 煞星留意
  if (wealthStars.some((s) => ['地劫', '地空', '擎羊', '陀羅'].includes(s))) {
    wealthScore -= 7;
  }
  // 四化
  if (wealthPalace.sihua?.includes('化祿')) {
    wealthScore += 10;
  } else if (wealthPalace.sihua?.includes('化權')) {
    wealthScore += 6;
  } else if (wealthPalace.sihua?.includes('化忌')) {
    wealthScore -= 8;
  }
  // 八字五行身強與財星
  if (fiveElements.metal >= 2 || fiveElements.earth >= 2) {
    wealthScore += 4;
  }
  wealthScore = Math.min(95, Math.max(48, wealthScore));

  const wealthLevel =
    wealthScore >= 88 ? '財源豐盈' : wealthScore >= 78 ? '正財穩健' : wealthScore >= 68 ? '宜重守財' : '慎防破耗';
  const wealthHighlight =
    wealthScore >= 80
      ? '正財底盤穩固，利於合約進財與技能變現，建議落實生門佈局'
      : '開銷拉扯較大，宜落實「48小時大筆支出冷靜期」，規避衝動投資';

  // ===================== 【維度三：健康 (Health)】 =====================
  let healthScore = 75;
  // 五行極端度評估 (火過旺或某行缺失)
  const elementValues = Object.values(fiveElements).map((v) => Number(v) || 0);
  const maxEl = Math.max(...elementValues);
  const minEl = Math.min(...elementValues);

  if (maxEl >= 4) {
    healthScore -= 8; // 某行過旺（如火燥或水冷）
  }
  if (minEl === 0) {
    healthScore -= 5; // 某行偏枯
  }
  if (healthPalace.sihua?.includes('化忌')) {
    healthScore -= 8;
  }
  // 2026 丙午火年，若八字火已超過 3，需調候
  if (fiveElements.fire >= 3) {
    healthScore -= 4;
  } else {
    healthScore += 5;
  }
  healthScore = Math.min(94, Math.max(50, healthScore));

  const healthLevel =
    healthScore >= 88 ? '精氣神旺' : healthScore >= 78 ? '身心調和' : healthScore >= 68 ? '宜防疲勞' : '調息蓄元';
  const healthHighlight =
    healthScore >= 80
      ? '五行氣血流暢，副交感神經平穩，保持作息即可維持高度專注'
      : '流年火旺易擾心神與睡眠，建議補充水元素（如深藍佈局/432Hz音樂）降噪';

  // ===================== 【維度四：感情 (Relationships)】 =====================
  let romanceScore = 71;
  const spouseStars = [...(spousePalace.stars || [])];

  if (spouseStars.some((s) => ['天同', '太陰', '天相', '文昌', '文曲', '廉貞'].includes(s))) {
    romanceScore += 8;
  }
  if (spouseStars.some((s) => ['巨門', '七殺', '破軍'].includes(s))) {
    romanceScore -= 4;
  }
  if (spousePalace.sihua?.includes('化祿') || spousePalace.sihua?.includes('化科')) {
    romanceScore += 9;
  }
  if (spousePalace.sihua?.includes('化忌')) {
    romanceScore -= 7;
  }
  // 日支申與流年午的相合度
  if (['未', '巳', '辰', '子'].includes(dayBranch)) {
    romanceScore += 5;
  }
  romanceScore = Math.min(95, Math.max(50, romanceScore));

  const romanceLevel =
    romanceScore >= 88 ? '情意相契' : romanceScore >= 78 ? '和諧平順' : romanceScore >= 68 ? '需多溝通' : '以靜修己';
  const romanceHighlight =
    romanceScore >= 80
      ? '夫妻宮磁場柔和，利於深入情感交流或化解舊有分歧，彼此互為底氣'
      : '情緒中心易受外在壓力波及，親密關係中宜多同理傾聽，少用理性辯駁';

  // ===================== 【維度五：貴人 (Benefactors)】 =====================
  let mentorScore = 74;
  const mentorStars = [...(mentorPalace.stars || []), ...(mingPalace.stars || [])];

  // 天乙貴人檢查
  const guiRenBranches = TIAN_YI_GUI_REN[dayMaster] || ['丑', '未'];
  const allBranches = [baziYear, baziMonth, baziDay, baziHour].map((p) => p.charAt(1));
  const hasTianYi = allBranches.some((b) => guiRenBranches.includes(b));
  if (hasTianYi) {
    mentorScore += 10;
  }

  // 紫微貴人星
  if (mentorStars.some((s) => ['天魁', '天鉞', '左輔', '右弼', '化科'].includes(s))) {
    mentorScore += 9;
  }
  if (mentorPalace.sihua?.includes('化科') || mentorPalace.sihua?.includes('化祿')) {
    mentorScore += 8;
  }
  mentorScore = Math.min(97, Math.max(55, mentorScore));

  const mentorLevel =
    mentorScore >= 88 ? '貴人雲集' : mentorScore >= 78 ? '逢凶化吉' : mentorScore >= 68 ? '平實相挺' : '自立開局';
  const mentorHighlight =
    mentorScore >= 82
      ? '天乙貴人與科星映照，外出或跨界合作易遇前輩指引，宜積極拓展人脈'
      : '人際能量以自力開創為主，與人合作宜白紙黑字明確權責，避免口頭承諾';

  // 總分計算
  const overallScore = Math.round(
    (careerScore * 0.25 + wealthScore * 0.25 + healthScore * 0.15 + romanceScore * 0.15 + mentorScore * 0.2)
  );

  const overallTitle =
    overallScore >= 86
      ? '氣運勃發 · 正道超前'
      : overallScore >= 78
      ? '蓄力躍升 · 順風揚帆'
      : overallScore >= 70
      ? '穩中求進 · 借力借勢'
      : '防守反擊 · 沉潛修內';

  const summary = `命盤當前逢 ${currentYear}年（${liuNianGanZhi}流年），整體能量指數 ${overallScore} 分。事業與財運互為犄角，結合奇門生門佈局與認知節制，可在變動中精準把握增長窗口。`;

  const dimensions: RadarDimensionItem[] = [
    {
      dimension: '事業',
      name: '事業運勢',
      score: careerScore,
      fullMark: 100,
      level: careerLevel,
      highlight: careerHighlight,
      description: `官祿與命宮星曜加權，流年推動力 ${careerScore} 分`,
      tag: '官祿 / 決策力',
      color: '#3b82f6', // blue
    },
    {
      dimension: '財運',
      name: '財富運勢',
      score: wealthScore,
      fullMark: 100,
      level: wealthLevel,
      highlight: wealthHighlight,
      description: `正偏財庫與金水流通度評分 ${wealthScore} 分`,
      tag: '財帛 / 現金流',
      color: '#f59e0b', // amber
    },
    {
      dimension: '健康',
      name: '身心能量',
      score: healthScore,
      fullMark: 100,
      level: healthLevel,
      highlight: healthHighlight,
      description: `五行平衡與自律神經調節 ${healthScore} 分`,
      tag: '疾厄 / 神經調控',
      color: '#10b981', // emerald
    },
    {
      dimension: '感情',
      name: '情感共鳴',
      score: romanceScore,
      fullMark: 100,
      level: romanceLevel,
      highlight: romanceHighlight,
      description: `夫妻宮與日支相合度評分 ${romanceScore} 分`,
      tag: '夫妻 / 親密關係',
      color: '#ec4899', // pink
    },
    {
      dimension: '貴人',
      name: '貴人外緣',
      score: mentorScore,
      fullMark: 100,
      level: mentorLevel,
      highlight: mentorHighlight,
      description: `天乙貴人星與外緣社會支持 ${mentorScore} 分`,
      tag: '遷移 / 人脈資源',
      color: '#8b5cf6', // purple
    },
  ];

  return {
    currentYear,
    liuNianGanZhi,
    overallScore,
    overallTitle,
    summary,
    dimensions,
  };
}
