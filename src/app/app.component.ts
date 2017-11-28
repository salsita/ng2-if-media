import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIfMediaService } from '../ngIfMedia/ngIfMedia.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  mediaContainer;
  short1 = 'Short 1';
  medium1 = 'Medium Title 1';
  long1 = 'Long Navigation Title 1';
  short2 = 'Short 2';
  medium2 = 'Medium Title 2';
  long2 = 'Long Navigation Title 2';
  short3 = 'Short 3';
  medium3 = 'Medium Title 3';
  long3 = 'Long Navigation Title 3';

  text1: string;
  text2: string;
  text3: string;

  constructor(private mediaService: NgIfMediaService) {
    this.mediaContainer = this.mediaService.register();
  }

  ngOnInit() {
    this.mediaContainer.when({
      '<=phone': { 'text1': this.short1, 'text2': this.medium1, 'text3': this.long1 },
      '<desktop and >phone': { 'text1': this.short2, 'text2': this.medium2, 'text3': this.long2 },
      '>=desktop': { 'text1': this.short3, 'text2': this.medium3, 'text3': this.long3 }
    });
  }

  ngOnDestroy() {
    this.mediaContainer.deregister();
  }
}
