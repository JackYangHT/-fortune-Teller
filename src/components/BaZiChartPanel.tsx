import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRightLeft,
  X,
  Compass,
  Flame,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  Layers,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { UserBirthData } from '../types/destiny';
import { calculateDetailedBaZi, BaZiPillarData } from '../utils/baziPillarsEngine';

interface BaZiChartPanelProps {
  birthData: UserBirthData;
  onClose?: () => void;
  onSelectPrompt?: (prompt: string) => void;
  isSidebarMode?: boolean; // When rendered as a right sidebar inside ChatInterface
}

const ELEMENT_COLOR_MAP: Record<
  string,
  { bg: string; text: string; border: string; dot: string; glow: string }
> = {
  木: {
    bg: 'bg-emerald-950/60',
    text: 'text-emerald-300',
    border: 'border-emerald-600/40',
    dot: 'bg-emerald-400',
    glow: 'shadow-emerald-950/30',
  },
  火: {
    bg: 'bg-rose-950/60',
    text: 'text-rose-300',
    border: 'border-rose-600/40',
    dot: 'bg-rose-400',
    glow: 'shadow-rose-950/30',
  },
  土: {
    bg: 'bg-amber-950/60',
    text: 'text-amber-300',
    border: 'border-amber-600/40',
    dot: 'bg-amber-400',
    glow: 'shadow-amber-950/30',
  },
  金: {
    bg: 'bg-stone-800/80',
    text: 'text-stone-200',
    border: 'border-stone-500/50',
    dot: 'bg-stone-300',
    glow: 'shadow-stone-900/30',
  },
  水: {
    bg: 'bg-sky-950/60',
    text: 'text-sky-300',
    border: 'border-sky-600/40',
    dot: 'bg-sky-400',
    glow: 'shadow-sky-950/30',
  },
};

const TEN_GOD_BADGE_STYLE: Record<string, string> = {
  日主: 'bg-amber-500 text-stone-950 font-bold border border-amber-300 shadow-sm shadow-amber-500/30',
  比肩: 'bg-stone-800 text-stone-300 border border-stone-700',
  劫財: 'bg-stone-800 text-stone-200 border border-stone-600',
  食神: 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60',
  傷官: 'bg-emerald-900/70 text-emerald-200 border border-emerald-600/60',
  偏財: 'bg-amber-950/80 text-amber-300 border border-amber-700/60',
  正財: 'bg-amber-900/80 text-amber-200 border border-amber-600/70 font-medium',
  七殺: 'bg-rose-950/80 text-rose-300 border border-rose-700/60',
  正官: 'bg-purple-950/80 text-purple-300 border border-purple-700/60 font-medium',
  偏印: 'bg-sky-950/80 text-sky-300 border border-sky-700/60',
  正印: 'bg-sky-900/80 text-sky-200 border border-sky-600/70 font-medium',
};

export const BaZiChartPanel: React.FC<BaZiChartPanelProps> = ({
  birthData,
  onClose,
  onSelectPrompt,
  isSidebarMode = true,
}) => {
  // 排盤順序切換：'yearToHour' (年->月->日->時) 或 'hourToYear' (時->日->月->年，傳統排法)
  const [pillarOrder, setPillarOrder] = useState<'yearToHour' | 'hourToYear'>('yearToHour');
  const [activeTab, setActiveTab] = useState<'table' | 'analysis'>('table');

  const baziChart = useMemo(() => calculateDetailedBaZi(birthData), [birthData]);

  const displayedPillars: BaZiPillarData[] = useMemo(() => {
    const list = [
      baziChart.pillars.year,
      baziChart.pillars.month,
      baziChart.pillars.day,
      baziChart.pillars.hour,
    ];
    return pillarOrder === 'yearToHour' ? list : [...list].reverse();
  }, [baziChart, pillarOrder]);

  const handleAskJack = (promptText: string) => {
    if (onSelectPrompt) {
      onSelectPrompt(promptText);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-stone-900/95 text-stone-100 select-none overflow-hidden">
      {/* Header Bar */}
      <div className="px-4 py-3 border-b border-stone-800 bg-stone-900/95 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-stone-100 tracking-wide truncate">
                八字四柱命盤
              </h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-300 font-medium shrink-0">
                {baziChart.genderText.split(' ')[0]}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 truncate">
              {baziChart.solarDateStr} · 真太陽時 {baziChart.trueSolarTime.slice(11)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Toggle Pillar Order */}
          <button
            type="button"
            onClick={() =>
              setPillarOrder((prev) => (prev === 'yearToHour' ? 'hourToYear' : 'yearToHour'))
            }
            className="p-1.5 rounded-lg bg-stone-950/80 hover:bg-stone-800 text-stone-400 hover:text-amber-300 border border-stone-800 hover:border-amber-500/30 text-xs transition-colors cursor-pointer flex items-center gap-1"
            title={pillarOrder === 'yearToHour' ? '切換為傳統右起 (時➔年)' : '切換為現代順序 (年➔時)'}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">
              {pillarOrder === 'yearToHour' ? '年➔時' : '時➔年'}
            </span>
          </button>

          {/* Close Sidebar Button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-stone-950/80 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 transition-colors cursor-pointer"
              title="收合右側八字命盤"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-stone-800/80 bg-stone-950/50 px-4 gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('table')}
          className={`py-2 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'table'
              ? 'border-amber-500 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>四柱八字表格</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('analysis')}
          className={`py-2 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'analysis'
              ? 'border-amber-500 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>日元與五行解析</span>
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4 scrollbar-thin">
        {activeTab === 'table' ? (
          <>
            {/* Core BaZi Table (以 Tailwind CSS 打造的精美四柱排盤表格) */}
            <div className="rounded-2xl border border-stone-800/90 bg-stone-950/80 overflow-hidden shadow-xl">
              <table className="w-full text-center border-collapse text-xs">
                {/* Table Header: Pillars */}
                <thead>
                  <tr className="bg-stone-900/90 border-b border-stone-800 text-stone-300">
                    <th className="py-2.5 px-1.5 w-14 font-medium text-stone-500 text-[11px] border-r border-stone-800/60">
                      四柱
                    </th>
                    {displayedPillars.map((p) => {
                      const isDay = p.key === 'day';
                      return (
                        <th
                          key={p.key}
                          className={`py-2.5 px-1.5 font-bold border-r last:border-r-0 border-stone-800/60 ${
                            isDay ? 'bg-amber-950/30 text-amber-300' : 'text-stone-200'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-xs sm:text-sm flex items-center gap-1">
                              <span>{p.name}</span>
                              {isDay && <span className="text-[10px] text-amber-400">★</span>}
                            </span>
                            <span className="text-[9px] text-stone-400 font-normal">
                              {p.subLabel}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-800/60">
                  {/* Row 1: 主星 (十神) */}
                  <tr className="hover:bg-stone-900/40 transition-colors">
                    <td className="py-2 px-1.5 font-medium text-stone-400 text-[10px] bg-stone-900/40 border-r border-stone-800/60">
                      主星
                    </td>
                    {displayedPillars.map((p) => {
                      const style =
                        TEN_GOD_BADGE_STYLE[p.stemTenGod] ||
                        'bg-stone-800 text-stone-300 border border-stone-700';
                      return (
                        <td
                          key={p.key}
                          className={`py-2 px-1 border-r last:border-r-0 border-stone-800/60 ${
                            p.key === 'day' ? 'bg-amber-950/15' : ''
                          }`}
                        >
                          <span
                            className={`inline-block text-[11px] px-2 py-0.5 rounded-md shadow-xs ${style}`}
                          >
                            {p.stemTenGod}
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 2: 天干 */}
                  <tr className="bg-stone-900/20 hover:bg-stone-900/40 transition-colors">
                    <td className="py-3 px-1.5 font-medium text-stone-400 text-[10px] bg-stone-900/40 border-r border-stone-800/60">
                      天干
                    </td>
                    {displayedPillars.map((p) => {
                      const colorInfo = ELEMENT_COLOR_MAP[p.stemElement] || ELEMENT_COLOR_MAP['金'];
                      const isDay = p.key === 'day';
                      return (
                        <td
                          key={p.key}
                          className={`py-3 px-1 border-r last:border-r-0 border-stone-800/60 ${
                            isDay ? 'bg-amber-950/20' : ''
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span
                              className={`text-2xl sm:text-3xl font-serif font-black tracking-wider leading-none drop-shadow-sm ${colorInfo.text}`}
                            >
                              {p.stem}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded border ${colorInfo.bg} ${colorInfo.text} ${colorInfo.border}`}
                            >
                              {p.stemYinYang}
                              {p.stemElement}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 3: 地支 */}
                  <tr className="hover:bg-stone-900/40 transition-colors">
                    <td className="py-3 px-1.5 font-medium text-stone-400 text-[10px] bg-stone-900/40 border-r border-stone-800/60">
                      地支
                    </td>
                    {displayedPillars.map((p) => {
                      const colorInfo =
                        ELEMENT_COLOR_MAP[p.branchElement] || ELEMENT_COLOR_MAP['土'];
                      const isDay = p.key === 'day';
                      return (
                        <td
                          key={p.key}
                          className={`py-3 px-1 border-r last:border-r-0 border-stone-800/60 ${
                            isDay ? 'bg-amber-950/20' : ''
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span
                              className={`text-2xl sm:text-3xl font-serif font-black tracking-wider leading-none drop-shadow-sm ${colorInfo.text}`}
                            >
                              {p.branch}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded border ${colorInfo.bg} ${colorInfo.text} ${colorInfo.border}`}
                            >
                              {p.branchElement}·{p.branchZodiac}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 4: 藏干 */}
                  <tr className="bg-stone-900/20 hover:bg-stone-900/40 transition-colors">
                    <td className="py-2.5 px-1.5 font-medium text-stone-400 text-[10px] bg-stone-900/40 border-r border-stone-800/60">
                      藏干
                    </td>
                    {displayedPillars.map((p) => (
                      <td
                        key={p.key}
                        className={`py-2 px-1 border-r last:border-r-0 border-stone-800/60 ${
                          p.key === 'day' ? 'bg-amber-950/15' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          {p.hiddenStems.map((hs, idx) => {
                            const c = ELEMENT_COLOR_MAP[hs.element] || ELEMENT_COLOR_MAP['土'];
                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-1 text-[10px] text-stone-300"
                              >
                                <span className={`font-serif font-bold ${c.text}`}>{hs.stem}</span>
                                <span className="text-[9px] text-stone-500 font-mono">
                                  ({hs.element})
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row 5: 副星 (藏干十神) */}
                  <tr className="hover:bg-stone-900/40 transition-colors">
                    <td className="py-2.5 px-1.5 font-medium text-stone-400 text-[10px] bg-stone-900/40 border-r border-stone-800/60">
                      副星
                    </td>
                    {displayedPillars.map((p) => (
                      <td
                        key={p.key}
                        className={`py-2 px-1 border-r last:border-r-0 border-stone-800/60 ${
                          p.key === 'day' ? 'bg-amber-950/15' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          {p.hiddenStems.map((hs, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] text-stone-300 bg-stone-900 px-1.5 py-0.2 rounded border border-stone-800"
                            >
                              {hs.tenGod}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row 6: 地勢 (十二長生) */}
                  <tr className="bg-stone-900/20 hover:bg-stone-900/40 transition-colors">
                    <td className="py-2 px-1.5 font-medium text-stone-400 text-[10px] bg-stone-900/40 border-r border-stone-800/60">
                      星運
                    </td>
                    {displayedPillars.map((p) => (
                      <td
                        key={p.key}
                        className={`py-2 px-1 border-r last:border-r-0 border-stone-800/60 ${
                          p.key === 'day' ? 'bg-amber-950/15' : ''
                        }`}
                      >
                        <span className="text-[11px] font-medium text-amber-200/90 px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-900/40">
                          {p.stage}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row 7: 納音五行 */}
                  <tr className="hover:bg-stone-900/40 transition-colors">
                    <td className="py-2 px-1.5 font-medium text-stone-400 text-[10px] bg-stone-900/40 border-r border-stone-800/60">
                      納音
                    </td>
                    {displayedPillars.map((p) => (
                      <td
                        key={p.key}
                        className={`py-2 px-1 text-[10px] text-stone-300 font-serif border-r last:border-r-0 border-stone-800/60 ${
                          p.key === 'day' ? 'bg-amber-950/15' : ''
                        }`}
                      >
                        {p.naYin}
                      </td>
                    ))}
                  </tr>

                  {/* Row 8: 旬空 */}
                  <tr className="bg-stone-900/20 hover:bg-stone-900/40 transition-colors">
                    <td className="py-2 px-1.5 font-medium text-stone-400 text-[10px] bg-stone-900/40 border-r border-stone-800/60">
                      空亡
                    </td>
                    {displayedPillars.map((p) => (
                      <td
                        key={p.key}
                        className={`py-2 px-1 text-[10px] text-stone-400 font-mono border-r last:border-r-0 border-stone-800/60 ${
                          p.key === 'day' ? 'bg-amber-950/15' : ''
                        }`}
                      >
                        {p.xunKong}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quick Summary Pill Bar */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800/90">
                <span className="text-[10px] text-stone-500 block">日元主宰 (本命)</span>
                <span className="text-amber-400 font-bold text-sm">
                  {baziChart.dayMasterFull} ({baziChart.dayMasterYinYang}
                  {baziChart.dayMasterElement})
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800/90">
                <span className="text-[10px] text-stone-500 block">格局推演</span>
                <span className="text-stone-200 font-bold text-sm">{baziChart.patternName}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800/90">
                <span className="text-[10px] text-stone-500 block">喜用神</span>
                <span className="text-emerald-400 font-medium text-xs">
                  {baziChart.usefulGod}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800/90">
                <span className="text-[10px] text-stone-500 block">忌仇神</span>
                <span className="text-rose-400 font-medium text-xs">{baziChart.avoidGod}</span>
              </div>
            </div>

            {/* Branch Interactions (合沖會刑) */}
            {baziChart.interactions.length > 0 && (
              <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-200">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>地支合沖會刑速查</span>
                </div>
                <div className="space-y-1.5">
                  {baziChart.interactions.map((it, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl border text-xs leading-relaxed ${
                        it.isHarmonious
                          ? 'bg-emerald-950/20 border-emerald-800/40 text-stone-300'
                          : 'bg-amber-950/20 border-amber-800/40 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span
                          className={`font-semibold text-[11px] ${
                            it.isHarmonious ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {it.title}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {it.pillars.join(' · ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-300">{it.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Analysis Tab: Day Master Personality & Five Elements Bar Chart */
          <>
            {/* Day Master Profile Card */}
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-black text-sm">
                    {baziChart.dayMaster}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-300">
                      {baziChart.dayMasterTitle}
                    </h4>
                    <span className="text-[10px] text-stone-400">
                      日主五行屬【{baziChart.dayMasterYinYang}
                      {baziChart.dayMasterElement}】
                    </span>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium">
                  {baziChart.patternName}
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {baziChart.dayMasterDescription}
              </p>
            </div>

            {/* Five Elements Energy Bars */}
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>五行能量分佈 (八字強弱)</span>
                </span>
                <span className="text-[10px] text-stone-500">共 8 字</span>
              </div>

              <div className="space-y-2">
                {baziChart.fiveElementsList.map((fe) => (
                  <div key={fe.element} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-medium text-stone-200">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: fe.color }}
                        />
                        <span>{fe.element}</span>
                        <span className="text-[10px] text-stone-500">({fe.count}個)</span>
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        {fe.percentage}% ·{' '}
                        <span
                          className={
                            fe.status === '強旺'
                              ? 'text-amber-400'
                              : fe.status === '過弱'
                              ? 'text-rose-400'
                              : 'text-emerald-400'
                          }
                        >
                          {fe.status}
                        </span>
                      </span>
                    </div>

                    <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-stone-800">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(fe.percentage, 5)}%`,
                          backgroundColor: fe.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Useful God Balance Strategy */}
            <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2">
              <span className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>開運與平衡指針</span>
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-emerald-400 block font-medium">宜 (喜用神)</span>
                  <p className="text-[11px] text-stone-300 mt-0.5">{baziChart.usefulGod}</p>
                </div>
                <div className="p-2 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-[10px] text-rose-400 block font-medium">忌 (仇忌神)</span>
                  <p className="text-[11px] text-stone-300 mt-0.5">{baziChart.avoidGod}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Quick Prompts to ask Jack 老師 */}
        {onSelectPrompt && (
          <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-2">
            <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
              <Compass className="w-3 h-3" />
              <span>針對本盤快捷問 Jack 老師</span>
            </span>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() =>
                  handleAskJack(
                    `Jack 老師，請深入剖析我的四柱八字格局【${baziChart.patternName}】與日主【${baziChart.dayMasterFull}】的性格盲點與致勝優勢？`
                  )
                }
                className="w-full text-left p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-[11px] text-stone-300 hover:text-amber-300 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <span>深度解析格局與日主優勢</span>
                <ArrowRight className="w-3 h-3 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() =>
                  handleAskJack(
                    `Jack 老師，請根據我的八字五行強弱分佈，指導我如何在生活中具體調和喜用神【${baziChart.usefulGod}】？`
                  )
                }
                className="w-full text-left p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-[11px] text-stone-300 hover:text-amber-300 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <span>指導生活中如何調和喜用神</span>
                <ArrowRight className="w-3 h-3 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {baziChart.interactions.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    handleAskJack(
                      `Jack 老師，我的命盤中地支有【${baziChart.interactions.map((i) => i.title).join('、')}】，這在接下來的流年會有什麼吉凶影響？`
                    )
                  }
                  className="w-full text-left p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-[11px] text-stone-300 hover:text-amber-300 transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <span>剖析地支刑沖剋害與流年影響</span>
                  <ArrowRight className="w-3 h-3 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
