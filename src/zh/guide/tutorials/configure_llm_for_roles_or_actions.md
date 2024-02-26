# 为角色或动作配置LLM

MetaGPT允许你为团队中的不同Role和Action使用不同的LLM，这极大地增强了团队互动的灵活性和现实性，使得每个Role可以根据其特定的需求和背景，以及每个Action的特点，选择最合适的LLM。通过这种方式，你可以更精细地控制对话的质量和方向，从而创造出更加丰富和真实的交互体验。请先在开始之前，确保已阅读LLM的相关配置和辩论有基本了解。

以下是设置步骤：1.定义配置：在`metagpt/config2.py`文件中使用其他的LLM，或者从`~/.metagpt`目录加载自定义配置。2.分配配置：将特定的LLM配置分配给Role和Action，在创建Action时，使用`config`参数设置其LLM配置，否则将会使用其所属Role的LLM配置。3.团队交互：创建一个带有环境的团队，开始交互。

## 示例

考虑一个美国大选的现场直播环境，我们将创建三个Role：A、B和C。A和B是两个候选人，C是一个选民。

1. 你可以使用默认配置，在`metagpt/config2.py`的最后添加你想要用于不同的Role和Action的LLM配置，也可以在`~/.metagpt`目录加载自定义的配置。

```python
# metagpt/config2.py
# 以下是一些示例配置，分别为gpt-3.5-turbo-1106、gpt-4-0613和gpt-4-1106-preview
gpt35 = Config.default()  # 使用`config2.yaml`文件中的配置
gpt35.llm.model = "gpt-3.5-turbo-1106"  # 将model设置为"gpt-3.5-turbo-1106"
gpt4 = Config.default()
gpt4.llm.model = "gpt-4-0613"  # 将model设置为"gpt-4-0613"

gpt4t = Config.from_home("gpt-4-1106-preview.yaml")  # 从`~/.metagpt`目录加载自定义配置`gpt-4-1106-preview.yaml`
```

2. 创建Role和Action，并将LLM配置分配给它们。你可以使用`config`参数为每个Action指定LLM配置，如果未设置`config`参数，Action将使用其所属Role的LLM配置。

```python
# 创建a1、a2和a3三个Action。并为a1指定`gpt4t`的配置。

a1 = Action(config=gpt4t, name="Say", instruction="Say your opinion with emotion and don't repeat it")
a2 = Action(name="Say", instruction="Say your opinion with emotion and don't repeat it")
a3 = Action(name="Vote", instruction="Vote for the candidate, and say why you vote for him/her")

# 创建A，B，C三个角色，分别为“民主党候选人”、“共和党候选人”和“选民”，并尝试分别分配`gpt4`、`gpt4`和`gpt35`的配置。
# 它将不会为a1工作，因为配置已经设置，所以A将使用gpt4的配置，而a1将使用gpt4t的配置。
A = Role(name="A", profile="Democratic candidate", goal="Win the election", actions=[a1], watch=[a2], config=gpt4)
# 它将为a2工作，因为配置未设置
B = Role(name="B", profile="Republican candidate", goal="Win the election", actions=[a2], watch=[a1], config=gpt4)
# 同上
C = Role(name="C", profile="Voter", goal="Vote for the candidate", actions=[a3], watch=[a1, a2], config=gpt35)
```

3. 创建一个带有环境的团队，并使其进行交互。

```python
# 创建一个描述为“美国大选现场直播”的环境
env = Environment(desc="US election live broadcast")
team = Team(investment=10.0, env=env, roles=[A, B, C])
# 运行团队，我们应该会看到它们之间的协作
asyncio.run(team.run(idea="Topic: climate change. Under 80 words per message.", send_to="A", n_round=3))
```
