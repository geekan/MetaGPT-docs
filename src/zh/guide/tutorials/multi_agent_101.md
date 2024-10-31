# 多智能体入门

在上一章中，我们简要讨论了单智能体的创建。虽然对许多情况来说，单智能体可能已经足够，但更复杂的任务通常需要协作和团队合作，这也就是多智能体为什么必不可少的原因。MetaGPT的核心优势也在于轻松灵活地开发一个智能体团队。在MetaGPT框架下，用户可以通过少量代码实现智能体之间的交互。

完成本节，你将能够：

1. 理解智能体之间如何进行交互
2. 开发你的第一个智能体团队

## 运行“软件公司”示例

```shell
metagpt "write a function that calculates the product of a list"
```

## 开发你的第一个智能体团队

希望你会发现软件创业示例很有启发。也许现在你已经有了灵感，想要开发一个根据你的独特需求而定制的智能体团队。在本节中，我们将继续在[智能体入门](agent_101)中的简单代码示例中添加更多角色，并引入智能体之间的交互协作。

让我们还雇佣一名测试人员和一名审阅人员携手与编码人员一起工作。这开始看起来像一个开发团队了，不是吗？总的来说，我们需要三个步骤来建立团队并使其运作：

1. 定义每个角色能够执行的预期动作
2. 基于标准作业程序（SOP）确保每个角色遵守它。通过使每个角色观察上游的相应输出结果，并为下游发布自己的输出结果，可以实现这一点。
3. 初始化所有角色，创建一个带有环境的智能体团队，并使它们之间能够进行交互。

完整的代码在本教程的末尾可用

### 定义动作和角色

与[智能体入门](agent_101)相同的过程，我们可以定义三个具有各自动作的`Role`：

- `SimpleCoder` 具有 `SimpleWriteCode` 动作，接收用户的指令并编写主要代码
- `SimpleTester` 具有 `SimpleWriteTest` 动作，从 `SimpleWriteCode` 的输出中获取主代码并为其提供测试套件
- `SimpleReviewer` 具有 `SimpleWriteReview` 动作，审查来自 `SimpleWriteTest` 输出的测试用例，并检查其覆盖范围和质量

通过上述概述，我们使得 SOP（标准作业程序）变得更加清晰明了。接下来，我们将详细讨论如何根据 SOP 来定义`Role`。

#### 定义动作

我们列举了三个 `Action`。

````python
class SimpleWriteCode(Action):
    PROMPT_TEMPLATE: str = """
    Write a python function that can {instruction}.
    Return ```python your_code_here ``` with NO other texts,
    your code:
    """
    name: str = "SimpleWriteCode"

    async def run(self, instruction: str):
        prompt = self.PROMPT_TEMPLATE.format(instruction=instruction)

        rsp = await self._aask(prompt)

        code_text = parse_code(rsp)

        return code_text
````

````python
class SimpleWriteTest(Action):
    PROMPT_TEMPLATE: str = """
    Context: {context}
    Write {k} unit tests using pytest for the given function, assuming you have imported it.
    Return ```python your_code_here ``` with NO other texts,
    your code:
    """

    name: str = "SimpleWriteTest"

    async def run(self, context: str, k: int = 3):
        prompt = self.PROMPT_TEMPLATE.format(context=context, k=k)

        rsp = await self._aask(prompt)

        code_text = parse_code(rsp)

        return code_text
````

```python
class SimpleWriteReview(Action):
    PROMPT_TEMPLATE: str = """
    Context: {context}
    Review the test cases and provide one critical comments:
    """

    name: str = "SimpleWriteReview"

    async def run(self, context: str):
        prompt = self.PROMPT_TEMPLATE.format(context=context)

        rsp = await self._aask(prompt)

        return rsp
```

#### 定义角色

在许多多智能体场景中，定义`Role`可能只需几行代码。对于`SimpleCoder`，我们做了两件事：

1. 使用 `set_actions` 为`Role`配备适当的 `Action`，这与设置单智能体相同
2. 多智能体操作逻辑：我们使`Role` `_watch` 来自用户或其他智能体的重要上游消息。回想我们的SOP，`SimpleCoder`接收用户指令，这是由MetaGPT中的`UserRequirement`引起的`Message`。因此，我们添加了 `self._watch([UserRequirement])`。

这就是用户需要做的全部。对于那些对底层机制感兴趣的人，请参见本教程的本章中的[机制解释](#机制解释)。

```python
class SimpleCoder(Role):
    name: str = "Alice"
    profile: str = "SimpleCoder"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._watch([UserRequirement])
        self.set_actions([SimpleWriteCode])
```

---

与上述相似，对于 `SimpleTester`，我们：

1. 使用 `set_actions` 为`SimpleTester`配备 `SimpleWriteTest` 动作
2. 使`Role` `_watch` 来自其他智能体的重要上游消息。回想我们的SOP，`SimpleTester`从 `SimpleCoder` 中获取主代码，这是由 `SimpleWriteCode` 引起的 `Message`。因此，我们添加了 `self._watch([SimpleWriteCode])`。
   > 一个扩展的问题：想一想如果我们使用 `self._watch([SimpleWriteCode, SimpleWriteReview])` 会意味着什么，可以尝试这样做

此外，你可以为智能体定义自己的操作逻辑。这适用于`Action`需要多个输入的情况，你希望修改输入，使用特定记忆，或进行任何其他更改以反映特定逻辑的情况。因此，我们：

3. 重写 `_act` 函数，就像我们在[智能体入门](agent_101)中的单智能体设置中所做的那样。在这里，我们希望`SimpleTester`将所有记忆用作编写测试用例的上下文，并希望有5个测试用例。

```python
class SimpleTester(Role):
    name: str = "Bob"
    profile: str = "SimpleTester"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.set_actions([SimpleWriteTest])
        self._watch([SimpleWriteCode])
        # self._watch([SimpleWriteCode, SimpleWriteReview])  # feel free to try this too

    async def _act(self) -> Message:
        logger.info(f"{self._setting}: to do {self.rc.todo}({self.rc.todo.name})")
        todo = self.rc.todo

        # context = self.get_memories(k=1)[0].content # use the most recent memory as context
        context = self.get_memories()  # use all memories as context

        code_text = await todo.run(context, k=5)  # specify arguments
        msg = Message(content=code_text, role=self.profile, cause_by=type(todo))

        return msg
```

---

按照相同的过程定义 `SimpleReviewer`：

```python
class SimpleReviewer(Role):
    name: str = "Charlie"
    profile: str = "SimpleReviewer"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.set_actions([SimpleWriteReview])
        self._watch([SimpleWriteTest])
```

### 创建一个团队并添加角色

现在我们已经定义了三个 `Role`，是时候将它们放在一起了。我们初始化所有角色，设置一个 `Team`，并`hire` 它们。

运行 `Team`，我们应该会看到它们之间的协作！

```python
import fire
import typer
from metagpt.logs import logger
from metagpt.team import Team
app = typer.Typer()

@app.command()
def main(
    idea: str = typer.Argument(..., help="write a function that calculates the product of a list"),
    investment: float = typer.Option(default=3.0, help="Dollar amount to invest in the AI company."),
    n_round: int = typer.Option(default=5, help="Number of rounds for the simulation."),
):
    logger.info(idea)

    team = Team()
    team.hire(
        [
            SimpleCoder(),
            SimpleTester(),
            SimpleReviewer(),
        ]
    )

    team.invest(investment=investment)
    team.run_project(idea)
    await team.run(n_round=n_round)

if __name__ == "__main__":
    fire.Fire(main)
```

## 本教程的完整脚本

https://github.com/geekan/MetaGPT/blob/main/examples/build_customized_multi_agents.py

使用以下命令运行：

```sh
python3 examples/build_customized_multi_agents.py --idea "write a function that calculates the product of a list"
```

或在Colab上运行

[![在Colab中打开](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1h36AqLl7LqZO9bllpeJHpb4Ar-NW0Kwv?usp=sharing)

## 机制解释

虽然用户可以编写几行代码来设置运行的`Role`，但描述内部机制是有益的，这样用户就能理解设置代码的含义，并对框架有一个整体的了解。

![img](/image/guide/tutorials/multi_agents_flowchart.png)

如图的右侧部分所示，`Role`将从`Environment`中`_observe` `Message`。如果有一个`Role` `_watch` 的特定 `Action` 引起的 `Message`，那么这是一个有效的观察，触发`Role`的后续思考和操作。在 `_think` 中，`Role`将选择其能力范围内的一个 `Action` 并将其设置为要做的事情。在 `_act` 中，`Role`执行要做的事情，即运行 `Action` 并获取输出。将输出封装在 `Message` 中，最终 `publish_message` 到 `Environment`，完成了一个完整的智能体运行。

在每个步骤中，无论是 `_observe`、`_think` 还是 `_act`，`Role`都将与其 `Memory` 交互，通过添加或检索来实现。此外，MetaGPT提供了 `react` 过程的不同模式。这些部分的详细内容，请参阅[使用记忆](use_memories) 和 [思考与行动](agent_think_act)。

当每个 `Role` 被适当设置时，我们可以看到与本教程中前面示例相应的SOP，如图的左侧部分所示。虚线框表明如果我们使 `SimpleTester` 同时 `_watch` `SimpleWriteCode` 和 `SimpleWriteReview`，则可以扩展 SOP。

我们鼓励对此感兴趣的开发人员查看 `Role` 的[代码](https://github.com/geekan/MetaGPT/blob/main/metagpt/roles/role.py)，因为它相当易读。可以 `run`、`_observe`、`react`、`_think`、`_act`、`publish_message`的内容，应该能够让你对其有一个相当不错的理解。
