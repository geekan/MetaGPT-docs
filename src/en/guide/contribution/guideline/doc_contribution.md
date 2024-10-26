# Document Contribution

Documentation site address: https://docs.deepwisdom.ai

At present, the documentation site mainly includes introductory and basic tutorials, single/multi-agent examples, advanced guides, etc. At the same time, the document site currently mainly supports Chinese and English versions, so it is expected that the documents you submit will also have both Chinese and English versions.  
In addition, API documentation is also included, but the API documentation is mainly maintained and automatically updated by MetaGPT and is not within the scope of the document contribution process.

Submitting documents also follows the [fork and pull request](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project) method.

## Local Setup

Supporting local installation and preview of the document station deployment environment, making it easy to check whether the rendering results meet expectations

### Prerequisites

- [Node.js](https://nodejs.org/en) version 18 or higher.
- Text Editor with [Markdown](https://en.wikipedia.org/wiki/Markdown) syntax support.
  - [VSCode](https://code.visualstudio.com/) is recommended, along with the [official Vue extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar).

### Launching

follow steps below to start the dev server

1. `corepack enable pnpm` to use pnpm

   or refer to [pnpm Installation](https://pnpm.io/installation)

2. `pnpm i` to install dependency

3. `npm run docs:dev`

The dev server should be running at http://localhost:5173. Visit the URL in your browser to see your new site in action!

## Document Standards

### Document Structure Standards

The documents on the documentation site currently include several modules: Getting Started, Tutorials, Use Cases, and In-Depth Guides.

- Getting Started. Provides a quick installation and configuration file setting tutorial to help users quickly try out the box.
- Tutorials. Provides a quick introduction to single-agent and multi-agent, as well as some basic usage capabilities including human intervention and tool use.
- Use Cases. Provides code examples and effect introductions for single-agent and multi-agent in different scenarios to help users have a direct understanding of the capabilities of MetaGPT.
- In-Depth Guides. This is mainly for developers, providing advanced functions including incremental opening, communication mechanism, breakpoint recovery, etc. to help users deepen the scene.

Different modules have different content focuses, but the structure basically follows the following specifications

- For different types of documents, please refer to the content structure of the corresponding existing document to supplement the content and save it as a markdown file.
- English documents are located in the `src/en` directory and are created in the corresponding directory. For example, tutorial documents are located in the `src/en/guide/tutorials` directory.
- Chinese documents are located in the `src/zh` directory and are created in the corresponding directory. For example, tutorial documents are located in the `src/zh/guide/tutorials` directory.
- Media files, such as pictures and videos, are located in the `src/public` directory, and the storage location must correspond to the location of the document. For example, tutorial documents involving pictures are placed in the `src/public/image/guide/tutorials` directory, and a new subdirectory is created for each document. The corresponding access method in the document is: `![img](../../../public/image/guide/tutorials/inc_req_and_fixbug/6d081360d0c74bb48794b9f8a2b0a23e.png)`. You need to pay attention to the relative path.
- Adding and modifying the sidebar (navigation directory) of the document requires configuration in `locales.themeConfig.sidebar` or `locales.zhcn.themeConfig.sidebar` in `src/.vitepress/config.mts`.
- For other documents, pictures and other resources that need to be referenced in the document, the same path can be specified for Chinese and English documents.

After adding the document, make sure it is correct before submitting the PR. After the PR is approved, the new documents will be automatically updated online.

### Document Content Standards

When writing document content, you need to consider some basic specifications so that the entire document site can maintain a consistent style.

- Using active voice and present tense to describe content, and keep the clarity and tone of the entire document consistent
- Avoiding duplication of terminology, define terms on the front page as much as possible, and quote instead of repeating the definition
- Reference via document relative path as much as possible to reduce the impact of URL changes
- The document uses a clear hierarchical structure (titles, subtitles) to organize information for quick browsing. List an overview of chapters and sections to help users understand the content flow
- Using charts and other forms to highlight results or explain complex processes as much as possible, which can greatly reduce the text content
- Providing real cases or examples to help users better understand the application scenario
- If code is added, use code highlighting and formatting tools, and add appropriate comments to improve readability
- Breaking complex processes into small steps and guide users to complete the task step by step. Provide feedback at each step to ensure that users know their progress
- Summarizing key points at the end of the tutorial to help users consolidate their learning content

If you encounter any problems during use, please go to [Discord Channel](https://discord.gg/ZRHeExS6xv) to communicate. We look forward to your participation!
