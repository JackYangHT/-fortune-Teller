import React, { useState } from 'react';
import {
  X,
  Compass,
  Sparkles,
  BarChart3,
  Calendar,
  Clock,
  MapPin,
  RotateCcw,
  Key,
  Trash2,
  Bell,
  BellRing,
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Check,
  Layers,
  HelpCircle,
  Table2,
} from 'lucide-react';
import { UserBirthData } from '../types/destiny';
import { DailyTrendData } from '../utils/dailyTrendEngine';
import { DailyNotificationConfig } from '../services/dailyNotificationService';
import { DestinyRadarVisualizer } from './DestinyRadarVisualizer';

interface DestinyInfoMenuProps {
  isOpen: boolean;
  onClose: () => void;
  birthData: UserBirthData;
  onEditBirthData: () => void;
  dailyTrendData: DailyTrendData;
  notifConfig: DailyNotificationConfig;
  onOpenDailyTrendModal: () => void;
  onOpenApiSettings: () => void;
  onClearChat: () => void;
  onSelectPrompt: (prompt: string) => void;
  onOpenBaziSidebar?: () => void;
  llmProvider: 'gemini' | 'deepinfra';
  currentLanguage?: 'zh-TW' | 'th-TH';
  onSelectLanguage?: (lang: 'zh-TW' | 'th-TH') => void;
}

export const DestinyInfoMenu: React.FC<DestinyInfoMenuProps> = ({
  isOpen,
  onClose,
  birthData,
  onEditBirthData,
  dailyTrendData,
  notifConfig,
  onOpenDailyTrendModal,
  onOpenApiSettings,
  onClearChat,
  onSelectPrompt,
  onOpenBaziSidebar,
  llmProvider,
  currentLanguage = 'zh-TW',
  onSelectLanguage,
}) => {
  const [activeTab, setActiveTab] = useState<'radar' | 'gps' | 'daily' | 'settings'>('radar');

  if (!isOpen) return null;

  const isPushActive = notifConfig.permission === 'granted' && notifConfig.enabled;

  const handleAskPromptAndClose = (prompt: string) => {
    onSelectPrompt(prompt);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Sliding Drawer Container */}
      <div className="w-full max-w-2xl bg-stone-900 border-l border-stone-800 h-full flex flex-col shadow-2xl overflow-hidden animate-slideLeft">
        {/* Drawer Header */}
        <div className="p-4 sm:px-6 border-b border-stone-800 bg-stone-900/95 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-100 flex items-center gap-2">
                <span>命盤與命理資訊選單</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-300 font-normal">
                  {birthData.gender === '男' ? '乾造' : '坤造'} · {birthData.gps.baziYear}
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                收合於選單中，隨時查閱雷達、先天時空盤與流日指針
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 flex items-center justify-center transition-colors cursor-pointer"
            title="關閉選單 (回到純淨對話介面)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 bg-stone-950/60 px-4 sm:px-6 gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('radar')}
            className={`py-3 px-3.5 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'radar'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>五維運勢雷達</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gps')}
            className={`py-3 px-3.5 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'gps'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>先天 GPS 與八字</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className={`py-3 px-3.5 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'daily'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>今日流日趨勢</span>
            {isPushActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3.5 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>系統與設定</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 touch-scroll">
          {/* TAB 1: RADAR CHART */}
          {activeTab === 'radar' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>五維命理雷達視覺化</strong>：依據您的八字原局與當前 2026 丙午流年運勢，計算『事業、財運、健康、感情、貴人』五大維度。點擊雷達圖右側的提問按鈕，將自動關閉選單並由 Jack 老師為您深度推算！
                </div>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950/60 overflow-hidden shadow-lg">
                <DestinyRadarVisualizer
                  birthData={birthData}
                  defaultExpanded={true}
                  onSelectPrompt={handleAskPromptAndClose}
                />
              </div>
            </div>
          )}

          {/* TAB 2: NATAL GPS & BAZI */}
          {activeTab === 'gps' && (
            <div className="space-y-5">
              {/* User Birth Info Card */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800/80">
                  <span className="text-xs font-medium text-stone-400">命主生辰原局</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEditBirthData();
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重新排盤 / 修改生辰</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800">
                    <span className="text-stone-500 block text-[11px] mb-0.5">性別造化</span>
                    <span className="font-semibold text-amber-400">
                      {birthData.gender === '男' ? '乾造 (男命)' : '坤造 (女命)'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800">
                    <span className="text-stone-500 block text-[11px] mb-0.5">出生公曆日期</span>
                    <span className="font-semibold text-stone-200">
                      {birthData.birthDate}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800">
                    <span className="text-stone-500 block text-[11px] mb-0.5">出生時辰</span>
                    <span className="font-semibold text-stone-200">
                      {birthData.birthHour}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800">
                    <span className="text-stone-500 block text-[11px] mb-0.5">真太陽時校準</span>
                    <span className="font-semibold text-stone-300">
                      {birthData.birthCity} ({birthData.gps.cityCoords.timeOffsetMin >= 0 ? '+' : ''}{birthData.gps.cityCoords.timeOffsetMin}分)
                    </span>
                  </div>
                </div>
              </div>

              {/* Natal GPS Pillars & Palace */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <span className="text-xs font-medium text-stone-400 block">四柱八字與紫微時空盤</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40">
                    <span className="text-[10px] text-amber-400/80 block mb-1">年柱 (根基)</span>
                    <span className="text-base font-mono font-bold text-amber-300">{birthData.gps.baziYear}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40">
                    <span className="text-[10px] text-amber-400/80 block mb-1">月柱 (提綱)</span>
                    <span className="text-base font-mono font-bold text-amber-300">{birthData.gps.baziMonth}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40">
                    <span className="text-[10px] text-amber-400/80 block mb-1">日柱 (日元命主)</span>
                    <span className="text-base font-mono font-bold text-amber-300">{birthData.gps.baziDay}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40">
                    <span className="text-[10px] text-amber-400/80 block mb-1">時柱 (歸宿)</span>
                    <span className="text-base font-mono font-bold text-amber-300">{birthData.gps.baziHour}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-stone-400 block text-[11px] mb-1">紫微命宮與坐守主星</span>
                    <span className="text-sm font-semibold text-amber-400">
                      {birthData.gps.mingPalaceName} · 【{birthData.gps.majorStarsDisplay}】
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-stone-400 block text-[11px] mb-1">當前大限與流年時空</span>
                    <span className="text-sm font-semibold text-stone-200">
                      大限：{birthData.gps.currentMajorLimit} · 2026 丙午流年
                    </span>
                  </div>
                </div>

                {/* Open BaZi Sidebar shortcut */}
                {onOpenBaziSidebar && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenBaziSidebar();
                      onClose();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 hover:border-amber-400 text-amber-300 flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer shadow-sm group"
                  >
                    <Table2 className="w-4 h-4 text-amber-400" />
                    <span>開啟右側邊欄完整八字命盤 (十神·藏干·長生表格)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>

              {/* Module 5 Cross-Discipline Validation */}
              {birthData.astrologyJSON?.cross_discipline && (
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Module 5 跨學科交叉驗證與降維指針</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800">
                      <span className="text-indigo-400 block text-[11px] font-medium mb-1">行為經濟學干預</span>
                      <p className="text-stone-300 leading-relaxed">
                        {birthData.astrologyJSON.cross_discipline.behavioral_economics?.cognitive_bias}
                      </p>
                      <p className="text-stone-500 text-[10px] mt-1">
                        解方：{birthData.astrologyJSON.cross_discipline.behavioral_economics?.intervention}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800">
                      <span className="text-emerald-400 block text-[11px] font-medium mb-1">神經生物學調控</span>
                      <p className="text-stone-300 leading-relaxed">
                        目標系統：{birthData.astrologyJSON.cross_discipline.neurobiology?.system_target}
                      </p>
                      <p className="text-stone-500 text-[10px] mt-1">
                        光波與環境：{birthData.astrologyJSON.cross_discipline.neurobiology?.light_wavelength}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800">
                      <span className="text-sky-400 block text-[11px] font-medium mb-1">西洋占星與人類圖</span>
                      <p className="text-stone-300 leading-relaxed">
                        太陽星座：{birthData.astrologyJSON.cross_discipline.western_and_human_design?.sun_sign}
                      </p>
                      <p className="text-stone-500 text-[10px] mt-1">
                        指針：{birthData.astrologyJSON.cross_discipline.western_and_human_design?.human_design_hint}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800">
                      <span className="text-amber-400 block text-[11px] font-medium mb-1">混沌系統造命點</span>
                      <p className="text-stone-300 leading-relaxed">
                        {birthData.astrologyJSON.cross_discipline.chaos_theory?.strange_attractor}
                      </p>
                      <p className="text-stone-500 text-[10px] mt-1">
                        微小決策改變，觸發蝴蝶效應打破非線性軌跡
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick ask button */}
              <button
                type="button"
                onClick={() => handleAskPromptAndClose('Jack 老師，請依據我的先天時空盤（命宮主星與當前大限），為我剖析今年下半年的關鍵轉折點！')}
                className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span>以先天 GPS 盤向 Jack 老師提問</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 3: DAILY FLOW TREND */}
          {activeTab === 'daily' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-950 border border-amber-900/40 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-stone-200">
                      今日流日：{dailyTrendData.ganZhiDay}日
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    氣運指數 {dailyTrendData.overallScore} 分
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40">
                  <span className="text-[11px] text-stone-400 block mb-0.5">流日核心關鍵字</span>
                  <p className="text-sm font-semibold text-amber-300">
                    {dailyTrendData.keyword}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-300 leading-relaxed">
                  {dailyTrendData.summary}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-stone-500 block text-[10px]">宜 (建議策略)</span>
                    <span className="text-emerald-400 font-medium">{dailyTrendData.auspicious.join(' · ')}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-stone-500 block text-[10px]">忌 (避坑指南)</span>
                    <span className="text-rose-400 font-medium">{dailyTrendData.inauspicious.join(' · ')}</span>
                  </div>
                </div>
              </div>

              {/* Morning Notification Status Card */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                    isPushActive
                      ? 'bg-emerald-950/50 border-emerald-800 text-emerald-400'
                      : 'bg-stone-800 border-stone-700 text-stone-400'
                  }`}>
                    {isPushActive ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-stone-200 block">
                      每日早晨 07:30 關鍵趨勢推播
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {isPushActive ? '已啟用：早晨自動於瀏覽器推送' : '未啟用：點擊設定開啟推播'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDailyTrendModal();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer"
                >
                  設定推播
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleAskPromptAndClose(`Jack 老師，針對今天的【${dailyTrendData.ganZhiDay}日·${dailyTrendData.keyword}】，在我的工作與做決策上有何最關鍵的行動策略？`)}
                className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span>向 Jack 老師請教今日流日具體指針</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 4: SYSTEM & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <span className="text-xs font-semibold text-stone-200 block">語言環境與文化適配 (v14.0 雙軌引擎)</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectLanguage?.('zh-TW')}
                    className={`py-2 px-3 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      currentLanguage === 'zh-TW'
                        ? 'bg-amber-600/30 border-amber-500 text-amber-300 font-semibold shadow-sm'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>🇹🇼 繁中 (zh-TW)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectLanguage?.('th-TH')}
                    className={`py-2 px-3 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      currentLanguage === 'th-TH'
                        ? 'bg-amber-600/30 border-amber-500 text-amber-300 font-semibold shadow-sm'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>🇹🇭 ไทย (th-TH)</span>
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  {currentLanguage === 'th-TH'
                    ? 'โหมดภาษาไทย: บังคับใช้กำแพงไฟห้ามภาษาจีน แปลงแนวคิดสู่ ดิน-น้ำ-ลม-ไฟ และพิมพ์เขียวชีวิต'
                    : '中文模式：採用七合一「人生拉力賽」賽車比喻與五感科學處方推演。'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <span className="text-xs font-semibold text-stone-200 block">LLM 推理引擎與 API 金鑰</span>
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <Cpu className="w-4 h-4 text-amber-400" />
                    <span className="text-stone-300">目前模型：</span>
                    <span className="font-medium text-amber-400">
                      {llmProvider === 'deepinfra' ? 'DeepSeek-V3 (DeepInfra)' : 'Google Gemini'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenApiSettings();
                    }}
                    className="text-xs px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 cursor-pointer"
                  >
                    配置金鑰
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <span className="text-xs font-semibold text-stone-200 block">對話管理</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onClearChat();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-rose-950/40 text-rose-300 border border-stone-800 hover:border-rose-800/60 text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>清空歷史對話記錄並重開局</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <span className="text-xs font-semibold text-stone-200 block">命主生辰修改</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEditBirthData();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>重新輸入生辰進行排盤</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900/90 flex items-center justify-between shrink-0 text-xs text-stone-400">
          <span>點擊任意提問按鈕，將自動切換回對話介面</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer"
          >
            關閉選單
          </button>
        </div>
      </div>
    </div>
  );
};
