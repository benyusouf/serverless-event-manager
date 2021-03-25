import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

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
          if(!element.attachmentUrl){
            element.attachmentUrl = `assets/images/${this.getRandomInt(5)}.png`;
          }
        });
        this.isChecked = true;
    }
}

  done(date: string): boolean{

      const eventDate = Date.parse(date);

      return new Date().getTime() > eventDate;
  }
  
  private getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

}
