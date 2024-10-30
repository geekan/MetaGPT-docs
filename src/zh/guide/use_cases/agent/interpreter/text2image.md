# 工具使用：Text2Image

## 概述

Text2Image，指通过文字描述获取图片

## 示例：使用Stable Diffusion工具完成Text2Image

### 任务

使用stable diffusion的文生图工具，生成给定文本描述的图片

### 代码

[examples/di/sd_tool_usage.py](https://github.com/geekan/MetaGPT/blob/main/examples/di/sd_tool_usage.py)

```bash
python examples/di/sd_tool_usage.py
```

### 运行结果

在metagpt的workspace/resources/SD_Output产生一张512x768的图
<img src="../../../../../public/image/guide/use_cases/interpreter/girl_img.png">

## 机制解释

1. 将metagpt/tools下的既有代码sd_engine.py，进行工具标准化定义提供给`DataInterpreter`，工具定义放在metagpt/tools/functions/schemas下，见 stable_diffusion.yml
2. `DataInterpreter`规划任务时，自动将中间任务类型设置为"stable_diffusion"，执行任务时将扫描是否有stable_diffusion相关工具可用。
3. 发现可用工具：['SDEngine']，加载工具代码，自动根据当前需求使用SD T2I代码进行出图。出图前进行SD Prompt的自动扩写。
