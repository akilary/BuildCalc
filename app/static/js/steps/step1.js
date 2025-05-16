export function initRegionMap() {
    const regionPaths = document.querySelectorAll(".calc__map-path--region");
    const regionInputs = document.querySelectorAll(".calc__region-input");

    const selectRegion = (regionId) => {
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
    };

    regionPaths.forEach(path => {
        const regionId = path.getAttribute("data-region-id");

        path.addEventListener("click", () => {
            selectRegion(regionId);
        });

        path.addEventListener("mouseenter", () => {
            path.style.transform = "translateY(-2px)";
        });

        path.addEventListener("mouseleave", () => {
            path.style.transform = "translateY(0)";
        });
    });

    regionInputs.forEach(input => {
        input.addEventListener("change", () => {
            if (input.checked) {
                selectRegion(input.value);
            }
        });
    });

    const checkedInput = document.querySelector(".calc__region-input:checked");
    if (checkedInput) {
        selectRegion(checkedInput.value);
    }
}
