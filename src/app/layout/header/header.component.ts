import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output("onTriggerSidenav")
  trigger = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit(): void {
  }


  triggerSidebar() {
    this.trigger.emit();
  }


}
