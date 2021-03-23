import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Subscription } from 'rxjs';
import { Auth0Service } from '../services/auth-service';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit , OnDestroy{


  events = [];
  userEvents = [];
  isAuthenticated = false;
  
  subscriptions: Subscription[] = [];

  constructor(
    public  auth: AuthService,
    private _eventService: EventService,
    private _auth0Service: Auth0Service
  ) 
  { }

  ngOnInit(): void {
    this.subscriptions.push(this._eventService.getEvents().subscribe((result) => {
      this.events = result.items;
      console.log(this.events)
    }, error => console.log(error)));

    this.auth.user$.subscribe(
      (profile) => {
        if(profile){
          this._auth0Service.renewSession();
          this.getUserEvents();
        }
      }
    );
  }

  ngOnDestroy(){
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  getUserEvents(){
      this.subscriptions.push(this._eventService.getUserEvents().subscribe((result) => {
        this.userEvents = result.items;
      }, error => console.log(error)));
  }

}
