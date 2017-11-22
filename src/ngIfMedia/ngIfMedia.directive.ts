import {
  Directive, Input, OnDestroy, TemplateRef, ViewContainerRef
} from '@angular/core';
import { NgIfMediaService } from './ngIfMedia.service';

@Directive({
  selector: '[ngIfMedia]'
})
export class NgIfMediaDirective implements OnDestroy {
  private media: string;
  private hidden = true;

  @Input()
  set ngIfMedia(query: string) {
    this.media = query;
    this.updateDisplay();
  };

  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              private service: NgIfMediaService) {
    service.register(this);
  }


  onResize() {
    this.updateDisplay();
  }

  updateDisplay() {
    if (this.service.isMedia(this.media)) {
      this.show();
    } else {
      this.hide();
    }
  }

  hide() {
    if (!this.hidden) {
      this.viewContainer.clear();
      this.hidden = true;
    }
  }

  show() {
    if (this.hidden) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hidden = false;
    }
  }

  ngOnDestroy() {
    this.service.deregister(this);
  }
}
