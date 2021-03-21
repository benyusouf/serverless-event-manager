import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Subscription } from 'rxjs';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit , OnDestroy{


  events = [1, 2, 3, 4, 5];
  
  subscriptions: Subscription[] = [];

  constructor(
    public  auth: AuthService,
    private _eventService: EventService
  ) 
  { }

  ngOnInit(): void {
    this.subscriptions.push(this._eventService.getEvents().subscribe((result) => {
      console.log(result);
    }, error => console.log(error)));
  }

  ngOnDestroy(){
    this.subscriptions.forEach(x => x.unsubscribe());
  }

}
