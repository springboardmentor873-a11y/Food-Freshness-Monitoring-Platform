def get_safety_message(info: dict) -> str:
    if info["Status"] == "Fresh":
        return "This food appears safe for consumption when stored properly."

    return "This food appears spoiled and should not be consumed."


def get_action_steps(info: dict) -> list[str]:
    actions = []

    if info["Status"] == "Fresh":
        actions.append(f"Store using: {info['Storage']}")
        actions.append(f"Maintain temperature: {info['Temperature']}")
        actions.append(f"Maintain humidity: {info['Humidity']}")
        actions.append(f"Expected shelf life: {info['Shelf Life']}")
    else:
        actions.append("Do not consume this food.")
        actions.append("Discard it immediately.")
        actions.append("Clean the storage area or container.")
        actions.append("Keep it away from fresh food items.")

    return actions