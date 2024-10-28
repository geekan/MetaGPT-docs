# 代码贡献

## 开发环境配置

你可以参考[安装](../../get_started/installation.md)进行开发环境的配置

## 基础指南

- 先搜索判断是否存在相似的Issue或PR，避免重复创建
- 尽可能清楚的描述Issue或提交的PR
- 提前代码前进行全面的代码格式规范、单元测试检查，通过后再提交
- 检查更新的依赖包版本，避免在新环境中安装失败

## PR提交

请使用 [fork and pull request](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project) 的方式进行代码提交。

一般的，需要2个已贡献代码人员评审后的**LGTM**才允许合入。大于10行代码的PR通过后，提交者即可申请加入`MetaGPT-dev`群。  
一般的，鼓励少量代码多提交。大的PR提交往往需要更多的上下文理解和评审时间，如果你可以提供更多的辅助资料将会更好。

PR一般包括bug修复和新功能提交，都需要尽可能按下述流程规范进行提交。

### 提交前

请确保对已有代码修改涉及到的单测或新增代码对应的新增单测可以自测通过。  
请确保提交的代码有完整的`Google Docstring`说明和过程功能注释。

我们使用`pytest`进行单测试下。在提交前，安装`pytest`相关依赖包，对修改的代码更新单测或新增的代码增加单测。一般的，我们期望单测文件名以`test_`为开头，并且使用相同的模块路径进行创建，例如：`role.py`实现了角色抽象，并放置在`metagpt/roles/`下，对应的单测文件应该为`tests/metagpt/roles/test_role.py`。  
特别的，对于需要进行网络访问的单测，比如`provider`，我们建议使用`mock`方式进行添加，不会收到网络的影响。一个可参考的例子是：`tests/metagpt/provider/test_qianfan_api.py`。

```bash
pip3 install pytest==7.2.2 pytest-mock==3.11.1 pytest-asyncio==0.21.1  # 推荐的
pytest tests                                        # 示例，执行全部单测文件
pytest tests/metagpt/environment/*                  # 示例，执行多个单测文件
pytest tests/metagpt/environment/test_base_env.py   # 示例，执行单个单测文件
```

在提交前，安装`pre-commit`，并使用其对代码规范进行检查以符合提交条件。具体使用如下：

```bash
pip3 install pre-commit
pre-commit install
pre-commit run --all-files  # 或检查个别文件  pre-commit run --files metagpt/roles/*
```

执行后，其会根据规范要求进行本地代码自动修改，你需要重新再`git add`。

### 提交时

我们默认添加了`PULL_REQUEST_TEMPLATE`模版，提交时需要补充必要的信息，包括：

- Features 当前PR添加的功能（说明必要性）或修复的问题。必填。
- Features Docs 功能对应的文档站文档说明。选填。
- Influence 该功能可能带来的影响。选填。
- Result （局部）单测执行结果、样例执行结果文件或日志（如有）等。必填。
- Other 可以补充的其他材料。选填。

上述信息可以方便代码审核人员了解该PR的上下文，加快PR审核速度。

### 提交后

提交后，默认会走github-ci流程用来检查代码规范和单元测试，如果不通过，将会被打回修改直至通过。因此，为了提升效率，在线下做好`pre-commit`检查和单测结果复核。

## Issue提交

Issue的内容可以包括Bug反馈、期望支持新特性描述、已支持功能的深度优化等。

其中，对于新特性、优化项等，可以针对你的需求场景展开描述，为双方进一步沟通提供足够的上下文。提交后，将会有社区工作人员联系，沟通确认后我们也会更新到ROADMAP中。我们默认添加了`request_new_features`模板，提交时需要补充必要的信息，包括：

- Feature description，Feature描述。必填。
- Your Feature，描述实现Feature的动机、想法、参考来源或实现过程。选填。

对于Bug反馈，为了有足够的问题上下文进行分析，默认添加了`show_me_the_bug`模版，提交时需要补充必要的信息，包括：

- Bug description，Bug描述。必填。
- Bug solved method，Bug解决方式（如果你知道如何解决）。选填。
- Environment information，包括使用的大模型类型配置、系统版本、python版本及错误堆栈的部分依赖包版本。必填。
- Screenshots or logs，Bug对应的现场截图或日志。必填。
