from flask_wtf import FlaskForm
from wtforms import (
    StringField, EmailField, PasswordField, SubmitField, SelectField, RadioField, IntegerField, FloatField, HiddenField
)
from wtforms.validators import DataRequired, Email, Length, EqualTo, NumberRange


class RegistrationForm(FlaskForm):
    email = EmailField(
        "Email",
        validators=[DataRequired(), Email(message="Введите корректный email.")],
        render_kw={
            "id": "register-email",
            "class": "auth__input",
            "placeholder": "example@mail.com",
            "autocomplete": "email"
        }
    )
    username = StringField(
        "Username",
        validators=[DataRequired()],
        render_kw={
            "id": "register-username",
            "class": "auth__input",
            "placeholder": "Например: fireman_91",
            "autocomplete": "username"
        }
    )
    password = PasswordField(
        "Password",
        validators=[DataRequired(), Length(min=8)],
        render_kw={
            "id": "register-password",
            "class": "auth__input",
            "placeholder": "Минимум 8 символов",
            "autocomplete": "new-password"
        }
    )
    confirm_password = PasswordField(
        "Confirm Password",
        validators=[DataRequired(), Length(min=8), EqualTo("password", message="Пароли должны совпадать")],
        render_kw={
            "id": "register-confirm-password",
            "class": "auth__input",
            "placeholder": "Ещё раз",
            "autocomplete": "new-password"
        }
    )
    submit = SubmitField("Регистрация", render_kw={"class": "auth__submit"})


class LoginForm(FlaskForm):
    username = RadioField(
        "Username",
        validators=[DataRequired()],
        render_kw={
            "id": "login-username",
            "class": "auth__input",
            "placeholder": "example@mail.com или fireman_91",
            "autocomplete": "username"
        }
    )
    password = PasswordField(
        "Password",
        validators=[DataRequired(), Length(min=8)],
        render_kw={
            "id": "login-password",
            "class": "auth__input",
            "placeholder": "Введите пароль",
            "autocomplete": "current-password"
        }
    )
    submit = SubmitField("Войти", render_kw={"class": "auth__submit"})


class CustomSelectField(SelectField):
    """SelectField с возможностью выбора 'custom'"""

    def pre_validate(self, form):
        if self.data and self.data.startswith("custom_"):
            return True

        super().pre_validate(form)


class CalcForm(FlaskForm):
    # Шаг 1: Выбор региона
    region = RadioField(
        "Region",
        validators=[DataRequired(message="Выберите регион")],
        choices=[],
        render_kw={
            "type": "radio",
            "class": "calc__region-input",
            "required": True
        },
    )
    # Шаг 2: Размеры здания
    building_length = IntegerField(
        "Building length",
        validators=[DataRequired(message="Укажите длину")],
        default=10,
        render_kw={"class": "calc__building-selection-input",
                   "min": 0}
    )
    building_width = IntegerField(
        "Building width",
        validators=[DataRequired(message="Укажите ширину")],
        default=8,
        render_kw={
            "class": "calc__building-selection-input",
            "min": 0
        }
    )
    building_height = IntegerField(
        "Building height",
        validators=[DataRequired(message="Укажите высоту")],
        default=3,
        render_kw={"class": "calc__building-selection-input",
                   "min": 0}
    )
    # Шаг 3: Материал стен
    material = CustomSelectField(
        "Material",
        validators=[DataRequired(message="Выберите материал")],
        choices=[]
    )
    block_weight = FloatField(
        "Block weight",
        validators=[DataRequired(message="Укажите вес блока"), NumberRange(min=0)],
        default=15.0,
        render_kw={
            "id": "block-weight",
            "class": "calc__material-card-input",
            "min": "0",
        }
    )
    block_price = FloatField(
        "Block price",
        validators=[DataRequired(message="Укажите цену блока"), NumberRange(min=0)],
        default=500.0,
        render_kw={
            "id": "block-price",
            "class": "calc__material-card-input",
            "min": "0"
        }
    )
    wall_thickness = RadioField(
        "Wall thickness",
        validators=[DataRequired(message="Выберите толщину стен")],
        choices=[("0.5", "0.5"), ("1", "1"), ("1.5", "1.5"), ("2", "2")],
        render_kw={
            "class": "calc__thickness-input",
            "type": "radio"
        }
    )
    custom_material = HiddenField(
        "Custom material",
        validators=[DataRequired(message="Добавьте информацию о материале")],
        render_kw={"id": "custom-material"}
    )
    # Шаг 4: Окна и двери
    doors_data = HiddenField(
        "Doors data",
        validators=[DataRequired(message="Добавьте информацию о дверях")],
        render_kw={"id": "doors-data"}
    )
    windows_data = HiddenField(
        "Windows data",
        validators=[DataRequired(message="Добавьте информацию об окнах")],
        render_kw={"id": "windows-data"}
    )

    submit = SubmitField(
        "Рассчитать",
        render_kw={
            "class": "calc__button calc__button--submit calc__button--submit-hidden",
            "id": "calc-submit",
        }
    )
