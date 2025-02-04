// Latitudine e Longitudine Model
export interface LatLongResponseModel {
  results: Result[];
  generationtime_ms: number;
}

export interface Result {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  admin3_id: number;
  timezone: string;
  population: number;
  country_id: number;
  country: string;
  admin1: string;
  admin3: string;
}

// Dati Meteo Response Model
export interface MeteoDataResponseModel {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: CurrentUnits;
  current: Current;
  daily_units: DailyUnits;
  daily: Daily;
  hourly_units?: HourlyUnits;
  hourly?: Hourly;
}

export interface CurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  precipitation: string;
  wind_speed_10m: string;
}

export interface Current {
  time: string;
  interval: number;
  temperature_2m: number | undefined;
  relative_humidity_2m: number | undefined;
  precipitation: number | undefined;
  wind_speed_10m: number | undefined;
}

export interface DailyUnits {
  time: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  sunrise: string;
  sunset: string;
}

export interface Daily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
}

// Tipo HourlyData (per dati orari aggregati)
export interface HourlyWeather {
  time: string | undefined; //
  temperature: number | undefined;
  humidity: number | undefined;
  precipitation: number | undefined;
  cloud: number | undefined;
  wind: number | undefined;
}

// Interfaccia per il meteo giornaliero (per visualizzazione e dati aggregati)
export interface DailyWeather {
  date: Date;
  temperatureMax: number;
  temperatureMin: number;
  sunrise: string;
  sunset: string;
  humidity?: number;
  wind?: number;
  precipitation?: number;
}

// (Opzionale) Interfacce per i dati orari se in futuro la risposta li include
export interface HourlyUnits {
  time: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  precipitation_probability: string;
  rain: string;
  cloud_cover: string;
  wind_speed_10m: string;
}

export interface Hourly {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation_probability: number[];
  rain: number[];
  cloud_cover: number[];
  wind_speed_10m: number[];
}
