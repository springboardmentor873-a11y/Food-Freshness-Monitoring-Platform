import json
from pathlib import Path
from typing import List, Optional
from app.models import InventoryItem, StorageCondition

DATA_FILE = Path("data/inventory.json")
STORAGE_FILE = Path("data/storage_conditions.json")

DEFAULT_INVENTORY = []


def load_inventory() -> List[InventoryItem]:
    if DATA_FILE.exists():
        with DATA_FILE.open("r", encoding="utf-8") as f:
            return [InventoryItem(**item) for item in json.load(f)]
    return []


def save_inventory(items: List[InventoryItem]):
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with DATA_FILE.open("w", encoding="utf-8") as f:
        json.dump([item.dict() for item in items], f, indent=2)


def load_storage_conditions() -> List[StorageCondition]:
    if STORAGE_FILE.exists():
        with STORAGE_FILE.open("r", encoding="utf-8") as f:
            return [StorageCondition(**item) for item in json.load(f)]
    return []


def save_storage_conditions(conditions: List[StorageCondition]):
    STORAGE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with STORAGE_FILE.open("w", encoding="utf-8") as f:
        json.dump([item.dict() for item in conditions], f, indent=2)


def add_storage_condition(condition: StorageCondition) -> StorageCondition:
    conditions = load_storage_conditions()
    condition.id = len(conditions) + 1
    conditions.append(condition)
    save_storage_conditions(conditions)
    return condition


def list_storage_conditions() -> List[StorageCondition]:
    return load_storage_conditions()


def add_item(item: InventoryItem) -> InventoryItem:
    items = load_inventory()
    item.id = len(items) + 1
    items.append(item)
    save_inventory(items)
    return item


def get_item(item_id: int) -> Optional[InventoryItem]:
    items = load_inventory()
    for item in items:
        if item.id == item_id:
            return item
    return None


def update_item(item_id: int, updated: InventoryItem) -> InventoryItem:
    items = load_inventory()
    for index, item in enumerate(items):
        if item.id == item_id:
            updated.id = item_id
            items[index] = updated
            save_inventory(items)
            return updated
    raise ValueError(f"Item with id {item_id} not found")


def delete_item(item_id: int) -> None:
    items = load_inventory()
    items = [item for item in items if item.id != item_id]
    save_inventory(items)


def list_items() -> List[InventoryItem]:
    return load_inventory()
