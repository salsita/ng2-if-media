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
      throttleTime: 100,
      vendorBreakpoints: ['bootstrap'], // or a string, e.g. 'bootstrap'
      breakpoints: {
        phone: {
          param: 'width',
          value: '400px'
        },
        desktop: {
          param: 'width',
          value: '700px'
        }
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
