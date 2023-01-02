import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import { Coordinate } from 'src/app/models/coordinate';
import {AddressDTO} from "../../models/addressDTO";

@Injectable({
  providedIn: 'root'
})
export class MeteoService {

  coordinate = new BehaviorSubject<Coordinate | null>(null);

  get coordinateValue(){
    return this.coordinate.asObservable()
  }

  constructor(private http: HttpClient) { }

  /**
   * Get the coordinate of a city thanks to its name and postal code
   *
   * @param address An AddressDTO containing both city name and its postal code
   *
   * @return An array containing the coordinates of the city [latitude, longitude] with 4 decimals
   */
  getCoordonate(address: AddressDTO) {

      const params = {
        access_key: 'fa25535501b2750dec452e5bbece1ab0',
        query: /*`${address.city}, ${address.postalCode}`*/ "Paris, 75001"
      }

      const header = new HttpHeaders()

      header.append("X-Skip-Interceptor", "")
      header.append("Access-Control-Allow-Headers", "*")
      header.append("Access-Control-Allow-Private-Network", "true")
      header.append("Access-Control-Allow-Origin", 'http://localhost:4200')

      let latitude!: number
      let longitude!: number

      this.http.get('http://api.positionstack.com/v1/forward', {params}).subscribe({
        next: ((response: any) => {
          console.log(response.data);
          latitude = Math.round(response.data[0].latitude * 10000) / 10000;
          console.log("getCoordonate lat : " + latitude)
          console.log(typeof latitude)
          longitude = Math.round(response.data[0].longitude * 10000) / 10000;
          console.log("getCoordonate lon : " + longitude)
          const result: Coordinate = {
            latitude: latitude,
            longitude: longitude
          }
          this.coordinate.next(result);
        }),
        error: ((error: any) => {
          console.log(error);
        })
      })

  }


  /**
   * Get the weathering condition of a place through its coordinate
   *
   * @param coordinate A Coordinate
   */
  getWeather(coordinate: Coordinate): Observable<any> {

    const params: any = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      hourly: "temperature_2m,relativehumidity_2m,precipitation,windspeed_10m"
    }

    let meteoData: any

    return this.http.get("https://api.open-meteo.com/v1/forecast", {params})/*.subscribe({
      next: (data) => {
        console.log(data)
        meteoData = data
      }
    })
    return meteoData*/
  }
}
