import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgIfMediaDirective } from './ng-if-media.directive';
import { NgIfMediaService } from './ng-if-media.service';
import { defaultConfig } from './default.config';
import { CONFIG } from './ng-if-media.config';
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
    const mergeVendorBreakpoints = (obj, name) => {
      if (vendorBreakpoints[name]) {
        return Object.assign(obj, vendorBreakpoints[name]);
      } else {
        throw new Error(`No breakpoints found for vendor '${name}'. Check your NgIfMedia import config.`);
      }
    };

    const { breakpoints: customBreakpoints = {}, vendorBreakpoints: vendorNames = [] } = config;

    if (Array.isArray(vendorNames)) {
      config.breakpoints = vendorNames.reduce(mergeVendorBreakpoints, {});
    } else {
      config.breakpoints = mergeVendorBreakpoints({}, vendorNames);
    }

    // Custom breakpoints should always override vendors
    config.breakpoints = Object.assign(config.breakpoints, customBreakpoints);

    return {
      ngModule: this,
      providers: [
        { provide: CONFIG, useValue: Object.assign(defaultConfig, config) }
      ]
    };
  }
}

export { NgIfMediaService };
