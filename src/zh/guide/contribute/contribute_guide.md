# 贡献指南

MetaGPT欢迎开发者积极参与开源社区建设，包括但不局限于：

- 根据`docs/ROADMAP.md`的特性描述进行功能实现和PR提交。
- 除ROADMAP外的额外实现（包括新增功能、Bug修复、智能体场景案例、代码注释说明等）和PR提交。
- 文档站上包括教程、使用样例、进阶指南等文档的补充提交。
- 期望MetaGPT实现的新特性、使用过程中发现的问题Bug、落地应用交流等Issue提交。

## PR提交
请使用 [fork and pull request](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project) 的方式进行代码提交。  

一般的，需要2个已贡献人员评审后的**LGTM**才允许合入。大于10行代码的PR通过后，提交者即可加入`MetaGPT-dev`群。  
一般的，鼓励少量代码多提交。大的PR提交往往需要更多的上下文理解和评审时间，如果你可以提供更多的辅助资料将会更好。  

### 提交前
请确保对已有代码修改涉及到的单测都能自测通过（比如执行`pytest tests/metagpt/environment/*`）。  
请确保新增加的代码文件有对应路径下的单测且自测通过。  
请确保提交的代码有完整的`Google Docstring`说明和过程功能注释。

在提交前，安装`pre-commit`，并使用其对代码规范进行检查以符合提交条件。具体使用如下：  
```bash
pip3 install pre-commit
pre-commit install
pre-commit run --all-files  # 或检查个别文件  pre-commit run --files metagpt/roles/* 
```
执行后，其会根据规范要求进行本地代码自动修改，你需要重新再`git add`。

### 提交时
我们默认添加了`PULL_REQUEST_TEMPLATE`模版，提交时需要补充必要的信息，包括：  

- Features 当前PR添加的功能。必填。
- Features Docs 功能对应的文档站文档说明。选填。
- Influence 该功能可能带来的影响。选填。
- Result （局部）单测执行结果、样例执行结果文件或日志（如有）等。必填。
- Other 可以补充的其他材料。选填。

上述信息可以方便代码审核人员了解该PR的上下文，加快PR审核速度。

### 提交后
提交后，默认会走github-ci流程用来检查代码规范和单元测试，如果不通过，将会被打回修改直至通过。因此，为了提升效率，在线下做好`pre-commit`检查和单测结果复核。

## Issue提交
Issue的内容可以包括Bug反馈、期望支持新特性描述、已支持功能的深度优化等。  
其中，对于新特性、优化项等，可以针对你的需求场景展开描述，为双方进一步沟通提供足够的上下文。提交后，将会有社区工作人员联系，沟通确认后我们也会更新到ROADMAP中。  
对于Bug反馈，为了有足够的问题上下文进行分析，默认添加了`show_me_the_bug`模版，提交时需要补充必要的信息，包括：  

- Bug description Bug描述。必填。
- Bug solved method Bug解决方式（如果你知道如何解决）。选填。
- Environment information 包括使用的大模型类型配置、系统版本、python版本及错误堆栈的部分依赖包版本。必填。
- Screenshots or logs Bug对应的现场截图或日志。必填。

## 文档贡献
文档站地址：https://docs.deepwisdom.ai   
目前文档站主要包括入门及基础教程、单/多智能体示例、进阶指南等。同时，文档站目前主要支持中英文版本，因此，期望你提交的文档也同时具备中英文版本。  
提交文档同样遵循 [fork and pull request](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project) 的方式。  

添加文档时，请参考下述内容：  

- 不同类型的文档，请参考对应已有文档的内容结构进行内容补充并保存为markdown文件。
- 英文文档位于`src/en`目录下，在对应目录下新建。比如，教程文档位于`src/en/guide/tutorials`目录下。
- 中文文档位于`src/zh`目录下，在对应目录下新建。比如，教程文档位于`src/zh/guide/tutorials`目录下。
- 媒体文件，如图片和视频，位于`src/public`目录下，存放位置要和所在文档的位置相对应。比如，教程文档涉及图片放`src/public/image/guide/tutorials`目录下，一个文档新建一个子目录存放。对应在文档内的访问方式为：`![img](../../../public/image/guide/tutorials/inc_req_and_fixbug/6d081360d0c74bb48794b9f8a2b0a23e.png)`，需要注意相对路径。
- 添加和修改文档的侧边栏（导航目录），需要在`src/.vitepress/config.mts` 中的`locales.themeConfig.sidebar`或`locales.zhcn.themeConfig.sidebar`进行配置。
- 对于文档中需要引用的其他文档、图片和其他资源，中英文文档可指定相同的路径。

添加完文档后，如果需要验证部署后的效果，可以参考[文档站本地部署](https://github.com/geekan/MetaGPT-docs?tab=readme-ov-file#local-deployment) 在本地进行渲染查看，确保无误后再发起PR提交。PR通过后，新增文档将会自动更新到线上。

使用过程中碰到的任何问题，欢迎到[Discord Channel](https://discord.gg/ZRHeExS6xv) 进行交流。我们期待你的参与！
