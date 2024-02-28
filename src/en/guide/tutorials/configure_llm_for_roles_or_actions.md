# Configure LLM for roles or actions

MetaGPT allows you to use different LLMs for different Roles and Actions within your team. This greatly enhances the flexibility and realism of team interactions, enabling each Role to choose the most suitable LLM based on its specific needs, background, and the characteristics of each Action. This fine-grained control over the quality and direction of conversations creates a more immersive and authentic interactive experience. Before getting started, make sure you have read [Configuration](../get_started/configuration.md) and [Debate](../use_cases/multi_agent/debate.md).

Here are the setup steps:

1. Define Configurations: Use default configurations or load custom configurations from the `~/.metagpt` directory.

2. Assign Configurations: Allocate specific LLM configurations to Roles and Actions. The priority of configurations is as follows: Action config > Role config > Global config (config in config2.yaml).

3. Team Interaction: Create a team with an environment and start the interaction.

## Example

Consider a live broadcast environment for the U.S. election. We will create three Roles: A, B, and C. A and B are two candidates, and C is a voter.

### Define Configurations

You can use default configurations or customize LLM configurations in the `~/.metagpt` directory.

```python
from metagpt.config2 import Config

# Example configurations for gpt-4-1106-preview, gpt-4-0613 and gpt-3.5-turbo-1106
gpt4t = Config.from_home("gpt-4-1106-preview.yaml")  # Load custom configuration from `~/.metagpt` directory `gpt-4-1106-preview.yaml`
gpt4 = Config.default()  # Use default configuration from `config2.yaml` file (model: "gpt-4-0613")
gpt35 = Config.default()
gpt35.llm.model = "gpt-3.5-turbo-1106"  # Modify model to "gpt-3.5-turbo-1106"
```

### Assign Configurations

Create Roles and Actions and assign configurations. Please note that the priority of all configurations is: Action config > Role config > Global config. The configuration of different roles and actions is as follows.

| Action of interest | Global config | Role config | Action config | Effective config for the Action |
| ------------------ | ------------- | ----------- | ------------- | ------------------------------- |
| a1                 | gpt4          | gpt4        | gpt4t         | gpt4t                           |
| a2                 | gpt4          | gpt4        | unspecified   | gpt4                            |
| a3                 | gpt4          | gpt35       | unspecified   | gpt35                           |

```python
from metagpt.roles import Role
from metagpt.actions import Action

# Create three Actions: a1, a2, and a3. Assign the configuration of gpt4t to a1.
a1 = Action(config=gpt4t, name="Say", instruction="Say your opinion with emotion and don't repeat it")
a2 = Action(name="Say", instruction="Say your opinion with emotion and don't repeat it")
a3 = Action(name="Vote", instruction="Vote for the candidate, and say why you vote for him/her")

# Create three Roles: A, B, and C. Assign configurations of gpt4, gpt4, and gpt35 to A, B, and C respectively.
# A's gpt4 configuration won't work for a1 as a1 has configured gpt4t in Action config.
A = Role(name="A", profile="Democratic candidate", goal="Win the election", actions=[a1], watch=[a2], config=gpt4)
# B's gpt4 configuration will work for a2 as a2 has no Action config set.
B = Role(name="B", profile="Republican candidate", goal="Win the election", actions=[a2], watch=[a1], config=gpt4)
# C's gpt35 configuration will work for a3 as a3 has no Action config set.
C = Role(name="C", profile="Voter", goal="Vote for the candidate", actions=[a3], watch=[a1, a2], config=gpt35)
```

### Team Interaction

Create a team with an environment and let them interact.

```python
import asyncio
from metagpt.environment import Environment
from metagpt.team import Team

# Create an environment described as "US election live broadcast"
env = Environment(desc="US election live broadcast")
team = Team(investment=10.0, env=env, roles=[A, B, C])
# Run the team, and you should observe collaboration between them
asyncio.run(team.run(idea="Topic: climate change. Under 80 words per message.", send_to="A", n_round=3))
# await team.run(idea="Topic: climate change. Under 80 words per message.", send_to="A", n_round=3) # If running in Jupyter Notebook, use this line of code
```
