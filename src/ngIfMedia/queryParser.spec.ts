import { QueryParser } from './queryParser';
import { async } from '@angular/core/testing';

const breakpoints = {
  phoneW: {
    param: 'width',
    value: '320px'
  },
  phoneH: {
    param: 'height',
    value: '800px'
  },
  mobile: {
    media: 'screen',
    param: 'width',
    value: '667px'
  },
  braille: {
    media: 'braille'
  },
  tablet: {
    param: 'width',
    value: '768px'
  },
  smallScreenW: {
    param: 'width',
    value: '960px'
  },
  desktopW: {
    param: 'width',
    value: '1024px'
  },
  widescreenW: {
    param: 'width',
    value: '1140px'
  },
  retina3x: {
    param: 'device-pixel-ratio',
    value: 2,
    precision: .1
  },
  phonePortraitH: {
    param: 'height',
    value: 800,
    unit: 'px',
    suffix: '(orientation: portrait)'
  },
  landscape: '(orientation: landscape)',
  iPhone: 'only screen and (min-device-width : 768px) and (max-device-width : 1024px) and (orientation : portrait)'
};

const parser = new QueryParser(breakpoints);
// console.log(parser.parseQuery('<=10.30002em and <widescreenW, braille and <retina3x and <phonePortraitH'));
describe('QueryParser', () => {
  it('should let use breakpoints with no media type and with some media type together', async(() => {
    const result = parser.parseQuery('braille and tablet');
    expect(result).toBeTruthy();
  }));

  it('should use proper precision with each query', async(() => {
    const result = parser.parseQuery('<=10.30002em and <widescreenW, braille and <retina3x and <phonePortraitH');
    expect(result).toBe('(max-width: 10.30002em) and (max-width: 1139px),braille and (max-device-pixel-ratio: 1.9) and (max-height: 799.9) and (orientation: portrait)');
  }));

  it('should add media to the beginning', async(() => {
    const result = parser.parseQuery('braille, tablet');
    const prefix = result.match(/braille and /);
    expect(prefix).toBeTruthy();
  }));

  it('should throw error when breakpoints with 2 different media types are present', async(() => {
    expect(() => parser.parseQuery('braille and mobile')).toThrowError();
  }));
});
