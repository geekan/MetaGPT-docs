# 文档贡献

文档站地址：https://docs.deepwisdom.ai

目前文档站主要包括入门及基础教程、单/多智能体示例、进阶指南等。同时，文档站目前主要支持中英文版本，因此，期望你提交的文档也同时具备中英文版本。  
除此之外，还包括API文档，但API文档主要由MetaGPT维护并自动更新得到，不在文档贡献的流程范畴内。

提交文档同样遵循 [fork and pull request](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project) 的方式。

## 本地配置

支持在本地进行文档站部署环境的安装并进行预览，方便检查渲染结果是否符合预期

### 依赖

- [Node.js](https://nodejs.org/en) 版本 18 或更高版本。
- 支持 [Markdown](https://en.wikipedia.org/wiki/Markdown) 语法的文本编辑器。
  - 建议使用 [VSCode](https://code.visualstudio.com/) 以及 [官方 Vue 扩展](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 。

### 启动

按照以下步骤启动开发服务器

1. `corepack enable pnpm` 以使用 pnpm

   或参考 [pnpm 安装](https://pnpm.io/installation)

2. `pnpm i` 安装依赖项

3. `npm run docs:dev`

开发服务器应在 http://localhost:5173 运行。访问浏览器中的 URL 即可查看新网站的运行情况！

## 文档规范

### 文档结构规范

目前文档站的文档主要包含开始、教程、示例、进阶指南几个模块

- 开始。提供了快速安装和配置文件设置的教程，帮助用户迅速进行开箱尝试。
- 教程。提供了包括单智能体、多智能体的快速入门介绍，以及一些包括人类介入、工具使用等的基本使用能力。
- 示例。提供了包括单智能体、多智能体在不同场景下的代码示例和效果介绍，帮助用户对MetaGPT的能力范围有个直接的认识。
- 进阶指南。这主要是面向开发者，提供了包括增量开放、通信机制、断点恢复等高阶功能，帮助用户进行场景深化。

不同的模块有内容上的侧重点，但在结构上基本遵循下述规范

- 不同类型的文档，请参考对应已有文档的内容结构进行内容补充并保存为markdown文件。
- 英文文档位于`src/en`目录下，在对应目录下新建。比如，教程文档位于`src/en/guide/tutorials`目录下。
- 中文文档位于`src/zh`目录下，在对应目录下新建。比如，教程文档位于`src/zh/guide/tutorials`目录下。
- 媒体文件，如图片和视频，位于`src/public`目录下，存放位置要和所在文档的位置相对应。比如，教程文档涉及图片放`src/public/image/guide/tutorials`目录下，一个文档新建一个子目录存放。对应在文档内的访问方式为：`![img](../../../public/image/guide/tutorials/inc_req_and_fixbug/6d081360d0c74bb48794b9f8a2b0a23e.png)`，需要注意相对路径。
- 添加和修改文档的侧边栏（导航目录），需要在`src/.vitepress/config.mts` 中的`locales.themeConfig.sidebar`或`locales.zhcn.themeConfig.sidebar`进行配置。
- 对于文档中需要引用的其他文档、图片和其他资源，中英文文档可指定相同的路径。

添加完文档后，在本地进行渲染查看，确保无误后再发起PR提交。PR通过后，新增文档将会自动更新到线上。

### 文档内容规范

在编写文档内容，需要考虑一些基础规范，从而使得整个文档站可以保持一致的风格

- 使用主动语态和现在时来描述内容，并保持整体文档的清晰度和语调一致
- 避免术语上的重复，尽可能在前置页面进行术语的定义，并进行引用而不是重复定义
- 尽可能通过文档相对路径的方式进行引用，降低因url改变所带来的影响
- 文档使用清晰的层级结构（标题、子标题）来组织信息，便于快速浏览。列出章节和小节的概述，帮助用户理解内容流
- 尽可能使用图表等形式来突出结果或解释复杂流程，可以很大的降低文本内容
- 提供真实案例或示例，帮助用户更好地理解应用场景
- 如果有添加代码，使用代码高亮和格式化工具，并适当添加注释以提高可读性
- 将复杂过程拆分为小步骤，逐步引导用户完成任务。在每个步骤中提供反馈，确保用户知道自己的进展
- 在教程末尾总结关键点，帮助用户巩固学习内容

使用过程中碰到的任何问题，欢迎到[Discord Channel](https://discord.gg/ZRHeExS6xv) 进行交流。我们期待你的参与！
