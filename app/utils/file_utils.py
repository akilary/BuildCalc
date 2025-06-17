import os


def get_calc_steps() -> list[str]:
    """Возвращает список шагов калькулятора на основе имеющихся шаблонов"""
    return sorted(
        [
            f for f in os.listdir("app/templates/calculator/steps")
            if not (f.startswith("~") or f.endswith("~") or f.startswith("."))
        ]
    )
