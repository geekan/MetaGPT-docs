// .vitepress/config.mts
import { defineConfig } from 'file:///Users/zerolee/Desktop/github/metaGPT-docs/node_modules/.pnpm/vitepress@1.0.0-rc.24_@algolia+client-search@4.20.0_@types+node@20.8.10_postcss@8.4.31_search-insights@2.9.0/node_modules/vitepress/dist/node/index.js';
import UnoCSS from 'file:///Users/zerolee/Desktop/github/metaGPT-docs/node_modules/.pnpm/unocss@0.57.1_postcss@8.4.31_vite@4.5.0/node_modules/unocss/dist/vite.mjs';
import AutoImport from 'file:///Users/zerolee/Desktop/github/metaGPT-docs/node_modules/.pnpm/unplugin-auto-import@0.16.7_@vueuse+core@10.6.1/node_modules/unplugin-auto-import/dist/vite.js';
import { resolve as resolve2, join as join2 } from 'node:path';
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
import { simpleGit } from 'file:///Users/zerolee/Desktop/github/metaGPT-docs/node_modules/.pnpm/simple-git@3.21.0/node_modules/simple-git/dist/esm/index.js';

// utils/tool.mjs
import { resolve, join } from 'node:path';
import fs from 'node:fs';
var tree = (dir, base2 = '', filter = ['.md']) => {
  if (!fs.existsSync(dir)) {
    return;
  }
  const paths = fs
    .readdirSync(dir)
    .filter((_) => filter.every((__) => _.endsWith(__)));
  const d = paths.map((_) => {
    const p = join(dir, _);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      return {
        text: _,
        items: tree(p, base2, filter),
      };
    } else {
      return { text: _, link: p.replace(base2, '') };
    }
  });
  return d;
};

// .vitepress/config.mts
var __vite_injected_original_dirname =
  '/Users/zerolee/Desktop/github/metaGPT-docs/.vitepress';
var Logo = `
<svg  viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<path
  fill-rule="evenodd"
  clip-rule="evenodd"
  d="M8.33877 6.97316C8.97527 3.56271 11.6838 1.00049 14.9286 1.00049C18.6462 1.00049 21.6599 4.36381 21.6599 8.51269C21.6599 10.9593 20.6119 13.1327 18.9895 14.5043L18.9727 14.528L15.7185 10.4604L18.5629 8.70356C18.5921 8.49519 18.6072 8.28163 18.6072 8.06414C18.6072 5.79681 16.9603 3.95876 14.9286 3.95876C12.9845 3.95876 11.3926 5.64188 11.2591 7.77367C10.3751 7.31745 9.38651 7.03546 8.33877 6.97316ZM6.83334 7.86324C6.16814 7.91547 5.55144 8.03704 5.01187 8.20267C2.20636 9.06398 -0.127176 11.8673 0.351758 15.5281C0.618955 17.5704 1.87441 19.0056 3.25869 19.8857C4.61954 20.7508 6.23191 21.1718 7.58197 21.1718L8.36564 17.3286C7.18834 17.59 5.86137 17.5904 5.04704 17.0728C4.25614 16.5699 3.76327 15.9085 3.65694 15.0957C3.41201 13.2235 4.56287 11.8273 5.99017 11.3892C7.57464 10.9027 10.3016 11.0183 12.229 13.5965C12.3266 13.7271 12.4232 13.8565 12.5188 13.9846C12.6473 14.1566 12.7741 14.3264 12.8993 14.4937H12.8988C13.488 15.2294 14.1404 16.1023 14.9171 17.1417L15.1002 17.3867C17.3152 20.3496 20.2896 21.2231 22.728 21.148C18.9572 20.8073 16.3297 17.0874 14.5684 14.495H14.5694C12.7164 11.6987 11.5497 10.0436 9.24324 8.66372C8.35961 8.13507 7.49441 7.93077 6.83334 7.86324ZM23.0881 21.1299C22.4215 21.0672 21.5368 20.8658 20.6327 20.325C18.3266 18.9454 17.1599 17.2906 15.3074 14.495H15.3084C13.551 11.9082 10.9308 8.19753 7.17241 7.84294C9.62881 7.74111 12.6538 8.59776 14.8988 11.6008L15.0818 11.8457C15.8586 12.8851 16.511 13.758 17.1002 14.4937H17.0997C17.2249 14.661 17.3517 14.8308 17.4802 15.0029C17.5758 15.1309 17.6724 15.2603 17.77 15.3909C19.6974 17.9691 22.4244 18.0847 24.0088 17.5983C25.4362 17.1601 26.587 15.7639 26.3421 13.8917C26.2358 13.079 25.7429 12.4175 24.952 11.9147C24.1376 11.397 22.8107 11.3974 21.6334 11.6588L22.417 7.81561C23.7671 7.81561 25.3795 8.2366 26.7403 9.10175C28.1246 9.9818 29.3801 11.417 29.6473 13.4593C30.1262 17.1201 27.7927 19.9234 24.9871 20.7848C24.4267 20.9568 23.7829 21.0813 23.0881 21.1299ZM15.0536 27.9843C18.3582 27.9843 21.1066 25.3268 21.6765 21.8223C20.6195 21.7649 19.6221 21.487 18.7308 21.0343C18.6768 23.2491 17.0511 25.0261 15.0535 25.0261C13.0219 25.0261 11.3749 23.188 11.3749 20.9207C11.3749 20.7032 11.3901 20.4896 11.4193 20.2813L14.2636 18.5245L11.0095 14.4568L10.9926 14.4805C9.37031 15.8521 8.32234 18.0255 8.32234 20.4721C8.32234 24.621 11.336 27.9843 15.0536 27.9843Z"
  fill="currentColor"
/>
</svg>
`;
var genRfcLinks = (dir, prefixPath = '') => {
  const files = readdirSync(dir);
  const data = [];
  for (const filename of files) {
    const file = statSync(join2(dir, filename));
    if (file.isDirectory()) {
      const childData = genRfcLinks(join2(dir, filename), `${filename}/`);
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
var rfcLinks = genRfcLinks(
  resolve2(__vite_injected_original_dirname, '../src/rfcs')
);
var sources = ['blog', 'rfcs', 'reference'];
var dests = ['zh', 'en'];
var copyDir = (source, dest) => {
  if (!existsSync(source)) {
    console.warn(`${source} not exist, skip copy`);
    return;
  }
  if (!existsSync(dest)) {
    mkdirSync(dest, {
      recursive: true,
    });
  }
  const files = readdirSync(source);
  for (const filename of files) {
    const file = statSync(join2(source, filename));
    if (file.isDirectory()) {
      copyDir(join2(source, filename), join2(dest, filename));
      continue;
    }
    const ismd = filename.endsWith('.md');
    if (!ismd) {
      copyFileSync(join2(source, filename), join2(dest, filename));
      continue;
    }
    const filesource = readFileSync(join2(source, filename), 'utf-8');
    const newfile = filesource.replaceAll('(../public', '(../../public');
    writeFileSync(join2(dest, filename), newfile, {
      encoding: 'utf-8',
    });
  }
};
cpSync(
  resolve2(__vite_injected_original_dirname, '../src/en/index.md'),
  resolve2(__vite_injected_original_dirname, '../src/index.md')
);
for (const source of sources) {
  for (const dest of dests) {
    const sourceDir = resolve2(
      __vite_injected_original_dirname,
      `../src/${source}`
    );
    const destDir = resolve2(
      __vite_injected_original_dirname,
      `../src/${dest}/${source}`
    );
    copyDir(sourceDir, destDir);
  }
}
var branchInfo = await simpleGit('.', {}).pull().branch({});
var { current, branches } = branchInfo;
var isMain = current === 'main';
var base = isMain ? '/main/' : `/${current}/`;
var domain = 'https://docs.deepwisdom.ai';
var versions = Object.keys(branches)
  .reduce((vs, branchname) => {
    const regex = /^remotes\/origin\/(v.*)$/;
    const [, remotebn] = regex.exec(branchname) || [];
    if (remotebn) {
      vs.push(remotebn);
    }
    return vs;
  }, [])
  .sort()
  .reverse();
var stableBranch = versions[0];
var getVersions = () => {
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
var blogAndRfcVisible = isMain;
var arrVisible = (arr, visible) => {
  return visible ? arr : [];
};
var ApiSidebar = tree(
  resolve2(__vite_injected_original_dirname, '../src/reference'),
  resolve2(__vite_injected_original_dirname, '../src/reference')
);
console.log(ApiSidebar);
var config_default = defineConfig({
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
          ...arrVisible(
            [
              {
                text: 'Blog',
                link: '/en/blog/agents',
                activeMatch: '/blog/',
              },
              {
                text: 'RFCs',
                link: '/en/rfcs/RFC-116-MetaGPT\u4F18\u5316\u65B9\u6848',
                activeMatch: '/euns/rfcs/',
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
                  {
                    text: 'Human engagement',
                    link: 'tutorials/human_engagement.md',
                  },
                  {
                    text: 'Integration with open LLM',
                    link: 'tutorials/integration_with_open_llm.md',
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
                        text: 'Machine Learning Engineer',
                        link: 'use_cases/agent/ml_engineer.md',
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
                    ],
                  },
                  {
                    text: 'MultiAgent',
                    items: [
                      {
                        text: 'Software Company',
                        link: 'use_cases/multi_agent/software_company.md',
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
                        link: 'use_cases/multi_agent/minecraft.md',
                      },
                      {
                        text: 'Virtual Town',
                        link: 'use_cases/multi_agent/virtual_town.md',
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
                    text: 'Incremental devlopment',
                    link: 'in_depth_guides/incremental_development.md',
                  },
                  {
                    text: 'Serialization & Breakpoint Recovery',
                    link: 'in_depth_guides/breakpoint_recovery.md',
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
                link: 'api',
              },
              {
                text: 'FAQ',
                link: 'faq',
              },
            ],
          },
          '/en/blog/': {
            base: '/en/blog/',
            items: [
              {
                text: 'Agents',
                link: 'agents',
              },
            ],
          },
          '/en/rfcs/': {
            base: '/en/rfcs/',
            items: [...rfcLinks],
          },
        },
      },
    },
    zh: {
      label: '\u4E2D\u6587',
      lang: 'zh',
      link: '/zh/',
      themeConfig: {
        nav: [
          {
            text: '\u6587\u6863',
            link: '/zh/guide/get_started/introduction',
            activeMatch: '/zh/guide/',
          },
          ...arrVisible(
            [
              {
                text: '\u535A\u5BA2',
                link: '/zh/blog/agents',
                activeMatch: '/zh/blog/',
              },
              {
                text: 'RFCs',
                link: '/zh/rfcs/RFC-116-MetaGPT\u4F18\u5316\u65B9\u6848',
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
                text: '\u5F00\u59CB',
                collapsed: false,
                items: [
                  {
                    text: '\u4ECB\u7ECD',
                    link: 'get_started/introduction',
                  },
                  {
                    text: '\u5FEB\u901F\u5F00\u59CB',
                    link: 'get_started/quickstart',
                  },
                  {
                    text: '\u5B89\u88C5',
                    link: 'get_started/installation',
                  },
                  {
                    text: '\u914D\u7F6E',
                    link: 'get_started/setup',
                  },
                ],
              },
              {
                text: '\u6559\u7A0B',
                collapsed: false,
                items: [
                  {
                    text: '\u6982\u5FF5\u7B80\u8FF0',
                    link: 'tutorials/concepts',
                  },
                  {
                    text: '\u667A\u80FD\u4F53\u5165\u95E8',
                    link: 'tutorials/agent_101',
                  },
                  {
                    text: '\u591A\u667A\u80FD\u4F53\u5165\u95E8',
                    link: 'tutorials/multi_agent_101',
                  },
                  {
                    text: '\u4F7F\u7528\u8BB0\u5FC6',
                    link: 'tutorials/use_memories',
                  },
                  {
                    text: '\u4EBA\u7C7B\u4ECB\u5165',
                    link: 'tutorials/human_engagement',
                  },
                  {
                    text: '\u96C6\u6210\u5F00\u6E90LLM',
                    link: 'tutorials/integration_with_open_llm',
                  },
                ],
              },
              {
                text: '\u793A\u4F8B',
                collapsed: false,
                items: [
                  {
                    text: '\u667A\u80FD\u4F53',
                    items: [
                      {
                        text: '\u8C03\u7814\u5458',
                        link: 'use_cases/agent/researcher.md',
                      },
                      {
                        text: '\u673A\u5668\u5B66\u4E60\u5DE5\u7A0B\u5E08',
                        link: 'use_cases/agent/ml_engineer.md',
                      },
                      {
                        text: '\u6559\u7A0B\u6587\u6848\u52A9\u624B',
                        link: 'use_cases/agent/tutorial_assistant.md',
                      },
                      {
                        text: '\u6444\u5F71\u5E08',
                        link: 'use_cases/agent/photographer.md',
                      },
                      {
                        text: '\u7968\u636E\u52A9\u624B',
                        link: 'use_cases/agent/receipt_assistant.md',
                      },
                    ],
                  },
                  {
                    text: '\u591A\u667A\u80FD\u4F53',
                    items: [
                      {
                        text: '\u8F6F\u4EF6\u516C\u53F8',
                        link: 'use_cases/multi_agent/software_company.md',
                      },
                      {
                        text: '\u8FA9\u8BBA',
                        link: 'use_cases/multi_agent/debate.md',
                      },
                      {
                        text: '\u72FC\u4EBA\u6740',
                        link: 'use_cases/multi_agent/werewolf_game.md',
                      },
                      {
                        text: 'Minecraft',
                        link: 'use_cases/multi_agent/minecraft.md',
                      },
                      {
                        text: '\u865A\u62DF\u5C0F\u9547',
                        link: 'use_cases/multi_agent/virtual_town.md',
                      },
                    ],
                  },
                ],
              },
              {
                text: '\u8FDB\u9636\u6307\u5357',
                collapsed: false,
                items: [
                  {
                    text: '\u591A\u667A\u80FD\u4F53\u95F4\u901A\u4FE1',
                    link: 'in_depth_guides/agent_communication.md',
                  },
                  {
                    text: '\u589E\u91CF\u5F00\u53D1',
                    link: 'in_depth_guides/incremental_development.md',
                  },
                  {
                    text: '\u5E8F\u5217\u5316&\u65AD\u70B9\u6062\u590D',
                    link: 'in_depth_guides/breakpoint_recovery.md',
                  },
                ],
              },
              {
                text: '\u8D21\u732E',
                collapsed: false,
                items: [
                  {
                    text: '\u8D21\u732E\u6307\u5357',
                    link: 'contribute/contribute_guide.md',
                  },
                ],
              },
              {
                text: 'API',
                link: 'api',
              },
              {
                text: '\u5E38\u89C1\u95EE\u9898\u89E3\u7B54',
                link: 'faq',
              },
            ],
          },
          '/zh/blog/': {
            base: '/zh/blog/',
            items: [
              {
                text: 'Agents',
                link: 'agents',
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
      alias: [
        {
          find: '@/',
          replacement: `${resolve2(
            __vite_injected_original_dirname,
            '../src'
          )}/`,
        },
      ],
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
      copyright: 'Copyright \xA9 2023-present alexanderwu',
    },
    search: {
      provider: 'local',
    },
  },
});
export { config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnZpdGVwcmVzcy9jb25maWcubXRzIiwgInV0aWxzL3Rvb2wubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3plcm9sZWUvRGVza3RvcC9naXRodWIvbWV0YUdQVC1kb2NzLy52aXRlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy96ZXJvbGVlL0Rlc2t0b3AvZ2l0aHViL21ldGFHUFQtZG9jcy8udml0ZXByZXNzL2NvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3plcm9sZWUvRGVza3RvcC9naXRodWIvbWV0YUdQVC1kb2NzLy52aXRlcHJlc3MvY29uZmlnLm10c1wiO2ltcG9ydCB7IERlZmF1bHRUaGVtZSwgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXByZXNzJztcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnO1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSc7XG5pbXBvcnQgeyByZXNvbHZlLCBqb2luIH0gZnJvbSAnbm9kZTpwYXRoJztcbmltcG9ydCB7XG4gIGV4aXN0c1N5bmMsXG4gIGNwU3luYyxcbiAgcmVhZGRpclN5bmMsXG4gIHN0YXRTeW5jLFxuICBjb3B5RmlsZVN5bmMsXG4gIHJlYWRGaWxlU3luYyxcbiAgd3JpdGVGaWxlU3luYyxcbiAgbWtkaXJTeW5jLFxufSBmcm9tICdub2RlOmZzJztcbmltcG9ydCB7IHNpbXBsZUdpdCB9IGZyb20gJ3NpbXBsZS1naXQnO1xuaW1wb3J0IHsgdHJlZSB9IGZyb20gJy4uL3V0aWxzL3Rvb2wubWpzJztcblxuY29uc3QgTG9nbyA9IGBcbjxzdmcgIHZpZXdCb3g9XCIwIDAgMzAgMjlcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbjxwYXRoXG4gIGZpbGwtcnVsZT1cImV2ZW5vZGRcIlxuICBjbGlwLXJ1bGU9XCJldmVub2RkXCJcbiAgZD1cIk04LjMzODc3IDYuOTczMTZDOC45NzUyNyAzLjU2MjcxIDExLjY4MzggMS4wMDA0OSAxNC45Mjg2IDEuMDAwNDlDMTguNjQ2MiAxLjAwMDQ5IDIxLjY1OTkgNC4zNjM4MSAyMS42NTk5IDguNTEyNjlDMjEuNjU5OSAxMC45NTkzIDIwLjYxMTkgMTMuMTMyNyAxOC45ODk1IDE0LjUwNDNMMTguOTcyNyAxNC41MjhMMTUuNzE4NSAxMC40NjA0TDE4LjU2MjkgOC43MDM1NkMxOC41OTIxIDguNDk1MTkgMTguNjA3MiA4LjI4MTYzIDE4LjYwNzIgOC4wNjQxNEMxOC42MDcyIDUuNzk2ODEgMTYuOTYwMyAzLjk1ODc2IDE0LjkyODYgMy45NTg3NkMxMi45ODQ1IDMuOTU4NzYgMTEuMzkyNiA1LjY0MTg4IDExLjI1OTEgNy43NzM2N0MxMC4zNzUxIDcuMzE3NDUgOS4zODY1MSA3LjAzNTQ2IDguMzM4NzcgNi45NzMxNlpNNi44MzMzNCA3Ljg2MzI0QzYuMTY4MTQgNy45MTU0NyA1LjU1MTQ0IDguMDM3MDQgNS4wMTE4NyA4LjIwMjY3QzIuMjA2MzYgOS4wNjM5OCAtMC4xMjcxNzYgMTEuODY3MyAwLjM1MTc1OCAxNS41MjgxQzAuNjE4OTU1IDE3LjU3MDQgMS44NzQ0MSAxOS4wMDU2IDMuMjU4NjkgMTkuODg1N0M0LjYxOTU0IDIwLjc1MDggNi4yMzE5MSAyMS4xNzE4IDcuNTgxOTcgMjEuMTcxOEw4LjM2NTY0IDE3LjMyODZDNy4xODgzNCAxNy41OSA1Ljg2MTM3IDE3LjU5MDQgNS4wNDcwNCAxNy4wNzI4QzQuMjU2MTQgMTYuNTY5OSAzLjc2MzI3IDE1LjkwODUgMy42NTY5NCAxNS4wOTU3QzMuNDEyMDEgMTMuMjIzNSA0LjU2Mjg3IDExLjgyNzMgNS45OTAxNyAxMS4zODkyQzcuNTc0NjQgMTAuOTAyNyAxMC4zMDE2IDExLjAxODMgMTIuMjI5IDEzLjU5NjVDMTIuMzI2NiAxMy43MjcxIDEyLjQyMzIgMTMuODU2NSAxMi41MTg4IDEzLjk4NDZDMTIuNjQ3MyAxNC4xNTY2IDEyLjc3NDEgMTQuMzI2NCAxMi44OTkzIDE0LjQ5MzdIMTIuODk4OEMxMy40ODggMTUuMjI5NCAxNC4xNDA0IDE2LjEwMjMgMTQuOTE3MSAxNy4xNDE3TDE1LjEwMDIgMTcuMzg2N0MxNy4zMTUyIDIwLjM0OTYgMjAuMjg5NiAyMS4yMjMxIDIyLjcyOCAyMS4xNDhDMTguOTU3MiAyMC44MDczIDE2LjMyOTcgMTcuMDg3NCAxNC41Njg0IDE0LjQ5NUgxNC41Njk0QzEyLjcxNjQgMTEuNjk4NyAxMS41NDk3IDEwLjA0MzYgOS4yNDMyNCA4LjY2MzcyQzguMzU5NjEgOC4xMzUwNyA3LjQ5NDQxIDcuOTMwNzcgNi44MzMzNCA3Ljg2MzI0Wk0yMy4wODgxIDIxLjEyOTlDMjIuNDIxNSAyMS4wNjcyIDIxLjUzNjggMjAuODY1OCAyMC42MzI3IDIwLjMyNUMxOC4zMjY2IDE4Ljk0NTQgMTcuMTU5OSAxNy4yOTA2IDE1LjMwNzQgMTQuNDk1SDE1LjMwODRDMTMuNTUxIDExLjkwODIgMTAuOTMwOCA4LjE5NzUzIDcuMTcyNDEgNy44NDI5NEM5LjYyODgxIDcuNzQxMTEgMTIuNjUzOCA4LjU5Nzc2IDE0Ljg5ODggMTEuNjAwOEwxNS4wODE4IDExLjg0NTdDMTUuODU4NiAxMi44ODUxIDE2LjUxMSAxMy43NTggMTcuMTAwMiAxNC40OTM3SDE3LjA5OTdDMTcuMjI0OSAxNC42NjEgMTcuMzUxNyAxNC44MzA4IDE3LjQ4MDIgMTUuMDAyOUMxNy41NzU4IDE1LjEzMDkgMTcuNjcyNCAxNS4yNjAzIDE3Ljc3IDE1LjM5MDlDMTkuNjk3NCAxNy45NjkxIDIyLjQyNDQgMTguMDg0NyAyNC4wMDg4IDE3LjU5ODNDMjUuNDM2MiAxNy4xNjAxIDI2LjU4NyAxNS43NjM5IDI2LjM0MjEgMTMuODkxN0MyNi4yMzU4IDEzLjA3OSAyNS43NDI5IDEyLjQxNzUgMjQuOTUyIDExLjkxNDdDMjQuMTM3NiAxMS4zOTcgMjIuODEwNyAxMS4zOTc0IDIxLjYzMzQgMTEuNjU4OEwyMi40MTcgNy44MTU2MUMyMy43NjcxIDcuODE1NjEgMjUuMzc5NSA4LjIzNjYgMjYuNzQwMyA5LjEwMTc1QzI4LjEyNDYgOS45ODE4IDI5LjM4MDEgMTEuNDE3IDI5LjY0NzMgMTMuNDU5M0MzMC4xMjYyIDE3LjEyMDEgMjcuNzkyNyAxOS45MjM0IDI0Ljk4NzEgMjAuNzg0OEMyNC40MjY3IDIwLjk1NjggMjMuNzgyOSAyMS4wODEzIDIzLjA4ODEgMjEuMTI5OVpNMTUuMDUzNiAyNy45ODQzQzE4LjM1ODIgMjcuOTg0MyAyMS4xMDY2IDI1LjMyNjggMjEuNjc2NSAyMS44MjIzQzIwLjYxOTUgMjEuNzY0OSAxOS42MjIxIDIxLjQ4NyAxOC43MzA4IDIxLjAzNDNDMTguNjc2OCAyMy4yNDkxIDE3LjA1MTEgMjUuMDI2MSAxNS4wNTM1IDI1LjAyNjFDMTMuMDIxOSAyNS4wMjYxIDExLjM3NDkgMjMuMTg4IDExLjM3NDkgMjAuOTIwN0MxMS4zNzQ5IDIwLjcwMzIgMTEuMzkwMSAyMC40ODk2IDExLjQxOTMgMjAuMjgxM0wxNC4yNjM2IDE4LjUyNDVMMTEuMDA5NSAxNC40NTY4TDEwLjk5MjYgMTQuNDgwNUM5LjM3MDMxIDE1Ljg1MjEgOC4zMjIzNCAxOC4wMjU1IDguMzIyMzQgMjAuNDcyMUM4LjMyMjM0IDI0LjYyMSAxMS4zMzYgMjcuOTg0MyAxNS4wNTM2IDI3Ljk4NDNaXCJcbiAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4vPlxuPC9zdmc+XG5gO1xuXG5jb25zdCBnZW5SZmNMaW5rcyA9IChkaXI6IHN0cmluZywgcHJlZml4UGF0aCA9ICcnKSA9PiB7XG4gIGNvbnN0IGZpbGVzID0gcmVhZGRpclN5bmMoZGlyKTtcbiAgY29uc3QgZGF0YTogRGVmYXVsdFRoZW1lLlNpZGViYXJJdGVtW10gPSBbXTtcbiAgZm9yIChjb25zdCBmaWxlbmFtZSBvZiBmaWxlcykge1xuICAgIGNvbnN0IGZpbGUgPSBzdGF0U3luYyhqb2luKGRpciwgZmlsZW5hbWUpKTtcbiAgICBpZiAoZmlsZS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICBjb25zdCBjaGlsZERhdGEgPSBnZW5SZmNMaW5rcyhqb2luKGRpciwgZmlsZW5hbWUpLCBgJHtmaWxlbmFtZX0vYCk7XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICB0ZXh0OiBmaWxlbmFtZSxcbiAgICAgICAgaXRlbXM6IGNoaWxkRGF0YSxcbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGlzbWQgPSBmaWxlbmFtZS5lbmRzV2l0aCgnLm1kJyk7XG4gICAgaWYgKGlzbWQpIHtcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIHRleHQ6IGZpbGVuYW1lLnJlcGxhY2UoL1xcLm1kJC8sICcnKSxcbiAgICAgICAgbGluazogYCR7cHJlZml4UGF0aH0ke2ZpbGVuYW1lLnJlcGxhY2UoL1xcLm1kJC8sICcnKX1gLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkYXRhO1xufTtcbmNvbnN0IHJmY0xpbmtzID0gZ2VuUmZjTGlua3MocmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9zcmMvcmZjcycpKTtcbmNvbnN0IHNvdXJjZXMgPSBbJ2Jsb2cnLCAncmZjcycsICdyZWZlcmVuY2UnXTtcbmNvbnN0IGRlc3RzID0gWyd6aCcsICdlbiddO1xuXG5jb25zdCBjb3B5RGlyID0gKHNvdXJjZTogc3RyaW5nLCBkZXN0OiBzdHJpbmcpID0+IHtcbiAgaWYgKCFleGlzdHNTeW5jKHNvdXJjZSkpIHtcbiAgICBjb25zb2xlLndhcm4oYCR7c291cmNlfSBub3QgZXhpc3QsIHNraXAgY29weWApO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIWV4aXN0c1N5bmMoZGVzdCkpIHtcbiAgICBta2RpclN5bmMoZGVzdCwge1xuICAgICAgcmVjdXJzaXZlOiB0cnVlLFxuICAgIH0pO1xuICB9XG4gIGNvbnN0IGZpbGVzID0gcmVhZGRpclN5bmMoc291cmNlKTtcbiAgZm9yIChjb25zdCBmaWxlbmFtZSBvZiBmaWxlcykge1xuICAgIGNvbnN0IGZpbGUgPSBzdGF0U3luYyhqb2luKHNvdXJjZSwgZmlsZW5hbWUpKTtcblxuICAgIGlmIChmaWxlLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgIGNvcHlEaXIoam9pbihzb3VyY2UsIGZpbGVuYW1lKSwgam9pbihkZXN0LCBmaWxlbmFtZSkpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgaXNtZCA9IGZpbGVuYW1lLmVuZHNXaXRoKCcubWQnKTtcbiAgICBpZiAoIWlzbWQpIHtcbiAgICAgIGNvcHlGaWxlU3luYyhqb2luKHNvdXJjZSwgZmlsZW5hbWUpLCBqb2luKGRlc3QsIGZpbGVuYW1lKSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlc291cmNlID0gcmVhZEZpbGVTeW5jKGpvaW4oc291cmNlLCBmaWxlbmFtZSksICd1dGYtOCcpO1xuICAgIGNvbnN0IG5ld2ZpbGUgPSBmaWxlc291cmNlLnJlcGxhY2VBbGwoJyguLi9wdWJsaWMnLCAnKC4uLy4uL3B1YmxpYycpO1xuXG4gICAgd3JpdGVGaWxlU3luYyhqb2luKGRlc3QsIGZpbGVuYW1lKSwgbmV3ZmlsZSwge1xuICAgICAgZW5jb2Rpbmc6ICd1dGYtOCcsXG4gICAgfSk7XG4gIH1cbn07XG5cbi8vIHJvdXRlIGJhc2VkIG9uIGZzLCBzbyBjb3B5IGZpbGVzIHdoZW4gZGVwbG95XG4vLyBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuLyoqIGZvciBkZXBsb3ksIGRldiBtb2RlIGFsc28gbmVlZCB0aGlzIHRvIHByZXZpZXcgKi9cbmNwU3luYyhcbiAgcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9zcmMvZW4vaW5kZXgubWQnKSxcbiAgcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9zcmMvaW5kZXgubWQnKVxuKTtcbmZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgZm9yIChjb25zdCBkZXN0IG9mIGRlc3RzKSB7XG4gICAgY29uc3Qgc291cmNlRGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsIGAuLi9zcmMvJHtzb3VyY2V9YCk7XG4gICAgY29uc3QgZGVzdERpciA9IHJlc29sdmUoX19kaXJuYW1lLCBgLi4vc3JjLyR7ZGVzdH0vJHtzb3VyY2V9YCk7XG5cbiAgICBjb3B5RGlyKHNvdXJjZURpciwgZGVzdERpcik7XG4gIH1cbn1cbi8vIH1cblxuY29uc3QgYnJhbmNoSW5mbyA9IGF3YWl0IHNpbXBsZUdpdCgnLicsIHt9KS5wdWxsKCkuYnJhbmNoKHt9KTtcblxuY29uc3QgeyBjdXJyZW50LCBicmFuY2hlcyB9ID0gYnJhbmNoSW5mbztcbmNvbnN0IGlzTWFpbiA9IGN1cnJlbnQgPT09ICdtYWluJztcbmNvbnN0IGJhc2UgPSBpc01haW4gPyAnL21haW4vJyA6IGAvJHtjdXJyZW50fS9gO1xuY29uc3QgZG9tYWluID0gJ2h0dHBzOi8vZG9jcy5kZWVwd2lzZG9tLmFpJztcbmNvbnN0IHZlcnNpb25zID0gT2JqZWN0LmtleXMoYnJhbmNoZXMpXG4gIC5yZWR1Y2UoKHZzLCBicmFuY2huYW1lKSA9PiB7XG4gICAgY29uc3QgcmVnZXggPSAvXnJlbW90ZXNcXC9vcmlnaW5cXC8odi4qKSQvO1xuICAgIGNvbnN0IFssIHJlbW90ZWJuXSA9IHJlZ2V4LmV4ZWMoYnJhbmNobmFtZSkgfHwgW107XG4gICAgaWYgKHJlbW90ZWJuKSB7XG4gICAgICB2cy5wdXNoKHJlbW90ZWJuKTtcbiAgICB9XG4gICAgcmV0dXJuIHZzO1xuICB9LCBbXSBhcyBzdHJpbmdbXSlcbiAgLnNvcnQoKVxuICAucmV2ZXJzZSgpO1xuXG5jb25zdCBzdGFibGVCcmFuY2ggPSB2ZXJzaW9uc1swXTtcbmNvbnN0IGdldFZlcnNpb25zID0gKCkgPT4ge1xuICBpZiAoIXZlcnNpb25zLmxlbmd0aCAmJiBpc01haW4pIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICB0ZXh0OiBjdXJyZW50LFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6ICdtYWluICh1bnN0YWJsZSknLFxuICAgICAgICAgIGxpbms6IGAke2RvbWFpbn0vbWFpbi9gLFxuICAgICAgICAgIHRhcmdldDogJ19ibGFuaycsXG4gICAgICAgICAgZGlzYWJsZWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIC4uLnZlcnNpb25zLm1hcCgodikgPT4gKHtcbiAgICAgICAgICB0ZXh0OiB2ID09PSBzdGFibGVCcmFuY2ggPyBgJHt2fSAoc3RhYmxlKWAgOiB2LFxuICAgICAgICAgIGxpbms6IGAke2RvbWFpbn0vJHt2fS9gLFxuICAgICAgICAgIHRhcmdldDogJ19ibGFuaycsXG4gICAgICAgIH0pKSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXTtcbn07XG5cbmNvbnN0IGJsb2dBbmRSZmNWaXNpYmxlID0gaXNNYWluO1xuY29uc3QgYXJyVmlzaWJsZSA9IChhcnI6IGFueVtdLCB2aXNpYmxlOiBib29sZWFuKSA9PiB7XG4gIHJldHVybiB2aXNpYmxlID8gYXJyIDogW107XG59O1xuXG5jb25zdCBBcGlTaWRlYmFyID0gdHJlZShcbiAgcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9zcmMvcmVmZXJlbmNlJyksXG4gIHJlc29sdmUoX19kaXJuYW1lLCAnLi4vc3JjL3JlZmVyZW5jZScpXG4pO1xuY29uc29sZS5sb2coQXBpU2lkZWJhcik7XG5cbi8vIGh0dHBzOi8vdml0ZXByZXNzLmRldi9yZWZlcmVuY2Uvc2l0ZS1jb25maWdcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJhc2UsXG4gIHRpdGxlOiAnTWV0YUdQVCcsXG4gIGRlc2NyaXB0aW9uOiAnVGhlIE11bHRpLUFnZW50IEZyYW1ld29yaycsXG4gIHNyY0RpcjogJy4vc3JjJyxcbiAgaWdub3JlRGVhZExpbmtzOiB0cnVlLFxuICBsb2NhbGVzOiB7XG4gICAgcm9vdDoge1xuICAgICAgbGFiZWw6ICdFbmdsaXNoJyxcbiAgICAgIGxhbmc6ICdlbicsXG4gICAgICBsaW5rOiAnL2VuLycsXG4gICAgICB0aGVtZUNvbmZpZzoge1xuICAgICAgICBuYXY6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnRG9jcycsXG4gICAgICAgICAgICBsaW5rOiAnL2VuL2d1aWRlL2dldF9zdGFydGVkL2ludHJvZHVjdGlvbicsXG4gICAgICAgICAgICBhY3RpdmVNYXRjaDogJy9lbi9ndWlkZS8nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgLi4uYXJyVmlzaWJsZShcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRleHQ6ICdCbG9nJyxcbiAgICAgICAgICAgICAgICBsaW5rOiAnL2VuL2Jsb2cvYWdlbnRzJyxcbiAgICAgICAgICAgICAgICBhY3RpdmVNYXRjaDogJy9ibG9nLycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnUkZDcycsXG4gICAgICAgICAgICAgICAgbGluazogJy9lbi9yZmNzL1JGQy0xMTYtTWV0YUdQVFx1NEYxOFx1NTMxNlx1NjVCOVx1Njg0OCcsXG4gICAgICAgICAgICAgICAgYWN0aXZlTWF0Y2g6ICcvZXVucy9yZmNzLycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgYmxvZ0FuZFJmY1Zpc2libGVcbiAgICAgICAgICApLFxuICAgICAgICAgIC4uLmdldFZlcnNpb25zKCksXG4gICAgICAgIF0sXG4gICAgICAgIHNpZGViYXI6IHtcbiAgICAgICAgICAnL2VuL2d1aWRlLyc6IHtcbiAgICAgICAgICAgIGJhc2U6ICcvZW4vZ3VpZGUvJyxcbiAgICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnR2V0IFN0YXJ0ZWQnLFxuICAgICAgICAgICAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ0ludHJvZHVjdGlvbicsIGxpbms6ICdnZXRfc3RhcnRlZC9pbnRyb2R1Y3Rpb24nIH0sXG4gICAgICAgICAgICAgICAgICB7IHRleHQ6ICdRdWlja3N0YXJ0JywgbGluazogJ2dldF9zdGFydGVkL3F1aWNrc3RhcnQnIH0sXG4gICAgICAgICAgICAgICAgICB7IHRleHQ6ICdJbnN0YWxsYXRpb24nLCBsaW5rOiAnZ2V0X3N0YXJ0ZWQvaW5zdGFsbGF0aW9uJyB9LFxuICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnU2V0dXAnLCBsaW5rOiAnZ2V0X3N0YXJ0ZWQvc2V0dXAnIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRleHQ6ICdUdXRvcmlhbHMnLFxuICAgICAgICAgICAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ0NvbmNlcHRzJywgbGluazogJ3R1dG9yaWFscy9jb25jZXB0cy5tZCcgfSxcbiAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ0FnZW50IDEwMScsIGxpbms6ICd0dXRvcmlhbHMvYWdlbnRfMTAxLm1kJyB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnTXVsdGlBZ2VudCAxMDEnLFxuICAgICAgICAgICAgICAgICAgICBsaW5rOiAndHV0b3JpYWxzL211bHRpX2FnZW50XzEwMS5tZCcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnVXNlIG1lbW9yaWVzJywgbGluazogJ3R1dG9yaWFscy91c2VfbWVtb3JpZXMubWQnIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdIdW1hbiBlbmdhZ2VtZW50JyxcbiAgICAgICAgICAgICAgICAgICAgbGluazogJ3R1dG9yaWFscy9odW1hbl9lbmdhZ2VtZW50Lm1kJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdJbnRlZ3JhdGlvbiB3aXRoIG9wZW4gTExNJyxcbiAgICAgICAgICAgICAgICAgICAgbGluazogJ3R1dG9yaWFscy9pbnRlZ3JhdGlvbl93aXRoX29wZW5fbGxtLm1kJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRleHQ6ICdVc2UgQ2FzZXMnLFxuICAgICAgICAgICAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0FnZW50JyxcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnUmVzZWFyY2hlcjogc2VhcmNoIHdlYiBhbmQgd3JpdGUgcmVwb3J0cycsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAndXNlX2Nhc2VzL2FnZW50L3Jlc2VhcmNoZXIubWQnLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ01hY2hpbmUgTGVhcm5pbmcgRW5naW5lZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluazogJ3VzZV9jYXNlcy9hZ2VudC9tbF9lbmdpbmVlci5tZCcsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnVHV0b3JpYWwgQXNzaXN0YW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6ICd1c2VfY2FzZXMvYWdlbnQvdHV0b3JpYWxfYXNzaXN0YW50Lm1kJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdQaG90b2dyYXBoZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluazogJ3VzZV9jYXNlcy9hZ2VudC9waG90b2dyYXBoZXIubWQnLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1JlY2VpcHQgQXNzaXN0YW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6ICd1c2VfY2FzZXMvYWdlbnQvcmVjZWlwdF9hc3Npc3RhbnQubWQnLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnTXVsdGlBZ2VudCcsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1NvZnR3YXJlIENvbXBhbnknLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluazogJ3VzZV9jYXNlcy9tdWx0aV9hZ2VudC9zb2Z0d2FyZV9jb21wYW55Lm1kJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdEZWJhdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluazogJ3VzZV9jYXNlcy9tdWx0aV9hZ2VudC9kZWJhdGUubWQnLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1dlcmV3b2xmIEdhbWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluazogJ3VzZV9jYXNlcy9tdWx0aV9hZ2VudC93ZXJld29sZl9nYW1lLm1kJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdNaW5lY3JhZnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluazogJ3VzZV9jYXNlcy9tdWx0aV9hZ2VudC9taW5lY3JhZnQubWQnLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1ZpcnR1YWwgVG93bicsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAndXNlX2Nhc2VzL211bHRpX2FnZW50L3ZpcnR1YWxfdG93bi5tZCcsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRleHQ6ICdJbi1EZXB0aCBHdWlkZXMnLFxuICAgICAgICAgICAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0FnZW50IGNvbW11bmljYXRpb24nLFxuICAgICAgICAgICAgICAgICAgICBsaW5rOiAnaW5fZGVwdGhfZ3VpZGVzL2FnZW50X2NvbW11bmljYXRpb24ubWQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0luY3JlbWVudGFsIGRldmxvcG1lbnQnLFxuICAgICAgICAgICAgICAgICAgICBsaW5rOiAnaW5fZGVwdGhfZ3VpZGVzL2luY3JlbWVudGFsX2RldmVsb3BtZW50Lm1kJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdTZXJpYWxpemF0aW9uICYgQnJlYWtwb2ludCBSZWNvdmVyeScsXG4gICAgICAgICAgICAgICAgICAgIGxpbms6ICdpbl9kZXB0aF9ndWlkZXMvYnJlYWtwb2ludF9yZWNvdmVyeS5tZCcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnQ29udHJpYnV0ZScsXG4gICAgICAgICAgICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnQ29udHJpYnV0ZSBndWlkZScsXG4gICAgICAgICAgICAgICAgICAgIGxpbms6ICdjb250cmlidXRlL2NvbnRyaWJ1dGVfZ3VpZGUubWQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGV4dDogJ0FQSScsXG4gICAgICAgICAgICAgICAgbGluazogJ2FwaScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnRkFRJyxcbiAgICAgICAgICAgICAgICBsaW5rOiAnZmFxJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnL2VuL2Jsb2cvJzoge1xuICAgICAgICAgICAgYmFzZTogJy9lbi9ibG9nLycsXG4gICAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGV4dDogJ0FnZW50cycsXG4gICAgICAgICAgICAgICAgbGluazogJ2FnZW50cycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJy9lbi9yZmNzLyc6IHtcbiAgICAgICAgICAgIGJhc2U6ICcvZW4vcmZjcy8nLFxuICAgICAgICAgICAgaXRlbXM6IFsuLi5yZmNMaW5rc10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB6aDoge1xuICAgICAgbGFiZWw6ICdcdTRFMkRcdTY1ODcnLFxuICAgICAgbGFuZzogJ3poJyxcbiAgICAgIGxpbms6ICcvemgvJyxcbiAgICAgIHRoZW1lQ29uZmlnOiB7XG4gICAgICAgIG5hdjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTY1ODdcdTY4NjMnLFxuICAgICAgICAgICAgbGluazogJy96aC9ndWlkZS9nZXRfc3RhcnRlZC9pbnRyb2R1Y3Rpb24nLFxuICAgICAgICAgICAgYWN0aXZlTWF0Y2g6ICcvemgvZ3VpZGUvJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLmFyclZpc2libGUoXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnXHU1MzVBXHU1QkEyJyxcbiAgICAgICAgICAgICAgICBsaW5rOiAnL3poL2Jsb2cvYWdlbnRzJyxcbiAgICAgICAgICAgICAgICBhY3RpdmVNYXRjaDogJy96aC9ibG9nLycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnUkZDcycsXG4gICAgICAgICAgICAgICAgbGluazogJy96aC9yZmNzL1JGQy0xMTYtTWV0YUdQVFx1NEYxOFx1NTMxNlx1NjVCOVx1Njg0OCcsXG4gICAgICAgICAgICAgICAgYWN0aXZlTWF0Y2g6ICcvemgvcmZjcy8nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGJsb2dBbmRSZmNWaXNpYmxlXG4gICAgICAgICAgKSxcbiAgICAgICAgICAuLi5nZXRWZXJzaW9ucygpLFxuICAgICAgICBdLFxuICAgICAgICBzaWRlYmFyOiB7XG4gICAgICAgICAgJy96aC9ndWlkZS8nOiB7XG4gICAgICAgICAgICBiYXNlOiAnL3poL2d1aWRlLycsXG4gICAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGV4dDogJ1x1NUYwMFx1NTlDQicsXG4gICAgICAgICAgICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU0RUNCXHU3RUNEJyxcbiAgICAgICAgICAgICAgICAgICAgbGluazogJ2dldF9zdGFydGVkL2ludHJvZHVjdGlvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU1RkVCXHU5MDFGXHU1RjAwXHU1OUNCJyxcbiAgICAgICAgICAgICAgICAgICAgbGluazogJ2dldF9zdGFydGVkL3F1aWNrc3RhcnQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1NUI4OVx1ODhDNScsXG4gICAgICAgICAgICAgICAgICAgIGxpbms6ICdnZXRfc3RhcnRlZC9pbnN0YWxsYXRpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1OTE0RFx1N0Y2RScsXG4gICAgICAgICAgICAgICAgICAgIGxpbms6ICdnZXRfc3RhcnRlZC9zZXR1cCcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnXHU2NTU5XHU3QTBCJyxcbiAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTY5ODJcdTVGRjVcdTdCODBcdThGRjAnLFxuICAgICAgICAgICAgICAgICAgICBsaW5rOiAndHV0b3JpYWxzL2NvbmNlcHRzJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTY2N0FcdTgwRkRcdTRGNTNcdTUxNjVcdTk1RTgnLFxuICAgICAgICAgICAgICAgICAgICBsaW5rOiAndHV0b3JpYWxzL2FnZW50XzEwMScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU1OTFBXHU2NjdBXHU4MEZEXHU0RjUzXHU1MTY1XHU5NUU4JyxcbiAgICAgICAgICAgICAgICAgICAgbGluazogJ3R1dG9yaWFscy9tdWx0aV9hZ2VudF8xMDEnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1NEY3Rlx1NzUyOFx1OEJCMFx1NUZDNicsXG4gICAgICAgICAgICAgICAgICAgIGxpbms6ICd0dXRvcmlhbHMvdXNlX21lbW9yaWVzJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTRFQkFcdTdDN0JcdTRFQ0JcdTUxNjUnLFxuICAgICAgICAgICAgICAgICAgICBsaW5rOiAndHV0b3JpYWxzL2h1bWFuX2VuZ2FnZW1lbnQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1OTZDNlx1NjIxMFx1NUYwMFx1NkU5MExMTScsXG4gICAgICAgICAgICAgICAgICAgIGxpbms6ICd0dXRvcmlhbHMvaW50ZWdyYXRpb25fd2l0aF9vcGVuX2xsbScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnXHU3OTNBXHU0RjhCJyxcbiAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTY2N0FcdTgwRkRcdTRGNTMnLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdThDMDNcdTc4MTRcdTU0NTgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluazogJ3VzZV9jYXNlcy9hZ2VudC9yZXNlYXJjaGVyLm1kJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTY3M0FcdTU2NjhcdTVCNjZcdTRFNjBcdTVERTVcdTdBMEJcdTVFMDgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluazogJ3VzZV9jYXNlcy9hZ2VudC9tbF9lbmdpbmVlci5tZCcsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU2NTU5XHU3QTBCXHU2NTg3XHU2ODQ4XHU1MkE5XHU2MjRCJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6ICd1c2VfY2FzZXMvYWdlbnQvdHV0b3JpYWxfYXNzaXN0YW50Lm1kJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTY0NDRcdTVGNzFcdTVFMDgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluazogJ3VzZV9jYXNlcy9hZ2VudC9waG90b2dyYXBoZXIubWQnLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1Nzk2OFx1NjM2RVx1NTJBOVx1NjI0QicsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAndXNlX2Nhc2VzL2FnZW50L3JlY2VpcHRfYXNzaXN0YW50Lm1kJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1NTkxQVx1NjY3QVx1ODBGRFx1NEY1MycsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1OEY2Rlx1NEVGNlx1NTE2Q1x1NTNGOCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAndXNlX2Nhc2VzL211bHRpX2FnZW50L3NvZnR3YXJlX2NvbXBhbnkubWQnLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1OEZBOVx1OEJCQScsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiAndXNlX2Nhc2VzL211bHRpX2FnZW50L2RlYmF0ZS5tZCcsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU3MkZDXHU0RUJBXHU2NzQwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6ICd1c2VfY2FzZXMvbXVsdGlfYWdlbnQvd2VyZXdvbGZfZ2FtZS5tZCcsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnTWluZWNyYWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6ICd1c2VfY2FzZXMvbXVsdGlfYWdlbnQvbWluZWNyYWZ0Lm1kJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTg2NUFcdTYyREZcdTVDMEZcdTk1NDcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluazogJ3VzZV9jYXNlcy9tdWx0aV9hZ2VudC92aXJ0dWFsX3Rvd24ubWQnLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnXHU4RkRCXHU5NjM2XHU2MzA3XHU1MzU3JyxcbiAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTU5MUFcdTY2N0FcdTgwRkRcdTRGNTNcdTk1RjRcdTkwMUFcdTRGRTEnLFxuICAgICAgICAgICAgICAgICAgICBsaW5rOiAnaW5fZGVwdGhfZ3VpZGVzL2FnZW50X2NvbW11bmljYXRpb24ubWQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1NTg5RVx1OTFDRlx1NUYwMFx1NTNEMScsXG4gICAgICAgICAgICAgICAgICAgIGxpbms6ICdpbl9kZXB0aF9ndWlkZXMvaW5jcmVtZW50YWxfZGV2ZWxvcG1lbnQubWQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1NUU4Rlx1NTIxN1x1NTMxNiZcdTY1QURcdTcwQjlcdTYwNjJcdTU5MEQnLFxuICAgICAgICAgICAgICAgICAgICBsaW5rOiAnaW5fZGVwdGhfZ3VpZGVzL2JyZWFrcG9pbnRfcmVjb3ZlcnkubWQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGV4dDogJ1x1OEQyMVx1NzMyRScsXG4gICAgICAgICAgICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU4RDIxXHU3MzJFXHU2MzA3XHU1MzU3JyxcbiAgICAgICAgICAgICAgICAgICAgbGluazogJ2NvbnRyaWJ1dGUvY29udHJpYnV0ZV9ndWlkZS5tZCcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnQVBJJyxcbiAgICAgICAgICAgICAgICBsaW5rOiAnYXBpJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRleHQ6ICdcdTVFMzhcdTg5QzFcdTk1RUVcdTk4OThcdTg5RTNcdTdCNTQnLFxuICAgICAgICAgICAgICAgIGxpbms6ICdmYXEnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICcvemgvYmxvZy8nOiB7XG4gICAgICAgICAgICBiYXNlOiAnL3poL2Jsb2cvJyxcbiAgICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnQWdlbnRzJyxcbiAgICAgICAgICAgICAgICBsaW5rOiAnYWdlbnRzJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnL3poL3JmY3MvJzoge1xuICAgICAgICAgICAgYmFzZTogJy96aC9yZmNzLycsXG4gICAgICAgICAgICBpdGVtczogWy4uLnJmY0xpbmtzXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBoZWFkOiBbXG4gICAgWydsaW5rJywgeyByZWw6ICdpY29uJywgdHlwZTogJ2ltYWdlL3N2Zyt4bWwnLCBocmVmOiAnL2xvZ28tZGFyay5zdmcnIH1dLFxuICBdLFxuICB2aXRlOiB7XG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IFt7IGZpbmQ6ICdALycsIHJlcGxhY2VtZW50OiBgJHtyZXNvbHZlKF9fZGlybmFtZSwgJy4uL3NyYycpfS9gIH1dLFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgVW5vQ1NTKCksXG4gICAgICBBdXRvSW1wb3J0KHtcbiAgICAgICAgaW1wb3J0czogWyd2dWUnXSxcbiAgICAgICAgZHRzOiAnLi4vYXV0by1pbXBvcnRzLmQudHMnLFxuICAgICAgfSksXG4gICAgXSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhvc3Q6IHRydWUsXG4gICAgICBvcGVuOiB0cnVlLFxuICAgIH0sXG4gIH0sXG4gIHRoZW1lQ29uZmlnOiB7XG4gICAgbG9nbzoge1xuICAgICAgbGlnaHQ6ICcvbG9nby1kYXJrLnN2ZycsXG4gICAgICBkYXJrOiAnL2xvZ28tbGlnaHQuc3ZnJyxcbiAgICB9LFxuICAgIGVkaXRMaW5rOiB7XG4gICAgICBwYXR0ZXJuOiAnaHR0cHM6Ly9naXRodWIuY29tL2dlZWthbi9NZXRhR1BULWRvY3MvYmxvYi9tYWluL3NyYy86cGF0aCcsXG4gICAgICB0ZXh0OiAnRWRpdCB0aGlzIHBhZ2Ugb24gR2l0SHViJyxcbiAgICB9LFxuICAgIG91dGxpbmU6IHtcbiAgICAgIGxldmVsOiBbMiwgM10sXG4gICAgfSxcbiAgICBzb2NpYWxMaW5rczogW1xuICAgICAgeyBpY29uOiAnZ2l0aHViJywgbGluazogJ2h0dHBzOi8vZ2l0aHViLmNvbS9nZWVrYW4vTWV0YUdQVCcgfSxcbiAgICAgIHsgaWNvbjogJ2Rpc2NvcmQnLCBsaW5rOiAnaHR0cHM6Ly9kaXNjb3JkLmNvbS9pbnZpdGUvd0NwNlEzZnNBaycgfSxcbiAgICAgIHsgaWNvbjogJ3gnLCBsaW5rOiAnaHR0cHM6Ly90d2l0dGVyLmNvbS9NZXRhR1BUXycgfSxcbiAgICAgIHtcbiAgICAgICAgaWNvbjoge1xuICAgICAgICAgIHN2ZzogTG9nbyxcbiAgICAgICAgfSxcbiAgICAgICAgbGluazogJ2h0dHBzOi8vZGVlcHdpc2RvbS5haS8nLFxuICAgICAgfSxcbiAgICBdLFxuICAgIGZvb3Rlcjoge1xuICAgICAgbWVzc2FnZTogJ1JlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS4nLFxuICAgICAgY29weXJpZ2h0OiAnQ29weXJpZ2h0IFx1MDBBOSAyMDIzLXByZXNlbnQgYWxleGFuZGVyd3UnLFxuICAgIH0sXG4gICAgc2VhcmNoOiB7XG4gICAgICBwcm92aWRlcjogJ2xvY2FsJyxcbiAgICB9LFxuICB9LFxufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy96ZXJvbGVlL0Rlc2t0b3AvZ2l0aHViL21ldGFHUFQtZG9jcy91dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3plcm9sZWUvRGVza3RvcC9naXRodWIvbWV0YUdQVC1kb2NzL3V0aWxzL3Rvb2wubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy96ZXJvbGVlL0Rlc2t0b3AvZ2l0aHViL21ldGFHUFQtZG9jcy91dGlscy90b29sLm1qc1wiO2ltcG9ydCB7IHJlc29sdmUsIGpvaW4gfSBmcm9tICdub2RlOnBhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnO1xuXG5leHBvcnQgY29uc3QgdHJlZSA9IChkaXIsIGJhc2UgPSAnJywgZmlsdGVyID0gWycubWQnXSkgPT4ge1xuICBpZiAoIWZzLmV4aXN0c1N5bmMoZGlyKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBwYXRocyA9IGZzXG4gICAgLnJlYWRkaXJTeW5jKGRpcilcbiAgICAuZmlsdGVyKChfKSA9PiBmaWx0ZXIuZXZlcnkoKF9fKSA9PiBfLmVuZHNXaXRoKF9fKSkpO1xuICBjb25zdCBkID0gcGF0aHMubWFwKChfKSA9PiB7XG4gICAgY29uc3QgcCA9IGpvaW4oZGlyLCBfKTtcbiAgICBjb25zdCBzdGF0ID0gZnMuc3RhdFN5bmMocCk7XG4gICAgaWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGV4dDogXyxcbiAgICAgICAgaXRlbXM6IHRyZWUocCwgYmFzZSwgZmlsdGVyKSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7IHRleHQ6IF8sIGxpbms6IHAucmVwbGFjZShiYXNlLCAnJykgfTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVUsU0FBdUIsb0JBQW9CO0FBQ3BYLE9BQU8sWUFBWTtBQUNuQixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLFdBQUFBLFVBQVMsUUFBQUMsYUFBWTtBQUM5QjtBQUFBLEVBQ0U7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsT0FDSztBQUNQLFNBQVMsaUJBQWlCOzs7QUNkNFIsU0FBUyxTQUFTLFlBQVk7QUFDcFYsT0FBTyxRQUFRO0FBRVIsSUFBTSxPQUFPLENBQUMsS0FBS0MsUUFBTyxJQUFJLFNBQVMsQ0FBQyxLQUFLLE1BQU07QUFDeEQsTUFBSSxDQUFDLEdBQUcsV0FBVyxHQUFHLEdBQUc7QUFDdkI7QUFBQSxFQUNGO0FBQ0EsUUFBTSxRQUFRLEdBQ1gsWUFBWSxHQUFHLEVBQ2YsT0FBTyxDQUFDLE1BQU0sT0FBTyxNQUFNLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7QUFDckQsUUFBTSxJQUFJLE1BQU0sSUFBSSxDQUFDLE1BQU07QUFDekIsVUFBTSxJQUFJLEtBQUssS0FBSyxDQUFDO0FBQ3JCLFVBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUMxQixRQUFJLEtBQUssWUFBWSxHQUFHO0FBQ3RCLGFBQU87QUFBQSxRQUNMLE1BQU07QUFBQSxRQUNOLE9BQU8sS0FBSyxHQUFHQSxPQUFNLE1BQU07QUFBQSxNQUM3QjtBQUFBLElBQ0YsT0FBTztBQUNMLGFBQU8sRUFBRSxNQUFNLEdBQUcsTUFBTSxFQUFFLFFBQVFBLE9BQU0sRUFBRSxFQUFFO0FBQUEsSUFDOUM7QUFBQSxFQUNGLENBQUM7QUFFRCxTQUFPO0FBQ1Q7OztBRHhCQSxJQUFNLG1DQUFtQztB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ZixLQUFLO0FBQUEsTUFDUCxDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQUEsRUFDQSxhQUFhO0FBQUEsSUFDWCxNQUFNO0FBQUEsTUFDSixPQUFPO0FBQUEsTUFDUCxNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0EsVUFBVTtBQUFBLE1BQ1IsU0FBUztBQUFBLE1BQ1QsTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFBQSxJQUNkO0FBQUEsSUFDQSxhQUFhO0FBQUEsTUFDWCxFQUFFLE1BQU0sVUFBVSxNQUFNLG9DQUFvQztBQUFBLE1BQzVELEVBQUUsTUFBTSxXQUFXLE1BQU0sd0NBQXdDO0FBQUEsTUFDakUsRUFBRSxNQUFNLEtBQUssTUFBTSwrQkFBK0I7QUFBQSxNQUNsRDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFVBQ0osS0FBSztBQUFBLFFBQ1A7QUFBQSxRQUNBLE1BQU07QUFBQSxNQUNSO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sU0FBUztBQUFBLE1BQ1QsV0FBVztBQUFBLElBQ2I7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLFVBQVU7QUFBQSxJQUNaO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInJlc29sdmUiLCAiam9pbiIsICJiYXNlIiwgImpvaW4iLCAicmVzb2x2ZSJdCn0K
