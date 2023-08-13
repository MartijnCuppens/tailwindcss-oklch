import withAlphaVariable from 'tailwindcss/lib/util/withAlphaVariable';
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';
import toColorValue from 'tailwindcss/lib/util/toColorValue';
import plugin from 'tailwindcss/plugin';
import Color from 'colorjs.io';
import utilities from './utilities';

let space;
const renderColor = ({key, l = `clamp(0%, calc(var(--tw-${key}-l) + var(--tw-${key}-l-offset)), 100%)`, c = `var(--tw-${key}-c)`, h = `var(--tw-${key}-h)`, a = `var(--tw-${key}-a)`, b = `var(--tw-${key}-b)`, alpha}) => {
  if (space.endsWith('lab')) {
    return `${space}(${l} ${a} ${b}${alpha ? ` / ${alpha}` : ''})`;
  }
  return `${space}(${l} ${c} ${h}${alpha ? ` / ${alpha}` : ''})`;
};

export default plugin.withOptions(({contrastThreshold = '60%', precision = 6, colorSpace = 'oklch'} = {}) => {
  space = colorSpace;
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
      const values = (({DEFAULT: _, ...colors}) => {
        return colors;
      })(flattenColorPalette(theme(themeKey)));
      const addProperties = (value) => {
        return property.reduce((object, prop) => {
          return {...object, [prop]: value};
        }, {});
      };

      // Round numbers and turn NaN into 0.
      // NaN occurs for the hue gray colors, that also have a chroma of 0,
      // so we can safely set the hue to 0 instead of NaN.
      const round = (value) => {
        return (value || 0).toFixed?.(precision).replace(/\.?0+$/, '') || value;
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

              // If the color is an oklch function with custom properties (eg. `oklch(var(--color-primary-l) var(--color-primary-c) var(--color-primary-h))`), parse these custom properties.
              const match = colorValue.match(/^(oklch|lch|lab|oklab)\((var\(--[a-z0-9-]+?\)) (var\(--[a-z0-9-]+?\)) (var\(--[a-z0-9-]+?\))(?: \/ (.+))?\)$/i);
              if (match) {
                const [, cp, l, c, h, alpha] = match;
                if (space === cp) {
                  // Depending on which color space we're using, a & b, or c & h are used.
                  const [a, b] = [c, h];
                  color = {
                    [space]: {l, c, h, a, b}, // Just pass everything here, only the needed values will be used.
                    alpha: Number(alpha) || 1,
                  };
                }
              }
            }
            const result = {};

            if (color?.[space] && colorValue !== 'transparent') {
              const colorKeys = space.endsWith('ab') ? ['a', 'b'] : ['c', 'h'];
              Object.assign(result, {
                [`--tw-${key}-l`]: `${round(space.endsWith('ab') ? color[space].l : color[space].l * 100)}%`,
                ...Object.fromEntries(colorKeys.map(v => [`--tw-${key}-${v}`, round(color[space][v])])),
                [`--tw-${key}-l-offset`]: '0%',
                ...(color.alpha === 1 && {[`--tw-${base}-opacity`]: color.alpha.toString()}),
                ...addProperties(renderColor({key, alpha: color.alpha === 1 ? `var(--tw-${base}-opacity)` : color.alpha.toString()})),
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

            return selector ? {[selector]: result} : result;
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
      lightnessOffset: {
        0: '0%',
        5: '5%',
        10: '10%',
        15: '15%',
        20: '20%',
        25: '25%',
        30: '30%',
        35: '35%',
        40: '40%',
        45: '45%',
        50: '50%',
      },
      extend: {
        colors: Object.fromEntries(utilities.map(({key}) => {
          return [
            [
              key,
              renderColor({
                  key,
                  c: `var(--tw-${key}-c)`,
                  h: `var(--tw-${key}-h)`,
                  a: `var(--tw-${key}-a)`,
                  b: `var(--tw-${key}-b)`,
                  alpha: '<alpha-value>',
                },
              )],
            [
              `${key}-contrast`,
              renderColor({
                  l: `clamp(0%, calc(var(--tw-infinite) * (var(--tw-lightness-threshold) - var(--tw-${key}-l) - var(--tw-${key}-l-offset))), 100%)`,
                  c: 0,
                  h: 0,
                  a: 0,
                  b: 0,
                  alpha: '<alpha-value>',
                },
              )],
          ];
        }).flat()),
      },
    },
    corePlugins: Object.fromEntries(utilities.map(({themeKey}) => {
      return [themeKey, false];
    })),
  };
});
