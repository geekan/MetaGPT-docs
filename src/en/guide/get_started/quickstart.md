# Quickstart

## Installation

```
pip install metagpt
```

Available installation methods can be found in the [Installation](./installation) section

## Configuration

Variations for setting up LLM API (OpenAI, Azure, Anthropic, etc.) and other components can be found in the [Configuration](./configuration/llm_api_configuration.md) section.

For formal usage of MetaGPT, using a config2.yaml. See [Configuration](./configuration).

## Develop software with a one-line requirement

> Note:
>
> Below is a breakdown of the [software startup example](https://github.com/geekan/MetaGPT/blob/main/metagpt/software_company.py). If you install MetaGPT with the git clone approach, simply run
>
> ```
> metagpt "write a cli blackjack game"
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

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1xlReN7EIpKzgZO1If29-zsw7QNUUfEbx?usp=sharing)

---

## Usage

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
