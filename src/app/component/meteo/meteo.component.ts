import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {  }

}
