import { UserBirthData } from '../types/destiny';
import { calculateDailyTrend, DailyTrendData } from '../utils/dailyTrendEngine';

const STORAGE_KEY_ENABLED = 'jack_ai_daily_notif_enabled';
const STORAGE_KEY_TIME = 'jack_ai_daily_notif_time';
const STORAGE_KEY_LAST_DATE = 'jack_ai_daily_notif_last_date';

// 羅盤/時空指針高解析 SVG Data URL 作為通知圖示
const COMPASS_ICON_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="30" fill="%230c0a09" stroke="%23eab308" stroke-width="2.5"/><circle cx="32" cy="32" r="24" fill="none" stroke="%2378350f" stroke-width="1.5" stroke-dasharray="2,2"/><polygon points="32,10 38,32 32,28" fill="%23ef4444"/><polygon points="32,54 26,32 32,28" fill="%23e2e8f0"/><polygon points="32,10 26,32 32,28" fill="%23b91c1c"/><polygon points="32,54 38,32 32,28" fill="%2394a3b8"/><circle cx="32" cy="32" r="4" fill="%23eab308"/><circle cx="32" cy="32" r="1.5" fill="%23000"/></svg>`;

export interface DailyNotificationConfig {
  supported: boolean;
  permission: NotificationPermission | 'unsupported';
  enabled: boolean;
  morningTime: string; // e.g. "08:00"
  lastNotifiedDate: string | null;
}

/**
 * 檢查瀏覽器是否支援 Notification API
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * 取得當前通知授權狀態
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * 向使用者請求通知權限
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      // 預設開啟自動推播
      localStorage.setItem(STORAGE_KEY_ENABLED, 'true');
    }
    return perm;
  } catch (err) {
    console.error('Request notification permission failed:', err);
    return Notification.permission;
  }
}

/**
 * 讀取通知設定
 */
export function getDailyNotificationConfig(): DailyNotificationConfig {
  const supported = isNotificationSupported();
  const permission = supported ? Notification.permission : 'unsupported';

  let enabled = true;
  const storedEnabled = localStorage.getItem(STORAGE_KEY_ENABLED);
  if (storedEnabled !== null) {
    enabled = storedEnabled === 'true';
  } else {
    // 若已授權則預設 true，否則亦為 true 等待授權
    enabled = true;
  }

  const morningTime = localStorage.getItem(STORAGE_KEY_TIME) || '08:00';
  const lastNotifiedDate = localStorage.getItem(STORAGE_KEY_LAST_DATE);

  return {
    supported,
    permission,
    enabled,
    morningTime,
    lastNotifiedDate,
  };
}

/**
 * 更新通知設定
 */
export function saveDailyNotificationConfig(updates: { enabled?: boolean; morningTime?: string }): DailyNotificationConfig {
  if (updates.enabled !== undefined) {
    localStorage.setItem(STORAGE_KEY_ENABLED, updates.enabled ? 'true' : 'false');
  }
  if (updates.morningTime !== undefined) {
    localStorage.setItem(STORAGE_KEY_TIME, updates.morningTime);
  }
  return getDailyNotificationConfig();
}

/**
 * 發送瀏覽器原生 Notification
 */
export function sendBrowserNotification(
  trendData: DailyTrendData,
  onOpen?: () => void
): Notification | null {
  if (!isNotificationSupported()) return null;
  if (Notification.permission !== 'granted') return null;

  try {
    const notification = new Notification(trendData.notificationTitle, {
      body: trendData.notificationBody,
      icon: COMPASS_ICON_SVG,
      badge: COMPASS_ICON_SVG,
      tag: `jack-daily-trend-${trendData.dateString}`,
      requireInteraction: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      if (onOpen) onOpen();
    };

    return notification;
  } catch (e) {
    console.error('Failed to create browser notification:', e);
    return null;
  }
}

/**
 * 格式化當前日期 YYYY-MM-DD
 */
function getTodayDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 檢查是否已達早晨推播時間且今天尚未推送
 */
export function checkAndTriggerMorningNotification(
  birthData: UserBirthData,
  onOpen?: () => void
): DailyTrendData | null {
  if (!isNotificationSupported()) return null;
  if (Notification.permission !== 'granted') return null;

  const config = getDailyNotificationConfig();
  if (!config.enabled) return null;

  const now = new Date();
  const todayKey = getTodayDateKey(now);

  // 若今天已經推送過，則跳過
  if (config.lastNotifiedDate === todayKey) {
    return null;
  }

  // 比對當前時間是否已達到設定的早晨推播時分
  const [targetHour, targetMinute] = (config.morningTime || '08:00').split(':').map(Number);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const targetMinutes = targetHour * 60 + targetMinute;

  // 若當前時間已經過或正好達到早晨推播時間點
  if (currentMinutes >= targetMinutes) {
    const trendData = calculateDailyTrend(birthData, now);
    sendBrowserNotification(trendData, onOpen);

    // 記錄今日已推送
    localStorage.setItem(STORAGE_KEY_LAST_DATE, todayKey);
    return trendData;
  }

  return null;
}

/**
 * 手動發送測試推播 (供使用者立即體驗瀏覽器推播效果)
 */
export function sendTestNotification(
  birthData: UserBirthData,
  onOpen?: () => void
): { success: boolean; trendData?: DailyTrendData; reason?: string } {
  if (!isNotificationSupported()) {
    return { success: false, reason: '您的瀏覽器不支援 Notification API' };
  }

  if (Notification.permission === 'denied') {
    return { success: false, reason: '通知權限已被封鎖，請於網址列鎖頭圖示中允許通知' };
  }

  if (Notification.permission === 'default') {
    return { success: false, reason: '尚未授權通知權限，請先點擊「開啟通知授權」' };
  }

  const now = new Date();
  const trendData = calculateDailyTrend(birthData, now);
  const notif = sendBrowserNotification(trendData, onOpen);

  if (notif) {
    return { success: true, trendData };
  } else {
    return { success: false, reason: '發送推播失敗，請檢查系統或分頁通知權限' };
  }
}

/**
 * 啟動早晨自動推播排程監聽器 (頁面開啟/背景喚醒時自動檢測)
 */
export function initMorningNotificationScheduler(
  birthData: UserBirthData,
  onOpen?: () => void
): () => void {
  // 1. 初次掛載立即檢測
  checkAndTriggerMorningNotification(birthData, onOpen);

  // 2. 每 30 秒定期檢查一次
  const intervalId = setInterval(() => {
    checkAndTriggerMorningNotification(birthData, onOpen);
  }, 30000);

  // 3. 當使用者切換分頁回來到此視窗或喚醒電腦時立即檢測
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      checkAndTriggerMorningNotification(birthData, onOpen);
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('focus', handleVisibilityChange);

  // 回傳取消排程的清理函數
  return () => {
    clearInterval(intervalId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('focus', handleVisibilityChange);
  };
}
