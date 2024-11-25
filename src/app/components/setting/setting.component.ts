import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ApiServiceService } from '../../Services/api-service.service';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div
      class="nav nav-tabs card-header-tabs"
      style="width: 400px; height: 700px; margin: 0 auto; display: flex; justify-content: center; background-color:#E6E6FA;"
    >
      <div class="m-5 text-center">
        <form (ngSubmit)="submitCity()">
          <label for="cityInput" class="form-label"
            ><h1 class="text-dark">Set your City</h1></label
          >
          <input
            id="cityInput"
            type="text"
            [(ngModel)]="city"
            name="city"
            class="form-control m-3"
            placeholder="City Name"
            style="width: 300px"
            required
          />
          <button
            type="submit"
            class="btn btn-light mt-3"
            data-bs-toggle="button"
          >
            Save
          </button>
        </form>
      </div>
    </div>
    >
  `,
  styles: ``,
})
export class SettingComponent {
  city: string = 'Rome';

  constructor(private apiService: ApiServiceService) {}

  submitCity() {
    this.apiService.setCityName(this.city);
  }
}
