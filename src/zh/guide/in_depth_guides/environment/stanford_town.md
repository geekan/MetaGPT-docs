# 斯坦福小镇环境

[代码入口](https://github.com/geekan/MetaGPT/tree/main/metagpt/environment/stanford_town)

斯坦福小镇环境内部通过定义了一个包括小镇建筑等目标信息的网格地图，并使用[generative_agents](https://github.com/joonspk-research/generative_agents) 的`frontend_server`进行小镇环境前端展现和角色行为输出。一般的，可以从环境中直接观察到网格地图以及地图上不同位置的建筑信息描述等，可以在环境中操作的动作集合为：在地图指定位置添加事件信息、从地图指定位置删除符合条件的事件信息、重置地图指定位置的事件等。

## 空间定义

### 观察空间

由于完整观察值定义较为复杂，在实际使用过程中并未使用。这里使用了桩观察空间，顾不在这里展开。

### 动作空间

定义：

```python
from gymnasium import spaces
import numpy as np
from metagpt.environment.stanford_town.env_space import EnvActionType

maze_shape = (140, 100)

space = spaces.Dict(
    {
        "action_type": spaces.Discrete(len(EnvActionType)),
        "coord": spaces.Box(
            np.array([0, 0], dtype=np.int64), np.array([maze_shape[0], maze_shape[1]], dtype=np.int64)
        ),  # coord of the tile
        "subject": spaces.Text(256),  # the first element of an tile event
        "event": spaces.Tuple(
            (spaces.Text(256), spaces.Text(256), spaces.Text(256), spaces.Text(256))
        ),  # event is a tuple of four str
    }
)
```

动作值说明

| 字段        | 说明                                | 取值说明                                                                                                     |
| ----------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| action_type | 动作类型                            | 不同动作对应不同IntEnum值，依次None、ADD_TILE_EVENT、RM_TILE_EVENT、TURN_TILE_EVENT_IDLE、RM_TITLE_SUB_EVENT |
| coord       | 地图上的坐标，尺寸为(2,)的`ndarray` | 第一个数值最小值为0，最大值为地图宽度。第二个数值最小值为0，最大值为地图高度。                               |
| subject     | 事件的主题，文本类型                | 最大长度256                                                                                                  |
| event       | 事件，包含4个文本的元组类型         | 每个元素最大长度256                                                                                          |

空间sample示例：

```
OrderedDict([('action_type', 1), ('coord', array([102.284424, 142.02187 ], dtype=float32)), ('event', ('cW6PUEhxxxKp9xitcEjNm', '9noCkVjHexxxd0D45p37q', '5r4ICxxxnqkoyGXv6', 'PK7YxxxOOsJq93')), ('subject', 'kTvgixxx4C4')])
```

## 使用

```python
from metagpt.environment.stanford_town.stanford_town_ext_env import StanfordTownExtEnv
from metagpt.environment.stanford_town.env_space import (
    EnvAction,
    EnvActionType,
    EnvObsParams,
    EnvObsType,
)

env = StanfordTownExtEnv(maze_asset_path="/path/to/maze_asset_path")

obs, _ = env.reset()  # 得到完整观察值

nearby_tiles = env.observe(
    EnvObsParams(
        obs_type=EnvObsType.TILE_NBR, coord=(72, 14), vision_radius=10
    )
)  # 得到局部观察值，当前位置(200, 300)视野内的其他网格信息

action = EnvAction(action_type=EnvActionType.RM_TITLE_SUB_EVENT, coord=(72, 14), subject="Isabella Rodriguez")  # 初始化一组动作值，删除指定位置主语为subject的事件。
obs, _, _, _, info = env.step(action)  # 执行动作并得到新的完整观察
```
