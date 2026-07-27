const foodImage = document.getElementById("foodImage");
const uploadArea = document.getElementById("uploadArea");
const imagePreview = document.getElementById("imagePreview");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");

const fileDetails = document.getElementById("fileDetails");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const removeFile = document.getElementById("removeFile");

const analyzeButton = document.getElementById("analyzeButton");
const buttonText = document.getElementById("buttonText");
const loadingSpinner = document.getElementById("loadingSpinner");
const errorMessage = document.getElementById("errorMessage");

const emptyState = document.getElementById("emptyState");
const reportContent = document.getElementById("reportContent");
const inspectAnother = document.getElementById("inspectAnother");

let selectedFile = null;
let isAnalyzing = false;


function formatFileSize(bytes) {
    if (bytes < 1024) {
        return `${bytes} bytes`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}


function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}


function clearError() {
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");
}


function isSupportedImage(file) {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];

    return allowedTypes.includes(file.type);
}


function resetSelectedFile() {
    selectedFile = null;
    foodImage.value = "";

    imagePreview.src = "";
    imagePreview.classList.add("hidden");

    uploadPlaceholder.classList.remove("hidden");
    fileDetails.classList.add("hidden");

    analyzeButton.disabled = true;

    clearError();
}


function selectFile(file) {
    if (!file) {
        return;
    }

    clearError();

    if (!isSupportedImage(file)) {
        showError("Please select a JPG, PNG or WEBP image.");
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        showError("The selected image must be smaller than 10 MB.");
        return;
    }

    selectedFile = file;

    const reader = new FileReader();

    reader.onload = (event) => {
        imagePreview.src = event.target.result;
        imagePreview.classList.remove("hidden");
        uploadPlaceholder.classList.add("hidden");
    };

    reader.onerror = () => {
        showError("The selected image could not be read.");
        resetSelectedFile();
    };

    reader.readAsDataURL(file);

    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);

    fileDetails.classList.remove("hidden");
    analyzeButton.disabled = false;
}


function setLoading(loading) {
    isAnalyzing = loading;

    if (loading) {
        analyzeButton.disabled = true;
        buttonText.textContent = "Checking product quality...";
        loadingSpinner.classList.remove("hidden");
    } else {
        buttonText.textContent = "Check product quality";
        loadingSpinner.classList.add("hidden");
        analyzeButton.disabled = !selectedFile;
    }
}


function updateShopperDecision(data) {
    const decisionCard =
        document.getElementById("shopperDecision");

    const decisionIcon =
        decisionCard.querySelector(".decision-icon");

    const buyRecommendation =
        document.getElementById("buyRecommendation");

    const decisionDescription =
        document.getElementById("decisionDescription");

    const isSpoiled =
        data.freshness_status === "Spoiled";

    const daysRemaining =
        data.shelf_life.days_remaining;

    decisionCard.classList.toggle("avoid", isSpoiled);

    if (isSpoiled) {
        decisionIcon.textContent = "×";
        buyRecommendation.textContent = "Do not buy";

        decisionDescription.textContent =
            "This product is predicted as spoiled and is not recommended for purchase.";

        return;
    }

    decisionIcon.textContent = "✓";

    if (daysRemaining <= 2) {
        buyRecommendation.textContent =
            "Buy only for immediate use";

        decisionDescription.textContent =
            "The product appears fresh but should be consumed soon.";
    } else if (data.confidence >= 90) {
        buyRecommendation.textContent =
            "Recommended to buy";

        decisionDescription.textContent =
            "This product appears fresh and has a strong quality result.";
    } else {
        buyRecommendation.textContent =
            "Inspect manually before buying";

        decisionDescription.textContent =
            "The product appears usable, but check its smell and texture before purchase.";
    }
}


function updateReport(data) {
    document.getElementById("foodName").textContent =
        data.food_name;

    document.getElementById("predictionClass").textContent =
        data.prediction;

    const freshnessBadge =
        document.getElementById("freshnessBadge");

    freshnessBadge.textContent =
        data.freshness_status;

    freshnessBadge.classList.toggle(
        "spoiled",
        data.freshness_status === "Spoiled"
    );

    document.getElementById("inspectionId").textContent =
        data.inspection_id;

    document.getElementById("inspectionDate").textContent =
        data.inspection_date;

    document.getElementById("inspectionTime").textContent =
        data.inspection_time;

    document.getElementById("freshnessScore").textContent =
        Math.round(data.freshness_score);

    document.getElementById("confidence").textContent =
        `${data.confidence}%`;

    document.getElementById("qualityGrade").textContent =
        data.quality_grade;

    document.getElementById("qualityLabel").textContent =
        data.quality_label;

    document.getElementById("riskLevel").textContent =
        data.spoilage_risk.level;

    document.getElementById("spoilageProbability").textContent =
        `${data.spoilage_risk.probability}%`;

    document.getElementById("shelfLifeStatus").textContent =
        data.shelf_life.status;

    const remainingDays =
        data.shelf_life.days_remaining;

    document.getElementById("remainingDays").textContent =
        remainingDays === 1
            ? "1 day"
            : `${remainingDays} days`;

    document.getElementById("consumeBefore").textContent =
        data.shelf_life.consume_before;

    document.getElementById("storageMethod").textContent =
        data.storage.method;

    document.getElementById("storageTemperature").textContent =
        data.storage.temperature;

    document.getElementById("storageTip").textContent =
        data.storage.tip;

    document.getElementById("consumptionStatus").textContent =
        data.consumption_status;

    document.getElementById("processingTime").textContent =
        `Processed in ${data.processing_time} seconds`;

    document.getElementById("recommendationText").textContent =
        data.recommendation;

    document.getElementById("disclaimer").textContent =
        data.disclaimer;

    const scoreGauge =
        document.getElementById("scoreGauge");

    const scoreDegrees =
        Math.max(
            0,
            Math.min(data.freshness_score, 100)
        ) * 3.6;

    scoreGauge.style.setProperty(
        "--score",
        `${scoreDegrees}deg`
    );

    const shelfPercentage =
        Math.max(
            0,
            Math.min(data.shelf_life.percentage, 100)
        );

    document.getElementById(
        "shelfProgressBar"
    ).style.width = `${shelfPercentage}%`;

    updateShopperDecision(data);

    emptyState.classList.add("hidden");
    reportContent.classList.remove("hidden");

    document
        .querySelector(".result-panel")
        ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
}


async function analyzeFood(file) {
    if (!file || isAnalyzing) {
        return;
    }

    clearError();
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("/predict", {
            method: "POST",
            body: formData,
        });

        let data;

        try {
            data = await response.json();
        } catch {
            throw new Error(
                "The server returned an invalid response."
            );
        }

        if (!response.ok) {
            throw new Error(
                data.detail ||
                "Unable to inspect this product."
            );
        }

        updateReport(data);
    } catch (error) {
        console.error(error);

        showError(
            error.message ||
            "An unexpected error occurred."
        );
    } finally {
        setLoading(false);
    }
}


foodImage.addEventListener("change", (event) => {
    selectFile(event.target.files?.[0]);
});


removeFile.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    resetSelectedFile();
});


uploadArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    uploadArea.classList.add("drag-active");
});


uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("drag-active");
});


uploadArea.addEventListener("drop", (event) => {
    event.preventDefault();

    uploadArea.classList.remove("drag-active");

    selectFile(event.dataTransfer.files?.[0]);
});


analyzeButton.addEventListener("click", async () => {
    if (!selectedFile) {
        showError(
            "Select a product image before starting."
        );

        return;
    }

    await analyzeFood(selectedFile);
});


inspectAnother.addEventListener("click", () => {
    resetSelectedFile();

    reportContent.classList.add("hidden");
    emptyState.classList.remove("hidden");

    document
        .getElementById("inspection")
        ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
});