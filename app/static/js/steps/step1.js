/** Инициализирует карту регионов */
export function initRegionMap() {
    const regionPaths = document.querySelectorAll(".calc__map-path--region");
    const regionInputs = document.querySelectorAll(".calc__region-input");
    if (!regionPaths.length || !regionInputs.length) return;

    regionPaths.forEach(path => {
        const regionId = path.getAttribute("data-region-id");
        if (!regionId) return;

        path.addEventListener("click", () => {
            _selectRegion(regionPaths, regionInputs, regionId);
        });
    });

    regionInputs.forEach(input => {
        input.addEventListener("change", () => {
            if (input.checked) {
                _selectRegion(regionPaths, regionInputs, input.value);
            }
        });
    });

    const checkedInput = document.querySelector(".calc__region-input:checked");
    if (checkedInput) {
        _selectRegion(regionPaths, regionInputs, checkedInput.value);
    }
}

/** Выбирает регион на карте */
function _selectRegion(regionPaths, regionInputs, regionId) {
    regionPaths.forEach(path => {
        path.classList.remove("calc__map-path--selected");
    });

    regionInputs.forEach(input => {
        input.checked = input.value === regionId;

        const label = input.closest(".calc__region-label");
        if (label) {
            if (input.checked) {
                label.classList.add("calc__region-label--selected");
            } else {
                label.classList.remove("calc__region-label--selected");
            }
        }
    });

    const selectedPath = document.querySelector(`.calc__map-path--region[data-region-id="${regionId}"]`);
    if (selectedPath) {
        selectedPath.classList.add("calc__map-path--selected");
    }
}
