import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MeteoService {

  meteoData$ = new BehaviorSubject<any>(null)

  get meteoData(){return this.meteoData$.asObservable()}

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
        this.meteoData$.next(data)
      })
    return meteoData
  }
}
