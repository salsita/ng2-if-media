import { ModuleWithProviders, NgModule } from '@angular/core';
import { IfMediaDirective } from './if-media.directive';
import { IfMediaService } from './if-media.service';
import { defaultConfig } from './default.config';
import { CONFIG } from './if-media.config';
import { vendorBreakpoints } from './breakpoints';

@NgModule({
  imports: [
  ],
  providers: [
    IfMediaService,
    { provide: CONFIG, useValue: defaultConfig }
  ],
  declarations: [
    IfMediaDirective
  ],
  exports: [
    IfMediaDirective
  ]
})
export class IfMediaModule {
  static withConfig(config: any): ModuleWithProviders {
    const mergeVendorBreakpoints = (obj: any, name: string) => {
      if (vendorBreakpoints[name]) {
        return Object.assign(obj, vendorBreakpoints[name]);
      } else {
        throw new Error(`No breakpoints found for vendor '${name}'. Check your IfMedia import config.`);
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
