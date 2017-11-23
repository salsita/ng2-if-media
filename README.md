# ngIfMedia

A flexible directive/service module for handling media types and queries in Angular 2+, inspired by [include-media](https://include-media.com/) methodology.  
  
Server rendering (universal) compatible.

`npm install --save ng-if-media`

```ts
import { ngIfMediaModule } from 'ngIfMedia';

@NgModule({
  declarations: [ ... ],
  imports: [
    ngIfMediaModule.withConfig({
      breakpoints: {
        tablet: {
          value: '768px',
          param: 'width'
        },
        mobileHeight: {
          value: '667px',
          param: 'height'
        },
        widescreen: {
          value: '1280px',
          param: 'width'
        },
        print: {
          media: 'print'
        },
        landscape: '(orientation: landscape)',
        iPhone5: 'only screen and (min-device-width: 320px) and max-device-width: 568px) and (-webkit-min-device-pixel-ratio: 2)'
      },
      vendorBreakpoints: ['bootstrap'],  // include 3rd party namespace
      debounceTime: 100
    })
  ],
  providers: [ ... ],
  bootstrap: [ ... ]
})
```

## Features

`ngIfMedia` allows enhancing configured breakpoints with `<, >, =` logical operators, allowing expressive yet highly intuitive control over your UI. Passive `resize` updates are handled automatically during the component lifetime with a configurable debounce timer.

```html
<div *ifMedia="<tablet">I will appear below tablet width!</div>
// (max-width: 767px)

<div *ifMedia=">=tablet and landscape">Tablets and above in landscape mode!</div>
// (min-width: 768px) and (orientation: landscape)

<div *ifMedia="<=tablet, landscape">Tablets and below OR landscape mode!</div>
// (max-width: 768px), (orientation: landscape)

<div *ifMedia="print">You will see this on paper IRL.</div>
// @media print
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
  <li *ifMedia="<=tablet and >mobile">
    <h1>And his struggle...</h1>
    <p>to find the smoothest scaling experience ever...</p>
  </li>
  <li *ifMedia="<=mobile">
    <h1>Where every pixel...</h1>
    <p>has a standalone component.</p>
    <img src="lovecraftianhorror.jpg">
  </li>
</ul>
```

Just like in your good old CSS, abstractions can be combined with the `and` keyword or `,` separated and treated as independent junctions. You can also use `width` values directly or create flexible abstractions for other properties in the config.

```html
<span *ifMedia="<576px, >widescreen">
  I go high or I go low.
</span>

<loFiWidget *ifMedia="<=480px and landscape">
  I exist to create a great customer experience for the glorious "landscape" of budget phone users!
</loFiWidget>
```

## Service

Sometimes you need more than showing and hiding some HTML in useful ways. `ngIfMedia` is also available as a service to simplify working with [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) API using the same methodology and configuration as the directive. The callback function is only called once per logical change of the breakpoint result (not with every resize update), allowing some advanced usage.

```html
<h1>Spin to win!</h1>
<strong>x{{orientationFlipCounter}}!</strong>
```

```ts
this.mediaService.if('landscape', () => { this.orientationFlipCounter++; });
```

## Configuration

Coming soon...
