const wheel = document.getElementById("wheel"),
    spinBtn = document.getElementById("spin-btn"),
    finalValue = document.getElementById("final-value");
    sliceInput = document.getElementById("slice-count"),
    applyBtn = document.getElementById("apply-settings"),
    modal = document.getElementById("settings-modal");

let myChart;
let rotationValues = [];

// Function to generate wheel data
const createWheel = (count) => {
    let labels = [];
    let data = [];
    let pieColors = [];
    rotationValues = [];
    const sliceAngle = 360 / count;

    for (let i = 1; i <= count; i++) {
        labels.push(i);
        data.push(16);
        
        // Color Alternating (hex codes corresponding to CSS variables)
        pieColors.push(i % 2 === 0 ? "#1565c0" : "#2196f3");

        // Dynamic degree-value assignment
        // Chart.js defaults to starting at the top (or 0 degrees)
        rotationValues.push({
            minDegree: (i - 1) * sliceAngle,
            maxDegree: i * sliceAngle,
            value: i
        });
    }

    // If the chart already exists, delete it before creating a new one.
    if (myChart) {
        myChart.destroy();
    }

    // We use pie chart for wheel, so let's create it
    myChart = new Chart(wheel, {
        plugins: [ChartDataLabels],
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: pieColors,
                data: data,
            }],
        },
        options: {
            responsive: true,
            animation: { duration: 0 },
            plugins: {
                tooltip: false,
                legend: { display: false },
                datalabels: {
                    color: "#fff",
                    formatter: (_, context) => context.chart.data.labels[context.dataIndex],
                    font: { size: count > 40 ? 10 : 22, weight: 'bold' },
                    anchor: 'end',
                    align: 'start',
                    offset: 40,
                },
            },
        },
    });
};

// Refined Value Generation
const valueGenerator = (angleValue) => {
    let netRotation = angleValue % 360;
    let targetAngle = (90 - netRotation + 360) % 360;
    for (let i of rotationValues) {
        if (targetAngle >= i.minDegree && targetAngle < i.maxDegree) {
            finalValue.innerHTML = `<p>Value: ${i.value}</p>`;
            spinBtn.disabled = false;
            break;
        }
    }
};

// Button event handler for setting
applyBtn.onclick = () => {
    const val = parseInt(sliceInput.value);
    if (val >= 2 && val <= 100) {
        createWheel(val);
        modal.style.display = "none";
        finalValue.innerHTML = `<p>Ready to spin!</p>`;
    } else {
        alert("Choose between 2 and 100!");
    }
};

// Spinner Count
let count = 0;

// 100 rotation for animation and last rotation for result
let resultValue = 101;

// Start spinning
spinBtn.addEventListener("click", () => {
    spinBtn.disabled = true;
    finalValue.innerHTML = `<p>Good Luck!</p>`;

    // Generate random degree to stop at
    let randomDegree = Math.floor(Math.random() * 360);
    
    // Interval for rotation animation
    let rotationInterval = window.setInterval(() => {
        myChart.options.rotation = (myChart.options.rotation + resultValue) % 360;
        myChart.update();
        
        // if rotation > 360 reset it back to 0
        if (myChart.options.rotation >= 355 || myChart.options.rotation <= 5) {
            count += 1;
            if (resultValue > 5) resultValue -= 2;
        } 
        
        if (count > 15 && Math.abs(myChart.options.rotation - randomDegree) < 5) {
            myChart.options.rotation = randomDegree; 
            myChart.update();
            valueGenerator(randomDegree);
            clearInterval(rotationInterval);
            count = 0;
            resultValue = 101;
        }
    }, 10);
});

// Reset btn reference
const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", () => {
    location.reload();
});

createWheel(6);