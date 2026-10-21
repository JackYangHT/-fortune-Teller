import React, { useState, useEffect } from 'react';
import { Compass, Sparkles } from 'lucide-react';

const REASONING_STEPS = [
  '【階段一：底層診斷】穿透表面現象，定位系統性癥結與本質槓桿點...',
  '【階段二：框架拆解】調用七合一模型 (八字性能 / 紫微副駕 / 易經路標 / 奇門導航)...',
  '【階段三：實操落地】生成結構化對策表格與五感科學佈局 SOP...',
  '【戰略節點預算】排查流年流月時間窗口與時空方位指引...',
];

export const ChatSkeletonScreen: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % REASONING_STEPS.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-3 justify-start items-start w-full max-w-[88%] sm:max-w-[80%] animate-fadeIn select-none">
      {/* Jack 老師頭像與旋轉羅盤光暈 */}
      <div className="relative w-8 h-8 rounded-full bg-stone-900 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 mt-1 shadow-lg shadow-amber-950/40">
        <Compass className="w-4 h-4 animate-spin text-amber-400" />
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping opacity-75" />
      </div>

      {/* 命理推演專屬骨架卡片 */}
      <div className="flex-1 bg-stone-900/90 border border-stone-800 rounded-2xl rounded-tl-none p-4 sm:p-5 shadow-2xl backdrop-blur space-y-4 overflow-hidden relative">
        {/* 背景微光流動 Shimmer 動畫 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent -translate-x-full animate-shimmer pointer-events-none" />

        {/* 頂部推算狀態與微步驟 Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800/80">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="text-xs font-semibold text-amber-300 tracking-wide">
              Jack 老師 · 首席人生戰略與決策架構師
            </span>
          </div>
          <span className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/40">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>七合一戰略推演</span>
          </span>
        </div>

        {/* 即時推演階段文字跑馬燈 */}
        <div className="py-1.5 px-3 rounded-xl bg-stone-950/80 border border-amber-500/20 text-xs text-amber-300/95 flex items-center gap-2 shadow-inner">
          <span className="text-amber-400 text-xs font-mono">⚡</span>
          <span className="truncate font-medium">{REASONING_STEPS[stepIndex]}</span>
        </div>

        {/* 五段式模組骨架螢幕 (Five Modules Skeleton) */}
        <div className="space-y-4 pt-1">
          {/* 模組一：事實錨定骨架 */}
          <div className="space-y-2">
            <div className="h-3.5 w-32 rounded bg-amber-500/20 border border-amber-500/30 animate-pulse" />
            <div className="h-3 w-11/12 rounded bg-stone-800 animate-pulse" />
            <div className="h-3 w-4/5 rounded bg-stone-800/80 animate-pulse" />
          </div>

          {/* 模組二：七合一象數理交叉解析骨架 */}
          <div className="space-y-2.5 pt-1.5 border-t border-stone-800/60">
            <div className="h-3.5 w-40 rounded bg-amber-500/20 border border-amber-500/30 animate-pulse" />
            <div className="h-3 w-full rounded bg-stone-800 animate-pulse" />
            <div className="h-3 w-5/6 rounded bg-stone-800/80 animate-pulse" />
            <div className="h-3 w-3/4 rounded bg-stone-800/60 animate-pulse" />
          </div>

          {/* 模組三：微觀能量與五感科學部署卡片骨架 */}
          <div className="space-y-2 pt-1.5 border-t border-stone-800/60">
            <div className="h-3.5 w-36 rounded bg-amber-500/20 border border-amber-500/30 animate-pulse" />
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="h-10 rounded-xl bg-stone-950/90 border border-stone-800/80 p-2 flex items-center gap-2 animate-pulse">
                <div className="w-4 h-4 rounded-full bg-amber-500/20 shrink-0" />
                <div className="h-2.5 w-16 bg-stone-800 rounded" />
              </div>
              <div className="h-10 rounded-xl bg-stone-950/90 border border-stone-800/80 p-2 flex items-center gap-2 animate-pulse">
                <div className="w-4 h-4 rounded-full bg-amber-500/20 shrink-0" />
                <div className="h-2.5 w-16 bg-stone-800 rounded" />
              </div>
            </div>
            <div className="h-3 w-2/3 rounded bg-stone-800/60 animate-pulse" />
          </div>
        </div>

        {/* 底部脈衝狀態列 */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-800/70 text-[11px] text-stone-500 font-sans">
          <span>全息大數據對參中，即將輸出解答...</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
