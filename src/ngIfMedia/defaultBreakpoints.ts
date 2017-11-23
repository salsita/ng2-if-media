export const defaultBreakpoints = {
  phoneW: {
    param: 'width',
    value: '320px'
  },
  phoneH: {
    param: 'height',
    value: '800px'
  },
  mobile: {
    param: 'width',
    value: '667px'
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
  iPhone: 'only screen and (min-device-width : 768px) and (max-device-width : 1024px) and (orientation : portrait)'
};
