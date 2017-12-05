[![Dependency Status](https://img.shields.io/david/salsita/ng2-if-media.svg)](https://david-dm.org/salsita/ng2-if-media)
[![devDependency Status](https://img.shields.io/david/dev/salsita/ng2-if-media.svg)](https://david-dm.org/salsita/ng2-if-media?type=dev)
![Downloads](https://img.shields.io/npm/dm/ng2-if-media.svg?style=flat)
![Licence](https://img.shields.io/npm/l/ng2-if-media.svg?style=flat)
[![Known Vulnerabilities](https://snyk.io/test/github/salsita/ng2-if-media/badge.svg)](https://snyk.io/test/github/salsita/ng2-if-media)

# ng2-if-media

A flexible directive/service module for handling media types and queries in Angular 2+, inspired by [include-media](https://include-media.com/).  
  
Server rendering ([Universal](https://universal.angular.io/)) compatible.

![ng2-if-media](demo/ng2-if-media.gif)

## Installation

`npm install --save ng2-if-media`

```ts
import { IfMediaModule } from 'ng2-if-media';

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
  throttle: 100
};

@NgModule({
  imports: [IfMediaModule.withConfig(mediaConfig)]
})
```

## Features

`ng2-if-media` allows using preconfigured breakpoints with `<, >, =` logical operators, enabling expressive and readable control over your responsive web-application UI. Window `resize` updates are handled automatically during the component lifetime with a configurable throttle timer.

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

When used as an attribute directive, `ng2-if-media` works just like `ngIf` by showing or hiding elements based on the active media query. It's therefore compatible with the [void](https://angular.io/guide/animations#the-void-state) state of native Angular 4+ animation engine.

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

Following CSS, abstractions can be combined with the `and` keyword or comma separated and treated as independent junctions. You can also use `width` values directly or create breakpoints for other properties in the config.

```html
<span *ifMedia="<576px, >widescreen">
  I go high or I go low.
</span>

<loFiWidget *ifMedia="<=budgetHeight and landscape">
  I exist to create a great customer experience for the glorious "landscape" of budget phone users!
</loFiWidget>
```

## Service

Sometimes you need more granularity than just showing and hiding some HTML. `ng2-if-media` is also available as a service to simplify working with [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) API and related window events using the same methodology and configuration as the directive.

```jsx
import { IfMediaService } from 'ng2-if-media';

export class AppComponent implements OnDestroy {
  mediaContainer;

  constructor(private mediaService: IfMediaService) {
    this.mediaContainer = this.mediaService.register(this);
  }

  ngOnDestroy() {
    this.mediaContainer.deregister();
  }
}
```

### onChange

The `onChange` method provides the functional jackhammer for media specific application logic, where the media expression result is passed to the callback as an optional parameter.

```jsx
// component.html
<a routerLink="/register">{{ message }}</a>

// component.ts
const messageSmall = 'Tap to win great stuff!';
const messageBig = 'Click here to win the greatest prizes of all time in history!';
this.mediaContainer.onChange('<768px', (match) => { this.message = match ? messageSmall : messageBig });
```

The callback is executed once for every time the media expression result is flipped, allowing some advanced usage.

```jsx
// component.html
<h1>Spin to win!</h1>
<strong>x{{orientationFlipCounter}}!</strong>

// component.ts
this.mediaContainer.onChange('landscape', () => { this.orientationFlipCounter++; });
```

### when

`when` method executes its callback only once for every time the media expression evaluates to `true`.

```jsx
this.mediaContainer.when('landscape', () => {
  alert('Switching back to portrait is $2.24 monthly. - Comcast');
})
```

To make things practically simple, you can pass an object of properties to change in the current component `this` context instead.

```jsx
// component.html
<p>{{text}}</p>

// component.ts
text: string = 'Default message';
this.mediaContainer.when({
  '<=phone': { 'text': 'Text for phones' },
  '>phone and <desktop': { 'text': 'Longer text for some other devices' },
  '>=desktop': { 'text': 'Funny retro-viral message for Wizards in 8bit|4K' }
})
```

## Configuration

By default, `ng2-if-media` has no abstract configuration and you can use it freely with direct values (eg. `<=640px`) or 3rd party presets. Since project requirements can get very specific, supplying your own custom breakpoints is the most expected usecase.

You can either create flexible breakpoints that utilize `<, >, =` logical operators (with precision), specify media types and append static suffixes:

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
}
```

Or handle any other usecase with static string expressions (which cannot use operators):

```js
breakpoints: {
  landscape: '(orientation: landscape)',
  iPhone5: 'screen and (min-width: 320px) and (max-width: 568px) and (-webkit-min-device-pixel-ratio: 2)'
}
```

### Presets

Presets are available for 3rd party methodologies (currently for [Bootstrap 4](https://v4-alpha.getbootstrap.com/layout/overview/#responsive-breakpoints)) and optionally extend the custom configuration. Resize update throttle timer is also configurable (default `100`).

Note: Bootstrap methodology is incompatible with logical operators, due to `xs` and `sm` being the same 576px breakpoint with opposite orientation. The namespace is only available as static expressions, just like in Bootstrap itself. 

```js
breakpoints: { ... },
vendorBreakpoints: ['bootstrap'],
throttle: 16.7
```


## Building from code

```
$ git clone git@github.com:salsita/ng2-if-media.git
$ cd ng2-if-media
$ npm i
```

The module library code is in `src/ng2-if-media/neg-if-media.module.ts`.

```
$ npm run lint   # to lint the code
$ npm test       # to run the tests
$ npm run build  # to build
```

## Licence

MIT License

Copyright (c) 2017 Salsita Software

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

-----
Created with :muscle: in [Salsita](https://www.salsitasoft.com/)!
