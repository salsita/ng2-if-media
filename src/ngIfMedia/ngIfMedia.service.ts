import { Inject, Injectable } from '@angular/core';
import { CONFIG } from './ngIfMedia.config';
import { QueryParser } from './queryParser';

class ReflectionContainer {
  constructor(public service: NgIfMediaService, public component) {}

  public when(query, matchFn) {
    this.createReflection(query, matchFn, true);
  }

  public onChange(query, matchFn) {
    this.createReflection(query, matchFn, false);
  }

  private createReflection(query, matchFn, onlyWhenMatched) {
    if (typeof query === 'string') {
      this.singleReflection(query, matchFn, onlyWhenMatched);
    } else if (typeof query === 'object') {
      this.objectReflection(query, onlyWhenMatched);
    } else {
      throw new Error('Unsupported breakpoint parameter, please use a string or an object with breakpoints as keys.');
    }
  }

  private objectReflection(queryObj, onlyWhenMatched = false) {
    this.service.addObjectReflection(this, queryObj, onlyWhenMatched);
  }

  private singleReflection(query, matchLogic, onlyWhenMatched = false) {
    if (typeof matchLogic === 'function') {
      this.service.addSingleReflection(this, { query, matchFn: matchLogic, onlyWhenMatched });
    } else if (typeof matchLogic === 'object') {
      this.service.addSingleReflection(this, { query, newState: matchLogic, onlyWhenMatched });
    }
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

  public register(component) {
    return new ReflectionContainer(this, component);
  }

  public isMedia(query): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const mediaQuery = this.parser.parseQuery(query);
    return window.matchMedia(mediaQuery).matches;
  }

  private sendNotifications() {
    this.resolveReflections();
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

  public addSingleReflection(container, { query, matchFn = null, onlyWhenMatched = false, newState = null }) {
    const arr = this.reflections.get(container) || [];
    const matches = this.isMedia(query);
    this.reflections.set(container, arr.concat({query, matchFn, matches, onlyWhenMatched, newState}));

    const firstLoad = !onlyWhenMatched || matches;
    if (typeof matchFn === 'function' && firstLoad) {
      matchFn(matches);
    }
    if (newState && firstLoad) {
      this.mergeStateMirror(container.component, newState);
    }
  }

  public addObjectReflection(container, queryObj, onlyWhenMatched = false) {
    for (const query of Object.keys(queryObj)) {
      const matchLogic = queryObj[query];
      if (typeof matchLogic === 'function') {
        this.addSingleReflection(container, { query, matchFn: matchLogic, onlyWhenMatched } );
      } else if (typeof matchLogic === 'object') {
        this.addSingleReflection(container, { query, newState: matchLogic, onlyWhenMatched });
      }
    }
  }

  private mergeStateMirror(component, newState) {
    for (const property of Object.keys(newState)) {
      component[property] = newState[property];
    }
  }

  public removeReflection(container) {
    this.reflections.delete(container);
  }

  private resolveReflections() {
    this.reflections.forEach((val, container) => {
      const newVal = [];

      for (const { query, matchFn, matches: oldMatch, onlyWhenMatched, newState } of val) {
        const newMatch = this.isMedia(query);
        // Don't do anything if the flag didn't change
        if (newMatch === oldMatch) {
          newVal.push({ query, matchFn, matches: newMatch, onlyWhenMatched, newState });
          continue;
        }

        let resolve = false;
        if (onlyWhenMatched && !oldMatch) {
          resolve = true;
        } else if (!onlyWhenMatched) {
          resolve = true;
        }

        if (resolve) {
          if (matchFn) {
            matchFn();
          } else if (newState) {
            this.mergeStateMirror(container.component, newState);
          }
        }

        newVal.push({ query, matchFn, matches: newMatch, onlyWhenMatched, newState });
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
