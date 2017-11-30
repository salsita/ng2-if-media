import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIfMediaService } from '../ng-if-media/ng-if-media.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  mediaContainer;
  menu1short = '<=phone';
  menu1medium = '>phone and <desktop';
  menu1long = '>=desktop';
  menu2short = 'Contact';
  menu2medium = 'Get a quote';
  menu2long = 'Get in touch from your desktop!';
  orientationFlipCounter = -1;

  menu1: string;
  menu2: string;

  constructor(private mediaService: NgIfMediaService) {
    this.mediaContainer = this.mediaService.register(this);
  }

  ngOnInit() {
    this.mediaContainer.when({
      '<=phone': {
        menu1: this.menu1short,
        menu2: this.menu2short
      },
      '>phone and <desktop': {
        menu1: this.menu1medium,
        menu2: this.menu2medium
      },
      '>=desktop': () => {
        this.menu1 = this.menu1long;
        this.menu2 = this.menu2long;
      }
    });

    // Same as this.mediaContainer.onChange('(orientation: landscape)', { this.orientationFlipCounter++; });
    this.mediaContainer.onChange({
      '(orientation: landscape)': () => { this.orientationFlipCounter++; }
    });
  }

  ngOnDestroy() {
    this.mediaContainer.deregister();
  }
}
