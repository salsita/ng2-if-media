import { Injectable } from '@angular/core';
import { BreakPointsParser } from './breakpointsParser';


class ReflectionContainer {
  private service: NgIfMediaService;

  constructor(service: NgIfMediaService) {
    this.service = service;
  }

  public on(query, matchFn) {
    this.service.addReflection(this, query, matchFn);
  }

  public deregister() {
    this.service.removeReflection(this);
  }
}

@Injectable()
export class NgIfMediaService {
  elements = new Map();
  reflections = new Map();
  debounceTime = 100;
  inDebounce = false;
  notificationTimeout;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  public register() {
    return new ReflectionContainer(this);
  }

  public isMedia(query): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const mediaQuery = BreakPointsParser.parseQuery(query);
    return window.matchMedia(mediaQuery).matches;
  }

  private onResize() {
    if (this.inDebounce) {
      clearTimeout(this.notificationTimeout);
    }

    this.inDebounce = true;
    this.notificationTimeout = setTimeout(() => {
      this.notifyReflections();
      this.notifyElements();
      this.inDebounce = false;
    }, this.debounceTime);
  }

  public addReflection(container, query, matchFn) {
    const arr = this.reflections.get(container) || [];
    this.reflections.set(container, arr.concat({query, matchFn}));
    matchFn(this.isMedia(query));
  }

  public removeReflection(container) {
    this.reflections.delete(container);
  }

  private notifyReflections() {
    this.reflections.forEach(val => {
      for (const { query, matchFn } of val) {
        matchFn(this.isMedia(query));
      }
    });
  }

  public registerElement(element, query: string) {
    this.elements.set(element, query);
    if (this.isMedia(query)) {
      element.show();
    } else {
      element.hide();
    }
  }

  public deregisterElement(element) {
    this.elements.delete(element);
  }

  private notifyElements() {
    this.elements.forEach((query, el) => {
      if (this.isMedia(query)) {
        el.show();
      } else {
        el.hide();
      }
    });
  }

}
