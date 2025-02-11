import { Component, Input } from '@angular/core';
import { MeteoDataResponseModel } from '../../Models/interfaces';
import { RoundTempPipe } from '../../round-temp.pipe';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-meteo-details',
  standalone: true,
  imports: [RoundTempPipe, NgIf, CommonModule],
  template: `<div
    class="current-weather fade-in-container"
    *ngIf="dataWeatherResponse?.current"
  >
    <h2 class="city-name">{{ currentCityValue }}</h2>
    <p class="date">{{ currentDate }}</p>
    <div class="temp-style">
      <span *ngIf="dataWeatherResponse?.current?.temperature_2m !== undefined">
        <span
          >{{
            dataWeatherResponse.current.temperature_2m ?? 'N/D' | roundTemp
          }}°C</span
        >
      </span>
    </div>
    <div class="weather-details">
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
          >{{ dataWeatherResponse.current.wind_speed_10m ?? 'N/D' }} km/h</span
        >
      </div>
      <div class="icon-text">
        <i class="fas fa-cloud"></i>
        <span>{{ dataWeatherResponse.current.precipitation ?? 'N/D' }} mm</span>
      </div>
    </div>
    <ng-content></ng-content>
  </div> `,
  styles: `.current-weather {
    padding: 10px;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    background-color: rgba(255, 255, 255, 0.1);
    text-align: center;
    height: calc(var(--vh) * 90);
  }
  
  .fade-in-container {
    opacity: 0;
    transform: translateY(50px);
    animation: fadeInUp 1.5s ease 0.2s forwards; /* Ritardo di 0.3 secondi */
  }
  
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .current-weather .city-name {
    font-size: 4rem;
    margin-bottom: 5px;
  }
  
  .date {
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--primary-color);
    margin-bottom: 10px;
  }
  
  .current-weather .temp-style {
    color: white;
    font-size: 5rem;
  }
  
  .weather-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    margin-top: 5px;
    width: 100%;
  }
  
  .icon-text {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 2px;
    font-size: 1rem;
    width: auto; /* Evita che si allarghi troppo */
    text-align: center;
  }
  
  .icon-text > i {
    font-size: 1rem;
  }
  .icon-text > span {
    font-weight: bold;
  }
  
  .weather-icon {
    width: 45px;
    height: auto;
  }`,
})
export class MeteoDetailsComponent {
  @Input() currentCityValue: string = '';
  @Input() currentDate: string = '';
  @Input() dataWeatherResponse!: MeteoDataResponseModel;
}
