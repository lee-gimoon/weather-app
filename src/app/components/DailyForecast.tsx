import { DailyForecast as DailyForecastType } from '../types/weather';
import styles from './DailyForecast.module.css';

interface Props {
  forecasts: DailyForecastType[];
}

export function DailyForecast({ forecasts }: Props) {
  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>일별 예보</h2>
      <div className={styles.forecastGrid}>
        {forecasts.map((forecast, index) => (
          <div key={index} className={styles.forecastCard}>
            <div className={styles.day}>{forecast.day}</div>
            <div className={styles.weatherInfo}>
              <img 
                src={getWeatherIcon(forecast.icon)} 
                alt={forecast.description}
                className={styles.icon}
              />
              <div className={styles.temps}>
                <div className={styles.tempHigh}>{forecast.tempHigh}°</div>
                <div className={styles.tempLow}>{forecast.tempLow}°</div>
              </div>
            </div>
            <div className={styles.description}>{forecast.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}