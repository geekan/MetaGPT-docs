# 快速开始

## 安装

```
pip install metagpt
```

完整的安装方法可在 [安装](./installation) 部分找到。

## 配置

完整配置不同LLM API（比如OpenAI、Azure、Anthropic等）的方法可在 [配置](./configuration/llm_api_configuration.md) 部分找到。

## 一句话需求的软件开发

> 注意：
>
> 下面为 [software startup example](https://github.com/geekan/MetaGPT/blob/main/metagpt/software_company.py) 的节选。如果你使用`git clone`方法进行安装，只需简单执行
>
> ```
> metagpt "write a cli blackjack game"
> ```
>
> 现在，让我们开始吧！我们将创建一个多智能体团队，根据我们的一句话需求编写软件。

首先，导入已实现的角色

```python
import asyncio
from metagpt.roles import (
    Architect,
    Engineer,
    ProductManager,
    ProjectManager,
)
from metagpt.team import Team
```

然后，初始化公司团队，配置对应的智能体，设置对应的预算以及提供一个写一个小游戏的需求。

```python
async def startup(idea: str):
    company = Team()
    company.hire(
        [
            ProductManager(),
            Architect(),
            ProjectManager(),
            Engineer(),
        ]
    )
    company.invest(investment=3.0)
    company.run_project(idea=idea)

    await company.run(n_round=5)
```

最后，运行并得到生成的游戏代码！

```python
await startup(idea="write a cli blackjack game") # blackjack: 二十一点
```

运行效果大致如下:

<video  controls>
  <source src="https://user-images.githubusercontent.com/2707039/250054654-5e8c1062-8c35-440f-bb20-2b0320f8d27d.mp4" type="video/mp4">
</video>

<b>直接使用Colab运行</b>

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1xlReN7EIpKzgZO1If29-zsw7QNUUfEbx?usp=sharing)

---

## 命令行使用说明

```
 Usage: metagpt [OPTIONS] [IDEA]

 Start a new project.

╭─ Arguments ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│   idea      [IDEA]  Your innovative idea, such as 'Create a 2048 game.' [default: None]                                                                                                                                │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭─ Options ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ --investment                                     FLOAT    Dollar amount to invest in the AI company. [default: 3.0]                                                                                                    │
│ --n-round                                        INTEGER  Number of rounds for the simulation. [default: 5]                                                                                                            │
│ --code-review                --no-code-review             Whether to use code review. [default: code-review]                                                                                                           │
│ --run-tests                  --no-run-tests               Whether to enable QA for adding & running tests. [default: no-run-tests]                                                                                     │
│ --implement                  --no-implement               Enable or disable code implementation. [default: implement]                                                                                                  │
│ --project-name                                   TEXT     Unique project name, such as 'game_2048'.                                                                                                                    │
│ --inc                        --no-inc                     Incremental mode. Use it to coop with existing repo. [default: no-inc]                                                                                       │
│ --project-path                                   TEXT     Specify the directory path of the old version project to fulfill the incremental requirements.                                                               │
│ --reqa-file                                      TEXT     Specify the source file name for rewriting the quality assurance code.                                                                                       │
│ --max-auto-summarize-code                        INTEGER  The maximum number of times the 'SummarizeCode' action is automatically invoked, with -1 indicating unlimited. This parameter is used for debugging the      │
│                                                           workflow.                                                                                                                                                    │
│                                                           [default: 0]                                                                                                                                                 │
│ --recover-path                                   TEXT     recover the project from existing serialized storage [default: None]                                                                                         │
│ --init-config                --no-init-config             Initialize the configuration file for MetaGPT. [default: no-init-config]                                                                                     │
│ --help                                                    Show this message and exit.                                                                                                                                  │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

```
