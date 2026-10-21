import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Compass,
  Send,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Trash2,
  SlidersHorizontal,
  Settings,
  Key,
  X,
  Check,
  Cpu,
  Bell,
  BellRing,
  Menu,
  Layers,
  Table2,
  PanelRight,
  PanelRightClose,
} from 'lucide-react';
import { UserBirthData, ChatMessage } from '../types/destiny';
import { generateAstrologyJSON } from '../utils/astrologyGenerator';
import { DestinyRadarVisualizer } from './DestinyRadarVisualizer';
import { DestinyInfoMenu } from './DestinyInfoMenu';
import { calculateDailyTrend } from '../utils/dailyTrendEngine';
import {
  getDailyNotificationConfig,
  initMorningNotificationScheduler,
  DailyNotificationConfig
} from '../services/dailyNotificationService';
import { DailyTrendModal } from './DailyTrendModal';
import { DailyTrendBanner } from './DailyTrendBanner';
import { BaZiChartPanel } from './BaZiChartPanel';
import { ChatSkeletonScreen } from './ChatSkeletonScreen';

interface ChatInterfaceProps {
  birthData: UserBirthData;
  onEditBirthData: () => void;
}

const STORAGE_KEY_API_CONFIG = 'jack_ai_llm_config';

interface LLMConfig {
  provider: 'gemini' | 'deepinfra';
  apiKey: string;
}

const EMOTIONAL_CHIPS_ZH = [
  '🏎️ 七合一人生的拉力賽怎麼看',
  '🧭 今日流日關鍵運勢',
  '💍 我跟我太太的感情未來走勢',
  '💔 夫妻常吵架冷戰怎麼破局',
  '💰 最近錢包卡卡的',
  '❤️ 感情好累想看夫妻宮',
  '🤯 工作壓力大',
  '🧭 想換工作該衝嗎',
  '🌙 最近心神不寧',
  '🎯 適合合夥創業嗎',
  '⚖️ 這段關係值得繼續嗎',
];

const EMOTIONAL_CHIPS_TH = [
  '🌱 การปลูกต้นไม้แห่งชีวิต (ภาพรวม)',
  '🧭 แนวโน้มพลังงานประจำวัน',
  '💍 อนาคตความสัมพันธ์และความรัก',
  '💔 ทะเลาะกันบ่อยจะแก้ไขอย่างไร',
  '💰 การเงินติดขัดต้องปรับอย่างไร',
  '❤️ เหนื่อยกับความรัก ควรทำอย่างไร',
  '🤯 ความเครียดจากการทำงานสูงมาก',
  '🧭 ควรเปลี่ยนงานตอนนี้หรือไม่',
  '🌙 จิตใจไม่สงบ นอนไม่หลับ',
  '🎯 ร่วมหุ้นทำธุรกิจดีหรือไม่',
  '⚖️ ความสัมพันธ์นี้ควรไปต่อไหม',
];

const INITIAL_WELCOME = (data: UserBirthData, lang: 'zh-TW' | 'th-TH' = 'zh-TW') => {
  if (lang === 'th-TH') {
    return `🧭 **สวัสดีครับ ผมคืออาจารย์แจ็ค (Jack) โครงสร้างพลังงานและพิมพ์เขียวชีวิตของคุณได้รับการปรับเทียบเรียบร้อยแล้ว**

- เจ้าชะตา: ${data.gender === '男' ? 'เพศชาย' : 'เพศหญิง'} · สถานที่เกิด: ${data.birthCity}
- แผนผังพลังงานพื้นฐาน: ปี ${data.gps.baziYear} · เดือน ${data.gps.baziMonth} · วัน ${data.gps.baziDay} · เวลา ${data.gps.baziHour}
- พิมพ์เขียวชีวิต: ${data.gps.mingPalaceName} · ดวงดาวหลัก【${data.gps.majorStarsDisplay}】

ผมเน้นความชัดเจน ตรงจุด ไม่พูดอ้อมค้อม และไม่คาดเดาไปเรื่อย
คุณมีคำถาม ปัญหาการทำงาน หรือความสัมพันธ์ที่ต้องการทางออกอย่างไร? สามารถพิมพ์ด้านล่างหรือเลือกหัวข้อแนะนำได้ทันทีครับ`;
  }
  return `🧭 **我是 Jack 老師。你的先天 GPS 時空盤與五維命理雷達已在後台完成校準。**

- 命主：${data.gender === '男' ? '乾造 (男命)' : '坤造 (女命)'} · 生於 ${data.birthCity}
- 四柱排盤：${data.gps.baziYear}年 ${data.gps.baziMonth}月 ${data.gps.baziDay}日 ${data.gps.baziHour}時
- 紫微斗數：${data.gps.mingPalaceName} · 主星【${data.gps.majorStarsDisplay}】

我不繞圈子、不講空話，也不隨便揣測你的過去。
你想問什麼具體情境、工作卡點或感情疑惑？請直接在下方輸入，或點選下方推薦標籤，我會第一時間給出核心解答與當下可行的指針。

*(💡 提示：你的出生四柱、先天 GPS 時空盤、五維運勢雷達圖與今日流日指針，已完整收合於右上角「☰ 命盤選單」中，隨時可點開查閱與深度分析)*`;
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ birthData, onEditBirthData }) => {
  // 當前語言環境 state ('zh-TW' | 'th-TH')
  const [currentLanguage, setCurrentLanguage] = useState<'zh-TW' | 'th-TH'>(() => {
    try {
      const saved = localStorage.getItem('jack_ai_language');
      if (saved === 'th-TH' || saved === 'zh-TW') return saved;
    } catch {
      // Ignore
    }
    return 'zh-TW';
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('jack_ai_chat_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return [
      {
        id: 'msg_init',
        role: 'assistant',
        content: INITIAL_WELCOME(birthData, 'zh-TW'),
        timestamp: Date.now(),
      },
    ];
  });

  // 持久化語言選擇
  useEffect(() => {
    try {
      localStorage.setItem('jack_ai_language', currentLanguage);
    } catch {
      // Ignore
    }
  }, [currentLanguage]);

  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showGPSDetails, setShowGPSDetails] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [showDailyTrendModal, setShowDailyTrendModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [showBaziSidebar, setShowBaziSidebar] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1200;
    }
    return false;
  });

  // Daily Trend calculation (memoized by user's birth data)
  const dailyTrendData = useMemo(() => calculateDailyTrend(birthData), [birthData]);

  // Daily Notification configuration state
  const [notifConfig, setNotifConfig] = useState<DailyNotificationConfig>(() =>
    getDailyNotificationConfig()
  );

  // Morning Notification Scheduler: checks time and triggers browser Notification
  useEffect(() => {
    const cleanup = initMorningNotificationScheduler(birthData, () => {
      setShowDailyTrendModal(true);
    });
    return cleanup;
  }, [birthData]);

  // LLM Configuration state
  const [llmConfig, setLlmConfig] = useState<LLMConfig>(() => {
    if (birthData.deepInfraApiKey) {
      return {
        provider: 'deepinfra',
        apiKey: birthData.deepInfraApiKey,
      };
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY_API_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          provider: parsed.provider || 'deepinfra',
          apiKey: parsed.apiKey || '',
        };
      }
    } catch {
      // Ignore
    }
    return {
      provider: 'deepinfra',
      apiKey: '',
    };
  });

  const [tempProvider, setTempProvider] = useState<'gemini' | 'deepinfra'>(llmConfig.provider);
  const [tempApiKey, setTempApiKey] = useState(llmConfig.apiKey);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const isAutoScrollingRef = useRef(false);

  // 監聽使用者滾動行為：判斷是否手動往上滑動查閱歷史
  const handleScroll = () => {
    if (isAutoScrollingRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    // 距離底部超過 90px 即視為手動往上查看歷史訊息
    setIsUserScrolledUp(distanceFromBottom > 90);
  };

  // 穩定平滑/瞬間自動滾動至最新訊息
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth', force = false) => {
    if (!force && isUserScrolledUp) return;
    const container = scrollContainerRef.current;
    if (container) {
      if (behavior === 'auto') {
        container.scrollTop = container.scrollHeight;
      } else {
        isAutoScrollingRef.current = true;
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
        setTimeout(() => {
          isAutoScrollingRef.current = false;
        }, 280);
      }
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }
  };

  // 當訊息更新或串流中時，執行自動滾動至最新對話
  useEffect(() => {
    if (isStreaming) {
      // 串流傳輸中：若使用者未手動往上滑動，以 requestAnimationFrame 瞬間即時貼底，避免 smooth 造成頓挫
      if (!isUserScrolledUp) {
        requestAnimationFrame(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
          }
        });
      }
    } else {
      // 非串流或新訊息產生/發送完畢時，平滑滾動至底端
      scrollToBottom('smooth');
    }
  }, [messages, isStreaming, isUserScrolledUp]);

  // Save messages to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('jack_ai_chat_messages', JSON.stringify(messages));
    } catch {
      // Ignore
    }
  }, [messages]);

  // Handle saving API config
  const handleSaveApiConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: LLMConfig = {
      provider: tempProvider,
      apiKey: tempApiKey.trim(),
    };
    setLlmConfig(updated);
    try {
      localStorage.setItem(STORAGE_KEY_API_CONFIG, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
      setShowApiSettings(false);
    }, 1200);
  };

  // Module 3: callLLM implementation (加入語言參數 currentLanguage = 'zh-TW')
  const callLLM = async (
    userInput: string,
    chatHistory: ChatMessage[],
    astrologyJSON: any,
    onDelta: (text: string) => void,
    currentLanguage: 'zh-TW' | 'th-TH' = 'zh-TW',
    customApiKey?: string
  ) => {
    // 智能判斷輸出模式 (符合 v14.0 規範)
    let outputMode = '【深度命盤診斷模式】';
    if (
      userInput.includes('怎麼算') ||
      userInput.includes('原理') ||
      userInput.includes('准吗') ||
      userInput.includes('准嗎') ||
      userInput.includes('怎么算') ||
      userInput.includes('怎麼看') ||
      userInput.includes('ยังไง') ||
      userInput.includes('หลักการ')
    ) {
      outputMode = '【概念轉譯與科普模式】';
    } else if (
      userInput.includes('要不要') ||
      userInput.includes('该不该') ||
      userInput.includes('該不該') ||
      userInput.includes('何时') ||
      userInput.includes('何時') ||
      userInput.includes('該衝嗎') ||
      userInput.includes('衝不衝') ||
      userInput.includes('去留') ||
      userInput.includes('ควร') ||
      userInput.includes('เมื่อไหร่')
    ) {
      outputMode = '【實戰決策導航模式】';
    }

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInput,
        chatHistory: chatHistory.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        astrologyJSON,
        birthData,
        currentLanguage,
        outputMode,
        customApiKey,
      }),
    });

    if (!response.ok || !response.body) {
      const errMsg =
        currentLanguage === 'th-TH'
          ? 'การเชื่อมต่อไม่เสถียร กรุณาลองใหม่อีกครั้ง'
          : `伺服器回應異常 (${response.status})`;
      throw new Error(errMsg);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        if (buffer.trim()) {
          const cleanLine = buffer.trim();
          if (cleanLine.startsWith('data: ')) {
            const dataStr = cleanLine.slice(6);
            if (dataStr !== '[DONE]') {
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  onDelta(parsed.text);
                }
              } catch {
                // Ignore
              }
            }
          }
        }
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const cleanLine = line.trim();
        if (cleanLine.startsWith('data: ')) {
          const dataStr = cleanLine.slice(6);
          if (dataStr === '[DONE]') {
            break;
          }
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.text) {
              onDelta(parsed.text);
            }
          } catch {
            // Ignore partial chunks
          }
        }
      }
    }
  };

  // Reset chat logic (clears localStorage and re-initializes to welcome message)
  const executeResetChat = () => {
    const freshMessages: ChatMessage[] = [
      {
        id: 'msg_init_' + Date.now(),
        role: 'assistant',
        content: INITIAL_WELCOME(birthData, currentLanguage),
        timestamp: Date.now(),
      },
    ];
    setMessages(freshMessages);
    setInputValue('');
    setIsStreaming(false);
    setShowClearConfirmModal(false);
    try {
      localStorage.setItem('jack_ai_chat_messages', JSON.stringify(freshMessages));
    } catch {
      // Ignore
    }
  };

  // Open confirmation modal (avoids window.confirm in iframes)
  const handleClearChat = () => {
    setShowClearConfirmModal(true);
  };

  // Real LLM Streaming Handler via callLLM
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputValue).trim();
    if (!text || isStreaming) return;

    // 智能識別：若使用者輸入「清空」、「重新開局」、「清空對話重新開局」，直接執行重置
    const isResetCommand = /^(清空|重新開局|清空對話|重開|重置|清空對話重新開局|無法.*清空.*開局|ล้างการสนทนา|รีเซ็ต)$/i.test(text.replace(/\s+/g, ''));
    if (isResetCommand) {
      executeResetChat();
      return;
    }

    const userMsg: ChatMessage = {
      id: 'msg_user_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const priorHistory = [...messages];
    const newMessages = [...priorHistory, userMsg];
    setMessages(newMessages);
    setInputValue('');
    setIsStreaming(true);
    setIsUserScrolledUp(false);
    setTimeout(() => {
      scrollToBottom('smooth', true);
    }, 40);

    const aiMsgId = 'msg_ai_' + Date.now();
    // Add empty message for real-time accumulation
    setMessages((prev) => [
      ...prev,
      {
        id: aiMsgId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      },
    ]);

    try {
      const effectiveAstrologyJSON =
        generateAstrologyJSON(birthData, text) || birthData.astrologyJSON;
      let accumulated = '';

      await callLLM(
        text,
        priorHistory,
        effectiveAstrologyJSON,
        (delta) => {
          accumulated += delta;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId ? { ...m, content: accumulated } : m
            )
          );
        },
        currentLanguage,
        llmConfig.apiKey || birthData.deepInfraApiKey || undefined
      );

      // Final check
      if (!accumulated) {
        const fallbackNotice =
          currentLanguage === 'th-TH'
            ? 'การเชื่อมต่อไม่เสถียร กรุณาลองใหม่อีกครั้ง'
            : '🧭 **網路連線不穩定，Jack 老師正在重新校準能量場，請稍後再試一次。**';
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? {
                  ...m,
                  content: fallbackNotice,
                }
              : m
          )
        );
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackNotice =
        currentLanguage === 'th-TH'
          ? 'การเชื่อมต่อไม่เสถียร กรุณาลองใหม่อีกครั้ง'
          : '🧭 **網路連線不穩定，Jack 老師正在重新校準能量場，請稍後再試一次。**';
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                content: fallbackNotice,
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  // Handle keyboard submission (Desktop Enter, Shift+Enter for newline)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-stone-950 text-stone-100 overflow-hidden">
      {/* Top Bar with Brand, BaZi Table Toggle and Destiny Info Menu Button */}
      <header className="border-b border-stone-800 bg-stone-900/90 backdrop-blur shrink-0 z-20">
        <div className="w-full px-3.5 sm:px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-800 border border-amber-600/30 flex items-center justify-center text-amber-500 shadow-inner shrink-0">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm sm:text-base tracking-wide text-stone-100 truncate">
                  Jack 老師 AI 命理對策室
                </span>
                <span className="hidden md:inline-block text-[10px] px-2 py-0.5 rounded bg-amber-950/80 border border-amber-700/40 text-amber-300 shrink-0">
                  {llmConfig.provider === 'deepinfra' ? 'DeepSeek-V3' : 'Gemini'}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 truncate">
                {birthData.gender === '男' ? '乾造' : '坤造'} · {birthData.gps.baziYear}年 · {birthData.birthCity} · {birthData.birthHour}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Selector: zh-TW / th-TH */}
            <div className="flex items-center rounded-xl bg-stone-800/90 p-0.5 border border-stone-700/80 text-xs shadow-inner">
              <button
                type="button"
                onClick={() => setCurrentLanguage('zh-TW')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer text-xs font-medium ${
                  currentLanguage === 'zh-TW'
                    ? 'bg-amber-600 text-white shadow-sm font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="繁體中文模式 (zh-TW)"
              >
                繁中
              </button>
              <button
                type="button"
                onClick={() => setCurrentLanguage('th-TH')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer text-xs font-medium ${
                  currentLanguage === 'th-TH'
                    ? 'bg-amber-600 text-white shadow-sm font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="泰文模式 (th-TH - ภาษาไทย)"
              >
                ไทย
              </button>
            </div>

            {/* BaZi Four Pillars Sidebar Toggle Button */}
            <button
              type="button"
              onClick={() => setShowBaziSidebar(!showBaziSidebar)}
              className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
                showBaziSidebar
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm shadow-amber-500/20 font-bold'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300 border-stone-700 hover:border-amber-500/40'
              }`}
              title="開啟/收合右側八字四柱命盤表格"
            >
              <Table2 className="w-3.5 h-3.5 text-current" />
              <span>八字命盤</span>
              <span className="hidden md:inline-block text-[10px] px-1 py-0.2 rounded bg-black/20 text-current">
                {showBaziSidebar ? '收合' : '側欄'}
              </span>
            </button>

            {/* Clear Chat quick button */}
            <button
              type="button"
              onClick={handleClearChat}
              className="text-xs px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-rose-950/40 text-stone-300 hover:text-rose-300 border border-stone-700 hover:border-rose-700/50 flex items-center gap-1.5 transition-all cursor-pointer font-medium"
              title="清空歷史對話記錄並重新開局"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">清空重開</span>
            </button>

            {/* Menu Trigger Button: Opens Menu with Radar, GPS, Daily Trend, Settings */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="text-xs px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 hover:border-amber-400 flex items-center gap-2 transition-all cursor-pointer shadow-sm group font-medium"
              title="開啟命盤、五維雷達與個人資訊選單"
            >
              <Menu className="w-4 h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-200" />
              <span className="hidden sm:inline">選單</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300">
                雷達·設定
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Menu Drawer containing Destiny Radar, Natal GPS, Daily Trend & Settings */}
      <DestinyInfoMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        birthData={birthData}
        onEditBirthData={onEditBirthData}
        dailyTrendData={dailyTrendData}
        notifConfig={notifConfig}
        onOpenDailyTrendModal={() => setShowDailyTrendModal(true)}
        onOpenApiSettings={() => {
          setTempProvider(llmConfig.provider);
          setTempApiKey(llmConfig.apiKey);
          setShowApiSettings(true);
        }}
        onClearChat={handleClearChat}
        onSelectPrompt={(prompt) => handleSendMessage(prompt)}
        onOpenBaziSidebar={() => setShowBaziSidebar(true)}
        llmProvider={llmConfig.provider}
        currentLanguage={currentLanguage}
        onSelectLanguage={(lang) => setCurrentLanguage(lang)}
      />

      {/* 今日流日關鍵趨勢與早晨推播設定彈窗 (Daily Trend Modal) */}
      <DailyTrendModal
        isOpen={showDailyTrendModal}
        onClose={() => setShowDailyTrendModal(false)}
        trendData={dailyTrendData}
        birthData={birthData}
        notifConfig={notifConfig}
        onConfigChange={setNotifConfig}
        onAskJack={(prompt) => handleSendMessage(prompt)}
      />

      {/* API Configuration Modal */}
      {showApiSettings && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowApiSettings(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-semibold text-stone-100">
                外部 LLM API 與模型設定
              </h2>
            </div>

            <p className="text-xs text-stone-400 mb-4 leading-relaxed">
              系統支援 Google Gemini 與 DeepInfra (DeepSeek-V3 串接)。若伺服器已有配置環境變數，可直接留空使用；亦可填寫您專屬的 API Key 進行直連。
            </p>

            <form onSubmit={handleSaveApiConfig} className="space-y-4">
              {/* Provider Selection */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  選擇推理模型引擎
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTempProvider('deepinfra')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                      tempProvider === 'deepinfra'
                        ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    DeepSeek-V3 (DeepInfra)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempProvider('gemini')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                      tempProvider === 'gemini'
                        ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Google Gemini
                  </button>
                </div>
              </div>

              {/* API Key Input */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  {tempProvider === 'gemini' ? 'Gemini API Key' : 'DeepInfra API Key'}
                </label>
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder={
                    tempProvider === 'gemini'
                      ? '留空將使用伺服器預設 GEMINI_API_KEY'
                      : '輸入 DeepInfra API Key (Bearer Token)'
                  }
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <span className="block text-[11px] text-stone-500 mt-1">
                  密鑰僅加密保留於您本機瀏覽器 LocalStorage，並透過伺服器安全轉發，不外洩。
                </span>
              </div>

              {saveSuccessNotice && (
                <div className="p-2.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>API 設定已成功更新儲存！</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApiSettings(false)}
                  className="px-4 py-2 text-xs rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-500 shadow-md cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>儲存設定</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Workspace Area: Left Chat Column + Right BaZi Sidebar */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        {/* Left Column: Chat Conversation Stream & Sticky Input */}
        <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden relative">
          {/* Messages Scroll Area with ref and scroll listener */}
          <main
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 min-h-0 overflow-y-auto px-4 py-6 scroll-smooth touch-scroll overscroll-contain"
          >
            <div className="max-w-3xl mx-auto space-y-5">
              {messages.length > 1 && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 text-xs text-stone-400">
                  <span>💡 目前顯示歷史對話紀錄。若有舊版快取，可隨時重置。</span>
                  <button
                    type="button"
                    onClick={handleClearChat}
                    className="text-amber-400 hover:text-amber-300 font-medium underline flex items-center gap-1 cursor-pointer shrink-0 ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>清空對話重新開局</span>
                  </button>
                </div>
              )}

              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                const isLatest = index === messages.length - 1;

                // 若為助理訊息且內容為空，展示全息五模組推算骨架螢幕 (Skeleton Screen)
                if (!isUser && msg.content === '') {
                  return <ChatSkeletonScreen key={msg.id} />;
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-stone-800 border border-amber-600/30 flex items-center justify-center text-amber-500 shrink-0 mt-1 shadow-sm">
                        <Compass className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3.5 text-sm sm:text-base leading-relaxed ${
                        isUser
                          ? 'bg-amber-600 text-white rounded-br-none shadow-md'
                          : 'bg-stone-900 border border-stone-800/90 text-stone-100 rounded-bl-none shadow-md'
                      }`}
                    >
                      {/* Clean Markdown formatted paragraphs */}
                      <div className="whitespace-pre-wrap break-words space-y-1">
                        {msg.content.split('\n').map((line, idx) => {
                          if (!line.trim()) {
                            return <div key={idx} className="h-2" />;
                          }
                          const formatted = line.replace(/\*\*(.*?)\*\*/g, '$1');
                          const isHeader =
                            line.startsWith('🧭') ||
                            line.startsWith('💰') ||
                            line.startsWith('❤️') ||
                            line.startsWith('💼') ||
                            line.startsWith('🌙') ||
                            line.startsWith('⚡') ||
                            line.startsWith('💡') ||
                            line.startsWith('⚠️');
                          const isEmpowerment =
                            line.includes('以上推算由 Jack 老師的系統提供') ||
                            line.includes('方向盤在你手裡');

                          return (
                            <p
                              key={idx}
                              className={`${
                                isHeader && !isUser
                                  ? 'font-semibold text-amber-300 text-sm sm:text-base pt-1'
                                  : isEmpowerment && !isUser
                                  ? 'pt-3 mt-2 border-t border-stone-800 text-xs sm:text-sm text-amber-400/90 font-medium'
                                  : ''
                              }`}
                            >
                              {formatted}
                            </p>
                          );
                        })}

                        {/* 助理訊息正在串流時，顯示動態金光游標 */}
                        {!isUser && isStreaming && isLatest && (
                          <span className="inline-block w-2 h-4 ml-1.5 bg-amber-400 animate-pulse rounded-sm align-middle shadow-sm shadow-amber-400/50" />
                        )}
                      </div>

                      {/* 連線異常時提供即時重試與清空重開按鈕 */}
                      {!isUser && msg.content.includes('網路連線不穩定') && !isStreaming && (
                        <div className="mt-3 pt-2.5 border-t border-stone-800 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
                              if (lastUserMsg) {
                                handleSendMessage(lastUserMsg.content);
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>重新推算此問題</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleClearChat}
                            className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-rose-950/40 text-stone-300 hover:text-rose-300 border border-stone-700 hover:border-rose-700/50 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <RotateCcw className="w-3 h-3 text-rose-400" />
                            <span>清空對話重新開局</span>
                          </button>
                        </div>
                      )}

                      <div
                        className={`mt-2 text-[10px] text-right ${
                          isUser ? 'text-amber-200' : 'text-stone-400'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>
          </main>

          {/* 浮動「滾動至最新訊息」按鈕 (當使用者往上滑看歷史訊息時出現) */}
          {isUserScrolledUp && (
            <div className="absolute bottom-28 sm:bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-fadeIn">
              <button
                type="button"
                onClick={() => {
                  setIsUserScrolledUp(false);
                  scrollToBottom('smooth', true);
                }}
                className="px-3.5 py-1.5 rounded-full bg-stone-900/95 hover:bg-stone-800 text-amber-300 border border-amber-500/50 hover:border-amber-400 text-xs font-semibold shadow-2xl shadow-black/90 flex items-center gap-2 backdrop-blur hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span>滾動至最新訊息</span>
                {isStreaming && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Bottom Sticky Input Area */}
          <footer className="border-t border-stone-800 bg-stone-900/95 backdrop-blur shrink-0 z-20">
            <div className="max-w-3xl mx-auto px-4 pt-2.5 pb-3 sm:pb-4">
              {/* Quick Emotional Chips (Bilingual: ZH / TH) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
                {(currentLanguage === 'th-TH' ? EMOTIONAL_CHIPS_TH : EMOTIONAL_CHIPS_ZH).map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    disabled={isStreaming}
                    onClick={() => handleSendMessage(chip)}
                    className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 active:bg-amber-600 active:text-white text-stone-300 border border-stone-700/70 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Text Input & Send Button Container */}
              <div className="relative flex items-end gap-2 bg-stone-950 border border-stone-800 rounded-2xl p-2 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-colors shadow-inner">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isStreaming}
                  placeholder={
                    currentLanguage === 'th-TH'
                      ? 'พิมพ์สิ่งที่คุณต้องการถาม หรือเหตุการณ์ที่เกิดขึ้น...'
                      : '把你想問的，或過去發生的事告訴我...'
                  }
                  className="flex-1 bg-transparent text-stone-100 placeholder-stone-600 text-sm sm:text-base px-2 py-1.5 resize-none max-h-32 focus:outline-none scrollbar-thin"
                  style={{ minHeight: '38px' }}
                />

                <button
                  type="button"
                  disabled={!inputValue.trim() || isStreaming}
                  onClick={() => handleSendMessage()}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    inputValue.trim() && !isStreaming
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-900/40 cursor-pointer active:scale-95'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                  title={currentLanguage === 'th-TH' ? 'ส่งข้อความ (Enter)' : '發送訊息 (Enter)'}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[10px] text-stone-400 text-center mt-1.5 hidden sm:block">
                {currentLanguage === 'th-TH'
                  ? 'กด Enter เพื่อส่ง · Shift + Enter ขึ้นบรรทัดใหม่ · ระบบคำนวณและวิเคราะห์แบบเรียลไทม์'
                  : '按 Enter 發送 · Shift + Enter 換行 · 支援真實外部 LLM 深度串流推算'}
              </div>
            </div>
          </footer>
        </div>

        {/* Right Sidebar: BaZi Four Pillars Panel */}
        {showBaziSidebar && (
          <aside
            aria-label="八字四柱命盤側邊欄"
            className="fixed inset-y-0 right-0 z-30 w-full sm:w-[380px] md:w-[410px] xl:w-[450px] sm:relative sm:z-10 border-l border-stone-800 bg-stone-900/98 sm:bg-stone-900/95 shadow-2xl sm:shadow-none flex flex-col h-full transition-all duration-200"
          >
            <BaZiChartPanel
              birthData={birthData}
              onClose={() => setShowBaziSidebar(false)}
              onSelectPrompt={(prompt) => {
                handleSendMessage(prompt);
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  setShowBaziSidebar(false);
                }
              }}
              isSidebarMode={true}
            />
          </aside>
        )}

        {/* Floating Quick Reopen Badge when Sidebar is Closed */}
        {!showBaziSidebar && (
          <button
            type="button"
            onClick={() => setShowBaziSidebar(true)}
            className="fixed right-3 bottom-24 sm:bottom-20 z-20 px-3 py-2 rounded-full bg-stone-900/90 hover:bg-stone-800 border border-amber-500/40 hover:border-amber-400 text-amber-300 shadow-xl shadow-black/60 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold backdrop-blur"
            title="展開八字四柱命盤"
          >
            <Table2 className="w-3.5 h-3.5 text-amber-400" />
            <span>八字命盤</span>
          </button>
        )}
      </div>

      {/* 清空對話確認彈窗 (Custom In-App Modal - 避免 iframe 阻擋原生 confirm) */}
      {showClearConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowClearConfirmModal(false);
          }}
        >
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-slideUp">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-stone-100">
                  清空對話並重新開局？
                </h3>
                <p className="text-xs text-stone-400">
                  此操作將清除所有對話紀錄，重置為初始狀態。
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-300 bg-stone-950/80 border border-stone-800/80 rounded-xl p-3.5 leading-relaxed">
              🧭 您的命主生辰時空盤（{birthData.gender === '男' ? '乾造' : '坤造'} · {birthData.gps.baziYear}年 · {birthData.birthCity}）與排盤數據將完整保留。Jack 老師將重置對話記憶，為您展開全新推演。
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={executeResetChat}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-900/40 cursor-pointer transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>確定清空並重新開局</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
