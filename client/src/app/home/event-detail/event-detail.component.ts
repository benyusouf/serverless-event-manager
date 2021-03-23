import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { Event } from '../models/event.model';
import { EventService } from '../services/event.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxSpinnerService } from 'ngx-spinner';

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

  subscriptions: Subscription[] = []

  constructor(
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _eventService: EventService,
    private _modalService: BsModalService,
    private _router: Router,
    private _spinner: NgxSpinnerService
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

    if(!this.event.attachmentUrl){
      this.imageUrl = 
      'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.angage.com%2Fen%2Fhybrid-events-what-are-they-and-what-tools-do-you-need-to-organise-one%2F&psig=AOvVaw2yNiZh5oJQbCnZ-JCU0_qq&ust=1616553553609000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCIjX6sqxxe8CFQAAAAAdAAAAABAD';
    } else{
      this.imageUrl = this.event.attachmentUrl;
    }

    console.log(this.imageUrl)


    this.uploadImageForm = this._formBuilder.group(
      {
        image: ['', Validators.required]
      }
    );

  }



  get uploadImageFormControls() {
    return this.uploadImageForm.controls;
  }

  loadEventInfo(){
    this.subscriptions.push(this._eventService.getEvent(this.eventId, this.userId).subscribe((result) => {
      this.event = result.items[0] as Event;
      console.log(result);
    }, err => console.log(err)))
  }

  getUploadUrl(template: TemplateRef<any>){
    this.modalRef = this._modalService.show(template);
    this.subscriptions.push(this._eventService.getUploadUrl(this.eventId).subscribe((result) => {
      console.log(result);
      this.uploadUrl = result.uploadUrl;
    }))
  }

  handleFileInput(files: FileList) {
    this.image = files.item(0);
}


  submit() {
    if(this.uploadImageForm.valid){

      this._spinner.show();

      this.subscriptions.push(this._eventService.uploadPhoto(this.uploadUrl, this.image).subscribe((result) => {
        console.log(result);
        this.alertConfirmation();
      }, error => {
        console.log(error);
        this.alertError();
      }
      ));

      this._spinner.hide();
    }
  }

  private alertConfirmation() {
    const options = {
      title: 'Thank You',
      text: 'Image has been successfully saved.',
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
      text: 'Sorry image upload was not successful, please try again.',
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
    this._router.navigateByUrl(`/events/${this.eventId}/${this.userId}`);
  }

}
