let update_intervall = 1;
let max_data_points = 10;
let upper_bound = 60;
let lower_bound = 10

let tempData = []; // Array für die Temperaturen
            let timeLabels = []; // Array für Zeitstempel oder Labels

            // Funktion um aktuelle Temperatur anzuzeigen
            function set_current_temp() {
                let curr_temp_div = document.getElementById("temp_inner");
                
                fetch('http://192.168.178.43:9000/get_cur') 
                .then(response => response.json())
                .then(data => {
                    let currentTemp = data.val;
                    curr_temp_div.innerText = `${currentTemp.toFixed(2)}`;
                    
                    // Daten für das Diagramm aktualisieren
                    if (tempData.length >= max_data_points) {
                        //tempData.shift(); // älteste Temperatur entfernen, wenn mehr als 10 Daten vorhanden sind
                        //timeLabels.shift(); // ältestes Label entfernen
                        tempData = tempData.slice(tempData.length - max_data_points + 1, tempData.length);
                        timeLabels = timeLabels.slice(timeLabels.length - max_data_points + 1, timeLabels.length);
                    }

                    let mean_e = document.getElementById("temp_mean");
                    let m = 0;
                    for (let i = 0; i<tempData.length; i++) {
                        m += tempData[i];
                    }
                    m /= tempData.length;
                    mean_e.innerText = m.toFixed(2);

                    let status_elem = document.getElementById("status");
                    status_elem.innerHTML = "";
                    if (currentTemp >= upper_bound) {

                        status_elem.className = "status_warm";
                        status_elem.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="alert-triangle"><rect width="24" height="24" transform="rotate(90 12 12)" opacity="0"/><path d="M22.56 16.3L14.89 3.58a3.43 3.43 0 0 0-5.78 0L1.44 16.3a3 3 0 0 0-.05 3A3.37 3.37 0 0 0 4.33 21h15.34a3.37 3.37 0 0 0 2.94-1.66 3 3 0 0 0-.05-3.04zm-1.7 2.05a1.31 1.31 0 0 1-1.19.65H4.33a1.31 1.31 0 0 1-1.19-.65 1 1 0 0 1 0-1l7.68-12.73a1.48 1.48 0 0 1 2.36 0l7.67 12.72a1 1 0 0 1 .01 1.01z"/><circle cx="12" cy="16" r="1"/><path d="M12 8a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1z"/></g></g></svg><div>Too Warm</div>';
                    } else if (currentTemp < upper_bound && currentTemp > lower_bound) {

                        status_elem.className = "status_good";
                        status_elem.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="checkmark"><rect width="24" height="24" opacity="0"/><path d="M9.86 18a1 1 0 0 1-.73-.32l-4.86-5.17a1 1 0 1 1 1.46-1.37l4.12 4.39 8.41-9.2a1 1 0 1 1 1.48 1.34l-9.14 10a1 1 0 0 1-.73.33z"/></g></g></svg><div>All Good</div>';
                    } else if (currentTemp <= lower_bound) {

                        status_elem.className = "status_cold";
                        status_elem.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="alert-triangle"><rect width="24" height="24" transform="rotate(90 12 12)" opacity="0"/><path d="M22.56 16.3L14.89 3.58a3.43 3.43 0 0 0-5.78 0L1.44 16.3a3 3 0 0 0-.05 3A3.37 3.37 0 0 0 4.33 21h15.34a3.37 3.37 0 0 0 2.94-1.66 3 3 0 0 0-.05-3.04zm-1.7 2.05a1.31 1.31 0 0 1-1.19.65H4.33a1.31 1.31 0 0 1-1.19-.65 1 1 0 0 1 0-1l7.68-12.73a1.48 1.48 0 0 1 2.36 0l7.67 12.72a1 1 0 0 1 .01 1.01z"/><circle cx="12" cy="16" r="1"/><path d="M12 8a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1z"/></g></g></svg><div>Too Cold</div>';
                    }

                    
                    let currentTime = new Date().toLocaleTimeString(); // Zeitstempel hinzufügen
                    timeLabels.push(currentTime);
                    tempData.push(currentTemp);

                    // Diagramm aktualisieren, wenn es bereits existiert
                    if (chart) {
                        updateChart();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });

                //setTimeout(set_current_temp, update_intervall * 1000);
                //setInterval(set_current_temp, update_intervall * 1000);
                setTimeout(() => {
                    set_current_temp();
                }, update_intervall * 1000);
            }


            

            // Chart.js Diagramm erstellen
            let chart;
            function createChart() {
                const ctx = document.getElementById('tempGraph').getContext('2d');
                chart = new Chart(ctx, {
                    type: 'line', // Liniendiagramm
                    data: {
                        labels: timeLabels, // Zeitstempel
                        datasets: [{
                            label: 'Temperatur (°C)',
                            data: tempData, // Temperaturdaten
                            borderColor:'#1982c4', // Linienfarbe
                            fill: true,
                            tension: 0.1
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                type: 'category', // Zeitstempel als Kategorien verwenden
                                position: 'bottom'
                            },
                            y: {
                                beginAtZero: false, // Y-Achse beginnt nicht bei 0
                                title: {
                                    display: true,
                                    text: 'Temperatur (°C)'
                                }
                            }
                        }
                    }
                });
            }

            // Funktion zum Aktualisieren des Diagramms
            function updateChart() {
                if (chart) {
                    // Sicherstellen, dass das Dataset existiert
                    if (chart.data.datasets.length > 0) {
                        // Die Labels und Daten des Diagramms aktualisieren
                        chart.data.labels = timeLabels;
                        chart.data.datasets[0].data = tempData;
                        chart.update();
                    } else {
                        // Falls das Dataset noch nicht existiert, fügen wir es hinzu
                        chart.data.datasets.push({
                            label: 'Temperatur (°C)',
                            data: tempData,
                            borderColor: 'rgb(75, 192, 192)',
                            fill: false,
                            tension: 0.1
                        });
                        chart.update();
                    }
                }
            }

function set_max_dp() {
    let element = document.getElementById("max_val_input");
    max_data_points = parseInt(element.value);
}

function set_udi() {
    let element = document.getElementById("ud_input");
    update_intervall = parseInt(element.value);
}

function set_bounds() {
    let u = document.getElementById("ub_in");
    let l = document.getElementById("lb_in");

    upper_bound = parseInt(u.value);
    lower_bound = parseInt(l.value);
}

window.onload = function() {
    set_current_temp();
    createChart(); // Initialisiere das Diagramm
     // Starte die Temperaturaktualisierung
}