import { useState } from "react";
import { Package } from "lucide-react";

// Product-specific image mapping evaluated against exact product name
const PRODUCT_SPECIFIC_MAP = [
  {
    keywords: ["ladies finger", "ladiesfinger", "okra", "bhindi"],
    url: "https://images.unsplash.com/photo-1628543108325-1c39050d244a?auto=format&fit=crop&w=150&q=80",
    icon: "🫛",
    bg: "bg-emerald-50 text-emerald-700",
  },
  {
    keywords: ["apple", "apples"],
    url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=150&q=80",
    icon: "🍎",
    bg: "bg-red-50 text-red-600",
  },
  {
    keywords: ["banana", "bananas"],
    url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=150&q=80",
    icon: "🍌",
    bg: "bg-amber-50 text-amber-600",
  },
  {
    keywords: ["orange", "oranges", "citrus"],
    url: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=150&q=80",
    icon: "🍊",
    bg: "bg-orange-50 text-orange-600",
  },
  {
    keywords: ["tomato", "tomatoes"],
    url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=150&q=80",
    icon: "🍅",
    bg: "bg-red-50 text-red-600",
  },
  {
    keywords: ["spinach", "spinach pack"],
    url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=150&q=80",
    icon: "🥬",
    bg: "bg-green-50 text-green-700",
  },
  {
    keywords: ["croissant", "croissants"],
    url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=150&q=80",
    icon: "🥐",
    bg: "bg-amber-50 text-amber-700",
  },
  {
    keywords: ["bread", "sourdough", "loaf"],
    url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=150&q=80",
    icon: "🍞",
    bg: "bg-amber-50 text-amber-800",
  },
  {
    keywords: ["milk"],
    url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=150&q=80",
    icon: "🥛",
    bg: "bg-blue-50 text-blue-600",
  },
  {
    keywords: ["cheese"],
    url: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=150&q=80",
    icon: "🧀",
    bg: "bg-yellow-50 text-yellow-600",
  },
  {
    keywords: ["yogurt", "greekyogurt"],
    url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=150&q=80",
    icon: "🍨",
    bg: "bg-sky-50 text-sky-600",
  },
  {
    keywords: ["salmon", "fish"],
    url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=150&q=80",
    icon: "🥩",
    bg: "bg-rose-50 text-rose-600",
  },
  {
    keywords: ["chicken", "meat", "poultry"],
    url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=150&q=80",
    icon: "🍗",
    bg: "bg-orange-50 text-orange-700",
  },
];

// Fallback category map if specific product name isn't recognized
const CATEGORY_MAP = [
  {
    category: "fruits",
    url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=150&q=80",
    icon: "🍎",
    bg: "bg-red-50 text-red-600",
  },
  {
    category: "vegetables",
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=150&q=80",
    icon: "🥦",
    bg: "bg-green-50 text-green-700",
  },
  {
    category: "bread",
    url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=150&q=80",
    icon: "🍞",
    bg: "bg-amber-50 text-amber-800",
  },
  {
    category: "dairy",
    url: "https://images.unsplash.com/photo-1528751014936-863e6e7a319c?auto=format&fit=crop&w=150&q=80",
    icon: "🥛",
    bg: "bg-blue-50 text-blue-600",
  },
];

function ProductThumbnail({ name = "", category = "", size = "md" }) {
  const [imgError, setImgError] = useState(false);

  const cleanName = (name || "").toLowerCase().trim();
  const cleanCategory = (category || "").toLowerCase().trim();

  // 1. Evaluate exact product name first
  let matched = PRODUCT_SPECIFIC_MAP.find((item) =>
    item.keywords.some((kw) => cleanName.includes(kw))
  );

  // 2. Fall back to category mapping if name doesn't match specific produce
  if (!matched && cleanCategory) {
    matched = CATEGORY_MAP.find((item) => item.category === cleanCategory);
  }

  const dimClass = size === "sm" ? "h-10 w-10 text-lg" : "h-12 w-12 text-xl";

  return (
    <div
      className={`relative flex ${dimClass} shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-xs group`}
    >
      {matched && !imgError ? (
        <img
          src={matched.url}
          alt={name || "Product image"}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      ) : matched && imgError ? (
        <div className={`flex h-full w-full items-center justify-center font-bold ${matched.bg}`}>
          {matched.icon}
        </div>
      ) : (
        /* Neutral fallback container for unknown food products */
        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
          <Package size={size === "sm" ? 18 : 22} />
        </div>
      )}
    </div>
  );
}

export default ProductThumbnail;
