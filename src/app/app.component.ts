import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIfMediaService } from '../ngIfMedia/ngIfMedia.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  mediaContainer;
  responsiveText = 'WTF';
  anotherResponsiveText;
  orientationFlipCounter = -1;

  constructor(private mediaService: NgIfMediaService) {
    this.mediaContainer = this.mediaService.register();
  }

  ngOnInit() {
    this.mediaContainer.if('landscape', () => { this.orientationFlipCounter++; });
    this.mediaContainer.if('<tablet', (match) => { this.responsiveText = match ? '< TABLET' : '> TABLET'; });
    this.mediaContainer.if('phoneH', (match) => { this.anotherResponsiveText = match ? '= phoneH' : '!= phoneH'; });
  }

  ngOnDestroy() {
    this.mediaContainer.deregister();
  }
}
