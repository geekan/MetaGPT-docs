# Tool Usage: Text2Image

## Overview

Text2Image refers to obtaining images through text descriptions.

## Example: Completing Text2Image Using the Stable Diffusion Tool

### Task

Use the text-to-image tool of stable diffusion to generate an image from a given text description.

### Code

[examples/di/sd_tool_usage.py](https://github.com/geekan/MetaGPT/blob/main/examples/di/sd_tool_usage.py)

```bash
python examples/di/sd_tool_usage.py
```

### Execution Results

Produces a 512x768 image in metagpt's workspace/resources/SD_Output
<img src="../../../../../public/image/guide/use_cases/interpreter/girl_img.png">

## Mechanism Explained

1. Standardize the existing code sd_engine.py under metagpt/tools to provide it to `DataInterpreter`. The tool definition is placed under metagpt/tools/functions/schemas, see stable_diffusion.yml.
2. When planning tasks, `DataInterpreter` automatically sets the intermediate task type as "stable_diffusion", scanning for available tools related to stable diffusion during task execution.
3. Upon discovering available tools: ['SDEngine'], it loads the tool code and automatically uses SD T2I (Text to Image) code to generate images according to current needs. Before generating images, it automatically expands the SD Prompt.
