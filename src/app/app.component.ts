import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIfMediaService } from '../ngIfMedia/ngIfMedia.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  responsiveText = 'Wtf';

  constructor(private mediaService: NgIfMediaService) {
  }

  ngOnInit() {
    this.mediaService.addReflection(
      this,
      {
        query: '<=mobile',
        success: () => {
          this.responsiveText = 'MOBILE!!!!!';
        },
        failure: () => {
          this.responsiveText = 'DESKTOP!!!';
        }
      });
  }

  ngOnDestroy() {
    this.mediaService.removeReflection(this);
  }
}
