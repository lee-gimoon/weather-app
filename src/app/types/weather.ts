export interface CurrentWeather {
  location: string;
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  description: string;
  icon: string;
  aqi: number;
  aqiLevel: string;
}

export interface DailyForecast {
  day: string;
  tempHigh: number;
  tempLow: number;
  icon: string;
  description: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  icon: string;
}
