import {calculateIsometricPoints, drawDimensionLines, drawIsometricObject, resizeCanvas} from "../../utils/canvasUtils.js";


/** Инициализация визуализации здания */
export function initBuildingView() {
    const canvas = document.getElementById("calc-building-canvas");
    const ctx = canvas.getContext("2d");

    const lengthInput = document.getElementById("calc-building-length");
    const widthInput = document.getElementById("calc-building-width");
    const heightInput = document.getElementById("calc-building-height");

    const lengthSlider = document.getElementById("calc-building-length-slider");
    const widthSlider = document.getElementById("calc-building-width-slider");
    const heightSlider = document.getElementById("calc-building-height-slider");

    const lengthDisplay = document.getElementById("calc-wall-length");
    const widthDisplay = document.getElementById("calc-wall-width");
    const heightDisplay = document.getElementById("calc-wall-height");

    const metricsValues = document.querySelectorAll(".calc__building-metrics-value");

    const dimensions = {
        length: 12,
        width: 8,
        height: 6
    };

    let buildingDimensions = {
        length: parseFloat(lengthInput.value || "0"),
        width: parseFloat(widthInput.value || "0"),
        height: parseFloat(heightInput.value || "0")
    };

    [
        {input: lengthInput, slider: lengthSlider, key: "length"},
        {input: widthInput, slider: widthSlider, key: "width"},
        {input: heightInput, slider: heightSlider, key: "height"}
    ].forEach(({input, slider, key}) => {
        input.addEventListener("input", () => {
            _syncSliderWithInput(slider, input, key, buildingDimensions, () => {
                _updateMetrics(metricsValues, heightDisplay, lengthDisplay, widthDisplay, buildingDimensions);
            });
            _drawBuilding(ctx, canvas, dimensions);
        });

        slider.addEventListener("input", () => {
            _syncInputWithSlider(input, slider, key, buildingDimensions, () => {
                _updateMetrics(metricsValues, heightDisplay, lengthDisplay, widthDisplay, buildingDimensions);
            });
            _drawBuilding(ctx, canvas, dimensions);
        });
    });


    window.addEventListener("resize", () => {
        resizeCanvas(canvas, () => _drawBuilding(ctx, canvas, dimensions));
    });

    const calcStep2 = document.getElementById("calc-step-2");
    if (calcStep2) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "aria-hidden") {
                    const isHidden = calcStep2.getAttribute("aria-hidden") === "true";
                    if (!isHidden) {
                        setTimeout(() => {
                            resizeCanvas(canvas, () => _drawBuilding(ctx, canvas, dimensions));
                        }, 50);
                    }
                }
            });
        });
        observer.observe(calcStep2, {attributes: true});
    }

    _updateMetrics(metricsValues, heightDisplay, lengthDisplay, widthDisplay, buildingDimensions);
}

/** Обновляет отображение метрик и размеров */
function _updateMetrics(metricsValues, heightDisplay, lengthDisplay, widthDisplay, buildingDimensions) {
    const metrics = _calculateMetrics(buildingDimensions);
    metricsValues[0].textContent = `${metrics.wallArea} м²`;
    metricsValues[1].textContent = `${metrics.buildingArea} м²`;
    metricsValues[2].textContent = `${metrics.perimeter} м`;
    heightDisplay.textContent = String(buildingDimensions.height);
    lengthDisplay.textContent = String(buildingDimensions.length);
    widthDisplay.textContent = String(buildingDimensions.width);
}

/** Считает метрики на основе текущих размеров здания */
function _calculateMetrics(buildingDimensions) {
    const {length, width, height} = buildingDimensions;
    const frontWallArea = length * height;
    const sideWallArea = width * height;
    const totalWallArea = 2 * (frontWallArea + sideWallArea);
    const buildingArea = length * width;
    const perimeter = 2 * (length + width);

    return {
        wallArea: totalWallArea.toFixed(2),
        buildingArea: buildingArea.toFixed(2),
        perimeter: perimeter.toFixed(2)
    };
}

/** Отрисовки здания */
function _drawBuilding(ctx, canvas, dimensions) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const {height, length, width} = dimensions;
    const scale = 15;
    const posX = canvas.width / 1.7;
    const posY = canvas.height / 1.2;

    const points = calculateIsometricPoints(posX, posY, length, width, height, scale);

    drawIsometricObject(ctx, points);
    drawDimensionLines(ctx, points);
}

/** Синхронизирует слайдеры с полем ввода и обновления метрик */
function _syncInputWithSlider(input, slider, dimension, buildingDimensions, updateMetricsCallback) {
    input.value = slider.value;
    buildingDimensions[dimension] = parseInt(slider.value || "0", 10);
    updateMetricsCallback();
}

/** Синхронизирует поля ввода со слайдером и обновления метрик */
function _syncSliderWithInput(slider, input, dimension, buildingDimensions, updateMetricsCallback) {
    slider.value = input.value;
    buildingDimensions[dimension] = parseInt(input.value || "0", 10);
    updateMetricsCallback();
}
