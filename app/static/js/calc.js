const initCalcPageSwitcher = () => {
    const form = document.querySelector(".calc__form");
    const progressItems = document.querySelectorAll(".calc__progress-item");
    const steps = document.querySelectorAll(".calc__step");
    const prevButton = document.getElementById("prev-step");
    const nextButton = document.getElementById("next-step");

    let currentStep = 0;
    const totalSteps = steps.length;

    steps.forEach(step => {
        if (!step.classList.contains("calc__step")) {
            step.classList.add("calc__step");
        }
    });

    /** Инициализация шагов - показывает только первый шаг */
    const initializeSteps = () => {
        steps.forEach((step, index) => {
            if (index === 0) {
                step.classList.add("calc__step--active");
                step.setAttribute("aria-hidden", "false");
            } else {
                step.classList.remove("calc__step--active");
                step.setAttribute("aria-hidden", "true");
            }
        });

        updateProgress();
        updateButtons();
    };

    /** Обновление индикаторов прогресса */
    const updateProgress = () => {
        progressItems.forEach((item, index) => {
            if (index < currentStep) {
                item.classList.add("calc__progress-item--completed");
                item.classList.remove("calc__progress-item--active");
                item.setAttribute("aria-hidden", "false");
            } else if (index === currentStep) {
                item.classList.add("calc__progress-item--active");
                item.classList.remove("calc__progress-item--completed");
                item.setAttribute("aria-current", "step");
                item.setAttribute("aria-hidden", "false");
            } else {
                item.classList.remove("calc__progress-item--active", "calc__progress-item--completed");
                item.removeAttribute("aria-current");
                item.setAttribute("aria-hidden", "true");
            }
        });
    };

    /** Обновление состояния кнопок */
    const updateButtons = () => {
        if (currentStep === 0) {
            prevButton.disabled = true;
            prevButton.classList.add("disabled");
        } else {
            prevButton.disabled = false;
            prevButton.classList.remove("disabled");
        }

        if (currentStep === totalSteps - 1) {
            nextButton.textContent = "Рассчитать";
        } else {
            nextButton.textContent = "Далее";
        }
    };

    /** Переход к определенному шагу */
    const goToStep = (stepIndex) => {
        steps[currentStep].classList.remove("calc__step--active");
        steps[currentStep].setAttribute("aria-hidden", "true");

        currentStep = stepIndex;

        steps[currentStep].classList.add("calc__step--active");
        steps[currentStep].setAttribute("aria-hidden", "false");

        updateProgress();
        updateButtons();

        form.scrollIntoView({behavior: "smooth", block: "start"});
    };

    /** Переход к следующему шагу */
    const goToNextStep = () => {
        if (currentStep < totalSteps - 1) {
            goToStep(currentStep + 1);
        } else {
            submitForm();
        }
    };

    /** Переход к предыдущему шагу */
    const goToPrevStep = () => {
        if (currentStep > 0) {
            goToStep(currentStep - 1);
        }
    };

    /** Отправка формы */
    const submitForm = () => {
        console.log("Form submitted!");
    };

    prevButton.addEventListener("click", goToPrevStep);
    nextButton.addEventListener("click", goToNextStep);

    progressItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            if (index <= currentStep + 1) {
                goToStep(index);
            }
        });
    });

    initializeSteps();
};

/** Инициализация интерактивной карты регионов */
const initRegionMap = () => {
    const regionPaths = document.querySelectorAll(".calc__map-path--region");
    const regionInputs = document.querySelectorAll(".calc__region-input");

    const selectRegion = (regionId) => {
        regionPaths.forEach(path => {
            path.classList.remove("calc__map-path--selected");
        });

        regionInputs.forEach(input => {
            input.checked = input.value === regionId;

            const label = input.closest(".calc__region-label");
            if (label) {
                if (input.checked) {
                    label.classList.add("calc__region-label--selected");
                } else {
                    label.classList.remove("calc__region-label--selected");
                }
            }
        });

        const selectedPath = document.querySelector(`.calc__map-path--region[data-region-id="${regionId}"]`);
        if (selectedPath) {
            selectedPath.classList.add("calc__map-path--selected");
        }
    };

    regionPaths.forEach(path => {
        const regionId = path.getAttribute("data-region-id");

        path.addEventListener("click", () => {
            selectRegion(regionId);
        });

        path.addEventListener("mouseenter", () => {
            path.style.transform = "translateY(-2px)";
        });

        path.addEventListener("mouseleave", () => {
            path.style.transform = "translateY(0)";
        });
    });

    regionInputs.forEach(input => {
        input.addEventListener("change", () => {
            if (input.checked) {
                selectRegion(input.value);
            }
        });
    });

    const checkedInput = document.querySelector(".calc__region-input:checked");
    if (checkedInput) {
        selectRegion(checkedInput.value);
    }
};

/** Инициализация выбора материала стен */
const initMaterialSelector = () => {
    const materialSelect = document.getElementById("material-select");
    const customMaterialControls = document.getElementById("custom-material-controls");

    if (materialSelect) {
        new Choices(materialSelect, {
            searchEnabled: false,
            itemSelectText: "",
            shouldSort: false,
        });

        materialSelect.addEventListener("change", () => {
            if (customMaterialControls) {
                if (materialSelect.value === "custom") {
                    customMaterialControls.classList.add("calc__custom-material--active");
                    customMaterialControls.setAttribute("aria-hidden", "false");
                } else {
                    customMaterialControls.classList.remove("calc__custom-material--active");
                    customMaterialControls.setAttribute("aria-hidden", "true");
                }
            }
        });
    }

    const addCustomMaterialButton = document.getElementById("add-custom-material");
    if (addCustomMaterialButton) {
        addCustomMaterialButton.addEventListener("click", () => {
            console.log("Открытие модального окна для добавления своего материала");
        });
    }
};

/** Основная инициализация */
const init = () => {
    initCalcPageSwitcher();
    initRegionMap();
    initMaterialSelector();
};

document.addEventListener("DOMContentLoaded", init);