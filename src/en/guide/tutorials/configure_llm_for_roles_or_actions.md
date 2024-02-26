# Configure LLM for roles or actions

MetaGPT allows you to use different LLMs for different Roles and Actions within your team. This greatly enhances the flexibility and realism of team interactions, enabling each Role to choose the most suitable LLM based on its specific needs, background, and the characteristics of each Action. This fine-grained control over the quality and direction of conversations creates a more immersive and authentic interactive experience. Before getting started, make sure you have a basic understanding of LLM configuration and debates.

Here are the setup steps:
1.Define Configurations: Use other LLMs in the `metagpt/config2.py` file or load custom configurations from the `~/.metagpt` directory.
2.Assign Configurations: Allocate specific LLM configurations to Roles and Actions. When creating an Action, use the `config` parameter to set its LLM configuration; otherwise, it will use the LLM configuration of its associated Role.
3.Team Interaction: Create a team with an environment and start interacting.

## Example

Consider a live broadcast environment for the U.S. election. We will create three Roles: A, B, and C. A and B are two candidates, and C is a voter.

1. You can use default configurations by adding LLM configurations for different Roles and Actions at the end of `metagpt/config2.py`, or load custom configurations from the `~/.metagpt` directory.

```python
# metagpt/config2.py
# Here are some example configurations for gpt-3.5-turbo-1106, gpt-4-0613, and gpt-4-1106-preview
gpt35 = Config.default()  # Use the configuration from `config2.yaml` file
gpt35.llm.model = "gpt-3.5-turbo-1106"  # Set the model to "gpt-3.5-turbo-1106"
gpt4 = Config.default()
gpt4.llm.model = "gpt-4-0613"  # Set the model to "gpt-4-0613"

gpt4t = Config.from_home("gpt-4-1106-preview.yaml")  # Load custom configuration "gpt-4-1106-preview.yaml" from `~/.metagpt`
```

2. Create Roles and Actions, and assign LLM configurations to them. Use the `config` parameter to specify the LLM configuration for each Action. If the `config` parameter is not set, the Action will use the LLM configuration of its associated Role.

```python
# Create three Actions: a1, a2, and a3. Specify the configuration of `gpt4t` for a1.

a1 = Action(config=gpt4t, name="Say", instruction="Say your opinion with emotion and don't repeat it")
a2 = Action(name="Say", instruction="Say your opinion with emotion and don't repeat it")
a3 = Action(name="Vote", instruction="Vote for the candidate, and say why you vote for him/her")

# Create three Roles: A, B, and C, representing "Democratic candidate," "Republican candidate," and "Voter" respectively. Try assigning configurations of `gpt4`, `gpt4`, and `gpt35`.
# It will not work for a1 since the configuration is already set; hence, A will use the configuration of gpt4, and a1 will use the configuration of gpt4t.
A = Role(name="A", profile="Democratic candidate", goal="Win the election", actions=[a1], watch=[a2], config=gpt4)
# It will work for a2 since the configuration is not set
B = Role(name="B", profile="Republican candidate", goal="Win the election", actions=[a2], watch=[a1], config=gpt4)
# Same as above
C = Role(name="C", profile="Voter", goal="Vote for the candidate", actions=[a3], watch=[a1, a2], config=gpt35)
```

3. Create a team with an environment and let them interact.

```python
# Create an environment described as "US election live broadcast"
env = Environment(desc="US election live broadcast")
team = Team(investment=10.0, env=env, roles=[A, B, C])
# Run the team, and you should observe collaboration between them
asyncio.run(team.run(idea="Topic: climate change. Under 80 words per message.", send_to="A", n_round=3))
```
