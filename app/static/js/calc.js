import {initRegionMap} from "./steps/step1.js";
import {initBuildingView} from "./steps/step2.js";
import {initMaterialSelector, initMaterialVisualization, initCustomMaterialModal} from "./steps/step3.js";
import {initOpeningsManager} from "./steps/step4.js";

/** Инициализация калькулятора */
document.addEventListener("DOMContentLoaded", () => {
    _initCalcPageSwitcher();
    initRegionMap();
    initBuildingView();
    initMaterialSelector();
    initMaterialVisualization();
    initCustomMaterialModal();
    initOpeningsManager();
    _initFormSubmission();
});

/** Инициализация переключателя страниц калькулятора */
function _initCalcPageSwitcher() {
    const form = document.getElementById("calc-form");
    const progressItems = document.querySelectorAll(".calc__progress-item");
    const steps = document.querySelectorAll(".calc__step");
    const prevButton = document.getElementById("prev-step");
    const nextButton = document.getElementById("next-step");
    const submitContainer = document.querySelector(".calc__submit");

    let currentStep = 0;
    const totalSteps = steps.length;

    steps.forEach(step => {
        if (!step.classList.contains("calc__step")) {
            step.classList.add("calc__step");
        }
    });

    const _updateProgress = () => {
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

    const _updateButtons = () => {
        prevButton.disabled = currentStep === 0;
        prevButton.classList.toggle("calc__button--prev-disabled", currentStep === 0);

        const isLastStep = currentStep === totalSteps - 1;
        nextButton.disabled = isLastStep;
        nextButton.classList.toggle("calc__button--next-disabled", isLastStep);

        submitContainer.classList.toggle("calc__submit--hidden", !isLastStep);
        submitContainer.setAttribute("aria-hidden", isLastStep ? "false" : "true");
    };

    const _goToStep = (stepIndex) => {
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

        _updateProgress();
        _updateButtons();

        form.scrollIntoView({behavior: "smooth", block: "start"});
    };

    const goToNextStep = () => {
        if (currentStep < totalSteps - 1) {
            _goToStep(currentStep + 1);
        }
    };

    const goToPrevStep = () => {
        if (currentStep > 0) {
            _goToStep(currentStep - 1);
        }
    };

    const _initializeSteps = () => {
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

        _updateProgress();
        _updateButtons();
    };

    prevButton.addEventListener("click", goToPrevStep);
    nextButton.addEventListener("click", goToNextStep);

    progressItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            if (index <= currentStep + 1) {
                _goToStep(index);
            }
        });
    });

    _initializeSteps();
}

/** Инициализация обработки отправки формы */
function _initFormSubmission() {
    const form = document.querySelector(".calc__form");

    form.addEventListener("submit", () => {
        const doors = _collectOpeningsData("doors-list", "door");

        const windows = _collectOpeningsData("windows-list", "window");

        const doorsDataField = document.getElementById("doors-data");
        const windowsDataField = document.getElementById("windows-data");

        if (doorsDataField && windowsDataField) {
            doorsDataField.value = JSON.stringify(doors);
            windowsDataField.value = JSON.stringify(windows);
        } else {
            console.error("Скрытые поля для дверей и окон не найдены!");
        }

        const formData = new FormData(form);
        const formDataObj = {};

        for (let [key, value] of formData.entries()) {
            formDataObj[key] = value;
        }
    });
}

/** Вспомогательная функция для сбора данных о проемах (дверях/окнах) */
function _collectOpeningsData(containerId, type) {
    const items = [];
    document.querySelectorAll(`#${containerId} .calc__opening-item`).forEach(item => {
        const itemId = item.dataset.id;
        const quantity = document.getElementById(`${itemId}-quantity`).value;
        const width = document.getElementById(`${itemId}-width`).value;
        const height = document.getElementById(`${itemId}-height`).value;
        const unit_price = document.getElementById(`${itemId}-unit-price`).value;

        items.push({
            id: itemId,
            quantity: parseInt(quantity) || (type === "door" ? 0 : 1),
            width: parseFloat(width) || 0,
            height: parseFloat(height) || 0,
            unit_price: parseFloat(unit_price) || 0
        });
    });

    return items;
}
