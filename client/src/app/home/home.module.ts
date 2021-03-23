import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './event/event.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AddEventComponent } from './add-event/add-event.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { EventService } from './services/event.service';
import { Auth0Service } from './services/auth-service';
import { RouterModule } from '@angular/router';
import { UpdateEventComponent } from './update-event/update-event.component';



@NgModule({
  declarations: [
    EventComponent,
    HomeComponent,
    EventDetailComponent,
    AddEventComponent,
    UpdateEventComponent
  ],
  imports: [
    RouterModule,
    HttpClientModule,
    NgxSpinnerModule,
    CommonModule,
    HomeRoutingModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    TooltipModule.forRoot(),
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot()
  ],

  providers: [EventService, Auth0Service]

})
export class HomeModule { }
