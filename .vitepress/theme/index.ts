// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import type { Theme } from 'vitepress';
// import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';
import ImageModel from '../../src/components/imgmodel.vue';
import './style.css';
import 'uno.css';
import VueGtag, { pageview } from 'vue-gtag';
import DefaultTheme from './Layout.vue';

export default {
  Layout: () => {
    const { lang } = useData();
    return [
      h(DefaultTheme, null, {
        // https://vitepress.dev/guide/extending-default-theme#layout-slots
      }),
      h(ImageModel),
    ];
  },
  enhanceApp({ app, router, siteData }) {
    if (import.meta.env.PROD) {
      app.use(VueGtag, {
        config: {
          id: 'G-3VPC3Q6LD0',
        },
      });
      router.onAfterRouteChanged = (to) => {
        pageview({
          page_path: to,
        });
      };
    }
  },
} satisfies Theme;
