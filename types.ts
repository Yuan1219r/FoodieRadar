export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  summary: string;
  popularity: number;
  imageUrl?: string;
  address?: string;
  distance?: string;
  googleMapsUrl?: string;
  isOpen?: boolean;
  avgPrice: number; // Changed from string to number for precision
}

export interface SearchParams {
  location: string;
  query: string;
  budget: string;
  filters: string;
  voiceInstruction: string;
}

export enum LoadingMessage {
  FAT = "冬天來了 脂肪還會遠嗎？...",
  LAZY = "能吃就不動 肥豬成形中...",
  GYM = "自律吃飯的你 離彭于晏不遠了！",
  REFUSE = "沒關係啊不揪...",
  SHARE = "記得分享給開發者安迪啾咪",
  LOVE = "愛情雷達掃描中...",
  TASTE = "喚醒味蕾巨獸ing..."
}