/** Инициализация страницы аутентификации */
document.addEventListener("DOMContentLoaded", () => {
    _initPasswordToggles();
});

/** Инициализация переключателей видимости пароля */
function _initPasswordToggles() {
    const passwordToggles = document.querySelectorAll(".auth__password-toggle");

    if (!passwordToggles.length) {
        console.error("Не найдены переключатели видимости пароля");
        return;
    }

    passwordToggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
            const wrapper = toggle.closest(".auth__password-wrapper");
            const passwordInput = wrapper.querySelector("input");
            const icon = toggle.querySelector(".auth__password-toggle-icon");

            if (!passwordInput || !icon) {
                console.error("Не найдены необходимые элементы для переключения пароля");
                return;
            }

            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                icon.textContent = "visibility";
            } else {
                passwordInput.type = "password";
                icon.textContent = "visibility_off";
            }
        });
    });
}