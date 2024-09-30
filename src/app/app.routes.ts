import { Routes } from '@angular/router';
import { WeatherCardComponent } from './components/weather-card/weather-card.component';
import { SettingComponent } from './components/setting/setting.component';

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
  {
    path: 'setting',
    component: SettingComponent, // Aggiungi questa riga
  },
];
