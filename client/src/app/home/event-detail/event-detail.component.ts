import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { Event } from '../models/event.model';
import { EventService } from '../services/event.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit, OnDestroy {

  eventId: string;
  userId: string;
  event = new Event();
  uploadUrl: string;
  modalRef: BsModalRef;
  uploadImageForm: FormGroup;
  image: File;
  imageUrl: string;
  user: any;
  isDone = false;
  scheduledAt = '';
  token: string;

  subscriptions: Subscription[] = []

  constructor(
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _eventService: EventService,
    private _modalService: BsModalService,
    private _router: Router,
    private _spinner: NgxSpinnerService,
    public auth: AuthService
  ) { }

  ngOnDestroy(): void {
    if(this.subscriptions.length > 0){
      this.subscriptions.forEach(x => x.unsubscribe());
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(this._route.params.subscribe(params=> {
      this.eventId = params.eventId;
      this.userId = params.userId;
      this.loadEventInfo();
    }));

    this.uploadImageForm = this._formBuilder.group(
      {
        image: ['', Validators.required]
      }
    );

    

    this.subscriptions.push(this.auth.isAuthenticated$.subscribe((result) => {
      this.getToken();
      this.getUser();
    }));

  }

  getToken(){
    this.subscriptions.push(this.auth.idTokenClaims$.subscribe((result) => {
      if(result) {
        this.token = result.__raw;
      }
    }, err => console.log(err)));
  }

  getUser(){
    this.subscriptions.push(this.auth.user$.subscribe((result) => {
      this.user = result;
    }))
  }

  isOwner(){
    return this.user && this.userId == this.user.sub;
  }

  private getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }



  get uploadImageFormControls() {
    return this.uploadImageForm.controls;
  }

  loadEventInfo(){
    this.subscriptions.push(this._eventService.getEvent(this.eventId, this.userId).subscribe((result) => {
      this.event = result.items[0] as Event;

      const eventDate = Date.parse(this.event.scheduledAt);

      if(new Date().getTime() > eventDate){
        this.isDone = true;
      }

      if(!this.event.attachmentUrl){
        this.event.attachmentUrl = `assets/images/${this.getRandomInt(5)}.png`;
      }
    }, err => console.log(err)))
  }

  getUploadUrl(template: TemplateRef<any>){
    this.modalRef = this._modalService.show(template);
    this._spinner.show();
    this.subscriptions.push(this._eventService.getUploadUrl(this.eventId, this.token).subscribe((result) => {
      this._spinner.hide();
      this.uploadUrl = result.uploadUrl;
    }, err => {
      this._spinner.hide();
      this.reload();
    }));
  }

  handleFileInput(files: FileList) {
    this.image = files.item(0);
}


  submit() {
    if(this.uploadImageForm.valid){

      this._spinner.show();

      this.subscriptions.push(this._eventService.uploadPhoto(this.uploadUrl, this.image).subscribe((result) => {
        this._spinner.hide();
        this.alertConfirmation('Image has been successfully saved.', `/events/${this.eventId}/${this.userId}`);
      }, error => {
        console.log(error);
        this._spinner.hide()
        this.alertError('Sorry image upload was not successful, please try again.');
      }
      ));

    }
  }

  private alertConfirmation(message: string, redirectUrl) {
    const options = {
      title: 'Done',
      text: message,
      type: 'success',
      showCancelButton: false,
      confirmButtonColor: '#5533ff',
      confirmButtonText: 'Close'
    };

    Swal.fire(options).then(result => {
      if (result.value) {
        this.redirectToHome(redirectUrl);
      }
    });
  }



  private alertError(message: string) {
    const options = {
      title: 'Opps!',
      text: message,
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

  private redirectToHome(url) {
    if(url.length > 2){
      this.reload();
      return;
    }
    this._router.navigateByUrl(url);
  }

  deleteEvent(){
    this._spinner.show();
    this.subscriptions.push(this._eventService.deleteEvent(this.eventId, this.token).subscribe((result) => {
      this._spinner.hide();
      this.alertConfirmation('Event deleted successfully', '/');
    }, err => {
      this._spinner.hide();
      this.alertError('Event deletion was not successful, please try again');
    })) 
  }

  done(){
    if(this.event){
      const eventDate = Date.parse(this.event.scheduledAt);
      if(new Date().getMilliseconds() > eventDate){
        this.isDone = true;
      }
    }
  }

  attend(){
    this.alertConfirmation('Your reservation has been book', '/');
  }

  reload(){
    window.location.reload();
  }

}
