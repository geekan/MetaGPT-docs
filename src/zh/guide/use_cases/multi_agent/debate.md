# 辩论：智能体对抗

在这个用例中，我们将阐述一个富有趣味的例子的开发过程。

想象一下，如果我们模拟代表拜登和特朗普的智能体共同合作会怎样。这是一个有趣的实验，不是吗？考虑到他们已知的分歧，这样的组合可能导致一些生动的交流。这是一个展示如何设计多个智能体并促进它们之间的互动的理想例子。我们将称呼这个实验为“拜登-特朗普辩论”。

总体上，我们需要3个步骤来设定它们的辩论：

1. 定义一个具有发言行为的辩手角色，我们建议参考[智能体入门](/zh/guide/tutorials/agent_101)
2. 处理辩手之间的通信，也就是让拜登听特朗普说话，反之亦然
3. 初始化两个辩手实例，拜登和特朗普，创建一个带有环境的团队，并使它们能够相互交互

完整的代码可在本节末尾找到。

### 定义动作

首先，我们需要定义一个`Action`。这是一个辩论场景，所以让我们将其命名为 `SpeakAloud`

```python
class SpeakAloud(Action):
    """动作：在辩论中大声说话（争吵）"""

    PROMPT_TEMPLATE = """
    ## BACKGROUND
    Suppose you are {name}, you are in a debate with {opponent_name}.
    ## DEBATE HISTORY
    Previous rounds:
    {context}
    ## YOUR TURN
    Now it's your turn, you should closely respond to your opponent's latest argument, state your position, defend your arguments, and attack your opponent's arguments,
    craft a strong and emotional response in 80 words, in {name}'s rhetoric and viewpoints, your will argue:
    """

    def __init__(self, name="SpeakAloud", context=None, llm=None):
        super().__init__(name, context, llm)

    async def run(self, context: str, name: str, opponent_name: str):

        prompt = self.PROMPT_TEMPLATE.format(context=context, name=name, opponent_name=opponent_name)

        rsp = await self._aask(prompt)

        return rsp
```

### 定义角色

我们将定义一个通用的 `Role`，称为 `Debator`。

在这里，`set_actions` 使我们的 `Role` 拥有我们刚刚定义的 `SpeakAloud` 动作。我们还使用 `_watch` 监视了 `SpeakAloud` 和 `UserRequirement`，因为我们希望每个辩手关注来自对手的 `SpeakAloud` 消息，以及来自用户的 `UserRequirement`（人类指令）。

```python
class Debator(Role):
    def __init__(
        self,
        name: str,
        profile: str,
        opponent_name: str,
        **kwargs,
    ):
        super().__init__(name, profile, **kwargs)
        self.set_actions([SpeakAloud])
        self._watch([UserRequirement, SpeakAloud])
        self.name = name
        self.opponent_name = opponent_name
```

接下来，我们使每个辩手听取对手的论点。这通过重写 `_observe` 函数完成。这是一个重要的点，因为在环境中将会有来自特朗普和拜登的 "SpeakAloud 消息"（由 `SpeakAloud` 触发的 `Message`）。
我们不希望特朗普处理自己上一轮的 "SpeakAloud 消息"，而是处理来自拜登的消息，反之亦然。（在即将到来的更新中，我们将使用一般的消息路由机制来处理这个过程。在更新后，你将不再需要执行此步骤）

```python
async def _observe(self) -> int:
        await super()._observe()
        # accept messages sent (from opponent) to self, disregard own messages from the last round
        self.rc.news = [msg for msg in self.rc.news if msg.send_to == self.name]
        return len(self.rc.news)
```

最后，我们使每个辩手能够向对手发送反驳的论点。在这里，我们从消息历史中构建一个上下文，使 `Debator` 运行他拥有的 `SpeakAloud` 动作，并使用反驳论点内容创建一个新的 `Message`。请注意，我们定义每个 `Debator` 将把 `Message` 发送给他的对手。

```python
async def _act(self) -> Message:
    logger.info(f"{self._setting}: ready to {self.rc.todo}")
    todo = self.rc.todo # 一个 SpeakAloud 的实例

    memories = self.get_memories()
    context = "\n".join(f"{msg.sent_from}: {msg.content}" for msg in memories)

    rsp = await todo.run(context=context, name=self.name, opponent_name=self.opponent_name)

    msg = Message(
        content=rsp,
        role=self.profile,
        cause_by=todo,
        sent_from=self.name,
        send_to=self.opponent_name,
    )

    return msg
```

<b>完整的 Debator 代码</b>

```python
class Debator(Role):
    def __init__(
        self,
        name: str,
        profile: str,
        opponent_name: str,
        **kwargs,
    ):
        super().__init__(name, profile, **kwargs)
        self.set_actions([SpeakAloud])
        self._watch([UserRequirement, SpeakAloud])
        self.name = name
        self.opponent_name = opponent_name

    async def _observe(self) -> int:
        await super()._observe()
        # accept messages sent (from opponent) to self, disregard own messages from the last round
        self.rc.news = [msg for msg in self.rc.news if msg.send_to == self.name]
        return len(self.rc.news)

    async def _act(self) -> Message:
        logger.info(f"{self._setting}: ready to {self.rc.todo}")
        todo = self.rc.todo # 一个 SpeakAloud 的实例

        memories = self.get_memories()
        context = "\n".join(f"{msg.sent_from}: {msg.content}" for msg in memories)

        rsp = await todo.run(context=context, name=self.name, opponent_name=self.opponent_name)

        msg = Message(
            content=rsp,
            role=self.profile,
            cause_by=todo,
            sent_from=self.name,
            send_to=self.opponent_name,
        )

        return msg
```

### 创建团队并添加角色

现在我们已经定义了我们的 `Debator`，让我们将它们组合起来看看会发生什么。我们建立一个 `Team` 并“雇佣”了拜登和特朗普。在这个例子中，我们将通过将我们的指令（作为 `UserRequirement`）发送给拜登，让他先开始。如果你想让特朗普先说话，将 `send_to` 设置为 "Trump"。

运行这个 `Team`，我们应该看到他们之间友好的对话！

```python
async def debate(idea: str, investment: float = 3.0, n_round: int = 5):
    """运行拜登-特朗普辩论，观看他们之间的友好对话 :) """
    Biden = Debator(name="Biden", profile="Democrat", opponent_name="Trump")
    Trump = Debator(name="Trump", profile="Republican", opponent_name="Biden")
    team = Team()
    team.hire([Biden, Trump])
    team.invest(investment)
    team.run_project(idea, send_to="Biden")  # 将辩论主题发送给拜登，让他先说话
    await team.run(n_round=n_round)


import asyncio
import platform
import typer
from metagpt.team import Team
app = typer.Typer()

@app.command()
def main(
    idea: str = typer.Argument(..., help="Economic Policy: Discuss strategies and plans related to taxation, employment, fiscal budgeting, and economic growth."),
    investment: float = typer.Option(default=3.0, help="Dollar amount to invest in the AI company."),
    n_round: int = typer.Option(default=5, help="Number of rounds for the simulation."),
):
    """
    :param idea: Debate topic, such as "Topic: The U.S. should commit more in climate change fighting"
                 or "Trump: Climate change is a hoax"
    :param investment: contribute a certain dollar amount to watch the debate
    :param n_round: maximum rounds of the debate
    :return:
    """
    if platform.system() == "Windows":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(debate(idea, investment, n_round))

if __name__ == '__main__':
    app()
```

### 本节的完整脚本

https://github.com/geekan/MetaGPT/blob/main/examples/debate.py

运行以下命令：

```sh
python3 examples/debate.py --idea "Talk about how the U.S. should respond to climate change"
```

运行结果如下：

![img](/image/guide/use_cases/debate_log.png)
