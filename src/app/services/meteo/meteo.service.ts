import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import { Coordinate } from 'src/app/models/coordinate';
import {AddressDTO} from "../../models/addressDTO";
import {toNumbers} from "@angular/compiler-cli/src/version_helpers";

@Injectable({
  providedIn: 'root'
})
export class MeteoService {

  temperature$ = new BehaviorSubject<number | null>(null);
  maxTemperature$ = new BehaviorSubject<number | null>(null);
  minTemperature$ = new BehaviorSubject<number | null>(null);
  humidity$ = new BehaviorSubject<number | null>(null);
  weatherCode$ = new BehaviorSubject<string | null>(null);
  precipitation$ = new BehaviorSubject<any>(null);

  get temperature(){return this.temperature$.asObservable()}
  get maxTemperature(){return this.maxTemperature$.asObservable()}
  get minTemperature(){return this.maxTemperature$.asObservable()}
  get hum(){return this.humidity$.asObservable()}
  get weatherCode(){return this.weatherCode$.asObservable()}
  get precipitation(){return this.precipitation$.asObservable()}


  /**
   * Get the weathering condition of a place through its coordinate
   *
   * @param coordinate A Coordinate
   */
  getWeather(zipcode: string){

    let meteoData: any

    fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${zipcode},FR&appid=abef135b647329e43c861ceaa35aaed9&units=metric`)
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        this.temperature$.next(data.list[0].main.temp);
        console.log(data.list[0].main.temp);
        this.maxTemperature$.next(data.list[0].main.temp_max);
        console.log(data.list[0].main.temp_max);
        this.minTemperature$.next(data.list[0].main.temp_min);
        console.log(data.list[0].main.temp_min);
        this.humidity$.next(data.list[0].main.humidity);
        console.log(data.list[0].main.humidity);
        if (data.list[0].rain){
          this.precipitation$.next(Object.values(data.list[0].rain)[0]);
          console.log(Object.values(data.list[0].rain)[0])
        } else {
          this.precipitation$.next(0)
          console.log(0)
        }
        this.weatherCode$.next(data.list[0].weather[0].icon);
        console.log(data.list[0].weather[0].icon);
        console.log(typeof data.list[0].weather[0].icon);
        this.weatherCode$.subscribe({
          next: data => console.log(data + ", nb char : " + data?.length)
        })
        meteoData = data
      })
    return meteoData
  }
}
