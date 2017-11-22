import { NgModule } from '@angular/core';
import { NgIfMediaDirective } from './ngIfMedia.directive';
import { NgIfMediaService } from './ngIfMedia.service';

@NgModule({
  imports: [
  ],
  providers: [
    NgIfMediaService
  ],
  declarations: [
    NgIfMediaDirective
  ],
  exports: [
    NgIfMediaDirective
  ]
})
export class NgIfMediaModule { }

export { NgIfMediaService };
