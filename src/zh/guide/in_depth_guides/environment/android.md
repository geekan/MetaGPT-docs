# 安卓环境

[代码入口](https://github.com/geekan/MetaGPT/tree/main/metagpt/environment/android)

安卓环境提供了通过`adb`来操纵安卓模拟器（虚拟手机）或真实安卓手机的运行环境。一般的，可以从环境中直接观察到的为屏幕截图和UI树结构信息，可以在环境中操作的动作集合为：点击、输入文本、滑动、返回桌面、长按等操作。

## 空间定义

### 观察空间

定义：`spaces.Dict({"screenshot": spaces.Text(256), "xml": spaces.Text(256)})`，提供屏幕截图的本地地址和UI树结构信息的本地地址。

观察值说明

| 字段       | 说明                   | 文本最大长度 |
| ---------- | ---------------------- | ------------ |
| screenshot | 屏幕截图的本地地址     | 256          |
| xml        | UI树结构信息的本地地址 | 256          |

空间sample示例：

```
OrderedDict([('screenshot', 'cQUnpNjpsOeTAFG3TkFWRQpRBcF3vAPeblVbM7Kc4KRcnCe2UVMH1WEeAjAwbil1gimsZYztZBzrfIiYQY820ZEjOgFB'), ('xml', 'siXd9XILsNnJTA9sqpNSfaIysHIJ75CbOYfmrIaDAxxObK0X0DKpGI5EazYBCIFFvUDfdw8ZkHVHhWCSS7AIsD2p7mgu7766pRt37gjhY8cxb')])
```

### 动作空间

定义：

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

动作值说明

| 字段        | 说明                                                  | 取值说明                                                                                                            |
| ----------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| action_type | 动作类型                                              | 不同动作对应不同IntEnum值，依次None、SYSTEM_BACK、SYSTEM_TAP、USER_INPUT、USER_LONGPRESS、USER_SWIPE、USER_SWIPE_TO |
| coord       | 基础操作的开始坐标，尺寸为(2,)的`ndarray`             | 第一个数值最小值为0，最大值为屏幕宽度。第二个数值最小值为0，最大值为屏幕高度。单位pixel                             |
| tgt_coord   | 用于滑动动作，对应目标位置坐标。尺寸为(2,)的`ndarray` | 第一个数值最小值为0，最大值为屏幕宽度。第二个数值最小值为0，最大值为屏幕高度。单位pixel                             |
| input_txt   | 输入的文本                                            | 最大长度256                                                                                                         |
| orient      | 滑动方向                                              | 对应`up`，`down`，`left`，`right`                                                                                   |
| dist        | 滑动距离                                              | 对应`long`，`medium`                                                                                                |

空间sample示例：

```
OrderedDict([('action_type', 1), ('coord', array([ 55.44057, 842.3602 ], dtype=float32)), ('dist', '6NY'), ('input_txt', 'GdW'), ('orient', 'mSWYHlXuVIdBmqo'), ('tgt_coord', array([431.0454 , 658.18286], dtype=float32))])
```

使用时，使用`EnvAction`初始化一个action：要执行的动作类型及对应的所需入参，并通过`env.step(action)`进行动作执行，并得到对应的奖励和新的观察。

## 使用

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

obs, _ = env.reset()  # 得到完整观察值

screenshot_path: Path = env.observe(
    EnvObsParams(
        obs_type=EnvObsType.GET_SCREENSHOT, ss_name="step_0", local_save_dir="/local/path/to/store/screenshot"
    )
)  # 得到局部观察值

action = EnvAction(action_type=EnvActionType.USER_INPUT, input_txt="user_input")  # 初始化一组动作值，关于用户输入文本。
obs, _, _, _, info = env.step(action)  # 执行动作并得到新的完整观察

logger.info(f'action execute result: {info["res"]}')  # 动作执行的结果值
```
