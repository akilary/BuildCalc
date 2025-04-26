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
            ctx.stroke();

            
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
            ctx.stroke();

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
            ctx.stroke();

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
            ctx.stroke();

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
            ctx.stroke();

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
    
    // Интерактивная визуализация материалов стен
    const materialCanvas = document.getElementById('material-canvas');
    const materialSelect = document.getElementById('material');
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
    let selectedRegion = 'north'; // По умолчанию выбран север
    let selectedMaterial = null;
    let materialDimensions = { length: 390, width: 190, height: 188 };
    let blockWeight = 15;
    let blockPrice = 500;
    let wallThickness = 1;
    
    // Функция для отрисовки 3D-модели материала
    function drawMaterial() {
        if (!materialCanvas) return;
        
        const ctx = materialCanvas.getContext('2d');
        
        // Очищаем холст
        ctx.clearRect(0, 0, materialCanvas.width, materialCanvas.height);
        
        // Центр холста
        const centerX = materialCanvas.width / 2;
        const centerY = materialCanvas.height / 2;
        
        // Масштаб (чтобы блок материала помещался на холсте)
        const maxDimension = Math.max(materialDimensions.length, materialDimensions.width, materialDimensions.height);
        const scale = Math.min(
            (materialCanvas.width - 100) / (materialDimensions.length + materialDimensions.width) * 0.5,
            (materialCanvas.height - 100) / (materialDimensions.height + materialDimensions.width / 2) * 0.5
        );
        
        // Изометрические проекции
        const isoX = (x, y) => centerX + (x - y) * scale * 0.7;
        const isoY = (x, y, z) => centerY + (x + y) * scale * 0.4 - z * scale * 0.8;
        
        // Цвета
        const blockColor = '#F7931E';
        const blockDarkColor = '#D67A0D';
        const outlineColor = '#121212';

        // Рисуем переднюю грань
        ctx.beginPath();
        ctx.moveTo(isoX(0, 0), isoY(0, 0, 0));
        ctx.lineTo(isoX(0, 0), isoY(0, 0, materialDimensions.height));
        ctx.lineTo(isoX(materialDimensions.length, 0), isoY(materialDimensions.length, 0, materialDimensions.height));
        ctx.lineTo(isoX(materialDimensions.length, 0), isoY(materialDimensions.length, 0, 0));
        ctx.closePath();
        ctx.fillStyle = blockColor;
        ctx.fill();
        ctx.strokeStyle = outlineColor;
        ctx.stroke();

        // Рисуем левую грань
        ctx.beginPath();
        ctx.moveTo(isoX(0, 0), isoY(0, 0, 0));
        ctx.lineTo(isoX(0, 0), isoY(0, 0, materialDimensions.height));
        ctx.lineTo(isoX(0, materialDimensions.width), isoY(0, materialDimensions.width, materialDimensions.height));
        ctx.lineTo(isoX(0, materialDimensions.width), isoY(0, materialDimensions.width, 0));
        ctx.closePath();
        ctx.fillStyle = blockColor;
        ctx.fill();
        ctx.strokeStyle = outlineColor;
        ctx.stroke();

        // Рисуем заднюю грань
        ctx.beginPath();
        ctx.moveTo(isoX(0, materialDimensions.width), isoY(0, materialDimensions.width, 0));
        ctx.lineTo(isoX(0, materialDimensions.width), isoY(0, materialDimensions.width, materialDimensions.height));
        ctx.lineTo(isoX(materialDimensions.length, materialDimensions.width), isoY(materialDimensions.length, materialDimensions.width, materialDimensions.height));
        ctx.lineTo(isoX(materialDimensions.length, materialDimensions.width), isoY(materialDimensions.length, materialDimensions.width, 0));
        ctx.closePath();
        ctx.fillStyle = blockDarkColor;
        ctx.fill();
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        

        
        // Рисуем правую грань
        ctx.beginPath();
        ctx.moveTo(isoX(materialDimensions.length, 0), isoY(materialDimensions.length, 0, 0));
        ctx.lineTo(isoX(materialDimensions.length, 0), isoY(materialDimensions.length, 0, materialDimensions.height));
        ctx.lineTo(isoX(materialDimensions.length, materialDimensions.width), isoY(materialDimensions.length, materialDimensions.width, materialDimensions.height));
        ctx.lineTo(isoX(materialDimensions.length, materialDimensions.width), isoY(materialDimensions.length, materialDimensions.width, 0));
        ctx.closePath();
        ctx.fillStyle = blockDarkColor;
        ctx.fill();
        ctx.strokeStyle = outlineColor;
        ctx.stroke();
        

        
        // Рисуем верхнюю грань
        ctx.beginPath();
        ctx.moveTo(isoX(0, 0), isoY(0, 0, materialDimensions.height));
        ctx.lineTo(isoX(materialDimensions.length, 0), isoY(materialDimensions.length, 0, materialDimensions.height));
        ctx.lineTo(isoX(materialDimensions.length, materialDimensions.width), isoY(materialDimensions.length, materialDimensions.width, materialDimensions.height));
        ctx.lineTo(isoX(0, materialDimensions.width), isoY(0, materialDimensions.width, materialDimensions.height));
        ctx.closePath();
        ctx.fillStyle = blockColor;
        ctx.fill();
        ctx.strokeStyle = outlineColor;
        ctx.stroke();
        
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
                drawMaterial();
                
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
    drawMaterial();
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
});