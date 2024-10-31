# Customize LLMs for roles or actions

MetaGPT allows you to use different LLMs for different Roles and Actions within your team. This greatly enhances the flexibility and realism of team interactions, enabling each Role to choose the most suitable LLM based on its specific needs, background, and the characteristics of each Action. This fine-grained control over the quality and direction of conversations creates a more immersive and authentic interactive experience. Before getting started the tutorial, make sure you have read [Configuration](../get_started/configuration.md) and [Debate](../use_cases/multi_agent/debate.md).

Here are the setup steps:

1. Define Configurations: Use default configurations or customize configurations from the `~/.metagpt` directory.

2. Assign Configurations: Allocate specific LLM configurations to Roles and Actions. The priority of configurations is as follows: Action config > Role config > Global config (config in config2.yaml).

3. Team Interaction: Create a team with an environment and start the interaction.

## Example

Consider a live broadcast environment for the U.S. election. We will create three Roles: A, B, and C. A and B are two candidates, and C is a voter.

### Define Configurations

You can use default configurations or customize LLM configurations in the `~/.metagpt` directory.

```python
from metagpt.config2 import Config

# Example configurations for gpt-4, gpt-4-turbo and gpt-3.5-turbo
gpt4 = Config.from_home("gpt-4.yaml")  # Load custom configuration from `~/.metagpt` directory `gpt-4.yaml`
gpt4t = Config.default()  # Use default configuration from `config2.yaml` file (model: "gpt-4-turbo")
gpt35 = Config.default()
gpt35.llm.model = "gpt-3.5-turbo"  # Modify model to "gpt-3.5-turbo"
```

### Assign Configurations

Create Roles and Actions, then assign configurations.

```python
from metagpt.roles import Role
from metagpt.actions import Action

# Create three Actions: a1, a2, and a3. Assign the configuration of gpt4t to a1.
a1 = Action(config=gpt4t, name="Say", instruction="Say your opinion with emotion and don't repeat it")
a2 = Action(name="Say", instruction="Say your opinion with emotion and don't repeat it")
a3 = Action(name="Vote", instruction="Vote for the candidate, and say why you vote for him/her")

# Create three Roles: A, B, and C. Representing "Democratic candidate," "Republican candidate," and "Voter" respectively.
# Although A is configured with gpt4 in Role config, it will use the configuration with model gpt4 for a1 due to the Action config setting.
A = Role(name="A", profile="Democratic candidate", goal="Win the election", actions=[a1], watch=[a2], config=gpt4)
# Since B is configured with gpt35 in Role config, and a2 has no Action config, both B and a2 will use Role config, i.e., the configuration with model gpt35.
B = Role(name="B", profile="Republican candidate", goal="Win the election", actions=[a2], watch=[a1], config=gpt35)
# Since C has no config set, and a3 also has no config set, both C and a3 will use the Global config, i.e., the configuration with model gpt4.
C = Role(name="C", profile="Voter", goal="Vote for the candidate", actions=[a3], watch=[a1, a2])
```

Please note that for the Action of interest, the priority of configuration is: Action config > Role config > Global config. The configuration of different roles and actions is as follows:

| Action of interest | Global config | Role config | Action config | Effective config for the Action |
| ------------------ | ------------- | ----------- | ------------- | ------------------------------- |
| a1                 | gpt4          | gpt4        | gpt4t         | gpt4t                           |
| a2                 | gpt4          | gpt35       | unspecified   | gpt35                           |
| a3                 | gpt4          | unspecified | unspecified   | gpt4                            |

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

### Complete code and corresponding configuration examples

Default configuration： `~/.metagpt/config2.yaml`

```yaml
llm:
  api_type: 'openai'
  model: 'gpt-4-turbo'
  base_url: 'https://api.openai.com/v1'
  api_key: 'sk-...' # YOUR_API_KEY
```

Custom configuration： `~/.metagpt/gpt-4.yaml`

```yaml
llm:
  api_type: 'openai'
  model: 'gpt-4o'
  base_url: 'https://api.openai.com/v1'
  api_key: 'sk-...' # YOUR_API_KEY
```

```python
from metagpt.config2 import Config
from metagpt.roles import Role
from metagpt.actions import Action
import asyncio
from metagpt.environment import Environment
from metagpt.team import Team

# Example configurations for gpt-4, gpt-4-turbo and gpt-3.5-turbo
gpt4 = Config.from_home("gpt-4.yaml")  # Load custom configuration from `~/.metagpt` directory `gpt-4.yaml`
gpt4t = Config.default()  # Use default configuration from `config2.yaml` file (model: "gpt-4-turbo")
gpt35 = Config.default()
gpt35.llm.model = "gpt-3.5-turbo"  # Modify model to "gpt-3.5-turbo"

# Create three Actions: a1, a2, and a3. Assign the configuration of gpt4t to a1.
a1 = Action(config=gpt4t, name="Say", instruction="Say your opinion with emotion and don't repeat it")
a2 = Action(name="Say", instruction="Say your opinion with emotion and don't repeat it")
a3 = Action(name="Vote", instruction="Vote for the candidate, and say why you vote for him/her")

# Create three Roles: A, B, and C. Representing "Democratic candidate," "Republican candidate," and "Voter" respectively.
# Although A is configured with gpt4 in Role config, it will use the configuration with model gpt4 for a1 due to the Action config setting.
A = Role(name="A", profile="Democratic candidate", goal="Win the election", actions=[a1], watch=[a2], config=gpt4)
# Since B is configured with gpt35 in Role config, and a2 has no Action config, both B and a2 will use Role config, i.e., the configuration with model gpt35.
B = Role(name="B", profile="Republican candidate", goal="Win the election", actions=[a2], watch=[a1], config=gpt35)
# Since C has no config set, and a3 also has no config set, both C and a3 will use the Global config, i.e., the configuration with model gpt4.
C = Role(name="C", profile="Voter", goal="Vote for the candidate", actions=[a3], watch=[a1, a2])

# Create an environment described as "US election live broadcast"
env = Environment(desc="US election live broadcast")
team = Team(investment=10.0, env=env, roles=[A, B, C])
# Run the team, and you should observe collaboration between them
asyncio.run(team.run(idea="Topic: climate change. Under 80 words per message.", send_to="A", n_round=3))
# await team.run(idea="Topic: climate change. Under 80 words per message.", send_to="A", n_round=3) # If running in Jupyter Notebook, use this line of code
```
