let form1 = document.getElementById("form1");
let form2 = document.getElementById("form2");
let progress = document.querySelector("progress");

const inputWeights = {
    "text": 20,
    "radio": 20,
    "checkbox": 20,
    "select-one": 20,
    "select-two": 20,
};

function calculateProgress() {
    let totalFields = 0;
    let filledFields = 0;

    let form1Inputs = form1.querySelectorAll("input");
    totalFields += form1Inputs.length;
    for (let input of form1Inputs) {
        if (input.type === "radio" || input.type === "checkbox") {
            if (input.checked) {
                filledFields += inputWeights[input.type];
            }
        } else {
            if (input.value.trim() !== "") {
                filledFields += inputWeights[input.type];
            }
        }
    }

    let form2Inputs = form2.querySelectorAll("input, select");
    totalFields += form2Inputs.length;
    for (let input of form2Inputs) {
        if (input.type === "radio" || input.type === "checkbox") {
            if (input.checked) {
                filledFields += inputWeights[input.type];
            }
        } else {
            if (input.value.trim() !== "") {
                filledFields += inputWeights[input.type];
            }
        }
    }

    let dropdownSelectOne = document.querySelector(".dropdown-select-one");
    let selectedOptionText = dropdownSelectOne.textContent.trim();
    if (selectedOptionText !== "Choose issued year of License") {
        filledFields += inputWeights["select-one"];
    }
    let dropdownSelectTwo = document.querySelector(".dropdown-select-two");
    let selectedOptionTextTwo = dropdownSelectTwo.textContent.trim();
    if (selectedOptionTextTwo !== "Choose expired year of License") {
        filledFields += inputWeights["select-two"];
    }

    let progressPercentage = (filledFields / (totalFields * 20)) * 100;
    return progressPercentage;
}


function updateProgressBar() {
    let progressValue = calculateProgress();
    let currentProgress = progress.value;
    let duration = 500; // 1 second animation duration

    // Calculate the increment value for each animation frame
    let increment = (progressValue - currentProgress) / (duration / 16); // 16ms per frame for 60fps

    // Define an animation function
    function animate() {
        currentProgress += increment;

        // Update the progress bar value
        progress.value = currentProgress;

        // Check if animation is complete
        if ((increment > 0 && currentProgress < progressValue) || (increment < 0 && currentProgress > progressValue)) {
            // Continue the animation
            requestAnimationFrame(animate);
        } else {
            // Ensure the progress bar reaches its exact value
            progress.value = progressValue;

            // Check if moveToForm2 should be called
            if (progressValue >= 50) {
                moveToForm2();
            }
        }
    }

    // Start the animation
    animate();
}


function moveToForm2() {
    if (checkForm1Filled()) {
        form1.style.display = "none";
        form2.style.display = "block";
        updateProgressBar();
    } else {
        console.log("Please fill in all fields in Form 1 before proceeding.");
    }
}

form1.querySelectorAll("input, select").forEach(input => {
    input.addEventListener("input", updateProgressBar);
});

form2.querySelectorAll("input, select").forEach(input => {
    input.addEventListener("input", updateProgressBar);
});

document.getElementById("back").addEventListener("click", function () {
    form1.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    form1.style.display = "block";
    form2.style.display = "none";
    progress.value = 0;
    updateProgressBar();
});

function checkForm1Filled() {
    let inputs = form1.querySelectorAll("input, select");
    for (let input of inputs) {
        if (input.type === "radio" || input.type === "checkbox") {
            if (!form1.querySelector(`input[name="${input.name}"]:checked`)) {
                return false;
            }
        } else {
            if (!input.validity.valid) {
                return false;
            }
        }
    }
    let nameInput = form1.querySelector('input[name="name"]');
    if (nameInput && nameInput.value.trim() === "") {
        return false;
    }
    return true;
}

function toggleDropdownOne() {
    var options = document.getElementById("options-one");
    toggleDropdown(options, "select-one");
}

function toggleDropdownTwo() {
    var options = document.getElementById("options-two");
    toggleDropdown(options, "select-two");
}

function toggleDropdown(options) {
    if (options) {
        if (options.style.display === "block") {
            options.style.display = "none";
            let caretIcon = document.querySelector(".caret-icon i");
            if (caretIcon) {
                caretIcon.classList.remove("fa-caret-up");
                caretIcon.classList.add("fa-caret-down");
            }
        } else {
            options.style.display = "block";
            let caretIcon = document.querySelector(".caret-icon i");
            if (caretIcon) {
                caretIcon.classList.remove("fa-caret-down");
                caretIcon.classList.add("fa-caret-up");
            }
        }
    } else {
        console.error("Dropdown options element not found.");
    }
}

function selectOption(option) {
    var selectBox = document.querySelector(".dropdown-select-one");
    selectBox.textContent = option;
    toggleDropdownOne();
    updateProgressBar();
}

function selectOptionTwo(option) {
    var selectBox = document.querySelector(".dropdown-select-two");
    selectBox.textContent = option;
    toggleDropdownTwo();
    updateProgressBar();
}
function updateProgressWithValue(option, inputKey) {
    let progressValue = calculateProgress();
    let optionWeight = inputWeights[inputKey];
    if (optionWeight !== undefined) {
        let prevProgress = progressValue - optionWeight;
        progressValue = prevProgress + optionWeight;
        progress.value = progressValue;
    } else {
        console.error("Weight for input key not found:", inputKey);
    }
}