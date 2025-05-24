import json

from ..models import Material


def fetch_all_materials() -> list[Material]:
    """Получает все материалы из базы данных"""
    return Material.query.all()


def load_regions_data() -> list[dict[str, str]]:
    """Загружает информацию о регионах из JSON-файла"""
    with open("data/regions_info.json", "r", encoding="utf-8") as f:
        return json.load(f)
