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
                  { text: 'Use memories', link: 'tutorials/use_memories.md' },
                  { text: 'Human engagement' },
                  {
                    text: 'Think and act',
                    link: 'tutorials/agent_think_act.md',
                  },
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
                        text: 'Researcher: search web and write reports',
                        link: 'use_cases/agent/researcher.md',
                      },
                      {
                        text: 'Machine Learning Engineer: analyze, visualize, and model datasets',
                        link: 'use_cases/agent/ml_engineer.md',
                      },
                      {
                        text: 'Document Assistant: retrieval-augmented generation (RAG)',
                      },
                      {
                        text: 'Photographer: generate images with prompts',
                      },
                      {
                        text: 'Receipt Assistant: extract structured info from Receipts',
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
                        text: 'Software Company: develop softwares in a line',
                        link: 'use_cases/multi_agent/software_company.md',
                        items: [
                          {
                            text: 'Gallery',
                          },
                        ],
                      },
                      {
                        text: 'Public Square: agents gather for a chat',
                        items: [
                          {
                            text: 'Gallery',
                          },
                        ],
                      },
                      {
                        text: 'Werewolf: agents playing strategy games',
                        link: 'use_cases/multi_agent/werewolf_game.md',
                      },
                      {
                        text: 'Minecraft: agents collectively explore the world',
                      },
                      {
                        text: 'Virtual Town: daily life of an agent community',
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
                    text: '单智能体',
                    items: [
                      { text: '调研员：通过网页搜索撰写调研报告' },
                      { text: '机器学习工程师：数据分析、可视化、建模' },
                      { text: '文库助手：检索增强生成（RAG）' },
                      { text: '摄影师：以文生图' },
                      { text: '票据助手：从票据抽取结构化信息' },
                      { text: '创意角色' },
                    ],
                  },
                  {
                    text: '多智能体',
                    items: [],
                  },
                ],
              },
              {
                text: '进阶指南',
                collapsed: false,
                items: [],
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
