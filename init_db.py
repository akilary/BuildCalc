import json

from app import create_app
from app.extensions import db
from app.models import Material

app = create_app()

with app.app_context():
    db.create_all()
    try:
        data = json.load(open("data/materials.json", "r", encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError) as e:
        raise f"Ошибка: {e}"
    for material in data:
        db.session.add(
            Material(
                name=material["name"],
                size=material["size"],
                type=material["type"],
                suitable_north=material["regions"]["north"],
                suitable_south=material["regions"]["south"],
                suitable_east=material["regions"]["east"],
                suitable_west=material["regions"]["west"],
                suitable_center=material["regions"]["center"],
                insulation_level=material["insulation_level"],
                moisture_resistance=material["moisture_resistance"],
                notes=material["notes"],
            )
        )

    db.session.commit()
    print("База данных успешно создана!")