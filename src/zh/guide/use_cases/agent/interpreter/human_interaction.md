# 人类交互

## 概述

解释器支持灵活的自然语言交互。使用者可在多个位点变更需求、提供执行建议、审阅结果等。通过人类的引导，解释器可在各场景下达到更高的成功率和更好的效果。

## 示例：机器学习

### 任务

我们使用[机器学习场景](./machine_learning.md)作为示例。在此，我们展示如何根据我们的自身需求，确认和修改解释器的计划，以及引导它重做指定任务

### 代码

[examples/di/machine_learning.py](https://github.com/geekan/MetaGPT/blob/main/examples/di/machine_learning.py)

```
python examples/di/machine_learning.py --auto_run False
```

### 运行结果

<br>
<video  controls>
  <source src="/image/guide/use_cases/interpreter/human_interaction.mp4" type="video/mp4">
</video>

在交互过程中，我们通过自然语言多次提出需求，例如：

- 制定计划时，我们要求它整合和变更任务：“merge 4 and 5, also, change task 2, save the plot”
- 执行过程中，我们要求它更新后续任务：“confirm, but change task 3 only, use 30% as validation set”
- 执行过程中，我们要求它重做当前任务：“redo, use decision tree as the model instead”

解释器均动态地调整并执行，完成了我们的需求

## 机制解释

使用人类交互模式，需在解释器初始化时设置 `auto_run=False` 。解释器将在每次提出计划和完成计划中的每个任务时，请求人类进行审阅。结合关键词，使用者可使用自然语言告知解释器，解释器提出的计划、写出的代码应如何修改。解释器支持计划的状态管理，在新增、修改、删除任务时，会保留未受影响任务的进度。请参考如下的使用示例

### 解释器生成的Plan示例

```json
[
  {
    "task_id": "1",
    "dependent_task_ids": [],
    "instruction": "Load the sklearn Wine recognition dataset."
  },
  {
    "task_id": "2",
    "dependent_task_ids": ["1"],
    "instruction": "Perform exploratory data analysis and include a plot of the dataset features."
  },
  {
    "task_id": "3",
    "dependent_task_ids": ["1"],
    "instruction": "Split the dataset into training and validation sets with a 20% validation split."
  },
  {
    "task_id": "4",
    "dependent_task_ids": ["3"],
    "instruction": "Train a model on the training set to predict wine class."
  },
  {
    "task_id": "5",
    "dependent_task_ids": ["4"],
    "instruction": "Evaluate the model on the validation set and show the validation accuracy."
  }
]
```

### 人类可交互内容

| 交互类型   | 所需关键词                                   | 示例                                                       | 说明                                   |
| ---------- | -------------------------------------------- | ---------------------------------------------------------- | -------------------------------------- |
| 确认       | ["confirm", "continue", "c", "yes", "y"]之一 | confirm                                                    | 确认当前计划或任务结果，并继续往后执行 |
| 确认并修改 | confirm + 任意其他内容                       | confirm, and change task 3, use 30% as validation set      | 确认当前任务结果，同时修改后续计划     |
| 重做       | redo                                         | redo, fix the error by using matplotlib                    | 根据人类意见，重做当前任务             |
|            |                                              | redo, use decision tree as the model instead               |                                        |
| 修改       | -                                            | add a task, save the plot                                  | 根据人类意见，修改计划                 |
|            |                                              | delete task 5                                              |                                        |
|            |                                              | change task 4, use decision tree as the model specifically |                                        |
|            |                                              | merge task 4 and 5                                         |                                        |

解释器将根据人类意见文本，确定交互类型，优先级：确认并修改 > 确认 > 重做 > 修改
