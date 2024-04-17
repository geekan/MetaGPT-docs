# Agent Communication

The exchange of messages between agents is facilitated through attributes provided in the `Message` class and the `publish_message` capability provided by the `Environment`.

- When an agent acts as a message sender, it only needs to provide the source information of the message. The source of the message corresponds to the `sent_from` and `cause_by` attributes of the `Message`.
- When an agent acts as a message consumer, it needs to subscribe to the corresponding messages. The subscription labels for messages correspond to the `cause_by` attribute of the `Message`.
- The `Environment` object is responsible for broadcasting messages to the various agents according to their subscription requirements.

```python
class Message(BaseModel):
    id: str = Field(default="", validate_default=True)  # According to Section 2.2.3.1.1 of RFC 135
    content: str
    instruct_content: Optional[BaseModel] = Field(default=None, validate_default=True)
    role: str = "user"  # system / user / assistant
    cause_by: str = Field(default="", validate_default=True)
    sent_from: str = Field(default="", validate_default=True)
    send_to: set[str] = Field(default={MESSAGE_ROUTE_TO_ALL}, validate_default=True)
```

When planning the message forwarding process between agents, it's essential to first determine the functional boundaries of the agents, similar to designing a function:

1.  What inputs does the agent take? The inputs of the agent determine the value of the `rc.watch` attribute of the agent object.
2.  What outputs does the agent produce? The outputs of the agent determine the parameters of the `Message` output by the agent.
3.  What tasks does the agent need to accomplish? The tasks the agent needs to accomplish determine how many actions the agent has and how the actions transition between states.

Let's illustrate the entire implementation process with a complex interaction example. Suppose we want to implement the following process:

```text
Agent A takes requirements, splits into 10 subtasks.
Agent B is assigned to do 10 sub tasks.
Agent C is assigned to compile 10 subtasks.
Agent D reviews the compilation, provides feedback to Agent B.

Steps 2-4 need to happen 3-4 times. How do I architect my system such that this happens the right way? I can do the dirty code to tape it together but wanted to know the right way.
```

Analyzing this scenario, we can conclude:

1. Agent A is responsible for splitting the requirements into 10 subtasks.
2. For each subtask, Agents B, C, and D process as follows:
   ```
   Message(subtask) -> AgentB.run -> AgentC.run -> AgentD.run -> AgentB.run -> AgentC.run -> AgentD.run -> ...
   ```
   Meaning:
   1. Agent B's input is either a subtask from Agent A or the result of Agent D's execution.
   2. Agent C's input is the output of Agent B.
   3. Agent D's input is the output of Agent C.

Therefore, the actions of Agent A need to split the user requirements into 10 subtasks and send them to Agent B:

1. Step 1: Enable Agent A to receive requirements sent by the user:

```python
class AgentA(Role):
    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
        # Initialize actions specific to the Architect role
        self.set_actions([AgentAAction]) # Since the agent has only one action, there's no need to modify the `Role._think` function.

        # Subscribe to messages
        self._watch({UserRequirement}) # `UserRequirement` is the default value for the `cause_by` attribute in `Message`.
```

2. Step 2: In `AgentAAction`, split the user requirements into 10 subtasks:

```python
class AgentAAction(Aciton):
    async def run(self, with_messages:List[Message]=None, **kwargs) -> List[str]:
        subtasks: List[str] = split_10_subtask(with_messages[0].content)
        return subtasks
```

3. Step 3: In `_act` method of Agent A, run `AgentAAction` and then send the results to Agent B:

```python
class AgentA(Role):
    async def _act(self) -> Message:
        subtasks = await self.rc.todo.run(self.rc.history)
        for i in subtasks:
           self.rc.env.publish_message(Message(content=i, cause_by=AgentAAction)) # Send 10 messages of this type; Agent B subscribes to this type of message
        return Message(content="dummy message", send_to=MESSAGE_ROUTE_TO_NONE) # Since the messages have been sent, returning an empty message is sufficient.
```

The message sending and receiving logic for Agent B, Agent C, and Agent D is similar:

1. Agent B subscribes to messages with `cause_by` attributes being `AgentAAction` and `AgentDAction`.
2. Agent C subscribes to messages with `cause_by` attribute being `AgentBAction`.
3. Agent D subscribes to messages with `cause_by` attribute being `AgentCAction`.

```python
class AgentBAction(Action):
        async def run(self, with_messages:List[Message]=None, **kwargs) -> Message:
            ... # Fill the results into the `Message`.

class AgentB(Role):
    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
        # Initialize actions specific to the Architect role
        self.set_actions([AgentBAction]) # Since the agent only has one type of action, there is no need to modify the `Role._think` function.

        # Subscribe to messages
        self._watch({AgentAAction, AgentDAction})
```

```python
class AgentCAction(Action):
        async def run(self, with_messages:List[Message]=None, **kwargs) -> Message:
            ... # Fill the results into the `Message`.

class AgentC(Role):
    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
        # Initialize actions specific to the Architect role
        self.set_actions([AgentCAction]) # Since the agent only has one type of action, there is no need to modify the `Role._think` function.

        # Subscribe to messages
        self._watch({AgentBAction})
```

```python
class AgentDAction(Action):
        async def run(self, with_messages:List[Message]=None, **kwargs) -> Message:
            ... # Fill the results into the `Message`.

class AgentD(Role):
    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
        # Initialize actions specific to the Architect role
        self.set_actions([AgentDAction]) # Since the agent only has one type of action, there is no need to modify the `Role._think` function.

        # Subscribe to messages
        self._watch({AgentCAction})
```

Now that all agents are defined, they can be placed in the same `Environment` object, and the user message can be sent to Agent A to initiate the workflow:

```python
    context = Context() # Load config2.yaml
    env = Environment(context=context)
    env.add_roles([AgentA(), AgentB(), AgentC(), AgentD()])
    env.publish_message(Message(content='New user requirements', send_to=AgentA)) # Send the user's message to Agent A to start the process.
    while not env.is_idle: # `env.is_idle` becomes True only when all agents have no new messages to process.
        await env.run()
```
