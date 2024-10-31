# Human Interaction

## Overview

The interpreter supports flexible natural language interaction. Users can change requirements, provide execution suggestions, and review results at multiple points. With human guidance, the interpreter can achieve higher success rates and better outcomes across various scenarios.

## Example: Machine Learning

### Task

We use the same [machine learning scenario](./machine_learning.md) as an example. Here, we demonstrate how to confirm and modify the interpreter's plan based on our needs and guide it to redo specific tasks.

### Code

[examples/di/machine_learning.py](https://github.com/geekan/MetaGPT/blob/main/examples/di/machine_learning.py)

```
python examples/di/machine_learning.py --auto_run False
```

### Execution Results

<br>
<video controls>
  <source src="/image/guide/use_cases/interpreter/human_interaction.mp4" type="video/mp4">
</video>

During the interaction, we make multiple requests through natural language, such as:

- When formulating the plan, we ask it to integrate and change tasks: “merge 4 and 5, also, change task 2, save the plot”
- During execution, we ask it to update subsequent tasks: “confirm, but change task 3 only, use 30% as validation set”
- During execution, we ask it to redo the current task: “redo, use a decision tree as the model instead”

The interpreter dynamically adjusts and executes to fulfill our requests.

## Mechanism Explained

To use the human interaction mode, set `auto_run=False` when initializing the interpreter. The interpreter will request human review after proposing each plan and completing each task in the plan. Combining keywords, users can inform the interpreter how to modify the proposed plan or written code using natural language. The interpreter supports plan status management, preserving progress on unaffected tasks when adding, modifying, or deleting tasks. Please refer to the following usage example.

### Example of an `DataInterpreter`-Generated Plan

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

### Interactables for Humans

| Interaction Type   | Required Keywords                               | Example                                               | Explanation                                                    |
| ------------------ | ----------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------- |
| Confirm            | One of ["confirm", "continue", "c", "yes", "y"] | confirm                                               | Confirm the current plan or task result and continue execution |
| Confirm and Update | confirm + any other content                     | confirm, and change task 3, use 30% as validation set | Confirm the current task result and modify subsequent tasks    |
| Redo               | redo                                            | redo, fix the error by using matplotlib               | Redo the current task, based on human guidance                 |
|                    |                                                 | redo, use decision tree as the model                  |                                                                |
| Update             | -                                               | add a task, save the plot                             | Update the plan based on human request                         |
|                    |                                                 | delete task 5                                         |                                                                |
|                    |                                                 | change task 4, use decision tree as the model         |                                                                |
|                    |                                                 | merge task 4 and 5                                    |                                                                |

The interpreter determines the type of interaction based on human feedback text, with priority: Confirm and Update > Confirm > Redo > Update.
