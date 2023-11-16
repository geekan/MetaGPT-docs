import { defineConfig } from 'vitepress';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { basename, dirname, resolve } from 'node:path';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'MetaGPT',
  description: 'The Multi-Agent Framework',
  srcDir: './src',
  ignoreDeadLinks: true,
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          {
            text: 'Docs',
            link: '/guide/get_started/introduction',
            activeMatch: '/guide/',
          },
          { text: 'Blog', link: '/blog/agents', activeMatch: '/blog/' },
          {
            text: 'RFCs',
            link: '/rfcs/RFC-116-MetaGPT优化方案',
            activeMatch: '/rfcs/',
          },
        ],
        sidebar: {
          '/guide/': {
            base: '/guide/',
            items: [
              {
                text: 'Get Started',
                collapsed: false,
                items: [
                  { text: 'Introduction', link: 'get_started/introduction' },
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
                  {
                    text: 'MultiAgent 101',
                    link: 'tutorials/multi_agent_101.md',
                  },
                  { text: 'Use memories', link: 'tutorials/use_memories.md', },
                  { text: 'Human engagement', link: 'tutorials/human_engagement.md',},
                  { text: 'Think and act', link: 'tutorials/agent_think_act.md' },
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
                        text: 'Researcher',
                        link: 'use_cases/agent/researcher.md',
                      },
                      {
                        text: 'Machine Learning Engineer',
                        link: 'use_cases/agent/ml_engineer.md',
                      },
                      {
                        text: 'Document Assistant',
                      },
                      {
                        text: 'Photographer',
                      },
                      {
                        text: 'Receipt Assistant',
                      },
                      {
                        text: 'Creative',
                        link: 'use_cases/agent/creative.md',
                      },
                    ],
                  },
                  {
                    text: 'MultiAgent',
                    items: [
                      {
                        text: 'Software Company',
                        link: 'use_cases/multi_agent/software_company.md',
                        items: [
                          {
                            text: 'Gallery',
                          },
                        ],
                      },
                      {
                        text: 'Public Square',
                        items: [
                          {
                            text: 'Gallery',
                          },
                        ],
                      },
                      {
                        text: 'Debate',
                        link: 'use_cases/multi_agent/debate.md',
                      },
                      {
                        text: 'Werewolf Game',
                        link: 'use_cases/multi_agent/werewolf_game.md',
                      },
                      {
                        text: 'Minecraft',
                      },
                      {
                        text: 'Virtual Town',
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
                  {
                    text: 'Use your local LLM',
                    link: 'in_depth_guides/use_local_llm.md',
                  },
                ],
              },
              {
                text: 'Contribute',
                collapsed: false,
                items: [
                  {
                    text: 'Contribute guide',
                    link: 'contribute/contribute_guide.md',
                  },
                ],
              },
              {
                text: 'API',
                collapsed: false,
              },
              {
                text: 'FAQ',
                link: 'faq',
              },
            ],
          },
          '/blog/': {
            base: '/blog/',
            items: [{ text: 'Agents', link: 'agents' }],
          },
          '/rfcs/': {
            base: '/rfcs/',
            items: [
              {
                text: 'RFC-116-MetaGPT优化方案',
                link: 'RFC-116-MetaGPT优化方案',
              },
            ],
          },
        },
      },
    },
    zhcn: {
      label: '中文',
      lang: 'zhcn',
      link: '/zhcn/',
      themeConfig: {
        nav: [
          {
            text: '文档',
            link: '/zhcn/guide/get_started/introduction',
            activeMatch: '/zhcn/guide/',
          },
          {
            text: '博客',
            link: '/zhcn/blog/agents',
            activeMatch: '/zhcn/blog/',
          },
          {
            text: 'RFCs',
            link: '/zhcn/rfcs/RFC-116-MetaGPT优化方案',
            activeMatch: '/zhcn/rfcs/',
          },
        ],
        sidebar: {
          '/zhcn/guide/': {
            base: '/zhcn/guide/',
            items: [
              {
                text: '开始',
                collapsed: false,
                items: [
                  { text: '介绍', link: 'get_started/introduction' },
                  { text: '快速开始', link: 'get_started/quickstart' },
                  { text: '安装', link: 'get_started/installation' },
                  { text: '配置', link: 'get_started/setup' },
                ],
              },
              {
                text: '教程',
                collapsed: false,
                items: [],
              },
              {
                text: '示例',
                collapsed: false,
                items: [
                  {
                    text: '智能体',
                    items: [
                      { text: '调研员' },
                      { text: '机器学习工程师' },
                      { text: '文库助手' },
                      { text: '摄影师' },
                      { text: '票据助手' },
                      { text: '创意角色' },
                    ],
                  },
                  {
                    text: '多智能体',
                    items: [
                      {
                        text: '软件公司',
                        items: [
                          {
                            text: '成果集',
                          },
                        ]
                      },
                      {
                        text: '论坛广场',
                        items: [
                          {
                            text: '成果集',
                          },
                        ]
                      },
                      {
                        text: '辩论',
                      },
                      {
                        text: '狼人杀',
                      },
                      {
                        text: 'Minecraft',
                      },
                      {
                        text: '虚拟小镇',
                      },
                    ],
                  },
                ],
              },
              {
                text: '进阶指南',
                collapsed: false,
                items: [
                  { text: '多智能体间通信', },
                  { text: '记忆', },
                  { text: '使用本地LLM', },
                ],
              },
              {
                text: '贡献',
                collapsed: false,
                items: [],
              },
              {
                text: 'API',
                collapsed: false,
              },
              {
                text: '常见问题解答',
                link: 'faq',
              },
            ],
          },
        },
      },
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
    logo: {
      light: '/logo-dark.svg',
      dark: '/logo-light.svg',
    },
    editLink: {
      pattern: 'https://github.com/vuejs/vitepress/edit/main/src/:path',
      text: 'Edit this page on GitHub',
    },
    outline: {
      level: [2, 3],
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
