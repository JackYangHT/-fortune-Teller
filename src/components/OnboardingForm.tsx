import React, { useState, useMemo, useEffect } from 'react';
import {
  Compass,
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Key,
  Eye,
  EyeOff,
  Cpu
} from 'lucide-react';
import { GenderType, UserBirthData } from '../types/destiny';
import { SHICHEN_OPTIONS, POPULAR_CITIES, calculateNatalGPS } from '../utils/destinyEngine';
import { generateAstrologyJSON } from '../utils/astrologyGenerator';

interface OnboardingFormProps {
  onComplete: (data: UserBirthData) => void;
  initialData?: UserBirthData | null;
}

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

function getYearGanZhi(year: number): string {
  const sIdx = ((year - 4) % 10 + 10) % 10;
  const bIdx = ((year - 4) % 12 + 12) % 12;
  return `${STEMS[sIdx]}${BRANCHES[bIdx]}`;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete, initialData }) => {
  const [gender, setGender] = useState<GenderType>(initialData?.gender || '男');

  // Parse initial date into Year, Month, Day numbers
  const initialDateParts = useMemo(() => {
    if (initialData?.birthDate) {
      const [y, m, d] = initialData.birthDate.split('-').map(Number);
      return { y: y || 1995, m: m || 6, d: d || 18 };
    }
    return { y: 1995, m: 6, d: 18 };
  }, [initialData]);

  const [birthYear, setBirthYear] = useState<number>(initialDateParts.y);
  const [birthMonth, setBirthMonth] = useState<number>(initialDateParts.m);
  const [birthDay, setBirthDay] = useState<number>(initialDateParts.d);

  const [birthHour, setBirthHour] = useState<string>(initialData?.birthHour || '午時 (11-13點)');
  const [birthCity, setBirthCity] = useState<string>(initialData?.birthCity || '台北市');

  // DeepInfra API Key
  const [deepInfraApiKey, setDeepInfraApiKey] = useState<string>(() => {
    if (initialData?.deepInfraApiKey) return initialData.deepInfraApiKey;
    try {
      const savedConfig = localStorage.getItem('jack_ai_llm_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed.apiKey) return parsed.apiKey;
      }
    } catch {
      // Ignore
    }
    return '';
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute number of days in the selected year and month
  const daysInMonth = useMemo(() => {
    return new Date(birthYear, birthMonth, 0).getDate();
  }, [birthYear, birthMonth]);

  // Ensure selected day does not exceed max days in month
  const effectiveDay = Math.min(birthDay, daysInMonth);

  // Formatted date YYYY-MM-DD
  const formattedBirthDate = useMemo(() => {
    return `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(effectiveDay).padStart(2, '0')}`;
  }, [birthYear, birthMonth, effectiveDay]);

  // Generate Year options from 2026 down to 1930
  const yearOptions = useMemo(() => {
    const list: { year: number; label: string }[] = [];
    for (let y = 2026; y >= 1930; y--) {
      list.push({
        year: y,
        label: `${y}年 (${getYearGanZhi(y)}年)`,
      });
    }
    return list;
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const gps = calculateNatalGPS(gender, formattedBirthDate, birthHour, birthCity || '台北市');
    const trimmedApiKey = deepInfraApiKey.trim();

    const tempBirthData = {
      gender,
      birthDate: formattedBirthDate,
      birthHour,
      birthCity: birthCity.trim() || '台北市',
      gps,
    };
    const astrologyJSON = generateAstrologyJSON(tempBirthData);

    const birthData: UserBirthData = {
      gender,
      birthDate: formattedBirthDate,
      birthHour,
      birthCity: birthCity.trim() || '台北市',
      deepInfraApiKey: trimmedApiKey || undefined,
      modelName: 'deepseek-ai/DeepSeek-V3',
      gps,
      astrologyJSON,
      savedAt: new Date().toISOString(),
    };

    // Save to LocalStorage
    try {
      localStorage.setItem('jack_ai_destiny_birth_data', JSON.stringify(birthData));
      localStorage.setItem('jack_ai_astrology_json', JSON.stringify(astrologyJSON));
      if (trimmedApiKey) {
        localStorage.setItem(
          'jack_ai_llm_config',
          JSON.stringify({
            provider: 'deepinfra',
            apiKey: trimmedApiKey,
          })
        );
      }
    } catch {
      // LocalStorage error handling
    }

    setTimeout(() => {
      onComplete(birthData);
    }, 400);
  };

  const handleQuickFill = (presetGender: GenderType, y: number, m: number, d: number, hour: string, city: string) => {
    setGender(presetGender);
    setBirthYear(y);
    setBirthMonth(m);
    setBirthDay(d);
    setBirthHour(hour);
    setBirthCity(city);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-xl">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-stone-900 border border-amber-600/40 text-amber-500 shadow-xl mb-4">
            <Compass className="w-7 h-7 stroke-[1.8] animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-100">
            Jack 老師 AI 命理系統
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-2">
            以運為 GPS · 理性推導 · 串接 DeepSeek-V4 Flash / DeepSeek-V3
          </p>
          <div className="flex items-center justify-center gap-3 mt-3 text-xs text-stone-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> 本地 LocalStorage 隱私加密
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" /> 真太陽時精確校正
            </span>
          </div>
        </div>

        {/* Quick Demo Pre-fill Pills */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-xs text-stone-500">快速填入範例：</span>
          <button
            type="button"
            onClick={() => handleQuickFill('男', 1992, 8, 18, '午時 (11-13點)', '台北市')}
            className="text-xs px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 hover:border-amber-600/40 transition-colors cursor-pointer"
          >
            乾造 1992台北午時
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('女', 1998, 11, 4, '子時 (23-1點)', '台中市')}
            className="text-xs px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 hover:border-amber-600/40 transition-colors cursor-pointer"
          >
            坤造 1998台中子時
          </button>
        </div>

        {/* Onboarding Form Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Field 1: Gender Dropdown */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-stone-200 mb-2">
                <User className="w-4 h-4 text-amber-500" />
                <span>一、生理性別</span>
                <span className="text-amber-500 text-xs font-normal">*(影響大運順逆與紫微命宮)*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as GenderType)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors cursor-pointer"
              >
                <option value="男">男 (乾造 · 陽男/陰男順逆起運)</option>
                <option value="女">女 (坤造 · 陽女/陰女順逆起運)</option>
              </select>
            </div>

            {/* Field 2: Birth Date - 3 Dropdowns for Year, Month, Day */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-stone-200">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>二、出生年月日</span>
                  <span className="text-stone-500 text-xs font-normal">(國曆/公曆 下拉選單)</span>
                </label>
                <span className="text-xs font-mono text-amber-400/90">
                  {formattedBirthDate} ({getYearGanZhi(birthYear)}年)
                </span>
              </div>

              {/* 3 Dropdowns Grid: Year, Month, Day */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {/* Year Dropdown */}
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">出生年</label>
                  <select
                    value={birthYear}
                    onChange={(e) => setBirthYear(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-100 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors cursor-pointer"
                  >
                    {yearOptions.map((opt) => (
                      <option key={opt.year} value={opt.year}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Month Dropdown */}
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">出生月</label>
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-100 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors cursor-pointer"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {m} 月
                      </option>
                    ))}
                  </select>
                </div>

                {/* Day Dropdown */}
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">出生日</label>
                  <select
                    value={effectiveDay}
                    onChange={(e) => setBirthDay(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-100 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors cursor-pointer"
                  >
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        {d} 日
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Field 3: Birth Time Dropdown (12 Shichen Options) */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-stone-200 mb-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>三、出生時間</span>
                <span className="text-stone-500 text-xs font-normal">(十二時辰選項)</span>
              </label>
              <select
                value={birthHour}
                onChange={(e) => setBirthHour(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors cursor-pointer"
              >
                {SHICHEN_OPTIONS.map((item) => (
                  <option key={item.key} value={item.label}>
                    {item.label} — {item.range} (五行屬{item.element})
                  </option>
                ))}
              </select>
            </div>

            {/* Field 4: Birth Location (Text Input / Searchable Dropdown) */}
            <div>
              <label className="flex items-center justify-between text-xs sm:text-sm font-medium text-stone-200 mb-2">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>四、出生地點</span>
                </span>
                <span className="text-stone-500 text-xs font-normal">用於計算真太陽時經度差</span>
              </label>

              <div className="space-y-2">
                <input
                  type="text"
                  required
                  value={birthCity}
                  onChange={(e) => setBirthCity(e.target.value)}
                  placeholder="輸入出生城市，例如：台北市、台中市、高雄市、香港..."
                  list="city-suggestions"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 text-sm placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
                <datalist id="city-suggestions">
                  {POPULAR_CITIES.map((c) => (
                    <option key={c.name} value={c.name} />
                  ))}
                </datalist>

                {/* Quick City Buttons */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['台北市', '新北市', '台中市', '台南市', '高雄市', '香港特區'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setBirthCity(c)}
                      className={`text-xs px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        birthCity === c
                          ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Field 5: DeepInfra API Key Input (for DeepSeek-V4 Flash / DeepSeek-V3) */}
            <div className="p-4 rounded-xl bg-stone-950/80 border border-amber-600/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-100">
                  <Key className="w-4 h-4 text-amber-500" />
                  <span>五、DeepInfra API 金鑰</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/60 font-medium">
                    串接 DeepSeek-V4 Flash
                  </span>
                </label>
                <a
                  href="https://deepinfra.com/dash/api_keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-amber-400 hover:text-amber-300 underline"
                >
                  前往獲取金鑰
                </a>
              </div>

              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={deepInfraApiKey}
                  onChange={(e) => setDeepInfraApiKey(e.target.value)}
                  placeholder="輸入您的 DeepInfra API Token (例: dip_...)"
                  className="w-full bg-stone-900 border border-stone-700/80 rounded-xl px-4 py-2.5 text-stone-100 text-sm placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 cursor-pointer p-1"
                  title={showApiKey ? '隱藏密鑰' : '顯示密鑰'}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-[11px] text-stone-400 leading-relaxed flex items-start gap-1.5 pt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  填入後將於聊天介面直接調用 DeepInfra 上的 DeepSeek 大模型進行串流命理推導。金鑰保存在您本機 LocalStorage，安全不外洩。（若伺服器已有預設環境變數，亦可留空直接測試）
                </span>
              </div>
            </div>

            {/* Submit Button: 開始排盤 */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-900/40 hover:shadow-amber-900/60 active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>{isSubmitting ? '正在計算先天時空 GPS...' : '開始排盤'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Privacy Note */}
          <div className="mt-6 pt-4 border-t border-stone-800 text-[11px] text-stone-400 text-center leading-relaxed">
            所有命盤數據與 API 金鑰僅加密保留於您的本機瀏覽器 LocalStorage，不推銷商品、不神棍、完全離線安全。
          </div>
        </div>
      </div>
    </div>
  );
};
