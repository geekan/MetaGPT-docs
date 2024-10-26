# Code Contribution

## Development Environment Setup

You can refer to [Installation](../../get_started/installation.md) to configure the development environment

## Basic Guideline

- Searching to see if there are similar issues or PRs to avoid duplicate creation
- Describing the issue or submitted PR as clearly as possible
- Performing comprehensive code formatting and unit test checks before writing code, and submit only after passing
- Checking for updated dependency package versions to avoid installation failures in the new environment

## PR

Please use [fork and pull request](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project) to submit code.

Generally, **LGTM** needs to be reviewed by 2 contributors before it is allowed to be merged. After the PR with more than 10 lines of code is passed, the submitter can join the `MetaGPT-dev` group.
In general, small amounts of code are encouraged to be submitted more often. Large PR submissions often require more context understanding and review time, and it would be better if you could provide more supporting materials.

PR generally includes bug fixes and new feature submissions, and both need to be submitted as per the following process specifications as possible.

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
