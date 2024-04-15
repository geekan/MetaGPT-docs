# Android Environment

[Code](https://github.com/geekan/MetaGPT/tree/main/metagpt/environment/android)

The Android environment provides a running environment for controlling the Android emulator (virtual phone) or real Android phone through `adb`. Generally, what can be directly observed from the environment are screenshots and UI tree structure information. The set of actions that can be operated in the environment are: click, enter text, slide, return to the desktop, long press and other operations.

## Space Definition

### Observation Space

Definition: `spaces.Dict({"screenshot": spaces.Text(256), "xml": spaces.Text(256)})`, provides the local address of the screenshot and the local address of the UI tree structure information.

Description of observation

| Field      | Description                                    | Maximum text length |
| ---------- | ---------------------------------------------- | ------------------- |
| screenshot | The local address of the screenshot            | 256                 |
| xml        | Local address of UI tree structure information | 256                 |

Space sample example:

```
OrderedDict([('screenshot', 'cQUnpNjpsOeTAFG3TkFWRQpRBcF3vAPeblVbM7Kc4KRcnCe2UVMH1WEeAjAwbil1gimsZYztZBzrfIiYQY820ZEjOgFB'), ('xml', 'siXd9XILsNnJTA9sqpNSfaIysHIJ75CbOYfmrIaDAxxObK0X0DKpGI5EazYBCIFFvUDfdw8ZkHVHhWCSS7AIsD2p7mgu7766pRt37gjhY8cxb')])
```

### Action Space

Definition:

```python
from gymnasium import spaces
import numpy as np
from metagpt.environment.android.env_space import EnvActionType

device_shape = (720, 1080)

space = spaces.Dict(
    {
        "action_type": spaces.Discrete(len(EnvActionType)),
        "coord": spaces.Box(
            np.array([0, 0], dtype=np.int64), np.array([device_shape[0], device_shape[1]], dtype=np.int64)
        ),
        "tgt_coord": spaces.Box(
            np.array([0, 0], dtype=np.int64), np.array([device_shape[0], device_shape[1]], dtype=np.int64)
        ),
        "input_txt": spaces.Text(256),
        "orient": spaces.Text(16),
        "dist": spaces.Text(16),
    }
)
```

Description of action

| Field       | Description                                                                                          | Value Description                                                                                                                                                                       |
| ----------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| action_type | Action type                                                                                          | Different actions correspond to different IntEnum values, followed by None, SYSTEM_BACK, SYSTEM_TAP, USER_INPUT, USER_LONGPRESS, USER_SWIPE, USER_SWIPE_TO                              |
| coord       | The starting coordinate of the basic operation, an `ndarray` with size (2,)                          | The minimum value of the first value is 0, and the maximum value is the screen width. The minimum value of the second value is 0 and the maximum value is the screen height. Unit pixel |
| tgt_coord   | Used for sliding actions, corresponding to the target position coordinates. `ndarray` with size (2,) | The minimum value of the first value is 0, and the maximum value is the screen width. The minimum value of the second value is 0 and the maximum value is the screen height. Unit pixel |
| input_txt   | Input text                                                                                           | Maximum length 256                                                                                                                                                                      |
| orient      | sliding direction                                                                                    | corresponding to `up`, `down`, `left`, `right`                                                                                                                                          |
| dist        | sliding distance                                                                                     | corresponding to `long`, `medium`                                                                                                                                                       |

Space sample example:

```
OrderedDict([('action_type', 1), ('coord', array([ 55.44057, 842.3602 ], dtype=float32)), ('dist', '6NY'), ('input_txt', 'GdW'), ('orient', 'mSWYHlXuVIdBmqo'), ('tgt_coord', array([431.0454 , 658.18286], dtype=float32))])
```

When used, use `EnvAction` to initialize an action: the action type to be executed and the corresponding required input parameters, and execute the action through `env.step(action)`, and get the corresponding rewards and new observations.

## Usage

```python
from pathlib import Path
from metagpt.environment.android.android_ext_env import AndroidExtEnv
from metagpt.environment.android.env_space import (
    EnvAction,
    EnvActionType,
    EnvObsParams,
    EnvObsType,
)
from metagpt.logs import logger

env = AndroidExtEnv(device_id="emulator-5554", screenshot_dir="/android/path/to/store/screenshot", xml_dir="/android/path/to/store/xml")

obs, _ = env.reset()  # get full observation

screenshot_path: Path = env.observe(
    EnvObsParams(
        obs_type=EnvObsType.GET_SCREENSHOT, ss_name="step_0", local_save_dir="/local/path/to/store/screenshot"
    )
)  # get partial observation


action = EnvAction(action_type=EnvActionType.USER_INPUT, input_txt="user_input")  # define a action, and init corresponding params
obs, _, _, _, info = env.step(action)  # execute action and get new observation

logger.info(f'action execute result: {info["res"]}')  # action execute result
```
