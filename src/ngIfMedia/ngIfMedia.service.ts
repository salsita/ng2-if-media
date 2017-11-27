import { Inject, Injectable } from '@angular/core';
import { CONFIG } from './ngIfMedia.config';
import { QueryParser } from './queryParser';

class ReflectionContainer {
  private service: NgIfMediaService;

  constructor(service: NgIfMediaService) {
    this.service = service;
  }

  public if(query, matchFn) {
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
  throttleTime = 100;
  isThrottling = false;
  resized = false;
  notifyTimeout;
  parser;

  constructor(@Inject(CONFIG) config) {
    this.throttleTime = config.throttleTime;
    this.parser = new QueryParser(config.breakpoints);
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

    const mediaQuery = this.parser.parseQuery(query);
    return window.matchMedia(mediaQuery).matches;
  }

  private sendNotifications() {
    this.notifyReflections();
    this.notifyElements();
  }

  private throttledNotify() {
    if (this.resized) {
      this.sendNotifications();

      this.notifyTimeout = setTimeout(() => {
        this.throttledNotify();
      }, this.throttleTime);
    } else {
      clearTimeout(this.notifyTimeout);
      this.isThrottling = false;
    }

    this.resized = false;
  }

  private onResize() {
    this.resized = true;
    if (!this.isThrottling) {
      this.sendNotifications();
      this.isThrottling = true;
      setTimeout(() => this.throttledNotify(), this.throttleTime);
    }
  }

  public addReflection(container, query, matchFn) {
    const arr = this.reflections.get(container) || [];
    const matches = this.isMedia(query);
    this.reflections.set(container, arr.concat({query, matchFn, matches}));
    matchFn(matches);
  }

  public removeReflection(container) {
    this.reflections.delete(container);
  }

  private notifyReflections() {
    this.reflections.forEach((val, container) => {
      const newVal = [];
      for (const { query, matchFn, matches } of val) {
        const newMatch = this.isMedia(query);
        if (matches !== newMatch) {
          matchFn(newMatch);
        }
        newVal.push({query, matchFn, matches: newMatch});
      }

      this.reflections.set(container, newVal);
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
