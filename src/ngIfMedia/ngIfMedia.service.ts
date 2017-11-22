import { Injectable } from '@angular/core';
import { NgIfMediaDirective } from './ngIfMedia.directive';
import { BreakPointsParser } from './breakpointsParser';

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

  public addReflection(component, { query, success = () => {}, failure = () => {} }) {
    const arr = this.reflections.get(component) || [];
    this.reflections.set(component, arr.concat({ query, success, failure }));
  }

  public removeReflection(component) {
    this.reflections.delete(component);
  }

  private notifyReflections() {
    this.reflections.forEach(val => {
      for (const { query, success, failure } of val) {
        if (this.isMedia(query)) {
          success();
        } else {
          failure();
        }
      }
    });
  }

  public register(element: NgIfMediaDirective, query: string) {
    this.elements.set(element, query);
    if (this.isMedia(query)) {
      element.show();
    } else {
      element.hide();
    }
  }

  public deregister(element: NgIfMediaDirective) {
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
