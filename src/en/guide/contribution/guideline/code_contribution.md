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

Please ensure that the unit tests involved in the modification of existing code or the new unit tests corresponding to the new code can pass the self-test.
Please ensure that the submitted code has a complete `Google Docstring` description and procedural functional comments.

We use `pytest` for single testing. Before submitting, install `pytest` related dependency packages, update the unit test for the modified code or add a unit test for the newly added code. Generally, we expect the unit test file name to start with `test_` and be created using the same module path. For example: `role.py` implements role abstraction and is placed under `metagpt/roles/`. The corresponding unit test file should be `tests/metagpt/roles/test_role.py`.  
In particular, for unit tests that require network access, such as `provider`, we recommend using the `mock` method to add it, which will not be affected by the network. A reference example is: `tests/metagpt/provider/test_qianfan_api.py`.

```bash
pip3 install pytest==7.2.2 pytest-mock==3.11.1 pytest-asyncio==0.21.1 # Recommended
pytest tests # Example, execute all test files
pytest tests/metagpt/environment/* # Example, execute multiple test files
pytest tests/metagpt/environment/test_base_env.py # Example, execute a single test file
```

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

Among them, new features, optimization items, etc. can be described based on your demand scenarios to provide sufficient context for further communication between the two parties. After submission, community staff will contact you and we will update it to ROADMAP after communication and confirmation. We have added the `request_new_features` template by default. When submitting, you need to add the necessary information, including:

- Feature description, Feature description. Required.
- Your Feature, Describes the motivation, idea, reference source or implementation process for implementing the Feature. Optional.

For bug feedback, in order to have enough problem context for analysis, the `show_me_the_bug` template is added by default. Necessary information needs to be added when submitting, including:

- Bug description, Bug description. Required.
- Bug solved method, Bug solution (if you know how to solve it). Optional.
- Environment information, includes the large model type configuration used, system version, python version, and some dependent package versions of the error stack. Required.
- Screenshots or logs, On-site screenshots or logs corresponding to the bug. Required.
