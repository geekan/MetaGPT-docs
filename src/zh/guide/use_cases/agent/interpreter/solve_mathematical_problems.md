# 解数学问题

## 概述

使用 `DataInterpreter` 解决数学问题，具体的数学问题随机选自MATH数据集的level5等级。

## 示例

### 任务

在一所学校，所有 60 名学生至少参加三支球队之一：篮球队、足球队和数学队。 8 名学生参加所有三项运动，一半学生参加篮球，数学队的规模、篮球队的规模和足球队的规模之比为 $4:3:2$。学校有多少名学生同时参加两支球队？

### 代码

[examples/di/solve_math_problems.py](https://github.com/geekan/MetaGPT/blob/main/examples/di/solve_math_problems.py)

```bash
python examples/di/solve_math_problems.py
```

`examples/di/solve_math_problems.py`文件中的代码具体为：

```python
import asyncio

from metagpt.roles.di.data_interpreter import DataInterpreter


async def main(requirement: str = ""):
    di = DataInterpreter()
    await di.run(requirement)


if __name__ == "__main__":
    requirement = "Solve this math problem: The greatest common divisor of positive integers m and n is 6. The least common multiple of m and n is 126. What is the least possible value of m + n?"
    # answer: 60 (m = 18, n = 42)
    asyncio.run(main(requirement))

```

### 运行结果

1. `DataInterpreter` 提出的`task`如下:

```json
[
  {
    "task_id": "1",
    "dependent_task_ids": [],
    "instruction": "Calculate the total number of students playing basketball."
  },
  {
    "task_id": "2",
    "dependent_task_ids": ["1"],
    "instruction": "Determine the number of students on each team using the given ratios."
  },
  {
    "task_id": "3",
    "dependent_task_ids": ["1", "2"],
    "instruction": "Use the inclusion-exclusion principle to find the number of students playing on exactly two teams."
  }
]
```

由于有一半的学生参加篮球队，因此很容易计算出篮球队的总人数；然后根据数学队、篮球队和足球队的人数比例能够计算出数学队和足球队的总人数；最后根据容斥原理来得到答案。可以看出`DataInterpreter`规划的步骤非常合理且符合人类解数学题的思维。

2. `DataInterpreter` 写的代码如下:

```python
# ------------------------------task1------------------------------
total_students = 60
half_basketball = total_students / 2
half_basketball
# -------------------------------task2-----------------------------
basketball_team = 30
ratio_math_basketball_soccer = [4, 3, 2]

# Calculate the total ratio units
total_ratio_units = sum(ratio_math_basketball_soccer)

# Calculate the number of students per ratio unit
students_per_unit = basketball_team / ratio_math_basketball_soccer[1]

# Calculate the number of students on each team
math_team = students_per_unit * ratio_math_basketball_soccer[0]
soccer_team = students_per_unit * ratio_math_basketball_soccer[2]

(math_team, basketball_team, soccer_team)

# ------------------------------task3-------------------------------
# Given values from previous tasks
math_team = 40.0
basketball_team = 30
soccer_team = 20.0
students_all_three = 8

# Total number of students
total_students = 60

# Calculate the number of students playing in exactly two teams using the inclusion-exclusion principle
students_two_teams = (math_team + basketball_team + soccer_team) - total_students - (2 * students_all_three)
students_two_teams
```

`DataInterpreter`所生成的代码完全遵循规划好的`task`并且能成功运行，并最终计算出正确答案为：**14**
