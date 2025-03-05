# 快速开始

## 安装

```
pip install metagpt
```

完整的安装方法可在 [安装](./installation) 部分找到。

## 配置

不同LLM API（OpenAI、Azure、Anthropic等）及其他组件的配置方法请参考[配置指南](./configuration/llm_api_configuration.md)

对于正式使用MetaGPT，建议使用config2.yaml进行配置。具体说明请参考[配置文档](./configuration)

## 用一句话需求开发软件

> 注意：
>
> 以下是对[软件启动示例](https://github.com/geekan/MetaGPT/blob/main/metagpt/software_company.py)的分解说明。如果您通过git clone方式安装MetaGPT，只需直接运行：
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

<video controls>
  <source src="https://user-images.githubusercontent.com/2707039/250054654-5e8c1062-8c35-440f-bb20-2b0320f8d27d.mp4" type="video/mp4">
</video>

<b>直接使用Colab运行</b>

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1xlReN7EIpKzgZO1If29-zsw7QNUUfEbx?usp=sharing)

---

## 命令行使用说明

```
 Usage: metagpt [OPTIONS] [IDEA]

 启动新项目

╭─ Arguments ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│   idea      [IDEA]  您的创新想法，例如'创建2048游戏' [default: None]                                                                                                                                                     │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭─ Options ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ --investment                                     FLOAT    对AI公司的投资金额（美元）[default: 3.0]                                                                                                                     │
│ --n-round                                        INTEGER  模拟轮数 [default: 5]                                                                                                                                        │
│ --code-review                --no-code-review             是否启用代码审查 [default: code-review]                                                                                                                      │
│ --run-tests                  --no-run-tests               是否启用测试质量保障 [default: no-run-tests]                                                                                                                 │
│ --implement                  --no-implement               是否启用代码实现 [default: implement]                                                                                                                       │
│ --project-name                                   TEXT     唯一项目名称，例如'game_2048'                                                                                                                               │
│ --inc                        --no-inc                     增量模式。用于与现有仓库协作 [default: no-inc]                                                                                                              │
│ --project-path                                   TEXT     指定旧版本项目的目录路径以满足增量需求                                                                                                                      │
│ --reqa-file                                      TEXT     指定质量保障代码重写的源文件名                                                                                                                              │
│ --max-auto-summarize-code                        INTEGER  自动调用'SummarizeCode'操作的最大次数，-1表示无限制。该参数用于调试工作流 [default: 0]                                                                      │
│ --recover-path                                   TEXT     从现有序列化存储恢复项目 [default: None]                                                                                                                    │
│ --init-config                --no-init-config             初始化MetaGPT的配置文件 [default: no-init-config]                                                                                                           │
│ --help                                                    显示帮助信息并退出                                                                                                                                          │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```
