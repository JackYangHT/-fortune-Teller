import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import {
  Briefcase,
  Coins,
  HeartPulse,
  Heart,
  Users,
  Sparkles,
  Flame,
  ArrowRight,
  TrendingUp,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  X,
} from 'lucide-react';
import { UserBirthData } from '../types/destiny';
import { calculateDestinyRadar, RadarDimensionItem } from '../utils/radarCalculator';

interface DestinyRadarVisualizerProps {
  birthData: UserBirthData;
  onSelectPrompt?: (prompt: string) => void;
  defaultExpanded?: boolean;
}

const DIMENSION_ICONS: Record<string, React.ElementType> = {
  事業: Briefcase,
  財運: Coins,
  健康: HeartPulse,
  感情: Heart,
  貴人: Users,
};

// Custom tactile Zipper Pull Tab SVG component
const ZipperPullIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    {/* Zipper slider body */}
    <path
      d="M7 2h10a1 1 0 0 1 1 1v6c0 .7-.4 1.4-1 1.7l-4.2 2.6a1.5 1.5 0 0 1-1.6 0L7 10.7A2 2 0 0 1 6 9V3a1 1 0 0 1 1-1z"
      className="fill-amber-400"
    />
    {/* Connector ring */}
    <rect x="11" y="12" width="2" height="3" rx="0.5" className="fill-amber-300" />
    {/* Hanging pull tab */}
    <rect
      x="9"
      y="15"
      width="6"
      height="7"
      rx="1.5"
      className="fill-amber-500 stroke-stone-900 stroke-1"
    />
    {/* Gripper holes/lines on pull tab */}
    <line x1="10.5" y1="17.5" x2="13.5" y2="17.5" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
    <line x1="10.5" y1="19.5" x2="13.5" y2="19.5" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const DestinyRadarVisualizer: React.FC<DestinyRadarVisualizerProps> = ({
  birthData,
  onSelectPrompt,
  defaultExpanded,
}) => {
  // On mobile screens or by defaultExpanded prop, control initial expand state
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    if (defaultExpanded !== undefined) return defaultExpanded;
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return false;
  });
  const [activeDimension, setActiveDimension] = useState<string>('事業');
  // Secondary zipper state: allows the active dimension card to fold/unfold like a mini zipper
  const [isDetailCardOpen, setIsDetailCardOpen] = useState<boolean>(true);

  // Radar chart zoom and inspection controls
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState<boolean>(false);

  const handleZoomIn = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomScale((prev) => Math.min(Number((prev + 0.2).toFixed(1)), 2.0));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomScale((prev) => Math.max(Number((prev - 0.2).toFixed(1)), 0.6));
  };

  const handleResetZoom = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomScale(1);
  };

  const radarResult = useMemo(() => {
    return calculateDestinyRadar(birthData);
  }, [birthData]);

  const activeItem = useMemo(() => {
    return (
      radarResult.dimensions.find((d) => d.dimension === activeDimension) ||
      radarResult.dimensions[0]
    );
  }, [radarResult, activeDimension]);

  // Format data for Recharts RadarChart
  const chartData = useMemo(() => {
    return radarResult.dimensions.map((d) => ({
      subject: d.dimension,
      score: d.score,
      fullMark: d.fullMark,
      level: d.level,
      highlight: d.highlight,
    }));
  }, [radarResult]);

  const handleAskJack = (dim: RadarDimensionItem) => {
    if (!onSelectPrompt) return;
    const promptText = `Jack 老師，請深入解讀我當前【${dim.dimension}運勢】（評分 ${dim.score}分 · ${dim.level}），在接下來的流年節點中，我有何突破時機與應避開的具體風險？`;
    onSelectPrompt(promptText);
  };

  const handleDimensionClick = (dimName: string) => {
    if (activeDimension === dimName) {
      // Toggle detail card open/shut like a zipper when clicking the active tab again!
      setIsDetailCardOpen(!isDetailCardOpen);
    } else {
      setActiveDimension(dimName);
      setIsDetailCardOpen(true);
    }
  };

  return (
    <div className="bg-stone-900/95 border-b border-stone-800 shadow-xl transition-all duration-300 relative select-none">
      {/* Top Bar / Header with click-to-zip toggle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 cursor-pointer group"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-sm group-hover:border-amber-400/50 transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="text-xs font-semibold text-stone-100 flex items-center gap-1.5">
              <span>{radarResult.currentYear} {radarResult.liuNianGanZhi}流年</span>
              <span className="text-stone-400">·</span>
              <span className="text-amber-400">五維命理雷達</span>
            </span>
            <div className="flex items-center gap-1 text-[11px] bg-stone-950 px-2 py-0.5 rounded-full border border-stone-800 text-stone-300">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>綜合氣運 <strong className="text-amber-400 font-bold">{radarResult.overallScore}</strong> 分</span>
              <span className="text-stone-500">|</span>
              <span className="text-amber-300 font-medium">{radarResult.overallTitle}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Badges in Collapsed Mode */}
          {!isExpanded && (
            <div className="hidden md:flex items-center gap-2 text-[11px]">
              {radarResult.dimensions.map((d) => (
                <span
                  key={d.dimension}
                  className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-300 flex items-center gap-1"
                >
                  <span className="text-stone-400">{d.dimension}</span>
                  <span className="text-amber-400 font-mono font-semibold">{d.score}</span>
                </span>
              ))}
            </div>
          )}

          {/* Zipper Pull Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer shadow-sm font-medium ${
              isExpanded
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 hover:bg-amber-500/25 ring-1 ring-amber-500/20'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700 hover:text-amber-300'
            }`}
            title={isExpanded ? '像拉鍊一樣拉起收闔' : '像拉鍊一樣拉開展開'}
          >
            <ZipperPullIcon
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                isExpanded ? 'rotate-180 text-amber-400' : 'text-stone-400 group-hover:text-amber-400'
              }`}
            />
            <span className="text-[11px] font-medium">
              {isExpanded ? '拉起收合' : '拉開雷達'}
            </span>
          </button>
        </div>
      </div>

      {/* Decorative Interactive Zipper Track (拉鍊軌道與拉頭滑塊) */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full relative cursor-pointer group bg-stone-950/80 hover:bg-stone-950 border-t border-stone-800/80 transition-colors"
        title={isExpanded ? '點此拉回收闔 (像拉鍊向上收起)' : '點此拉開展開 (像拉鍊向下拉開)'}
      >
        <div className="h-3 w-full flex items-center justify-center overflow-hidden relative">
          {/* Zipper Teeth Pattern (拉鍊齒紋) */}
          <div className="w-full h-[3px] bg-[repeating-linear-gradient(90deg,rgba(245,158,11,0.5)_0px,rgba(245,158,11,0.5)_3px,transparent_3px,transparent_7px)] opacity-50 group-hover:opacity-90 transition-opacity" />

          {/* Center Zipper Slider Handle (中間拉鍊頭滑塊) */}
          <div className="absolute flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-900/95 border border-amber-500/40 text-[10px] text-amber-300 shadow-md group-hover:border-amber-400 group-hover:scale-105 transition-all">
            <ZipperPullIcon
              className={`w-3 h-3 transition-transform duration-300 ${
                isExpanded ? 'rotate-180 text-amber-400' : 'text-amber-300'
              }`}
            />
            <span className="font-mono text-[9.5px] tracking-tight">
              {isExpanded ? '▲ 點此拉回 (拉鍊收闔)' : '▼ 點此拉開 (拉鍊滑出)'}
            </span>
          </div>
        </div>
      </div>

      {/* Zipper Sliding Accordion Container (CSS Grid 1fr <-> 0fr Smooth Sliding Transition) */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 pb-4 pt-2 max-h-[55vh] sm:max-h-[65vh] overflow-y-auto touch-scroll">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* Left Column: Recharts Radar Chart */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-2 rounded-2xl bg-stone-950/70 border border-stone-800/80 relative">
                <div className="w-full flex items-center justify-between px-2 pt-1 pb-1 text-[11px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>八字原局 × 流年四化共振場</span>
                  </span>
                  
                  {/* Zoom Controls & Fullscreen Trigger */}
                  <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={handleZoomOut}
                      className="p-1 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded transition-colors cursor-pointer"
                      title="縮小雷達圖 (-)"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleResetZoom}
                      className="px-1.5 py-0.5 text-[10px] font-mono text-stone-300 hover:text-amber-300 rounded hover:bg-stone-800 transition-colors"
                      title="重置倍率 (100%)"
                    >
                      {Math.round(zoomScale * 100)}%
                    </button>
                    <button
                      type="button"
                      onClick={handleZoomIn}
                      className="p-1 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded transition-colors cursor-pointer"
                      title="放大雷達圖 (+)"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-[1px] h-3 bg-stone-800 mx-0.5" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFullscreenModalOpen(true);
                      }}
                      className="p-1 text-amber-400 hover:text-amber-300 hover:bg-stone-800 rounded transition-colors cursor-pointer"
                      title="全螢幕放大檢視"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="w-full h-52 sm:h-56 relative overflow-hidden flex items-center justify-center">
                  <div
                    className="w-full h-full transition-transform duration-200 origin-center"
                    style={{ transform: `scale(${zoomScale})` }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
                        <PolarGrid
                          stroke="#44403c"
                          strokeDasharray="3 3"
                          strokeOpacity={0.6}
                        />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={(props) => {
                            const { x, y, payload } = props;
                            const isCurrent = payload.value === activeDimension;
                            return (
                              <text
                                x={x}
                                y={y}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className={`cursor-pointer transition-colors text-xs font-semibold ${
                                  isCurrent
                                    ? 'fill-amber-400 font-bold'
                                    : 'fill-stone-300 hover:fill-amber-200'
                                }`}
                                onClick={() => {
                                  setActiveDimension(payload.value);
                                  setIsDetailCardOpen(true);
                                }}
                              >
                                {payload.value}
                              </text>
                            );
                          }}
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[30, 100]}
                          stroke="#57534e"
                          strokeOpacity={0.3}
                          tick={false}
                        />
                        <Radar
                          name="命理運勢"
                          dataKey="score"
                          stroke="#f59e0b"
                          strokeWidth={2.2}
                          fill="#f59e0b"
                          fillOpacity={0.28}
                          isAnimationActive={true}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-stone-900 border border-stone-700/90 rounded-xl px-3 py-2 text-xs shadow-2xl backdrop-blur-md">
                                  <div className="flex items-center justify-between gap-3 mb-1">
                                    <span className="font-bold text-amber-400">{data.subject}運勢</span>
                                    <span className="font-mono font-bold text-white bg-amber-600/30 px-1.5 py-0.5 rounded text-[10px]">
                                      {data.score} 分
                                    </span>
                                  </div>
                                  <div className="text-stone-300 text-[11px] font-medium mb-1">
                                    評級：<span className="text-emerald-400">{data.level}</span>
                                  </div>
                                  <p className="text-stone-400 text-[10px] max-w-[200px] leading-tight">
                                    {data.highlight}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="w-full flex items-center justify-between text-[11px] text-stone-400 px-2 pt-1 pb-1">
                  <span>點選維度標籤或右側按鈕可拉開深層解析</span>
                  {zoomScale !== 1 && (
                    <button
                      type="button"
                      onClick={handleResetZoom}
                      className="text-amber-400 hover:text-amber-300 underline text-[10px] flex items-center gap-0.5"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>還原縮放</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: 5 Dimensions Badges & Collapsible Active Dimension Detail Card */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-2.5">
                {/* Dimension Switcher Buttons (Click active button again to fold/unfold) */}
                <div className="grid grid-cols-5 gap-1.5">
                  {radarResult.dimensions.map((dim) => {
                    const Icon = DIMENSION_ICONS[dim.dimension] || Sparkles;
                    const isSelected = dim.dimension === activeDimension;
                    return (
                      <button
                        key={dim.dimension}
                        type="button"
                        onClick={() => handleDimensionClick(dim.dimension)}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col items-center sm:items-start group relative ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500/60 shadow-md ring-1 ring-amber-500/30'
                            : 'bg-stone-950/80 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                        }`}
                        title={
                          isSelected
                            ? isDetailCardOpen
                              ? '再次點擊像拉鍊收起詳情'
                              : '點擊像拉鍊展開詳情'
                            : `切換至${dim.dimension}維度`
                        }
                      >
                        <div className="flex items-center gap-1.5 w-full justify-between">
                          <Icon
                            className={`w-3.5 h-3.5 ${
                              isSelected ? 'text-amber-400' : 'text-stone-400'
                            }`}
                          />
                          <span
                            className={`text-[10px] font-mono font-bold ${
                              isSelected ? 'text-amber-300' : 'text-stone-400'
                            }`}
                          >
                            {dim.score}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-medium mt-1 flex items-center gap-1 ${
                            isSelected ? 'text-white font-semibold' : 'text-stone-300'
                          }`}
                        >
                          <span>{dim.dimension}</span>
                          {isSelected && (
                            <span className="text-[9px] text-amber-400 font-mono">
                              {isDetailCardOpen ? '▲' : '▼'}
                            </span>
                          )}
                        </span>
                        <span
                          className={`text-[10px] hidden sm:block truncate mt-0.5 ${
                            isSelected ? 'text-amber-300/90' : 'text-stone-500'
                          }`}
                        >
                          {dim.level}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Collapsible Active Dimension Card (Mini Zipper Mechanism) */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isDetailCardOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden">
                    {activeItem && (
                      <div className="p-3.5 rounded-2xl bg-stone-950/90 border border-stone-800 relative">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-stone-100 flex items-center gap-1.5">
                              <span className="text-amber-400">{activeItem.name}</span>
                              <span className="text-stone-600">/</span>
                              <span className="text-xs text-stone-400 font-mono">{activeItem.tag}</span>
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {activeItem.level}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-stone-400 text-[11px]">命理強度：</span>
                              <span className="font-mono font-bold text-amber-400 text-sm">
                                {activeItem.score}
                              </span>
                              <span className="text-stone-600 text-[11px]">/100</span>
                            </div>

                            {/* Mini toggle to zip closed this card */}
                            <button
                              type="button"
                              onClick={() => setIsDetailCardOpen(false)}
                              className="text-stone-500 hover:text-amber-300 p-1 rounded hover:bg-stone-800 text-[10px] flex items-center gap-0.5 transition-colors cursor-pointer"
                              title="收合此維度詳情"
                            >
                              <span>收合</span>
                              <ZipperPullIcon className="w-2.5 h-2.5 rotate-180" />
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-stone-900 rounded-full h-1.5 mb-2.5 overflow-hidden border border-stone-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
                            style={{ width: `${activeItem.score}%` }}
                          />
                        </div>

                        {/* Detailed Highlight text */}
                        <div className="text-xs text-stone-200 leading-relaxed mb-3 space-y-1">
                          <p className="font-medium text-stone-200">{activeItem.highlight}</p>
                          <p className="text-[11px] text-stone-400">{activeItem.description}</p>
                        </div>

                        {/* Ask Jack shortcut button */}
                        {onSelectPrompt && (
                          <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
                            <span className="text-[11px] text-stone-500">
                              想要針對{activeItem.dimension}做深層推演與環境佈局？
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAskJack(activeItem)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-amber-600/90 hover:bg-amber-500 text-white font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                            >
                              <span>詢問 Jack 老師</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Collapsed state indicator for active dimension */}
                {!isDetailCardOpen && (
                  <button
                    type="button"
                    onClick={() => setIsDetailCardOpen(true)}
                    className="w-full py-2 px-3 rounded-xl bg-stone-950/80 hover:bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-stone-400 hover:text-amber-300 flex items-center justify-between text-xs transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <ZipperPullIcon className="w-3 h-3 text-amber-400" />
                      <span>已收合【{activeDimension}】深層解析</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-medium">點此拉開展開 ▼</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Pull Bar: One-click zip up to close the entire visualizer */}
            <div className="pt-3 pb-0.5 flex justify-center">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-950/90 hover:bg-stone-800 text-stone-400 hover:text-amber-300 border border-stone-800 hover:border-amber-500/50 text-[11px] font-medium transition-all shadow-md cursor-pointer"
                title="向上拉起收闔 (關閉雷達)"
              >
                <div className="w-5 h-0.5 bg-amber-500/40 rounded-full group-hover:w-8 transition-all" />
                <ZipperPullIcon className="w-3.5 h-3.5 text-amber-400 rotate-180 group-hover:-translate-y-0.5 transition-transform" />
                <span>像拉鍊一樣拉起收闔 (關閉雷達)</span>
                <div className="w-5 h-0.5 bg-amber-500/40 rounded-full group-hover:w-8 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Magnified Radar Inspection Modal (放大全螢幕檢視彈窗) */}
      {isFullscreenModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsFullscreenModalOpen(false)}
        >
          <div
            className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-stone-100">
                  {radarResult.currentYear} {radarResult.liuNianGanZhi}流年 · 五維命理雷達全圖
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Modal Zoom Controls */}
                <div className="flex items-center gap-1 bg-stone-950 border border-stone-800 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                    title="縮小 (-)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-2 py-0.5 text-xs font-mono text-stone-200">
                    {Math.round(zoomScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                    title="放大 (+)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer text-xs"
                    title="還原 100%"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFullscreenModalOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
                  title="關閉視窗"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Radar Chart Display */}
            <div className="flex-1 w-full min-h-[300px] sm:min-h-[380px] my-3 relative overflow-hidden flex items-center justify-center bg-stone-950/60 rounded-2xl border border-stone-800/80">
              <div
                className="w-full h-full transition-transform duration-200 origin-center p-2"
                style={{ transform: `scale(${zoomScale})` }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                    <PolarGrid stroke="#44403c" strokeDasharray="3 3" strokeOpacity={0.7} />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={(props) => {
                        const { x, y, payload } = props;
                        const isCurrent = payload.value === activeDimension;
                        return (
                          <text
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`cursor-pointer transition-colors text-sm font-bold ${
                              isCurrent ? 'fill-amber-400' : 'fill-stone-200 hover:fill-amber-200'
                            }`}
                            onClick={() => {
                              setActiveDimension(payload.value);
                              setIsDetailCardOpen(true);
                              setIsFullscreenModalOpen(false);
                            }}
                          >
                            {payload.value}
                          </text>
                        );
                      }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[30, 100]}
                      stroke="#57534e"
                      strokeOpacity={0.4}
                      tick={{ fill: '#78716c', fontSize: 10 }}
                    />
                    <Radar
                      name="命理運勢"
                      dataKey="score"
                      stroke="#f59e0b"
                      strokeWidth={2.8}
                      fill="#f59e0b"
                      fillOpacity={0.32}
                      isAnimationActive={true}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-stone-900 border border-stone-700/90 rounded-xl px-3.5 py-2.5 text-xs shadow-2xl backdrop-blur-md">
                              <div className="flex items-center justify-between gap-3 mb-1">
                                <span className="font-bold text-amber-400 text-sm">{data.subject}運勢</span>
                                <span className="font-mono font-bold text-white bg-amber-600/30 px-2 py-0.5 rounded text-xs">
                                  {data.score} 分
                                </span>
                              </div>
                              <div className="text-stone-300 text-xs font-medium mb-1">
                                評級：<span className="text-emerald-400">{data.level}</span>
                              </div>
                              <p className="text-stone-300 text-xs max-w-[240px] leading-relaxed">
                                {data.highlight}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Dimension Quick Select Bar */}
            <div className="grid grid-cols-5 gap-2 pt-1">
              {radarResult.dimensions.map((dim) => {
                const isSelected = dim.dimension === activeDimension;
                return (
                  <button
                    key={dim.dimension}
                    type="button"
                    onClick={() => {
                      setActiveDimension(dim.dimension);
                      setIsDetailCardOpen(true);
                      setIsFullscreenModalOpen(false);
                    }}
                    className={`py-2 px-1 text-center rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <div>{dim.dimension}</div>
                    <div className="font-mono text-[11px] font-semibold text-amber-400">{dim.score}分</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
