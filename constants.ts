import { LoadingMessage } from "./types";

export const LOADING_MESSAGES = [
  { text: LoadingMessage.FAT, icon: "🏃" },
  { text: LoadingMessage.LAZY, icon: "😴" },
  { text: LoadingMessage.GYM, icon: "💪" },
  { text: LoadingMessage.REFUSE, icon: "🙅" },
  { text: LoadingMessage.SHARE, icon: "😘" },
  { text: LoadingMessage.LOVE, icon: "📡" },
  { text: LoadingMessage.TASTE, icon: "😋" },
];

export const BUDGET_OPTIONS = [
  { value: "", label: "預算不限" },
  { value: "cheap", label: "$ 便宜 (100以下)" },
  { value: "moderate", label: "$$ 中價位 (100-300)" },
  { value: "expensive", label: "$$$ 豪華 (300-800)" },
  { value: "luxury", label: "$$$$ 慶祝專用 (800+)" },
];

export const QUICK_CATEGORIES = [
  { label: "漢堡", value: "漢堡 Burger", icon: "🍔" },
  { label: "披薩", value: "披薩 Pizza", icon: "🍕" },
  { label: "麵食", value: "拉麵 麵食 Noodles", icon: "🍜" },
  { label: "炸雞", value: "炸雞 Fried Chicken", icon: "🍗" },
  { label: "素食", value: "素食 Vegetarian", icon: "🥗" },
  { label: "甜點", value: "甜點 Cake Dessert", icon: "🍰" },
  { label: "餐酒館", value: "酒吧 餐酒館 Beer Bar", icon: "🍺" },
  { label: "飯食", value: "飯食 Rice", icon: "🍚" },
];

// Curated high-quality food images from Unsplash to ensure the app always looks premium
// These are used when real photos cannot be retrieved or fail to load.
export const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop", // BBQ/Meat
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop", // Pizza
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop", // Salad/Healthy
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop", // Dessert/Cake
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=800&auto=format&fit=crop", // Sandwich/Burger
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop", // Restaurant Interior
  "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=800&auto=format&fit=crop", // Steak
  "https://images.unsplash.com/photo-1547924475-6f7f50b86a04?q=80&w=800&auto=format&fit=crop", // Sushi
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop", // Plating
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop", // Dark Food
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop", // Healthy Bowl
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=800&auto=format&fit=crop", // Comfort Food
  "https://images.unsplash.com/photo-1626808642875-0aa545482dfb?q=80&w=800&auto=format&fit=crop", // Fried Chicken
  "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=800&auto=format&fit=crop", // Pasta
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop", // Noodles
];

export const getConsistentFallbackImage = (name: string) => {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
};