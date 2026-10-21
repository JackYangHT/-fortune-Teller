export type GenderType = '男' | '女';
export type Gender = 'male' | 'female';
export type CalendarType = 'solar' | 'lunar';
export type RatHourMode = 'auto' | 'early_rat' | 'late_rat';

export interface LocationData {
  country: string;
  region: string;
  city: string;
  longitude: number;
  latitude: number;
  timezone: number;
}

export interface ShichenDetail {
  name: string;
  branch: string;
  pinyin: string;
  timeSpan: string;
  element: string;
  color: string;
  note?: string;
}

export interface SolarTimeCorrection {
  originalTime: string;
  standardMeridian: number;
  longitude: number;
  longitudeDiffMinutes: number;
  equationOfTimeMinutes: number;
  totalOffsetMinutes: number;
  trueSolarTime: string;
  adjustedDate: string;
  shichen: ShichenDetail;
}

export interface ShichenOption {
  key: string;        // 'zi', 'chou', etc.
  label: string;      // '子時 (23-1點)'
  branch: string;     // '子'
  defaultHour: number;// 0 or 23
  range: string;      // '23:00 - 01:00'
  element: string;    // '水'
}

export interface NatalGPS {
  baziYear: string;       // e.g. '甲子'
  baziMonth: string;      // e.g. '庚午'
  baziDay: string;        // e.g. '丙申'
  baziHour: string;       // e.g. '甲午'
  mingPalaceBranch: string; // e.g. '子'
  mingPalaceName: string;   // e.g. '命宮在子'
  majorStars: string[];     // e.g. ['紫微', '七殺']
  majorStarsDisplay: string;// e.g. '紫微七殺'
  elementBureau: string;    // e.g. '木三局'
  currentMajorLimit: string;// e.g. '辰宮 (32-41歲)'
  currentYearLimit: string; // e.g. '流年走午宮'
  cityCoords: {
    cityName: string;
    longitude: number;
    latitude: number;
    timeOffsetMin: number;
  };
}

export interface UserBirthData {
  gender: GenderType;
  birthDate: string; // 'YYYY-MM-DD'
  birthHour: string; // '子時 (23-1點)'
  birthCity: string; // e.g. '台北市'
  deepInfraApiKey?: string; // DeepInfra API Key
  modelName?: string; // e.g. 'deepseek-ai/DeepSeek-V3' or 'deepseek-v4-flash'
  gps: NatalGPS;
  astrologyJSON?: any;
  savedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
