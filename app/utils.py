import json
from .models import Material

def get_materials():
    return Material.query.all()

def get_regions_info() -> dict:
    """Возвращает информацию о регионах"""
    with open("data/regions_info.json", "r", encoding="utf-8") as f:
        return json.load(f)