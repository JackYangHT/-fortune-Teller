import React, { useState } from 'react';
import {
  Compass,
  X,
  Bell,
  BellRing,
  BellOff,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Volume2,
  Sliders,
  Send
} from 'lucide-react';
import { DailyTrendData } from '../utils/dailyTrendEngine';
import {
  DailyNotificationConfig,
  requestNotificationPermission,
  saveDailyNotificationConfig,
  sendTestNotification,
  isNotificationSupported,
} from '../services/dailyNotificationService';
import { UserBirthData } from '../types/destiny';

interface DailyTrendModalProps {
  isOpen: boolean;
  onClose: () => void;
  trendData: DailyTrendData;
  birthData: UserBirthData;
  notifConfig: DailyNotificationConfig;
  onConfigChange: (newConfig: DailyNotificationConfig) => void;
  onAskJack: (prompt: string) => void;
}

const MORNING_HOURS = ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30'];

export const DailyTrendModal: React.FC<DailyTrendModalProps> = ({
  isOpen,
  onClose,
  trendData,
  birthData,
  notifConfig,
  onConfigChange,
  onAskJack,
}) => {
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isRequestingPerm, setIsRequestingPerm] = useState(false);

  if (!isOpen) return null;

  const handleRequestPerm = async () => {
    setIsRequestingPerm(true);
    setTestStatus(null);
    try {
      const perm = await requestNotificationPermission();
      const updated = saveDailyNotificationConfig({ enabled: perm === 'granted' });
      onConfigChange(updated);
      if (perm === 'granted') {
        setTestStatus('✅ 已成功獲取通知授權！明日早晨將為您自動推送流日指針。');
      } else if (perm === 'denied') {
        setTestStatus('⚠️ 瀏覽器通知已被封鎖，請於瀏覽器網址列左側鎖頭中手動開啟。');
      }
    } finally {
      setIsRequestingPerm(false);
    }
  };

  const handleToggleEnable = (enabled: boolean) => {
    const updated = saveDailyNotificationConfig({ enabled });
    onConfigChange(updated);
  };

  const handleTimeChange = (morningTime: string) => {
    const updated = saveDailyNotificationConfig({ morningTime });
    onConfigChange(updated);
  };

  const handleTestNotification = () => {
    setTestStatus(null);
    const result = sendTestNotification(birthData, () => {
      // Notification clicked
    });

    if (result.success) {
      setTestStatus('🎉 測試推播已發送！請查看您電腦或手機的系統通知中心。');
    } else {
      setTestStatus(`⚠️ ${result.reason || '發送失敗'}`);
    }
  };

  const handleAskJackClick = () => {
    onClose();
    onAskJack(trendData.suggestedPrompt);
  };

  const hasPermission = notifConfig.permission === 'granted';
  const isDenied = notifConfig.permission === 'denied';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-stone-900 border border-amber-900/40 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-stone-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800 bg-stone-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-amber-200">今日流日關鍵趨勢</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-950/80 text-amber-400 border border-amber-800/60">
                  {trendData.ganZhiDay}日 · {trendData.solarTerm}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {trendData.dateString} ({trendData.dayOfWeek}) · {trendData.ganZhiYear}年 {trendData.ganZhiMonth}月
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800 transition"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar flex-1 text-sm">
          {/* Main Trend Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-950 border border-amber-500/20 shadow-inner">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-1.5">
                  {trendData.tenGodPattern}
                </span>
                <h4 className="text-lg font-bold text-amber-100 leading-snug">
                  {trendData.keyword}
                </h4>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                  {trendData.summary}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-extrabold text-amber-400 font-mono">
                  {trendData.overallScore}
                  <span className="text-xs text-stone-400 font-normal">/100</span>
                </div>
                <div className="text-[10px] text-amber-500/80 font-medium">流日能量指標</div>
              </div>
            </div>

            {/* Branch Magnetic Interaction */}
            <div className="mt-3 pt-3 border-t border-amber-900/30 flex items-center gap-2 text-xs text-amber-300/90">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{trendData.branchRelation}</span>
            </div>
          </div>

          {/* 5 Dimensions Mini Bars */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center justify-between">
              <span>五維能量分佈</span>
              <span className="text-[11px] text-stone-500">本命盤與流日干支感應</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { label: '事業破局', val: trendData.scores.career, color: 'bg-blue-500' },
                { label: '現金流向', val: trendData.scores.wealth, color: 'bg-amber-500' },
                { label: '貴人指針', val: trendData.scores.mentor, color: 'bg-emerald-500' },
                { label: '精神心緒', val: trendData.scores.mind, color: 'bg-purple-500' },
                { label: '人際和合', val: trendData.scores.relationship, color: 'bg-rose-500' },
              ].map((item) => (
                <div key={item.label} className="p-2 rounded-lg bg-stone-950/60 border border-stone-800">
                  <div className="flex justify-between items-center text-[11px] text-stone-400 mb-1">
                    <span>{item.label}</span>
                    <span className="font-mono font-bold text-stone-200">{item.val}</span>
                  </div>
                  <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Auspicious & Inauspicious */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>宜 · 順應時勢</span>
              </div>
              <ul className="space-y-1.5 text-xs text-stone-300">
                {trendData.auspicious.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/30">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>忌 · 慎防破耗</span>
              </div>
              <ul className="space-y-1.5 text-xs text-stone-300">
                {trendData.inauspicious.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Metaphysical Environment & Direction Layout */}
          <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 space-y-2.5">
            <div className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>今日五感與奇門方位佈局</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800/80">
                <span className="text-[11px] text-stone-400 block mb-0.5">生門吉方</span>
                <span className="text-amber-300 font-medium">{trendData.luckyDirection}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800/80">
                <span className="text-[11px] text-stone-400 block mb-0.5">五感開運調候</span>
                <span className="text-stone-200">{trendData.luckyElement}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800/80">
                <span className="text-[11px] text-stone-400 block mb-0.5">黃金吉時</span>
                <span className="text-emerald-400 font-medium">{trendData.luckyHours.join(' · ')}</span>
              </div>
            </div>
          </div>

          {/* Jack's Morning Insight Box */}
          <div className="p-4 rounded-xl bg-stone-950/90 border border-amber-900/30 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                J
              </div>
              <span className="text-xs font-bold text-amber-300">Jack 老師流日指針</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed whitespace-pre-line">
              {trendData.jackAdvice}
            </p>
          </div>

          {/* Browser Notification API Settings & Schedule */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-stone-950 to-stone-900 border border-amber-900/40 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-200">瀏覽器 Notification API 早晨自動推播</span>
              </div>
              {hasPermission ? (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  已授權推播
                </span>
              ) : isDenied ? (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-950 text-rose-400 border border-rose-800 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  通知已封鎖
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-stone-800 text-stone-300 border border-stone-700">
                  尚未授權
                </span>
              )}
            </div>

            <p className="text-xs text-stone-400">
              啟用後，瀏覽器會在每日早晨根據您的本命八字與當日流日干支，自動發送一則精準的關鍵趨勢通知。
            </p>

            {/* Permission Action if not granted */}
            {!hasPermission && (
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs text-amber-200">
                  {isDenied
                    ? '請至瀏覽器網址列點擊「網站設定/鎖頭」，將「通知」改為「允許」後重新整理。'
                    : '點擊右側按鈕開啟瀏覽器原生通知權限，即可接收每日早晨提醒。'}
                </div>
                {!isDenied && (
                  <button
                    onClick={handleRequestPerm}
                    disabled={isRequestingPerm}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-md"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    {isRequestingPerm ? '正在請求...' : '開啟通知授權'}
                  </button>
                )}
              </div>
            )}

            {/* Settings controls: Toggle & Morning Time */}
            <div className="pt-2 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                  <input
                    type="checkbox"
                    checked={notifConfig.enabled}
                    onChange={(e) => handleToggleEnable(e.target.checked)}
                    disabled={!hasPermission}
                    className="rounded bg-stone-800 border-stone-700 text-amber-500 focus:ring-0 focus:ring-offset-0 disabled:opacity-50"
                  />
                  <span>每日早晨自動推送</span>
                </label>

                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>時間：</span>
                  <select
                    value={notifConfig.morningTime || '08:00'}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    disabled={!hasPermission || !notifConfig.enabled}
                    className="bg-stone-800 border border-stone-700 rounded px-2 py-1 text-xs text-stone-200 focus:border-amber-500 focus:outline-none disabled:opacity-50"
                  >
                    {MORNING_HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Test Button */}
              <button
                onClick={handleTestNotification}
                disabled={!hasPermission}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40 disabled:hover:bg-stone-800 text-stone-200 text-xs font-medium border border-stone-700 hover:border-stone-600 transition flex items-center gap-1.5 shadow-sm"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>立即測試推播通知</span>
              </button>
            </div>

            {testStatus && (
              <div className="text-xs p-2.5 rounded-lg bg-stone-800/90 border border-stone-700 text-stone-200 animate-fadeIn">
                {testStatus}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3.5 border-t border-stone-800 bg-stone-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-400 text-center sm:text-left">
            基於您的出生盤【{birthData.gps.baziDay}】與今日真實流日計算
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition"
            >
              關閉
            </button>
            <button
              onClick={handleAskJackClick}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/50"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>帶入今日流日問 Jack</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
