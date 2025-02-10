import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  LatLongResponseModel,
  MeteoDataResponseModel,
} from '../Models/interfaces';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  constructor(readonly http: HttpClient) {}

  readonly cityNameSource = new BehaviorSubject<string>('Roma');
  cityName$ = this.cityNameSource.asObservable();

  setCityName(cityName: string): void {
    this.cityNameSource.next(cityName);
  }
  // Prende i dati per la posizione della citta'
  getLatLongData(currentCityValue: string): Observable<LatLongResponseModel> {
    const LatLongUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${currentCityValue}&count=1&language=it&format=json`;
    return this.http.get<LatLongResponseModel>(LatLongUrl);
  }
  // Ottiene i dati in base alla posizione fornita
  getDataWeather(
    latitude: number,
    longitude: number
  ): Observable<MeteoDataResponseModel> {
    const DataWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`;
    return this.http.get<MeteoDataResponseModel>(DataWeatherUrl);
  }
}
