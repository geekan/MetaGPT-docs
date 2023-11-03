import { defineConfig } from 'vitepress';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { basename, dirname, resolve } from 'node:path';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'MetaGPT',
  description: 'The Multi-Agent Framework',
  srcDir: './src',
  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo-dark.svg' }],
  ],
  vite: {
    resolve: {
      alias: [{ find: '@/', replacement: `${resolve(__dirname, '../src')}/` }],
    },
    plugins: [
      UnoCSS(),
      AutoImport({
        imports: ['vue'],
      }),
    ],
    server: {
      host: true,
      open: true,
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Docs', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: 'Blog', link: '/blog/', activeMatch: '/blog/' },
      { text: 'RFCs', link: '/rfcs/', activeMatch: '/rfcs/' },
    ],
    logo: {
      light: '/logo-dark.svg',
      dark: '/logo-light.svg',
    },
    sidebar: {
      '/guide/': {
        base: '/guide/',
        items: [
          {
            text: 'Introduction',
            items: [
              { text: 'What is MetaGPT', link: 'introduction' },
              { text: 'Getting Started', link: 'getting-started' },
              { text: 'FAQ', link: 'faq' },
            ],
          },
        ],
      },
    },
    editLink: {
      pattern: 'https://github.com/vuejs/vitepress/edit/main/src/:path',
      text: 'Edit this page on GitHub',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/geekan/MetaGPT' },
      { icon: 'discord', link: 'https://discord.com/invite/wCp6Q3fsAk' },
      { icon: 'x', link: 'https://twitter.com/MetaGPT_' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present alexanderwu',
    },
    search: {
      provider: 'local',
    },
  },
});
