import { Component, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiServiceService } from '../../Services/api-service.service';
import {
  latLongResponseModel,
  WeatherDataResponseModel,
} from '../../Models/interfaces';
import { RouterModule, RouterLink, RouterOutlet } from '@angular/router';
import { Input, Output } from '@angular/core';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterOutlet],
  template: `
    <div
      class="d-flex justify-content-center align-items-center"
      style="font-family: 'Open Sans', sans-serif"
    >
      <div class="card" style="width: 400px; height: 700px">
        <div
          class="card-body"
          style=" color:#fff;"
          [ngStyle]="{
            'background-image': 'url(' + wheaterGif + ')',
            'background-size': 'cover',
            'background-position': 'center',
            height: '700px',
            width: '400px',
            position: 'relative',
            color: textColor
          }"
        >
          <div class="m-2 text-center">
            <h6 style="font-size: 30px;">
              {{ currentDate }}
            </h6>
            <h1 style="letter-spacing: 1.5px;">{{ currentCityValue }}</h1>
            <h2 *ngIf="dataWheaterResponse[0]?.current">
              {{ dataWheaterResponse[0].current.temperature_2m }}°
            </h2>
          </div>

          <div
            style="border-radius: 5%; padding: 10px; margin: 5px; background-color: rgba(211, 211, 211, 0.5); ; color: #fff; margin-top: 75%;"
          >
            <div
              class="card-body d-flex justify-content-around"
              style="padding:5px"
            >
              <div class="text-center" [ngStyle]="{ color: textColor }">
                <span><strong>Rain</strong></span>
                <img
                  src="../../../assets/rain.png"
                  alt="Icona 1"
                  class="mx-2"
                  style="width: 70px; height: 60px ; margin: 14%;"
                />
                <span
                  ><strong
                    >{{ dataWheaterResponse[0].current.precipitation }}%</strong
                  ></span
                >
              </div>

              <div class="text-center" [ngStyle]="{ color: textColor }">
                <span><strong>Humidity</strong></span>
                <img
                  src="../../../assets/humidity.png"
                  alt="Icona 2"
                  class="mx-2"
                  style="width: 70px; height: 60px ; margin:12%"
                />
                <span>
                  <strong
                    >{{ dataWheaterResponse[0].current.relative_humidity_2m }}%
                  </strong></span
                >
              </div>

              <div class="text-center" [ngStyle]="{ color: textColor }">
                <span><strong>Wind Speed </strong></span>
                <img
                  src="../../../assets/wind.png"
                  alt="Icona 3"
                  class="mx-2"
                  style="width: 70px; height: 60px;margin: 9%;"
                />
                <span
                  ><strong
                    >{{ dataWheaterResponse[0].current.wind_speed_10m }}km/h
                  </strong></span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');

      * :not(.nav-link):not(.card-header) {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInEffect 1s ease-out forwards;
      }

      @keyframes fadeInEffect {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class WeatherCardComponent implements OnInit {
  currentDate!: string;

  currentCityValue: string = 'Roma';

  latLongResponse: latLongResponseModel = {
    results: [],
    generationtime_ms: 0,
  };
  dataWheaterResponse: WeatherDataResponseModel[] = [];

  wheaterGif: string = '';
  textColor: string = 'white';

  constructor(private apiservice: ApiServiceService) {}

  ngOnInit(): void {
    const todayDate = new Date();
    console.log(todayDate);
    this.currentDate = todayDate.toLocaleDateString();
    console.log(this.currentDate);

    this.getCityPosition(this.currentCityValue);
  }

  getCityPosition(currentCityValue: string) {
    this.apiservice.getLatLongData(currentCityValue).subscribe((response) => {
      console.log('response', response);
      this.latLongResponse = response;
      console.log('latlongresponse', this.latLongResponse);
      const latitude = this.latLongResponse.results[0].latitude;
      console.log(latitude);
      const longitude = this.latLongResponse.results[0].longitude;
      console.log(longitude);
      this.getDataWheaterFromCityPos(latitude, longitude);
    });
  }

  getDataWheaterFromCityPos(latitude: number, longitude: number) {
    this.apiservice
      .getDataWeather(latitude, longitude)
      .subscribe((responseDataWheater) => {
        console.log('responseDataWheater', responseDataWheater);
        this.dataWheaterResponse[0] = responseDataWheater;

        const isRaining = this.dataWheaterResponse[0].current.precipitation > 0;
        if (isRaining) {
          this.wheaterGif = '../../../assets/giphyrainsea.webp';
        } else {
          this.wheaterGif = '../../../assets/giphy.webp'; //
          this.textColor = 'black';
        }
      });
  }
}
