# ngIfMedia

A flexible directive/service module for handling media types and queries in Angular 2+, inspired by [include-media](https://include-media.com/).  
  
Server rendering ([Universal](https://universal.angular.io/)) compatible.

`npm install --save ng-if-media`

```ts
import { NgIfMediaModule } from 'ng-if-media';

const mediaConfig = {
  breakpoints: {
    tablet: {
      value: '768px',
      param: 'width'
    },
    budgetHeight: {
      value: '480px',
      param: 'height'
    },
    widescreen: {
      value: '1280px',
      param: 'width'
    },
    print: {
      media: 'print'
    },
    landscape: '(orientation: landscape)'
  },
  vendorBreakpoints: ['bootstrap'],  // include 3rd party namespace
  debounceTime: 100
};

@NgModule({
  imports: [NgIfMediaModule.withConfig(mediaConfig)]
})
```

## Features

`ngIfMedia` allows using preconfigured breakpoints with `<, >, =` logical operators, enabling expressive and readable control over your application UI. Passive `resize` updates are handled automatically during the component lifetime with a configurable debounce timer.

```html
<div *ifMedia="<tablet">I will appear below tablet width!</div>
<!-- (max-width: 767px) -->

<div *ifMedia=">=tablet and landscape">Tablets and above in landscape mode!</div>
<!-- (min-width: 768px) and (orientation: landscape) -->

<div *ifMedia="<=tablet, landscape">Tablets and below OR landscape mode!</div>
<!-- (max-width: 768px), (orientation: landscape) -->

<div *ifMedia="print">You will see this on paper IRL.</div>
<!-- (only) print -->
```

## Directive

When used as an attribute directive, `ngIfMedia` works just like `ngIf` by showing or hiding elements based on the active media query. It's therefore compatible with the [void](https://angular.io/guide/animations#the-void-state) state of native Angular 2+ animations.

```html
<nav class="desktop-nav" *ifMedia=">mobile">
  ...
</nav>

<nav class="burger-nav" *ifMedia="<=mobile">
  <ul>
    <li>About Us</li>
    <li>About You</li>
    <li>About Them</li>
  </ul>
</nav>
```

```html
<ul>
  <li *ifMedia=">tablet">
    <h1>This is a story...<h1>
    <p>of a man with many devices.</p>
    <audioPlayer play="runningman">
  </li>
  <li *ifMedia="<=tablet and >phone">
    <h1>And his struggle...</h1>
    <p>to find the smoothest scaling experience ever...</p>
  </li>
  <li *ifMedia="<=phone">
    <h1>Where every pixel...</h1>
    <p>has a standalone component.</p>
    <img src="lovecraftianhorror.jpg">
  </li>
</ul>
```

Just like in your good old CSS, abstractions can be combined with the `and` keyword or `,` separated and treated as independent junctions. You can also use `width` values directly or create abstractions for other properties in the config.

```html
<span *ifMedia="<576px, >widescreen">
  I go high or I go low.
</span>

<loFiWidget *ifMedia="<=budgetHeight and landscape">
  I exist to create a great customer experience for the glorious "landscape" of budget phone users!
</loFiWidget>
```

## Service

Sometimes you need more than showing and hiding some HTML in useful ways. `ngIfMedia` is also available as a service to simplify working with [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) API using the same methodology and configuration as the directive.

```jsx
import { NgIfMediaService } from 'ng-if-media';

export class AppComponent implements OnInit, OnDestroy {
  mediaContainer;

  constructor(private mediaService: NgIfMediaService) {
    this.mediaContainer = this.mediaService.register();
  }

  ngOnDestroy() {
    this.mediaContainer.deregister();
  }
}
```

```jsx
<a routerLink="/register">{{ message }}</a>

const messageSmall = 'Tap to win great stuff!';
const messageBig = 'Click here to win the greatest prizes of all time in history!';
this.mediaContainer.when('<768px', (match) => { this.message = match ? messageSmall : messageBig });
```

The callback function is only called once per logical change of the breakpoint result (not with every resize update), allowing some advanced usage.

```jsx
// component.html
<h1>Spin to win!</h1>
<strong>x{{orientationFlipCounter}}!</strong>

// component.ts
this.mediaService.when('landscape', () => { this.orientationFlipCounter++; });
```

## Configuration

By default, `ngIfMedia` has no abstract configuration and you can use it freely with direct values (eg. `<=640px`). Since project designs tend to be specific and hard to generalize among the everchanging pool of devices, supplying your own custom breakpoints is the most expected usecase.

You can either create smart breakpoints that utilize `<, >, =` logical operators, specify media types, append static parameters and configure `<, >` split precision:

```js
breakpoints: {
  vga: {
    value: '640px',
    param: 'width',
    media: 'screen',
    suffix: '(aspect-ratio: 4/3)'
  },
  retina2: {
    value: '2dppx',
    param: 'resolution',
    precision: 0.01
  }
```

Or handle any other usecase with static string expressions (cannot use operators):

```js
breakpoints: {
  landscape: '(orientation: landscape)',
  iPhone5: 'screen and (min-width: 320px) and (max-width: 568px) and (-webkit-min-device-pixel-ratio: 2)'
}
```

Presets are available for 3rd party methodologies (currently for [Bootstrap 4](https://v4-alpha.getbootstrap.com/layout/overview/#responsive-breakpoints)) and optionally extend the custom configuration. Resize update debounce timer is also configurable.

```js
breakpoints: { ... },
vendorBreakpoints: ['bootstrap'],
debounceTime: 16.7
```


-----
Created with :muscle: in [Salsita](https://www.salsitasoft.com/)!
