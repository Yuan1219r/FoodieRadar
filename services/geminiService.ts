import { GoogleGenAI } from "@google/genai";
import { Restaurant, SearchParams } from "../types";
import { getConsistentFallbackImage } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Audio } },
          { text: "Transcribe audio to Traditional Chinese. Return ONLY text." }
        ]
      }
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Audio Transcription Error:", error);
    throw new Error("語音辨識失敗");
  }
};

export const searchRestaurantsWithGemini = async (
  params: SearchParams, 
  existingNames: string[] = []
): Promise<Restaurant[]> => {
  try {
    const { location, query, budget, filters, voiceInstruction } = params;
    const coordMatch = location.match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/);
    
    let toolConfig = undefined;
    let locationPromptStr = `"${location}"`;

    if (coordMatch) {
      toolConfig = { retrievalConfig: { latLng: { latitude: parseFloat(coordMatch[1]), longitude: parseFloat(coordMatch[2]) } } };
      locationPromptStr = "my current location";
    }

    // Map budget to specific search intent
    const budgetMap: Record<string, string> = {
      cheap: "Under 200 TWD", moderate: "200-500 TWD", expensive: "500-1200 TWD", luxury: "Over 1200 TWD"
    };

    // SPEED OPTIMIZATION: 
    // 1. Removed "googleSearch" from tools to prevent slow web reading.
    // 2. Instructed model to ESTIMATE price based on Maps tier ($$->integer) instead of exact menu lookup.
    // 3. Removed requirement for checking "recent blogs".
    const systemInstruction = `You are Ψ(￣▽￣)Ψ, a high-speed food finder.
    Time: ${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}.
    Location: ${locationPromptStr}. Voice override: "${voiceInstruction}".
    
    TASK: Quickly find 6-8 restaurants for: "${query || 'recommended'}" (Budget: ${budgetMap[budget] || 'Any'}, Filter: ${filters}).
    
    SPEED RULES:
    1. USE Google Maps Grounding IMMEDIATELY. Do not think too long.
    2. ESTIMATE 'avgPrice' (TWD integer) based on store type and location level. Do not verify with external search.
    3. Return JSON immediately.
    
    Output Format: Strict JSON Array.
    Keys: name, rating(num), reviewCount(num), summary(max 20ch), avgPrice(num), popularity(0-100), address, distance(km), photoUri, isOpen(bool).
    Language: Traditional Chinese.
    Exclude: ${existingNames.join(', ')}.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "List restaurants JSON.",
      config: {
        systemInstruction,
        tools: [{ googleMaps: {} }], // REMOVED googleSearch for speed
        toolConfig,
      },
    });

    let text = response.text || "[]";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start !== -1 && end !== -1) text = text.substring(start, end + 1);

    let data: any[] = JSON.parse(text.replace(/[\n\r]/g, " "));

    return data.map((item: any, index: number) => {
      const name = item.name || "Unknown";
      let photo = item.photoUri;
      if (!photo || typeof photo !== 'string' || photo.length < 10 || !photo.startsWith('http')) {
        photo = getConsistentFallbackImage(name);
      }
      return {
        id: `${Date.now()}-${index}`,
        name,
        rating: item.rating || 4.0,
        reviewCount: item.reviewCount || 100,
        summary: item.summary || "美味推薦",
        avgPrice: Number(item.avgPrice) || 0,
        popularity: item.popularity || 85,
        imageUrl: photo,
        address: item.address,
        distance: item.distance || "1.0 km",
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + (item.address || ""))}`,
        isOpen: item.isOpen ?? true,
      };
    });
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return [];
  }
};