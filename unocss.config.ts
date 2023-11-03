import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
} from 'unocss';

export default defineConfig({
  presets: [
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        height: '1.2em',
        width: '1.2em',
        'vertical-align': 'middle',
      },
    }),
    presetAttributify(),
    presetUno(),
  ],
});
