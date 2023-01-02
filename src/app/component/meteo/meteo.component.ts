import {Component, ComponentRef, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MeteoService} from "../../services/meteo/meteo.service";
import {Observable} from "rxjs";
import {Coordinate} from "../models/coordinate";

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.css']
})
export class MeteoComponent implements OnInit {

  latitude!: number;
  longitude!: number;
  weatherCode!: number;
  temperature!: number
  humidityPercent!: number

  constructor(private http: HttpClient, private meteoService: MeteoService) { }

  coordinate$: Observable<Coordinate | null> = this.meteoService.coordinateValue

  ngOnInit() {
    this.meteoService.getCoordonate("Tavaux", "39500");
    this.coordinate$.subscribe({
      next: (coordinate) => {
        if (coordinate) {
        let promMeteoData = this.meteoService.getWeather(coordinate);
        let meteoData = promMeteoData.then(data => {
          return data}
        );
        console.log("meteoData : " + meteoData)
      }
    }})

  }

}
