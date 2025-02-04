import { Routes } from '@angular/router';
import { WeatherCardComponent } from './components/weather-card/weather-card.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/weather-card',
    pathMatch: 'full',
  },
  {
    path: 'weather-card',
    component: WeatherCardComponent,
  },
];
