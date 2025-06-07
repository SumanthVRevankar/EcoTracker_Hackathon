import React, { useState, useEffect } from 'react';
import { Cloud, Thermometer, Droplets, Wind, Eye, Sun, CloudRain, Snowflake } from 'lucide-react';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
}

interface AQIData {
  aqi: number;
  status: string;
}

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [aqiData, setAQIData] = useState<AQIData | null>(null);
  const [city, setCity] = useState('New York');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock weather data - in a real app, you'd fetch from OpenWeatherMap API
  const mockWeatherData: WeatherData = {
    name: city,
    main: {
      temp: 22,
      feels_like: 25,
      humidity: 65,
      pressure: 1013
    },
    weather: [
      {
        main: 'Clouds',
        description: 'partly cloudy',
        icon: '02d'
      }
    ],
    wind: {
      speed: 3.5
    },
    visibility: 10000
  };

  const mockAQIData: AQIData = {
    aqi: 42,
    status: 'Good'
  };

  const fetchWeatherData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would make actual API calls here:
      // const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      // const aqiResponse = await fetch(`https://api.waqi.info/feed/${city}/?token=${AQI_TOKEN}`);
      
      setWeatherData({ ...mockWeatherData, name: city });
      setAQIData(mockAQIData);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return <Sun className="h-16 w-16 text-yellow-500" />;
      case 'clouds':
        return <Cloud className="h-16 w-16 text-gray-500" />;
      case 'rain':
        return <CloudRain className="h-16 w-16 text-blue-500" />;
      case 'snow':
        return <Snowflake className="h-16 w-16 text-blue-300" />;
      default:
        return <Cloud className="h-16 w-16 text-gray-500" />;
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-600 bg-green-50 border-green-200';
    if (aqi <= 100) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (aqi <= 150) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (aqi <= 200) return 'text-red-600 bg-red-50 border-red-200';
    if (aqi <= 300) return 'text-purple-600 bg-purple-50 border-purple-200';
    return 'text-red-800 bg-red-100 border-red-300';
  };

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherData();
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Cloud className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather & Air Quality Monitor</h1>
          <p className="text-gray-600">Real-time environmental conditions and air quality data</p>
        </div>

        {/* City Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleCitySubmit} className="flex gap-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200 font-semibold"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {weatherData && aqiData && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Weather Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{weatherData.name}</h2>
                  <p className="text-blue-100 capitalize">{weatherData.weather[0].description}</p>
                </div>
                {getWeatherIcon(weatherData.weather[0].main)}
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{Math.round(weatherData.main.temp)}°C</div>
                  <div className="text-blue-100 text-sm">Temperature</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{Math.round(weatherData.main.feels_like)}°C</div>
                  <div className="text-blue-100 text-sm">Feels like</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <Droplets className="h-5 w-5" />
                    <span className="text-sm">Humidity</span>
                  </div>
                  <div className="text-xl font-bold">{weatherData.main.humidity}%</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wind className="h-5 w-5" />
                    <span className="text-sm">Wind Speed</span>
                  </div>
                  <div className="text-xl font-bold">{weatherData.wind.speed} m/s</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <Thermometer className="h-5 w-5" />
                    <span className="text-sm">Pressure</span>
                  </div>
                  <div className="text-xl font-bold">{weatherData.main.pressure} hPa</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="h-5 w-5" />
                    <span className="text-sm">Visibility</span>
                  </div>
                  <div className="text-xl font-bold">{weatherData.visibility / 1000} km</div>
                </div>
              </div>
            </div>

            {/* Air Quality Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Air Quality Index</h2>
                <div className={`inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold border-2 ${getAQIColor(aqiData.aqi)}`}>
                  {aqiData.aqi} - {aqiData.status}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">AQI Level</span>
                  <span className="font-bold text-lg">{aqiData.aqi}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Status</span>
                  <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                    aqiData.status === 'Good' ? 'bg-green-100 text-green-800' :
                    aqiData.status === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {aqiData.status}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-red-50 p-4 rounded-lg">
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span>Good</span>
                  <span>Moderate</span>
                  <span>Unhealthy</span>
                  <span>Hazardous</span>
                </div>
                <div className="w-full bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-500 h-3 rounded-full relative">
                  <div 
                    className="absolute top-0 w-3 h-3 bg-gray-800 rounded-full transform -translate-x-1.5"
                    style={{ left: `${Math.min(aqiData.aqi / 300 * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>0-50</span>
                  <span>51-100</span>
                  <span>101-200</span>
                  <span>201-300+</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Health Recommendations</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  {aqiData.aqi <= 50 ? (
                    <>
                      <li>• Perfect conditions for outdoor activities</li>
                      <li>• Enjoy your time outside!</li>
                      <li>• Great air quality for everyone</li>
                    </>
                  ) : aqiData.aqi <= 100 ? (
                    <>
                      <li>• Generally acceptable air quality</li>
                      <li>• Sensitive individuals should limit prolonged outdoor exposure</li>
                      <li>• Most people can enjoy outdoor activities</li>
                    </>
                  ) : (
                    <>
                      <li>• Consider limiting outdoor activities</li>
                      <li>• Sensitive groups should stay indoors</li>
                      <li>• Use air purifiers if available</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Environmental News Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Environmental News</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mock news articles - in a real app, you'd fetch from NewsAPI */}
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
              <h3 className="font-semibold text-gray-900 mb-2">Climate Action Initiatives Show Promise</h3>
              <p className="text-gray-600 text-sm mb-3">New renewable energy projects are contributing to significant carbon emission reductions worldwide...</p>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
              <h3 className="font-semibold text-gray-900 mb-2">Air Quality Improvements in Major Cities</h3>
              <p className="text-gray-600 text-sm mb-3">Several metropolitan areas report better air quality following implementation of clean air policies...</p>
              <span className="text-xs text-gray-500">5 hours ago</span>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
              <h3 className="font-semibold text-gray-900 mb-2">Sustainable Living Tips for Everyone</h3>
              <p className="text-gray-600 text-sm mb-3">Simple changes in daily habits can make a significant impact on your personal carbon footprint...</p>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;