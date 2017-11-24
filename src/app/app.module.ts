import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgIfMediaModule } from '../ngIfMedia/ngIfMedia.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgIfMediaModule.withConfig({
      debounceTime: 100,
      vendorBreakpoints: ['bootstrap'], // or a string, e.g. 'bootstrap'
      breakpoints: {
        phoneW: {
          param: 'width',
          value: '320px'
        },
        phoneH: {
          param: 'height',
          value: '800px'
        },
        mobile: {
          param: 'width',
          value: '667px'
        },
        tablet: {
          param: 'width',
          value: '768px'
        },
        smallScreenW: {
          param: 'width',
          value: '960px'
        },
        desktopW: {
          param: 'width',
          value: '1024px'
        },
        widescreenW: {
          param: 'width',
          value: '1140px'
        },
        retina3x: {
          param: 'device-pixel-ratio',
          value: 2,
          precision: .1
        },
        phonePortraitH: {
          param: 'height',
          value: 800,
          unit: 'px',
          suffix: '(orientation: portrait)'
        },
        landscape: '(orientation: landscape)',
        iPhone6: 'screen and (min-device-width : 375px) and (max-device-width : 667px)',
        iPhone: 'only screen and (min-device-width : 768px) and (max-device-width : 1024px)'
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
