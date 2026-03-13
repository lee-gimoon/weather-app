import { MapPin, Wind, Thermometer } from 'lucide-react';
import { CurrentWeather as CurrentWeatherType } from '../types/weather';
import styles from './CurrentWeather.module.css';

interface Props {
  weather: CurrentWeatherType;
}

export function CurrentWeather({ weather }: Props) {
  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@4x.png`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.location}>
        <MapPin size={24} />
        {weather.location}
      </div>

      <div className={styles.mainWeather}>
        <div>
          <div className={styles.temperature}>{weather.temperature}°</div>
          <div className={styles.description}>{weather.description}</div>
        </div>
        <img 
          src={getWeatherIcon(weather.icon)} 
          alt={weather.description}
          className={styles.weatherIcon}
        />
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>체감 온도</div>
          <div className={styles.detailValue}>
            <Thermometer size={16} style={{ display: 'inline', marginRight: 4 }} />
            {weather.feelsLike}°C
          </div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>풍속</div>
          <div className={styles.detailValue}>
            <Wind size={16} style={{ display: 'inline', marginRight: 4 }} />
            {weather.windSpeed} m/s
          </div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>공기질</div>
          <div className={styles.detailValue}>
            <span className={styles.aqiBadge}>
              AQI {weather.aqi} {weather.aqiLevel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}