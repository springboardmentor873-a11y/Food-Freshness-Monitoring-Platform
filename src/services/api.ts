import { DashboardStats, InventoryItem, Prediction, ChartDataPoint } from '../types';
import { mockDashboardStats, mockInventory, mockChartData, dummyPrediction } from '../data/mockData';

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getDashboardData = async (): Promise<DashboardStats> => {
  await delay(800);
  return mockDashboardStats;
};

export const getInventory = async (): Promise<InventoryItem[]> => {
  await delay(1000);
  return mockInventory;
};

export const getAnalytics = async (): Promise<ChartDataPoint[]> => {
  await delay(1200);
  return mockChartData;
};

export const uploadFruitImage = async (file: File): Promise<string> => {
  // We no longer need this intermediate step since predictFreshness handles the upload
  return URL.createObjectURL(file);
};

interface ItemRule {
  maxShelfLife: number;
  temp: string;
  humidity: string;
  recommendation: string;
  freshInsights: string;
  rottenInsights: string;
}

const itemRules: Record<string, ItemRule> = {
  Apple: {
    maxShelfLife: 30,
    temp: "0-2°C (32-35°F)",
    humidity: "90-95% RH",
    recommendation: "Store in the crisper drawer of your refrigerator. Keep away from other items to avoid gas absorption.",
    freshInsights: "High skin turgor and excellent color. Ethylene production is normal. Perfect for long-term cold storage.",
    rottenInsights: "Deep bruising, mold spots, or soft flesh. Internal integrity is compromised. Sort away to prevent spreading mold."
  },
  Banana: {
    maxShelfLife: 9,
    temp: "13-15°C (56-60°F)",
    humidity: "85-90% RH",
    recommendation: "Store at room temperature on a hanger. Avoid sealing in plastic or refrigerating (causes chill injury/black skins).",
    freshInsights: "Optimal firmness and yellow-green peel. Slow ripening expected. Ideal shelf life.",
    rottenInsights: "Severe peel browning, split skin, and mushy pulp. High ethylene gas emission. Discard immediately."
  },
  Orange: {
    maxShelfLife: 21,
    temp: "4-7°C (39-45°F)",
    humidity: "85-90% RH",
    recommendation: "Store in the refrigerator crisper in a mesh bag to allow ventilation. Avoid airtight bags.",
    freshInsights: "Firm structure and bright peel. Good juice retention. Well suited for transportation.",
    rottenInsights: "White or green mold (Penicillium), soft sunken spots, or sour odor. Dispose immediately."
  },
  Strawberry: {
    maxShelfLife: 7,
    temp: "0-1°C (32-34°F)",
    humidity: "90-95% RH",
    recommendation: "Keep refrigerated. Do not wash until consumption to prevent moisture from encouraging mold growth.",
    freshInsights: "Bright red skins, intact stems, and firm flesh. Optimal sweetness and aroma.",
    rottenInsights: "Grey mold (Botrytis), leaking juice, or shriveled berries. Discard to prevent spreading."
  },
  Avocado: {
    maxShelfLife: 8,
    temp: "4-13°C (39-55°F)",
    humidity: "85-90% RH",
    recommendation: "Let ripen at room temperature, then store in the refrigerator to hold ripeness state.",
    freshInsights: "Firm skin and good weight. Expected to soften evenly over the next few days.",
    rottenInsights: "Extremely soft or sunken skin, black spots, or rancid smell. Flesh inside is likely brown and stringy."
  },
  Peach: {
    maxShelfLife: 7,
    temp: "0-1°C (32-34°F)",
    humidity: "90-95% RH",
    recommendation: "Store at room temperature until fragrant and soft, then transfer to refrigerator.",
    freshInsights: "Fuzzy, firm skin with no indentations. Ripe smell and solid texture.",
    rottenInsights: "Wrinkling skin, mushy brown spots, or mold on stem area. Discard."
  },
  Tomato: {
    maxShelfLife: 14,
    temp: "12-15°C (54-60°F)",
    humidity: "85-90% RH",
    recommendation: "Store stems-down at room temperature away from sunlight. Do not refrigerate (causes powdery texture).",
    freshInsights: "Plump skin, good weight, and firm texture. Optimal acidity and lycopene levels.",
    rottenInsights: "Soft watery spots, black mold around stem, or sour juice leakage. Discard."
  },
  Carrot: {
    maxShelfLife: 28,
    temp: "0-1°C (32-34°F)",
    humidity: "95-98% RH",
    recommendation: "Cut green tops off, wrap in a damp paper towel, and store in a sealed plastic bag in the fridge.",
    freshInsights: "Rigid structure, bright orange skin, and snappy crunch. High water turgor.",
    rottenInsights: "Soft, limp texture, slimy black skin spots, or white mold growth. Discard."
  },
  Potato: {
    maxShelfLife: 60,
    temp: "7-10°C (45-50°F)",
    humidity: "90-95% RH",
    recommendation: "Store in a dark, cool, dry box or paper bag. Keep away from onions to prevent sprouting.",
    freshInsights: "Solid structure with no sprouts or green patches. Skin is clean and dry.",
    rottenInsights: "Soft spots, green skin patches (solanine toxin), sprouts, or foul-smelling rot. Discard."
  },
  Cabbage: {
    maxShelfLife: 30,
    temp: "0-1°C (32-34°F)",
    humidity: "90-95% RH",
    recommendation: "Store in a plastic wrap in the refrigerator crisper drawer. Keep outer protective leaves on.",
    freshInsights: "Heavy, dense heads with tightly packed leaves. Leaves are crisp and green.",
    rottenInsights: "Yellowing or blackening inner leaves, slimy texture, or wilting. Discard."
  },
  Cucumber: {
    maxShelfLife: 10,
    temp: "10-12°C (50-54°F)",
    humidity: "90-95% RH",
    recommendation: "Store in the warmest part of the fridge (door/front) or at cool room temp. Prone to chill injury.",
    freshInsights: "Firm green skin with no yellowing. Snappy crunch and high hydration.",
    rottenInsights: "Water-soaked yellow spots, mushy ends, or white fuzzy mold. Discard."
  },
  Mango: {
    maxShelfLife: 10,
    temp: "12-13°C (54-55°F)",
    humidity: "85-90% RH",
    recommendation: "Store at room temperature until fully ripe, then refrigerate. Avoid stacking to prevent bruising.",
    freshInsights: "Firm skin with fragrant aroma, rich color, and minimal sap markings. Ripens steadily at room temperature.",
    rottenInsights: "Deep soggy soft spots, black decay areas on peel, or strong fermenting odor. Discard."
  },
  Grapes: {
    maxShelfLife: 14,
    temp: "0-1°C (32-34°F)",
    humidity: "90-95% RH",
    recommendation: "Keep refrigerated in a perforated bag. Do not wash berries until ready to eat.",
    freshInsights: "Firm grapes firmly attached to green, flexible stems. Visible waxy bloom layer intact.",
    rottenInsights: "Dry brown moldy stems, shriveled or mushy berries, or juice leakage. Discard."
  },
  Lemon: {
    maxShelfLife: 28,
    temp: "4-10°C (39-50°F)",
    humidity: "85-90% RH",
    recommendation: "Store in a sealed zip bag in the refrigerator crisper. Lasts up to 4 weeks compared to countertop.",
    freshInsights: "Bright yellow peel, firm structure, heavy juice retention weight.",
    rottenInsights: "Soft sunken patches, white or blue-green mold (Penicillium), or dry hard skin. Discard."
  },
  Onion: {
    maxShelfLife: 90,
    temp: "7-10°C (45-50°F)",
    humidity: "65-70% RH",
    recommendation: "Store in a cool, dark, well-ventilated pantry space. Keep away from potatoes (causes sprouting).",
    freshInsights: "Dry, papery outer skins and firm, solid bulbs. No green sprouts.",
    rottenInsights: "Soft necks, wet slimy inner layers, dark mold, or green shoots emerging. Discard."
  },
  Broccoli: {
    maxShelfLife: 10,
    temp: "0-1°C (32-34°F)",
    humidity: "95-98% RH",
    recommendation: "Wrap loosely in a damp paper towel and store in the crisper drawer of your refrigerator.",
    freshInsights: "Tightly closed green florets and firm stalks. No yellowing.",
    rottenInsights: "Yellowing florets, soft slimy stems, or black mold patches. Discard."
  },
  Watermelon: {
    maxShelfLife: 21,
    temp: "10-15°C (50-59°F)",
    humidity: "85-90% RH",
    recommendation: "Store whole watermelon at cool room temperature. Once cut, wrap tightly in plastic and refrigerate.",
    freshInsights: "Firm rind, heavy weight, and a prominent creamy yellow field spot showing it ripened on the vine.",
    rottenInsights: "Soggy soft spots on the rind, sour fermenting smell, or slimy inside flesh. Discard."
  },
  Pear: {
    maxShelfLife: 15,
    temp: "0-1°C (32-34°F)",
    humidity: "90-95% RH",
    recommendation: "Store at room temp until ripe (neck yields to gentle pressure), then transfer to the refrigerator.",
    freshInsights: "Firm skin with characteristic coloring and no visual indentations or bruises.",
    rottenInsights: "Extremely soft mushy flesh, dark skin decay patches, or internal brown breakdown. Discard."
  },
  Pineapple: {
    maxShelfLife: 7,
    temp: "7-10°C (45-50°F)",
    humidity: "85-90% RH",
    recommendation: "Store at room temperature or refrigerate. Wrap cut pineapple in airtight containers.",
    freshInsights: "Golden-yellow body, firm shell, green crown leaves, and sweet tropical aroma.",
    rottenInsights: "Fermenting sour smell, soft moldy base, or dark grey/brown outer shell spots. Discard."
  },
  Garlic: {
    maxShelfLife: 120,
    temp: "15-18°C (60-65°F)",
    humidity: "60-70% RH",
    recommendation: "Store in a cool, dry, dark pantry in a mesh bag. Do not refrigerate (causes sprouting).",
    freshInsights: "Firm bulbs with dry, unbroken papery skins and no green shoots.",
    rottenInsights: "Spongy soft cloves, green sprouts, or blue-grey mold layers. Discard."
  },
  Pepper: {
    maxShelfLife: 12,
    temp: "7-10°C (45-50°F)",
    humidity: "90-95% RH",
    recommendation: "Store dry in a perforated plastic bag inside the refrigerator crisper drawer.",
    freshInsights: "Firm, glossy skin with a bright green stem. Rigid walls and no wrinkles.",
    rottenInsights: "Soft wrinkled skin, water-soaked spots, or white mold on the stem. Discard."
  },
  Vegetable: {
    maxShelfLife: 12,
    temp: "4-7°C (39-45°F)",
    humidity: "90-95% RH",
    recommendation: "Store in the crisper drawer in a perforated plastic bag to balance humidity and ventilation.",
    freshInsights: "Bright skin, crisp texture, and standard moisture level. Ready for distribution.",
    rottenInsights: "Wilted leaves, discoloration, slimy surfaces, or mold growth. Discard."
  }
};

export const predictFreshness = async (fileOrUrl: string | File, selectedCategory?: string): Promise<Prediction> => {
  if (fileOrUrl instanceof File) {
    const formData = new FormData();
    formData.append("file", fileOrUrl);
    
    try {
      let backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      // Format with https:// if a raw hostname is injected via Render blueprints
      if (backendUrl && !backendUrl.startsWith("http://") && !backendUrl.startsWith("https://")) {
        backendUrl = `https://${backendUrl}`;
      }
      
      const response = await fetch(`${backendUrl}/predict`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      
      const isRotten = result.freshness === "Rotten";
      const status = isRotten ? "Spoiled" : "Fresh";
      const confidence = result.confidence;
      const freshnessScore = isRotten ? Math.max(5, Math.round(100 - confidence)) : Math.round(confidence);
      const spoilageProbability = isRotten ? Math.round(confidence) : Math.max(5, Math.round(100 - confidence));
      
      // Prioritize specific predicted fruit from backend over default dropdown selection
      const categoryName = (result.fruit && result.fruit !== "Fruit" && result.fruit !== "Vegetable")
        ? result.fruit
        : (selectedCategory || result.fruit || "Vegetable");
      const nameKey = (categoryName && itemRules[categoryName]) ? categoryName : "Vegetable";
      const rule = itemRules[nameKey];
      
      const storageRecommendation = isRotten 
        ? "Discard or compost immediately to prevent cross-contamination" 
        : rule.recommendation;
          
      const tempRec = isRotten ? "N/A" : rule.temp;
      const humRec = isRotten ? "N/A" : rule.humidity;
      
      const aiInsights = isRotten
        ? `The AI has detected visual indicators of rot or spoilage. ${rule.rottenInsights}`
        : `Visual inspection shows excellent status. ${rule.freshInsights}`;
        
      const remainingShelfLifeDays = isRotten 
        ? 0 
        : Math.max(1, Math.round((freshnessScore / 100) * rule.maxShelfLife));

      // Merge with dummy prediction to fill in missing UI fields
      return {
        ...dummyPrediction,
        imageUrl: URL.createObjectURL(fileOrUrl),
        id: `PRD-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString(),
        fruitName: `${categoryName}`,
        freshnessScore: freshnessScore,
        status: status,
        spoilageProbability: spoilageProbability,
        storageRecommendation,
        temperatureRecommendation: tempRec,
        humidityRecommendation: humRec,
        aiInsights,
        remainingShelfLifeDays
      };
    } catch (error) {
      console.error("Prediction API failed:", error);
      throw error;
    }
  }
  
  // Fallback for mock behavior if a string URL is passed
  await delay(2500); 
  return {
    ...dummyPrediction,
    imageUrl: fileOrUrl as string, 
    id: `PRD-${Math.floor(Math.random() * 10000)}`,
    date: new Date().toISOString()
  };
};
