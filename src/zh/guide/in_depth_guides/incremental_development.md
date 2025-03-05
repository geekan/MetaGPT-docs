# 增量开发

您可以通过以下步骤改进现有项目代码：

- 在计算机上的任意位置找到您想要改进的由 MetaGPT 创建的项目的文件夹
- 执行 `metagpt <用户用自然语言描述的新需求或错误反馈> --project-path <由metagpt创建的项目路径>`

---

## metagpt 选项

通过使用以下参数，可以持续迭代 MetaGPT 生成的现有项目。

| CLI 参数名称     | 值类型 | 可选/必填 | 描述                                                                                                       | 用法                                                                                                                                                |
| :--------------- | :----- | :-------- | :-------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--project-path` | TEXT   | 可选      | 指定由 metagpt 创建的旧版本项目目录路径，用于实现增量需求                                                  | metagpt "BUG_FEEDBACK_XXX" --project-path "项目完整路径"<br/><br/>metagpt "增量需求" --project-path "项目完整路径"                                  |
| `--project-name` | TEXT   | 可选      | 唯一项目名称（如 'game_2048'）                                                                            | metagpt "新需求" --project-name "项目名称"                                                                                                         |

更多命令选项请查看 `metagpt --help`。

---

## 演示

以贪吃蛇游戏为例，我们将演示如何进行增量式软件迭代。

### 创建新贪吃蛇游戏项目

使用以下命令参数通过 gpt-4-turbo 创建贪吃蛇游戏项目：

```shell
metagpt "Write a cli snake game based on pygame" --project-name "snake_game" --run-tests --n-round 20 --max-auto-summarize-code 1
```

相关参数说明如下：

| CLI 参数名称              | 值           | 描述                                                                 |
| :------------------------ | :----------- | :------------------------------------------------------------------- |
| --project-name            | "snake_game" | 新建软件项目的文件夹名称和项目名称均为 "snake_game"                  |
| --run-tests               |              | 启用单元测试阶段                                                     |
| --n-round                 | 20           | 执行 20 轮迭代                                                      |
| --max-auto-summarize-code | 1            | 允许对"代码总结"中发现的问题进行最多 1 次修复                        |

完整流程如下：
![part1](../../../public/image/guide/tutorials/inc_req_and_fixbug/20231218-165803.gif)
![part2](../../../public/image/guide/tutorials/inc_req_and_fixbug/20231218-170323.gif)

---

### 为现有项目添加新需求

使用 Azure 的 GPT-4 和以下参数追加需求：

```shell
metagpt "Add a randomly appearing enemy that lasts for 5 seconds. If the enemy is eaten, the game ends. If the enemy is not eaten, it disappears after 5 seconds." --project-path "/Users/iorishinier/github/bak/MetaGPT/workspace/snake_game" --run-tests --n-round 20 --max-auto-summarize-code 1
```

其中，相关参数的功能说明如下：

| CLI 参数名称              | 值                                                           | 描述                                                                 |
| :------------------------ | :----------------------------------------------------------- | :------------------------------------------------------------------- |
| --project-path            | "/Users/iorishinier/github/bak/MetaGPT/workspace/snake_game" | 现有项目的路径                                                       |
| --run-tests               |                                                              | 启用单元测试阶段                                                     |
| --n-round                 | 20                                                           | 执行 20 轮迭代                                                      |
| --max-auto-summarize-code | 1                                                            | 允许对"代码总结"中发现的问题进行最多 1 次修复                        |

完整流程如下：
![part1](../../../public/image/guide/tutorials/inc_req_and_fixbug/20231218-171621.gif)
![part2](../../../public/image/guide/tutorials/inc_req_and_fixbug/20231218-172141.gif)
![part3](../../../public/image/guide/tutorials/inc_req_and_fixbug/20231218-172656.gif)
![part4](../../../public/image/guide/tutorials/inc_req_and_fixbug/20231218-173215.gif)
![part5](../../../public/image/guide/tutorials/inc_req_and_fixbug/20231218-173737.gif)
虽然最后的 LLM 代码生成请求超时，但不会影响后续的项目迭代。由于新需求已累积在 PRD 中，重新运行或添加新需求将基于当前 PRD 继续执行。

---

### 修复 Bug

使用 Azure 的 GPT-4 和以下参数修复错误。为演示错误修复流程，我们故意在生成代码中引入错误代码来触发异常，然后将错误信息作为需求内容提交：

```shell
metagpt "TypeError: draw() takes 1 positional argument but 2 were given" --project-path "/Users/iorishinier/github/bak/MetaGPT/workspace/snake_game" --run-tests --n-round 10 --max-auto-summarize-code 0
```

其中，相关参数的功能说明如下：

| CLI 参数名称              | 值                                                           | 描述                                 |
| :------------------------ | :----------------------------------------------------------- | :----------------------------------- |
| --project-path            | "/Users/iorishinier/github/bak/MetaGPT/workspace/snake_game" | 现有项目的路径                       |
| --run-tests               |                                                              | 启用单元测试阶段                     |
| --n-round                 | 10                                                           | 执行 10 轮迭代                      |
| --max-auto-summarize-code | 0                                                            | 禁止自动修复"代码总结"中发现的问题   |

完整流程如下：
![part1](../../../public/image/guide/tutorials/inc_req_and_fixbug/20231218-213655.gif)
![part2](../../../public/image/guide/tutorials/inc_req_and_fixbug/20231218-214234.gif)
![part3](../../../public/image/guide/tutorials/inc_req_and_fixbug/20231218-214752.gif)
![part4](../../../public/image/guide/tutorials/inc_req_and_fixbug/20231218-215313.gif)
![part5](../../../public/image/guide/tutorials/inc_req_and_fixbug/20231218-215442.gif)

---

## 未解决的问题

Software Company 是一个实验室项目，旨在展示 MetaGPT 框架的功能，而不是解决生产中的实际问题。因此，MetaGPT Software Company 不支持输入以下性质的新需求：

1. 架构相关需求（如如何编写 setup.py 或 requirements.txt）
2. 指定具体函数应执行特定操作

其原因如下：

1. 此类“要求”本质上是约束或指示。与真正的需求不同，它们指定系统内某些模块的功能，而不是整个系统的功能。
2. MetaGPT Software公司将软件开发过程简化为类视图和序列图的需求，然后直接翻译成源代码。诸如上述的系统内部模块的设计要求，由于缺乏明确的实现流程，因此被放弃。

---

## 编辑项目文件

您可以通过直接编辑 Software Company 生成的项目文件来添加新需求。完成必要修改后，使用 `metagpt` 命令启动新一轮增量迭代。以下是项目文件夹结构的说明，项目迭代过程中使用的文件应存放在 `docs` 目录：

| 路径                           | 可编辑 | 描述                                                                                                                                                                                                 |
| ------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| .dependencies.json             | 否     | 存储文件间的显式依赖关系                                                                                                                                                                             |
| docs/requirement.txt           | 否     | 存储本次迭代新增需求（处理过程中内容会被拆分合并到 `docs/prds/`，请通过 metagpt 命令修改）                                                                                                           |
| docs/bugfix.txt                | 否     | 存储本轮错误反馈（迭代过程中会将错误反馈转化为需求输入，请勿直接修改）                                                                                                                               |
| docs/prds                      | 是     | 项目需求的最终分解结果                                                                                                                                                                               |
| docs/system_designs            | 是     | 项目的最终系统设计                                                                                                                                                                                   |
| docs/tasks                     | 是     | 项目的编码任务                                                                                                                                                                                       |
| docs/code_summaries            | 是     | 代码审查结果                                                                                                                                                                                         |
| resources/competitive_analysis | 否     | 竞品分析                                                                                                                                                                                             |
| resources/data_api_design      | 否     | 类视图文件                                                                                                                                                                                           |
| resources/seq_flow             | 否     | 序列图文件                                                                                                                                                                                           |
| resources/system_design        | 否     | 系统设计文件                                                                                                                                                                                         |
| resources/prd                  | 否     | PRD 文件                                                                                                                                                                                             |
| resources/api_spec_and_tasks   | 否     | 编码任务文件                                                                                                                                                                                         |
| tmp                            | 否     | 项目处理过程中生成的临时文件（不会被 git 归档）                                                                                                                                                      |
| &lt;workspace&gt;              | 是     | 项目源代码目录                                                                                                                                                                                       |
| tests                          | 是     | 单元测试代码                                                                                                                                                                                         |
| test_outputs                   | 否     | 单元测试执行结果                                                                                                                                                                                     |

---

## 更多演示

### 愤怒的小鸟游戏

- #### 新项目

使用 gpt-4-turbo 使用以下命令创建一个新的愤怒的小鸟项目：

```shell
metagpt "write a flappy bird game without any obstacles" --project-name "flappy_bird" --run-tests --n-round 20 --max-auto-summarize-code 0
```

<video controls>
  <source src="../../../public/image/guide/tutorials/inc_req_and_fixbug/20231221-161603.mp4" type="video/mp4">
</video>

- #### 修复错误

使用 Azure GPT-4 修复错误：

```shell
metagpt "for event in pygame.event.get(): pygame.error: video system not initialized" --project-path "/Users/iorishinier/github/bak/MetaGPT/workspace/flappy_bird" --run-tests --n-round 20 --max-auto-summarize-code 1
```

<video controls>
  <source src="../../../public/image/guide/tutorials/inc_req_and_fixbug/20231221-170726.mp4" type="video/mp4">
</video>

通过代码审查我们可以看到game.py不断被重构：
![img](../../../public/image/guide/tutorials/inc_req_and_fixbug/9ada7f82adfe4d63b45c9558cd986a7f.png)
![img](../../../public/image/guide/tutorials/inc_req_and_fixbug/34d41fcfc20043c39bd0cb778fe42dec.png)

此外，摘要代码操作还指出了通过代码审查未发现的问题，导致game.py进行新一轮的重构：

```text
{
    "game.py": "Implement the 'jump' method in the 'Bird' class, the 'generate_obstacles' method in the 'Game' class, and improve the collision detection in the 'check_collision_and_update_score' method. Also, use the 'obstacles' attribute in the 'Game' class to store and manage the obstacles, and update the score in real-time in the 'draw' method.",
    "main.py": "No changes needed."
}
```

![img](../../../public/image/guide/tutorials/inc_req_and_fixbug/54f1b80bdd874984b07184f4d834f326.png)
汇总代码动作可以导致源代码无限且持续的重构。但是，我们通过设置“--max-auto-summarize-code 1”将其限制为 1 轮，以展示摘要代码操作的功能。

以下是可用的项目版本：

![img](../../../public/image/guide/tutorials/inc_req_and_fixbug/29dcde2670534c8694ec5341fc3141a0.png)

- #### 添加新需求

使用 Azure GPT-4 添加移动障碍物：

添加前效果：
![img](../../../public/image/guide/tutorials/inc_req_and_fixbug/6d081360d0c74bb48794b9f8a2b0a23e.png)
![img](../../../public/image/guide/tutorials/inc_req_and_fixbug/2dd5080ad50749feb3e241ab5f679b9a.png)

执行命令：
```shell
metagpt "Add moving obstacles, move randomly, last for 5 seconds." --project-path "/Users/iorishinier/github/bak/MetaGPT/workspace/flappy_bird" --run-tests --n-round 20 --max-auto-summarize-code 1
```

<video controls>
  <source src="../../../public/image/guide/tutorials/inc_req_and_fixbug/20231221-193811.mp4" type="video/mp4">
</video>

这是新的类视图和序列视图：

![img](../../../public/image/guide/tutorials/inc_req_and_fixbug/671f926264284392bf81796a645f93d1.png)
![img](../../../public/image/guide/tutorials/inc_req_and_fixbug/e1c769d21ad94138baf831a48e741da9.png)
