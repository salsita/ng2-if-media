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

  constructor(private mediaService: NgIfMediaService) {
    this.mediaContainer = this.mediaService.register();
  }

  ngOnInit() {
    this.mediaContainer.if('<tablet', (match) => { console.log('aaaaaaaa'); this.responsiveText = match ? '< TABLET' : '> TABLET'; });
    this.mediaContainer.if('=phoneH', (match) => { this.anotherResponsiveText = match ? '= phoneH' : '!= phoneH'; });
  }

  ngOnDestroy() {
    this.mediaContainer.deregister();
  }
}
