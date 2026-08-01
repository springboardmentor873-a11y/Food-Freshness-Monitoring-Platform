from app.models import RecommendationRequest, RecommendationResponse


def generate_recommendations(request: RecommendationRequest) -> RecommendationResponse:
    recommendations = []
    risk_score = request.age_days + (request.temperature - 4) * 2 + (request.humidity - 50) * 0.5

    if request.category.lower() in ["dairy", "meat", "seafood"]:
        recommendations.append("Keep chilled at or below 4°C and use within 2 days.")
    elif request.category.lower() in ["fruit", "vegetable"]:
        recommendations.append("Store in cool, dry conditions and check for soft spots daily.")
    else:
        recommendations.append("Keep in a cool, dry place and rotate inventory by expiry date.")

    if request.age_days > 7:
        recommendations.append("Consider consuming or freezing this item soon.")

    if request.temperature > 8:
        recommendations.append("Temperature is high; lower storage temperature to slow spoilage.")

    if request.humidity > 70:
        recommendations.append("Humidity is high; improve air circulation or reduce moisture exposure.")

    if risk_score > 20:
        risk_level = "High"
    elif risk_score > 10:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return RecommendationResponse(recommendations=recommendations, risk_level=risk_level)
