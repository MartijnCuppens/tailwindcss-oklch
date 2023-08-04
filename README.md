# Tailwind OKLCH

Brings OKLCH to Tailwind and introduces these helpful utilities:

- Contrast utilities that automatically calculate the contrast color (black/white) of any color in CSS.
- Match utilities that will match the color of a property with another property (e.g. outline color matches the background color), with support for opacity modifiers.
- Lightness offset utilities that darken or lighten colors (e.g. on hover).

## Installation

To use this package, install it via npm:

```shell
npm install tailwindcss-oklch
```

Then, enable the plugin in your Tailwind config:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    require('tailwindcss-oklch')(),
  ],
}
```

## Features

### Contrast utilities

The `text-bg-contrast` class added to an element with the `bg-blue-500` class will set the text color to the contrast color (white or black) of the blue button. If the color of the button changes lightness over time, the contrast color will be recalculated in CSS. Opacity modifiers can be added to change the opacity of the color you're setting. Examples:

- `text-bg-contrast` sets the text color to the contrast color of the background color.
- `text-border-contrast` sets the text color to the contrast color of the border color.
- `bg-border-contrast` sets the background color to the contrast color of the border color.
- `text-bg-contrast/50` sets the text color to the contrast color of the background color with an opacity of 50%.
- `bg-border-contrast/50` sets the background color to the contrast color of the border color with an opacity of 50%.

### Match utilities

The `text-border` class sets the text color to the same color as the border of the element. Other examples:

- `border-text` sets the border color to the text color. The difference with `border-current` is the ability to set opacity or change lightness with additional classes.
- `border-text/50` sets the border color to the text color with an opacity of 50%.

### Lightness offset

The `text-lightness-offset-10` increases the lightness of the text with 10%. Other examples:

- `hover:-bg-lightness-offset-10` darkens the background on hover with 10%.

## Configuration

If you prefer to change the threshold when the contrast color switches to black or white, you can adjust the value of `contrastThreshold`. This value should be somewhere between `0` and `1`. The higher the number, the more likely white will be chosen as the contrast color. While I was working on this plugin, I noticed that a contrast threshold of `.6` looked better on different screens than `.5`, since dark colors seem to have lesser contrast then lighter colors in reality.

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [require('tailwindcss-oklch')({
    contrastThreshold: .5,
  })],
}
```

## Demo

[View the demo site](https://tailwind-oklch.netlify.app).

## Custom properties / CSS variables support

In case you prefer named color names, you can add them in your Tailwind config:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: `oklch(var(--color-primary-l) var(--color-primary-c) var(--color-primary-h) / <alpha-value>)`,
        secondary: `oklch(var(--color-secondary-l) var(--color-secondary-c) var(--color-secondary-h) / <alpha-value>)`,
        success: `oklch(var(--color-success-l) var(--color-success-c) var(--color-success-h) / <alpha-value>)`,
        warning: `oklch(var(--color-warning-l) var(--color-warning-c) var(--color-warning-h) / <alpha-value>)`,
        danger: `oklch(var(--color-danger-l) var(--color-danger-c) var(--color-danger-h) / <alpha-value>)`,
      },
    },
  },
};
```

Afterwards, you can set the separate color values in CSS. Use tools like [oklch.com](https://oklch.com/) to convert your colors. Make sure to use decimals instead of percentages for the lightness, since these are needed to calculate contrast colors.

```css
@layer base {
  :root {
    --color-primary-l: .32;
    --color-primary-c: .1;
    --color-primary-h: 150;
  }
}
```
