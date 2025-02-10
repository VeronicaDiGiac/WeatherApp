import { Component, OnInit, Inject, LOCALE_ID, Renderer2 } from '@angular/core';
import { CommonModule, formatDate, NgIf } from '@angular/common';
import { ApiServiceService } from '../../Services/api-service.service';
import { FormsModule } from '@angular/forms';
import {
  LatLongResponseModel,
  MeteoDataResponseModel,
  HourlyWeather,
  DailyWeather,
} from '../../Models/interfaces';

import { NavbarComponent } from '../navbar/navbar.component';
import { MeteoDetailsComponent } from '../meteo-details/meteo-details.component';
import { DayDetailsComponent } from '../day-details/day-details.component';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    MeteoDetailsComponent,
    DayDetailsComponent,
    NgIf,
  ],
  template: `
    <div class="container">
      <app-navbar (citySearch)="updateCity($event)"></app-navbar>
      <app-meteo-details
        *ngIf="dataWeatherResponse"
        [currentCityValue]="currentCityValue"
        [currentDate]="currentDate"
        [dataWeatherResponse]="dataWeatherResponse"
      >
        <div class="day-grid">
          <app-day-details
            *ngFor="let day of dailyData.slice(1)"
            [dailyData]="[day]"
          ></app-day-details>
        </div>
      </app-meteo-details>
    </div>
  `,
  styles: [
    `
      .day-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
        gap: 5px;
        justify-content: center;
        align-items: center;
        padding: 10px;
        margin-top: 50px;
      }
    `,
  ],
})
export class WeatherCardComponent implements OnInit {
  currentDate!: string;
  currentCityValue: string = 'Rome';
  cityInput: string = '';
  isNightTime: boolean = false;

  latLongResponse: LatLongResponseModel = {
    results: [],
    generationtime_ms: 0,
  };

  dataWeatherResponse!: MeteoDataResponseModel;
  hourlyData: HourlyWeather[] = [];
  dailyData: DailyWeather[] = [];

  constructor(
    public apiservice: ApiServiceService,
    @Inject(LOCALE_ID) readonly locale: string,
    readonly renderer: Renderer2
  ) {
    this.currentDate = formatDate(new Date(), 'mediumDate', this.locale);
  }

  ngOnInit(): void {
    const savedCity = localStorage.getItem('selectedCity') ?? 'Rome';
    this.currentCityValue = savedCity;
    this.apiservice.setCityName(savedCity);
    this.getCityPosition(this.currentCityValue);
    this.updateHeight();
    window.addEventListener('resize', this.updateHeight);
    this.setNightTime();
  }

  updateCity(city: string): void {
    if (city.trim()) {
      // Usa direttamente l'argomento ricevuto
      console.log('update city cliccata', city);
      this.currentCityValue = city;
      localStorage.setItem('selectedCity', city);
      this.apiservice.setCityName(city);
      this.getCityPosition(city);
    }
  }

  getCityPosition(city: string): void {
    this.apiservice.getLatLongData(city).subscribe({
      next: (response) => {
        this.latLongResponse = response;
        console.log(this.latLongResponse);
        if (
          this.latLongResponse.results &&
          this.latLongResponse.results.length > 0 // controlla se basta il primo membro (solo controllo esistenza e non lunghezza)
        ) {
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
        console.log(this.dataWeatherResponse);
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
  }

  updateHeight() {
    document.documentElement.style.setProperty(
      '--vh',
      `${window.innerHeight * 0.01}px`
    );
  }

  setNightTime(): void {
    const updateNightTime = () => {
      const currentTime = new Date().getUTCHours();
      this.isNightTime = currentTime >= 18 || currentTime < 6;

      if (this.isNightTime) {
        this.renderer.addClass(document.body, 'night-time');
      } else {
        this.renderer.removeClass(document.body, 'night-time');
      }
    };

    updateNightTime(); // Esegui subito il controllo
    setInterval(() => updateNightTime(), 60000); // Mantieni il contesto con una arrow function
  }
}
