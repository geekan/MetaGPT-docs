# Stanford Town Environment

[Code](https://github.com/geekan/MetaGPT/tree/main/metagpt/environment/stanford_town)

The Stanford Town Environment internally defines a grid map including target information such as town buildings, and uses the `frontend_server` of [generative_agents](https://github.com/joonspk-research/generative_agents) to display the town environment. and character behavior output. Generally, the grid map and the description of building information at different locations on the map can be directly observed from the environment. The set of actions that can be operated in the environment are: adding event at the specified location on the map, deleting qualified event from the specified location on the map, resetting event from the specified location on the map, etc.

## Space Definition

### Observation Space

Since the definition of complete observations is complicated, it is not used in actual use. The pile observation space is used here, and it is not expanded here.

### Action Space

Definition:

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

Description of action

| Field       | Description                                      | Value Description                                                                                                                                                       |
| ----------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| action_type | Action type                                      | Different actions correspond to different IntEnum values, followed by None, ADD_TILE_EVENT, RM_TILE_EVENT, TURN_TILE_EVENT_IDLE, RM_TITLE_SUB_EVENT                     |
| coord       | Coordinates on the map, `ndarray` with size (2,) | The minimum value of the first value is 0, and the maximum value is the map width. The minimum value of the second value is 0, and the maximum value is the map height. |
| subject     | The subject of the event, text type              | Maximum length 256                                                                                                                                                      |
| event       | event, tuple type containing 4 texts             | maximum length of each element 256                                                                                                                                      |

Space sample example:

```
OrderedDict([('action_type', 1), ('coord', array([102.284424, 142.02187 ], dtype=float32)), ('event', ('cW6PUEhxxxKp9xitcEjNm', '9noCkVjHexxxd0D45p37q', '5r4ICxxxnqkoyGXv6', 'PK7YxxxOOsJq93')), ('subject', 'kTvgixxx4C4')])
```

## Usage

```python
from metagpt.environment.stanford_town.stanford_town_ext_env import StanfordTownExtEnv
from metagpt.environment.stanford_town.env_space import (
    EnvAction,
    EnvActionType,
    EnvObsParams,
    EnvObsType,
)

env = StanfordTownExtEnv(maze_asset_path="/path/to/maze_asset_path")

obs, _ = env.reset()  # get full observation

nearby_tiles = env.observe(
    EnvObsParams(
        obs_type=EnvObsType.TILE_NBR, coord=(72, 14), vision_radius=10
    )
)  # get partial observation，other grid information inside the vision of coordinate(200, 300)

action = EnvAction(action_type=EnvActionType.RM_TITLE_SUB_EVENT, coord=(72, 14), subject="Isabella Rodriguez")  # define a action, delete the event which subject is `Isabella Rodriguez` from particular coordinate.
obs, _, _, _, info = env.step(action)  # execute action and get new observation
```
