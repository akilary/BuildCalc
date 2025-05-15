function initFoundationSelector() {
    const foundationTypeInputs = document.querySelectorAll("input[name='foundation-type']");
    const foundationSlabSection = document.querySelector(".calc__foundation-type--slab");
    const foundationStripSection = document.querySelector(".calc__foundation-type--strip");
    const concreteGroup = document.querySelector(".calc__concrete-group");
    const materialSelect = document.getElementById("concrete-select")

    const showFoundationSection = (foundationType) => {
        switch (foundationType) {
            case "slab":
                foundationSlabSection.classList.add("calc__foundation-type--slab-active");
                foundationStripSection.classList.remove("calc__foundation-type--strip-active");
                concreteGroup.classList.add("calc__concrete-group--active");
                break;
            case "strip":
                foundationStripSection.classList.add("calc__foundation-type--strip-active");
                foundationSlabSection.classList.remove("calc__foundation-type--slab-active");
                concreteGroup.classList.add("calc__concrete-group--active");
                break;
            default:
                foundationSlabSection.classList.remove("calc__foundation-type--slab-active");
                foundationStripSection.classList.remove("calc__foundation-type--strip-active");
                concreteGroup.classList.remove("calc__concrete-group--active");
                break;
        }
    };

    foundationTypeInputs.forEach(input => {
        input.addEventListener("change", () => {
            if (input.checked) {
                showFoundationSection(input.value);
            }
        });
    });

    const checkedFoundationType = document.querySelector("input[name='foundation-type']:checked");
    if (checkedFoundationType) {
        showFoundationSection(checkedFoundationType.value);
    }

    const stripTypeInputs = document.querySelectorAll("input[name='strip-type']");
    stripTypeInputs.forEach(input => {
        input.addEventListener("change", () => {
            console.log(`Выбран тип ленточного фундамента: ${input.value}`);

            const tShapedFields = document.querySelectorAll("[data-strip-type='t-shaped']");
            if (tShapedFields) {
                tShapedFields.forEach(field => {
                    if (input.value === "t-shaped") {
                        field.style.display = "flex";
                    } else {
                        field.style.display = "none";
                    }
                });
            }
        });
    });

    const checkedStripType = document.querySelector("input[name='strip-type']:checked");
    if (checkedStripType) {
        const tShapedFields = document.querySelectorAll("[data-strip-type='t-shaped']");
        if (tShapedFields) {
            tShapedFields.forEach(field => {
                if (checkedStripType.value === "t-shaped") {
                    field.style.display = "flex";
                } else {
                    field.style.display = "none";
                }
            });
        }
    } else {
        const tShapedFields = document.querySelectorAll('[data-strip-type="t-shaped"]');
        if (tShapedFields) {
            tShapedFields.forEach(field => {
                field.style.display = 'none';
            });
        }
    }
}

function init() {
    initFoundationVisualization();
    initFoundationSelector();
}

document.addEventListener("DOMContentLoaded", init);