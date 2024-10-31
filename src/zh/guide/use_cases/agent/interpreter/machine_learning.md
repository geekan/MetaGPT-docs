# 机器学习建模

## 概览

机器学习通过算法分析数据，进行分类和回归预测，例如股价预测、垃圾邮件分类、信用评分、医疗诊断等。我们可使用`DataInterpreter`生产此类算法代码，对数据进行建模，完成预测任务。

## 示例：酒品分类

### 任务

我们以[sklearn的酒类识别数据集](https://scikit-learn.org/stable/datasets/toy_dataset.html#wine-dataset)为例说明如何使用`DataInterpreter`进行机器学习建模。这是一个经典的多分类数据集，数据集内有色泽、化学成分等的若干特征，可据此对样本的酒品类别进行预测。我们要求`DataInterpreter`获取数据，切分训练和验证集，训练模型，并在验证集上进行预测

### 代码

[examples/di/machine_learning.py](https://github.com/geekan/MetaGPT/blob/main/examples/di/machine_learning.py)

```bash
python examples/di/machine_learning.py
```

### 运行结果

<br>
<video  controls>
  <source src="/image/guide/use_cases/interpreter/ml_wine_dataset.mp4" type="video/mp4">
</video>

## 示例: 销售额预测

### 任务

我们以[沃尔玛销售额预测数据集](https://www.kaggle.com/datasets/aslanahmedov/walmart-sales-forecast/data)为例说明如何使用`DataInterpreter`进行销售额预测建模。数据集内有train.csv、test.csv、feature.csv、store.csv共计四张表，我们要求`DataInterpreter`获取数据，拼接数据，切分训练和验证集，训练模型，并在测试集上进行预测。

### 代码

```bash
python examples/di/machine_learning.py --use_case sales_forecast
```

### 运行结果

<center>
<img src="../../../../../public/image/guide/use_cases/interpreter/sales_forecast/split_data.png" width=400>
</center>

<center>
<img src="../../../../../public/image/guide/use_cases/interpreter/sales_forecast/total_weekly_sales_over_time.png" width=400>
</center>

<center>
<img src="../../../../../public/image/guide/use_cases/interpreter/sales_forecast/ground_truth_vs_predictions.png" width=400>
</center>

<center>
<img src="../../../../../public/image/guide/use_cases/interpreter/sales_forecast/wmae.png" width=400 >
</center>

## 机制解释

`DataInterpreter`根据我们的需求做出计划，形成若干任务并依次执行，最终完成需求。`DataInterpreter`生成的完整代码将存储在data/output路径下

## 延伸

对更复杂机器学习任务的针对性处理，请参考[使用工具进行机器学习建模](./machine_learning_with_tools.md)
