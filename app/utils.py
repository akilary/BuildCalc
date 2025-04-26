from sqlalchemy import or_
from werkzeug.security import generate_password_hash, check_password_hash

from .extensions import db
from .models import Material

# ============================================================ #
#  Утилиты для работы с материалами                            #
# ============================================================ #

def get_materials():
    return Material.query.all()

