import { DefaultTheme, defineConfig } from 'vitepress';
import UnoCSS from 'unocss/vite';
import VueTsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import { resolve, join } from 'node:path';
import {
  existsSync,
  cpSync,
  readdirSync,
  statSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
} from 'node:fs';
import { simpleGit } from 'simple-git';
import {
  getPrevVerBranch,
  getCurrentBranch,
  genDiffFile,
} from '../src/utils/gendifffile';

const Logo = `
<svg  viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<path
  fill-rule="evenodd"
  clip-rule="evenodd"
  d="M8.33877 6.97316C8.97527 3.56271 11.6838 1.00049 14.9286 1.00049C18.6462 1.00049 21.6599 4.36381 21.6599 8.51269C21.6599 10.9593 20.6119 13.1327 18.9895 14.5043L18.9727 14.528L15.7185 10.4604L18.5629 8.70356C18.5921 8.49519 18.6072 8.28163 18.6072 8.06414C18.6072 5.79681 16.9603 3.95876 14.9286 3.95876C12.9845 3.95876 11.3926 5.64188 11.2591 7.77367C10.3751 7.31745 9.38651 7.03546 8.33877 6.97316ZM6.83334 7.86324C6.16814 7.91547 5.55144 8.03704 5.01187 8.20267C2.20636 9.06398 -0.127176 11.8673 0.351758 15.5281C0.618955 17.5704 1.87441 19.0056 3.25869 19.8857C4.61954 20.7508 6.23191 21.1718 7.58197 21.1718L8.36564 17.3286C7.18834 17.59 5.86137 17.5904 5.04704 17.0728C4.25614 16.5699 3.76327 15.9085 3.65694 15.0957C3.41201 13.2235 4.56287 11.8273 5.99017 11.3892C7.57464 10.9027 10.3016 11.0183 12.229 13.5965C12.3266 13.7271 12.4232 13.8565 12.5188 13.9846C12.6473 14.1566 12.7741 14.3264 12.8993 14.4937H12.8988C13.488 15.2294 14.1404 16.1023 14.9171 17.1417L15.1002 17.3867C17.3152 20.3496 20.2896 21.2231 22.728 21.148C18.9572 20.8073 16.3297 17.0874 14.5684 14.495H14.5694C12.7164 11.6987 11.5497 10.0436 9.24324 8.66372C8.35961 8.13507 7.49441 7.93077 6.83334 7.86324ZM23.0881 21.1299C22.4215 21.0672 21.5368 20.8658 20.6327 20.325C18.3266 18.9454 17.1599 17.2906 15.3074 14.495H15.3084C13.551 11.9082 10.9308 8.19753 7.17241 7.84294C9.62881 7.74111 12.6538 8.59776 14.8988 11.6008L15.0818 11.8457C15.8586 12.8851 16.511 13.758 17.1002 14.4937H17.0997C17.2249 14.661 17.3517 14.8308 17.4802 15.0029C17.5758 15.1309 17.6724 15.2603 17.77 15.3909C19.6974 17.9691 22.4244 18.0847 24.0088 17.5983C25.4362 17.1601 26.587 15.7639 26.3421 13.8917C26.2358 13.079 25.7429 12.4175 24.952 11.9147C24.1376 11.397 22.8107 11.3974 21.6334 11.6588L22.417 7.81561C23.7671 7.81561 25.3795 8.2366 26.7403 9.10175C28.1246 9.9818 29.3801 11.417 29.6473 13.4593C30.1262 17.1201 27.7927 19.9234 24.9871 20.7848C24.4267 20.9568 23.7829 21.0813 23.0881 21.1299ZM15.0536 27.9843C18.3582 27.9843 21.1066 25.3268 21.6765 21.8223C20.6195 21.7649 19.6221 21.487 18.7308 21.0343C18.6768 23.2491 17.0511 25.0261 15.0535 25.0261C13.0219 25.0261 11.3749 23.188 11.3749 20.9207C11.3749 20.7032 11.3901 20.4896 11.4193 20.2813L14.2636 18.5245L11.0095 14.4568L10.9926 14.4805C9.37031 15.8521 8.32234 18.0255 8.32234 20.4721C8.32234 24.621 11.336 27.9843 15.0536 27.9843Z"
  fill="currentColor"
/>
</svg>
`;

const genRfcLinks = (dir: string, prefixPath = '') => {
  const files = readdirSync(dir);
  const data: DefaultTheme.SidebarItem[] = [];
  for (const filename of files) {
    const file = statSync(join(dir, filename));
    if (file.isDirectory()) {
      const childData = genRfcLinks(join(dir, filename), `${filename}/`);
      data.push({
        text: filename,
        items: childData,
      });
      continue;
    }
    const ismd = filename.endsWith('.md');
    if (ismd) {
      data.push({
        text: filename.replace(/\.md$/, ''),
        link: `${prefixPath}${filename.replace(/\.md$/, '')}`,
      });
    }
  }
  return data;
};

const rfcLinks = genRfcLinks(resolve(__dirname, '../src/rfcs'));
const sources = ['blog', 'rfcs', 'DataInterpreter', 'sela'];
const dests = ['zh', 'en'];

const copyDir = (source: string, dest: string) => {
  if (!existsSync(dest)) {
    mkdirSync(dest, {
      recursive: true,
    });
  }
  const files = readdirSync(source);
  for (const filename of files) {
    const file = statSync(join(source, filename));

    if (file.isDirectory()) {
      copyDir(join(source, filename), join(dest, filename));
      continue;
    }

    const ismd = filename.endsWith('.md');
    if (!ismd) {
      copyFileSync(join(source, filename), join(dest, filename));
      continue;
    }

    const filesource = readFileSync(join(source, filename), 'utf-8');
    const newfile = filesource.replaceAll('(../public', '(../../public');

    writeFileSync(join(dest, filename), newfile, {
      encoding: 'utf-8',
    });
  }
};

// route based on fs, so copy files when deploy
// if (process.env.NODE_ENV === 'production') {
/** for deploy, dev mode also need this to preview */
cpSync(
  resolve(__dirname, '../src/en/index.md'),
  resolve(__dirname, '../src/index.md')
);
for (const source of sources) {
  for (const dest of dests) {
    const sourceDir = resolve(__dirname, `../src/${source}`);
    const destDir = resolve(__dirname, `../src/${dest}/${source}`);

    copyDir(sourceDir, destDir);
  }
}
// }

const branchInfo = await simpleGit('.', {}).fetch().branch({});

const { current, branches } = branchInfo;
const isMain = current === 'main';
const base = isMain ? '/main/' : `/${current}/`;
const domain = 'https://docs.deepwisdom.ai';
const versions = Object.keys(branches)
  .reduce((vs, branchname) => {
    const regex = /^remotes\/origin\/(v.*)$/;
    const [, remotebn] = regex.exec(branchname) || [];
    if (remotebn) {
      vs.push(remotebn);
    }
    return vs;
  }, [] as string[])
  .sort()
  .reverse();

const stableBranch = versions[0];
const getVersions = () => {
  if (!versions.length && isMain) {
    return [];
  }
  return [
    {
      text: current,
      items: [
        {
          text: 'main (unstable)',
          link: `${domain}/main/`,
          target: '_blank',
          disabled: true,
        },
        ...versions.map((v) => ({
          text: v === stableBranch ? `${v} (stable)` : v,
          link: `${domain}/${v}/`,
          target: '_blank',
        })),
      ],
    },
  ];
};

const blogAndRfcVisible = isMain;
const arrVisible = (arr: any[], visible: boolean) => {
  return visible ? arr : [];
};

if (process.env.NODE_ENV === 'production') {
  const prevVersion = await getPrevVerBranch();
  if (prevVersion) {
    await genDiffFile(current, prevVersion);
  }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base,
  title: 'MetaGPT',
  description: 'The Multi-Agent Framework',
  srcDir: './src',
  ignoreDeadLinks: true,
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [
          {
            text: 'Docs',
            link: '/en/guide/get_started/introduction',
            activeMatch: '/en/guide/',
          },
          {
            text: 'Demo',
            items: [
              {
                text: 'Data Interpreter',
                link: '/en/DataInterpreter/index',
                activeMatch: '/en/DataInterpreter/',
              },
              // {
              //   text: 'SELA',
              //   link: '/en/sale/index',
              //   activeMatch: '/en/sale/',
              // },
            ],
          },
          ...arrVisible(
            [
              {
                text: 'Blogs',
                link: '/en/blog/blogs',
                activeMatch: '/en/blog/',
              },
              {
                text: 'RFCs',
                link: '/en/rfcs/RFC-116-MetaGPT优化方案',
                activeMatch: '/en/rfcs/',
              },
            ],
            blogAndRfcVisible
          ),
          ...getVersions(),
        ],
        sidebar: {
          '/en/guide/': {
            base: '/en/guide/',
            items: [
              {
                text: 'Get Started',
                collapsed: false,
                items: [
                  { text: 'Introduction', link: 'get_started/introduction' },
                  { text: 'Quickstart', link: 'get_started/quickstart' },
                  { text: 'Installation', link: 'get_started/installation' },
                  {
                    text: 'Configuration',
                    link: 'get_started/configuration',
                    items: [
                      {
                        text: 'LLM',
                        link: 'get_started/configuration/llm_api_configuration',
                      },
                      {
                        text: 'Tools',
                        link: 'get_started/configuration/tools',
                      },
                    ],
                  },
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
                  {
                    text: 'Create and use tools',
                    link: 'tutorials/create_and_use_tools.md',
                  },
                  {
                    text: 'Human engagement',
                    link: 'tutorials/human_engagement.md',
                  },
                  {
                    text: 'Integration with open LLM',
                    link: 'tutorials/integration_with_open_llm.md',
                  },
                  {
                    text: 'Customize LLMs for roles or actions',
                    link: 'tutorials/customize_llms_for_roles_or_actions.md',
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
                        text: 'Data Interpreter',
                        link: 'use_cases/agent/interpreter/intro.md',
                        items: [
                          {
                            text: 'Data analysis and visualization',
                            link: 'use_cases/agent/interpreter/data_visualization.md',
                          },
                          {
                            text: 'Machine learning modeling',
                            link: 'use_cases/agent/interpreter/machine_learning.md',
                          },
                          {
                            text: 'Machine learning modeling with tools',
                            link: 'use_cases/agent/interpreter/machine_learning_with_tools.md',
                          },
                          {
                            text: 'Image background removal',
                            link: 'use_cases/agent/interpreter/image_removebg.md',
                          },
                          {
                            text: 'Solve mathematical problems',
                            link: 'use_cases/agent/interpreter/solve_mathematical_problems.md',
                          },
                          {
                            text: 'Receipt OCR',
                            link: 'use_cases/agent/interpreter/ocr_receipt.md',
                          },
                          {
                            text: 'Tool usage: web page imitation',
                            link: 'use_cases/agent/interpreter/imitate_webpage.md',
                          },
                          {
                            text: 'Human interaction',
                            link: 'use_cases/agent/interpreter/human_interaction.md',
                          },
                          {
                            text: 'Tool usage: web scraping',
                            link: 'use_cases/agent/interpreter/crawl_webpage.md',
                          },
                          {
                            text: 'Tool usage: text2image',
                            link: 'use_cases/agent/interpreter/text2image.md',
                          },
                          {
                            text: 'Tool usage: email summarization and response',
                            link: 'use_cases/agent/interpreter/email_summary.md',
                          },
                        ],
                      },
                      {
                        text: 'Researcher: search web and write reports',
                        link: 'use_cases/agent/researcher.md',
                      },
                      {
                        text: 'Tutorial Assistant',
                        link: 'use_cases/agent/tutorial_assistant.md',
                      },
                      {
                        text: 'Photographer',
                        link: 'use_cases/agent/photographer.md',
                      },
                      {
                        text: 'Receipt Assistant',
                        link: 'use_cases/agent/receipt_assistant.md',
                      },
                      {
                        text: 'Android Assistant',
                        link: 'use_cases/agent/android_assistant.md',
                      },
                    ],
                  },
                  {
                    text: 'MultiAgent',
                    items: [
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
                        link: 'use_cases/multi_agent/minecraft.md',
                      },
                      {
                        text: 'Stanford Town',
                        link: 'use_cases/multi_agent/stanford_town.md',
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
                  {
                    text: 'Incremental development',
                    link: 'in_depth_guides/incremental_development.md',
                  },
                  {
                    text: 'Serialization & Breakpoint Recovery',
                    link: 'in_depth_guides/breakpoint_recovery.md',
                  },
                  {
                    text: 'RAG Module',
                    link: 'in_depth_guides/rag_module.md',
                  },
                  {
                    text: 'Environment',
                    link: 'in_depth_guides/environment/intro.md',
                    items: [
                      {
                        text: 'Werewolf Game',
                        link: 'in_depth_guides/environment/werewolf.md',
                      },
                      {
                        text: 'Stanford Town',
                        link: 'in_depth_guides/environment/stanford_town.md',
                      },
                      {
                        text: 'Android',
                        link: 'in_depth_guides/environment/android.md',
                      },
                    ],
                  },
                ],
              },
              {
                text: 'Contribution',
                collapsed: false,
                items: [
                  {
                    text: 'Code of Conduct',
                    link: 'contribution/code_of_conduct.md',
                  },
                  {
                    text: 'Contribution Guidelines',
                    link: 'contribution/contribution_guidelines.md',
                    items: [
                      {
                        text: 'Code Contribution',
                        link: 'contribution/guideline/code_contribution.md',
                      },
                      {
                        text: 'Doc Contribution',
                        link: 'contribution/guideline/doc_contribution.md',
                      },
                    ],
                  },
                  {
                    text: 'FAQ',
                    link: 'contribution/faq.md',
                  },
                ],
              },
              {
                text: 'API',
                link: 'api',
              },
              {
                text: 'FAQ',
                link: 'faq',
              },
            ],
          },
        },
      },
    },
    zh: {
      label: '中文',
      lang: 'zh',
      link: '/zh/',
      themeConfig: {
        nav: [
          {
            text: '文档',
            link: '/zh/guide/get_started/introduction',
            activeMatch: '/zh/guide/',
          },
          {
            text: '样例',
            items: [
              {
                text: 'Data Interpreter',
                link: '/zh/DataInterpreter/index',
                activeMatch: '/zh/DataInterpreter/',
              },
              // {
              //   text: 'SELA',
              //   link: '/zh/sale/index',
              //   activeMatch: '/zh/sale/',
              // },
            ],
          },
          ...arrVisible(
            [
              {
                text: '博客',
                link: '/zh/blog/blogs',
                activeMatch: '/zh/blog/',
              },
              {
                text: 'RFCs',
                link: '/zh/rfcs/RFC-116-MetaGPT优化方案',
                activeMatch: '/zh/rfcs/',
              },
            ],
            blogAndRfcVisible
          ),
          ...getVersions(),
        ],
        sidebar: {
          '/zh/guide/': {
            base: '/zh/guide/',
            items: [
              {
                text: '开始',
                collapsed: false,
                items: [
                  {
                    text: '介绍',
                    link: 'get_started/introduction',
                  },
                  {
                    text: '快速开始',
                    link: 'get_started/quickstart',
                  },
                  {
                    text: '安装',
                    link: 'get_started/installation',
                  },
                  {
                    text: '配置',
                    link: 'get_started/configuration',
                    items: [
                      {
                        text: '大模型API',
                        link: 'get_started/configuration/llm_api_configuration',
                      },
                      {
                        text: '工具',
                        link: 'get_started/configuration/tools',
                      },
                    ],
                  },
                ],
              },
              {
                text: '教程',
                collapsed: false,
                items: [
                  {
                    text: '概念简述',
                    link: 'tutorials/concepts',
                  },
                  {
                    text: '智能体入门',
                    link: 'tutorials/agent_101',
                  },
                  {
                    text: '多智能体入门',
                    link: 'tutorials/multi_agent_101',
                  },
                  {
                    text: '使用记忆',
                    link: 'tutorials/use_memories',
                  },
                  {
                    text: '创建和使用工具',
                    link: 'tutorials/create_and_use_tools',
                  },
                  {
                    text: '人类介入',
                    link: 'tutorials/human_engagement',
                  },
                  {
                    text: '集成开源LLM',
                    link: 'tutorials/integration_with_open_llm',
                  },
                  {
                    text: '为角色或动作配置不同LLM',
                    link: 'tutorials/customize_llms_for_roles_or_actions',
                  },
                ],
              },
              {
                text: '示例',
                collapsed: false,
                items: [
                  {
                    text: '智能体',
                    items: [
                      {
                        text: '数据解释器',
                        link: 'use_cases/agent/interpreter/intro.md',
                        items: [
                          {
                            text: '数据分析和可视化',
                            link: 'use_cases/agent/interpreter/data_visualization.md',
                          },
                          {
                            text: '机器学习建模',
                            link: 'use_cases/agent/interpreter/machine_learning.md',
                          },
                          {
                            text: '使用工具进行机器学习建模',
                            link: 'use_cases/agent/interpreter/machine_learning_with_tools.md',
                          },
                          {
                            text: '图像去背景',
                            link: 'use_cases/agent/interpreter/image_removebg.md',
                          },
                          {
                            text: '解数学问题',
                            link: 'use_cases/agent/interpreter/solve_mathematical_problems.md',
                          },
                          {
                            text: '票据OCR',
                            link: 'use_cases/agent/interpreter/ocr_receipt.md',
                          },
                          {
                            text: '人类交互',
                            link: 'use_cases/agent/interpreter/human_interaction.md',
                          },
                          {
                            text: '工具使用：网页仿写',
                            link: 'use_cases/agent/interpreter/imitate_webpage.md',
                          },
                          {
                            text: '工具使用：网页爬取',
                            link: 'use_cases/agent/interpreter/crawl_webpage.md',
                          },
                          {
                            text: '工具使用：Text2Image',
                            link: 'use_cases/agent/interpreter/text2image.md',
                          },
                          {
                            text: '工具使用：邮件总结与回复',
                            link: 'use_cases/agent/interpreter/email_summary.md',
                          },
                        ],
                      },
                      {
                        text: '调研员',
                        link: 'use_cases/agent/researcher.md',
                      },
                      {
                        text: '教程文案助手',
                        link: 'use_cases/agent/tutorial_assistant.md',
                      },
                      {
                        text: '摄影师',
                        link: 'use_cases/agent/photographer.md',
                      },
                      {
                        text: '票据助手',
                        link: 'use_cases/agent/receipt_assistant.md',
                      },
                      {
                        text: '安卓助手',
                        link: 'use_cases/agent/android_assistant.md',
                      },
                    ],
                  },
                  {
                    text: '多智能体',
                    items: [
                      {
                        text: '辩论',
                        link: 'use_cases/multi_agent/debate.md',
                      },
                      {
                        text: '狼人杀',
                        link: 'use_cases/multi_agent/werewolf_game.md',
                      },
                      {
                        text: 'Minecraft',
                        link: 'use_cases/multi_agent/minecraft.md',
                      },
                      {
                        text: '斯坦福小镇',
                        link: 'use_cases/multi_agent/stanford_town.md',
                      },
                    ],
                  },
                ],
              },
              {
                text: '进阶指南',
                collapsed: false,
                items: [
                  {
                    text: '多智能体间通信',
                    link: 'in_depth_guides/agent_communication.md',
                  },
                  {
                    text: '增量开发',
                    link: 'in_depth_guides/incremental_development.md',
                  },
                  {
                    text: '序列化&断点恢复',
                    link: 'in_depth_guides/breakpoint_recovery.md',
                  },
                  {
                    text: 'RAG模块',
                    link: 'in_depth_guides/rag_module.md',
                  },
                  {
                    text: '环境',
                    link: 'in_depth_guides/environment/intro.md',
                    items: [
                      {
                        text: '狼人杀',
                        link: 'in_depth_guides/environment/werewolf.md',
                      },
                      {
                        text: '斯坦福小镇',
                        link: 'in_depth_guides/environment/stanford_town.md',
                      },
                      {
                        text: '安卓模拟器',
                        link: 'in_depth_guides/environment/android.md',
                      },
                    ],
                  },
                ],
              },
              {
                text: '贡献',
                collapsed: false,
                items: [
                  {
                    text: '行为准则',
                    link: 'contribution/code_of_conduct.md',
                  },
                  {
                    text: '贡献指南',
                    link: 'contribution/contribution_guidelines.md',
                    items: [
                      {
                        text: '代码贡献',
                        link: 'contribution/guideline/code_contribution.md',
                      },
                      {
                        text: '文档贡献',
                        link: 'contribution/guideline/doc_contribution.md',
                      },
                    ],
                  },
                  {
                    text: '常见问题',
                    link: 'contribution/faq.md',
                  },
                ],
              },
              {
                text: 'API',
                link: 'api',
              },
              {
                text: '常见问题解答',
                link: 'faq',
              },
            ],
          },
          '/zh/rfcs/': {
            base: '/zh/rfcs/',
            items: [...rfcLinks],
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
      VueTsx(),
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
      pattern: 'https://github.com/geekan/MetaGPT-docs/blob/main/src/:path',
      text: 'Edit this page on GitHub',
    },
    outline: {
      level: [2, 3],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/geekan/MetaGPT' },
      { icon: 'discord', link: 'https://discord.com/invite/wCp6Q3fsAk' },
      { icon: 'x', link: 'https://twitter.com/MetaGPT_' },
      {
        icon: {
          svg: Logo,
        },
        link: 'https://deepwisdom.ai/',
      },
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
