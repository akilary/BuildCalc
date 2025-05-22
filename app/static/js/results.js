document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что Chart.js и ChartDataLabels загружены
    if (typeof Chart !== 'undefined' && typeof ChartDataLabels !== 'undefined') {
        Chart.register(ChartDataLabels);
    } else {
        console.error('Chart.js или ChartDataLabels не загружены');
        return;
    }

    const resultsChartCanvas = document.getElementById('results-chart');
    const areaChartCanvas = document.getElementById('area-chart');
    const materialChartCanvas = document.getElementById('material-chart');

    // Извлечение данных из страницы
    const extractDataFromPage = () => {
        try {
            // Получаем данные из элемента с id 'results-data'
            const resultsDataElement = document.getElementById('results-data');
            if (!resultsDataElement) {
                console.error('Элемент с данными результатов не найден');
                return null;
            }
            
            return JSON.parse(resultsDataElement.textContent);
        } catch (error) {
            console.error('Ошибка при извлечении данных:', error);
            return null;
        }
    };

    const data = extractDataFromPage();
    if (!data) return;

    // Цвета для графиков
    const chartColors = {
        walls: '#4CAF50',
        windows: '#2196F3',
        doors: '#FF9800',
        building: '#3A2E39',
        openings: '#F15152',
        wallsArea: '#1E555C',
        material: '#673AB7'
    };

    // Общие настройки для графиков
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                color: '#fff',
                font: {
                    weight: 'bold',
                    size: 12
                }
            }
        }
    };

    if (resultsChartCanvas) {
        const costCtx = resultsChartCanvas.getContext('2d');

        const wallsCost = data.cost.materials;
        const doorsCost = data.openings_cost ? data.openings_cost.doors : 0;
        const windowsCost = data.openings_cost ? data.openings_cost.windows : 0;
        const costPerMeter = data.cost.per_square_meter;
        
        // Общая стоимость для процентного расчета
        const totalCost = wallsCost + doorsCost + windowsCost;
        
        new Chart(costCtx, {
            type: 'bar',
            data: {
                labels: ['Материалы стен', 'Двери', 'Окна', 'За м²'],
                datasets: [{
                    label: 'Стоимость (₸)',
                    data: [wallsCost, doorsCost, windowsCost, costPerMeter],
                    backgroundColor: [
                        chartColors.walls,
                        chartColors.doors,
                        chartColors.windows,
                        chartColors.material
                    ],
                    borderColor: [
                        chartColors.walls,
                        chartColors.doors,
                        chartColors.windows,
                        chartColors.material
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                ...commonOptions,
                plugins: {
                    ...commonOptions.plugins,
                    datalabels: {
                        formatter: (value, ctx) => {
                            // Показываем стоимость и процент от общей стоимости
                            if (ctx.dataIndex < 3) { // Только для материалов, дверей и окон
                                const percent = Math.round((value / totalCost) * 100);
                                return value.toLocaleString('ru-RU') + ' ₸\n(' + percent + '%)';
                            }
                            return value.toLocaleString('ru-RU') + ' ₸';
                        }
                    },
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Затраты на строительство',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed.y.toLocaleString('ru-RU') + ' ₸';
                                
                                if (context.dataIndex < 3) { // Только для материалов, дверей и окон
                                    const percent = Math.round((context.parsed.y / totalCost) * 100);
                                    label += ' (' + percent + '% от общей стоимости)';
                                }
                                
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('ru-RU') + ' ₸';
                            }
                        }
                    }
                }
            }
        });
    }

    // График распределения площади
    if (areaChartCanvas) {
        const areaCtx = areaChartCanvas.getContext('2d');
        new Chart(areaCtx, {
            type: 'doughnut',
            data: {
                labels: ['Площадь проемов', 'Чистая площадь стен'],
                datasets: [{
                    data: [data.openings.openings_area, data.walls.net_area],
                    backgroundColor: [
                        chartColors.openings,
                        chartColors.wallsArea
                    ],
                    borderColor: [
                        '#ffffff',
                        '#ffffff'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                ...commonOptions,
                cutout: '60%',
                plugins: {
                    ...commonOptions.plugins,
                    datalabels: {
                        formatter: (value, ctx) => {
                            return value + ' м²';
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20
                        }
                    },
                    title: {
                        display: true,
                        text: 'Распределение площади',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    }

    // График информации о материалах
    if (materialChartCanvas) {
        const materialCtx = materialChartCanvas.getContext('2d');
        new Chart(materialCtx, {
            type: 'pie',
            data: {
                labels: ['Блоки', 'Поддоны'],
                datasets: [{
                    data: [data.material.blocks_count, data.material.pallets_count === 'Не определено' ? 0 : data.material.pallets_count],
                    backgroundColor: [
                        chartColors.walls,
                        chartColors.doors
                    ],
                    borderColor: [
                        '#ffffff',
                        '#ffffff'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                ...commonOptions,
                plugins: {
                    ...commonOptions.plugins,
                    datalabels: {
                        formatter: (value, ctx) => {
                            return value + ' шт.';
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20
                        }
                    },
                    title: {
                        display: true,
                        text: 'Материалы',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    }

    // Заполнение текстовых полей с результатами
    const fillResultsData = () => {
        // Получаем данные о стоимости
        const doorsCost = data.openings_cost ? data.openings_cost.doors : 0;
        const windowsCost = data.openings_cost ? data.openings_cost.windows : 0;
        const totalCost = data.cost.materials + doorsCost + windowsCost;
        
        const elements = {
            // Информация о здании
            'building-area': data.building.area + ' м²',
            'building-perimeter': data.building.perimeter + ' м',
            
            // Информация о стенах
            'walls-total-area': data.walls.total_area + ' м²',
            'walls-net-area': data.walls.net_area + ' м²',
            'walls-volume': data.walls.volume + ' м³',
            
            // Информация о проемах
            'doors-area': data.openings.doors_area + ' м²',
            'windows-area': data.openings.windows_area + ' м²',
            'openings-area': data.openings.openings_area + ' м²',
            
            // Информация о материалах
            'material-blocks': data.material.blocks_count + ' шт.',
            'material-pallets': data.material.pallets_count + ' шт.',
            'material-weight': data.material.weight + ' т',
            'material-size': data.material.size + ' мм',
            
            // Информация о стоимости
            'cost-materials': data.cost.materials.toLocaleString('ru-RU') + ' ₸',
            'cost-per-meter': data.cost.per_square_meter.toLocaleString('ru-RU') + ' ₸/м²',
            'cost-doors': doorsCost.toLocaleString('ru-RU') + ' ₸',
            'cost-windows': windowsCost.toLocaleString('ru-RU') + ' ₸',
            'cost-total': totalCost.toLocaleString('ru-RU') + ' ₸',
            
            // Дополнительная информация о материале
            'material-notes': data.material_info.notes,
            'material-insulation': data.material_info.insulation_level,
            'material-moisture': data.material_info.moisture_resistance,
            'material-region': data.material_info.region_compatibility
        };

        // Заполняем все элементы данными
        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }
    };

    fillResultsData();

    // Инициализация кнопок для печати и сохранения результатов
    const initializeButtons = () => {
        const printButton = document.getElementById('print-results');
        if (printButton) {
            printButton.addEventListener('click', () => {
                window.print();
            });
        }

        const saveButton = document.getElementById('save-results');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                const doorsCost = data.openings_cost ? data.openings_cost.doors : 0;
                const windowsCost = data.openings_cost ? data.openings_cost.windows : 0;
                const totalCost = data.cost.materials + doorsCost + windowsCost;
                
                const resultsData = {
                    timestamp: new Date().toISOString(),
                    results: data,
                    total_cost: totalCost
                };
                
                const blob = new Blob([JSON.stringify(resultsData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = 'buildcalc-results-' + new Date().toISOString().slice(0, 10) + '.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        }

        const backButton = document.getElementById('back-to-calc');
        if (backButton) {
            backButton.addEventListener('click', () => {
                window.location.href = backButton.getAttribute('data-url') || '/calc';
            });
        }
    };

    initializeButtons();
});