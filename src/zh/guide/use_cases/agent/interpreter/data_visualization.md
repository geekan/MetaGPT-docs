# 数据分析和可视化

## 概述

数据可视化是通过图表、图形和其他视觉元素将数据转化为可理解和易于分析的形式。它帮助我们发现数据中的模式、趋势和关联，以及提供洞察力和见解。通过数据可视化，我们可以更好地理解数据的含义，传达和解释数据的结果，并支持数据驱动的决策和沟通。

## 示例：Iris数据集可视化

### 任务

使用`DataInterpreter`对sklearn Iris数据集进行简单的数据分析并绘制可视化图表。

### 代码

```bash
python examples/di/data_visualization.py
```

[examples/di/data_visualization.py](https://github.com/geekan/MetaGPT/blob/main/examples/di/data_visualization.py) 文件中的代码具体为：

```python
import asyncio
from metagpt.logs import logger
from metagpt.roles.di.data_interpreter import DataInterpreter
from metagpt.utils.recovery_util import save_history

async def main(requirement: str = ""):

    di = DataInterpreter()
    rsp = await di.run(requirement)
    logger.info(rsp)
    save_history(role=di)


if __name__ == "__main__":

    requirement = "Run data analysis on sklearn Iris dataset, include a plot"
    asyncio.run(main(requirement))
```

执行上面的代码，生成的plan和code会分别保存在 `dada/output/当前时间/plan.json`和 `dada/output/当前时间/code.ipynb`中。

### 运行结果

1. `DataInterpreter` 提出的`task`如下:

```json
[
  {
    "task_id": "1",
    "dependent_task_ids": [],
    "instruction": "Load the Iris dataset from sklearn."
  },
  {
    "task_id": "2",
    "dependent_task_ids": ["1"],
    "instruction": "Perform exploratory data analysis on the Iris dataset."
  },
  {
    "task_id": "3",
    "dependent_task_ids": ["2"],
    "instruction": "Create a plot visualizing the Iris dataset features."
  }
]
```

`DataInterpreter` 能够把任务分解为合理的`tasks`, 并按照加载数据、分析数据和绘制图表的步骤运行。

2. `DataInterpreter`写的代码如下:

```python
# ----------------------------------task1------------------------------------
from sklearn.datasets import load_iris
iris_data = load_iris()
iris_data.keys()
!pip install scikit-learn
from sklearn.datasets import load_iris
iris_data = load_iris()
iris_data.keys()
# ----------------------------------task2------------------------------------
import pandas as pd

# Create a DataFrame from the iris dataset
iris_df = pd.DataFrame(iris_data['data'], columns=iris_data['feature_names'])
iris_df['species'] = pd.Categorical.from_codes(iris_data['target'], iris_data['target_names'])

# Summary statistics
summary_statistics = iris_df.describe()

# Check for missing values
missing_values = iris_df.isnull().sum()

(summary_statistics, missing_values)
# ----------------------------------task3------------------------------------
import matplotlib.pyplot as plt
import seaborn as sns

# Use seaborn's pairplot to visualize the dataset features
sns.set(style='whitegrid', context='notebook')
iris_pairplot = sns.pairplot(iris_df, hue='species', height=2.5)
plt.show()
```

在完成`task1`时，由于环境中没有安装`scikit-learn`导致第一次执行报错，但`DataInterpreter`可以分析并通过安装`scikit-learn`来解决这个问题。在`task3`中`DataInterpreter`使用`seaborn`的`pairplot`函数绘制一个散点图矩阵，用于可视化数据集中不同特征之间的关系，并通过颜色区分不同种类的数据点，最后使用`plt.show()`将图表显示出来。

下面是`DataInterpreter`运行代码绘制出的图，可以看出代码成功执行并绘制了精美的可视化图表，帮助我们更好地对数据集特征进行分析。

<div align=center>
<img src="../../../../../public/image/guide/use_cases/interpreter/output.png" width="1000" height="1000"> 
</div>
