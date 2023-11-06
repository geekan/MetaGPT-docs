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
        dts: '../auto-imports.d.ts',
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
      { text: 'Blog', link: '/blog/agents', activeMatch: '/blog/' },
      { text: 'RFCs', link: '/rfcs/demo', activeMatch: '/rfcs/' },
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
            text: 'Get Started',
            collapsed: false,
            items: [
              { text: 'Quickstart', link: 'get_started/quickstart' },
              { text: 'Installation', link: 'get_started/installation' },
              { text: 'Setup', link: 'get_started/setup' },
            ],
          },
          {
            text: 'Tutorials',
            collapsed: false,
            items: [
              { text: 'Concepts', link: 'tutorials/concepts.md' },
              { text: 'Agent 101', link: 'tutorials/agent_101.md' },
              { text: 'MultiAgent 101', link: 'tutorials/multi_agent_101.md' },
              { text: 'Use memories' },
              { text: 'Customize thinking process' },
            ],
          },
          {
            text: 'Use Cases',
            collapsed: false,
            items: [
              {
                text: 'Agent',
                items: [
                  {
                    text: 'Data analyst: analyze and visualize datasets',
                    link: 'use_cases/agent/data_analyst.md',
                  },
                  {
                    text: 'Researcher: search web and write reports',
                    link: 'use_cases/agent/researcher.md',
                  },
                ],
              },
              {
                text: 'MultiAgent',
                items: [
                  {
                    text: 'Software company: develop softwares in a line',
                    link: 'use_cases/multi_agent/software_company.md',
                  },
                  {
                    text: 'Werewolf game: agents playing strategy games',
                    link: 'use_cases/multi_agent/werewolf_game.md',
                  },
                ],
              },
            ],
          },
          {
            text: 'In-Depth Guides',
            collapsed: false,
            items: [
              {
                text: 'Agent communication',
                link: 'in_depth_guides/agent_communication.md',
              },
              { text: 'Memory', link: 'in_depth_guides/memory.md' },
            ],
          },
          {
            text: 'Contribute',
            collapsed: false,
            items: [
              {
                text: 'contribute_guide',
                link: 'contribute/contribute_guide.md',
              },
            ],
          },
          {
            text: 'API',
            collapsed: false,
          },
        ],
      },
      '/blog/': {
        base: '/blog/',
        items: [{ text: 'Agents', link: 'agents' }],
      },
      '/rfcs/': {
        base: '/rfcs/',
        items: [{ text: 'demo', link: 'demo' }],
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
