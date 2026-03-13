import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HourlyForecast } from '../types/weather';
import styles from './HourlyChart.module.css';

interface Props {
  hourlyData: HourlyForecast[];
}

export function HourlyChart({ hourlyData }: Props) {
  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}.png`;
  };

  const chartData = hourlyData.map(hour => ({
    time: hour.time,
    temperature: hour.temperature
  }));

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>시간별 예보</h2>
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              style={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: 12 }}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: 12
              }}
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#667eea" 
              strokeWidth={3}
              dot={{ fill: '#667eea', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.hourlyIcons}>
        {hourlyData.map((hour, index) => (
          <div key={index} className={styles.hourItem}>
            <div className={styles.time}>{hour.time}</div>
            <img 
              src={getWeatherIcon(hour.icon)} 
              alt="weather"
              className={styles.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );
}