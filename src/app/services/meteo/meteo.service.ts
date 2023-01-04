import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {setupTestingRouter} from "@angular/router/testing";

@Injectable({
  providedIn: 'root'
})
export class MeteoService {


  constructor(private http: HttpClient) {
  }

  meteoData$ = new BehaviorSubject<any>(null)
  tempMeteoData$ = new BehaviorSubject<any>(null)
  isTempMeteo$ = new BehaviorSubject<boolean | null>(null);
  precipication$ = new BehaviorSubject<unknown | number | null>(null)

  get isTempMeteo(){
    this.isTempMeteo$.next(true)
    return this.isTempMeteo$.asObservable()
  }

  get notTempMeteo(){
    this.isTempMeteo$.next(false)
    return this.isTempMeteo$.asObservable()
  }

  get meteoData(){return this.meteoData$.asObservable()}
  get precipitation() {return this.precipication$.asObservable()}
  get tempMeteoData(){return this.tempMeteoData$.asObservable()}

  /**
   * Get the weathering condition of a place through its coordinate
   *
   * @param zipcode The zip code of targeted town
   */
  getWeather(zipcode: string){

    let params={
      appid: "abef135b647329e43c861ceaa35aaed9",
      zip: zipcode + ",FR",
      units: "metric"
    }

    this.http.get<any>("https://api.openweathermap.org/data/2.5/forecast", {params: params}).subscribe({
      next: (data) => {
        console.log(data)
        if (data.list[0].rain) {
          console.log(Object.values(data.list[0].rain)[0]);
        }
        this.meteoData$.next(data)
      }
    })

    this.isTempMeteo$.subscribe({
      next : bool => {
        if (bool == null){
          this.isTempMeteo$.next(false)
        }
      }
    })

    // fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${zipcode},FR&appid=abef135b647329e43c861ceaa35aaed9&units=metric`)
    //   .then(response => response.json())
    //   .then((data) => {
    //     this.meteoData$.next(data)
    //   })
  }

  getTempWeather(zipcode: string){

    let params={
      appid: "abef135b647329e43c861ceaa35aaed9",
      zip: zipcode + ",FR",
      units: "metric"
    }

    // fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${zipcode},FR&appid=abef135b647329e43c861ceaa35aaed9&units=metric`)
    //   .then(response => response.json())
    //   .then((data) => {
    //     console.log(data)
    //     this.tempMeteoData$.next(data)
    //   })

    this.http.get<any>("https://api.openweathermap.org/data/2.5/forecast", {params: params}).subscribe({
      next: (data) => {
        console.log(data)
        if (data.cod != "404"){
          if (data.list[0].rain) {
            console.log(Object.values(data.list[0].rain)[0]+", "+typeof Object.values(data.list[0].rain)[0]);
            this.precipication$.next(Object.values(data.list[0].rain)[0])
          }
          this.tempMeteoData$.next(data)
        }
      }
    })
  }
}
