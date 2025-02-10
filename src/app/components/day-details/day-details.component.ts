import { Component, Input, OnInit } from '@angular/core';
import { DailyWeather } from '../../Models/interfaces';
import { RoundTempPipe } from '../../round-temp.pipe';
import { DatePipe, NgIf } from '@angular/common';
@Component({
  selector: 'app-day-details',
  standalone: true,
  imports: [RoundTempPipe, DatePipe, NgIf],
  template: `<div
    class="weekly-forecast"
    *ngIf="
      dailyData.length > 0 && dailyData[0].date && dailyData[0].temperatureMax
    "
  >
    <div class="forecast-card">
      <p>{{ dailyData[0].date | date : 'mediumDate' }}</p>
      <i class="fas fa-cloud"></i>
      <p class="forecast-temp">
        {{ dailyData[0].temperatureMax | roundTemp }}°C
      </p>
    </div>
  </div> `,
  styles: `
  
/* Previsioni settimanali */
.weekly-forecast {
  display: flex;
  flex-wrap: wrap; /* Permette alle card di andare a capo */
  justify-content: center; /* Centra le card */
  align-items: flex-start;
  margin: 5px;
  padding: 10px 0;
  width: 100%;
  max-width: 100%; 
  overflow: hidden;
}

/* Card */
.forecast-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 15px; /* Aumenta il padding */
  border-radius: 16px; /* Bordi più arrotondati */
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  box-shadow: var(--box-shadow);
  min-width: 100px;
  max-width: 150px; /* Imposta una larghezza massima */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  overflow: hidden; /* Evita overflow */
}

/* Hover sulla card */
.forecast-card:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3); /* Ombra più pronunciata al hover */
}

.forecast-card p {
  font-size: 1.2rem;
  font-weight: bold;
}

.forecast-card i {
  font-size: 20px;
}
`,
})
export class DayDetailsComponent implements OnInit {
  ngOnInit() {
    console.log('dailyData:', this.dailyData);
    console.log('componente inizializzato daydetails ');
  }

  @Input() dailyData: DailyWeather[] = [];
}
