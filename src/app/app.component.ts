import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Agendo';


  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    const params = {
      access_key: "103507ccb4674571435afa4bfff28a28",
      query: "Paris, 75001"
    }

    this.http.get("http://api.positionstack.com/v1/forward", {params}).subscribe({
      next: ((response: any) => {
        console.log(response)
      })
    })
  }


}
