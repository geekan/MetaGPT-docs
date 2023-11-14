# 多智能体 101
在[智能体101](agent_101)中，我们简要讨论了单个智能体的创建。虽然对于许多情况来说，单个智能体可能足够了，但更复杂的任务通常需要协作和团队合作。这就是多个智能体变得必要的地方。MetaGPT的核心优势也在于轻松灵活地开发一个智能体团队。在MetaGPT框架下，用户可以使用极少的代码实现智能体之间的交互。

完成本教程后，你将能够：
1. 运行软件启动示例
2. 开发你的第一个智能体团队

## 运行软件启动示例
```shell
python startup.py --idea "write a cli blackjack game"
```

## 开发你的第一个智能体团队
希望你能找到软件启动示例很有启发。也许现在你已经受到启发，想要开发一个适应你独特需求的智能体团队。在这一部分，我们将使用一个有趣的例子来说明开发过程。

想象一下，如果我们模拟代表拜登和特朗普的智能体共同工作。这是一个有趣的实验，不是吗？鉴于他们众所周知的分歧，这样的组合可能导致一些生动的交流。这是一个理想的例子，展示了如何设计多个智能体并促使它们之间进行交互。我们将称我们的实验为“拜登-特朗普辩论”。

总体上，我们需要两个步骤来设置他们之间的辩论：
1. 定义一个能够进行言论动作的 Debator 角色，我们建议参考[智能体101](agent_101)
2. 处理 Debator 之间的通信，即让拜登听特朗普说话，特朗普听拜登说话
3. 初始化两个 Debator 实例，拜登和特朗普，创建一个放置它们的环境的团队，并使它们能够相互交互

完整的代码在本节末尾可用

### 定义动作
首先，我们需要定义我们的 `Action`。这是一个辩论场景，所以让我们将其命名为 `SpeakAloud`
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

        rsp = await self._ask(prompt)

        return rsp
```
### 定义角色
我们将定义一个通用的 `Role`，称为 `Debator`。

在这里，`_init_actions` 使我们的 `Role` 拥有我们刚刚定义的 `SpeakAloud` 动作。我们还使用 `_watch` 监视了 `SpeakAloud` 和 `BossRequirement`，因为我们希望每个辩手关注来自对手的 `SpeakAloud` 消息，以及来自用户的 `BossRequirement`（人类指令）。
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
        self._init_actions([SpeakAloud])
        self._watch([BossRequirement, SpeakAloud])
        self.name = name
        self.opponent_name = opponent_name
```
接下来，我们使每个辩手听取对手的论点。这通过重写 `_observe` 函数完成。这是一个重要的点，因为在环境中将会有来自特朗普和拜登的 "SpeakAloud 消息"（由 `SpeakAloud` 触发的 `Message`）。
我们不希望特朗普处理自己上一轮的 "SpeakAloud 消息"，而是处理来自拜登的消息，反之亦然。（在即将到来的更新中，我们将使用一般的消息路由机制来处理这个过程。在更新后，你将不再需要执行此步骤）
```python
async def _observe(self) -> int:
        await super()._observe()
        # accept messages sent (from opponent) to self, disregard own messages from the last round
        self._rc.news = [msg for msg in self._rc.news if msg.send_to == self.name]
        return len(self._rc.news)
```
最后，我们使每个辩手能够向对手发送反驳的论点。在这里，我们从消息历史中构建一个上下文，使 `Debator` 运行他拥有的 `SpeakAloud` 动作，并使用反驳论点内容创建一个新的 `Message`。请注意，我们定义每个 `Debator` 将把 `Message` 发送给他的对手。
```python
async def _act(self) -> Message:
    logger.info(f"{self._setting}: ready to {self._rc.todo}")
    todo = self._rc.todo # 一个 SpeakAloud 的实例

    memories = self.get_memories()
    context = "\n".join(f"{msg.sent_from}: {msg.content}" for msg in memories)

    rsp = await todo.run(context=context, name=self.name, opponent_name=self.opponent_name)

    msg = Message(
        content=rsp,
        role=self.profile,
        cause_by=type(todo),
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
        self._init_actions([SpeakAloud])
        self._watch([BossRequirement, SpeakAloud])
        self.name = name
        self.opponent_name = opponent_name

    async def _observe(self) -> int:
        await super()._observe()
        # accept messages sent (from opponent) to self, disregard own messages from the last round
        self._rc.news = [msg for msg in self._rc.news if msg.send_to == self.name]
        return len(self._rc.news)

    async def _act(self) -> Message:
        logger.info(f"{self._setting}: ready to {self._rc.todo}")
        todo = self._rc.todo # 一个 SpeakAloud 的实例

        memories = self.get_memories()
        context = "\n".join(f"{msg.sent_from}: {msg.content}" for msg in memories)

        rsp = await todo.run(context=context, name=self.name, opponent_name=self.opponent_name)

        msg = Message(
            content=rsp,
            role=self.profile,
            cause_by=type(todo),
            sent_from=self.name,
            send_to=self.opponent_name,
        )

        return msg
```
### 创建团队并添加角色
现在我们已经定义了我们的 `Debator`，让我们将它们组合起来看看会发生什么。我们建立一个 `Team` 并“雇佣”了拜登和特朗普。在这个例子中，我们将通过将我们的指令（作为 `BossRequirement`）发送给拜登，让他先开始。如果你想让特朗普先说话，将 `send_to` 设置为 "Trump"。

运行这个 `Team`，我们应该看到他们之间友好的对话！
```python
async def debate(idea: str, investment: float = 3.0, n_round: int = 5):
    """运行拜登-特朗普辩论，观看他们之间的友好对话 :) """
    Biden = Debator(name="Biden", profile="Democrat", opponent_name="Trump")
    Trump = Debator(name="Trump", profile="Republican", opponent_name="Biden")
    team = Team()
    team.hire([Biden, Trump])
    team.invest(investment)
    team.start_project(idea, send_to="Biden")  # 将辩论主题发送给拜登，让他先说话
    await team.run(n_round=n_round)

def main(idea: str, investment: float = 3.0, n_round: int = 10):
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
    fire.Fire(main)
```
### 本节的完整脚本

https://github.com/geekan/MetaGPT/blob/main/examples/debate.py

运行以下命令：
```sh
python examples/debate.py --idea "Talk about how the U.S. should respond to climate change"
```
运行结果如下：

![img](/public/image/guide/tutorials/debate_log.png)