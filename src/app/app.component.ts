import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule, RouterLink } from '@angular/router';
import { WeatherCardComponent } from './components/weather-card/weather-card.component';
import { SettingComponent } from './components/setting/setting.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, RouterLink],
  template: `
    <ul
      class="nav nav-tabs card-header-tabs"
      style="width: 400px ; height:40px;margin:0 auto;"
    >
      <li class="nav-item">
        <a class="nav-link active" aria-current="true" routerLink="weather-card"
          >Weather</a
        >
      </li>
      <li class="nav-item">
        <a class="nav-link" [routerLink]="['/setting']">Setting</a>
      </li>
    </ul>

    <router-outlet></router-outlet>
  `,
  styles: ``,
})
export class AppComponent {
  title = 'wheateher-app';
}
