document.addEventListener('DOMContentLoaded', function() {

//api current weather - xmlhttp requeest

document.getElementById('weather-button').addEventListener('click', function () {
    const city = document.getElementById('city-input').value;
    const apiKey = '0f23b9aec7004310f291464932b4eeac';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
//api current weather - xmlhttp requeest

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    //definicja callback
    xhr.onload = function() {
        if(xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                console.log('Odpowiedź XHR (aktualna pogoda):', data);
                displayCurrentWeather(data);

        } else {
                document.getElementById("current-weather-result").innerHTML = '<p>Blad w pobieraniu danych. Sprawdz nazwe miasta.</p>'
            }
        }
    };
    xhr.send();

        //fetch api - 5days waether
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        fetch(forecastUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Błąd HTTP prognozy: Status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Odpowiedź Fetch API (prognoza):', data);
                displayForecast(data);
            })
            .catch(error => {
                console.error('Błąd Fetch API:', error);
                document.getElementById('five-weather-result').innerHTML = '<p>Błąd w pobieraniu prognozy 5-dniowej. Sprawdź konsolę.</p>';
            });
    }
)

function displayCurrentWeather(data) {
    const resultDiv = document.getElementById("current-weather-result");
    //dostepp do danych
    const icon = data.weather[0].icon
    const temp = data.main.temp.toFixed(1);
    const desc = data.weather[0].description;

    //pobranie ikony
    const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

    resultDiv.innerHTML = `<img src="${iconUrl}" alt="${desc}"> <p>${temp}°C</p> <p> ${desc}</p>`;

}

function displayForecast(data) {
    const resultDiv = document.getElementById('five-weather-result');
    let forecastHTML = '';

    const allForecasts = data.list;

    const filteredForecasts = allForecasts.filter(item =>
        item.dt_txt.includes('12:00:00')
    );

    filteredForecasts.forEach(item => {
        const date = new Date(item.dt * 1000);
        const formattedDateTime = date.toLocaleDateString('pl-PL', {
            weekday: 'short',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Dostęp do danych
        const temp = item.main.temp.toFixed(1);
        const desc = item.weather[0].description;
        const icon = item.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        forecastHTML += `
            <div>
                <strong>${formattedDateTime}</strong>
                <img src="${iconUrl}" alt="${desc}">
                <p>${temp}°C</p>
                <p>${desc}</p>
            </div>
        `;
    });

    resultDiv.innerHTML = forecastHTML;
}
});