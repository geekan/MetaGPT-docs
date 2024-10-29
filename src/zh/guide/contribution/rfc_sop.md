# RFC SOP

我们直接使用 [MetaGPT-docs](https://github.com/geekan/MetaGPT-docs) 下的一个子目录作为RFC集合的管理仓库，对应的目录结构为

```text
MetaGPT-docs
├── readme.md
├── src
│    ├── public
│    │    ├── image
│    │    │    ├── rfcs
│    │    │    │    ├── 001           # rfc number, to store figures and so on
│    │    │    │    └── 002
│    ├── rfcs
│    │    ├── 001_20241010_agent_communication.md
│    │    └── 000_yyyymmdd_rfc_template.md  # RFC撰写模板，以编号_提交日期_标题命名
```

## 了解 RFC SOP

### RFC 适用范围

RFC是变更请求，主要用于描述`MetaGPT`的新特性或重要功能更新。通过`markdown`进行输出，并存储于`MetaGPT-docs`中，记录`MetaGPT`的历史实现功能。通过这些设计文档输出与交流反馈，让`MetaGPT`社区参与其中。  
RFC的主要受众是`MetaGPT`开发社区，作为开发期间功能设计的指导指南。次要受众是功能设计出发点和实现过程感兴趣的一般用户和开发人员。

#### 什么情况下需要写一个RFC

正如前面所提到的，在符合下述情况下，建议进行RFC的输出

- 当你看到路线图中的待实现特性，并期望就该特性实现做一个功能设计说明时
- 当你比较了解`MetaGPT`后，期望添加一些新特性并阐述你的想法时
- 当你比较了解`MetaGPT`并从中发现了一些值得比较大范围的重构改动升级时

### 谁参与其中

#### 创建者

创建者是RFC文档的创建者和主要编写、维护者，针对期望实现的功能按RFC模版进行输出和更新。并在过程中，针对社区的反馈进行更新。

#### 发起者

发起者是项目的主要维护者，起到创建者与评审委员会的桥梁作用，进行相关的评审组织工作。
一般的，发起者也可以是创建者。

#### 社区人员

针对RFC文档进行评论，包括设计思路差异、是否满足需求等。社区人员的评论应围绕RFC主题相关，客观的对RFC内容给予有效的建议。

#### 评审委员会

`MetaGPT`的主要维护者，由社区多位核心贡献者组成。负责决定是否批准RFC。

- 如果存在文档编号冲突，评审委员会人员将出面进行协调解决
- 如果功能设计存在较大的争议，评审委员会将召集相关人员进行讨论并确定最终结论

## RFC 合入流程

我们遵循下述流程进行RFC的管理

- 创建者可以在项目的核心贡献者中选择一位作为发起者

  如果在PR发布后的2个星期内没找到对应的发起者，对应PR将会被关闭

- 通过使用 [fork and pull request](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project) 的方式创建你的RFC请求

  参考[RFC模版](https://github.com/geekan/MetaGPT-docs/src/zh/guide/contribution/xxx_yyyymmdd_rfc_template.md) 按照`xxx_yyyymmdd_rfc_title`（编号\_日期\_RFC标题，xxx为当前已合入RFC最大编号值+1，yyyymmdd为提交日期，rfc_title为rfc标题，需尽量精练简短）进行RFC文件命名。例如，如果你的RFC标题为agent_communication，你可以命名为`001_20241010_agent_communication`。在文件中需要引入图片等素材时，将其放置到`src/public/image/rfcs/001`子文件夹下（001为你的RFC编号）。

  在RFC文件的前文填写包括创建者、发起者、更新日期等基础信息。

- RFC PR发布后，发起者需要在**两周内**组织相关的评审会，针对设计展开讨论并确定是否合入。如果未能达成共识，创建者需针对存在问题展开进一步说明，发起者确定下一次的评审时间（一般在**一周内**）。
- 不符合标准或评审未通过的PR将被要求进行修改或拒绝，通过的PR将会在社区进行推广。

## 保持高标准

RFC 撰写不易，我们鼓励和欢迎贡献者能够按该标准撰写。但同时我们应该以一个较高的标准来保证质量。  
当碰到下述情况时，RFC文档需要进行大范围的修改或被拒绝合入。

- 没有发起者组织对应的评审会
- 评审期间未能就设计思路达成共识
- 拒绝接受评审阶段产生的反馈意见（包括但不局限于兼容性、影响面解决等）

RFC的评审过程和代码的评审过程是独立进行的，我们将尽可能在设计阶段讨论清楚，减少实现过程中的冲突。

## 致谢

本 RFC SOP在一定程度上参考了[tensorflow rfcs](https://github.com/tensorflow/community/tree/master/rfcs) 的设计，在此表示感谢。
