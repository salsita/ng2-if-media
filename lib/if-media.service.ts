import { Inject, Injectable } from '@angular/core';
import { CONFIG } from './if-media.config';
import { QueryParser } from './queryParser';

class ReflectionContainer {
  constructor(private service: any, public component: any) {}

  public when(query: any, matchFn: any) {
    this.createReflection(query, matchFn, true);
  }

  public onChange(query: any, matchFn: any) {
    this.createReflection(query, matchFn, false);
  }

  private createReflection(query: any, matchFn: any, onlyWhenMatched: boolean) {
    if (typeof query === 'string') {
      this.singleReflection(query, matchFn, onlyWhenMatched);
    } else if (typeof query === 'object') {
      this.objectReflection(query, onlyWhenMatched);
    } else {
      throw new Error('Unsupported breakpoint parameter, please use a string or an object with breakpoints as keys.');
    }
  }

  private objectReflection(queryObj: any, onlyWhenMatched = false) {
    this.service.addObjectReflection(this, queryObj, onlyWhenMatched);
  }

  private singleReflection(query: any, matchLogic: any, onlyWhenMatched = false) {
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
export class IfMediaService {
  private elements = new Map();
  private reflections = new Map();
  private throttle = 100;
  private isThrottling = false;
  private resized = false;
  private notifyTimeout: any;
  private parser: QueryParser;

  constructor(@Inject(CONFIG) config: any) {
    this.throttle = config.throttle;
    this.parser = new QueryParser(config.breakpoints);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  public register(component: any): {
    when: Function;
    onChange: Function;
    deregister: Function;
  } {
    return new ReflectionContainer({
      addSingleReflection: this.addSingleReflection.bind(this),
      addObjectReflection: this.addObjectReflection.bind(this),
      removeReflection: this.removeReflection.bind(this)
    }, component);
  }

  public isMedia(query: any): boolean {
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
      }, this.throttle);
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
      setTimeout(() => this.throttledNotify(), this.throttle);
    }
  }

  private addSingleReflection(container: any, { query = '', matchFn = (m: boolean) => {}, onlyWhenMatched = false, newState = null }) {
    const arr = this.reflections.get(container) || [];
    const matches = this.isMedia(query);
    this.reflections.set(container, arr.concat({query, matchFn, matches, onlyWhenMatched, newState}));

    const firstLoad = !onlyWhenMatched || matches;
    if (typeof matchFn === 'function' && firstLoad) {
      matchFn(matches);
    }
    if (newState && firstLoad) {
      this.mergeNewState(container.component, newState);
    }
  }

  private addObjectReflection(container: any, queryObj: any, onlyWhenMatched = false) {
    for (const query of Object.keys(queryObj)) {
      const matchLogic = queryObj[query];
      if (typeof matchLogic === 'function') {
        this.addSingleReflection(container, { query, matchFn: matchLogic, onlyWhenMatched } );
      } else if (typeof matchLogic === 'object') {
        this.addSingleReflection(container, { query, newState: matchLogic, onlyWhenMatched });
      }
    }
  }

  private mergeNewState(component: any, newState: any) {
    for (const property of Object.keys(newState)) {
      component[property] = newState[property];
    }
  }

  private removeReflection(container: any) {
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
          if (newState) {
            this.mergeNewState(container.component, newState);
          } else if (matchFn) {
            matchFn(newMatch);
          }
        }

        newVal.push({ query, matchFn, matches: newMatch, onlyWhenMatched, newState });
      }

      this.reflections.set(container, newVal);
    });
  }

  public registerElement(element: any, query: string) {
    this.elements.set(element, query);
    if (this.isMedia(query)) {
      element.show();
    } else {
      element.hide();
    }
  }

  public deregisterElement(element: any) {
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
