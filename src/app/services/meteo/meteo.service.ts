import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MeteoService {

  constructor(private http: HttpClient) { }

  getCoordonate(city: string, zipcode: string){
    const params = {
      access_key: 'fa25535501b2750dec452e5bbece1ab0',
      query: `${city}, ${zipcode}`
    }

    this.http.get('http://api.positionstack.com/v1/forward', {params}).subscribe({
      next: ((response: any) => {
        console.log(response.data);
        return [response.data[0].latitude, response.data[0].longitude];
      }),
      error: ((error: any) => {
        console.log(error);
      })
    })
  }

  getWeather(coordonate: number[]){

  }
}
