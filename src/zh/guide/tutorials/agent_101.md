# 智能体入门

完成本节，你将能够：

1. 使用现成的智能体
2. 开发你的第一个能够执行一个或多个动作的智能体

## 使用现成的智能体

```python
# 可导入任何角色，初始化它，用一个开始的消息运行它，完成！
import asyncio

from metagpt.context import Context
from metagpt.roles.product_manager import ProductManager
from metagpt.logs import logger

async def main():
    msg = "Write a PRD for a snake game"
    context = Context()  # 显式创建会话Context对象，Role对象会隐式的自动将它共享给自己的Action对象
    role = ProductManager(context=context)
    while msg:
        msg = await role.run(msg)
        logger.info(str(msg))

if __name__ == '__main__':
    asyncio.run(main())
```

## 开发你的第一个智能体

从实际使用的角度考虑，一个智能体要对我们有用，它必须具备哪些基本要素呢？从MetaGPT的观点来看，如果一个智能体能够执行某些动作（无论是由LLM驱动还是其他方式），它就具有一定的用途。简单来说，我们定义智能体应该具备哪些行为，为智能体配备这些能力，我们就拥有了一个简单可用的智能体！MetaGPT提供高度灵活性，以定义您自己所需的行为和智能体。我们将在本节的其余部分指导您完成这一过程。

### 一个智能体运行周期的流程图

![flowchart](/public/image/guide/tutorials/agent_run_flowchart.png)

## 具有单一动作的智能体

假设我们想用自然语言编写代码，并想让一个智能体为我们做这件事。让我们称这个智能体为 SimpleCoder，我们需要两个步骤来让它工作：

1. 定义一个编写代码的动作
2. 为智能体配备这个动作

### 定义动作

在 MetaGPT 中，类 `Action` 是动作的逻辑抽象。用户可以通过简单地调用 self.\_aask 函数令 LLM 赋予这个动作能力，即这个函数将在底层调用 LLM api。

在我们的场景中，我们定义了一个 `SimpleWriteCode` 子类 `Action`。虽然它主要是一个围绕提示和 LLM 调用的包装器，但我们认为这个 `Action` 抽象更直观。在下游和高级任务中，使用它作为一个整体感觉更自然，而不是分别制作提示和调用 LLM，尤其是在智能体的框架内。

````python
from metagpt.actions import Action

class SimpleWriteCode(Action):
    PROMPT_TEMPLATE: str = """
    Write a python function that can {instruction} and provide two runnnable test cases.
    Return ```python your_code_here ``` with NO other texts,
    your code:
    """

    name: str = "SimpleWriteCode"

    async def run(self, instruction: str):
        prompt = self.PROMPT_TEMPLATE.format(instruction=instruction)

        rsp = await self._aask(prompt)

        code_text = SimpleWriteCode.parse_code(rsp)

        return code_text

    @staticmethod
    def parse_code(rsp):
        pattern = r"```python(.*)```"
        match = re.search(pattern, rsp, re.DOTALL)
        code_text = match.group(1) if match else rsp
        return code_text
````

### 定义角色

在 MetaGPT 中，`Role` 类是智能体的逻辑抽象。一个 `Role` 能执行特定的 `Action`，拥有记忆、思考并采用各种策略行动。基本上，它充当一个将所有这些组件联系在一起的凝聚实体。目前，让我们只关注一个执行动作的智能体，并看看如何定义一个最简单的 `Role`。

在这个示例中，我们创建了一个 `SimpleCoder`，它能够根据人类的自然语言描述编写代码。步骤如下：

1. 我们为其指定一个名称和配置文件。
2. 我们使用 `self._init_action` 函数为其配备期望的动作 `SimpleWriteCode`。
3. 我们覆盖 `_act` 函数，其中包含智能体具体行动逻辑。我们写入，我们的智能体将从最新的记忆中获取人类指令，运行配备的动作，MetaGPT将其作为待办事项 (`self.rc.todo`) 在幕后处理，最后返回一个完整的消息。

```python
from metagpt.roles import Role

class SimpleCoder(Role):
    name: str = "Alice"
    profile: str = "SimpleCoder"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.set_actions([SimpleWriteCode])

    async def _act(self) -> Message:
        logger.info(f"{self._setting}: to do {self.rc.todo}({self.rc.todo.name})")
        todo = self.rc.todo  # todo will be SimpleWriteCode()

        msg = self.get_memories(k=1)[0]  # find the most recent messages
        code_text = await todo.run(msg.content)
        msg = Message(content=code_text, role=self.profile, cause_by=type(todo))

        return msg
```

完成！

### 运行你的角色

现在我们可以让我们的智能体开始工作，只需初始化它并使用一个起始消息运行它。

```python
import asyncio

from metagpt.context import Context

async def main():
    msg = "write a function that calculates the sum of a list"
    context = Context()
    role = SimpleCoder(context=context)
    logger.info(msg)
    result = await role.run(msg)
    logger.info(result)

asyncio.run(main)
```

## 具有多个动作的智能体

我们注意到一个智能体能够执行一个动作，但如果只有这些，实际上我们并不需要一个智能体。通过直接运行动作本身，我们可以得到相同的结果。智能体的力量，或者说`Role`抽象的惊人之处，在于动作的组合（以及其他组件，比如记忆，但我们将把它们留到后面的部分）。通过连接动作，我们可以构建一个工作流程，使智能体能够完成更复杂的任务。

假设现在我们不仅希望用自然语言编写代码，而且还希望生成的代码立即执行。一个拥有多个动作的智能体可以满足我们的需求。让我们称之为`RunnableCoder`，一个既写代码又立即运行的`Role`。我们需要两个`Action`：`SimpleWriteCode` 和 `SimpleRunCode`

### 定义动作

首先，定义 `SimpleWriteCode`。我们将重用上面创建的那个。

接下来，定义 `SimpleRunCode`。如前所述，从概念上讲，一个动作可以利用LLM，也可以在没有LLM的情况下运行。在`SimpleRunCode`的情况下，LLM不涉及其中。我们只需启动一个子进程来运行代码并获取结果。我们希望展示的是，对于动作逻辑的结构，我们没有设定任何限制，用户可以根据需要完全灵活地设计逻辑。

```python
class SimpleRunCode(Action):
    name: str = "SimpleRunCode"

    async def run(self, code_text: str):
        result = subprocess.run(["python3", "-c", code_text], capture_output=True, text=True)
        code_result = result.stdout
        logger.info(f"{code_result=}")
        return code_result
```

### 定义角色

与定义单一动作的智能体没有太大不同！让我们来映射一下：

1. 用 `self.set_actions` 初始化所有 `Action`
2. 指定每次 `Role` 会选择哪个 `Action`。我们将 `react_mode` 设置为 "by_order"，这意味着 `Role` 将按照 `self.set_actions` 中指定的顺序执行其能够执行的 `Action`（有关更多讨论，请参见 [思考和行动](agent_think_act)）。在这种情况下，当 `Role` 执行 `_act` 时，`self.rc.todo` 将首先是 `SimpleWriteCode`，然后是 `SimpleRunCode`。
3. 覆盖 `_act` 函数。`Role` 从上一轮的人类输入或动作输出中检索消息，用适当的 `Message` 内容提供当前的 `Action` (`self.rc.todo`)，最后返回由当前 `Action` 输出组成的 `Message`。

```python
class RunnableCoder(Role):
    name: str = "Alice"
    profile: str = "RunnableCoder"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.set_actions([SimpleWriteCode, SimpleRunCode])
        self._set_react_mode(react_mode="by_order")

    async def _act(self) -> Message:
        logger.info(f"{self._setting}: to do {self.rc.todo}({self.rc.todo.name})")
        # By choosing the Action by order under the hood
        # todo will be first SimpleWriteCode() then SimpleRunCode()
        todo = self.rc.todo

        msg = self.get_memories(k=1)[0]  # find the most k recent messages
        result = await todo.run(msg.content)

        msg = Message(content=result, role=self.profile, cause_by=type(todo))
        self.rc.memory.add(msg)
        return msg
```

### 运行你的角色

现在可以让你的智能体开始工作，只需初始化它并使用一个起始消息运行它。

```python
import asyncio

from metagpt.context import Context

async def main():
    msg = "write a function that calculates the sum of a list"
    context = Context()
    role = RunnableCoder(context=context)
    logger.info(msg)
    result = await role.run(msg)
    logger.info(result)

asyncio.run(main)
```

## 本节完整脚本

https://github.com/geekan/MetaGPT/blob/main/examples/build_customized_agent.py

通过以下命令运行：

```shell
python3 examples/build_customized_agent.py --msg "write a function that calculates the sum of a list"
```

或在Colab上运行

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1SF3bJiDjKw6Xwnz2Rf0j8Hc0U4KsSB2L?usp=sharing)
