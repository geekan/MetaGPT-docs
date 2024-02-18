# 机器学习建模

## 概览

机器学习通过算法分析数据，进行分类和回归预测，例如股价预测、垃圾邮件分类、信用评分、医疗诊断等。我们可使用Interpreter生产此类算法代码，对数据进行建模，完成预测任务。

## 示例：酒品分类

### 任务

我们以[sklearn的酒类识别数据集](https://scikit-learn.org/stable/datasets/toy_dataset.html#wine-dataset)为例说明如何使用Interpreter进行机器学习建模。这是一个经典的多分类数据集，数据集内有色泽、化学成分等的若干特征，可据此对样本的酒品类别进行预测。我们要求Interpreter获取数据，切分训练和验证集，训练模型，并在验证集上进行预测

### 代码

```bash
python examples/mi/machine_learning.py
```

### 运行结果

## 机制解释

Interpreter根据我们的需求做出计划，形成若干任务并依次执行，最终完成需求。Interpreter生成的完整代码将存储在data/output路径下

## 延伸

对更复杂机器学习任务的针对性处理，请参考[机器学习工程师](../ml_engineer.md)
