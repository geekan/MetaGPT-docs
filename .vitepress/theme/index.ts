// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';
import ImageModel from '../../src/components/imgmodel.vue';
import './style.css';
import 'uno.css';
import VueGtag, { pageview } from 'vue-gtag';

export default {
  extends: DefaultTheme,
  Layout: () => {
    const { lang } = useData();
    return [
      h(DefaultTheme.Layout, null, {
        // https://vitepress.dev/guide/extending-default-theme#layout-slots
      }),
      h(ImageModel),
    ];
  },
  enhanceApp({ app, router, siteData }) {
    router.onBeforeRouteChange = (to) => {
      const prefix = /(\/.*\/)(blog|rfcs)\//;
      const matchs = prefix.exec(to);
      if (matchs) {
        nextTick(() => {
          router.go(to.replace(matchs[1], '/'));
        });
        return false;
      }
    };
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
