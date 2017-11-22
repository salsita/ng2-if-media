import { Injectable } from '@angular/core';
import { NgIfMediaDirective } from './ngIfMedia.directive';

import { breakpoints } from './breakpoints';
import { BreakPointsParser } from './breakpointsParser';

@Injectable()
export class NgIfMediaService {
  elements: Set<NgIfMediaDirective> = new Set();
  debounceTime = 100;
  inDebounce = false;
  notificationTimeout;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.notifyElements.bind(this));
    }
  }

  public isMedia(query): boolean {
    const mediaQuery = BreakPointsParser.parseQuery(query);
    return typeof window !== 'undefined' && window.matchMedia(mediaQuery).matches;
  }

  public register(element: NgIfMediaDirective) {
    this.elements.add(element);
  }

  public deregister(element: NgIfMediaDirective) {
    this.elements.delete(element);
  }

  private notifyElements() {
    if (this.inDebounce) {
      clearTimeout(this.notificationTimeout);
    }

    this.inDebounce = true;
    this.notificationTimeout = setTimeout(() => {
      this.elements.forEach(el => {
        el.onResize();
        this.inDebounce = false;
      });
    }, this.debounceTime);
  }

}
