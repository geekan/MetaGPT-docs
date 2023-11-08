
# 快速开始
## 安装
```
pip install metagpt
```
完整的安装方法可在 [安装](./installation) 部分找到。

## 配置
```
import os
os.environ["OPENAI_API_KEY"] = "sk-..."
os.environ["OPENAI_API_MODEL"] = "gpt-4"
```
完整配置不同LLM API（比如OpenAI、Azure、Anthropic等）的方法可在 [配置](./setup) 部分找到。

## 一句话需求的软件开发
>注意：
>
>下面为 [software startup example](https://github.com/geekan/MetaGPT/blob/main/startup.py) 的节选。如果你使用`git clone`方法进行安装，只需简单执行
>```
>python startup.py --idea "write a cli blackjack game"
>```
现在，让我们开始吧！我们将创建一个多智能体团队，根据我们的一句话需求编写软件。

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
company = Team()
company.hire(
    [
        ProductManager(),
        Architect(),
        ProjectManager(),
        Engineer()
    ]
)

company.invest(investment=3.0)
company.start_project(idea="write a cli blackjack game")
```
最后，执行并得到生成的游戏代码！
```python
await company.run(n_round=5)
```

<b>直接试试下面的例子</b>

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1X8XSn8AN1WFv_PwtTres62OoVUNfHRAH?usp=sharing)
