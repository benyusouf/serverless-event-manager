import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { SaveEvent } from '../models/saveEvent.model';
import { EventService } from '../services/event.service';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Event } from '../models/event.model';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.scss']
})
export class UpdateEventComponent implements OnInit {

  eventId: string;
  userId: string;
  event = new Event();

  minDate = new Date();

  updateEventForm: FormGroup;
  saveEvent = new SaveEvent();

  subscriptions: Subscription[] = [];

  token: string;

  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _spinner: NgxSpinnerService,
    private _router: Router,
    private _eventService: EventService,
    private _auth: AuthService
  ) { }

  ngOnInit(): void {

    this.subscriptions.push(this._route.params.subscribe(params=> {
      this.eventId = params.eventId;
      this.userId = params.userId;
      this.loadEventInfo();
    }));

    this.subscriptions.push(this._auth.isAuthenticated$.subscribe((result) => {
      this.getToken();
    }));

    this.updateEventForm = this._formBuilder.group(
      {
        title: ['', Validators.required],
        type: ['', Validators.required],
        description: ['', Validators.required],
        date: ['', Validators.required],
        venue: ['', Validators.required]
      }
    );

  }

  getToken(){
    this.subscriptions.push(this._auth.idTokenClaims$.subscribe((result) => {
      if(result){
        this.token = result.__raw;
      }
    }, err => console.log(err)));
  }

  get createEventFormControls() {
    return this.updateEventForm.controls;
  }


  submit() {

      this._spinner.show();
      this.setValues();

      this.subscriptions.push(this._eventService.updateEvent(this.eventId, this.saveEvent, this.token).subscribe((result) => {
        this._spinner.hide();
        this.alertConfirmation();
      }, error => {
        console.log(error);
        this._spinner.hide();
        this.alertError();
      }
      ));

      this._spinner.hide();
  }

  private setValues(){
    
    const controls = this.createEventFormControls;

      this.saveEvent.title = controls['title'].value;
      this.saveEvent.description = controls['description'].value;
      this.saveEvent.eventType = controls['type'].value;
      this.saveEvent.venue = controls['venue'].value;

      let date = controls['date'].value;

      this.saveEvent.scheduledAt = `${date.getDate().toString()}/0${date.getMonth().toString()}/${date.getFullYear().toString()}`;
  }

  private alertConfirmation() {
    const options = {
      title: 'Thank You',
      text: 'Your event has been updated successfully.',
      type: 'success',
      showCancelButton: false,
      confirmButtonColor: '#5533ff',
      confirmButtonText: 'Close'
    };

    Swal.fire(options).then(result => {
      if (result.value) {
        this.redirectToHome();
      }
    });
  }



  private alertError() {
    const options = {
      title: 'Opps!',
      text: 'Sorry event update was not successful, please try again.',
      type: 'error',
      showCancelButton: false,
      confirmButtonColor: '#5533ff',
      confirmButtonText: 'Close'
    };

    Swal.fire(options).then(result => {
      if (result.value) {
      }
    });
  }

  private redirectToHome() {
    this._router.navigateByUrl('/');
  }

  loadEventInfo(){
    this.subscriptions.push(this._eventService.getEvent(this.eventId, this.userId).subscribe((result) => {
      this.event = result.items[0] as Event;
    }, err => console.log(err)));
  }

  ngOnDestroy(){
    if(this.subscriptions.length > 0){
      this.subscriptions.forEach(x => x.unsubscribe());
    }
  }

}
