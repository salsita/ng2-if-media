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
      defaultBreakpoints: true,
      breakpoints: {
        phoneH: {
          value: '300px',
          param: 'height'
        }
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
