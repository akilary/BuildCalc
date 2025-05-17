from flask_login import UserMixin

from .extensions import db


# @login_manager.user_loader
# def load_user(user_id):
#     return User.query.get(int(user_id))


class User(db.Model, UserMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)


class Material(db.Model):
    __tablename__ = "materials"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    size = db.Column(db.String(50), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    suitable_north = db.Column(db.Boolean, default=False)
    suitable_south = db.Column(db.Boolean, default=False)
    suitable_east = db.Column(db.Boolean, default=False)
    suitable_west = db.Column(db.Boolean, default=False)
    suitable_center = db.Column(db.Boolean, default=False)
    insulation_level = db.Column(db.String(20), nullable=True)
    moisture_resistance = db.Column(db.String(20), nullable=True)
    blocks_per_pallet = db.Column(db.Integer)
    notes = db.Column(db.Text, nullable=True)

    def get_suitable_regions(self):
        """Возвращает список подходящих регионов на русском языке"""
        region_map = {
            "Север": self.suitable_north,
            "Юг": self.suitable_south,
            "Восток": self.suitable_east,
            "Запад": self.suitable_west,
            "Центр": self.suitable_center
        }
        return [region for region, is_suitable in region_map.items() if is_suitable]

    def __repr__(self):
        return f"<Material {self.name}>"