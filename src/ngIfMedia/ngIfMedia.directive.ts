import {
  Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef
} from '@angular/core';
import { NgIfMediaService } from './ngIfMedia.service';

@Directive({
  selector: '[ngIfMedia]'
})
export class NgIfMediaDirective implements OnDestroy, OnInit {
  private media: string;
  private hidden = true;

  @Input()
  set ngIfMedia(query: string) {
    this.media = query;
  }

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private mediaService: NgIfMediaService) {}

  ngOnInit() {
    this.mediaService.registerElement(this, this.media);
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
    this.mediaService.deregisterElement(this);
  }
}
