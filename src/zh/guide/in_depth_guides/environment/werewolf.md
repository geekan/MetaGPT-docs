# 狼人杀环境

[代码入口](https://github.com/geekan/MetaGPT/tree/main/metagpt/environment/werewolf)

狼人杀环境提供一个策略类桌面游戏环境，在初始化环境时，允许自定义添加狼人和平民数量。游戏执行时，通过内置的不同角色的提示词，非主持人角色在主持人的引导下进行天黑时的私聊和天亮的公开发言。并根据不同的发言和投票等结果，环境内自动计算被淘汰的角色、角色的技能使用情况和存活状态、游戏是否结束、获胜方及原因等。

## 空间定义

### 观察空间

定义：

```python
from gymnasium import spaces
from metagpt.environment.werewolf.const import STEP_INSTRUCTIONS

space = spaces.Dict(
        {
            "game_setup": spaces.Text(256),
            "step_idx": spaces.Discrete(len(STEP_INSTRUCTIONS)),
            "living_players": spaces.Tuple(
                (spaces.Text(16), spaces.Text(16))
            ),  # TODO should be tuple of variable length
            "werewolf_players": spaces.Tuple(
                (spaces.Text(16), spaces.Text(16))
            ),  # TODO should be tuple of variable length
            "player_hunted": spaces.Text(16),
            "player_current_dead": spaces.Tuple((spaces.Text(16))),  # TODO should be tuple of variable length
            "witch_poison_left": spaces.Discrete(2),
            "witch_antidote_left": spaces.Discrete(2),
            "winner": spaces.Text(16),
            "win_reason": spaces.Text(64),
        }
    )
```

观察值说明

| 字段                | 说明                     | 取值说明                                                   |
| ------------------- | ------------------------ | ---------------------------------------------------------- |
| game_setup          | 游戏初始信息文本串       | 最大长度16                                                 |
| step_idx            | 游戏每轮进行到的当前步数 | 值范围`[0-18]`                                             |
| living_players      | 当前存活的玩家名列表     | 可多个玩家                                                 |
| werewolf_players    | 狼人玩家名列表           | 可多个狼人。当前未做隔离，可直接从环境中取得该列表，待优化 |
| player_hunted       | 当前被狼人淘汰的玩家名   | 0个或1个玩家                                               |
| player_current_dead | 当前被淘汰的玩家名列表   | 可多个玩家                                                 |
| witch_poison_left   | 女巫剩余毒药数量         | 0或者1                                                     |
| witch_antidote_left | 女巫剩余解药数量         | 0或者1                                                     |
| winner              | 获胜方                   | 最大长度16                                                 |
| win_reason          | 获胜原因                 | 最大长度64                                                 |

空间sample示例：

```
OrderedDict([('game_setup', 'Game setup: xxx'), ('living_players', ('Player1', 'Player2')), ('player_current_dead', ('Player5', 'Player6')), ('player_hunted', 'Player5'), ('step_idx', 7), ('werewolf_players', ('Player3', 'Player4')), ('win_reason', 'xx'), ('winner', 'werewolf'), ('witch_antidote_left', 1), ('witch_poison_left', 1)])
```

### 动作空间

定义：

```python
from gymnasium import spaces
from metagpt.environment.werewolf.env_space import EnvActionType

space = spaces.Dict(
    {
        "action_type": spaces.Discrete(len(EnvActionType)),
        "player_name": spaces.Text(16),  # the player to do the action
        "target_player_name": spaces.Text(16),  # the target player who take the action
    }
)
```

动作值说明

| 字段               | 说明           | 取值说明                                                                                                          |
| ------------------ | -------------- | ----------------------------------------------------------------------------------------------------------------- |
| action_type        | 动作类型       | 不同动作对应不同IntEnum值，依次None、WOLF_KILL、VOTE_KILL、WITCH_POISON、WITCH_SAVE、GUARD_PROTECT、PROGRESS_STEP |
| player_name        | 动作的发起方   | 最大长度16                                                                                                        |
| target_player_name | 动作的被作用方 | 最大长度16                                                                                                        |

空间sample示例：

```
OrderedDict([('action_type', 5), ('player_name', 'Player1'), ('target_player_name', 'Player2')])
```

## 使用

```python
from metagpt.environment.werewolf.werewolf_ext_env import WerewolfExtEnv
from metagpt.environment.werewolf.env_space import (
    EnvAction,
    EnvActionType
)

env = WerewolfExtEnv()

obs, _ = env.reset()  # 得到完整观察值

action = EnvAction(action_type=EnvActionType.VOTE_KILL, player_name="Player1", target_player_name="Player2")  # 初始化一组动作值，`Player1`票死`Player2`
obs, _, _, _, info = env.step(action)  # 执行动作并得到新的完整观察
```
