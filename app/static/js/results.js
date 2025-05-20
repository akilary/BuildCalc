document.addEventListener('DOMContentLoaded', function() {
    // Register Chart.js Data Labels plugin
    Chart.register(ChartDataLabels);

    const resultsChartCanvas = document.getElementById('results-chart');
    const areaChartCanvas = document.getElementById('area-chart');

    if (!resultsChartCanvas || !areaChartCanvas) return;

    // Common chart options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                color: '#fff',
                font: {
                    weight: 'bold',
                    size: 12
                },
                formatter: (value, ctx) => {
                    return value.toLocaleString('ru-RU') + ' ₸';
                }
            }
        }
    };

    const chartColors = {
        walls: '#4CAF50',
        windows: '#2196F3',
        doors: '#FF9800',
        building: '#3A2E39',
        openings: '#F15152',
        wallsArea: '#1E555C'
    };

    // Extract data from the page
    const extractDataFromPage = () => {
        // This is a placeholder - in a real implementation, you'd extract this data from the DOM
        // or it would be passed from the backend via a script tag with JSON data

        // For demonstration purposes, using sample data
        return {
            costs: {
                walls: 1500000,
                windows: 350000,
                doors: 150000
            },
            areas: {
                buildingArea: 150,
                openingsArea: 25,
                netWallsArea: 125
            }
        };
    };

    const data = extractDataFromPage();

    // Create the cost distribution bar chart
    if (resultsChartCanvas) {
        const costCtx = resultsChartCanvas.getContext('2d');
        new Chart(costCtx, {
            type: 'bar',
            data: {
                labels: ['Стены', 'Окна', 'Двери'],
                datasets: [{
                    label: 'Стоимость (₸)',
                    data: [data.costs.walls, data.costs.windows, data.costs.doors],
                    backgroundColor: [
                        chartColors.walls,
                        chartColors.windows,
                        chartColors.doors
                    ],
                    borderColor: [
                        chartColors.walls,
                        chartColors.windows,
                        chartColors.doors
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                ...commonOptions,
                plugins: {
                    ...commonOptions.plugins,
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Распределение затрат',
                        font: {
                            size: 16
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

    // Create the area distribution doughnut chart
    if (areaChartCanvas) {
        const areaCtx = areaChartCanvas.getContext('2d');
        new Chart(areaCtx, {
            type: 'doughnut',
            data: {
                labels: ['Площадь здания', 'Площадь проемов', 'Чистая площадь стен'],
                datasets: [{
                    data: [data.areas.buildingArea, data.areas.openingsArea, data.areas.netWallsArea],
                    backgroundColor: [
                        chartColors.building,
                        chartColors.openings,
                        chartColors.wallsArea
                    ],
                    borderColor: [
                        '#ffffff',
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
                        display: false
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
});