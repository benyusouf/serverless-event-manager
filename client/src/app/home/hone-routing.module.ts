import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEventComponent } from './add-event/add-event.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  // Module is lazy loaded, see app-routing.module.ts
  {
    path: '',
    component: HomeComponent
  },
  {
    path: ':id/detail',
    component: EventDetailComponent
  },
  {
    path: 'add-event',
    component: AddEventComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class HomeRoutingModule {}
