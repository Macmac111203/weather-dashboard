const apiKey = config.WEATHER_API_KEY;
const cityInput = document.querySelector("#city");
const searchBtn = document.querySelector("#search-btn");
const result = document.querySelector("#result");

// Search on button click
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") return;
  getWeather(city);
});

// Search on Enter key
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city === "") return;
    getWeather(city);
  }
});

async function getWeather(city) {
  // Show loading state
  result.innerHTML = `
    <div class="welcome-state">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading weather data...</p>
    </div>
  `;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("City not found. Please try again.");
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    result.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${error.message}</p>
      </div>
    `;
  }
}

function displayWeather(data) {
  const icon = data.weather[0].icon;
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const condition = data.weather[0].description;
  const country = data.sys.country;

  // Get appropriate icon for stat cards
  const getStatIcon = (type) => {
    switch(type) {
      case 'humidity': return 'fa-tint';
      case 'wind': return 'fa-wind';
      case 'feels': return 'fa-thermometer-half';
      case 'pressure': return 'fa-compress-arrows-alt';
      default: return 'fa-info-circle';
    }
  };

  result.innerHTML = `
    <div class="weather-main">
      <div class="weather-header">
        <div class="weather-location">
          <i class="fas fa-map-marker-alt"></i>
          <span>${data.name}, ${country}</span>
        </div>
      </div>
      
      <div class="weather-icon-container">
        <img 
          src="https://openweathermap.org/img/wn/${icon}@2x.png" 
          alt="${condition}" 
          class="weather-icon"
        />
      </div>
      
      <div class="weather-temp">${temp}°C</div>
      <div class="weather-condition">${condition}</div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas ${getStatIcon('feels')}"></i>
          </div>
          <div class="stat-label">Feels Like</div>
          <div class="stat-value">${feelsLike}°C</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas ${getStatIcon('humidity')}"></i>
          </div>
          <div class="stat-label">Humidity</div>
          <div class="stat-value">${humidity}%</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas ${getStatIcon('wind')}"></i>
          </div>
          <div class="stat-label">Wind Speed</div>
          <div class="stat-value">${windSpeed} m/s</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas ${getStatIcon('pressure')}"></i>
          </div>
          <div class="stat-label">Pressure</div>
          <div class="stat-value">${data.main.pressure} hPa</div>
        </div>
      </div>
    </div>
  `;
}
