import { useEffect, useState } from 'react';
import { CurrentWeather } from './components/CurrentWeather';
import { DailyForecast } from './components/DailyForecast';
import { HourlyChart } from './components/HourlyChart';
import { fetchCurrentWeather, fetchForecast } from './services/weatherService';
import { CurrentWeather as CurrentWeatherType, DailyForecast as DailyForecastType, HourlyForecast } from './types/weather';
import styles from './App.module.css';

export default function App() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherType | null>(null);
  const [dailyForecast, setDailyForecast] = useState<DailyForecastType[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 기본 도시: 서울
        const city = 'Seoul';
        
        const [current, forecast] = await Promise.all([
          fetchCurrentWeather(city),
          fetchForecast(city)
        ]);

        setCurrentWeather(current);
        setDailyForecast(forecast.daily);
        setHourlyForecast(forecast.hourly);
      } catch (err) {
        setError('날씨 데이터를 불러오는데 실패했습니다.');
        console.error('Weather data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
  }, []);

  if (loading) {
    return (
      <div className={styles.app}>
        <div className={styles.loading}>날씨 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>날씨 앱</h1>
          <p className={styles.subtitle}>
            OpenWeather API를 사용한 실시간 날씨 정보-v1.011111
          </p>
        </div>

        {currentWeather && <CurrentWeather weather={currentWeather} />}
        
        {dailyForecast.length > 0 && <DailyForecast forecasts={dailyForecast} />}
        
        {hourlyForecast.length > 0 && <HourlyChart hourlyData={hourlyForecast} />}
      </div>
    </div>
  );
}