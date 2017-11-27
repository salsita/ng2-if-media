import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIfMediaService } from '../ngIfMedia/ngIfMedia.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  mediaContainer;
  responsiveText = '';

  constructor(private mediaService: NgIfMediaService) {
    this.mediaContainer = this.mediaService.register();
  }

  ngOnInit() {
    this.mediaContainer.if('landscape', () => { this.orientationFlipCounter++; });
  }

  ngOnDestroy() {
    this.mediaContainer.deregister();
  }
}
