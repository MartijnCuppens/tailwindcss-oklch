import withAlphaVariable from 'tailwindcss/lib/util/withAlphaVariable';
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';
import toColorValue from 'tailwindcss/lib/util/toColorValue';
import plugin from 'tailwindcss/plugin';
import Color from 'colorjs.io';
import utilities from './utilities';

const propertyColors = Object.fromEntries(utilities.map(({ key }) => {
  return [
    [key, `oklch(clamp(0, calc(var(--tw-${key}-l) + var(--tw-${key}-l-offset)), 1) var(--tw-${key}-c) var(--tw-${key}-h) / <alpha-value>)`],
    [`${key}-contrast`, `oklch(clamp(0, calc(var(--tw-infinite) * (var(--tw-lightness-threshold) - var(--tw-${key}-l) - var(--tw-${key}-l-offset))), 1) 0 0 / <alpha-value>)`],
  ];
}).flat());

export default plugin.withOptions(({ contrastThreshold = 0.5 } = {}) => {
  return ({
    matchUtilities, theme, corePlugins, addDefaults,
  }) => {
    addDefaults('infinity', {
      '--tw-infinite': '99999',
      '--tw-lightness-threshold': contrastThreshold.toString(),
    });
    utilities.forEach(({
      key, themeKey, property, selector,
    }) => {
      const base = key.split('-').shift();
      const opacityPlugin = `${base}Opacity`;
      const values = (({ DEFAULT: _, ...colors }) => {
        return colors;
      })(flattenColorPalette(theme(themeKey)));
      const addProperties = (value) => {
        return property.reduce((object, prop) => {
          return { ...object, [prop]: value };
        }, {});
      };

      matchUtilities(
        {
          [key]: (value) => {
            const colorValue = toColorValue(value);
            let color;
            try {
              color = new Color(colorValue);
            }
            catch (error) {
              // Some values can be keywords like inherit.

              // If the color is a oklch function with custom properties (eg. `oklch(var(--color-primary-l) var(--color-primary-c) var(--color-primary-h))`), parse these custom properties.
              const match = colorValue.match(/^oklch\((var\(--[a-z0-9-]+?\)) (var\(--[a-z0-9-]+?\)) (var\(--[a-z0-9-]+?\))(?: \/ (.+))?\)$/i);
              if (match) {
                const [, l, c, h, a] = match;
                color = {
                  oklch: { l, c, h },
                  alpha: Number(a) || 1,
                };
              }
            }
            const result = {};

            // Exclude `transparent` which has a NaN hue value.
            if (color && !Number.isNaN(color.oklch.h)) {
              const { oklch, alpha } = color;
              Object.assign(result, {
                [`--tw-${key}-l`]: oklch.l.toString(),
                [`--tw-${key}-c`]: oklch.c.toString(),
                [`--tw-${key}-h`]: oklch.h.toString(),
                [`--tw-${key}-l-offset`]: '0',
                ...(alpha === 1 && { [`--tw-${base}-opacity`]: alpha.toString() }),
                ...addProperties(`oklch(clamp(0, calc(var(--tw-${key}-l) + var(--tw-${key}-l-offset)), 1) var(--tw-${key}-c) var(--tw-${key}-h) / ${alpha === 1 ? `var(--tw-${base}-opacity)` : alpha.toString()})`),
              });
            } else if (!corePlugins(opacityPlugin)) {
              Object.assign(result, addProperties(colorValue));
            } else {
              Object.assign(result, withAlphaVariable({
                color: value,
                property,
                variable: `--tw-${base}-opacity`,
              }));
            }

            return selector ? { [selector]: result } : result;
          },
        },
        {
          values,
          type: ['color', 'any'],
        },
      );

      matchUtilities(
        {
          [`${base}-lightness-offset`]: (value) => {
            return {
              [`--tw-${base}-l-offset`]: value,
            };
          },
        },
        {
          values: theme('lightnessOffset'),
          type: ['number'],
          supportsNegativeValues: true,
        },
      );
    });
  };
}, () => {
  return {
    theme: {
      oklch: {
        lightness: {
          threshold: 0.6,
        },
      },
      lightnessOffset: {
        0: '0',
        5: '.05',
        10: '.1',
        15: '.15',
        20: '.2',
        25: '.25',
        30: '.3',
        35: '.35',
        40: '.4',
        45: '.45',
        50: '.5',
      },
      extend: {
        colors: propertyColors,
      },
    },
    corePlugins: Object.fromEntries(utilities.map(({ themeKey }) => {
      return [themeKey, false];
    })),
  };
});
