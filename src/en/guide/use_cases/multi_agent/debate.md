# Debate: Agent Confrontation

In this use case, we will illustrate the development process of a playful example.

Imagine, just for a moment, if we were to simulate agents representing Biden and Trump working together. It's a fun experiment, isn't it? Given their known disagreements, such a combination could lead to some lively exchanges. This serves as an ideal example to showcase how to design multiple agents and facilitate interactions between them. We will deb our experiment the "Biden-Trump Debate".

In general, we need two steps to set up a debate between them:

1. Define a role Debator capable of a speaking action, which we suggest taking reference from Agent101
2. Take care of the communication between Debator, that is, have Biden listen to Trump and Trump to Biden
3. Initialize two Debator instances, Biden and Trump, create a team with an environment to put them in, and enable them to interact with each other

Complete code is available at the end of this section

### Define Action

First, we need to define our `Action`. It's a debate setting, so let's name it as `SpeakAloud`

```python
class SpeakAloud(Action):
    """Action: Speak out aloud in a debate (quarrel)"""

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

### Define Role

We will define a common `Role` called `Debator`.

Here `set_actions` make our `Role` possess the `SpeakAloud` action we just define. We also `_watch` both `SpeakAloud` and `UserRequirement`, because we want each debator to pay attention to messages of `SpeakAloud` from his opponent, as well as `UserRequirement` (human instruction) from users.

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

Next, we make each debator listen to his opponent's argument. This is done by overwriting the `_observe` function. This is an important point because there will be "SpeakAloud messages" (`Message` triggered by `SpeakAloud`) from both Trump and Biden in the environment. We don't want Trump to process his own "SpeakAloud message" from the last round, but instead those from Biden, and vice versa. (We will take care of this process with a general message routing mechanism in updates shortly to come. You won't need this step after the updates)

```python
async def _observe(self) -> int:
        await super()._observe()
        # accept messages sent (from opponent) to self, disregard own messages from the last round
        self.rc.news = [msg for msg in self.rc.news if msg.send_to == self.name]
        return len(self.rc.news)
```

Finally, we enable each debator to send counter arguments back to his opponent. Here we construct a context from message history, make the `Debator` run his possessed `SpeakAloud` action, and craft a new `Message` with the counter argument content. Notice we define that each `Debator` will send the `Message` to his opponent.

```python
async def _act(self) -> Message:
    logger.info(f"{self._setting}: ready to {self.rc.todo}")
    todo = self.rc.todo # An instance of SpeakAloud

    memories = self.get_memories()
    context = "\n".join(f"{msg.sent_from}: {msg.content}" for msg in memories)
    # print(context)

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

<b>Complete code of the Debator</b>

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
        todo = self.rc.todo # An instance of SpeakAloud

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

        self.rc.memory.add(msg)

        return msg
```

### Create a team and add roles

Now that we have defined our `Debator`s, let's put them together to see what will come up. We set up a `Team` and "hire" Biden and Trump. In this example, we will send our instruction (as a `UserRequirement` under the hood) to Biden to have him start first. If you want Trump to speak first, set send_to as "Trump".

Run the `Team`, we should see the friendly conversation between them!

```python
async def debate(idea: str, investment: float = 3.0, n_round: int = 5):
    """Run a team of presidents and watch they quarrel. :) """
    Biden = Debator(name="Biden", profile="Democrat", opponent_name="Trump")
    Trump = Debator(name="Trump", profile="Republican", opponent_name="Biden")
    team = Team()
    team.hire([Biden, Trump])
    team.invest(investment)
    team.run_project(idea, send_to="Biden") # send debate topic to Biden and let him speak first
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

## Complete script of this section

https://github.com/geekan/MetaGPT/blob/main/examples/debate.py

Run it with

```sh
python3 examples/debate.py --idea "Talk about how the U.S. should respond to climate change"
```

A sample run

![img](/image/guide/use_cases/debate_log.png)
