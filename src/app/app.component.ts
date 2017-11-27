import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIfMediaService } from '../ngIfMedia/ngIfMedia.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  mediaContainer;
  short1 = 'Short';
  medium1 = 'Medium Title';
  long1 = 'Long Navigation Title';
  short2 = 'Short';
  medium2 = 'Medium Title';
  long2 = 'Long Navigation Title';
  short3 = 'Short';
  medium3 = 'Medium Title';
  long3 = 'Long Navigation Title';

  text1: string;
  text2: string;
  text3: string;

  constructor(private mediaService: NgIfMediaService) {
    this.mediaContainer = this.mediaService.register();
  }

  ngOnInit() {
    this.mediaContainer.if('<break1', (match) => { this.text = match ? this.mediumTitle : this.longTitle });
    this.mediaContainer.if('<break2', (match) => { this.text = match ? this.shortTitle : this.mediumTitle });

    this.mediaContainer.when({
      '<=phone': () => this.text = this.shortTitle,
      '<desktop and >phone': () => this.text = this.mediumTitle,
      '>=desktop': () => this.text = this.longTitle
    });

    this.mediaContainer.when({
      '<=phone': { 'text': this.shortTitle },
      '<desktop and >phone': () => this.text = this.mediumTitle,
      '>=desktop': () => this.text = this.longTitle
    });
  }

  ngOnDestroy() {
    this.mediaContainer.deregister();
  }
}
