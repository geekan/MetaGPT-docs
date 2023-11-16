# Prerequisites

- [Node.js](https://nodejs.org/en) version 18 or higher.
- Text Editor with [Markdown](https://en.wikipedia.org/wiki/Markdown) syntax support.
  - [VSCode](https://code.visualstudio.com/) is recommended, along with the [official Vue extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar).

# Up and Running

follow steps below to start the dev server

1. `corepack enable pnpm` to use pnpm

2. `pnpm i` to install dependency

3. `npm run docs:dev`

The dev server should be running at http://localhost:5173. Visit the URL in your browser to see your new site in action!

# file structure

```text
 ├─ src
 | ├─ blog        # blog file  /blog/xxx
 | ├─ guide       #  /guide/xxx
 | ├─ rfcs        #  /rfcs/xxx
 | ├─ public      #  you can put resource here
 | ├─ utils       # some utils
 | ├─ index.md    # home page;
 | ├─ zhcn        # 中文文档  same as src; config at ./vitepress/config.mts   [locales.zhcn.themeConfig]

```

# deploy status

[![Netlify Status](https://api.netlify.com/api/v1/badges/08d5971b-904b-4556-9270-e5c4a4368c5c/deploy-status)](https://app.netlify.com/sites/metagpt-docs/deploys)
