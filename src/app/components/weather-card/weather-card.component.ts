import { Component, OnInit, Inject, LOCALE_ID, Renderer2 } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
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
      <!-- Barra di ricerca -->
      <div class="search-bar">
        <input
          type="text"
          [(ngModel)]="cityInput"
          placeholder="Inserisci una città"
        />
        <button (click)="updateCity()">Cerca</button>
      </div>

      <!-- Meteo attuale -->
      <div
        *ngIf="dataWeatherResponse"
        class="current-weather fade-in-container"
      >
        <h2 class="city-name">{{ currentCityValue }}</h2>
        <p class="date">{{ currentDate }}</p>
        <div class="temp-style">
          <span
            >{{
              dataWeatherResponse.current.temperature_2m ?? 'N/D' | roundTemp
            }}°C</span
          >
        </div>
        <div class="weather-details">
          <!-- <div class="icon-text">
            <i class="fas fa-thermometer-half"></i>
          </div> -->
          <div class="icon-text">
            <i class="fas fa-tint"></i>
            <span
              >{{
                dataWeatherResponse.current.relative_humidity_2m ?? 'N/D'
              }}%</span
            >
          </div>
          <div class="icon-text">
            <i class="fas fa-wind"></i>
            <span
              >{{
                dataWeatherResponse.current.wind_speed_10m ?? 'N/D'
              }}
              km/h</span
            >
          </div>

          <div class="icon-text">
            <i class="fas fa-cloud"></i>
            <span
              >{{ dataWeatherResponse.current.precipitation ?? 'N/D' }} mm</span
            >
          </div>
        </div>

        <!-- previsioni settimanli -->
        <div *ngIf="dailyData.length > 0" class="weekly-forecast">
          <div class="forecast-grid">
            <div
              *ngFor="let day of dailyData.slice(1); let i = index"
              class="forecast-card"
            >
              <h3>{{ day.date | date : 'mediumDate' }}</h3>
              <!-- Giorno sopra -->
              <i class="fas fa-cloud"></i>
              <p class="forecast-temp">
                {{ day.temperatureMax | roundTemp }}°C
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``],
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
  // selectedDay: DailyWeather | null = null;

  constructor(
    readonly apiservice: ApiServiceService,
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
      const currentTime = new Date().getHours();
      // const currentTime = 19;
      this.isNightTime = currentTime >= 18 || currentTime < 6; // Notte tra le 18:00 e le 5:59

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
