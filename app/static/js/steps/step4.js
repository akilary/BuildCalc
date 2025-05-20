/** Инициализация управления дверями и окнами */
export function initOpeningsManager() {
    const doorsListContainer = document.getElementById("doors-list");
    const windowsListContainer = document.getElementById("windows-list");
    const addDoorButton = document.getElementById("add-door");
    const addWindowButton = document.getElementById("add-window");
    const prevDoorButton = document.querySelector("[data-action='prev-door']");
    const nextDoorButton = document.querySelector("[data-action='next-door']");
    const prevWindowButton = document.querySelector("[data-action='prev-window']");
    const nextWindowButton = document.querySelector("[data-action='next-window']");

    const doorPaginationCurrent =
        prevDoorButton?.closest(".calc__openings-pagination")?.querySelector(".calc__openings-pagination-current");
    const doorPaginationTotal =
        prevDoorButton?.closest(".calc__openings-pagination")?.querySelector(".calc__openings-pagination-total");
    const windowPaginationCurrent =
        prevWindowButton?.closest(".calc__openings-pagination")?.querySelector(".calc__openings-pagination-current");
    const windowPaginationTotal =
        prevWindowButton?.closest(".calc__openings-pagination")?.querySelector(".calc__openings-pagination-total");

    let currentDoorIndex = 0;
    let currentWindowIndex = 0;

    const handleRemoveOpening = (targetId) => {
        _removeOpening(targetId, doorsListContainer, windowsListContainer, currentDoorIndex, currentWindowIndex,
            (newDoorIndex) => {
                currentDoorIndex = newDoorIndex;
                updateDoorView();
            },
            (newWindowIndex) => {
                currentWindowIndex = newWindowIndex;
                updateWindowView();
            }
        );
    };

    const updateDoorView = () => {
        _showDoorByIndex(doorsListContainer, currentDoorIndex, () => {
            _updateDoorPagination(
                doorsListContainer, doorPaginationCurrent, doorPaginationTotal, prevDoorButton, nextDoorButton,
                currentDoorIndex
            );
        });
    };

    const updateWindowView = () => {
        _showWindowByIndex(windowsListContainer, currentWindowIndex, () => {
            _updateWindowPagination(
                windowsListContainer, windowPaginationCurrent, windowPaginationTotal, prevWindowButton,
                nextWindowButton, currentWindowIndex
            );
        });
    };

    if (addDoorButton) {
        addDoorButton.addEventListener("click", () => {
            const newDoorNumber = doorsListContainer.children.length + 1;
            _createDoor(doorsListContainer, newDoorNumber, handleRemoveOpening);

            currentDoorIndex = doorsListContainer.children.length - 1;
            updateDoorView();
        });
    }

    if (prevDoorButton) {
        prevDoorButton.addEventListener("click", () => {
            if (currentDoorIndex > 0) {
                currentDoorIndex--;
                updateDoorView();
            }
        });
    }

    if (nextDoorButton) {
        nextDoorButton.addEventListener("click", () => {
            if (currentDoorIndex < doorsListContainer.children.length - 1) {
                currentDoorIndex++;
                updateDoorView();
            }
        });
    }

    if (addWindowButton) {
        addWindowButton.addEventListener("click", () => {
            const newWindowNumber = windowsListContainer.children.length + 1;
            _createWindow(windowsListContainer, newWindowNumber, handleRemoveOpening);

            currentWindowIndex = windowsListContainer.children.length - 1;
            updateWindowView();
        });
    }

    if (prevWindowButton) {
        prevWindowButton.addEventListener("click", () => {
            if (currentWindowIndex > 0) {
                currentWindowIndex--;
                updateWindowView();
            }
        });
    }

    if (nextWindowButton) {
        nextWindowButton.addEventListener("click", () => {
            if (currentWindowIndex < windowsListContainer.children.length - 1) {
                currentWindowIndex++;
                updateWindowView();
            }
        });
    }

    _initExistingOpenings(
        doorsListContainer, windowsListContainer, doorPaginationCurrent, doorPaginationTotal, windowPaginationCurrent,
        windowPaginationTotal, prevDoorButton, nextDoorButton, prevWindowButton, nextWindowButton,
        handleRemoveOpening, () => {
            currentDoorIndex = 0; currentWindowIndex = 0; updateDoorView(); updateWindowView();
        }
    );
}

/** Создание элемента двери */
function _createDoor(doorsListContainer, doorCounter, removeCallback) {
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
            <div class="calc__opening-dimension">
                <label for="${doorId}-unit-price" class="calc__opening-label">
                    <span class="calc__input-text">
                        <span class="material-icons calc__opening-icon" aria-hidden="true">sell</span>
                        Цена за ед. (₸):
                    </span>
                </label>
                <input type="number" id="${doorId}-unit-price" class="calc__opening-input" min="0.3" max="2.5" step="0.1" value="15000" required>
            </div>
        </div>
    `;

    const removeButton = doorElement.querySelector("[data-action='remove-opening']");
    if (removeButton && removeCallback) {
        removeButton.addEventListener("click", () => {
            removeCallback(doorId);
        });
    }

    doorsListContainer.appendChild(doorElement);
    return doorElement;
}

/** Создание элемента окна */
function _createWindow(windowsListContainer, windowCounter, removeCallback) {
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
            <div class="calc__opening-dimension">
                <label for="${windowId}-unit-price" class="calc__opening-label">
                    <span class="calc__input-text">
                        <span class="material-icons calc__opening-icon" aria-hidden="true">sell</span>
                        Цена за ед. (₸):
                    </span>
                </label>
                <input type="number" id="${windowId}-unit-price" class="calc__opening-input" min="0.3" max="2.5" step="0.1" value="10000" required>
            </div>
        </div>
    `;

    const removeButton = windowElement.querySelector("[data-action='remove-opening']");
    if (removeButton && removeCallback) {
        removeButton.addEventListener("click", () => {
            removeCallback(windowId);
        });
    }

    windowsListContainer.appendChild(windowElement);
    return windowElement;
}

/** Удаление элемента (двери или окна) */
function _removeOpening(
    openingId, doorsListContainer, windowsListContainer, currentDoorIndex, currentWindowIndex,
    doorIndexCallback, windowIndexCallback
) {
    if (!confirm("Вы действительно хотите удалить этот элемент?")) return;

    const openingElement = document.querySelector(`[data-opening-id="${openingId}"]`);
    if (!openingElement) return;

    const isDoor = openingId.startsWith("door-");
    const currentIndex = isDoor ? currentDoorIndex : currentWindowIndex;

    openingElement.remove();

    if (isDoor) {
        _renumberDoors(doorsListContainer);
        const newIndex = Math.min(currentIndex, doorsListContainer.children.length - 1);
        doorIndexCallback(Math.max(0, newIndex));
    } else {
        _renumberWindows(windowsListContainer);
        const newIndex = Math.min(currentIndex, windowsListContainer.children.length - 1);
        windowIndexCallback(Math.max(0, newIndex));
    }
}

/** Обновление пагинации дверей */
function _updateDoorPagination(
    doorsListContainer, doorPaginationCurrent, doorPaginationTotal, prevDoorButton, nextDoorButton, currentDoorIndex
) {
    const totalDoors = doorsListContainer.children.length;

    if (doorPaginationCurrent) doorPaginationCurrent.textContent = totalDoors > 0 ? currentDoorIndex + 1 : 0;
    if (doorPaginationTotal) doorPaginationTotal.textContent = totalDoors;

    if (prevDoorButton) prevDoorButton.disabled = currentDoorIndex <= 0;
    if (nextDoorButton) nextDoorButton.disabled = currentDoorIndex >= totalDoors - 1;
}

/** Отображение двери по индексу */
function _showDoorByIndex(doorsListContainer, index, updateCallback) {
    const doors = Array.from(doorsListContainer.children);

    if (doors.length === 0) {
        if (updateCallback) updateCallback();
        return;
    }

    doors.forEach((door, i) => {
        if (i === index) {
            door.removeAttribute("hidden");
            door.setAttribute("aria-hidden", "false");
        } else {
            door.setAttribute("hidden", "");
            door.setAttribute("aria-hidden", "true");
        }
    });

    if (updateCallback) updateCallback();
}

/** Обновление пагинации окон */
function _updateWindowPagination(
    windowsListContainer, windowPaginationCurrent, windowPaginationTotal, prevWindowButton, nextWindowButton,
    currentWindowIndex
) {
    const totalWindows = windowsListContainer.children.length;

    if (windowPaginationCurrent) windowPaginationCurrent.textContent = totalWindows > 0 ? currentWindowIndex + 1 : 0;
    if (windowPaginationTotal) windowPaginationTotal.textContent = totalWindows;

    if (prevWindowButton) prevWindowButton.disabled = currentWindowIndex <= 0;
    if (nextWindowButton) nextWindowButton.disabled = currentWindowIndex >= totalWindows - 1;
}

/** Отображение окна по индексу */
function _showWindowByIndex(windowsListContainer, index, updateCallback) {
    const windows = Array.from(windowsListContainer.children);

    if (windows.length === 0) {
        if (updateCallback) updateCallback();
        return;
    }

    windows.forEach((window, i) => {
        if (i === index) {
            window.removeAttribute("hidden");
            window.setAttribute("aria-hidden", "false");
        } else {
            window.setAttribute("hidden", "");
            window.setAttribute("aria-hidden", "true");
        }
    });

    if (updateCallback) updateCallback();
}

/** Инициализация существующих элементов */
function _initExistingOpenings(
    doorsListContainer, windowsListContainer, doorPaginationCurrent, doorPaginationTotal, windowPaginationCurrent,
    windowPaginationTotal, prevDoorButton, nextDoorButton, prevWindowButton, nextWindowButton, removeCallback,
    initCallback
) {
    const existingDoors = doorsListContainer.querySelectorAll(".calc__opening-item");
    const existingWindows = windowsListContainer.querySelectorAll(".calc__opening-item");

    existingDoors.forEach(door => {
        const removeButton = door.querySelector("[data-action='remove-opening']");
        const doorId = door.dataset.openingId;

        if (removeButton && doorId) {
            removeButton.addEventListener("click", () => {
                removeCallback(doorId);
            });
        }
    });

    existingWindows.forEach(window => {
        const removeButton = window.querySelector("[data-action='remove-opening']");
        const windowId = window.dataset.openingId;

        if (removeButton && windowId) {
            removeButton.addEventListener("click", () => {
                removeCallback(windowId);
            });
        }
    });

    if (initCallback) initCallback();
}

/** Перенумерование дверей */
function _renumberDoors(doorsListContainer) {
    const doors = Array.from(doorsListContainer.children);

    doors.forEach((door, index) => {
        const doorNumber = index + 1;
        const doorId = `door-${doorNumber}`;

        door.dataset.id = doorId;
        door.dataset.openingId = doorId;

        const doorName = door.querySelector(".calc__opening-name");
        if (doorName) doorName.textContent = `Дверь ${doorNumber}`;

        const removeButton = door.querySelector("[data-action='remove-opening']");
        if (removeButton) removeButton.setAttribute("aria-label", `Удалить дверь ${doorNumber}`);

        const inputs = door.querySelectorAll("input");
        const labels = door.querySelectorAll("label");

        const fieldTypes = ["quantity", "width", "height"];
        fieldTypes.forEach((type, typeIndex) => {
            const input = inputs[typeIndex];
            const label = labels[typeIndex];

            if (input) {
                const newId = `${doorId}-${type}`;
                input.id = newId;

                if (label) {
                    label.setAttribute("for", newId);
                }
            }
        });
    });
}

/** Перенумерация окон */
function _renumberWindows(windowsListContainer) {
    const windows = Array.from(windowsListContainer.children);

    windows.forEach((window, index) => {
        const windowNumber = index + 1;
        const windowId = `window-${windowNumber}`;

        window.dataset.id = windowId;
        window.dataset.openingId = windowId;

        const windowName = window.querySelector(".calc__opening-name");
        if (windowName) windowName.textContent = `Окно ${windowNumber}`;

        const removeButton = window.querySelector("[data-action='remove-opening']");
        if (removeButton) removeButton.setAttribute("aria-label", `Удалить окно ${windowNumber}`);

        const inputs = window.querySelectorAll("input");
        const labels = window.querySelectorAll("label");

        const fieldTypes = ["quantity", "width", "height"];
        fieldTypes.forEach((type, typeIndex) => {
            const input = inputs[typeIndex];
            const label = labels[typeIndex];

            if (input) {
                const newId = `${windowId}-${type}`;
                input.id = newId;

                if (label) {
                    label.setAttribute("for", newId);
                }
            }
        });
    });
}
