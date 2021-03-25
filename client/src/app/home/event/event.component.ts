import { AfterViewChecked, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit, OnChanges {

  @Input() events: any;
  isDone = false;
  isChecked = false;
  changedEvents: any;
  defaultImage = environment.defaultImageUrl;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['events']) {
        this.changedEvents = changes['events'].currentValue;
        this.changedEvents.forEach(element => {
          element.isDone = this.done(element.scheduledAt);
        });
        this.isChecked = true;
    }
}

  done(date: string): boolean{

      const eventDate = Date.parse(date);

      return new Date().getTime() > eventDate;
  }

}
