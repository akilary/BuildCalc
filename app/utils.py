import os, json
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
            "region": dict(form.region.choices).get(form.region.data, None),
            "building_height": form.building_height.data,
            "building_length": form.building_length.data,
            "building_width": form.building_width.data,
            "material": dict(form.material.choices).get(form.material.data, None),
            "block_weight": form.block_weight.data,
            "block_price": form.block_price.data,
            "wall_thickness": form.wall_thickness.data,
            "doors": doors_data,
            "windows": windows_data
        }
    except AttributeError as e:
        raise RuntimeError("Ошибка при извлечении данных из формы") from e


def calculate_results(form_data: dict[str, any]) -> dict[str, any]:
    """Вычисляет результаты калькулятора"""
    building_length, building_width, building_height = (
        form_data["building_length"], form_data["building_width"], form_data["building_height"]
    )
    doors_data, windows_data = form_data["doors"], form_data["windows"]
    wall_thickness = float(form_data["wall_thickness"])
    material = Material.query.filter_by(name=form_data["material"]).first()
    material_size = material.size.split("×")
    block_length, block_height, block_width = float(material_size[0]), float(material_size[1]), float(material_size[2])

    total_area = 2 * (building_length + building_width) * building_height
    doors_area = sum(d["quantity"] * d["width"] * d["height"] for d in doors_data)
    windows_area = sum(w["quantity"] * w["width"] * w["height"] for w in windows_data)
    net_area = total_area - doors_area - windows_area
    volume = net_area * wall_thickness
    block_volume = block_length * block_height * block_width
    blocks_count = round((volume / block_volume) * (1 + 0.05))
    block_weight = form_data["block_weight"]

    return {
        "building": {
            "area": building_length * building_width,
            "perimeter": 2 * (building_length + building_width),
        },
        "walls": {
            "total_area": total_area,
            "net_area": net_area,
            "volume": volume
        },
        "openings": {
            "doors_area": doors_area,
            "windows_area": windows_area,
            "openings_area": doors_area + windows_area
        },
        "material": {
            "blocks_count": blocks_count,
            "weight": (blocks_count * block_weight) / 1000
        },
        "cost": {
            "materials": blocks_count * form_data["block_price"]
        }
    }
