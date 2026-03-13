# 날씨 앱 - OpenWeather API 설정 가이드

## 개요
이 날씨 앱은 TypeScript, React, Module CSS로 제작되었으며 OpenWeather API를 사용합니다.

## OpenWeather API 설정 방법

### 1. API 키 발급
1. [OpenWeather 웹사이트](https://openweathermap.org/)에 접속
2. 계정 생성 후 로그인
3. API Keys 섹션에서 새로운 API 키 생성
4. 무료 플랜으로도 충분히 사용 가능합니다

### 2. API 키 적용
1. `/src/app/services/weatherService.ts` 파일을 엽니다
2. 다음 라인을 찾습니다:
   ```typescript
   const API_KEY = 'YOUR_API_KEY_HERE';
   ```
3. `YOUR_API_KEY_HERE`를 발급받은 실제 API 키로 교체합니다
4. 주석 처리된 실제 API 호출 함수의 주석을 해제하고, Mock 함수를 제거합니다

### 3. 실제 API 사용하기
`weatherService.ts` 파일에서:

**Mock 데이터 제거:**
```typescript
// Mock 함수 전체를 삭제하고...
```

**실제 API 함수 활성화:**
```typescript
// 주석을 제거하여 활성화
export async function fetchCurrentWeather(city: string): Promise<CurrentWeather> {
  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=kr`
  );
  const data = await response.json();
  
  return {
    location: data.name,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    windSpeed: data.wind.speed,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    aqi: 0,
    aqiLevel: '보통'
  };
}
```

## 주요 기능

- **현재 날씨**: 온도, 체감온도, 풍속, 공기질 표시
- **일별 예보**: 내일과 모레의 최고/최저 기온
- **시간별 예보**: 시간대별 온도 변화 차트

## 기술 스택

- **React 18** with TypeScript
- **CSS Modules** for styling
- **Recharts** for charts
- **Lucide React** for icons
- **OpenWeather API** for weather data

## 참고사항

- 현재는 Mock 데이터로 동작합니다
- 실제 API를 사용하려면 위의 설정 방법을 따라주세요
- API 호출 제한: 무료 플랜은 분당 60회까지 가능합니다
