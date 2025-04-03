// Weather Agent
// Retrieve weather information using AccuWeather API
// 5 günlük tahmin ve mevcut hava durumu verilerini al
// {{location: "Istanbul"}} TODO:Parametreler: Locations, Current Conditions, 24 Hours Historical, Daily Forecast 5 Days, Hourly Forecast 12 Hours, Indices 

class WeatherAgent {
  constructor() {
    this.locationKey = null;
    this.weather_data = {};
    this.apiKey = 'OVSZwJOANEAXRVMvtt2NyHnWyFGaAJ2C'; // Replace with your actual API key
  }

  async execute(toolName, { location }) {
    if (toolName === 'weather') {
      // Perform web search to get location key
      await this.getLocationKey(location);

      if (!this.locationKey) {
        return JSON.stringify({ sources_checked: 0, average_temperature: null, details: [], error: 'Location not found' });
      }
      
      // Collect data and generate report
      return this.collectData().then(() => {
        return JSON.stringify(this.generateReport());
      });
    }
    return 'Invalid toolName';
  }

  async getLocationKey(location) {
    const apiKey = this.apiKey;
    const baseUrl = 'https://dataservice.accuweather.com'; // Use https
    const endpoint = `/locations/v1/cities/search?apikey=${apiKey}&q=${encodeURIComponent(location)}`;

    try {
      const response = await this.fetchWithTimeout(baseUrl + endpoint);
      const data = await response.json();
      if (data && data.length > 0) {
        this.locationKey = data[0].Key;
        console.log(`Location key found: ${this.locationKey}`);
      } else {
        console.warn('Location not found.');
        this.locationKey = null;
      }
    } catch (error) {
      console.error('Error getting location key:', error);
      this.locationKey = null;
    }
  }

  async fetchWithTimeout(url, timeout = 10000, retries = 3) { // Increased timeout to 10 seconds
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying ${url}, ${retries} retries remaining`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
        return this.fetchWithTimeout(url, timeout, retries - 1);
      } else {
        console.error(`Failed to fetch ${url} after multiple retries:`, error);
        throw error;
      }
    }
  }

async collectData() {
    if (!this.locationKey) {
        console.warn('Location key is not available.');
        return;
    }
    
    const apiKey = this.apiKey;
    const baseUrl = 'https://dataservice.accuweather.com';
    const currentConditionsEndpoint = `/currentconditions/v1/${this.locationKey}?apikey=${apiKey}&details=true&metric=true`;
    const forecastEndpoint = `/forecasts/v1/daily/5day/${this.locationKey}?apikey=${apiKey}&details=true&metric=true`;
    const historicalEndpoint = `/currentconditions/v1/${this.locationKey}/historical/24?apikey=${apiKey}&details=true&metric=true`;
    const hourlyForecastEndpoint = `/forecasts/v1/hourly/12hour/${this.locationKey}?apikey=${apiKey}&details=true&metric=true`;
    // indicesEndpoint is not used in the original code, but it's included for completeness
    // const indicesEndpoint = `/indices/v1/daily/5day/${this.locationKey}?apikey=${apiKey}&details=true&metric=true`;

    try {
        // Collect all data in parallel
        const [currentConditionsResponse, forecastResponse, historicalResponse, hourlyResponse] = await Promise.all([
            this.fetchWithTimeout(baseUrl + currentConditionsEndpoint),
            this.fetchWithTimeout(baseUrl + forecastEndpoint),
            this.fetchWithTimeout(baseUrl + historicalEndpoint),
            this.fetchWithTimeout(baseUrl + hourlyForecastEndpoint)
            // indicesResponse: this.fetchWithTimeout(baseUrl + indicesEndpoint)
        ]);

        const currentConditionsData = await currentConditionsResponse.json();
        const forecastData = await forecastResponse.json();
        const historicalData = await historicalResponse.json();
        const hourlyData = await hourlyResponse.json();
        // const indicesData = await indicesResponse.json();

        if (currentConditionsData && currentConditionsData.length > 0) {
            this.weather_data = {
                temperature: currentConditionsData[0].Temperature.Metric.Value,
                condition: currentConditionsData[0].WeatherText,
                humidity: currentConditionsData[0].RelativeHumidity,
                wind: currentConditionsData[0].Wind ? currentConditionsData[0].Wind.Speed.Metric.Value : null,
                current_conditions: currentConditionsData[0],
                forecast: forecastData,
                historical: historicalData,
                hourly: hourlyData
                // indices: indicesData // Commented out as per previous edits
            };
        } else {
            console.warn('Current conditions not found.');
            this.weather_data = {};
        }
    } catch (error) {
        console.error('Error getting weather data:', error);
        this.weather_data = {};
    }
  return this.weather_data;
}

// data very big for prompt!! 
// Generate a report based on the collected weather data
generateReport() {
    if (Object.keys(this.weather_data).length > 0) {
      const { temperature, condition, humidity, wind, raw_data, forecast } = this.weather_data;

      const forecastDetails = forecast?.DailyForecasts?.map(day => ({
        Date: day.Date,
        EpochDate: day.EpochDate,
        Temperature: {
          Minimum: day.Temperature.Minimum,
          Maximum: day.Temperature.Maximum,
        },
        Day: {
          IconPhrase: day.Day.IconPhrase,
          ShortPhrase: day.Day.ShortPhrase,
          LongPhrase: day.Day.LongPhrase,
          PrecipitationProbability: day.Day.PrecipitationProbability,
          Wind: day.Day.Wind,
        },
        Night: {
          IconPhrase: day.Night.IconPhrase,
          ShortPhrase: day.Night.ShortPhrase,
          LongPhrase: day.Night.LongPhrase,
          PrecipitationProbability: day.Night.PrecipitationProbability,
          Wind: day.Night.Wind,
        },
      }));

      const headline = forecast?.Headline ? {
        EffectiveDate: forecast.Headline.EffectiveDate,
        Text: forecast.Headline.Text,
        Category: forecast.Headline.Category,
      } : null;

      return {
        sources_checked: 1,
        average_temperature: temperature,
        details: [{
          source: 'AccuWeather API',
          temperature: temperature,
          humidity: humidity,
          wind: wind,
          condition: condition,
          headline: headline,
          forecast: forecastDetails,
        }],
      };
    } else {
      return { sources_checked: 0, average_temperature: null, details: [] };
    }
  }
}

// Tarayıcıda kullanılabilmesi için
window.WeatherAgent = new WeatherAgent();
