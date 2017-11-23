import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgIfMediaDirective } from './ngIfMedia.directive';
import { NgIfMediaService } from './ngIfMedia.service';
import { defaultConfig } from './default.config';
import { CONFIG } from './ngIfMedia.config';
import { vendorBreakpoints } from './defaultBreakpoints';

@NgModule({
  imports: [
  ],
  providers: [
    NgIfMediaService,
    { provide: CONFIG, useValue: defaultConfig }
  ],
  declarations: [
    NgIfMediaDirective
  ],
  exports: [
    NgIfMediaDirective
  ]
})
export class NgIfMediaModule {
  static withConfig(config): ModuleWithProviders {
    if (config.vendorBreakpoints) {
      config.breakpoints = Object.assign(vendorBreakpoints[config.vendorBreakpoints], config.breakpoints);
    }
    return {
      ngModule: this,
      providers: [
        { provide: CONFIG, useValue: Object.assign(defaultConfig, config) }
      ]
    };
  }
}

export { NgIfMediaService };
