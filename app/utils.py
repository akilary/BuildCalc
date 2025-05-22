import json
import math
import os

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
    return [
        f for f in os.listdir("app/templates/steps")
        if not (f.startswith("~") or f.endswith("~") or f.startswith("."))
    ]


def parse_form_data(form: any) -> dict[str, any]:
    """Преобразует данные формы в структурированный словарь"""
    try:
        custom_material = json.loads(form.custom_material.data) if form.custom_material.data else {}
        doors_data = json.loads(form.doors_data.data) if form.doors_data.data else []
        windows_data = json.loads(form.windows_data.data) if form.windows_data.data else []
    except (TypeError, json.JSONDecodeError) as e:
        raise ValueError("Некорректные данные формы для скрытых полей") from e
    try:
        return {
            "region": dict(form.region.choices).get(form.region.data, ""),
            "building_height": form.building_height.data,
            "building_length": form.building_length.data,
            "building_width": form.building_width.data,
            "material": dict(form.material.choices).get(form.material.data, "custom"),
            "block_weight": form.block_weight.data,
            "block_price": form.block_price.data,
            "wall_thickness": form.wall_thickness.data,
            "custom_material": custom_material,
            "doors": doors_data,
            "windows": windows_data
        }
    except AttributeError as e:
        raise RuntimeError("Ошибка при извлечении данных из формы") from e


def calculate_results(form_data: dict[str, any]) -> dict[str, any]:
    """Вычисляет результаты калькулятора"""
    try:
        building_length = float(form_data["building_length"])
        building_width = float(form_data["building_width"])
        building_height = float(form_data["building_height"])
        wall_thickness = float(form_data["wall_thickness"])

        doors_data = form_data.get("doors", [])
        windows_data = form_data.get("windows", [])

        block_weight = float(form_data["block_weight"])
        block_price = float(form_data["block_price"])

        if form_data["material"] == "custom":
            material = form_data["custom_material"]
            block_dimensions = material.get("size", "0×0×0").split("×")
            block_length, block_width, block_height = map(
                lambda x: float(x) if x and x.replace(".", "", 1).isdigit() else 0,
                block_dimensions
            )
            material_info = {
                "notes": "Пользовательский материал",
                "insulation_level": "Не указано",
                "moisture_resistance": "Не указано"
            }
            blocks_per_pallet = 0
        else:
            material = Material.query.filter_by(name=form_data["material"]).first()
            if not material:
                raise ValueError(f"Материал '{form_data["material"]}' не найден в базе данных")

            block_dimensions = material.size.split("×")
            if len(block_dimensions) != 3:
                raise ValueError(f"Неверный формат размеров блока: {material.size}")

            block_length, block_width, block_height = map(float, block_dimensions)
            material_info = {
                "notes": material.notes or "Информация отсутствует",
                "insulation_level": material.insulation_level or "Не указано",
                "moisture_resistance": material.moisture_resistance or "Не указано"
            }
            blocks_per_pallet = material.blocks_per_pallet or 0

        building_area = building_length * building_width
        building_perimeter = 2 * (building_length + building_width)
        total_wall_area = building_perimeter * building_height

        doors_area = sum(
            float(d.get("quantity", 0)) * float(d.get("width", 0)) * float(d.get("height", 0))
            for d in doors_data
        )
        windows_area = sum(
            float(w.get("quantity", 0)) * float(w.get("width", 0)) * float(w.get("height", 0))
            for w in windows_data
        )
        openings_area = doors_area + windows_area

        net_wall_area = total_wall_area - openings_area

        actual_wall_thickness = wall_thickness * (block_width / 1000)
        wall_volume = net_wall_area * actual_wall_thickness

        block_volume_m3 = (block_length / 1000) * (block_height / 1000) * (block_width / 1000)

        waste_factor = 1.05
        blocks_count = math.ceil(wall_volume / block_volume_m3 * waste_factor) if block_volume_m3 > 0 else 0

        pallets_count = (
            math.ceil(blocks_count / blocks_per_pallet)
            if blocks_per_pallet and blocks_count > 0
            else "Не определено"
        )


        total_cost = blocks_count * block_price
        cost_per_square_meter = round(total_cost / net_wall_area, 2) if net_wall_area > 0 else 0

        door_cost = sum(
            float(d.get("quantity", 0)) * float(d.get("unit_price", 0))
            for d in doors_data
        )
        window_cost = sum(
            float(w.get("quantity", 0)) * float(w.get("unit_price", 0))
            for w in windows_data
        )

        region_compatibility = "Не определено"
        region_name = form_data.get("region", "").lower()

        if region_name and form_data["material"] != "custom" and material:
            region_compatibility = "Не рекомендуется"

            if "север" in region_name and material.suitable_north:
                region_compatibility = "Подходит"
            elif "юг" in region_name and material.suitable_south:
                region_compatibility = "Подходит"
            elif "восток" in region_name and material.suitable_east:
                region_compatibility = "Подходит"
            elif "запад" in region_name and material.suitable_west:
                region_compatibility = "Подходит"
            elif "центр" in region_name and material.suitable_center:
                region_compatibility = "Подходит"

        material_info["region_compatibility"] = region_compatibility

        return {
            "building": {
                "area": _smart_number(building_area),
                "perimeter": _smart_number(building_perimeter),
            },
            "walls": {
                "total_area": _smart_number(total_wall_area),
                "net_area": _smart_number(net_wall_area),
                "volume": _smart_number(wall_volume)
            },
            "openings": {
                "doors_area": _smart_number(doors_area),
                "windows_area": _smart_number(windows_area),
                "openings_area": _smart_number(openings_area)
            },
            "material": {
                "blocks_count": _smart_number(blocks_count),
                "pallets_count": _smart_number(pallets_count),
                "weight": _smart_number((blocks_count * block_weight) / 1000),
                "size": " × ".join([str(_smart_number(i)) for i in [block_length, block_width, block_height]])
            },
            "cost": {
                "materials": _smart_number(total_cost),
                "per_square_meter": _smart_number(cost_per_square_meter)
            },
            "material_info": material_info,
            "openings_cost": {
                "doors": _smart_number(door_cost),
                "windows": _smart_number(window_cost)
            }
        }
    except (ValueError, TypeError, KeyError) as e:
        raise ValueError(f"Ошибка при расчете: {str(e)}") from e


def _smart_number(value: int | float | str) -> int | float:
    """Возвращает число с округлением до двух знаков после запятой"""
    try:
        number = float(value)
        if number.is_integer():
            return int(number)
        return round(number, 2)
    except (ValueError, TypeError):
        print(f"Невозможно преобразовать в число: {value}")
        return value
