import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { WeatherCardComponent } from './components/weather-card/weather-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  template: `
    <ul
      class="nav nav-tabs card-header-tabs"
      style="width: 400px ; height:40px;margin:0 auto;"
    >
      <router-outlet></router-outlet>
    </ul>
  `,
  styles: ``,
})
export class AppComponent {
  title = 'wheateher-app';
}
