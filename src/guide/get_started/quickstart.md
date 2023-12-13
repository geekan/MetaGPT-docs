# Quickstart

## Installation

```
pip install metagpt
```

Available installation methods can be found in the [Installation](./installation) section

## Setup

```
import os
os.environ["OPENAI_API_KEY"] = "sk-..."
os.environ["OPENAI_API_MODEL"] = "gpt-4"
```

Variations for setting up LLM API (OpenAI, Azure, Anthropic, etc.) and other components can be found in the [Setup](./setup) section.

We use environment variables for a quick demo. For formal usage of MetaGPT, we recommend using a config or key file. See [Setup](./setup).

## Develop software with a one-line requirement

> Note:
>
> Below is a breakdown of the [software startup example](https://github.com/geekan/MetaGPT/blob/main/metagpt/startup.py). If you install MetaGPT with the git clone approach, simply run
>
> ```
> metagpt --idea "write a cli blackjack game"
> ```
>
> Now, let's get started! We will create a team of agents to write software based on one line of our instruction.

First, import off-the-shelf roles

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

Next, initiate the team, equip it with agents, set their budget, and provide our requirement of writing a small game

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

Finally, run it and get the code!

```python
await startup(idea="write a cli blackjack game")
```

You may expect similar outputs below:

<video  controls>
  <source src="https://user-images.githubusercontent.com/2707039/250054654-5e8c1062-8c35-440f-bb20-2b0320f8d27d.mp4" type="video/mp4">
</video>

<b>Try this example on the spot:</b>

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1X8XSn8AN1WFv_PwtTres62OoVUNfHRAH?usp=sharing)
