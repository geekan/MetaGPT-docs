# Agent 101

After this tutorial, you will be able to:

1. Use off-the-shelf agents
2. Develop your first agent capable of one or more actions

## Use off-the-shelf agents

Import any role, initialize it, run it with a starting message, done!

```python
import asyncio

from metagpt.context import Context
from metagpt.roles.product_manager import ProductManager
from metagpt.logs import logger

async def main():
    msg = "Write a PRD for a snake game"
    context = Context()  # The session Context object is explicitly created, and the Role object implicitly shares it automatically with its own Action object
    role = ProductManager(context=context)
    while msg:
        msg = await role.run(msg)
        logger.info(str(msg))

if __name__ == '__main__':
    asyncio.run(main())
```

## Develop your first agent

Consider agent from a practical usage viewpoint, what are the bare essentials for an agent to be of any utility to us? From MetaGPT's standpoint, if an agent can execute certain actions (whether powered by LLM or otherwise), it holds some degree of usefulness. Put it simply, we define what actions our agent is expected to possess, equip the agent with these capabilities, and we have a basic useful agent! MetaGPT provides high flexibility to define your own action and your own agent. We will walk you through this in the rest of this section.

### Flowchart of one agent run cycle

![flowchart](/image/guide/tutorials/agent_run_flowchart.png)

## Agent with a single action

Suppose we want to write codes in natural language and want an agent to do this for us. Let's call this agent SimpleCoder and we need two steps to put it to work:

1. Define a write code action
2. Equip the agent with the action

### Define Actions

In MetaGPT, class `Action` is the logical abstraction for an action. Users may use LLM to empower this Action by simply invoking the self.\_aask function, which will make LLM api call under the hood.

In our scenario, we define a `SimpleWriteCode` subclassed `Action`. Although it primarily acts as a wrapper around a prompt and the LLM call, we believe that this `Action` abstraction is more intuitive. In downstream and higher-level tasks, using it as a whole feels more natural than crafting a prompt and invoking the LLM separately, especially when viewed within the framework of an agent.

````python
import re
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

### Define Role

In MetaGPT, class `Role` is the logical abstraction for an agent. A `Role` can perform certain `Action`, possess memory, think and act in various strategies. Essentially, it acts as a cohesive entity that binds all these components together. For now, let's just focus on an action-performing agent, and see how we can define a simplest `Role`.

In the example, we create a `SimpleCoder` who can write code based on a human's natural language description. The steps are:

1. We give it a name and profile
2. We equip it with the expected action `SimpleWriteCode` with the `self._init_action` function
3. We overwrite the `_act` function, which is where the agent's specific acting logic goes in. We write that our agent will retrieve human instruction from latest memory, run equipped action, which MetaGPT makes it as the todo (`self.rc.todo`) under the hood, and finally return a complete message

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

Done!

### Run your Role

Now we can put our agent to work, just initialize it and run it with a starting message

```python
import asyncio

from metagpt.context import Context

async def main():
    msg = "write a function that calculates the product of a list"
    context = Context()
    role = SimpleCoder(context=context)
    logger.info(msg)
    result = await role.run(msg)
    logger.info(result)

asyncio.run(main())
```

## Agent with multiple actions

We saw that an agent is able to perform an action, but if that's all, we don't actually need an agent. By running the action itself, we can get the same result. The power of agent, or the amazing thing of a `Role` abstraction, lies in the combination of actions (and other components like memory, but we will leave them for future sections). By connecting actions we may formulate a workflow, which enables the agent to complete more complicated task.

Suppose now we want not only write code in natural language, but also want the generated code to be executed immediately. An agent with multiple actions can fulfill our needs. Let's call it `RunnableCoder`, a `Role` who writes codes and runs them on the spot. We need two `Action`: `SimpleWriteCode` and `SimpleRunCode`

### Define Actions

First, define `SimpleWriteCode`. We will reuse the one created above.

Next, define `SimpleRunCode`. As previously mentioned, conceptually, an action can leverage LLM or operate without it. In the case of `SimpleRunCode`, LLM is not involved. We simply initiate a subprocess to run the code and fetch the result. We want to demonstrate that we place no limitation on how an action logic should be structured, users have the full flexibility to design the logic based on their need.

```python
class SimpleRunCode(Action):
    name: str = "SimpleRunCode"

    async def run(self, code_text: str):
        result = subprocess.run(["python3", "-c", code_text], capture_output=True, text=True)
        code_result = result.stdout
        logger.info(f"{code_result=}")
        return code_result
```

### Define Role

Not that different from defining a single-action agent! Let's map it out:

1. Initiate all `Action` with `self.set_actions`
2. Specify how `Role` will choose `Action` each time. We set `react_mode` to be "by_order", which means the `Role` will take its capable `Action`s in order specified in `self.set_actions` (more discussion in [Think and act](agent_think_act)). In this case, when the `Role` `_act`s, `self.rc.todo` will be `SimpleWriteCode` first and `SimpleRunCode` next.
3. Overwrite the `_act` function. The `Role` retrieves messages from human input or action outputs from the last round, feeds the current `Action` (`self.rc.todo`) with the appropriate `Message` content, and finally returns a `Message` composed of the current `Action` output.

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

### Run your Role

Now you can put your agent to work, just initialize it and run it with a starting message

```python
import asyncio

from metagpt.context import Context

async def main():
    msg = "write a function that calculates the product of a list"
    context = Context()
    role = RunnableCoder(context=context)
    logger.info(msg)
    result = await role.run(msg)
    logger.info(result)

asyncio.run(main)
```

## Complete script of this tutorial

https://github.com/geekan/MetaGPT/blob/main/examples/build_customized_agent.py

Run it with

```shell
python3 examples/build_customized_agent.py --msg "write a function that calculates the product of a list"
```

Or try it on Colab

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1SF3bJiDjKw6Xwnz2Rf0j8Hc0U4KsSB2L?usp=sharing)
