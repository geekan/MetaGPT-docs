# 解数学问题

## 概述

使用 `Interpreter` 解决数学问题，具体的数学问题随机选自MATH数据集的level5等级。

## 示例

### 任务

At a school, all 60 students play on at least one of three teams: Basketball, Soccer, and Mathletics. 8 students play all three sports, half the students play basketball, and the ratio of the size of the math team to the size of the basketball team to the size of the soccer team is $4:3:2$. How many students at the school play on exactly two teams?

### 代码

```bash
python examples/mi/solve_math_problems.py
```

### 运行结果

1. `Interpreter` 提出的`task`如下:

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

由于有一半的学生参加篮球队，因此很容易计算出篮球队的总人数；然后根据数学队、篮球队和足球队的人数比例能够计算出数学队和足球队的总人数；最后根据容斥原理来得到答案。可以看出`Interpreter`规划的步骤非常合理且符合人类解数学题的思维。

2. `Interpreter` 写的代码如下:

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

`Interpreter`所生成的代码完全遵循规划好的`task`并且能成功运行，并最终计算出正确答案为：**14**
