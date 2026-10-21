import { LocationData, RatHourMode, ShichenDetail, SolarTimeCorrection } from '../types/destiny';

export const SHICHEN_TABLE: ShichenDetail[] = [
  { name: '早子時', branch: '子', pinyin: 'Zi (Early)', timeSpan: '00:00 - 01:00', element: '水', color: '#38bdf8', note: '日初陽生，萬物萌動' },
  { name: '丑時', branch: '丑', pinyin: 'Chou', timeSpan: '01:00 - 03:00', element: '土', color: '#fbbf24', note: '雞鳴將曉，萬籟潛息' },
  { name: '寅時', branch: '寅', pinyin: 'Yin', timeSpan: '03:00 - 05:00', element: '木', color: '#4ade80', note: '平旦晨曦，陽氣升騰' },
  { name: '卯時', branch: '卯', pinyin: 'Mao', timeSpan: '05:00 - 07:00', element: '木', color: '#22c55e', note: '日出東方，破曉曙光' },
  { name: '辰時', branch: '辰', pinyin: 'Chen', timeSpan: '07:00 - 09:00', element: '土', color: '#f59e0b', note: '食時朝食，群龍得雲' },
  { name: '巳時', branch: '巳', pinyin: 'Si', timeSpan: '09:00 - 11:00', element: '火', color: '#f97316', note: '隅中日盛，草木繁茂' },
  { name: '午時', branch: '午', pinyin: 'Wu', timeSpan: '11:00 - 13:00', element: '火', color: '#ef4444', note: '日正當中，陽極陰生' },
  { name: '未時', branch: '未', pinyin: 'Wei', timeSpan: '13:00 - 15:00', element: '土', color: '#d97706', note: '日昳陽斂，五味調和' },
  { name: '申時', branch: '申', pinyin: 'Shen', timeSpan: '15:00 - 17:00', element: '金', color: '#e2e8f0', note: '晡時夕照，剛健有節' },
  { name: '酉時', branch: '酉', pinyin: 'You', timeSpan: '17:00 - 19:00', element: '金', color: '#cbd5e1', note: '日落西山，歸宿凝定' },
  { name: '戌時', branch: '戌', pinyin: 'Xu', timeSpan: '19:00 - 21:00', element: '土', color: '#b45309', note: '黃昏入夜，守護安寧' },
  { name: '亥時', branch: '亥', pinyin: 'Hai', timeSpan: '21:00 - 23:00', element: '水', color: '#0ea5e9', note: '人定夜深，歸藏蓄積' },
  { name: '夜子時', branch: '子', pinyin: 'Zi (Late)', timeSpan: '23:00 - 24:00', element: '水', color: '#0284c7', note: '一陽初生，夜深接日' },
];

/**
 * Calculates day of year from date string (YYYY-MM-DD)
 */
function getDayOfYear(dateStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const diffTime = date.getTime() - startOfYear.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Computes Equation of Time (EoT) in minutes using standard solar approximation
 * EoT = 9.87 * sin(2B) - 7.53 * cos(B) - 1.5 * sin(B)
 * where B = 360/365 * (d - 81) in degrees
 */
export function calculateEquationOfTime(dateStr: string): number {
  const d = getDayOfYear(dateStr);
  const bDegrees = (360 / 365.25) * (d - 81);
  const bRadians = (bDegrees * Math.PI) / 180;
  const eot = 9.87 * Math.sin(2 * bRadians) - 7.53 * Math.cos(bRadians) - 1.5 * Math.sin(bRadians);
  return parseFloat(eot.toFixed(2));
}

/**
 * Identifies Shichen branch given hours and minutes (0.0 to 24.0)
 */
export function getShichenFromSolarDecimal(decimalHour: number, ratMode: RatHourMode = 'auto'): ShichenDetail {
  let normalizedHour = decimalHour;
  while (normalizedHour < 0) normalizedHour += 24;
  while (normalizedHour >= 24) normalizedHour -= 24;

  if (normalizedHour >= 23) {
    return SHICHEN_TABLE[12]; // 夜子時
  } else if (normalizedHour < 1) {
    return SHICHEN_TABLE[0]; // 早子時
  } else if (normalizedHour < 3) {
    return SHICHEN_TABLE[1]; // 丑時
  } else if (normalizedHour < 5) {
    return SHICHEN_TABLE[2]; // 寅時
  } else if (normalizedHour < 7) {
    return SHICHEN_TABLE[3]; // 卯時
  } else if (normalizedHour < 9) {
    return SHICHEN_TABLE[4]; // 辰時
  } else if (normalizedHour < 11) {
    return SHICHEN_TABLE[5]; // 巳時
  } else if (normalizedHour < 13) {
    return SHICHEN_TABLE[6]; // 午時
  } else if (normalizedHour < 15) {
    return SHICHEN_TABLE[7]; // 未時
  } else if (normalizedHour < 17) {
    return SHICHEN_TABLE[8]; // 申時
  } else if (normalizedHour < 19) {
    return SHICHEN_TABLE[9]; // 酉時
  } else if (normalizedHour < 21) {
    return SHICHEN_TABLE[10]; // 戌時
  } else {
    return SHICHEN_TABLE[11]; // 亥時
  }
}

/**
 * Computes full True Solar Time correction
 */
export function computeSolarTimeCorrection(
  dateStr: string,
  timeStr: string,
  location: LocationData,
  ratMode: RatHourMode = 'auto'
): SolarTimeCorrection {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const standardMeridian = location.timezone * 15; // 15 degrees per timezone hour
  
  // 1. Longitude time difference: (Local Longitude - Standard Meridian) * 4 minutes
  const longitudeDiffMinutes = (location.longitude - standardMeridian) * 4;
  
  // 2. Equation of time difference (Earth orbital eccentricity & axial tilt)
  const equationOfTimeMinutes = calculateEquationOfTime(dateStr);

  // 3. Total adjustment
  const totalOffsetMinutes = longitudeDiffMinutes + equationOfTimeMinutes;

  // 4. Adjust original minutes
  const originalTotalMinutes = hours * 60 + minutes;
  let trueTotalMinutes = originalTotalMinutes + totalOffsetMinutes;

  let dayOffset = 0;
  if (trueTotalMinutes < 0) {
    trueTotalMinutes += 24 * 60;
    dayOffset = -1;
  } else if (trueTotalMinutes >= 24 * 60) {
    trueTotalMinutes -= 24 * 60;
    dayOffset = 1;
  }

  const trueHour = Math.floor(trueTotalMinutes / 60);
  const trueMin = Math.round(trueTotalMinutes % 60);
  const trueSolarTime = `${String(trueHour).padStart(2, '0')}:${String(trueMin).padStart(2, '0')}`;

  // Date rollover if needed
  let adjustedDate = dateStr;
  if (dayOffset !== 0) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + dayOffset);
    adjustedDate = d.toISOString().split('T')[0];
  }

  const decimalHour = trueTotalMinutes / 60;
  const shichen = getShichenFromSolarDecimal(decimalHour, ratMode);

  return {
    originalTime: timeStr,
    standardMeridian,
    longitude: location.longitude,
    longitudeDiffMinutes: parseFloat(longitudeDiffMinutes.toFixed(2)),
    equationOfTimeMinutes: parseFloat(equationOfTimeMinutes.toFixed(2)),
    totalOffsetMinutes: parseFloat(totalOffsetMinutes.toFixed(2)),
    trueSolarTime,
    adjustedDate,
    shichen,
  };
}
