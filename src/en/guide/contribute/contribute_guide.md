# Contribution Guide

MetaGPT welcomes developers to actively participate in open source community building, including but not limited to:

- Implement functions and submit PR according to the feature description of `docs/ROADMAP.md`.
- Additional implementations besides ROADMAP (including new features, bug fixes, agent scenario cases, code annotations, etc.) and PR submissions.
- The documentation site includes supplementary submissions of tutorials, usage samples, advanced guides and other documents.
- Submit issues such as new features expected to be implemented by MetaGPT, bugs discovered during use, and exchanges on implemented applications.

## PR

Please use [fork and pull request](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project) to submit code.

Generally, **LGTM** needs to be reviewed by 2 contributors before it is allowed to be merged. After the PR with more than 10 lines of code is passed, the submitter can join the `MetaGPT-dev` group.
In general, small amounts of code are encouraged to be submitted more often. Large PR submissions often require more context understanding and review time, and it would be better if you could provide more supporting materials.

### Before submission

Please ensure that all unit tests involved in existing code modifications can pass the self-test (such as executing `pytest tests/metagpt/environment/*`).
Please ensure that the newly added code file has a single test under the corresponding path and the self-test passes.
Please ensure that the submitted code has a complete `Google Docstring` description and procedural functional comments.

Before committing, install `pre-commit` and use it to check the code specification to meet the submission conditions. The specific usage is as follows:

```bash
pip3 install pre-commit
pre-commit install
pre-commit run --all-files # or check individual files pre-commit run --files metagpt/roles/*
```

After execution, it will automatically modify the local code according to the specification requirements, and you need to `git add` again.

### When submitting

We have added the `PULL_REQUEST_TEMPLATE` template by default. Necessary information needs to be added when submitting, including:

- Features, Features added by the current PR (explaining necessity) or problems fixed. Required.
- Features Docs, Document description of the document station corresponding to the function. Optional.
- Influence, The possible impact of this feature. Optional.
- Result, (partial) single test execution result, sample execution result file or log (if any), etc. Required.
- Other, other materials that can be supplemented. Optional.

The above information can facilitate code reviewers to understand the context of the PR and speed up PR review.

### After submission

After submission, the github-ci workflow will be used by default to check code specifications and unit tests. If it does not pass, it will be sent back for modification until it passes. Therefore, in order to improve efficiency, `pre-commit` inspection and single test result review are done offline.

## Issue

Issue content can include bug feedback, description of new features expected to be supported, in-depth optimization of supported functions, etc.
Among them, new features, optimization items, etc. can be described based on your demand scenarios to provide sufficient context for further communication between the two parties. After submission, community staff will contact you and we will update it to ROADMAP after communication and confirmation.
For bug feedback, in order to have enough problem context for analysis, the `show_me_the_bug` template is added by default. Necessary information needs to be added when submitting, including:

- Bug description Bug description. Required.
- Bug solved method Bug solution (if you know how to solve it). Optional.
- Environment information includes the large model type configuration used, system version, python version and some dependent package versions of the error stack. Required.
- Screenshots or logs On-site screenshots or logs corresponding to the bug. Required.

## Documentation contribution

Documentation site address: https://docs.deepwisdom.ai
At present, the documentation site mainly includes introductory and basic tutorials, single/multi-agent examples, advanced guides, etc. At the same time, the document site currently mainly supports Chinese and English versions, so it is expected that the documents you submit will also have both Chinese and English versions.
Submitting documents also follows the [fork and pull request](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project) method.

When adding documents, please refer to the following:

- For different types of documents, please refer to the content structure of the corresponding existing document to supplement the content and save it as a markdown file.
- English documents are located in the `src/en` directory and are created in the corresponding directory. For example, tutorial documents are located in the `src/en/guide/tutorials` directory.
- Chinese documents are located in the `src/zh` directory and are created in the corresponding directory. For example, tutorial documents are located in the `src/zh/guide/tutorials` directory.
- Media files, such as pictures and videos, are located in the `src/public` directory, and the storage location must correspond to the location of the document. For example, tutorial documents involving pictures are placed in the `src/public/image/guide/tutorials` directory, and a new subdirectory is created for each document. The corresponding access method in the document is: `![img](../../../public/image/guide/tutorials/inc_req_and_fixbug/6d081360d0c74bb48794b9f8a2b0a23e.png)`. You need to pay attention to the relative path.
- Adding and modifying the sidebar (navigation directory) of the document requires configuration in `locales.themeConfig.sidebar` or `locales.zhcn.themeConfig.sidebar` in `src/.vitepress/config.mts`.
- For other documents, pictures and other resources that need to be referenced in the document, the same path can be specified for Chinese and English documents.

After adding the document, if you need to verify the deployment effect, you can refer to [Document Station Local Deployment](https://github.com/geekan/MetaGPT-docs?tab=readme-ov-file#local-deployment) locally Check the rendering and make sure it is correct before submitting the PR. After the PR is approved, the new documents will be automatically updated online.

If you encounter any problems during use, please go to [Discord Channel](https://discord.gg/ZRHeExS6xv) to communicate. We look forward to your participation!
