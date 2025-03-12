# MGX Environment

[Code Entry](https://github.com/geekan/MetaGPT/tree/main/metagpt/environment/mgx/mgx_env.py)

MGXEnv is a generic multi-agent collaboration environment that provides a flexible and powerful interaction framework. During initialization, the environment supports configuring multiple agents with different roles, each equipped with a specific prompt system to guide their behavior and responsibilities. The core feature of the environment is its unique message management mechanism: TeamLeader acts as a central coordinator, uniformly managing the flow and distribution of all messages. This design ensures both the orderliness of information transmission and supports flexible interaction methods, including public dialogue and private communication. Through this architectural design, MGXEnv can effectively support complex multi-agent collaboration scenarios, enabling different roles to efficiently complete division of labor and cooperation according to their respective professional fields and task requirements.

## Space Definition

### Message Space

MGXEnv mainly handles message routing and publishing in a multi-agent environment. The core message space is defined by the Message class with the following structure:

Definition:
```python
from gymnasium import spaces

space = {
    "role": spaces.Text(16),         # Message role type 
    "content": spaces.Text(1024),    # Actual message content
    "sent_from": spaces.Text(32),    # Sender name
    "send_to": spaces.Set(spaces.Text(32)),  # Set of recipient names
    "metadata": spaces.Dict(),       # Additional metadata like images
}
```

Message Space Components:

| Field | Description | Value Range |
|-------|-------------|-------------|
| role | Message role type | One of ["user", "assistant", "system"] |
| content | Actual message content | Maximum length 1024 characters |
| sent_from | Message sender name | Maximum length 32 characters |
| send_to | Set of recipient names | Each name maximum 32 characters |
| metadata | Additional message metadata | Dictionary containing optional fields (like images) |

Message Example:
```python
from metagpt.schema import Message

Message(
    role="assistant",
    content="Analysis completed.", 
    sent_from="Alice",
    send_to={"Mike", "<all>"},
    metadata={"agent": "Emma"}
)
```

### Communication Modes

The environment supports two communication modes:

1. Public Chat Mode (default)
- All messages visible to all roles (send_to includes <all>)
- Message flow coordinated by team leader (Mike)
- Messages stored in environment history

2. Direct Chat Mode 
- Triggered when user directly messages a specific role
- Communication only between user and target role
- Bypasses team leader
- Message publishing to all depends on is_public_chat flag

This environment focuses on message routing and coordination rather than traditional state/action spaces seen in other environments.

## Usage

```python
from metagpt.environment.mgx.mgx_env import MGXEnv
from metagpt.roles.di.team_leader import TeamLeader
from metagpt.schema import Message
from metagpt.roles import (
    Architect,
    Engineer,
    ProductManager,
    ProjectManager,
    QaEngineer,
)

env = MGXEnv()

env.add_roles(
        [
            TeamLeader(),
            ProductManager(),
            Architect(),
            ProjectManager(),
            Engineer(n_borg=5, use_code_review=True),
            QaEngineer(),
        ]
    )
requirement = "create a 2048 game"
tl = env.get_role("Mike")
env.publish_message(Message(content=requirement, send_to=tl.name))
await tl.run()
```