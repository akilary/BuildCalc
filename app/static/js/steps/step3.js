import {calculateIsometricPoints, drawDimensionLines, drawIsometricObject, resizeCanvas} from "../utils/canvasUtils.js";


/** Инициализирует визуализацию материала */
export function initMaterialVisualization() {
    const canvas = document.getElementById("calc-material-canvas");
    const ctx = canvas.getContext("2d");

    const materialSelect = document.getElementById("material-select");
    const customMaterialControls = document.getElementById("custom-material-controls");

    const attributeValues = document.querySelectorAll(".calc__material-attributes-value");
    const materialLengthDisplay = document.getElementById("calc-material-length");
    const materialWidthDisplay = document.getElementById("calc-material-width");
    const materialHeightDisplay = document.getElementById("calc-material-height");

    let materialDimensions = {
        length: 0,
        width: 0,
        height: 0
    };

    let materialProperties = {
        regions: "",
        insulation: "",
        moisture: ""
    };

    /** Обновление визуализации и атрибутов */
    const _updateVisualization = () => {
        _updateAttributes(attributeValues, materialLengthDisplay, materialWidthDisplay, materialHeightDisplay,
            materialProperties, materialDimensions);
        _drawMaterial(ctx, canvas, materialDimensions);
    };

    materialSelect.addEventListener("change", () => {
        _handleMaterialSelect(materialSelect, customMaterialControls, materialDimensions, materialProperties,
            _updateVisualization);
    });

    window.addEventListener("resize", () => {
        resizeCanvas(canvas, () => _drawMaterial(ctx, canvas, materialDimensions));
    });

    const calcStep3 = document.getElementById("calc-step-3");
    if (calcStep3) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "aria-hidden") {
                    const isHidden = calcStep3.getAttribute("aria-hidden") === "true";
                    if (!isHidden) {
                        setTimeout(() => {
                            resizeCanvas(canvas, () => _drawMaterial(ctx, canvas, materialDimensions));
                        }, 50);
                    }
                }
            });
        });
        observer.observe(calcStep3, {attributes: true});
    }

    resizeCanvas(canvas, () => _drawMaterial(ctx, canvas, materialDimensions));
    _updateVisualization();
}

/** Инициализация выбора материала стен */
export function initMaterialSelector() {
    const materialSelect = document.getElementById("material-select");
    const customMaterialControls = document.getElementById("custom-material-controls");

    if (materialSelect) {
        materialSelect.addEventListener("change", () => {
            _toggleCustomMaterialControls(materialSelect, customMaterialControls);
        });
    }

    const addCustomMaterialButton = document.getElementById("calc-add-custom-material");
    if (addCustomMaterialButton) {
        addCustomMaterialButton.addEventListener("click", () => {
            _openCustomMaterialModal()
        });
    }
}

/** Инициализация модального окна для добавления своего материала */
export function initCustomMaterialModal() {
    const modal = document.getElementById("custom-material-modal");
    const closeButton = document.getElementById("close-modal")
    const cancelButton = document.getElementById("cancel-modal");
    const saveButton = document.getElementById("save-custom-material");

    closeButton.addEventListener("click", () => {
        _closeCustomMaterialModal();
    });

    cancelButton.addEventListener("click", () => {
        _closeCustomMaterialModal();
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal.querySelector(".calc__modal-overlay")) {
            _closeCustomMaterialModal();
        }
    });

    saveButton.addEventListener("click", () => {
        _saveCustomMaterial();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
            _closeCustomMaterialModal();
        }
    });
}

/** Парсит размеры из строки формата "ДxШxВ" */
function _parseDimensions(sizeString) {
    if (!sizeString) return {length: 0, width: 0, height: 0};

    const dimensions = sizeString.split("×").map(function (dim) {
        return parseFloat(dim || "0");
    });

    return {
        length: dimensions[0] || 0,
        width: dimensions[1] || 0,
        height: dimensions[2] || 0
    };
}

/** Форматирует списки регионов */
function _formatRegions(regionsStr) {
    if (!regionsStr) return "Не указано";

    let regions;
    if (typeof regionsStr === "string") {
        const cleanStr = regionsStr.replace(/[\[\]']/g, "");
        regions = cleanStr.split(", ");
    } else {
        regions = regionsStr;
    }

    if (regions.length === 0) return "Не указано";
    if (regions.length === 1) return regions[0];
    if (regions.length === 2) return `${regions[0]} и ${regions[1]}`;

    const lastRegion = regions[regions.length - 1];
    const otherRegions = regions.slice(0, regions.length - 1);
    return `${otherRegions.join(", ")} и ${lastRegion}`;
}

/** Обновляет отображения атрибутов материала */
function _updateAttributes(
    attributeValues, materialLengthDisplay, materialWidthDisplay, materialHeightDisplay, materialProperties,
    materialDimensions
) {
    attributeValues[0].textContent = _formatRegions(materialProperties.regions);
    attributeValues[1].textContent = materialProperties.insulation || "Не указано";
    attributeValues[2].textContent = materialProperties.moisture || "Не указано";

    materialLengthDisplay.textContent = String(materialDimensions.length);
    materialWidthDisplay.textContent = String(materialDimensions.width);
    materialHeightDisplay.textContent = String(materialDimensions.height);
}

/** Отрисовка материала */
function _drawMaterial(ctx, canvas, materialDimensions) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dimensions = (materialDimensions.length && materialDimensions.width && materialDimensions.height)
        ? materialDimensions
        : {length: 0, width: 0, height: 0};

    const {length, width, height} = dimensions;
    const isoAngle = Math.PI / 6;

    const scale = Math.min(
        canvas.width / (length + width) * 0.7,
        canvas.height / (height + width / 2) * 0.7
    );

    const posX = canvas.width / 1.7;
    const posY = canvas.height / 1.4;

    const verticalOffset = (height * scale) / 4;

    const points = calculateIsometricPoints(posX, posY, length, width, height, scale, isoAngle, verticalOffset);

    drawIsometricObject(ctx, points);
    drawDimensionLines(ctx, points, isoAngle);
}

/** Обработка выбора материала */
function _handleMaterialSelect(
    materialSelect, customMaterialControls, materialDimensions, materialProperties, updateCallback
) {
    const selectedOption = materialSelect.options[materialSelect.selectedIndex];

    if (selectedOption.value === "custom-material") {
        customMaterialControls.setAttribute("aria-hidden", "false");
        customMaterialControls.tabIndex = 0;
        return;
    }

    customMaterialControls.setAttribute("aria-hidden", "true");
    customMaterialControls.tabIndex = -1;

    const newDimensions = _parseDimensions(selectedOption.dataset.size);
    materialDimensions.length = newDimensions.length;
    materialDimensions.width = newDimensions.width;
    materialDimensions.height = newDimensions.height;

    materialProperties.regions = selectedOption.dataset.suitableRegions || "";
    materialProperties.insulation = selectedOption.dataset.insulation || "";
    materialProperties.moisture = selectedOption.dataset.moisture || "";

    updateCallback();
}

/** Обработчик для переключения видимости пользовательских материалов */
function _toggleCustomMaterialControls(materialSelect, customMaterialControls) {
    if (customMaterialControls) {
        if (materialSelect.value === "custom-material") {
            customMaterialControls.classList.add("calc__custom-material--active");
            customMaterialControls.setAttribute("aria-hidden", "false");
        } else {
            customMaterialControls.classList.remove("calc__custom-material--active");
            customMaterialControls.setAttribute("aria-hidden", "true");
        }
    }
}

/** Открытие модального окна для добавления своего материала */
function _openCustomMaterialModal() {
    const modal = document.getElementById("custom-material-modal");
    modal.setAttribute("aria-hidden", "false");
    modal.tabIndex = 0

    setTimeout(() => {
        const firstInput = modal.querySelector("input, select");
        if (firstInput) {
            firstInput.focus();
        }
    }, 100);

    document.body.style.overflow = "hidden";
}

/** Сохранение пользовательского материала в списке */
function _saveCustomMaterial() {
    const name = document.getElementById("custom-material-name").value.trim();
    const length = document.getElementById("custom-material-length").value.trim();
    const width = document.getElementById("custom-material-width").value.trim();
    const height = document.getElementById("custom-material-height").value.trim();
    if(!name || !length || !width || !height) {
        alert("Проверьте правильность заполнения полей");
        return;
    }

    const materialSelect = document.getElementById("material-select");
    const size = `${length}×${width}×${height}`;
    const option = document.createElement('option');

    option.value = `custom_${Date.now()}`;
    option.textContent = `${name.charAt(0).toUpperCase() + name.slice(1)} (польз.)`;
    option.dataset.size = size;
    option.dataset.suitableRegions = "";
    option.dataset.insulation = "";
    option.dataset.moisture = "";

    materialSelect.insertBefore(option, materialSelect.options[materialSelect.options.length - 1]);
    materialSelect.value = option.value;
    materialSelect.dispatchEvent(new Event("change"));

    _closeCustomMaterialModal();
}

/** Закрытие модального окна для добавления своего материала */
function _closeCustomMaterialModal() {
    const modal = document.getElementById("custom-material-modal");

    document.activeElement.blur();
    modal.setAttribute("aria-hidden", "true");
    modal.tabIndex = -1
    document.body.style.overflow = "";
}
