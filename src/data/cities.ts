import { LocationData } from '../types/destiny';

export interface RegionGroup {
  name: string;
  cities: LocationData[];
}

export const REGION_CITIES: RegionGroup[] = [
  {
    name: '台灣主要縣市 (UTC+8)',
    cities: [
      { country: '台灣', region: '北部', city: '台北市 (Taipei)', longitude: 121.5654, latitude: 25.0330, timezone: 8 },
      { country: '台灣', region: '北部', city: '新北市 (New Taipei)', longitude: 121.4657, latitude: 25.0123, timezone: 8 },
      { country: '台灣', region: '北部', city: '桃園市 (Taoyuan)', longitude: 121.3013, latitude: 24.9937, timezone: 8 },
      { country: '台灣', region: '北部', city: '新竹市 (Hsinchu)', longitude: 120.9688, latitude: 24.8039, timezone: 8 },
      { country: '台灣', region: '北部', city: '新竹縣 (Hsinchu Co.)', longitude: 121.0180, latitude: 24.8383, timezone: 8 },
      { country: '台灣', region: '北部', city: '基隆市 (Keelung)', longitude: 121.7462, latitude: 25.1325, timezone: 8 },
      { country: '台灣', region: '中部', city: '台中市 (Taichung)', longitude: 120.6736, latitude: 24.1477, timezone: 8 },
      { country: '台灣', region: '中部', city: '苗栗縣 (Miaoli)', longitude: 120.8209, latitude: 24.5650, timezone: 8 },
      { country: '台灣', region: '中部', city: '彰化縣 (Changhua)', longitude: 120.5441, latitude: 24.0754, timezone: 8 },
      { country: '台灣', region: '中部', city: '南投縣 (Nantou)', longitude: 120.6840, latitude: 23.9157, timezone: 8 },
      { country: '台灣', region: '中部', city: '雲林縣 (Yunlin)', longitude: 120.4313, latitude: 23.7092, timezone: 8 },
      { country: '台灣', region: '南部', city: '台南市 (Tainan)', longitude: 120.2270, latitude: 22.9997, timezone: 8 },
      { country: '台灣', region: '南部', city: '高雄市 (Kaohsiung)', longitude: 120.3120, latitude: 22.6163, timezone: 8 },
      { country: '台灣', region: '南部', city: '嘉義市 (Chiayi City)', longitude: 120.4473, latitude: 23.4800, timezone: 8 },
      { country: '台灣', region: '南部', city: '嘉義縣 (Chiayi Co.)', longitude: 120.2929, latitude: 23.4518, timezone: 8 },
      { country: '台灣', region: '南部', city: '屏東縣 (Pingtung)', longitude: 120.4862, latitude: 22.6761, timezone: 8 },
      { country: '台灣', region: '東部', city: '宜蘭縣 (Yilan)', longitude: 121.7565, latitude: 24.7570, timezone: 8 },
      { country: '台灣', region: '東部', city: '花蓮縣 (Hualien)', longitude: 121.6067, latitude: 23.9912, timezone: 8 },
      { country: '台灣', region: '東部', city: '台東縣 (Taitung)', longitude: 121.1444, latitude: 22.7583, timezone: 8 },
      { country: '台灣', region: '離島', city: '澎湖縣 (Penghu)', longitude: 119.5664, latitude: 23.5658, timezone: 8 },
      { country: '台灣', region: '離島', city: '金門縣 (Kinmen)', longitude: 118.3186, latitude: 24.4367, timezone: 8 },
    ],
  },
  {
    name: '港澳與亞洲地區',
    cities: [
      { country: '香港', region: '亞洲', city: '香港特區 (Hong Kong)', longitude: 114.1694, latitude: 22.3193, timezone: 8 },
      { country: '澳門', region: '亞洲', city: '澳門特區 (Macau)', longitude: 113.5439, latitude: 22.1987, timezone: 8 },
      { country: '新加坡', region: '亞洲', city: '新加坡 (Singapore)', longitude: 103.8198, latitude: 1.3521, timezone: 8 },
      { country: '馬來西亞', region: '亞洲', city: '吉隆坡 (Kuala Lumpur)', longitude: 101.6869, latitude: 3.1390, timezone: 8 },
      { country: '日本', region: '亞洲', city: '東京 (Tokyo)', longitude: 139.6917, latitude: 35.6895, timezone: 9 },
      { country: '日本', region: '亞洲', city: '大阪 (Osaka)', longitude: 135.5023, latitude: 34.6937, timezone: 9 },
      { country: '韓國', region: '亞洲', city: '首爾 (Seoul)', longitude: 126.9780, latitude: 37.5665, timezone: 9 },
      { country: '中國', region: '亞洲', city: '北京 (Beijing)', longitude: 116.4074, latitude: 39.9042, timezone: 8 },
      { country: '中國', region: '亞洲', city: '上海 (Shanghai)', longitude: 121.4737, latitude: 31.2304, timezone: 8 },
      { country: '中國', region: '亞洲', city: '廣州 (Guangzhou)', longitude: 113.2644, latitude: 23.1291, timezone: 8 },
      { country: '中國', region: '亞洲', city: '深圳 (Shenzhen)', longitude: 114.0579, latitude: 22.5431, timezone: 8 },
      { country: '中國', region: '亞洲', city: '成都 (Chengdu)', longitude: 104.0665, latitude: 30.5728, timezone: 8 },
    ],
  },
  {
    name: '歐美與其他地區',
    cities: [
      { country: '美國', region: '北美', city: '舊金山 (San Francisco)', longitude: -122.4194, latitude: 37.7749, timezone: -8 },
      { country: '美國', region: '北美', city: '洛杉磯 (Los Angeles)', longitude: -118.2437, latitude: 34.0522, timezone: -8 },
      { country: '美國', region: '北美', city: '紐約 (New York)', longitude: -74.0060, latitude: 40.7128, timezone: -5 },
      { country: '加拿大', region: '北美', city: '溫哥華 (Vancouver)', longitude: -123.1207, latitude: 49.2827, timezone: -8 },
      { country: '加拿大', region: '北美', city: '多倫多 (Toronto)', longitude: -79.3832, latitude: 43.6532, timezone: -5 },
      { country: '英國', region: '歐洲', city: '倫敦 (London)', longitude: -0.1278, latitude: 51.5074, timezone: 0 },
      { country: '澳洲', region: '大洋洲', city: '雪梨 (Sydney)', longitude: 151.2093, latitude: -33.8688, timezone: 10 },
    ],
  },
];

export const DEFAULT_LOCATION: LocationData = REGION_CITIES[0].cities[0]; // Taipei
