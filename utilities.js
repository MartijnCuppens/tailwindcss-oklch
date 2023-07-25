export default [
  {
    key: 'divide',
    themeKey: 'divideColor',
    property: ['border-color'],
    selector: '& > :not([hidden]) ~ :not([hidden])',
  },
  {
    key: 'bg',
    themeKey: 'backgroundColor',
    property: ['background-color'],
  },
  {
    key: 'border',
    themeKey: 'borderColor',
    property: ['border-color'],
  },
  {
    key: 'border-x',
    themeKey: 'borderColor',
    property: ['border-left-color', 'border-right-color'],
  },
  {
    key: 'border-y',
    themeKey: 'borderColor',
    property: ['border-top-color', 'border-bottom-color'],
  },
  {
    key: 'border-s',
    themeKey: 'borderColor',
    property: ['border-inline-start-color'],
  },
  {
    key: 'border-e',
    themeKey: 'borderColor',
    property: ['border-inline-end-color'],
  },
  {
    key: 'border-t',
    themeKey: 'borderColor',
    property: ['border-top-color'],
  },
  {
    key: 'border-r',
    themeKey: 'borderColor',
    property: ['border-right-color'],
  },
  {
    key: 'border-b',
    themeKey: 'borderColor',
    property: ['border-bottom-color'],
  },
  {
    key: 'border-l',
    themeKey: 'borderColor',
    property: ['border-left-color'],
  },
  {
    key: 'text',
    themeKey: 'textColor',
    property: ['color'],
  },
  {
    key: 'placeholder',
    themeKey: 'placeholderColor',
    property: ['color'],
    selector: '&::placeholder',
  },
  {
    key: 'outline',
    themeKey: 'outlineColor',
    property: ['outline-color'],
  },
  {
    key: 'ring',
    themeKey: 'ringColor',
    property: ['--tw-ring-color'],
    selector: '&::placeholder',
  },
  {
    key: 'ring-offset',
    themeKey: 'ringOffsetColor',
    property: ['--tw-ring-offset-color'],
  },
];
