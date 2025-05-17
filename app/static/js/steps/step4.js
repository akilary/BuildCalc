/** Инициализация управления дверями и окнами */
export function initOpeningsManager() {
    let doorCounter = 1;
    let windowCounter = 1;

    let currentDoorIndex = 0;
    let currentWindowIndex = 0;

    const doorsListContainer = document.getElementById("doors-list");
    const windowsListContainer = document.getElementById("windows-list");

    const addDoorButton = document.getElementById("add-door");
    const addWindowButton = document.getElementById("add-window");

    const prevDoorButton = document.querySelector('[data-action="prev-door"]');
    const nextDoorButton = document.querySelector('[data-action="next-door"]');

    const prevWindowButton = document.querySelector('[data-action="prev-window"]');
    const nextWindowButton = document.querySelector('[data-action="next-window"]');

    const doorPaginationCurrent = prevDoorButton?.closest('.calc__openings-pagination')?.querySelector('.calc__openings-pagination-current');
    const doorPaginationTotal = prevDoorButton?.closest('.calc__openings-pagination')?.querySelector('.calc__openings-pagination-total');

    const windowPaginationCurrent = prevWindowButton?.closest('.calc__openings-pagination')?.querySelector('.calc__openings-pagination-current');
    const windowPaginationTotal = prevWindowButton?.closest('.calc__openings-pagination')?.querySelector('.calc__openings-pagination-total');

    function createDoor() {
        doorCounter++;
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

        doorsListContainer.appendChild(doorElement);

        const removeButton = doorElement.querySelector("[data-action='remove-opening']");
        removeButton.addEventListener("click", (e) => {
            const targetId = e.currentTarget.closest(".calc__opening-item").dataset.openingId;
            removeOpening(targetId);
        });

        updateOpeningsCount("door");
        updateDoorPagination();

        showDoorByIndex(doorsListContainer.children.length - 1);

        return doorElement;
    }

    function createWindow() {
        windowCounter++;
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

        windowsListContainer.appendChild(windowElement);

        const removeButton = windowElement.querySelector('[data-action="remove-opening"]');
        removeButton.addEventListener("click", (e) => {
            const targetId = e.currentTarget.closest(".calc__opening-item").dataset.openingId;
            removeOpening(targetId);
        });

        updateOpeningsCount("window");
        updateWindowPagination();

        showWindowByIndex(windowsListContainer.children.length - 1);

        return windowElement;
    }

    function removeOpening(openingId) {
        if (!confirm("Вы действительно хотите удалить этот элемент?")) return;

        const openingElement = document.querySelector(`[data-opening-id="${openingId}"]`);
        if (!openingElement) return;

        const isDoor = openingId.startsWith("door");
        const container = isDoor ? doorsListContainer : windowsListContainer;

        if (container.children.length <= 1) {
            alert(`Должен быть хотя бы один элемент типа "${isDoor ? "Дверь" : "Окно"}"!`);
            return;
        }

        const elementIndex = Array.from(container.children).indexOf(openingElement);

        openingElement.style.opacity = "0";
        openingElement.style.transform = "translateY(-10px)";

        setTimeout(() => {
            openingElement.remove();
            updateOpeningsCount(isDoor ? "door" : "window");

            if (isDoor) {
                updateDoorPagination();
                if (elementIndex === currentDoorIndex) {
                    const newIndex = Math.min(elementIndex, container.children.length - 1);
                    showDoorByIndex(newIndex);
                } else if (elementIndex < currentDoorIndex) {
                    showDoorByIndex(currentDoorIndex - 1);
                }
            } else {
                updateWindowPagination();
                if (elementIndex === currentWindowIndex) {
                    const newIndex = Math.min(elementIndex, container.children.length - 1);
                    showWindowByIndex(newIndex);
                } else if (elementIndex < currentWindowIndex) {
                    showWindowByIndex(currentWindowIndex - 1);
                }
            }
        }, 300);
    }

    function updateOpeningsCount(type) {
        const container = type === "door" ? doorsListContainer : windowsListContainer;
        const count = container.children.length;
        console.log(`Количество ${type === "door" ? "дверей" : "окон"}: ${count}`);
    }

    function updateDoorPagination() {
        if (!doorPaginationCurrent || !doorPaginationTotal || !prevDoorButton || !nextDoorButton) return;

        const totalDoors = doorsListContainer.children.length;
        doorPaginationTotal.textContent = totalDoors;
        doorPaginationCurrent.textContent = currentDoorIndex + 1;

        prevDoorButton.disabled = currentDoorIndex === 0;
        nextDoorButton.disabled = currentDoorIndex === totalDoors - 1;
    }

    function showDoorByIndex(index) {
        const doors = Array.from(doorsListContainer.children);
        if (index < 0 || index >= doors.length) return;

        doors.forEach((door, i) => {
            if (i === index) {
                door.style.display = "block";
                door.style.animation = "fadeIn 0.3s ease-out";
            } else {
                door.style.display = "none";
            }
        });

        currentDoorIndex = index;
        updateDoorPagination();
    }

    function updateWindowPagination() {
        if (!windowPaginationCurrent || !windowPaginationTotal || !prevWindowButton || !nextWindowButton) return;

        const totalWindows = windowsListContainer.children.length;
        windowPaginationTotal.textContent = totalWindows;
        windowPaginationCurrent.textContent = currentWindowIndex + 1;

        prevWindowButton.disabled = currentWindowIndex === 0;
        nextWindowButton.disabled = currentWindowIndex === totalWindows - 1;
    }

    function showWindowByIndex(index) {
        const windows = Array.from(windowsListContainer.children);
        if (index < 0 || index >= windows.length) return;

        windows.forEach((window, i) => {
            if (i === index) {
                window.style.display = "block";
                window.style.animation = "fadeIn 0.3s ease-out";
            } else {
                window.style.display = "none";
            }
        });

        currentWindowIndex = index;
        updateWindowPagination();
    }

    function initExistingOpenings() {
        const removeButtons = document.querySelectorAll('[data-action="remove-opening"]');
        removeButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const targetId = e.currentTarget.closest(".calc__opening-item").dataset.openingId;
                removeOpening(targetId);
            });
        });

        updateOpeningsCount("door");
        updateOpeningsCount("window");

        updateDoorPagination();
        updateWindowPagination();

        showDoorByIndex(0);
        showWindowByIndex(0);
    }

    if (addDoorButton) {
        addDoorButton.addEventListener("click", createDoor);
    }

    if (addWindowButton) {
        addWindowButton.addEventListener("click", createWindow);
    }

    if (prevDoorButton) {
        prevDoorButton.addEventListener("click", () => {
            if (currentDoorIndex > 0) {
                showDoorByIndex(currentDoorIndex - 1);
            }
        });
    }

    if (nextDoorButton) {
        nextDoorButton.addEventListener("click", () => {
            if (currentDoorIndex < doorsListContainer.children.length - 1) {
                showDoorByIndex(currentDoorIndex + 1);
            }
        });
    }

    if (prevWindowButton) {
        prevWindowButton.addEventListener("click", () => {
            if (currentWindowIndex > 0) {
                showWindowByIndex(currentWindowIndex - 1);
            }
        });
    }

    if (nextWindowButton) {
        nextWindowButton.addEventListener("click", () => {
            if (currentWindowIndex < windowsListContainer.children.length - 1) {
                showWindowByIndex(currentWindowIndex + 1);
            }
        });
    }

    initExistingOpenings();
}
