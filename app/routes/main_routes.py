from flask import Blueprint, render_template, redirect, url_for, flash, session
from flask_login import login_required

from ..forms import CalcForm
from ..utils import fetch_all_materials, load_regions_data, get_calc_steps, parse_form_data, calculate_results

main_bp = Blueprint("main", __name__, url_prefix="/")


@main_bp.route("/")
@main_bp.route("/home")
def home():
    return render_template("pages/home.html")


@main_bp.route("/methodology")
def methodology():
    return render_template("pages/methodology.html")


@main_bp.route("/calc", methods=["POST", "GET"])
@login_required
def calc():
    regions = load_regions_data()
    materials = fetch_all_materials()

    form = CalcForm()
    form.region.choices = [(r["id"], r["name"]) for r in regions]
    form.material.choices = [(str(m.id), m.name) for m in materials] + [("custom", "Свой материал")]

    if form.validate_on_submit():
        try:
            session["form_data"] = parse_form_data(form)
            return redirect(url_for("main.results"))
        except ValueError as e:
            flash(str(e), "danger")
        except RuntimeError as e:
            flash(str(e), "danger")

    return render_template(
        "calculator/calc.html",
        form=form,
        steps=get_calc_steps(),
        region_map={r["id"]: r for r in regions},
        materials=materials
    )


@main_bp.route("/results", methods=["GET"])
@login_required
def results():
    form_data = session.get('form_data', {})

    if not form_data:
        return redirect(url_for('main.calc'))

    return render_template("pages/results.html", form_data=form_data, res=calculate_results(form_data))
