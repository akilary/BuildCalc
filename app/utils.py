import os
import json
from .models import Material


def fetch_all_materials() -> list[Material]:
    """Получает все материалы из базы данных"""
    return Material.query.all()


def load_regions_data() -> list[dict[str, str]]:
    """Загружает информацию о регионах из JSON-файла"""
    with open("data/regions_info.json", "r", encoding="utf-8") as f:
        return json.load(f)


def get_calc_steps() -> list[str]:
    """Возвращает список шагов калькулятора на основе имеющихся шаблонов"""
    return os.listdir("app/templates/steps")


def parse_form_data(form: any) -> dict[str, any]:
    """Преобразует данные формы в структурированный словарь"""
    try:
        doors_data = json.loads(form.doors_data.data) if form.doors_data.data else []
        windows_data = json.loads(form.windows_data.data) if form.windows_data.data else []
    except (TypeError, json.JSONDecodeError) as e:
        raise ValueError("Неверный формат данных для дверей и(или) окон") from e

    try:
        return {
            "region": form.region.data,
            "building_height": form.building_height.data,
            "building_length": form.building_length.data,
            "building_width": form.building_width.data,
            "material": form.material.data,
            "block_weight": form.block_weight.data,
            "block_price": form.block_price.data,
            "wall_thickness": form.wall_thickness.data,
            "doors": doors_data,
            "windows": windows_data
        }
    except AttributeError as e:
        raise RuntimeError("Ошибка при извлечении данных из формы") from e
