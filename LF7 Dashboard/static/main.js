let chart, currentData = [], currentTimes = [], updateTimer;
let originalTemperaturen = [], timestamps = [];

function main() {
    originalTemperaturen = [12, 15, 18, 10, 14, 16, 13, 17, 11, 19, 13, 16, 15, 18, 14, 12, 17, 16, 15, 200];
    timestamps = originalTemperaturen.map((_, i) =>
        new Date(Date.now() - (originalTemperaturen.length - i - 1) * 3600000).toLocaleString()
    );

    // Standardwerte setzen
    document.getElementById('anzahl').value = '5';
    document.getElementById('sortierung').value = 'original';
    document.getElementById('interval').value = '10';

    // Event Listener setzen
    document.getElementById('anzahl').addEventListener('change', updateChart);
    document.getElementById('sortierung').addEventListener('change', updateChart);

    updateChart();
}

function updateChart() {
    if (!originalTemperaturen || !timestamps || originalTemperaturen.length === 0) {
        console.warn("Daten nicht initialisiert.");
        return;
    }

    const auswahl = document.getElementById('anzahl').value;
    const sortierung = document.getElementById('sortierung').value;
    const anzahl = auswahl === 'all' ? originalTemperaturen.length : parseInt(auswahl);

    let daten = originalTemperaturen.slice(-anzahl);
    let zeiten = timestamps.slice(-anzahl);

    if (sortierung === 'asc') {
        const sorted = daten.map((val, idx) => ({ val, time: zeiten[idx] })).sort((a, b) => a.val - b.val);
        daten = sorted.map(e => e.val);
        zeiten = sorted.map(e => e.time);
    } else if (sortierung === 'desc') {
        const sorted = daten.map((val, idx) => ({ val, time: zeiten[idx] })).sort((a, b) => b.val - a.val);
        daten = sorted.map(e => e.val);
        zeiten = sorted.map(e => e.time);
    }

    currentData = daten;
    currentTimes = zeiten;

    const labels = Array.from({ length: daten.length }, (_, i) => `${i + 1}`);
    const maxTemp = Math.max(...daten);
    const avgTemp = (daten.reduce((a, b) => a + b, 0) / daten.length).toFixed(1);

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById('tempChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Temperatur in °C',
                    data: daten,
                    backgroundColor: daten.map(t =>
                        t > 30 ? 'rgba(255, 99, 132, 0.7)' :
                        t > 20 ? 'rgba(255, 206, 86, 0.7)' :
                                 'rgba(54, 162, 235, 0.7)'
                    ),
                    borderColor: daten.map(t =>
                        t > 30 ? 'rgba(255, 99, 132, 1)' :
                        t > 20 ? 'rgba(255, 206, 86, 1)' :
                                 'rgba(54, 162, 235, 1)'
                    ),
                    borderWidth: 1
                },
                {
                    label: `Durchschnitt: ${avgTemp}°C`,
                    type: 'line',
                    data: [
                        { x: 0, y: avgTemp },
                        { x: daten.length - 1, y: avgTemp }
                    ],
                    parsing: false,
                    borderColor: 'rgba(0,0,0,0.5)',
                    borderWidth: 1,
                    pointRadius: 0,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: maxTemp + 20,
                    title: {
                        display: true,
                        text: 'Temperatur in °C'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Messpunkt'
                    },
                    grid: {
                        display: false // 🔥 Keine vertikalen Gitterlinien
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            const value = context.raw;
                            const zeit = currentTimes[index];
                            return `${value}°C\n${zeit}`;
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function toggle_on() {
    let btn = document.getElementById("toggle_btn");
    let curtext = btn.textContent;
    if (curtext == "An") {
        btn.textContent = "Aus";
    } else {
        btn.textContent = "An";
    }
}

window.onload = function () {
    main();
};
