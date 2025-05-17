/** Инициализация визуализации материала на третьем шаге */
export function initMaterialVisualization() {
    const canvas = document.getElementById("calc-material-canvas");
    const ctx = canvas.getContext("2d");

    const materialSelect = document.getElementById("material-select");
    const customMaterialControls = document.getElementById("custom-material-controls");
    const addCustomMaterialBtn = document.getElementById("calc-add-custom-material");

    const attributeValues = document.querySelectorAll(".calc__material-attributes-value");
    const materialLengthDisplay = document.getElementById("calc-material-length");
    const materialWidthDisplay = document.getElementById("calc-material-width");
    const materialHeightDisplay = document.getElementById("calc-material-height");

    const wallThicknessInputs = document.querySelectorAll("input[name='wall-thickness']");

    const colors = {
        frontFace: "#e0e0e0",
        sideFace: "#c0c0c0",
        topFace: "#a0a0a0",
        outline: "#505050",
        lengthLine: "#4CAF50",
        widthLine: "#2196F3",
        heightLine: "#FF9800"
    };

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

    /** Парсинг размеров из строки формата "ДxШxВ" */
    function parseDimensions(sizeString) {
        if (!sizeString) return {length: 0, width: 0, height: 0};

        const dimensions = sizeString.split("×").map(function (dim) {
            return parseInt(dim || "0", 10);
        });

        return {
            length: dimensions[0] || 0,
            width: dimensions[1] || 0,
            height: dimensions[2] || 0
        };
    }

    /** Форматирование списка регионов */
    function formatRegions(regionsStr) {
        if (!regionsStr) return "Не указано";

        // Обрабатываем случай, когда строка приходит в формате Python списка: "['Север', 'Восток', 'Центр']"
        let regions = [];
        
        if (typeof regionsStr === 'string') {
            // Удаляем квадратные скобки и одинарные кавычки
            const cleanStr = regionsStr.replace(/[\[\]']/g, '');
            regions = cleanStr.split(', ');
        } else {
            regions = regionsStr;
        }
        
        if (regions.length === 0) return "Не указано";
        if (regions.length === 1) return regions[0];
        if (regions.length === 2) return `${regions[0]} и ${regions[1]}`;

        const lastRegion = regions[regions.length - 1];
        const otherRegions = regions.slice(0, regions.length - 1);
        return `${otherRegions.join(', ')} и ${lastRegion}`;
    }

    /** Обновление отображения атрибутов материала */
    function updateAttributes() {
        attributeValues[0].textContent = formatRegions(materialProperties.regions);
        attributeValues[1].textContent = materialProperties.insulation || "Не указано";
        attributeValues[2].textContent = materialProperties.moisture || "Не указано";

        materialLengthDisplay.textContent = String(materialDimensions.length);
        materialWidthDisplay.textContent = String(materialDimensions.width);
        materialHeightDisplay.textContent = String(materialDimensions.height);
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

    /** Функция для отрисовки материала с фиксированными размерами */
    function drawMaterial() {
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

        const points = {
            bottomFrontLeft: {
                x: posX - (length * scale / 2),
                y: posY + verticalOffset
            },
            bottomFrontRight: {
                x: posX + (length * scale / 2),
                y: posY + verticalOffset
            },
            bottomBackLeft: {
                x: posX - (length * scale / 2) - (width * scale) * Math.cos(isoAngle),
                y: posY + verticalOffset - (width * scale) * Math.sin(isoAngle)
            },
            bottomBackRight: {
                x: posX + (length * scale / 2) - (width * scale) * Math.cos(isoAngle),
                y: posY + verticalOffset - (width * scale) * Math.sin(isoAngle)
            },
            topFrontLeft: {
                x: posX - (length * scale / 2),
                y: posY - (height * scale) + verticalOffset
            },
            topFrontRight: {
                x: posX + (length * scale / 2),
                y: posY - (height * scale) + verticalOffset
            },
            topBackLeft: {
                x: posX - (length * scale / 2) - (width * scale) * Math.cos(isoAngle),
                y: posY - (height * scale) + verticalOffset - (width * scale) * Math.sin(isoAngle)
            },
            topBackRight: {
                x: posX + (length * scale / 2) - (width * scale) * Math.cos(isoAngle),
                y: posY - (height * scale) + verticalOffset - (width * scale) * Math.sin(isoAngle)
            }
        };

        drawFace(ctx, [
            points.bottomFrontLeft,
            points.bottomFrontRight,
            points.topFrontRight,
            points.topFrontLeft
        ], colors.frontFace);

        drawFace(ctx, [
            points.bottomFrontRight,
            points.bottomBackRight,
            points.topBackRight,
            points.topFrontRight
        ], colors.sideFace);

        drawFace(ctx, [
            points.topFrontLeft,
            points.topFrontRight,
            points.topBackRight,
            points.topBackLeft
        ], colors.topFace);

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
            points.bottomFrontLeft.x + Math.cos(isoAngle),
            points.bottomFrontLeft.y - Math.sin(isoAngle),
            points.bottomBackLeft.x + Math.cos(isoAngle),
            points.bottomBackLeft.y - Math.sin(isoAngle),
            colors.widthLine
        );
    }

    /** Обновление визуализации и атрибутов */
    function updateVisualization() {
        updateAttributes();
        drawMaterial();
    }

    /** Обработка выбора материала */
    function handleMaterialSelect() {
        const selectedOption = materialSelect.options[materialSelect.selectedIndex];

        if (selectedOption.value === "custom") {
            customMaterialControls.setAttribute("aria-hidden", "false");
            customMaterialControls.tabIndex = 0;
            return;
        }

        customMaterialControls.setAttribute("aria-hidden", "true");
        customMaterialControls.tabIndex = -1;

        materialDimensions = parseDimensions(selectedOption.dataset.size);

        materialProperties = {
            regions: selectedOption.dataset.suitableRegions || "",
            insulation: selectedOption.dataset.insulation || "",
            moisture: selectedOption.dataset.moisture || ""
        };

        updateVisualization();
    }

     /** Обработчик изменения размера окна */
    function resizeCanvas() {
        const container = canvas.parentElement;
        if (container) {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            drawMaterial();
        }
    }

    /** Инициализация обработчиков событий */
    function initEventListeners() {
        materialSelect.addEventListener("change", handleMaterialSelect);

        window.addEventListener("resize", resizeCanvas);


        const calcStep3 = document.getElementById("calc-step-3");
        if (calcStep3) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === "aria-hidden") {
                        const isHidden = calcStep3.getAttribute("aria-hidden") === "true";
                        if (!isHidden) {
                            setTimeout(resizeCanvas, 50);
                        }
                    }
                });
            });

            observer.observe(calcStep3, { attributes: true });
        }
    }

    initEventListeners();
    resizeCanvas();
    updateVisualization();
}

/** Инициализация выбора материала стен */
export function initMaterialSelector() {
    const materialSelect = document.getElementById("material-select");
    const customMaterialControls = document.getElementById("custom-material-controls");

    if (materialSelect) {
        materialSelect.addEventListener("change", function () {
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
        addCustomMaterialButton.addEventListener("click", function () {
            console.log("Открытие модального окна для добавления своего материала");
        });
    }
}
