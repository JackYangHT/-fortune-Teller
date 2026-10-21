import { ShichenOption, UserBirthData, NatalGPS, GenderType } from '../types/destiny';

export const SHICHEN_OPTIONS: ShichenOption[] = [
  { key: 'zi', label: '子時 (23-1點)', branch: '子', defaultHour: 0, range: '23:00 - 01:00', element: '水' },
  { key: 'chou', label: '丑時 (1-3點)', branch: '丑', defaultHour: 2, range: '01:00 - 03:00', element: '土' },
  { key: 'yin', label: '寅時 (3-5點)', branch: '寅', defaultHour: 4, range: '03:00 - 05:00', element: '木' },
  { key: 'mao', label: '卯時 (5-7點)', branch: '卯', defaultHour: 6, range: '05:00 - 07:00', element: '木' },
  { key: 'chen', label: '辰時 (7-9點)', branch: '辰', defaultHour: 8, range: '07:00 - 09:00', element: '土' },
  { key: 'si', label: '巳時 (9-11點)', branch: '巳', defaultHour: 10, range: '09:00 - 11:00', element: '火' },
  { key: 'wu', label: '午時 (11-13點)', branch: '午', defaultHour: 12, range: '11:00 - 13:00', element: '火' },
  { key: 'wei', label: '未時 (13-15點)', branch: '未', defaultHour: 14, range: '13:00 - 15:00', element: '土' },
  { key: 'shen', label: '申時 (15-17點)', branch: '申', defaultHour: 16, range: '15:00 - 17:00', element: '金' },
  { key: 'you', label: '酉時 (17-19點)', branch: '酉', defaultHour: 18, range: '17:00 - 19:00', element: '金' },
  { key: 'xu', label: '戌時 (19-21點)', branch: '戌', defaultHour: 20, range: '19:00 - 21:00', element: '土' },
  { key: 'hai', label: '亥時 (21-23點)', branch: '亥', defaultHour: 22, range: '21:00 - 23:00', element: '水' },
];

export const POPULAR_CITIES = [
  { name: '台北市', longitude: 121.5654, latitude: 25.0330 },
  { name: '新北市', longitude: 121.4657, latitude: 25.0123 },
  { name: '台中市', longitude: 120.6736, latitude: 24.1477 },
  { name: '台南市', longitude: 120.2270, latitude: 22.9997 },
  { name: '高雄市', longitude: 120.3120, latitude: 22.6163 },
  { name: '桃園市', longitude: 121.3013, latitude: 24.9937 },
  { name: '新竹市', longitude: 120.9688, latitude: 24.8039 },
  { name: '基隆市', longitude: 121.7462, latitude: 25.1325 },
  { name: '彰化縣', longitude: 120.5441, latitude: 24.0754 },
  { name: '嘉義市', longitude: 120.4473, latitude: 23.4800 },
  { name: '屏東縣', longitude: 120.4862, latitude: 22.6761 },
  { name: '宜蘭縣', longitude: 121.7565, latitude: 24.7570 },
  { name: '花蓮縣', longitude: 121.6067, latitude: 23.9912 },
  { name: '香港特區', longitude: 114.1694, latitude: 22.3193 },
  { name: '澳門特區', longitude: 113.5439, latitude: 22.1987 },
  { name: '新加坡', longitude: 103.8198, latitude: 1.3521 },
  { name: '上海市', longitude: 121.4737, latitude: 31.2304 },
  { name: '北京市', longitude: 116.4074, latitude: 39.9042 },
];

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const ZIWEI_MAJOR_STAR_COMBOS = [
  ['紫微', '天府'],
  ['紫微', '七殺'],
  ['紫微', '破軍'],
  ['太陽', '巨門'],
  ['武曲', '天府'],
  ['天機', '太陰'],
  ['廉貞', '貪狼'],
  ['天同', '巨門'],
  ['七殺', '廉貞'],
  ['破軍', '武曲'],
  ['紫微', '天相'],
  ['天梁', '太陽'],
];

const ELEMENT_BUREAUS = ['水二局', '木三局', '金四局', '土五局', '火六局'];

export function resolveCityCoordinates(cityName: string) {
  const clean = cityName.trim();
  const matched = POPULAR_CITIES.find(
    (c) => clean.includes(c.name) || c.name.includes(clean)
  );
  if (matched) {
    return matched;
  }
  // Default Taiwan longitude
  return {
    name: clean || '台北市',
    longitude: 121.56,
    latitude: 25.03,
  };
}

export function calculateNatalGPS(
  gender: GenderType,
  birthDate: string,
  birthHourLabel: string,
  birthCity: string
): NatalGPS {
  const [yearStr, monthStr, dayStr] = birthDate.split('-');
  const year = parseInt(yearStr, 10) || 1995;
  const month = parseInt(monthStr, 10) || 6;
  const day = parseInt(dayStr, 10) || 15;

  const shichen = SHICHEN_OPTIONS.find((s) => s.label === birthHourLabel) || SHICHEN_OPTIONS[6];
  const cityInfo = resolveCityCoordinates(birthCity);

  // Solar time difference (120 deg meridian standard for UTC+8)
  const timeOffsetMin = Math.round((cityInfo.longitude - 120) * 4);

  // Year Pillar calculation
  const yearStemIdx = (year - 4) % 10;
  const yearBranchIdx = (year - 4) % 12;
  const baziYear = `${HEAVENLY_STEMS[(yearStemIdx + 10) % 10]}${EARTHLY_BRANCHES[(yearBranchIdx + 12) % 12]}`;

  // Month Pillar approximation
  const monthBranchIdx = (month + 1) % 12;
  const monthStemIdx = (yearStemIdx * 2 + month) % 10;
  const baziMonth = `${HEAVENLY_STEMS[(monthStemIdx + 10) % 10]}${EARTHLY_BRANCHES[(monthBranchIdx + 12) % 12]}`;

  // Day Pillar approximation
  const dayStemIdx = (year * 5 + Math.floor(year / 4) + day + month * 2) % 10;
  const dayBranchIdx = (dayStemIdx + day) % 12;
  const baziDay = `${HEAVENLY_STEMS[(dayStemIdx + 10) % 10]}${EARTHLY_BRANCHES[(dayBranchIdx + 12) % 12]}`;

  // Hour Pillar (五鼠遁日起時)
  const hourBranchIdx = EARTHLY_BRANCHES.indexOf(shichen.branch);
  const hourStemIdx = (dayStemIdx * 2 + hourBranchIdx) % 10;
  const baziHour = `${HEAVENLY_STEMS[(hourStemIdx + 10) % 10]}${shichen.branch}`;

  // Zi Wei Dou Shu Ming Palace formula:
  // 寅宮起正月順數至生月，再從生月宮逆數至生時
  // (Month - Hour + 2) mod 12
  const mingIdx = ((month - 1) - hourBranchIdx + 2 + 12 * 2) % 12;
  const mingPalaceBranch = EARTHLY_BRANCHES[mingIdx];
  const mingPalaceName = `命宮在${mingPalaceBranch}`;

  // Five Element Bureau calculation
  const bureauIdx = (yearStemIdx + mingIdx) % ELEMENT_BUREAUS.length;
  const elementBureau = ELEMENT_BUREAUS[Math.abs(bureauIdx)];

  // Stars combination in Ming Palace
  const starCombo = ZIWEI_MAJOR_STAR_COMBOS[(mingIdx + yearStemIdx) % ZIWEI_MAJOR_STAR_COMBOS.length];

  // Current Age & Major limit
  const currentYear = 2026;
  const age = Math.max(1, currentYear - year + 1);
  const limitStartAge = Math.floor(age / 10) * 10 + 2;
  const limitEndAge = limitStartAge + 9;
  const limitBranchIdx = (mingIdx + Math.floor(age / 10)) % 12;
  const currentMajorLimit = `${EARTHLY_BRANCHES[limitBranchIdx]}宮 (${limitStartAge}-${limitEndAge}歲)`;
  const currentYearLimit = `流年走${EARTHLY_BRANCHES[(currentYear - 4) % 12]}宮`;

  return {
    baziYear,
    baziMonth,
    baziDay,
    baziHour,
    mingPalaceBranch,
    mingPalaceName,
    majorStars: starCombo,
    majorStarsDisplay: starCombo.join(''),
    elementBureau,
    currentMajorLimit,
    currentYearLimit,
    cityCoords: {
      cityName: cityInfo.name,
      longitude: cityInfo.longitude,
      latitude: cityInfo.latitude,
      timeOffsetMin,
    },
  };
}

export function generateJackResponse(userMessage: string, data: UserBirthData): string {
  const { gender, gps, birthCity, birthDate } = data;
  const text = userMessage.trim().toLowerCase();

  // Age estimation
  const birthYear = parseInt(birthDate.split('-')[0], 10) || 1995;
  const age = 2026 - birthYear + 1;

  // Emotion/Topic Branching
  const isFinance = text.includes('錢') || text.includes('財') || text.includes('卡卡') || text.includes('薪資') || text.includes('投資') || text.includes('負債');
  const isLove = text.includes('情') || text.includes('愛') || text.includes('累') || text.includes('婚') || text.includes('伴侶') || text.includes('桃花') || text.includes('分手');
  const isCareer = text.includes('工作') || text.includes('換') || text.includes('職') || text.includes('衝') || text.includes('壓力') || text.includes('升遷') || text.includes('主管') || text.includes('創業');
  const isHealth = text.includes('心神') || text.includes('睡') || text.includes('病') || text.includes('健康') || text.includes('焦慮');

  if (isFinance) {
    return `💰 **直接看你的財帛宮位與現金流**

我調出你的盤了。
你是${gender === '男' ? '乾造' : '坤造'}，${gps.baziYear}年生，目前走${gps.currentMajorLimit}。
命宮在${gps.mingPalaceBranch}，坐【${gps.majorStarsDisplay}】。

盤面很誠實：
你現在不是「賺不到錢」，而是「進來的留不住」。
大限引動財帛化忌，現金流在周轉時會有阻滯感。

🧭 **Jack 老師的定位建議：**

1. **守住基本盤，停下衝動投資**
目前流年氣場震盪，千萬別碰高槓桿、不熟悉的合夥。

2. **區分正財與偏財**
你的正財星位穩健，靠專業技能累積不會倒。
卡住的往往是「過度預支」或「替別人扛了爛攤子」。

3. **五感微調**
在辦公桌西北方擺放一杯靜態水或深色岩石。
把注意力拉回每週結算，下半月能量會逐步平穩。

把過去三個月最大的那筆非必要支出寫下來，
我們來看這條資金鏈是哪裡在漏水。`;
  }

  if (isLove) {
    return `❤️ **感情上的內耗，來自本命夫妻宮與當前氣數的拉扯**

我看你的八字四柱【${gps.baziDay}】日柱，配上紫微【${gps.majorStarsDisplay}】。
你骨子裡其實很硬、很有責任感，
但一碰到在意的人，就容易把對方的問題往自己身上扛。

💔 **盤面顯現的真實瓶頸：**

你最近累，不是因為不愛了。
而是「溝通成本過高」，彼此都在猜、都在等對方先軟化。
加上目前大限交界，感情宮位逢煞星微衝，
哪怕只是一句日常瑣事，聽起來都像挑釁。

🧭 **破解內耗的 GPS 方位：**

1. **先給自己三天物理斷聯或心理降溫**
不要在深夜 23 點後（子時氣場混濁時）討論嚴肅的未來承諾。

2. **認清「正緣」與「爛桃花」的界線**
正緣是讓你安心做自己，而不是讓你天天像在參加面試。

3. **空間換氣**
換掉臥室床頭暖光過強的燈泡，保持通風。
把精力收回 30% 放到自己身上。

你現在心裡最卡、最放不下的，是哪一句話或哪個決定？`;
  }

  if (isCareer) {
    return `💼 **想換工作？先看你是「被動逃避」還是「順勢借風」**

你是【${gps.majorStarsDisplay}】坐命，骨子裡本來就不是甘於平庸的人。
今年走【${gps.currentYearLimit}】，事業宮氣流確實出現強烈位移信號。

⚡ **看盤說實話：**

你現在感受到的工作壓力，
很多來自「付出與反饋不成正比」，還有主管的決策混亂。
但你千萬不要在情緒最高點時「裸辭」。

🧭 **Jack 老師的換職佈局節奏：**

1. **不要賭氣離職，要帶走資源**
盤中顯示你的貴人星隱伏在專業同業，而不是直屬長官。
私下盤點人脈與作品集，履歷在白天巳時（9-11點）投遞最佳。

2. **時機點在轉季**
目前的波動是前哨戰，真正適合落地新職位的窗口在立秋前後。
現在換，只是換一個地方受一樣的氣。

3. **行動指標**
如果新機會能滿足「專業技能升級」與「自主權提升」，那就衝；
如果只是薪水多三千但雜事多三倍，先按兵不動。

你目前這份工作，最讓你忍無可忍的點是什麼？`;
  }

  if (isHealth) {
    return `🌙 **心神不寧？這是大限宮位氣場與流日微觀的交匯**

從你的真太陽時校正來看：
你生於${birthCity}，受天干地支五行【${gps.elementBureau}】引動。
最近你的火土能量有微旺失衡的現象，
反應在身心上，就是入睡難、多夢、莫名心慌。

🌿 **五感與身心定位對策：**

1. **晚上 11 點（子時前）務必放下螢幕**
子時是一陽初生之際，此時如果還在滑手機，神魂無法歸藏。

2. **食療與頻率**
這週多喝溫熱無糖黑豆水或蓮子湯（瀉心火、安神魂）。
工作間隙播放 432Hz 或 528Hz 療癒音頻。

3. **放下對不可控事項的執念**
命盤是客觀的地圖，路是用你的雙腳走出來的。
焦慮不會改變明天，只會透支今天的能量。

你通常都在幾點開始覺得特別煩躁？我們來對焦具體時辰。`;
  }

  // General/Conversational default grounded in User's GPS
  return `🧭 **我是 Jack 老師。收到你的生辰與問題。**

已為你校對好時空盤：
- 命主：${gender === '男' ? '乾造' : '坤造'} · 生於 ${birthCity}
- 四柱核心：${gps.baziYear}年 ${gps.baziMonth}月 ${gps.baziDay}日 ${gps.baziHour}時
- 紫微斗數：${gps.mingPalaceName} · 坐【${gps.majorStarsDisplay}】
- 大限走勢：${gps.currentMajorLimit}

我不講宿命論，命理是人生的 GPS。
既然地圖已經展開，我們就一事一問、直切核心。

⚡ **針對你提的這件事：**

「${userMessage}」

盤上顯示你近期的氣場正在轉彎，
表面的困擾往往只是結果，真正的原因卡在前段時間的某個決策慣性。

💬 **請告訴我：**
這件事是剛剛發生的，還是已經困擾你超過三個月了？
我們把因果鏈條理清楚，我直接給你下一步的行動清單。`;
}
