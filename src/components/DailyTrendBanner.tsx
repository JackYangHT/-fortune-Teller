import React from 'react';
import { Compass, Bell, BellRing, Sparkles, ChevronRight } from 'lucide-react';
import { DailyTrendData } from '../utils/dailyTrendEngine';
import { DailyNotificationConfig } from '../services/dailyNotificationService';

interface DailyTrendBannerProps {
  trendData: DailyTrendData;
  notifConfig: DailyNotificationConfig;
  onOpenModal: () => void;
}

export const DailyTrendBanner: React.FC<DailyTrendBannerProps> = ({
  trendData,
  notifConfig,
  onOpenModal,
}) => {
  const isPushActive = notifConfig.permission === 'granted' && notifConfig.enabled;

  return (
    <div className="w-full bg-stone-900/90 border-b border-amber-900/30 px-3 py-2 text-xs flex items-center justify-between gap-2 backdrop-blur-md transition">
      <div className="flex items-center gap-2 overflow-hidden">
        <button
          onClick={onOpenModal}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition shrink-0 font-medium"
          title="點擊查看今日流日趨勢與推播設定"
        >
          <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span>今日流日</span>
        </button>

        <div className="flex items-center gap-2 truncate">
          <span className="text-stone-300 font-mono hidden sm:inline">
            {trendData.ganZhiDay}日
          </span>
          <span className="text-stone-500 hidden sm:inline">·</span>
          <span className="text-amber-200/90 font-medium truncate">
            {trendData.keyword}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/70 text-amber-400 border border-amber-800/50 hidden md:inline">
            {trendData.overallScore}分
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onOpenModal}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition border ${
            isPushActive
              ? 'bg-stone-950/80 text-emerald-400 border-emerald-900/60 hover:bg-stone-800'
              : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/40'
          }`}
          title={isPushActive ? `早晨 ${notifConfig.morningTime} 自動推送已啟用` : '點擊設定每日早晨推播'}
        >
          {isPushActive ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <BellRing className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">早晨推播中</span>
            </>
          ) : (
            <>
              <Bell className="w-3 h-3 text-amber-400" />
              <span>開啟早晨推播</span>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-stone-400" />
        </button>
      </div>
    </div>
  );
};
