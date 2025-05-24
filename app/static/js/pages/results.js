/** Инициализация страницы результатов */
document.addEventListener("DOMContentLoaded", () => {
    if (typeof Chart === "undefined" || typeof ChartDataLabels === "undefined") {
        console.error("Chart.js или ChartDataLabels не загружены");
        return;
    }

    Chart.register(ChartDataLabels);

    const resultsData = _extractDataFromPage();
    if (!resultsData) return;

    _initCharts(resultsData);
    _fillResultsData(resultsData);
    _initButtons(resultsData);
});

/** Извлечение данных результатов из страницы */
function _extractDataFromPage() {
    try {
        const resultsDataElement = document.getElementById("results-data");
        if (!resultsDataElement) {
            console.error("Элемент с данными результатов не найден");
            return null;
        }

        console.log(typeof JSON.parse(resultsDataElement.textContent));

        return JSON.parse(resultsDataElement.textContent);
    } catch (error) {
        console.error("Ошибка при извлечении данных:", error);
        return null;
    }
}

/** Инициализация графиков */
function _initCharts(data) {
    const chartColors = {
        walls: "rgba(241, 81, 82, 0.7)",
        windows: "rgba(33, 150, 243, 0.7)",
        doors: "rgba(76, 175, 80, 0.7)",
        building: "rgba(255, 152, 0, 0.7)",
        openings: "rgba(156, 39, 176, 0.7)",
        wallsArea: "rgba(3, 169, 244, 0.7)"
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                color: "#fff",
                font: {
                    weight: "bold",
                    size: 12
                },
                textShadow: "0px 0px 2px rgba(0, 0, 0, 0.5)",
                textStrokeWidth: 1,
                textStrokeColor: "rgba(0, 0, 0, 0.5)"
            }
        }
    };

    _initCostChart(data, chartColors, commonOptions);
    _initAreaChart(data, chartColors, commonOptions);
}

/** Инициализация графика распределения затрат */
function _initCostChart(data, chartColors, commonOptions) {
    const resultsChartCanvas = document.getElementById("results-chart");
    if (!resultsChartCanvas) return;

    const costCtx = resultsChartCanvas.getContext("2d");

    const wallsCost = data["cost"]["materials"] || 0;
    const doorsCost = data["openings_cost"] ? data["openings_cost"]["doors"] || 0 : 0;
    const windowsCost = data["openings_cost"] ? data["openings_cost"]["windows"] || 0 : 0;

    const totalCost = wallsCost + doorsCost + windowsCost;

    new Chart(costCtx, {
        type: "bar",
        data: {
            labels: ["Материалы стен", "Двери", "Окна"],
            datasets: [{
                label: "Стоимость (₸)",
                data: [wallsCost, doorsCost, windowsCost],
                backgroundColor: [
                    chartColors.walls,
                    chartColors.doors,
                    chartColors.windows
                ],
                borderColor: [
                    "rgba(241, 81, 82, 1)",
                    "rgba(76, 175, 80, 1)",
                    "rgba(33, 150, 243, 1)"
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
                        if (totalCost > 0) {
                            const percent = Math.round((value / totalCost) * 100);
                            return value.toLocaleString("ru-RU") + " ₸\n(" + percent + "%)";
                        }
                        return value.toLocaleString("ru-RU") + " ₸";
                    },
                    display: function (context) {
                        return context.dataset.data[context.dataIndex] > 0;
                    }
                },
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Затраты на строительство",
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || "";
                            if (label) {
                                label += ": ";
                            }
                            label += context.parsed.y.toLocaleString("ru-RU") + " ₸";

                            if (totalCost > 0) {
                                const percent = Math.round((context.parsed.y / totalCost) * 100);
                                label += " (" + percent + "% от общей стоимости)";
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
                        callback: function (value) {
                            return value.toLocaleString("ru-RU") + " ₸";
                        }
                    }
                }
            }
        }
    });
}

/** Инициализация графика распределения площади */
function _initAreaChart(data, chartColors, commonOptions) {
    const areaChartCanvas = document.getElementById("area-chart");
    if (!areaChartCanvas) return;

    const areaCtx = areaChartCanvas.getContext("2d");

    const buildingArea = data["building"]["area"] || 0;
    const openingsArea = data["openings"]["openings_area"] || 0;
    const netWallsArea = data["walls"]["net_area"] || 0;

    const totalDisplayArea = buildingArea + openingsArea + netWallsArea;

    new Chart(areaCtx, {
        type: "doughnut",
        data: {
            datasets: [{
                data: [buildingArea, openingsArea, netWallsArea],
                backgroundColor: [
                    chartColors.building,
                    chartColors.openings,
                    chartColors.wallsArea
                ],
                borderColor: [
                    "#ffffff",
                    "#ffffff",
                    "#ffffff"
                ],
                borderWidth: 2
            }]
        },
        options: {
            ...commonOptions,
            cutout: "60%",
            plugins: {
                ...commonOptions.plugins,
                datalabels: {
                    formatter: (value, ctx) => {
                        if (totalDisplayArea > 0) {
                            const percent = Math.round((value / totalDisplayArea) * 100);
                            return value + " м²\n(" + percent + "%)";
                        }
                        return value + " м²";
                    },
                    display: function (context) {
                        return context.dataset.data[context.dataIndex] > 0;
                    }
                },
                legend: {
                    position: "bottom",
                    labels: {
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: "Распределение площади",
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.raw;
                            let label = context.label || "";
                            if (label) {
                                label += ": ";
                            }
                            label += value + " м²";

                            if (totalDisplayArea > 0) {
                                const percent = Math.round((value / totalDisplayArea) * 100);
                                label += " (" + percent + "% от общей площади)";
                            }

                            return label;
                        }
                    }
                }
            }
        }
    });
}

/** Заполнение текстовых полей с результатами */
function _fillResultsData(data) {
    const doorsCost = data["openings_cost"] ? data["openings_cost"]["doors"] || 0 : 0;
    const windowsCost = data["openings_cost"] ? data["openings_cost"]["windows"] || 0 : 0;
    const totalCost = (data["cost"]["materials"] || 0) + doorsCost + windowsCost;

    const elements = {
        "building-area": (data["building"]["area"] || 0) + " м²",
        "building-perimeter": (data["building"]["perimeter"] || 0) + " м",

        "walls-total-area": (data["walls"]["total_area"] || 0) + " м²",
        "walls-net-area": (data["walls"]["net_area"] || 0) + " м²",
        "walls-volume": (data["walls"]["volume"] || 0) + " м³",

        "doors-area": (data["openings"]["doors_area"] || 0) + " м²",
        "windows-area": (data["openings"]["windows_area"] || 0) + " м²",
        "openings-area": (data["openings"]["openings_area"] || 0) + " м²",

        "material-blocks": (data["material"]["blocks_count"] || 0) + " шт.",
        "material-pallets": (data["material"]["pallets_count"] || "Не определено"),
        "material-weight": (data["material"]["weight"] || 0) + " т",
        "material-size": data["material"]["size"] || "0 × 0 × 0 мм",

        "cost-materials": (data["cost"]["materials"] || 0).toLocaleString("ru-RU") + " ₸",
        "cost-per-meter": (data["cost"]["per_square_meter"] || 0).toLocaleString("ru-RU") + " ₸/м²",
        "cost-doors": doorsCost.toLocaleString("ru-RU") + " ₸",
        "cost-windows": windowsCost.toLocaleString("ru-RU") + " ₸",
        "cost-total": totalCost.toLocaleString("ru-RU") + " ₸",

        "material-notes": data["material_info"] ? data["material_info"]["notes"] || "Информация отсутствует" : "Информация отсутствует",
        "material-insulation": data["material_info"] ? data["material_info"]["insulation_level"] || "Не указано" : "Не указано",
        "material-moisture": data["material_info"] ? data["material_info"]["moisture_resistance"] || "Не указано" : "Не указано",
        "material-region": data["material_info"] ? data["material_info"]["region_compatibility"] || "Не определено" : "Не определено"
    };

    for (const [id, value] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

/** Инициализация кнопок для печати и сохранения результатов */
function _initButtons(data) {
    _initPrintButton();
    _initSaveButton(data);
    _initBackButton();
}

/** Инициализация кнопки печати */
function _initPrintButton() {
    const printButton = document.getElementById("print-results");
    if (printButton) {
        printButton.addEventListener("click", () => {
            window.print();
        });
    }
}

/** Инициализация кнопки сохранения */
function _initSaveButton(data) {
    const saveButton = document.getElementById("save-results");
    if (saveButton) {
        saveButton.addEventListener("click", () => {
            const doorsCost = data["openings_cost"] ? data["openings_cost"]["doors"] || 0 : 0;
            const windowsCost = data["openings_cost"] ? data["openings_cost"]["windows"] || 0 : 0;
            const totalCost = (data["cost"]["materials"] || 0) + doorsCost + windowsCost;

            const resultsData = {
                timestamp: new Date().toISOString(),
                results: data,
                total_cost: totalCost
            };

            const blob = new Blob([JSON.stringify(resultsData, null, 2)], {type: "application/json"});
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "buildcalc-results-" + new Date().toISOString().slice(0, 10) + ".json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
}

/** Инициализация кнопки возврата */
function _initBackButton() {
    const backButton = document.getElementById("back-to-calc");
    if (backButton) {
        backButton.addEventListener("click", () => {
            window.location.href = backButton.getAttribute("data-url") || "/calc";
        });
    }
}