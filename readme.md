# MetaGPT-docs Contributing Guide

## Overview

This repo hosts the [documentation site](https://docs.deepwisdom.ai/) for [MetaGPT](https://github.com/geekan/MetaGPT). To make a contribution, simply prepare a **markdown** file and submit a Pull Request (PR). Upon the approval and merge of your PR, your markdown document will be automatically rendered to the documentation website. We welcome a diverse range of submissions, from usage guidance and typo corrections to practical application and beyond!

## File structure

```text
 ├─ src
 │ ├─ en                     # English docs
 │ │ ├─ index.md             # Home page
 │ │ ├─ guide                # Content pages
 │ │ │ ├─ get_started        # Section on the website
 │ │ │ │ ├─ introduction.md  # One page on the website
 │ │ │ │ ├─ quickstart.md    # One page on the website
 │ │ │ │ ├─ ...              # More pages
 │ │ │ ├─ tutorials          # Section on the website
 │ │ │ ├─ ...                # More sections
 │ ├─ zh                     # 中文文档 Same structure as en
 │ ├─ rfcs                   # RFC files
 │ ├─ public                 # Resources, put images or videos here
 │ ├─ blog                   # Blog files
 │ ├─ utils                  # Some utils
 ├─ vitepress/config.mts     # Navbar & sidebar config
```

## Make contribution

- Find the file of your interest by navigating `src/[language]/guide` and make your changes. The files are aranged to reflect the hierarchy on the documentation site. For example, `src/en/guide/get_started/quickstart.md` corresponds to `https://docs.deepwisdom.ai/en/guide/get_started/quickstart.html`
- Place your media files such as images or videos under `src/public/image/guide`, the path should correspond to the documents using the media. Documents of different languages use the same media. In your document, use **relative path** to refer to the media
- Translate: If you are adding a new file, translate the documents to all languages. We will provide a Translator agent soon
- For editting the sidebar, change `src/.vitepress/config.mts`, find the dictionary under `sidebar`
- Commit and submit a PR, done!

# Local Deployment

This section is relevant if you want to precheck how your changes will be rendered on the document site.

## Prerequisites

- [Node.js](https://nodejs.org/en) version 18 or higher.
- Text Editor with [Markdown](https://en.wikipedia.org/wiki/Markdown) syntax support.
  - [VSCode](https://code.visualstudio.com/) is recommended, along with the [official Vue extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar).

## Up and Running

follow steps below to start the dev server

1. `corepack enable pnpm` to use pnpm

   or refer to [pnpm Installation](https://pnpm.io/installation)

2. `pnpm i` to install dependency

3. `npm run docs:dev`

The dev server should be running at http://localhost:5173. Visit the URL in your browser to see your new site in action!
