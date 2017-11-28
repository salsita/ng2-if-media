import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIfMediaService } from '../ngIfMedia/ngIfMedia.service';

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

  menu1: string;
  menu2: string;

  constructor(private mediaService: NgIfMediaService) {
    this.mediaContainer = this.mediaService.register();
  }

  ngOnInit() {
    this.mediaContainer.if('<=phone', (match) => {
      if (match) {
        this.menu1 = this.menu1short;
        this.menu2 = this.menu2short;
      }
    });

    this.mediaContainer.if('>phone and <desktop', (match) => {
      if (match) {
        this.menu1 = this.menu1medium;
        this.menu2 = this.menu2medium;
      }
    });

    this.mediaContainer.if('>=desktop', (match) => {
      if (match) {
        this.menu1 = this.menu1long;
        this.menu2 = this.menu2long;
      }
    });

  }

  ngOnDestroy() {
    this.mediaContainer.deregister();
  }
}
