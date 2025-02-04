import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiServiceService } from '../../Services/api-service.service';
import { FormsModule } from '@angular/forms';
import {
  LatLongResponseModel,
  MeteoDataResponseModel,
  HourlyWeather,
  DailyWeather,
} from '../../Models/interfaces';
import { RoundTempPipe } from '../../round-temp.pipe';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule, FormsModule, RoundTempPipe],
  template: `
    <div class="container">
      <div class="header">
        <h1>🌤️Meteo</h1>
      </div>
      <!-- Barra di ricerca -->
      <div class="search-bar">
        <input
          type="text"
          [(ngModel)]="cityInput"
          placeholder="Inserisci una città"
        />
        <button (click)="updateCity()">🔍 Cerca</button>
      </div>

      <!-- Meteo attuale -->
      <div *ngIf="dataWeatherResponse" class="current-weather">
        <h2>🌍 {{ currentCityValue }}</h2>
        <div class="weather-details">
          <p>{{ currentDate | date : 'mediumDate' }}</p>
          <div class="weather-details">
            <p>
              <i class="fas fa-thermometer-half fa-lg"></i>
              {{
                dataWeatherResponse.current.temperature_2m ?? 'N/D' | roundTemp
              }}°C
            </p>
            <p>
              <i class="fas fa-tint fa-lg"></i>
              {{ dataWeatherResponse.current.relative_humidity_2m ?? 'N/D' }}%
            </p>
            <p>
              <i class="fas fa-wind fa-lg"></i>
              {{ dataWeatherResponse.current.wind_speed_10m ?? 'N/D' }} km/h
            </p>
            <p>
              <i class="fas fa-cloud-rain fa-lg"></i>
              {{ dataWeatherResponse.current.precipitation ?? 'N/D' }} mm
            </p>
          </div>

          <!-- Previsioni Settimanali -->
          <div *ngIf="dailyData.length > 0" class="mb-4">
            <h2 class="text-center text-primary">📅 Previsioni Settimanali</h2>
            <div class="row">
              <div
                class="col-md-4 mb-3"
                *ngFor="let day of dailyData; let i = index"
              >
                <div
                  class="card forecast-card shadow-sm"
                  (click)="selectDay(i)"
                >
                  <div class="card-body text-center">
                    <h5 class="card-title">
                      {{ day.date | date : 'mediumDate' }}
                    </h5>
                    <p class="card-text">
                      <i class="fas fa-temperature-high"></i>
                      <strong>Max:</strong>
                      {{ day.temperatureMax | roundTemp }}°C <br />
                      <i class="fas fa-temperature-low"></i>
                      <strong>Min:</strong>
                      {{ day.temperatureMin | roundTemp }}°C
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dettagli Giorno Selezionato -->
          <div *ngIf="selectedDay" class="day-details">
            <h2>
              📍 Dettagli per {{ selectedDay.date | date : 'mediumDate' }}
            </h2>
            <div class="details-grid">
              <p>
                <strong>Temperatura Max:</strong>
                {{ selectedDay.temperatureMax }}°C
              </p>
              <p>
                <strong>Temperatura Min:</strong>
                {{ selectedDay.temperatureMin }}°C
              </p>
              <p>
                <strong>Alba:</strong>
                {{
                  selectedDay.sunrise.slice(
                    twilightStringRange[0],
                    twilightStringRange[1]
                  )
                }}
              </p>
              <p>
                <strong>Tramonto:</strong>
                {{
                  selectedDay.sunrise.slice(
                    twilightStringRange[0],
                    twilightStringRange[1]
                  )
                }}
              </p>
            </div>
          </div>
        </div>

        <pre> {{ dataWeatherResponse | json }}</pre>
      </div>
    </div>
  `,
  styles: [``],
})
export class WeatherCardComponent implements OnInit {
  currentDate!: string;
  currentCityValue: string = 'Rome';
  cityInput: string = '';

  latLongResponse: LatLongResponseModel = {
    results: [],
    generationtime_ms: 0,
  };

  dataWeatherResponse!: MeteoDataResponseModel;
  hourlyData: HourlyWeather[] = [];
  dailyData: DailyWeather[] = [];
  selectedDay: DailyWeather | null = null;
  twilightStringRange: number[] = [11, 17];

  constructor(readonly apiservice: ApiServiceService) {}

  ngOnInit(): void {
    this.currentDate = new Date().toLocaleDateString();
    const savedCity = localStorage.getItem('selectedCity') ?? 'Rome';
    this.currentCityValue = savedCity;
    this.apiservice.setCityName(savedCity);
    this.getCityPosition(this.currentCityValue);
  }

  updateCity(): void {
    if (this.cityInput.trim()) {
      this.currentCityValue = this.cityInput;
      localStorage.setItem('selectedCity', this.cityInput);
      this.apiservice.setCityName(this.cityInput);
      this.getCityPosition(this.cityInput);
    }
  }

  getCityPosition(city: string): void {
    this.apiservice.getLatLongData(city).subscribe({
      next: (response) => {
        this.latLongResponse = response;
        if (this.latLongResponse.results.length > 0) {
          const { latitude, longitude } = this.latLongResponse.results[0];
          this.getDataWeatherFromCityPos(latitude, longitude);
        } else {
          console.error('Nessuna posizione trovata per la città specificata');
        }
      },
      error: (err) =>
        console.error('Errore durante il recupero della posizione:', err),
    });
  }

  getDataWeatherFromCityPos(latitude: number, longitude: number): void {
    this.apiservice.getDataWeather(latitude, longitude).subscribe({
      next: (responseDataWeather) => {
        this.dataWeatherResponse = responseDataWeather;
        if (this.dataWeatherResponse.hourly?.time) {
          this.extractHourlyData();
        }
        if (this.dataWeatherResponse.daily?.time) {
          this.extractDailyData();
        }
      },
      error: (err) =>
        console.error('Errore durante il recupero dei dati meteo:', err),
    });
  }

  extractHourlyData(): void {
    if (!this.dataWeatherResponse.hourly) return;
    this.hourlyData = this.dataWeatherResponse.hourly.time.map(
      (time: string, index: number) => ({
        time,
        temperature: this.dataWeatherResponse.hourly?.temperature_2m[index],
        humidity: this.dataWeatherResponse.hourly?.relative_humidity_2m[index],
        precipitation:
          this.dataWeatherResponse.hourly?.precipitation_probability[index],
        cloud: this.dataWeatherResponse.hourly?.cloud_cover[index],
        wind: this.dataWeatherResponse.hourly?.wind_speed_10m[index],
      })
    );
  }

  extractDailyData(): void {
    this.dailyData = this.dataWeatherResponse.daily.time.map(
      (dateStr: string, index: number) => ({
        date: new Date(dateStr),
        temperatureMax:
          this.dataWeatherResponse.daily.temperature_2m_max[index],
        temperatureMin:
          this.dataWeatherResponse.daily.temperature_2m_min[index],
        sunrise: this.dataWeatherResponse.daily.sunrise[index],
        sunset: this.dataWeatherResponse.daily.sunset[index],
      })
    );
    if (!this.selectedDay && this.dailyData.length > 0) {
      this.selectedDay = this.dailyData[1];
    }
  }

  selectDay(index: number): void {
    this.selectedDay = this.dailyData[index];
  }
}
