import {
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
} from "../types/weather";

// OpenWeather API 설정
// 실제 사용 시 API 키를 여기에 입력하세요: https://openweathermap.org/api
const API_KEY = "eed500bda02858e02465ef0adc6ac81e";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// 실제 API 호출 함수 (주석 처리됨)
export async function fetchCurrentWeather(
  city: string,
): Promise<CurrentWeather> {
  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=kr`,
  );
  const data = await response.json();

  return {
    location: data.name,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    windSpeed: data.wind.speed,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    aqi: 0, // AQI는 별도 API 호출 필요
    aqiLevel: "보통",
  };
}

export async function fetchForecast(
  city: string,
): Promise<{ daily: DailyForecast[]; hourly: HourlyForecast[] }> {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=kr`,
  );
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Forecast API error: ${response.status} ${response.statusText}${text ? ` - ${text}` : ""}`,
    );
  }

  const data = (await response.json()) as {
    list: Array<{
      dt: number;
      dt_txt?: string;
      main: { temp: number };
      weather: Array<{ description: string; icon: string }>;
    }>;
  };

  const list = Array.isArray(data?.list) ? data.list : [];

  const hourly: HourlyForecast[] = list.slice(0, 4).map((item) => {
    const date = new Date(item.dt * 1000);
    const time = date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return {
      time,
      temperature: Math.round(item.main.temp),
      icon: item.weather?.[0]?.icon ?? "01d",
    };
  });

  const byDay = new Map<
    string,
    {
      temps: number[];
      icon: string;
      description: string;
    }
  >();

  for (const item of list) {
    const date = new Date(item.dt * 1000);
    const key = date.toISOString().slice(0, 10); // YYYY-MM-DD

    const existing = byDay.get(key);
    const next = existing ?? {
      temps: [],
      icon: item.weather?.[0]?.icon ?? "01d",
      description: item.weather?.[0]?.description ?? "",
    };

    next.temps.push(item.main.temp);

    // 가능하면 정오(12시) 근처 값을 대표로 사용
    if (!existing) {
      byDay.set(key, next);
    } else {
      const hour = date.getHours();
      if (hour >= 11 && hour <= 14) {
        next.icon = item.weather?.[0]?.icon ?? next.icon;
        next.description = item.weather?.[0]?.description ?? next.description;
      }
    }
  }

  const todayKey = new Date().toISOString().slice(0, 10);
  const daily: DailyForecast[] = Array.from(byDay.entries())
    .filter(([key]) => key >= todayKey)
    .slice(0, 5)
    .map(([key, v], idx) => {
      const temps = v.temps.length ? v.temps : [0];
      const tempHigh = Math.round(Math.max(...temps));
      const tempLow = Math.round(Math.min(...temps));

      let dayLabel = key;
      if (idx === 0) dayLabel = "오늘";
      if (idx === 1) dayLabel = "내일";

      return {
        day: dayLabel,
        tempHigh,
        tempLow,
        icon: v.icon,
        description: v.description,
      };
    });

  return { daily, hourly };
}

/*
// Mock 데이터 (개발용) - 필요 시에만 임시로 사용하세요.
export async function fetchCurrentWeather(
  city: string,
): Promise<CurrentWeather> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        location: "서울특별시",
        temperature: 8,
        feelsLike: 6,
        windSpeed: 3,
        description: "맑음",
        icon: "01d",
        aqi: 89,
        aqiLevel: "보통",
      });
    }, 500);
  });
}

export async function fetchForecast(
  city: string,
): Promise<{ daily: DailyForecast[]; hourly: HourlyForecast[] }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        daily: [
          {
            day: "내일",
            tempHigh: 10,
            tempLow: 2,
            icon: "02d",
            description: "구름 조금",
          },
          {
            day: "토요일",
            tempHigh: 12,
            tempLow: 4,
            icon: "01d",
            description: "맑음",
          },
        ],
        hourly: [
          { time: "17:00", temperature: 8, icon: "01d" },
          { time: "18:00", temperature: 7, icon: "01d" },
          { time: "19:00", temperature: 6, icon: "01n" },
          { time: "20:00", temperature: 5, icon: "01n" },
        ],
      });
    }, 500);
  });
}
*/
