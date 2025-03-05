# MetaGPT-docs 贡献指南

## 概述

本仓库托管 [MetaGPT](https://github.com/geekan/MetaGPT) 的[文档网站](https://docs.deepwisdom.ai/)。要做出贡献，只需准备一个**markdown**文件并提交拉取请求（PR）。在您的PR获得批准并合并后，您的markdown文档将自动渲染到文档网站上。我们欢迎各种形式的提交，包括使用指南、错别字修正、实际应用等等！

## 文件结构

```text
 ├─ src
 │ ├─ en                     # 英文文档
 │ │ ├─ index.md             # 主页
 │ │ ├─ guide                # 内容页面
 │ │ │ ├─ get_started        # 网站上的版块
 │ │ │ │ ├─ introduction.md  # 网站上的一个页面
 │ │ │ │ ├─ quickstart.md    # 网站上的一个页面
 │ │ │ │ ├─ ...              # 更多页面
 │ │ │ ├─ tutorials          # 网站上的版块
 │ │ │ ├─ ...                # 更多版块
 │ ├─ zh                     # 中文文档 与英文相同的结构
 │ ├─ rfcs                   # RFC文件
 │ ├─ public                 # 资源文件，在此处放置图片或视频
 │ ├─ blog                   # 博客文件
 │ ├─ utils                  # 一些工具
 ├─ vitepress/config.mts     # 导航栏和侧边栏配置
```

## 做出贡献

- 通过浏览`src/[语言]/guide`找到您感兴趣的文件并进行修改。文件的排列反映了文档网站上的层次结构。例如，`src/en/guide/get_started/quickstart.md`对应于`https://docs.deepwisdom.ai/en/guide/get_started/quickstart.html`
- 将您的媒体文件（如图片或视频）放在`src/public/image/guide`下，路径应与使用该媒体的文档相对应。不同语言的文档使用相同的媒体。在您的文档中，使用**相对路径**引用媒体
- 翻译：如果您添加新文件，请将文档翻译成所有语言。我们将很快提供一个翻译代理
- 要编辑侧边栏，请修改`src/.vitepress/config.mts`，找到`sidebar`下的字典
- 提交并提交PR，完成！

# 本地部署

如果您想预先检查您的更改在文档站点上的渲染效果，本节内容将对您有所帮助。

## 前提条件

- [Node.js](https://nodejs.org/en) 18版本或更高。
- 支持[Markdown](https://en.wikipedia.org/wiki/Markdown)语法的文本编辑器。
  - 推荐使用[VSCode](https://code.visualstudio.com/)，以及[官方Vue扩展](https://marketplace.visualstudio.com/items?itemName=Vue.volar)。

## 启动步骤

按照以下步骤启动开发服务器

1. `corepack enable pnpm` 以使用pnpm

   或参考 [pnpm安装](https://pnpm.io/installation)

2. `pnpm i` 安装依赖

3. `npm run docs:dev`

开发服务器应该在 http://localhost:5173 运行。在浏览器中访问该URL，查看您的新站点！
