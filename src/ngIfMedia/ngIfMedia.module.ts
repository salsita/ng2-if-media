import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgIfMediaDirective } from './ngIfMedia.directive';
import { NgIfMediaService } from './ngIfMedia.service';
import { defaultBreakpoints } from './defaultBreakpoints';
import { BREAKPOINTS } from './ngIfMedia.config';

@NgModule({
  imports: [
  ],
  providers: [
    NgIfMediaService,
    { provide: BREAKPOINTS, useValue: defaultBreakpoints }
  ],
  declarations: [
    NgIfMediaDirective
  ],
  exports: [
    NgIfMediaDirective
  ]
})
export class NgIfMediaModule {
  static addBreakpoints(breakpoints): ModuleWithProviders {
    return {
      ngModule: this,
      providers: [
        { provide: BREAKPOINTS, useValue: Object.assign(defaultBreakpoints, breakpoints) }
      ]
    };
  }

  static withBreakpoints(breakpoints): ModuleWithProviders {
    return {
      ngModule: this,
      providers: [
        { provide: BREAKPOINTS, useValue: breakpoints }
      ]
    };
  }
}

export { NgIfMediaService };
