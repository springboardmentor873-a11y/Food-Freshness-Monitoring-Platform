import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { ScanLine, Boxes } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { SkeletonCard } from "../components/ui/Loader";
import FreshnessGauge from "../components/prediction/FreshnessGauge";
import ConfidenceMeter from "../components/prediction/ConfidenceMeter";
import ShelfLifeCountdown from "../components/prediction/ShelfLifeCountdown";
import FoodHealthScore from "../components/prediction/FoodHealthScore";
import StorageRecommendationCard from "../components/prediction/StorageRecommendationCard";
import WeightedScoringBreakdownCard from "../components/prediction/WeightedScoringBreakdownCard";
import { getStoredPrediction, createMockPrediction } from "../mocks/predictions";
import { apiService } from "../services/api";

export default function PredictionResultsPage() {
  const { id } = useParams();
  const location = useLocation();
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPrediction() {
      setIsLoading(true);
      if (location.state?.prediction) {
        setPrediction(location.state.prediction);
        setIsLoading(false);
        return;
      }

      if (id && !isNaN(Number(id))) {
        try {
          const dbItem = await apiService.getAnalysisById(id);
          const mapped = {
            id: dbItem.id,
            itemName: dbItem.item_name,
            category: dbItem.category,
            freshnessCategory: dbItem.predicted_category,
            freshnessScore: Math.round(dbItem.overall_freshness_score),
            confidence: Math.round(dbItem.prediction_confidence * 100),
            healthScore: Math.round(dbItem.overall_freshness_score * 0.95),
            shelfLifeDays: Math.round(dbItem.remaining_shelf_life_days),
            visualScore: Math.round(dbItem.visual_condition_score),
            storageScore: Math.round(dbItem.storage_condition_score),
            shelfLifeScore: Math.round(dbItem.shelf_life_score),
            productAgeScore: Math.round(dbItem.product_age_score),
            riskLevel: dbItem.risk_level,
            recommendation: dbItem.recommendation,
            analyzedAt: dbItem.created_at,
          };
          setPrediction(mapped);
          setIsLoading(false);
          return;
        } catch (err) {
          console.warn("[PredictionResultsPage] Failed to fetch DB analysis:", err);
        }
      }

      const found = getStoredPrediction(id) || createMockPrediction("Sample Food Item");
      setPrediction(found);
      setIsLoading(false);
    }

    loadPrediction();
  }, [id, location.state]);

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <SkeletonCard className="lg:col-span-2 h-96" />
        <SkeletonCard className="h-96" />
      </div>
    );
  }

  // Generate breakdown scores if not present
  const visualScore = prediction.visualScore || Math.min(100, Math.max(10, prediction.freshnessScore + 3));
  const storageScore = prediction.storageScore || Math.min(100, Math.max(10, prediction.freshnessScore - 4));
  const shelfLifeScore = prediction.shelfLifeScore || Math.min(100, Math.max(10, prediction.freshnessScore + 1));
  const productAgeScore = prediction.productAgeScore || Math.min(100, Math.max(10, prediction.freshnessScore - 2));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{prediction.itemName}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {prediction.category} · Analyzed{" "}
            {new Date(prediction.analyzedAt).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/app/inventory">
            <Button variant="secondary" leftIcon={<Boxes size={16} />}>
              Add to Inventory
            </Button>
          </Link>
          <Link to="/app/analyze">
            <Button leftIcon={<ScanLine size={16} />}>Analyze Another</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Image + freshness gauge */}
        <Card className="flex flex-col items-center justify-center gap-6 sm:flex-row lg:col-span-2">
          {prediction.previewUrl && (
            <img
              src={prediction.previewUrl}
              alt={prediction.itemName}
              className="h-48 w-48 shrink-0 rounded-2xl object-cover shadow-sm border border-slate-100 dark:border-slate-800"
            />
          )}
          <FreshnessGauge score={prediction.freshnessScore} category={prediction.freshnessCategory} />
        </Card>

        {/* Confidence + health score */}
        <Card className="flex flex-col justify-between gap-6">
          <ConfidenceMeter confidence={prediction.confidence} />
          <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
            <FoodHealthScore score={prediction.healthScore} />
          </div>
        </Card>
      </div>

      {/* Weighted Scoring Engine Model Breakdown */}
      <WeightedScoringBreakdownCard
        visualScore={visualScore}
        storageScore={storageScore}
        shelfLifeScore={shelfLifeScore}
        productAgeScore={productAgeScore}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ShelfLifeCountdown days={prediction.shelfLifeDays} />
        </div>
        <div className="lg:col-span-2">
          <StorageRecommendationCard
            storage={prediction.storage}
            recommendation={prediction.recommendation}
            shelfLifeDays={prediction.shelfLifeDays}
            issues={prediction.issues}
          />
        </div>
      </div>
    </div>
  );
}

