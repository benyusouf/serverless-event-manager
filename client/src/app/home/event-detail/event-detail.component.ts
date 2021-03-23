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
import { environment } from 'src/environments/environment';

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
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this._route.params.subscribe(params=> {
      this.eventId = params.eventId;
      this.userId = params.userId;
      console.log(this.eventId);
      this.loadEventInfo();
    });

    this.uploadImageForm = this._formBuilder.group(
      {
        image: ['', Validators.required]
      }
    );

    this.getUser();

  }

  getUser(){
    this.subscriptions.push(this.auth.user$.subscribe((result) => {
      this.user = result;
      console.log(result);
    }))
  }

  isOwner(){
    return this.user && this.userId == this.user.sub;
  }



  get uploadImageFormControls() {
    return this.uploadImageForm.controls;
  }

  loadEventInfo(){
    this.subscriptions.push(this._eventService.getEvent(this.eventId, this.userId).subscribe((result) => {
      this.event = result.items[0] as Event;

      let dateArray = this.event.scheduledAt.split('/');
      let newDate = `${dateArray[1]}/${dateArray[0]}/${dateArray[2]}`;

      const eventDate = Date.parse(newDate);

      if(new Date().getTime() > eventDate){
        this.isDone = true;
      }

      if(!this.event.attachmentUrl){
        this.imageUrl = environment.defaultImageUrl;
      } else{
        this.imageUrl = this.event.attachmentUrl;
      }
  
      console.log(this.imageUrl);

      console.log(result);
    }, err => console.log(err)))
  }

  getUploadUrl(template: TemplateRef<any>){
    this.modalRef = this._modalService.show(template);
    this._spinner.show();
    this.subscriptions.push(this._eventService.getUploadUrl(this.eventId).subscribe((result) => {
      this._spinner.hide();
      console.log(result);
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
        console.log(result);
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
    this.subscriptions.push(this._eventService.deleteEvent(this.eventId).subscribe((result) => {
      console.log(result);
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
      console.log(this.event);
      if(new Date().getMilliseconds() > eventDate){
        this.isDone = true;
      }
    }
  }

  reload(){
    window.location.reload();
  }

}
