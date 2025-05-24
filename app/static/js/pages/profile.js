/** Инициализация профиля пользователя */
document.addEventListener("DOMContentLoaded", () => {
    _initDeleteAccountModal();
});

/** Инициализация модального окна подтверждения удаления аккаунта */
function _initDeleteAccountModal() {
    const deleteBtn = document.getElementById("delete-account-btn");
    const modal = document.getElementById("delete-account-modal");
    const cancelBtn = document.getElementById("cancel-delete");

    if (!deleteBtn || !modal || !cancelBtn) {
        console.error("Не найдены необходимые элементы для модального окна");
        return;
    }

    deleteBtn.addEventListener("click", () => {
        modal.classList.add("modal__container--active");
        modal.setAttribute("aria-hidden", "false");
    });

    cancelBtn.addEventListener("click", () => {
        _closeModal(modal);
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            _closeModal(modal);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.style.display === "block") {
            _closeModal(modal);
        }
    });
}

/** Закрывает модальное окно */
function _closeModal(modal) {
    modal.classList.remove("modal__container--active");
    modal.setAttribute("aria-hidden", "true");
}