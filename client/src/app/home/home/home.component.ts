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


  events = [];
  userEvents = [];
  isAuthenticated = false;
  
  subscriptions: Subscription[] = [];

  constructor(
    public  auth: AuthService,
    private _eventService: EventService
  ) 
  { 

  }

  async ngOnInit(): Promise<void> {
    this.subscriptions.push(this._eventService.getEvents().subscribe((result) => {
      this.events = result.items;
      console.log(this.events)
    }, error => console.log(error)));

    this.subscriptions.push(this.auth.user$.subscribe(
      (profile) => {
        this.auth.idTokenClaims$.subscribe(result => console.log(result), err => console.log(err));
        if(profile){
          this.auth.idTokenClaims$.subscribe((result) => {
            console.log(result.__raw);
            this.getUserEvents(result.__raw);
          }, err => console.log(err));
          
        }
      }
    ));

  }

  ngOnDestroy(){
    if(this.subscriptions.length > 0){
      this.subscriptions.forEach(x => x.unsubscribe());
    }
  }

  getUserEvents(token: string){
    console.log("A");
      this.subscriptions.push(this._eventService.getUserEvents(token).subscribe((result) => {
        this.userEvents = result.items;
      }, error => console.log(error)));
  }

}
