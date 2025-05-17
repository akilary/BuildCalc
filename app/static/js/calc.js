import { initRegionMap } from "./steps/step1.js";
import { initBuildingVisualization } from "./steps/step2.js";
import { initMaterialSelector, initMaterialVisualization} from "./steps/step3.js";
import { initOpeningsManager } from "./steps/step4.js";

/** Инициализация переключателя страниц */
function initCalcPageSwitcher() {
    const form = document.getElementById("calc-form");
    const progressItems = document.querySelectorAll(".calc__progress-item");
    const steps = document.querySelectorAll(".calc__step");
    const prevButton = document.getElementById("prev-step");
    const nextButton = document.getElementById("next-step");
    const submitButton = document.getElementById("calc-submit");
    const submitContainer = document.querySelector(".calc__submit");

    let currentStep = 0;
    const totalSteps = steps.length;

    steps.forEach(step => {
        if (!step.classList.contains("calc__step")) {
            step.classList.add("calc__step");
        }
    });

    /** Инициализация шагов - показывает только первый шаг */
    function initializeSteps() {
        steps.forEach((step, index) => {
            if (index === 0) {
                step.classList.add("calc__step--active");
                step.setAttribute("aria-hidden", "false");
                step.removeAttribute("tabindex");
            } else {
                step.classList.remove("calc__step--active");
                step.setAttribute("aria-hidden", "true");
                step.setAttribute("tabindex", "-1");
            }
        });

        updateProgress();
        updateButtons();
    }

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
            prevButton.classList.add("calc__button--prev-disabled");
        } else {
            prevButton.disabled = false;
            prevButton.classList.remove("calc__button--prev-disabled");
        }

        if (currentStep === totalSteps - 1) {
            nextButton.disabled = true;
            nextButton.classList.add("calc__button--next-disabled");
            submitContainer.classList.remove("calc__submit--hidden");
            submitContainer.setAttribute("aria-hidden", "false");
        } else {
            nextButton.disabled = false;
            nextButton.classList.remove("calc__button--next-disabled");
            submitContainer.classList.add("calc__submit--hidden");
            submitContainer.setAttribute("aria-hidden", "true");
        }
    };

    /** Переход к определенному шагу */
    const goToStep = (stepIndex) => {
        const focusedElement = document.activeElement;
        if (steps[currentStep].contains(focusedElement)) {
            focusedElement.blur();
        }
        steps[currentStep].classList.remove("calc__step--active");
        steps[currentStep].setAttribute("aria-hidden", "true");
        steps[currentStep].setAttribute("tabindex", "-1");

        currentStep = stepIndex;

        steps[currentStep].classList.add("calc__step--active");
        steps[currentStep].setAttribute("aria-hidden", "false");
        steps[currentStep].removeAttribute("tabindex");

        updateProgress();
        updateButtons();

        form.scrollIntoView({behavior: "smooth", block: "start"});
    };

    /** Переход к следующему шагу */
    const goToNextStep = () => {
        if (currentStep < totalSteps - 1) {
            goToStep(currentStep + 1);
        }
    };

    /** Переход к предыдущему шагу */
    const goToPrevStep = () => {
        if (currentStep > 0) {
            goToStep(currentStep - 1);
        }
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
}

/** Инициализация обработки отправки формы */
function initFormSubmission() {
    const form = document.querySelector(".calc__form");

    form.addEventListener("submit", function(e) {
        const doors = [];
        document.querySelectorAll('#doors-list .calc__opening-item').forEach(doorItem => {
            const doorId = doorItem.dataset.id;
            const quantity = document.getElementById(`${doorId}-quantity`).value;
            const width = document.getElementById(`${doorId}-width`).value;
            const height = document.getElementById(`${doorId}-height`).value;
            const unit_price = document.getElementById(`${doorId}-unit-price`).value;

            doors.push({
                id: doorId,
                quantity: parseInt(quantity) || 0,
                width: parseFloat(width) || 0,
                height: parseFloat(height) || 0,
                unit_price: parseFloat(unit_price) || 0
            });
        });

        // Собираем данные об окнах
        const windows = [];
        document.querySelectorAll('#windows-list .calc__opening-item').forEach(windowItem => {
            const windowId = windowItem.dataset.id;
            const quantity = document.getElementById(`${windowId}-quantity`).value;
            const width = document.getElementById(`${windowId}-width`).value;
            const height = document.getElementById(`${windowId}-height`).value;
            const unit_price = document.getElementById(`${windowId}-unit-price`).value;

            windows.push({
                id: windowId,
                quantity: parseInt(quantity) || 1,
                width: parseFloat(width) || 0,
                height: parseFloat(height) || 0,
                unit_price: parseFloat(unit_price) || 0
            });
        });

        const doorsDataField = document.getElementById('doors-data');
        const windowsDataField = document.getElementById('windows-data');

        if (doorsDataField && windowsDataField) {
            doorsDataField.value = JSON.stringify(doors);
            windowsDataField.value = JSON.stringify(windows);

            console.log('Данные о дверях:', doors);
            console.log('Данные об окнах:', windows);
        } else {
            console.error('Скрытые поля для дверей и окон не найдены!');
        }

        const formData = new FormData(form);
        const formDataObj = {};

        for (let [key, value] of formData.entries()) {
            formDataObj[key] = value;
        }
    });
}

function init() {
    initCalcPageSwitcher();
    initRegionMap();
    initBuildingVisualization();
    initMaterialSelector();
    initMaterialVisualization();
    initOpeningsManager();
    initFormSubmission();
}

document.addEventListener("DOMContentLoaded", init);
