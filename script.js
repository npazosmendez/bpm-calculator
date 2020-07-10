// BPM Calculator
class BPMCalculator {
    constructor(callback) {
        this.callback = callback;
        this.period = 4;
        this.reset();
    }
    reset() {
        this.count = 0;
        this.last_period = performance.now();
        this.callback(0);
    }
    bpm() {
        return Math.round(60000.0 * this.period / (performance.now() - this.last_period));
    }
    barBeats() {
        return this.count || 4;
    }
    beat() {
        this.count = (this.count+1) % this.period;
        if(this.count == 0) {
            let bpm = this.bpm();
            this.callback(bpm);
            this.last_period = performance.now();
        }
    }
}

// Chart
var chart = new Chart(document.getElementById("line-chart"), {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
          data: [],
          borderColor: "#581845",
          backgroundColor: "rgba(86,24,69,0.7)",
          fill: "origin",
        }
      ]
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        legend : {
            display: false
        },
        tooltips: { mode: 'nearest' },
        scales: {
            yAxes: [{
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 100,
                    fontSize: 25,
                    fontColor: "#581845",
                    fontStyle: "bold",
                }
            }],
            xAxes: [{
                ticks: {
                    display: false,
                }
            }]
        },
    }
  });

// ------  Setup  ---------
// ~~~~~~~~~~~~~~~~~~~~~~~~

function onBPM(bpm) {
    document.getElementById("bpm").textContent = bpm.toString();
    chart.data.datasets[0].data.push(bpm);
    chart.data.labels.push("");
    chart.update();
}
var calc = new BPMCalculator(onBPM);

function beat() {
    calc.beat();
    document.getElementById("bar").textContent = "★".repeat(calc.barBeats()) + "-".repeat(calc.period - calc.barBeats());
}
function reset() {
    calc.reset();
    chart.data.datasets[0].data = [];
    chart.data.labels = [];
    document.getElementById("bar").textContent = "-".repeat(calc.period);
    chart.update();
}

window.addEventListener('keydown',
    function (event) {
        switch (event.key) {
            case ' ':
                beat();
                break;
            case 'R':
            case 'r':
                reset()
                break;
            default:
                break;
        }
    },
    false);

// Unfocus buttons to prevent trigerring them with keyboard
document.querySelectorAll("button").forEach( function(item) {
    item.addEventListener('focus', function() {
        this.blur();
    })
});