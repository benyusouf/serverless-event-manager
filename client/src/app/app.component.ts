import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'capstone-event-manager';
  events = [1, 2, 3, 4, 5];

  constructor(
    private _auth: AuthService
  ) {}

  login(){
    this._auth.loginWithRedirect();
  }
}
