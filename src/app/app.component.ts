import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  template: `
    <div style="width: 400px ; margin:0 auto;">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: ``,
})
export class AppComponent {
  title = 'wheateher-app';
}
