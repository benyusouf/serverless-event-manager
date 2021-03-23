import { AfterViewChecked, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

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
    let dateArray = date.split('/');
      let newDate = `${dateArray[1]}/${dateArray[0]}/${dateArray[2]}`;

      const eventDate = Date.parse(newDate);

      return new Date().getTime() > eventDate;
  }

}
