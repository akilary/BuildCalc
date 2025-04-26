document.addEventListener('DOMContentLoaded', function () {
    // Инициализация Choices
    document.querySelectorAll('select').forEach(select => {
        new Choices(select, {
            searchEnabled: false,
            itemSelectText: '',
            shouldSort: false,
        });
    });

    // Интерактивная карта Казахстана
    const mapRegions = document.querySelectorAll('.calc__map-region');
    const radioInputs = document.querySelectorAll('input[name="region"]');

    // Функция для выбора региона
    function selectRegion(regionValue) {
        // Снимаем активный класс со всех регионов
        mapRegions.forEach(region => {
            region.classList.remove('active');
        });

        // Устанавливаем активный класс для выбранного региона
        const selectedRegion = document.getElementById('region-' + regionValue);
        if (selectedRegion) {
            selectedRegion.classList.add('active');
        }

        // Выбираем соответствующую радиокнопку
        const radioInput = document.querySelector(`input[value="${regionValue}"]`);
        if (radioInput) {
            radioInput.checked = true;
        }
    }

    // Обработчик кликов по регионам карты
    mapRegions.forEach(region => {
        region.addEventListener('click', function () {
            const regionValue = this.getAttribute('data-region');
            selectRegion(regionValue);
        });
    });

    // Обработчик изменения радиокнопок
    radioInputs.forEach(input => {
        input.addEventListener('change', function () {
            if (this.checked) {
                selectRegion(this.value);
            }
        });
    });

    // Исправляем ID для радиокнопок
    try {
        document.getElementById('region-north-input').setAttribute('id', 'region-north');
        document.getElementById('region-west-input').setAttribute('id', 'region-west');
        document.getElementById('region-central-input').setAttribute('id', 'region-central');
        document.getElementById('region-south-input').setAttribute('id', 'region-south');
        document.getElementById('region-east-input').setAttribute('id', 'region-east');
    } catch (e) {
        console.log('ID элементов уже исправлены или не найдены');
    }

    // Интерактивная визуализация здания
    const buildingCanvas = document.getElementById('building-canvas');
    if (buildingCanvas) {
        const ctx = buildingCanvas.getContext('2d');
        const lengthInput = document.getElementById('building-length');
        const widthInput = document.getElementById('building-width');
        const heightInput = document.getElementById('wall-height');
        const lengthRange = document.getElementById('building-length-range');
        const widthRange = document.getElementById('building-width-range');
        const heightRange = document.getElementById('wall-height-range');
        
        // Значения размеров
        const lengthValue = document.getElementById('length-value');
        const widthValue = document.getElementById('width-value');
        const heightValue = document.getElementById('height-value');
        
        // Информация о здании
        const buildingArea = document.getElementById('building-area');
        const buildingPerimeter = document.getElementById('building-perimeter');
        const wallsArea = document.getElementById('walls-area');
        
        // Кнопки управления
        const incrementButtons = document.querySelectorAll('.calc__input-increment');
        const decrementButtons = document.querySelectorAll('.calc__input-decrement');
        
        // Начальные размеры здания
        let length = 10;
        let width = 8;
        let height = 3;
        
        // Функция для отрисовки 3D-модели здания
        function drawBuilding() {
            // Очищаем холст
            ctx.clearRect(0, 0, buildingCanvas.width, buildingCanvas.height);
            
            // Центр холста
            const centerX = buildingCanvas.width / 2;
            const centerY = buildingCanvas.height / 2;
            
            // Масштаб (чтобы здание помещалось на холсте)
            const scale = Math.min(
                (buildingCanvas.width - 80) / (length + width),
                (buildingCanvas.height - 80) / (height + width / 2)
            );
            
            // Изометрические проекции
            const isoX = (x, y) => centerX + (x - y) * scale * 0.7;
            const isoY = (x, y, z) => centerY + (x + y) * scale * 0.4 - z * scale * 0.8;
            
            // Цвета
            const wallColor = '#F7931E';
            const wallDarkColor = '#D67A0D';
            const roofColor = '#1E1E1E';
            const outlineColor = '#121212';

            // Рисуем заднюю стену
            ctx.beginPath();
            ctx.moveTo(isoX(0, width), isoY(0, width, 0));
            ctx.lineTo(isoX(0, width), isoY(0, width, height));
            ctx.lineTo(isoX(length, width), isoY(length, width, height));
            ctx.lineTo(isoX(length, width), isoY(length, width, 0));
            ctx.closePath();
            ctx.fillStyle = wallDarkColor;
            ctx.fill();
            ctx.strokeStyle = outlineColor;
            ctx.lineWidth = 2;
            
            // Рисуем левую стену
            ctx.beginPath();
            ctx.moveTo(isoX(0, 0), isoY(0, 0, 0));
            ctx.lineTo(isoX(0, 0), isoY(0, 0, height));
            ctx.lineTo(isoX(0, width), isoY(0, width, height));
            ctx.lineTo(isoX(0, width), isoY(0, width, 0));
            ctx.closePath();
            ctx.fillStyle = wallColor;
            ctx.fill();
            ctx.strokeStyle = outlineColor;
            
            // Рисуем правую стену
            ctx.beginPath();
            ctx.moveTo(isoX(length, 0), isoY(length, 0, 0));
            ctx.lineTo(isoX(length, 0), isoY(length, 0, height));
            ctx.lineTo(isoX(length, width), isoY(length, width, height));
            ctx.lineTo(isoX(length, width), isoY(length, width, 0));
            ctx.closePath();
            ctx.fillStyle = wallDarkColor;
            ctx.fill();
            ctx.strokeStyle = outlineColor;
            
            // Рисуем переднюю стену
            ctx.beginPath();
            ctx.moveTo(isoX(0, 0), isoY(0, 0, 0));
            ctx.lineTo(isoX(0, 0), isoY(0, 0, height));
            ctx.lineTo(isoX(length, 0), isoY(length, 0, height));
            ctx.lineTo(isoX(length, 0), isoY(length, 0, 0));
            ctx.closePath();
            ctx.fillStyle = wallColor;
            ctx.fill();
            ctx.strokeStyle = outlineColor;
            
            // Рисуем крышу
            ctx.beginPath();
            ctx.moveTo(isoX(0, 0), isoY(0, 0, height));
            ctx.lineTo(isoX(length, 0), isoY(length, 0, height));
            ctx.lineTo(isoX(length, width), isoY(length, width, height));
            ctx.lineTo(isoX(0, width), isoY(0, width, height));
            ctx.closePath();
            ctx.fillStyle = roofColor;
            ctx.fill();
            ctx.strokeStyle = outlineColor;

            // Обновляем отображаемые значения
            if (lengthValue) lengthValue.textContent = length;
            if (widthValue) widthValue.textContent = width;
            if (heightValue) heightValue.textContent = height;
            
            // Обновляем информацию о здании
            updateBuildingInfo();
        }
        
        // Функция для обновления информации о здании
        function updateBuildingInfo() {
            const area = length * width;
            const perimeter = 2 * (length + width);
            const walls = 2 * (length * height + width * height);
            
            if (buildingArea) buildingArea.textContent = area + ' м²';
            if (buildingPerimeter) buildingPerimeter.textContent = perimeter + ' м';
            if (wallsArea) wallsArea.textContent = walls + ' м²';
        }
        
        // Функция для синхронизации значений между полями ввода и ползунками
        function syncInputs(source, target, value) {
            if (source && target) {
                target.value = value;
            }
        }
        
        // Обработчики событий для полей ввода
        if (lengthInput) {
            lengthInput.addEventListener('input', function() {
                length = parseFloat(this.value) || 1;
                syncInputs(lengthInput, lengthRange, length);
                drawBuilding();
            });
        }
        
        if (widthInput) {
            widthInput.addEventListener('input', function() {
                width = parseFloat(this.value) || 1;
                syncInputs(widthInput, widthRange, width);
                drawBuilding();
            });
        }
        
        if (heightInput) {
            heightInput.addEventListener('input', function() {
                height = parseFloat(this.value) || 1;
                syncInputs(heightInput, heightRange, height);
                drawBuilding();
            });
        }
        
        // Обработчики событий для ползунков
        if (lengthRange) {
            lengthRange.addEventListener('input', function() {
                length = parseFloat(this.value);
                syncInputs(lengthRange, lengthInput, length);
                drawBuilding();
            });
        }
        
        if (widthRange) {
            widthRange.addEventListener('input', function() {
                width = parseFloat(this.value);
                syncInputs(widthRange, widthInput, width);
                drawBuilding();
            });
        }
        
        if (heightRange) {
            heightRange.addEventListener('input', function() {
                height = parseFloat(this.value);
                syncInputs(heightRange, heightInput, height);
                drawBuilding();
            });
        }
        
        // Обработчики для кнопок увеличения/уменьшения
        incrementButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const input = document.getElementById(targetId);
                const range = document.getElementById(targetId + '-range');
                
                if (input) {
                    let value = parseFloat(input.value) || 0;
                    const max = parseFloat(input.getAttribute('max')) || 100;
                    value = Math.min(value + 1, max);
                    
                    input.value = value;
                    if (range) range.value = value;
                    
                    // Обновляем соответствующую переменную
                    if (targetId === 'building-length') length = value;
                    if (targetId === 'building-width') width = value;
                    if (targetId === 'wall-height') height = value;
                    
                    drawBuilding();
                }
            });
        });
        
        decrementButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const input = document.getElementById(targetId);
                const range = document.getElementById(targetId + '-range');
                
                if (input) {
                    let value = parseFloat(input.value) || 0;
                    const min = parseFloat(input.getAttribute('min')) || 1;
                    value = Math.max(value - 1, min);
                    
                    input.value = value;
                    if (range) range.value = value;
                    
                    // Обновляем соответствующую переменную
                    if (targetId === 'building-length') length = value;
                    if (targetId === 'building-width') width = value;
                    if (targetId === 'wall-height') height = value;
                    
                    drawBuilding();
                }
            });
        });
        
        // Инициализация
        drawBuilding();
    }
    
    // Интерактивная визуализация фундамента
    const foundationCanvas = document.getElementById('foundation-canvas');
    if (foundationCanvas) {
        const foundationCtx = foundationCanvas.getContext('2d');
        const foundationTypeInputs = document.querySelectorAll('input[name="foundation-type"]');
        const stripTypeInputs = document.querySelectorAll('input[name="strip-type"]');
        const foundationOptions = document.querySelectorAll('.calc__foundation-options');
        
        // Inputs for slab foundation
        const slabWidthInput = document.getElementById('slab-width');
        const slabLengthInput = document.getElementById('slab-length');
        const slabHeightInput = document.getElementById('slab-height');
        const slabWidthRange = document.getElementById('slab-width-range');
        const slabLengthRange = document.getElementById('slab-length-range');
        const slabHeightRange = document.getElementById('slab-height-range');
        
        // Inputs for strip foundation
        const stripWidthInput = document.getElementById('strip-width');
        const stripLengthInput = document.getElementById('strip-length');
        const stripHeightInput = document.getElementById('strip-height');
        const stripThicknessInput = document.getElementById('strip-thickness');
        const stripMiddleLengthInput = document.getElementById('strip-middle-length');
        const stripWidthRange = document.getElementById('strip-width-range');
        const stripLengthRange = document.getElementById('strip-length-range');
        const stripHeightRange = document.getElementById('strip-height-range');
        const stripThicknessRange = document.getElementById('strip-thickness-range');
        const stripMiddleLengthRange = document.getElementById('strip-middle-length-range');
        
        // Display elements
        const foundationWidthValue = document.getElementById('foundation-width-value');
        const foundationLengthValue = document.getElementById('foundation-length-value');
        const foundationHeightValue = document.getElementById('foundation-height-value');
        const foundationVolume = document.getElementById('foundation-volume');
        const foundationCost = document.getElementById('foundation-cost');
        
        // Foundation parameters
        let foundationType = 'none'; // none, slab, strip
        let stripType = 'rectangular'; // rectangular, rectangular-reinforced, t-shaped, reinforced-ribs
        
        // Slab parameters
        let slabWidth = 4;
        let slabLength = 6;
        let slabHeight = 300; // in mm
        
        // Strip parameters
        let stripWidth = 0.4;
        let stripLength = 10;
        let stripHeight = 400; // in mm
        let stripThickness = 300; // in mm
        let stripMiddleLength = 5; // for T-shaped
        
        // Concrete price per cubic meter (in tenge)
        const concretePrice = 25000;
        
        // Handle foundation type selection
        foundationTypeInputs.forEach(input => {
            input.addEventListener('change', function() {
                if (this.checked) {
                    foundationType = this.value;
                    
                    // Hide all foundation options
                    foundationOptions.forEach(option => {
                        option.style.display = 'none';
                    });
                    
                    // Show selected foundation options
                    if (foundationType !== 'none') {
                        const selectedOption = document.querySelector(`.calc__foundation-options[data-type="${foundationType}"]`);
                        if (selectedOption) {
                            selectedOption.style.display = 'block';
                        }
                    }
                    
                    // Update visualization
                    drawFoundation();
                    updateFoundationInfo();
                }
            });
        });
        
        // Handle strip type selection
        stripTypeInputs.forEach(input => {
            input.addEventListener('change', function() {
                if (this.checked) {
                    stripType = this.value;
                    
                    // Show/hide T-shaped specific inputs
                    const tShapedInputs = document.querySelectorAll('.t-shaped-only');
                    tShapedInputs.forEach(input => {
                        input.style.display = stripType === 't-shaped' ? 'block' : 'none';
                    });
                    
                    // Update visualization
                    drawFoundation();
                    updateFoundationInfo();
                }
            });
        });
        
        // Function to draw foundation
        function drawFoundation() {
            // Clear canvas
            foundationCtx.clearRect(0, 0, foundationCanvas.width, foundationCanvas.height);
            
            if (foundationType === 'none') {
                // Draw "no foundation" message
                foundationCtx.font = '16px Arial';
                foundationCtx.fillStyle = '#888';
                foundationCtx.textAlign = 'center';
                foundationCtx.fillText('Фундамент не выбран', foundationCanvas.width / 2, foundationCanvas.height / 2);
                
                // Update display values
                if (foundationWidthValue) foundationWidthValue.textContent = '0';
                if (foundationLengthValue) foundationLengthValue.textContent = '0';
                if (foundationHeightValue) foundationHeightValue.textContent = '0';
                
                return;
            }
            
            // Center of canvas
            const centerX = foundationCanvas.width / 2;
            const centerY = foundationCanvas.height / 2;
            
            if (foundationType === 'slab') {
                // Calculate scale to fit the slab on canvas
                const scale = Math.min(
                    (foundationCanvas.width - 80) / slabLength,
                    (foundationCanvas.height - 80) / slabWidth
                );
                
                // Isometric projection functions
                const isoX = (x, y) => centerX + (x - y) * scale * 0.7;
                const isoY = (x, y, z) => centerY + (x + y) * scale * 0.4 - z * scale * 0.8;
                
                // Colors
                const slabColor = '#F7931E';
                const slabDarkColor = '#D67A0D';
                const outlineColor = '#121212';
                
                // Draw top face
                foundationCtx.beginPath();
                foundationCtx.moveTo(isoX(0, 0), isoY(0, 0, slabHeight / 1000));
                foundationCtx.lineTo(isoX(slabLength, 0), isoY(slabLength, 0, slabHeight / 1000));
                foundationCtx.lineTo(isoX(slabLength, slabWidth), isoY(slabLength, slabWidth, slabHeight / 1000));
                foundationCtx.lineTo(isoX(0, slabWidth), isoY(0, slabWidth, slabHeight / 1000));
                foundationCtx.closePath();
                foundationCtx.fillStyle = slabColor;
                foundationCtx.fill();
                foundationCtx.strokeStyle = outlineColor;
                foundationCtx.lineWidth = 2;
                foundationCtx.stroke();
                
                // Draw front face
                foundationCtx.beginPath();
                foundationCtx.moveTo(isoX(0, 0), isoY(0, 0, 0));
                foundationCtx.lineTo(isoX(slabLength, 0), isoY(slabLength, 0, 0));
                foundationCtx.lineTo(isoX(slabLength, 0), isoY(slabLength, 0, slabHeight / 1000));
                foundationCtx.lineTo(isoX(0, 0), isoY(0, 0, slabHeight / 1000));
                foundationCtx.closePath();
                foundationCtx.fillStyle = slabDarkColor;
                foundationCtx.fill();
                foundationCtx.strokeStyle = outlineColor;
                foundationCtx.stroke();
                
                // Draw side face
                foundationCtx.beginPath();
                foundationCtx.moveTo(isoX(0, 0), isoY(0, 0, 0));
                foundationCtx.lineTo(isoX(0, slabWidth), isoY(0, slabWidth, 0));
                foundationCtx.lineTo(isoX(0, slabWidth), isoY(0, slabWidth, slabHeight / 1000));
                foundationCtx.lineTo(isoX(0, 0), isoY(0, 0, slabHeight / 1000));
                foundationCtx.closePath();
                foundationCtx.fillStyle = slabDarkColor;
                foundationCtx.fill();
                foundationCtx.strokeStyle = outlineColor;
                foundationCtx.stroke();
                
                // Update display values
                if (foundationWidthValue) foundationWidthValue.textContent = slabWidth;
                if (foundationLengthValue) foundationLengthValue.textContent = slabLength;
                if (foundationHeightValue) foundationHeightValue.textContent = slabHeight;
                
            } else if (foundationType === 'strip') {
                // Calculate scale to fit the strip on canvas
                const scale = Math.min(
                    (foundationCanvas.width - 80) / stripLength,
                    (foundationCanvas.height - 80) / (stripWidth * 4)
                );
                
                // Isometric projection functions
                const isoX = (x, y) => centerX + (x - y) * scale * 0.7;
                const isoY = (x, y, z) => centerY + (x + y) * scale * 0.4 - z * scale * 0.8;
                
                // Colors
                const stripColor = '#F7931E';
                const stripDarkColor = '#D67A0D';
                const outlineColor = '#121212';
                const reinforcementColor = '#555';
                
                if (stripType === 'rectangular' || stripType === 'rectangular-reinforced') {
                    // Draw rectangular strip foundation
                    
                    // Draw outer rectangle (top)
                    foundationCtx.beginPath();
                    foundationCtx.moveTo(isoX(0, 0), isoY(0, 0, stripHeight / 1000));
                    foundationCtx.lineTo(isoX(stripLength, 0), isoY(stripLength, 0, stripHeight / 1000));
                    foundationCtx.lineTo(isoX(stripLength, stripWidth), isoY(stripLength, stripWidth, stripHeight / 1000));
                    foundationCtx.lineTo(isoX(0, stripWidth), isoY(0, stripWidth, stripHeight / 1000));
                    foundationCtx.closePath();
                    foundationCtx.fillStyle = stripColor;
                    foundationCtx.fill();
                    foundationCtx.strokeStyle = outlineColor;
                    foundationCtx.lineWidth = 2;
                    foundationCtx.stroke();
                    
                    // Draw front face
                    foundationCtx.beginPath();
                    foundationCtx.moveTo(isoX(0, 0), isoY(0, 0, 0));
                    foundationCtx.lineTo(isoX(stripLength, 0), isoY(stripLength, 0, 0));
                    foundationCtx.lineTo(isoX(stripLength, 0), isoY(stripLength, 0, stripHeight / 1000));
                    foundationCtx.lineTo(isoX(0, 0), isoY(0, 0, stripHeight / 1000));
                    foundationCtx.closePath();
                    foundationCtx.fillStyle = stripDarkColor;
                    foundationCtx.fill();
                    foundationCtx.strokeStyle = outlineColor;
                    foundationCtx.stroke();
                    
                    // Draw side face
                    foundationCtx.beginPath();
                    foundationCtx.moveTo(isoX(0, 0), isoY(0, 0, 0));
                    foundationCtx.lineTo(isoX(0, stripWidth), isoY(0, stripWidth, 0));
                    foundationCtx.lineTo(isoX(0, stripWidth), isoY(0, stripWidth, stripHeight / 1000));
                    foundationCtx.lineTo(isoX(0, 0), isoY(0, 0, stripHeight / 1000));
                    foundationCtx.closePath();
                    foundationCtx.fillStyle = stripDarkColor;
                    foundationCtx.fill();
                    foundationCtx.strokeStyle = outlineColor;
                    foundationCtx.stroke();
                    
                    // Draw reinforcement if needed
                    if (stripType === 'rectangular-reinforced') {
                        // Draw reinforcement bars
                        foundationCtx.strokeStyle = reinforcementColor;
                        foundationCtx.lineWidth = 3;
                        
                        // Horizontal bars
                        for (let i = 0; i < 3; i++) {
                            const y = stripWidth / 4 + (i * stripWidth / 4);
                            foundationCtx.beginPath();
                            foundationCtx.moveTo(isoX(0, y), isoY(0, y, stripHeight / 2000));
                            foundationCtx.lineTo(isoX(stripLength, y), isoY(stripLength, y, stripHeight / 2000));
                            foundationCtx.stroke();
                        }
                        
                        // Vertical bars
                        for (let i = 0; i < Math.ceil(stripLength); i++) {
                            foundationCtx.beginPath();
                            foundationCtx.moveTo(isoX(i, 0), isoY(i, 0, stripHeight / 2000));
                            foundationCtx.lineTo(isoX(i, stripWidth), isoY(i, stripWidth, stripHeight / 2000));
                            foundationCtx.stroke();
                        }
                    }
                    
                } else if (stripType === 't-shaped') {
                    // Draw T-shaped strip foundation
                    
                    // Draw main strip (horizontal part of T)
                    foundationCtx.beginPath();
                    foundationCtx.moveTo(isoX(0, 0), isoY(0, 0, stripHeight / 1000));
                    foundationCtx.lineTo(isoX(stripLength, 0), isoY(stripLength, 0, stripHeight / 1000));
                    foundationCtx.lineTo(isoX(stripLength, stripWidth), isoY(stripLength, stripWidth, stripHeight / 1000));
                    foundationCtx.lineTo(isoX(0, stripWidth), isoY(0, stripWidth, stripHeight / 1000));
                    foundationCtx.closePath();
                    foundationCtx.fillStyle = stripColor;
                    foundationCtx.fill();
                    foundationCtx.strokeStyle = outlineColor;
                    foundationCtx.lineWidth = 2;
                    foundationCtx.stroke();
                    
                    // Calculate middle position
                    const middlePos = stripLength / 2 - stripMiddleLength / 2;
                    
                    // Draw middle strip (vertical part of T)
                    foundationCtx.beginPath();
                    foundationCtx.moveTo(isoX(middlePos, stripWidth), isoY(middlePos, stripWidth, stripHeight / 1000));
                    foundationCtx.lineTo(isoX(middlePos + stripMiddleLength, stripWidth), isoY(middlePos + stripMiddleLength, stripWidth, stripHeight / 1000));
                    foundationCtx.lineTo(isoX(middlePos + stripMiddleLength, stripWidth * 2), isoY(middlePos + stripMiddleLength, stripWidth * 2, stripHeight / 1000));
                    foundationCtx.lineTo(isoX(middlePos, stripWidth * 2), isoY(middlePos, stripWidth * 2, stripHeight / 1000));
                    foundationCtx.closePath();
                    foundationCtx.fillStyle = stripColor;
                    foundationCtx.fill();
                    foundationCtx.strokeStyle = outlineColor;
                    foundationCtx.stroke();
                    
                } else if (stripType === 'reinforced-ribs') {
                    // Draw reinforced strip foundation with ribs
                    
                    // Draw main strip
                    foundationCtx.beginPath();
                    foundationCtx.moveTo(isoX(0, 0), isoY(0, 0, stripHeight / 1000));
                    foundationCtx.lineTo(isoX(stripLength, 0), isoY(stripLength, 0, stripHeight / 1000));
                    foundationCtx.lineTo(isoX(stripLength, stripWidth), isoY(stripLength, stripWidth, stripHeight / 1000));
                    foundationCtx.lineTo(isoX(0, stripWidth), isoY(0, stripWidth, stripHeight / 1000));
                    foundationCtx.closePath();
                    foundationCtx.fillStyle = stripColor;
                    foundationCtx.fill();
                    foundationCtx.strokeStyle = outlineColor;
                    foundationCtx.lineWidth = 2;
                    foundationCtx.stroke();
                    
                    // Draw ribs
                    const ribCount = Math.ceil(stripLength / 2);
                    const ribWidth = stripWidth / 3;
                    
                    for (let i = 0; i < ribCount; i++) {
                        const x = i * 2;
                        
                        // Skip if beyond strip length
                        if (x >= stripLength) continue;
                        
                        // Draw rib
                        foundationCtx.beginPath();
                        foundationCtx.moveTo(isoX(x, stripWidth), isoY(x, stripWidth, stripHeight / 1000));
                        foundationCtx.lineTo(isoX(x + ribWidth, stripWidth), isoY(x + ribWidth, stripWidth, stripHeight / 1000));
                        foundationCtx.lineTo(isoX(x + ribWidth, stripWidth * 1.5), isoY(x + ribWidth, stripWidth * 1.5, stripHeight / 1000));
                        foundationCtx.lineTo(isoX(x, stripWidth * 1.5), isoY(x, stripWidth * 1.5, stripHeight / 1000));
                        foundationCtx.closePath();
                        foundationCtx.fillStyle = stripDarkColor;
                        foundationCtx.fill();
                        foundationCtx.strokeStyle = outlineColor;
                        foundationCtx.stroke();
                    }
                }
                
                // Update display values
                if (foundationWidthValue) foundationWidthValue.textContent = stripWidth;
                if (foundationLengthValue) foundationLengthValue.textContent = stripLength;
                if (foundationHeightValue) foundationHeightValue.textContent = stripHeight;
            }
        }
        
        // Function to update foundation info
        function updateFoundationInfo() {
            let volume = 0;
            let cost = 0;
            
            if (foundationType === 'slab') {
                // Calculate slab volume in cubic meters
                volume = (slabWidth * slabLength * slabHeight) / 1000; // height is in mm
                
            } else if (foundationType === 'strip') {
                if (stripType === 'rectangular' || stripType === 'rectangular-reinforced') {
                    // Calculate rectangular strip volume
                    volume = (stripLength * stripWidth * stripHeight) / 1000; // height is in mm
                    
                } else if (stripType === 't-shaped') {
                    // Calculate T-shaped strip volume
                    const mainVolume = (stripLength * stripWidth * stripHeight) / 1000;
                    const middleVolume = (stripMiddleLength * stripWidth * stripHeight) / 1000;
                    volume = mainVolume + middleVolume;
                    
                } else if (stripType === 'reinforced-ribs') {
                    // Calculate reinforced strip volume with ribs
                    const mainVolume = (stripLength * stripWidth * stripHeight) / 1000;
                    const ribCount = Math.ceil(stripLength / 2);
                    const ribWidth = stripWidth / 3;
                    const ribVolume = ribCount * (ribWidth * stripWidth / 2 * stripHeight) / 1000;
                    volume = mainVolume + ribVolume;
                }
            }
            
            // Calculate cost
            cost = volume * concretePrice;
            
            // Update display
            if (foundationVolume) foundationVolume.textContent = volume.toFixed(2) + ' м³';
            if (foundationCost) foundationCost.textContent = cost.toLocaleString() + ' ₸';
        }
        
        // Handle slab foundation input changes
        if (slabWidthInput && slabWidthRange) {
            slabWidthInput.addEventListener('input', function() {
                slabWidth = parseFloat(this.value) || 0;
                syncInputs(slabWidthInput, slabWidthRange, slabWidth);
                drawFoundation();
                updateFoundationInfo();
            });
            
            slabWidthRange.addEventListener('input', function() {
                slabWidth = parseFloat(this.value) || 0;
                syncInputs(slabWidthRange, slabWidthInput, slabWidth);
                drawFoundation();
                updateFoundationInfo();
            });
        }
        
        if (slabLengthInput && slabLengthRange) {
            slabLengthInput.addEventListener('input', function() {
                slabLength = parseFloat(this.value) || 0;
                syncInputs(slabLengthInput, slabLengthRange, slabLength);
                drawFoundation();
                updateFoundationInfo();
            });
            
            slabLengthRange.addEventListener('input', function() {
                slabLength = parseFloat(this.value) || 0;
                syncInputs(slabLengthRange, slabLengthInput, slabLength);
                drawFoundation();
                updateFoundationInfo();
            });
        }
        
        if (slabHeightInput && slabHeightRange) {
            slabHeightInput.addEventListener('input', function() {
                slabHeight = parseFloat(this.value) || 0;
                syncInputs(slabHeightInput, slabHeightRange, slabHeight);
                drawFoundation();
                updateFoundationInfo();
            });
            
            slabHeightRange.addEventListener('input', function() {
                slabHeight = parseFloat(this.value) || 0;
                syncInputs(slabHeightRange, slabHeightInput, slabHeight);
                drawFoundation();
                updateFoundationInfo();
            });
        }
        
        // Handle strip foundation input changes
        if (stripWidthInput && stripWidthRange) {
            stripWidthInput.addEventListener('input', function() {
                stripWidth = parseFloat(this.value) || 0;
                syncInputs(stripWidthInput, stripWidthRange, stripWidth);
                drawFoundation();
                updateFoundationInfo();
            });
            
            stripWidthRange.addEventListener('input', function() {
                stripWidth = parseFloat(this.value) || 0;
                syncInputs(stripWidthRange, stripWidthInput, stripWidth);
                drawFoundation();
                updateFoundationInfo();
            });
        }
        
        if (stripLengthInput && stripLengthRange) {
            stripLengthInput.addEventListener('input', function() {
                stripLength = parseFloat(this.value) || 0;
                syncInputs(stripLengthInput, stripLengthRange, stripLength);
                drawFoundation();
                updateFoundationInfo();
            });
            
            stripLengthRange.addEventListener('input', function() {
                stripLength = parseFloat(this.value) || 0;
                syncInputs(stripLengthRange, stripLengthInput, stripLength);
                drawFoundation();
                updateFoundationInfo();
            });
        }
        
        if (stripHeightInput && stripHeightRange) {
            stripHeightInput.addEventListener('input', function() {
                stripHeight = parseFloat(this.value) || 0;
                syncInputs(stripHeightInput, stripHeightRange, stripHeight);
                drawFoundation();
                updateFoundationInfo();
            });
            
            stripHeightRange.addEventListener('input', function() {
                stripHeight = parseFloat(this.value) || 0;
                syncInputs(stripHeightRange, stripHeightInput, stripHeight);
                drawFoundation();
                updateFoundationInfo();
            });
        }
        
        if (stripThicknessInput && stripThicknessRange) {
            stripThicknessInput.addEventListener('input', function() {
                stripThickness = parseFloat(this.value) || 0;
                syncInputs(stripThicknessInput, stripThicknessRange, stripThickness);
                drawFoundation();
                updateFoundationInfo();
            });
            
            stripThicknessRange.addEventListener('input', function() {
                stripThickness = parseFloat(this.value) || 0;
                syncInputs(stripThicknessRange, stripThicknessInput, stripThickness);
                drawFoundation();
                updateFoundationInfo();
            });
        }
        
        if (stripMiddleLengthInput && stripMiddleLengthRange) {
            stripMiddleLengthInput.addEventListener('input', function() {
                stripMiddleLength = parseFloat(this.value) || 0;
                syncInputs(stripMiddleLengthInput, stripMiddleLengthRange, stripMiddleLength);
                drawFoundation();
                updateFoundationInfo();
            });
            
            stripMiddleLengthRange.addEventListener('input', function() {
                stripMiddleLength = parseFloat(this.value) || 0;
                syncInputs(stripMiddleLengthRange, stripMiddleLengthInput, stripMiddleLength);
                drawFoundation();
                updateFoundationInfo();
            });
        }
        
        // Add event listeners to increment/decrement buttons
        document.querySelectorAll('.calc__input-control').forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const targetInput = document.getElementById(targetId);
                if (!targetInput) return;
                
                const isIncrement = this.classList.contains('calc__input-increment');
                const step = parseFloat(targetInput.getAttribute('step')) || 1;
                const min = parseFloat(targetInput.getAttribute('min')) || 0;
                const max = parseFloat(targetInput.getAttribute('max')) || 100;
                
                let value = parseFloat(targetInput.value) || 0;
                
                if (isIncrement) {
                    value = Math.min(value + step, max);
                } else {
                    value = Math.max(value - step, min);
                }
                
                targetInput.value = value;
                targetInput.dispatchEvent(new Event('input'));
            });
        });
        
        // Initialize foundation visualization
        drawFoundation();
        updateFoundationInfo();
    }
    
    // Интерактивная визуализация материалов стен
    const materialSelect = document.getElementById('material');
    const material3dPreview = document.getElementById('material-3d-preview');
    const materialLengthValue = document.getElementById('material-length-value');
    const materialWidthValue = document.getElementById('material-width-value');
    const materialHeightValue = document.getElementById('material-height-value');
    const insulationLevel = document.getElementById('insulation-level');
    const insulationProgress = document.getElementById('insulation-progress');
    const moistureResistance = document.getElementById('moisture-resistance');
    const moistureProgress = document.getElementById('moisture-progress');
    const regionSuitability = document.getElementById('region-suitability');
    const customMaterialControls = document.getElementById('custom-material-controls');
    const blockWeightInput = document.getElementById('block-weight');
    const blockPriceInput = document.getElementById('block-price');
    const blocksCount = document.getElementById('blocks-count');
    const totalWeight = document.getElementById('total-weight');
    const totalPrice = document.getElementById('total-price');
    
    // Текущие значения
    let selectedRegion = '';
    let selectedMaterial = null;
    let materialDimensions = { length: 390, width: 190, height: 188 };
    let blockWeight = 15;
    let blockPrice = 500;
    let wallThickness = 1;
    
    // Функция для обновления 3D-визуализации материала
    function updateMaterial3DPreview() {
        if (!material3dPreview) return;

        // Обновляем размеры 3D-блока в соответствии с пропорциями материала
        const maxDimension = Math.max(materialDimensions.length, materialDimensions.width, materialDimensions.height);
        const scale = 200 / maxDimension;

        const scaledLength = materialDimensions.length * scale;
        const scaledWidth = materialDimensions.width * scale;
        const scaledHeight = materialDimensions.height * scale;

        material3dPreview.style.width = `${scaledLength}px`;
        material3dPreview.style.height = `${scaledHeight}px`;

        // Обновляем стили для псевдоэлементов (через CSS переменные)
        material3dPreview.style.setProperty('--material-width', `${scaledWidth}px`);
        material3dPreview.style.setProperty('--material-length', `${scaledLength}px`);
        material3dPreview.style.setProperty('--material-height', `${scaledHeight}px`);

        // Обновляем отображаемые значения размеров
        if (materialLengthValue) materialLengthValue.textContent = materialDimensions.length;
        if (materialWidthValue) materialWidthValue.textContent = materialDimensions.width;
        if (materialHeightValue) materialHeightValue.textContent = materialDimensions.height;
    }
    
    // Функция для обновления свойств материала
    function updateMaterialProperties(material) {
        if (!material) return;
        
        // Обновляем теплоизоляцию
        if (insulationLevel && insulationProgress) {
            let insulationValue = 'Средняя';
            let insulationPercent = 50;
            
            if (material.dataset.insulation) {
                insulationValue = material.dataset.insulation;
                
                switch (insulationValue.toLowerCase()) {
                    case 'низкая':
                        insulationPercent = 30;
                        break;
                    case 'средняя':
                        insulationPercent = 60;
                        break;
                    case 'высокая':
                        insulationPercent = 90;
                        break;
                }
            }
            
            insulationLevel.textContent = insulationValue;
            insulationProgress.style.width = `${insulationPercent}%`;
        }
        
        // Обновляем влагостойкость
        if (moistureResistance && moistureProgress) {
            let moistureValue = 'Средняя';
            let moisturePercent = 50;
            
            if (material.dataset.moisture) {
                moistureValue = material.dataset.moisture;
                
                switch (moistureValue.toLowerCase()) {
                    case 'низкая':
                        moisturePercent = 30;
                        break;
                    case 'средняя':
                        moisturePercent = 60;
                        break;
                    case 'высокая':
                        moisturePercent = 90;
                        break;
                }
            }
            
            moistureResistance.textContent = moistureValue;
            moistureProgress.style.width = `${moisturePercent}%`;
        }
        
        // Обновляем подходит ли для региона
        if (regionSuitability) {
            let isSuitable = false;
            
            if (selectedRegion && material.dataset[selectedRegion] === 'True') {
                isSuitable = true;
            }
            
            regionSuitability.innerHTML = isSuitable 
                ? '<span class="calc__suitability-badge">Да</span>' 
                : '<span class="calc__suitability-badge unsuitable">Нет</span>';
        }
    }
    
    // Функция для парсинга размеров материала из строки (например, "390×190×188")
    function parseMaterialSize(sizeStr) {
        if (!sizeStr) return { length: 390, width: 190, height: 188 };
        
        const dimensions = sizeStr.split('×').map(dim => parseInt(dim.trim(), 10));
        
        return {
            length: dimensions[0] || 390,
            width: dimensions[1] || 190,
            height: dimensions[2] || 188
        };
    }
    
    // Функция для расчета количества блоков и стоимости
    function calculateMaterialsNeeded() {
        if (!blocksCount || !totalWeight || !totalPrice) return;
        
        // Получаем размеры здания из второго шага
        const buildingLength = parseFloat(document.getElementById('building-length')?.value || 10);
        const buildingWidth = parseFloat(document.getElementById('building-width')?.value || 8);
        const wallHeight = parseFloat(document.getElementById('wall-height')?.value || 3);
        
        // Площадь стен (без учета окон и дверей)
        const wallsArea = 2 * (buildingLength * wallHeight + buildingWidth * wallHeight);
        
        // Размеры одного блока в метрах
        const blockLengthM = materialDimensions.length / 1000;
        const blockWidthM = materialDimensions.width / 1000;
        const blockHeightM = materialDimensions.height / 1000;
        
        // Площадь одного блока в квадратных метрах
        const blockArea = blockLengthM * blockHeightM;
        
        // Количество блоков с учетом толщины стены
        const blocksNeeded = Math.ceil(wallsArea / blockArea * wallThickness);
        
        // Общий вес материалов
        const totalWeightValue = blocksNeeded * blockWeight;
        
        // Общая стоимость материалов
        const totalPriceValue = blocksNeeded * blockPrice;
        
        // Обновляем отображение
        blocksCount.textContent = `${blocksNeeded.toLocaleString()} шт.`;
        totalWeight.textContent = `${totalWeightValue.toLocaleString()} кг`;
        totalPrice.textContent = `${totalPriceValue.toLocaleString()} ₸`;
    }
    
    // Обработчики событий
    if (materialSelect) {
        materialSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            selectedMaterial = selectedOption;
            
            // Показываем/скрываем кнопку добавления своего материала
            if (customMaterialControls) {
                customMaterialControls.style.display = this.value === 'custom' ? 'flex' : 'none';
            }
            
            // Если выбран не кастомный материал, обновляем визуализацию
            if (this.value !== 'custom') {
                // Парсим размеры материала
                if (selectedOption.dataset.size) {
                    materialDimensions = parseMaterialSize(selectedOption.dataset.size);
                }
                
                // Обновляем 3D-визуализацию
                updateMaterial3DPreview();
                
                // Обновляем свойства материала
                updateMaterialProperties(selectedOption);
                
                // Пересчитываем количество и стоимость
                calculateMaterialsNeeded();
            }
        });
    }
    
    // Обработчики для веса и цены блока
    if (blockWeightInput) {
        blockWeightInput.addEventListener('input', function() {
            blockWeight = parseFloat(this.value) || 0;
            calculateMaterialsNeeded();
        });
        
        // Кнопки +/-
        const incrementWeightBtn = document.querySelector('[data-target="block-weight"].calc__input-increment');
        const decrementWeightBtn = document.querySelector('[data-target="block-weight"].calc__input-decrement');
        
        if (incrementWeightBtn) {
            incrementWeightBtn.addEventListener('click', function() {
                blockWeight = Math.min((parseFloat(blockWeightInput.value) || 0) + 0.1, 1000);
                blockWeightInput.value = blockWeight.toFixed(1);
                calculateMaterialsNeeded();
            });
        }
        
        if (decrementWeightBtn) {
            decrementWeightBtn.addEventListener('click', function() {
                blockWeight = Math.max((parseFloat(blockWeightInput.value) || 0) - 0.1, 0);
                blockWeightInput.value = blockWeight.toFixed(1);
                calculateMaterialsNeeded();
            });
        }
    }
    
    if (blockPriceInput) {
        blockPriceInput.addEventListener('input', function() {
            blockPrice = parseFloat(this.value) || 0;
            calculateMaterialsNeeded();
        });
        
        // Кнопки +/-
        const incrementPriceBtn = document.querySelector('[data-target="block-price"].calc__input-increment');
        const decrementPriceBtn = document.querySelector('[data-target="block-price"].calc__input-decrement');
        
        if (incrementPriceBtn) {
            incrementPriceBtn.addEventListener('click', function() {
                blockPrice = Math.min((parseFloat(blockPriceInput.value) || 0) + 50, 100000);
                blockPriceInput.value = blockPrice;
                calculateMaterialsNeeded();
            });
        }
        
        if (decrementPriceBtn) {
            decrementPriceBtn.addEventListener('click', function() {
                blockPrice = Math.max((parseFloat(blockPriceInput.value) || 0) - 50, 0);
                blockPriceInput.value = blockPrice;
                calculateMaterialsNeeded();
            });
        }
    }
    
    // Обработчик для толщины стен
    const wallThicknessRadios = document.querySelectorAll('input[name="wall-thickness"]');
    wallThicknessRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                wallThickness = parseFloat(this.value);
                calculateMaterialsNeeded();
            }
        });
    });
    
    // Отслеживаем выбор региона в первом шаге
    const regionRadios = document.querySelectorAll('input[name="region"]');
    regionRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                selectedRegion = this.value;
                
                // Если материал уже выбран, обновляем информацию о совместимости
                if (selectedMaterial) {
                    updateMaterialProperties(selectedMaterial);
                }
            }
        });
    });
    
    // Инициализация визуализации материала
    updateMaterial3DPreview();
    calculateMaterialsNeeded();
    
    // Elements
    const form = document.getElementById('calc-form');
    const steps = document.querySelectorAll('.calc__step');
    const progressItems = document.querySelectorAll('.calc__progress-item');
    const progressList = document.querySelector('.calc__progress-list');
    const prevButton = document.getElementById('prev-step');
    const nextButton = document.getElementById('next-step');

    let currentStep = 0;
    let completedSteps = new Set();

    updateUI();

    nextButton.addEventListener('click', function () {
        if (currentStep < steps.length - 1) {
            if (validateStep(currentStep)) {
                completedSteps.add(currentStep);
                goToStep(currentStep + 1);
            }
        } else {
            if (validateStep(currentStep)) {
                form.submit();
            }
        }
    });

    prevButton.addEventListener('click', function () {
        if (currentStep > 0) {
            goToStep(currentStep - 1);
        }
    });

    progressList.addEventListener('click', function (e) {
        const item = e.target.closest('.calc__progress-item');
        if (!item) return;

        const stepIndex = parseInt(item.dataset.step);

        if (completedSteps.has(stepIndex) || stepIndex === currentStep) {
            goToStep(stepIndex);
        }
    });

    function goToStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= steps.length) return;

        steps[currentStep].classList.remove('active');
        steps[currentStep].setAttribute('aria-hidden', 'true');
        progressItems[currentStep].classList.remove('active');

        currentStep = stepIndex;
        updateUI();
    }

    function updateUI() {
        steps[currentStep].classList.add('active');
        steps[currentStep].removeAttribute('aria-hidden');

        progressItems.forEach((item, index) => {
            item.classList.remove('active', 'completed');

            if (index === currentStep) {
                item.classList.add('active');
                item.setAttribute('aria-current', 'step');
            } else {
                item.removeAttribute('aria-current');
            }

            if (completedSteps.has(index)) {
                item.classList.add('completed');
            }
        });

        prevButton.disabled = currentStep === 0;

        if (currentStep === steps.length - 1) {
            nextButton.textContent = 'Рассчитать';
        } else {
            nextButton.textContent = 'Далее';
        }
    }

    function validateStep(stepIndex) {
        const step = steps[stepIndex];
        const inputs = step.querySelectorAll('input, select');
        let isValid = true;

        // Check all required fields
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                input.classList.add('invalid');

                // Add error message if it doesn't exist
                let errorMessage = input.parentNode.querySelector('.error-message');
                if (!errorMessage) {
                    errorMessage = document.createElement('span');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'Это поле обязательно для заполнения';
                    input.parentNode.appendChild(errorMessage);
                }
            } else {
                input.classList.remove('invalid');
                const errorMessage = input.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
        });

        return isValid;
    }

    // Функция для обновления результатов (Шаг 6)
    function updateResults() {
        // Получение элементов результатов
        const resultBuildingArea = document.getElementById('result-building-area');
        const resultBuildingPerimeter = document.getElementById('result-building-perimeter');
        const resultWallsArea = document.getElementById('result-walls-area');
        const resultMasonryVolume = document.getElementById('result-masonry-volume');
        const resultMaterialType = document.getElementById('result-material-type');
        const resultBlocksCount = document.getElementById('result-blocks-count');
        const resultMaterialsWeight = document.getElementById('result-materials-weight');
        const resultMaterialsCost = document.getElementById('result-materials-cost');
        const resultBlocksPerCube = document.getElementById('result-blocks-per-cube');
        const resultTotalCost = document.getElementById('result-total-cost');
        
        // Элементы для плитного фундамента
        const resultFoundationSlab = document.getElementById('result-foundation-slab');
        const resultSlabPerimeter = document.getElementById('result-slab-perimeter');
        const resultSlabVolume = document.getElementById('result-slab-volume');
        const resultSlabWeight = document.getElementById('result-slab-weight');
        const resultSlabCost = document.getElementById('result-slab-cost');
        
        // Элементы для ленточного фундамента
        const resultFoundationStrip = document.getElementById('result-foundation-strip');
        const resultStripLength = document.getElementById('result-strip-length');
        const resultStripVolume = document.getElementById('result-strip-volume');
        const resultStripWeight = document.getElementById('result-strip-weight');
        const resultStripCost = document.getElementById('result-strip-cost');
        
        // Расчет параметров здания
        const buildingArea = buildingLength * buildingWidth;
        const buildingPerimeter = 2 * (buildingLength + buildingWidth);
        
        // Расчет площади стен (с учетом проемов)
        const wallsArea = calculateWallsArea();
        
        // Расчет объема кладки
        const wallThicknessValue = wallThickness === 'half' ? 0.5 : (wallThickness === 'one' ? 1 : 1.5);
        const masonryVolume = wallsArea * blockWidth * wallThicknessValue / 1000; // в кубических метрах
        
        // Расчет количества блоков
        const blocksCount = Math.ceil(masonryVolume / (blockLength * blockWidth * blockHeight / 1000000000));
        
        // Расчет веса материалов
        const materialsWeight = blocksCount * blockWeight;
        
        // Расчет стоимости материалов
        const materialsCost = blocksCount * blockPrice;
        
        // Расчет количества блоков в кубе
        const blocksPerCube = Math.floor(1 / (blockLength * blockWidth * blockHeight / 1000000000));
        
        // Расчет стоимости фундамента
        let foundationCost = 0;
        let foundationVolume = 0;
        
        // Плотность бетона (кг/м³)
        const concreteDensity = 2400;
        
        // Показать/скрыть соответствующий тип фундамента
        if (resultFoundationSlab) resultFoundationSlab.style.display = 'none';
        if (resultFoundationStrip) resultFoundationStrip.style.display = 'none';
        
        if (foundationType === 'slab') {
            // Расчеты для плитного фундамента
            foundationVolume = (slabWidth * slabLength * slabHeight) / 1000; // в кубических метрах
            foundationCost = foundationVolume * concretePrice;
            
            const slabPerimeter = 2 * (slabWidth + slabLength);
            const slabWeight = foundationVolume * concreteDensity;
            
            // Обновление информации о плитном фундаменте
            if (resultFoundationSlab) resultFoundationSlab.style.display = 'block';
            if (resultSlabPerimeter) resultSlabPerimeter.textContent = slabPerimeter.toFixed(2) + ' м';
            if (resultSlabVolume) resultSlabVolume.textContent = foundationVolume.toFixed(2) + ' м³';
            if (resultSlabWeight) resultSlabWeight.textContent = slabWeight.toFixed(0) + ' кг';
            if (resultSlabCost) resultSlabCost.textContent = foundationCost.toLocaleString() + ' ₸';
            
        } else if (foundationType === 'strip') {
            // Расчеты для ленточного фундамента
            let stripTotalLength = stripLength;
            
            if (stripType === 't-shaped') {
                stripTotalLength += stripMiddleLength;
            } else if (stripType === 'reinforced-ribs') {
                const ribCount = Math.ceil(stripLength / 2);
                const ribWidth = stripWidth / 3;
                stripTotalLength += ribCount * ribWidth;
            }
            
            // Расчет объема бетона в зависимости от типа ленточного фундамента
            if (stripType === 'rectangular' || stripType === 'rectangular-reinforced') {
                foundationVolume = (stripLength * stripWidth * stripHeight) / 1000; // в кубических метрах
            } else if (stripType === 't-shaped') {
                const mainVolume = (stripLength * stripWidth * stripHeight) / 1000;
                const middleVolume = (stripMiddleLength * stripWidth * stripHeight) / 1000;
                foundationVolume = mainVolume + middleVolume;
                
            } else if (stripType === 'reinforced-ribs') {
                const mainVolume = (stripLength * stripWidth * stripHeight) / 1000;
                const ribCount = Math.ceil(stripLength / 2);
                const ribWidth = stripWidth / 3;
                const ribVolume = ribCount * (ribWidth * stripWidth / 2 * stripHeight) / 1000;
                foundationVolume = mainVolume + ribVolume;
            }
            
            foundationCost = foundationVolume * concretePrice;
            const stripWeight = foundationVolume * concreteDensity;
            
            // Обновление информации о ленточном фундаменте
            if (resultFoundationStrip) resultFoundationStrip.style.display = 'block';
            if (resultStripLength) resultStripLength.textContent = stripTotalLength.toFixed(2) + ' м';
            if (resultStripVolume) resultStripVolume.textContent = foundationVolume.toFixed(2) + ' м³';
            if (resultStripWeight) resultStripWeight.textContent = stripWeight.toFixed(0) + ' кг';
            if (resultStripCost) resultStripCost.textContent = foundationCost.toLocaleString() + ' ₸';
        }
        
        // Расчет стоимости окон и дверей
        let windowsCost = 0;
        let doorsCost = 0;
        
        // Расчет стоимости окон
        windows.forEach(window => {
            const windowArea = window.width * window.height;
            const windowCost = windowArea * window.count * windowPrice;
            windowsCost += windowCost;
        });
        
        // Расчет стоимости дверей
        doors.forEach(door => {
            const doorArea = door.width * door.height;
            const doorCost = doorArea * door.count * doorPrice;
            doorsCost += doorCost;
        });
        
        // Расчет общей стоимости
        const totalCost = materialsCost + windowsCost + doorsCost + foundationCost;
        
        // Обновление элементов результатов
        if (resultBuildingArea) resultBuildingArea.textContent = buildingArea.toFixed(2) + ' м²';
        if (resultBuildingPerimeter) resultBuildingPerimeter.textContent = buildingPerimeter.toFixed(2) + ' м';
        if (resultWallsArea) resultWallsArea.textContent = wallsArea.toFixed(2) + ' м²';
        if (resultMasonryVolume) resultMasonryVolume.textContent = masonryVolume.toFixed(2) + ' м³';
        
        // Получение названия материала
        let materialName = 'Не выбрано';
        if (materialSelect) {
            const selectedOption = materialSelect.options[materialSelect.selectedIndex];
            if (selectedOption) {
                materialName = selectedOption.textContent;
            }
        }
        
        if (resultMaterialType) resultMaterialType.textContent = materialName;
        if (resultBlocksCount) resultBlocksCount.textContent = blocksCount.toLocaleString() + ' шт.';
        if (resultMaterialsWeight) resultMaterialsWeight.textContent = materialsWeight.toLocaleString() + ' кг';
        if (resultMaterialsCost) resultMaterialsCost.textContent = materialsCost.toLocaleString() + ' ₸';
        if (resultBlocksPerCube) resultBlocksPerCube.textContent = blocksPerCube.toLocaleString() + ' шт.';
        if (resultTotalCost) resultTotalCost.textContent = totalCost.toLocaleString() + ' ₸';
        
        // Создание круговой диаграммы распределения затрат
        createCostDistributionChart(materialsCost, windowsCost, doorsCost, foundationCost);
    }
    
    // Функция для расчета площади стен с учетом проемов
    function calculateWallsArea() {
        // Общая площадь стен
        const wallsArea = 2 * wallHeight * (buildingLength + buildingWidth);
        
        // Площадь оконных проемов
        let windowsArea = 0;
        windows.forEach(window => {
            windowsArea += window.width * window.height * window.count;
        });
        
        // Площадь дверных проемов
        let doorsArea = 0;
        doors.forEach(door => {
            doorsArea += door.width * door.height * door.count;
        });
        
        // Площадь стен за вычетом проемов
        return wallsArea - windowsArea - doorsArea;
    }
    
    // Функция для создания круговой диаграммы распределения затрат
    function createCostDistributionChart(wallsCost, windowsCost, doorsCost, foundationCost) {
        const chartCanvas = document.getElementById('cost-distribution-chart');
        if (!chartCanvas) return;
        
        // Проверка наличия Chart.js
        if (typeof Chart === 'undefined') {
            // Загрузка Chart.js, если он еще не загружен
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = function() {
                // После загрузки Chart.js создаем диаграмму
                createChart();
            };
            document.head.appendChild(script);
        } else {
            // Chart.js уже загружен, создаем диаграмму
            createChart();
        }
        
        function createChart() {
            // Уничтожаем предыдущую диаграмму, если она существует
            if (window.costChart) {
                window.costChart.destroy();
            }
            
            // Данные для диаграммы
            const data = {
                labels: ['Стены', 'Окна', 'Двери', 'Фундамент'],
                datasets: [{
                    data: [wallsCost, windowsCost, doorsCost, foundationCost],
                    backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#F44336'],
                    borderColor: ['#388E3C', '#1976D2', '#FFA000', '#D32F2F'],
                    borderWidth: 1
                }]
            };
            
            // Скрыть фундамент, если он не выбран
            if (foundationType === 'none') {
                data.labels.pop();
                data.datasets[0].data.pop();
                data.datasets[0].backgroundColor.pop();
                data.datasets[0].borderColor.pop();
                
                // Скрыть легенду фундамента
                const foundationLegend = document.getElementById('legend-foundation');
                if (foundationLegend) foundationLegend.style.display = 'none';
            } else {
                // Показать легенду фундамента
                const foundationLegend = document.getElementById('legend-foundation');
                if (foundationLegend) foundationLegend.style.display = 'flex';
            }
            
            // Опции диаграммы
            const options = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value.toLocaleString()} ₸ (${percentage}%)`;
                            }
                        }
                    }
                }
            };
            
            // Создание диаграммы
            window.costChart = new Chart(chartCanvas, {
                type: 'pie',
                data: data,
                options: options
            });
        }
    }
    
    // Обработчики для кнопок экспорта
    const exportChartPdfButton = document.getElementById('export-chart-pdf');
    const exportChartPngButton = document.getElementById('export-chart-png');
    const copyChartButton = document.getElementById('copy-chart');
    const exportReportPdfButton = document.getElementById('export-report-pdf');
    
    if (exportChartPdfButton) {
        exportChartPdfButton.addEventListener('click', function() {
            // Экспорт диаграммы в PDF
            alert('Функция экспорта в PDF будет реализована в будущих обновлениях');
        });
    }
    
    if (exportChartPngButton) {
        exportChartPngButton.addEventListener('click', function() {
            // Экспорт диаграммы в PNG
            const chartCanvas = document.getElementById('cost-distribution-chart');
            if (chartCanvas) {
                const link = document.createElement('a');
                link.download = 'cost-distribution-chart.png';
                link.href = chartCanvas.toDataURL('image/png');
                link.click();
            }
        });
    }
    
    if (copyChartButton) {
        copyChartButton.addEventListener('click', function() {
            // Копирование диаграммы в буфер обмена
            const chartCanvas = document.getElementById('cost-distribution-chart');
            if (chartCanvas) {
                chartCanvas.toBlob(function(blob) {
                    const item = new ClipboardItem({ 'image/png': blob });
                    navigator.clipboard.write([item])
                        .then(() => alert('Диаграмма скопирована в буфер обмена'))
                        .catch(err => console.error('Ошибка копирования: ', err));
                });
            }
        });
    }
    
    if (exportReportPdfButton) {
        exportReportPdfButton.addEventListener('click', function() {
            // Экспорт отчета в PDF
            alert('Функция экспорта отчета в PDF будет реализована в будущих обновлениях');
        });
    }
    
    // Обновление результатов при изменении шага
    document.addEventListener('calc:stepChanged', function(event) {
        const step = event.detail.step;
        if (step === 6) {
            updateResults();
        }
    });
    
    // Обновление результатов при изменении параметров здания
    document.addEventListener('calc:buildingChanged', function() {
        updateResults();
    });
    
    // Обновление результатов при изменении материалов
    document.addEventListener('calc:materialsChanged', function() {
        updateResults();
    });
    
    // Обновление результатов при изменении окон и дверей
    document.addEventListener('calc:openingsChanged', function() {
        updateResults();
    });
    
    // Обновление результатов при изменении фундамента
    document.addEventListener('calc:foundationChanged', function() {
        updateResults();
    });
    
    // Инициализация результатов
    updateResults();
});