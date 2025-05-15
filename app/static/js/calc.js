/** Инициализирует страницу-калькулятор, создавая навигацию по шагам */
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
                step.removeAttribute("tabindex");
            } else {
                step.classList.remove("calc__step--active");
                step.setAttribute("aria-hidden", "true");
                step.setAttribute("tabindex", "-1");
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
// const initMaterialSelector = () => {
//     const materialSelect = document.getElementById("material-select");
//     const customMaterialControls = document.getElementById("custom-material-controls");
//
//     if (materialSelect) {
//         materialSelect.addEventListener("change", () => {
//             if (customMaterialControls) {
//                 if (materialSelect.value === "custom") {
//                     customMaterialControls.classList.add("calc__custom-material--active");
//                     customMaterialControls.setAttribute("aria-hidden", "false");
//                 } else {
//                     customMaterialControls.classList.remove("calc__custom-material--active");
//                     customMaterialControls.setAttribute("aria-hidden", "true");
//                 }
//             }
//         });
//     }
//
//     const addCustomMaterialButton = document.getElementById("add-custom-material");
//     if (addCustomMaterialButton) {
//         addCustomMaterialButton.addEventListener("click", () => {
//             console.log("Открытие модального окна для добавления своего материала");
//         });
//     }
// };

/** Инициализация управления дверями и окнами */
const initOpeningsManager = () => {
    let doorCounter = 1;
    let windowCounter = 1;

    // Текущие индексы для пагинации
    let currentDoorIndex = 0;
    let currentWindowIndex = 0;

    const doorsListContainer = document.getElementById("doors-list");
    const windowsListContainer = document.getElementById("windows-list");

    const addDoorButton = document.getElementById("add-door");
    const addWindowButton = document.getElementById("add-window");

    // Кнопки пагинации для дверей
    const prevDoorButton = document.querySelector('[data-action="prev-door"]');
    const nextDoorButton = document.querySelector('[data-action="next-door"]');

    // Кнопки пагинации для окон
    const prevWindowButton = document.querySelector('[data-action="prev-window"]');
    const nextWindowButton = document.querySelector('[data-action="next-window"]');

    // Элементы отображения текущей страницы
    const doorPaginationCurrent = prevDoorButton?.closest('.calc__openings-pagination')?.querySelector('.calc__openings-pagination-current');
    const doorPaginationTotal = prevDoorButton?.closest('.calc__openings-pagination')?.querySelector('.calc__openings-pagination-total');

    const windowPaginationCurrent = prevWindowButton?.closest('.calc__openings-pagination')?.querySelector('.calc__openings-pagination-current');
    const windowPaginationTotal = prevWindowButton?.closest('.calc__openings-pagination')?.querySelector('.calc__openings-pagination-total');

    const createDoor = () => {
        doorCounter++;
        const doorId = `door-${doorCounter}`;

        const doorElement = document.createElement("div");
        doorElement.className = "calc__opening-item";
        doorElement.dataset.id = doorId;
        doorElement.dataset.openingId = doorId;

        doorElement.innerHTML = `
            <div class="calc__opening-header">
                <h4 class="calc__opening-name">Дверь ${doorCounter}</h4>
                <button type="button" class="calc__button calc__button--remove" data-action="remove-opening" aria-label="Удалить дверь ${doorCounter}">
                    <span class="material-icons calc__button-icon" aria-hidden="true">delete</span>
                </button>
            </div>
            <div class="calc__opening-dimensions">
                <div class="calc__opening-dimension">
                    <label for="${doorId}-quantity" class="calc__opening-label">
                        <span class="calc__input-text">
                            <span class="material-icons calc__opening-icon" aria-hidden="true">filter_1</span>
                            Количество:
                        </span>
                    </label>
                    <input type="number" id="${doorId}-quantity" class="calc__opening-input" min="1" max="10" value="1" required>
                </div>
                <div class="calc__opening-dimension">
                    <label for="${doorId}-width" class="calc__opening-label">
                        <span class="calc__input-text">
                            <span class="material-icons calc__opening-icon" aria-hidden="true">swap_horiz</span>
                            Ширина (м):
                        </span>
                    </label>
                    <input type="number" id="${doorId}-width" class="calc__opening-input" min="0.6" max="2.5" step="0.1" value="0.9" required>
                </div>
                <div class="calc__opening-dimension">
                    <label for="${doorId}-height" class="calc__opening-label">
                        <span class="calc__input-text">
                            <span class="material-icons calc__opening-icon" aria-hidden="true">height</span>
                            Высота (м):
                        </span>
                    </label>
                    <input type="number" id="${doorId}-height" class="calc__opening-input" min="1.5" max="2.5" step="0.1" value="2.0" required>
                </div>
            </div>
    `;

        doorsListContainer.appendChild(doorElement);

        const removeButton = doorElement.querySelector('[data-action="remove-opening"]');
        removeButton.addEventListener("click", (e) => {
            const targetId = e.currentTarget.closest(".calc__opening-item").dataset.openingId;
            removeOpening(targetId);
        });

        updateOpeningsCount("door");
        updateDoorPagination();

        // Переключаемся на новую дверь
        showDoorByIndex(doorsListContainer.children.length - 1);

        return doorElement;
    };

    const createWindow = () => {
        windowCounter++;
        const windowId = `window-${windowCounter}`;

        const windowElement = document.createElement("div");
        windowElement.className = "calc__opening-item";
        windowElement.dataset.id = windowId;
        windowElement.dataset.openingId = windowId;

        windowElement.innerHTML = `
            <div class="calc__opening-header">
                <h4 class="calc__opening-name">Окно ${windowCounter}</h4>
                <button type="button" class="calc__button calc__button--remove" data-action="remove-opening" aria-label="Удалить окно ${windowCounter}">
                    <span class="material-icons calc__button-icon" aria-hidden="true">delete</span>
                </button>
            </div>
            <div class="calc__opening-dimensions">
                <div class="calc__opening-dimension">
                    <label for="${windowId}-quantity" class="calc__opening-label">
                        <span class="calc__input-text">
                            <span class="material-icons calc__opening-icon" aria-hidden="true">filter_1</span>
                            Количество:
                        </span>
                    </label>
                    <input type="number" id="${windowId}-quantity" class="calc__opening-input" min="1" max="20" value="1" required>
                </div>
                <div class="calc__opening-dimension">
                    <label for="${windowId}-width" class="calc__opening-label">
                        <span class="calc__input-text">
                            <span class="material-icons calc__opening-icon" aria-hidden="true">swap_horiz</span>
                            Ширина (м):
                        </span>
                    </label>
                    <input type="number" id="${windowId}-width" class="calc__opening-input" min="0.3" max="3" step="0.1" value="1.2" required>
                </div>
                <div class="calc__opening-dimension">
                    <label for="${windowId}-height" class="calc__opening-label">
                        <span class="calc__input-text">
                            <span class="material-icons calc__opening-icon" aria-hidden="true">height</span>
                            Высота (м):
                        </span>
                    </label>
                    <input type="number" id="${windowId}-height" class="calc__opening-input" min="0.3" max="2.5" step="0.1" value="1.4" required>
                </div>
            </div>
    `;

        windowsListContainer.appendChild(windowElement);

        const removeButton = windowElement.querySelector('[data-action="remove-opening"]');
        removeButton.addEventListener("click", (e) => {
            const targetId = e.currentTarget.closest(".calc__opening-item").dataset.openingId;
            removeOpening(targetId);
        });

        updateOpeningsCount("window");
        updateWindowPagination();

        // Переключаемся на новое окно
        showWindowByIndex(windowsListContainer.children.length - 1);

        return windowElement;
    };

    const removeOpening = (openingId) => {
        const openingElement = document.querySelector(`[data-opening-id="${openingId}"]`);
        if (!openingElement) return;

        const isDoor = openingId.startsWith("door");
        const container = isDoor ? doorsListContainer : windowsListContainer;

        if (container.children.length <= 1) {
            alert(`Должен быть хотя бы один элемент типа "${isDoor ? "Дверь" : "Окно"}"!`);
            return;
        }

        // Получаем индекс удаляемого элемента
        const elementIndex = Array.from(container.children).indexOf(openingElement);

        openingElement.style.opacity = "0";
        openingElement.style.transform = "translateY(-10px)";

        setTimeout(() => {
            openingElement.remove();
            updateOpeningsCount(isDoor ? "door" : "window");

            // Обновляем пагинацию
            if (isDoor) {
                updateDoorPagination();
                // Если удаляем текущий элемент, переключаемся на предыдущий или первый
                if (elementIndex === currentDoorIndex) {
                    const newIndex = Math.min(elementIndex, container.children.length - 1);
                    showDoorByIndex(newIndex);
                } else if (elementIndex < currentDoorIndex) {
                    // Если удаляем элемент перед текущим, корректируем индекс
                    showDoorByIndex(currentDoorIndex - 1);
                }
            } else {
                updateWindowPagination();
                // Если удаляем текущий элемент, переключаемся на предыдущий или первый
                if (elementIndex === currentWindowIndex) {
                    const newIndex = Math.min(elementIndex, container.children.length - 1);
                    showWindowByIndex(newIndex);
                } else if (elementIndex < currentWindowIndex) {
                    // Если удаляем элемент перед текущим, корректируем индекс
                    showWindowByIndex(currentWindowIndex - 1);
                }
            }
        }, 300);
    };

    const updateOpeningsCount = (type) => {
        const container = type === "door" ? doorsListContainer : windowsListContainer;
        const count = container.children.length;
        console.log(`Количество ${type === "door" ? "дверей" : "окон"}: ${count}`);
    };

    // Функции для пагинации дверей
    const updateDoorPagination = () => {
        if (!doorPaginationCurrent || !doorPaginationTotal || !prevDoorButton || !nextDoorButton) return;

        const totalDoors = doorsListContainer.children.length;
        doorPaginationTotal.textContent = totalDoors;
        doorPaginationCurrent.textContent = currentDoorIndex + 1;

        // Обновляем состояние кнопок
        prevDoorButton.disabled = currentDoorIndex === 0;
        nextDoorButton.disabled = currentDoorIndex === totalDoors - 1;
    };

    const showDoorByIndex = (index) => {
        const doors = Array.from(doorsListContainer.children);
        if (index < 0 || index >= doors.length) return;

        doors.forEach((door, i) => {
            if (i === index) {
                door.style.display = "block";
                door.style.animation = "fadeIn 0.3s ease-out";
            } else {
                door.style.display = "none";
            }
        });

        currentDoorIndex = index;
        updateDoorPagination();
    };

    // Функции для пагинации окон
    const updateWindowPagination = () => {
        if (!windowPaginationCurrent || !windowPaginationTotal || !prevWindowButton || !nextWindowButton) return;

        const totalWindows = windowsListContainer.children.length;
        windowPaginationTotal.textContent = totalWindows;
        windowPaginationCurrent.textContent = currentWindowIndex + 1;

        // Обновляем состояние кнопок
        prevWindowButton.disabled = currentWindowIndex === 0;
        nextWindowButton.disabled = currentWindowIndex === totalWindows - 1;
    };

    const showWindowByIndex = (index) => {
        const windows = Array.from(windowsListContainer.children);
        if (index < 0 || index >= windows.length) return;

        windows.forEach((window, i) => {
            if (i === index) {
                window.style.display = "block";
                window.style.animation = "fadeIn 0.3s ease-out";
            } else {
                window.style.display = "none";
            }
        });

        currentWindowIndex = index;
        updateWindowPagination();
    };

    const initExistingOpenings = () => {
        const removeButtons = document.querySelectorAll('[data-action="remove-opening"]');
        removeButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const targetId = e.currentTarget.closest(".calc__opening-item").dataset.openingId;
                removeOpening(targetId);
            });
        });

        updateOpeningsCount("door");
        updateOpeningsCount("window");

        // Инициализация пагинации
        updateDoorPagination();
        updateWindowPagination();

        // Показываем первые элементы
        showDoorByIndex(0);
        showWindowByIndex(0);
    };

    if (addDoorButton) {
        addDoorButton.addEventListener("click", createDoor);
    }

    if (addWindowButton) {
        addWindowButton.addEventListener("click", createWindow);
    }

    // Обработчики для кнопок пагинации дверей
    if (prevDoorButton) {
        prevDoorButton.addEventListener("click", () => {
            if (currentDoorIndex > 0) {
                showDoorByIndex(currentDoorIndex - 1);
            }
        });
    }

    if (nextDoorButton) {
        nextDoorButton.addEventListener("click", () => {
            if (currentDoorIndex < doorsListContainer.children.length - 1) {
                showDoorByIndex(currentDoorIndex + 1);
            }
        });
    }

    // Обработчики для кнопок пагинации окон
    if (prevWindowButton) {
        prevWindowButton.addEventListener("click", () => {
            if (currentWindowIndex > 0) {
                showWindowByIndex(currentWindowIndex - 1);
            }
        });
    }

    if (nextWindowButton) {
        nextWindowButton.addEventListener("click", () => {
            if (currentWindowIndex < windowsListContainer.children.length - 1) {
                showWindowByIndex(currentWindowIndex + 1);
            }
        });
    }

    initExistingOpenings();
};

/** Инициализация выбора типа фундамента */
// const initFoundationSelector = () => {
//     const foundationTypeInputs = document.querySelectorAll("input[name='foundation-type']");
//     const foundationSlabSection = document.querySelector(".calc__foundation-type--slab");
//     const foundationStripSection = document.querySelector(".calc__foundation-type--strip");
//     const concreteGroup = document.querySelector(".calc__concrete-group");
//     const materialSelect = document.getElementById("concrete-select")
//
//     const showFoundationSection = (foundationType) => {
//         switch (foundationType) {
//             case "slab":
//                 foundationSlabSection.classList.add("calc__foundation-type--slab-active");
//                 foundationStripSection.classList.remove("calc__foundation-type--strip-active");
//                 concreteGroup.classList.add("calc__concrete-group--active");
//                 break;
//             case "strip":
//                 foundationStripSection.classList.add("calc__foundation-type--strip-active");
//                 foundationSlabSection.classList.remove("calc__foundation-type--slab-active");
//                 concreteGroup.classList.add("calc__concrete-group--active");
//                 break;
//             default:
//                 foundationSlabSection.classList.remove("calc__foundation-type--slab-active");
//                 foundationStripSection.classList.remove("calc__foundation-type--strip-active");
//                 concreteGroup.classList.remove("calc__concrete-group--active");
//                 break;
//         }
//     };
//
//     foundationTypeInputs.forEach(input => {
//         input.addEventListener("change", () => {
//             if (input.checked) {
//                 showFoundationSection(input.value);
//             }
//         });
//     });
//
//     const checkedFoundationType = document.querySelector("input[name='foundation-type']:checked");
//     if (checkedFoundationType) {
//         showFoundationSection(checkedFoundationType.value);
//     }
//
//     const stripTypeInputs = document.querySelectorAll("input[name='strip-type']");
//     stripTypeInputs.forEach(input => {
//         input.addEventListener("change", () => {
//             console.log(`Выбран тип ленточного фундамента: ${input.value}`);
//
//             const tShapedFields = document.querySelectorAll("[data-strip-type='t-shaped']");
//             if (tShapedFields) {
//                 tShapedFields.forEach(field => {
//                     if (input.value === "t-shaped") {
//                         field.style.display = "flex";
//                     } else {
//                         field.style.display = "none";
//                     }
//                 });
//             }
//         });
//     });
//
//     const checkedStripType = document.querySelector("input[name='strip-type']:checked");
//     if (checkedStripType) {
//         const tShapedFields = document.querySelectorAll("[data-strip-type='t-shaped']");
//         if (tShapedFields) {
//             tShapedFields.forEach(field => {
//                 if (checkedStripType.value === "t-shaped") {
//                     field.style.display = "flex";
//                 } else {
//                     field.style.display = "none";
//                 }
//             });
//         }
//     } else {
//         const tShapedFields = document.querySelectorAll('[data-strip-type="t-shaped"]');
//         if (tShapedFields) {
//             tShapedFields.forEach(field => {
//                 field.style.display = 'none';
//             });
//         }
//     }
// };

/** Основная инициализация функциональности калькулятора */
const init = () => {
    initCalcPageSwitcher();
    initRegionMap();
    // initMaterialSelector();
    initOpeningsManager();
    // initFoundationSelector();
};

document.addEventListener("DOMContentLoaded", init);