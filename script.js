
var chart = new Chart(document.getElementById("line-chart"), {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
          data: [],
          borderColor: "rgba(200,0,0,0.5)",
          backgroundColor: "rgba(180,0,0,0.5)",
          fill: "origin",
        }
      ]
    },
    options: {
        legend : {
            display: false
        },
        tooltips: { mode: 'index' },
        hover: {
           mode: 'index',
           intersect: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 200
                }
            }]
        },
    }
  });

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
    hit() {
        chart.update();
        this.count = (this.count+1) % this.period;
        if(this.count == 0) {
            let bpm = this.bpm();
            this.callback(bpm);
            chart.data.datasets[0].data.push(bpm);
            chart.data.labels.push("?");
            this.last_period = performance.now();
        }
    }
}

var calc = new BPMCalculator(
    function (bpm) {
        document.getElementById("bpm").textContent = bpm.toString();
    }
);
window.addEventListener('keydown', (w, e) => calc.hit(), false);



