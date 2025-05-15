/** Инициализация визуализации здания на втором шаге */
function initBuildingVisualization() {
    const canvas = document.getElementById("calc-building-canvas");
    const ctx = canvas.getContext("2d");

    const heightInput = document.getElementById("calc-building-height");
    const lengthInput = document.getElementById("calc-building-length");
    const widthInput = document.getElementById("calc-building-width");

    const heightSlider = document.getElementById("calc-building-height-slider");
    const lengthSlider = document.getElementById("calc-building-length-slider");
    const widthSlider = document.getElementById("calc-building-width-slider");

    const heightDisplay = document.getElementById("calc-wall-height");
    const lengthDisplay = document.getElementById("calc-wall-length");
    const widthDisplay = document.getElementById("calc-wall-width");

    const metricsValues = document.querySelectorAll(".calc__building-metrics-value");

    const colors = {
        frontWall: "#e0e0e0",
        sideWall: "#c0c0c0",
        roof: "#a0a0a0",
        outline: "#505050",
        heightLine: "#FF9800",
        lengthLine: "#4CAF50",
        widthLine: "#2196F3"
    };

    const fixedDimensions = {
        height: 10,
        length: 10,
        width: 10
    };

    let buildingDimensions = {
        height: parseInt(heightInput.value || "0", 10),
        length: parseInt(lengthInput.value || "0", 10),
        width: parseInt(widthInput.value || "0", 10)
    };

    /** Функция для синхронизации слайдера с полем ввода и обновления метрик */
    function syncInputWithSlider(input, slider, dimension) {
        input.value = slider.value;
        buildingDimensions[dimension] = parseInt(slider.value || "0", 10);
        updateMetrics();
    }

    /** Функция для синхронизации поля ввода со слайдером и обновления метрик */
    function syncSliderWithInput(slider, input, dimension) {
        slider.value = input.value;
        buildingDimensions[dimension] = parseInt(input.value || "0", 10);
        updateMetrics();
    }

    /** Функция для расчета метрик на основе текущих размеров здания*/
    function calculateMetrics() {
        const {height, length, width} = buildingDimensions;
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

    /** Функция для обновления отображаемых метрик и размеров */
    function updateMetrics() {
        const metrics = calculateMetrics();
        metricsValues[0].textContent = `${metrics.wallArea} м²`;
        metricsValues[1].textContent = `${metrics.buildingArea} м²`;
        metricsValues[2].textContent = `${metrics.perimeter} м`;
        heightDisplay.textContent = String(buildingDimensions.height);
        lengthDisplay.textContent = String(buildingDimensions.length);
        widthDisplay.textContent = String(buildingDimensions.width);
    }

    /** Вспомогательная функция для отрисовки стрелки */
    function drawArrowhead(ctx, fromX, fromY, toX, toY, color) {
        const headLength = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
            toX - headLength * Math.cos(angle - Math.PI / 6),
            toY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            toX - headLength * Math.cos(angle + Math.PI / 6),
            toY - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
    }

    /** Вспомогательная функция для отрисовки грани */
    function drawFace(ctx, points, fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.fill();
    }

    /** Вспомогательная функция для отрисовки контура */
    function drawOutline(ctx, points) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    /** Вспомогательная функция для отрисовки линии размера */
    function drawDimensionLine(ctx, fromX, fromY, toX, toY, color) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        drawArrowhead(ctx, fromX, fromY, toX, toY, color);
        drawArrowhead(ctx, toX, toY, fromX, fromY, color);
    }

    /** Функция для отрисовки здания с фиксированными размерами */
    function drawBuilding() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const {height, length, width} = fixedDimensions;
        const isoAngle = Math.PI / 6;
        const scale = 15;
        const posX = canvas.width / 1.7;
        const posY = canvas.height / 1.4;

        const points = {
            bottomFrontLeft: {
                x: posX - (length * scale / 2),
                y: posY + (height * scale / 4)
            },
            bottomFrontRight: {
                x: posX + (length * scale / 2),
                y: posY + (height * scale / 4)
            },
            bottomBackLeft: {
                x: posX - (length * scale / 2) - (width * scale / 2) * Math.cos(isoAngle),
                y: posY + (height * scale / 4) - (width * scale / 2) * Math.sin(isoAngle)
            },
            bottomBackRight: {
                x: posX + (length * scale / 2) - (width * scale / 2) * Math.cos(isoAngle),
                y: posY + (height * scale / 4) - (width * scale / 2) * Math.sin(isoAngle)
            },
            topFrontLeft: {
                x: posX - (length * scale / 2),
                y: posY - (height * scale * 3 / 4)
            },
            topFrontRight: {
                x: posX + (length * scale / 2),
                y: posY - (height * scale * 3 / 4)
            },
            topBackLeft: {
                x: posX - (length * scale / 2) - (width * scale / 2) * Math.cos(isoAngle),
                y: posY - (height * scale * 3 / 4) - (width * scale / 2) * Math.sin(isoAngle)
            },
            topBackRight: {
                x: posX + (length * scale / 2) - (width * scale / 2) * Math.cos(isoAngle),
                y: posY - (height * scale * 3 / 4) - (width * scale / 2) * Math.sin(isoAngle)
            }
        };

        drawFace(ctx, [
            points.bottomFrontLeft,
            points.bottomFrontRight,
            points.topFrontRight,
            points.topFrontLeft
        ], colors.frontWall);

        drawFace(ctx, [
            points.bottomFrontRight,
            points.bottomBackRight,
            points.topBackRight,
            points.topFrontRight
        ], colors.sideWall);

        drawFace(ctx, [
            points.topFrontLeft,
            points.topFrontRight,
            points.topBackRight,
            points.topBackLeft
        ], colors.roof);

        ctx.strokeStyle = colors.outline;
        ctx.lineWidth = 2;
        drawOutline(ctx, [
            points.bottomFrontLeft,
            points.bottomFrontRight,
            points.topFrontRight,
            points.topFrontLeft
        ]);
        drawOutline(ctx, [
            points.bottomFrontRight,
            points.bottomBackRight,
            points.topBackRight,
            points.topFrontRight
        ]);
        drawOutline(ctx, [
            points.topFrontLeft,
            points.topFrontRight,
            points.topBackRight,
            points.topBackLeft
        ]);

        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(points.bottomFrontLeft.x, points.bottomFrontLeft.y);
        ctx.lineTo(points.bottomBackLeft.x, points.bottomBackLeft.y);
        ctx.lineTo(points.topBackLeft.x, points.topBackLeft.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(points.bottomBackLeft.x, points.bottomBackLeft.y);
        ctx.lineTo(points.bottomBackRight.x, points.bottomBackRight.y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.lineWidth = 3;
        drawDimensionLine(
            ctx,
            points.bottomFrontLeft.x,
            points.bottomFrontLeft.y,
            points.topFrontLeft.x,
            points.topFrontLeft.y,
            colors.heightLine
        );
        drawDimensionLine(
            ctx,
            points.bottomFrontLeft.x,
            points.bottomFrontLeft.y,
            points.bottomFrontRight.x,
            points.bottomFrontRight.y,
            colors.lengthLine
        );
        drawDimensionLine(
            ctx,
            points.bottomFrontLeft.x - Math.cos(isoAngle),
            points.bottomFrontLeft.y + Math.sin(isoAngle),
            points.bottomBackLeft.x - Math.cos(isoAngle),
            points.bottomBackLeft.y + Math.sin(isoAngle),
            colors.widthLine
        );
    }

    /** Обработчик изменения размера окна */
    function resizeCanvas() {
        const container = canvas.parentElement;
        if (container) {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            drawBuilding();
        }
    }

    /** Инициализация обработчиков событий */
    function initEventListeners() {
        heightSlider.addEventListener("input", function () {
            syncInputWithSlider(heightInput, heightSlider, "height");
        });

        lengthSlider.addEventListener("input", function () {
            syncInputWithSlider(lengthInput, lengthSlider, "length");
        });

        widthSlider.addEventListener("input", function () {
            syncInputWithSlider(widthInput, widthSlider, "width");
        });

        heightInput.addEventListener("input", function () {
            syncSliderWithInput(heightSlider, heightInput, "height");
        });

        lengthInput.addEventListener("input", function () {
            syncSliderWithInput(lengthSlider, lengthInput, "length");
        });

        widthInput.addEventListener("input", function () {
            syncSliderWithInput(widthSlider, widthInput, "width");
        });

        window.addEventListener("resize", resizeCanvas);

        const calcStep2 = document.getElementById("calc-step-2");
        if (calcStep2) {
            const observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.attributeName === 'aria-hidden') {
                        const isHidden = calcStep2.getAttribute('aria-hidden') === 'true';
                        if (!isHidden) {
                            setTimeout(resizeCanvas, 50);
                        }
                    }
                });
            });

            observer.observe(calcStep2, {attributes: true});
        }
    }

    initEventListeners();
    resizeCanvas();
    updateMetrics();
}

document.addEventListener("DOMContentLoaded", initBuildingVisualization);