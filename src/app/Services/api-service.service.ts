import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  latLongResponseModel,
  WeatherDataResponseModel,
} from '../Models/interfaces';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  constructor(private http: HttpClient) {}

  private cityNameSource = new BehaviorSubject<string>('Roma'); // Valore di default
  cityName$ = this.cityNameSource.asObservable();

  setCityName(cityName: string) {
    this.cityNameSource.next(cityName);
  }

  getLatLongData(currentCityValue: string): Observable<latLongResponseModel> {
    const LatLongurl = `https://geocoding-api.open-meteo.com/v1/search?name=${currentCityValue}&count=1&language=en&format=json`;
    return this.http.get<latLongResponseModel>(LatLongurl);
  }

  getDataWeather(
    latitude: number,
    longitude: number
  ): Observable<WeatherDataResponseModel> {
    const DataWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m`;
    return this.http.get<WeatherDataResponseModel>(DataWeatherUrl);
  }
}
