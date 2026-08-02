const foodImage = document.getElementById("foodImage");
const uploadArea = document.getElementById("uploadArea");
const imagePreview = document.getElementById("imagePreview");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");

const fileDetails = document.getElementById("fileDetails");
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


function getElement(id) {
    return document.getElementById(id);
}


function setText(id, value, fallback = "--") {
    const element = getElement(id);

    if (!element) {
        return;
    }

    const valid =
        value !== undefined &&
        value !== null &&
        String(value).trim() !== "";

    element.textContent = valid
        ? String(value)
        : fallback;
}


function toNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}


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
    if (!errorMessage) {
        console.error(message);
        return;
    }

    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}


function clearError() {
    if (!errorMessage) {
        return;
    }

    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");
}


function getFoodName(data) {
    if (data.food_name) {
        return data.food_name;
    }

    if (data.product_name) {
        return data.product_name;
    }

    if (data.food) {
        return data.food;
    }

    if (data.prediction) {
        return String(data.prediction)
            .split("_")[0]
            .replaceAll("-", " ")
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    }

    return "Unknown food";
}


function getFreshnessStatus(data) {
    return (
        data.freshness_status ||
        data.freshness ||
        data.condition ||
        "Unknown"
    );
}


function resetSelectedFile() {
    selectedFile = null;

    if (foodImage) {
        foodImage.value = "";
    }

    if (imagePreview) {
        imagePreview.src = "";
        imagePreview.classList.add("hidden");
    }

    uploadPlaceholder?.classList.remove("hidden");
    fileDetails?.classList.add("hidden");

    getElement("detectedFoodPreview")
        ?.classList.add("hidden");

    setText("detectedFoodName", "--");

    if (analyzeButton) {
        analyzeButton.disabled = true;
    }

    clearError();
}


function selectFile(file) {
    clearError();

    if (!file) {
        return;
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
        showError(
            "Please select a JPG, PNG or WEBP image."
        );
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        showError(
            "The selected image must be smaller than 10 MB."
        );
        return;
    }

    selectedFile = file;

    const reader = new FileReader();

    reader.onload = (event) => {
        if (imagePreview) {
            imagePreview.src = event.target.result;
            imagePreview.classList.remove("hidden");
        }

        uploadPlaceholder?.classList.add("hidden");
    };

    reader.onerror = () => {
        resetSelectedFile();
        showError(
            "The selected image could not be read."
        );
    };

    reader.readAsDataURL(file);

    setText("fileName", file.name);
    setText("fileSize", formatFileSize(file.size));

    getElement("detectedFoodPreview")
        ?.classList.add("hidden");

    fileDetails?.classList.remove("hidden");

    if (analyzeButton) {
        analyzeButton.disabled = false;
    }
}


function setLoading(loading) {
    isAnalyzing = loading;

    if (loading) {
        if (analyzeButton) {
            analyzeButton.disabled = true;
        }

        if (buttonText) {
            buttonText.textContent =
                "Identifying and checking food...";
        }

        loadingSpinner?.classList.remove("hidden");
    } else {
        if (buttonText) {
            buttonText.textContent =
                "Check product quality";
        }

        loadingSpinner?.classList.add("hidden");

        if (analyzeButton) {
            analyzeButton.disabled = !selectedFile;
        }
    }
}


function updateShopperDecision(
    data,
    foodName,
    freshnessStatus
) {
    const card = getElement("shopperDecision");
    const symbol =
        card?.querySelector(".decision-symbol");

    const title =
        getElement("buyRecommendation");

    const description =
        getElement("decisionDescription");

    if (!card || !symbol || !title || !description) {
        return;
    }

    const normalized =
        String(freshnessStatus).toLowerCase();

    const spoiled =
        normalized.includes("spoiled") ||
        normalized.includes("rotten");

    const daysRemaining =
        toNumber(
            data.shelf_life?.days_remaining
        );

    card.classList.toggle("avoid", spoiled);

    if (spoiled) {
        symbol.textContent = "×";
        title.textContent = `Do not buy this ${foodName}`;

        description.textContent =
            `${foodName} is predicted as spoiled and is not recommended for purchase or consumption.`;

        return;
    }

    symbol.textContent = "✓";

    if (daysRemaining > 0 && daysRemaining <= 2) {
        title.textContent =
            `Buy ${foodName} only for immediate use`;

        description.textContent =
            `${foodName} appears fresh but should be consumed soon.`;

        return;
    }

    title.textContent =
        `${foodName} is recommended to buy`;

    description.textContent =
        `${foodName} appears fresh and suitable for purchase based on the image result.`;
}


function updateReport(data) {
    const foodName = getFoodName(data);
    const freshnessStatus =
        getFreshnessStatus(data);

    const confidence =
        toNumber(data.confidence);

    const normalizedStatus =
        String(freshnessStatus).toLowerCase();

    const isFresh =
        normalizedStatus.includes("fresh") &&
        !normalizedStatus.includes("not fresh");

    const freshnessScore =
        toNumber(
            data.freshness_score,
            isFresh
                ? confidence
                : Math.max(0, 100 - confidence)
        );

    const shelfLife =
        data.shelf_life || {};

    const storage =
        data.storage || {};

    const spoilageRisk =
        data.spoilage_risk || {};

    // Food name displayed in four places
    setText("foodName", foodName);
    setText("detectedFoodName", foodName);
    setText("detectedFoodBannerName", foodName);
    setText("metricFoodName", foodName);

    getElement("detectedFoodPreview")
        ?.classList.remove("hidden");

    setText(
        "predictionClass",
        data.prediction
    );

    setText(
        "inspectionId",
        data.inspection_id
    );

    setText(
        "inspectionDate",
        data.inspection_date
    );

    setText(
        "inspectionTime",
        data.inspection_time
    );

    setText(
        "freshnessScore",
        Math.round(freshnessScore)
    );

    setText(
        "confidence",
        `${confidence.toFixed(2)}%`
    );

    setText(
        "qualityGrade",
        data.quality_grade
    );

    setText(
        "qualityLabel",
        data.quality_label
    );

    setText(
        "riskLevel",
        spoilageRisk.level
    );

    setText(
        "spoilageProbability",
        `${toNumber(
            spoilageRisk.probability
        ).toFixed(2)}%`
    );

    setText(
        "shelfLifeStatus",
        shelfLife.status
    );

    const remainingDays =
        toNumber(
            shelfLife.days_remaining
        );

    setText(
        "remainingDays",
        remainingDays === 1
            ? "1 day"
            : `${remainingDays} days`
    );

    setText(
        "consumeBefore",
        shelfLife.consume_before
    );

    setText(
        "storageMethod",
        storage.method
    );

    setText(
        "storageTemperature",
        storage.temperature
    );

    setText(
        "storageTip",
        storage.tip
    );

    setText(
        "consumptionStatus",
        data.consumption_status
    );

    setText(
        "processingTime",
        `Processed in ${toNumber(
            data.processing_time
        ).toFixed(2)} seconds`
    );

    setText(
        "recommendationText",
        data.recommendation,
        `Use the ${foodName} freshness result together with a manual smell, texture and visible-condition check.`
    );

    setText(
        "disclaimer",
        data.disclaimer,
        "This visual prediction should not replace a complete food-safety inspection."
    );

    const freshnessBadge =
        getElement("freshnessBadge");

    if (freshnessBadge) {
        freshnessBadge.textContent =
            freshnessStatus;

        freshnessBadge.classList.toggle(
            "spoiled",
            normalizedStatus.includes("spoiled") ||
            normalizedStatus.includes("rotten")
        );
    }

    const scoreGauge =
        getElement("scoreGauge");

    if (scoreGauge) {
        const safeScore =
            Math.max(
                0,
                Math.min(freshnessScore, 100)
            );

        scoreGauge.style.setProperty(
            "--score",
            `${safeScore * 3.6}deg`
        );
    }

    const shelfProgress =
        getElement("shelfProgressBar");

    if (shelfProgress) {
        const percentage =
            Math.max(
                0,
                Math.min(
                    toNumber(
                        shelfLife.percentage,
                        remainingDays > 0
                            ? remainingDays * 12.5
                            : 0
                    ),
                    100
                )
            );

        shelfProgress.style.width =
            `${percentage}%`;
    }

    updateShopperDecision(
        data,
        foodName,
        freshnessStatus
    );

    emptyState?.classList.add("hidden");
    reportContent?.classList.remove("hidden");

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
                data.error ||
                "Unable to inspect this image."
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


foodImage?.addEventListener(
    "change",
    (event) => {
        selectFile(
            event.target.files?.[0]
        );
    }
);


removeFile?.addEventListener(
    "click",
    (event) => {
        event.preventDefault();
        event.stopPropagation();

        resetSelectedFile();
    }
);


uploadArea?.addEventListener(
    "dragover",
    (event) => {
        event.preventDefault();
        uploadArea.classList.add("drag-active");
    }
);


uploadArea?.addEventListener(
    "dragleave",
    () => {
        uploadArea.classList.remove(
            "drag-active"
        );
    }
);


uploadArea?.addEventListener(
    "drop",
    (event) => {
        event.preventDefault();

        uploadArea.classList.remove(
            "drag-active"
        );

        selectFile(
            event.dataTransfer.files?.[0]
        );
    }
);


analyzeButton?.addEventListener(
    "click",
    async () => {
        if (!selectedFile) {
            showError(
                "Select a food image before starting."
            );
            return;
        }

        await analyzeFood(selectedFile);
    }
);


inspectAnother?.addEventListener(
    "click",
    () => {
        resetSelectedFile();

        reportContent?.classList.add("hidden");
        emptyState?.classList.remove("hidden");

        document
            .getElementById("inspection")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    }
);
