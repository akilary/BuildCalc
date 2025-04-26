from flask import Blueprint, render_template

from ..utils import get_materials
main_bp = Blueprint("main", __name__, url_prefix="/")


@main_bp.route("/")
@main_bp.route("/home")
def home():
    return render_template("home.html")


@main_bp.route("/calc")
def calc():
    return render_template("calc.html", materials=get_materials())
