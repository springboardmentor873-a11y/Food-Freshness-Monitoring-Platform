import DashboardHeader from "../../components/dashboard/DashboardHeader";

import FoodUploadCard from "../../components/dashboard/FoodUploadCard";
import LivePreviewCard from "../../components/dashboard/LivePreviewCard";
import DetectionTipCard from "../../components/dashboard/DetectionTipCard";
import HowItWorksCard from "../../components/dashboard/HowItWorksCard";
import ActionButtons from "../../components/dashboard/ActionButtons";

function FoodDetection() {
  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Detect Food Quality"
        subtitle="Upload images for instant AI-powered freshness and spoilage analysis."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Left */}
        <div className="space-y-6 lg:col-span-2">
          <FoodUploadCard />
          <ActionButtons />
        </div>

        {/* Right */}
        <div className="space-y-6">
          <LivePreviewCard />
          <DetectionTipCard />
          <HowItWorksCard />
        </div>

      </div>
    </div>
  );
}

export default FoodDetection;