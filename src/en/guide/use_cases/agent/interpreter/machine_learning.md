# Machine Learning Modeling

## Overview

Machine learning analyzes data through algorithms to perform classification and regression predictions, such as stock price forecasts, spam email classification, credit scoring, medical diagnosis, etc. We can use Interpreter to produce such algorithmic code, model data, and complete prediction tasks.

## Example: Wine Recognition

### Task

We use the [sklearn wine recognition dataset](https://scikit-learn.org/stable/datasets/toy_dataset.html#wine-dataset) as an example to illustrate how to use Interpreter for machine learning modeling. This is a classic multi-class dataset with several features such as color, chemical composition, etc., based on which the wine category of samples can be predicted. We require Interpreter to fetch the data, split the training and validation sets, train the model, and make predictions on the validation set.

### Code

```bash
python examples/mi/machine_learning.py
```

### Execution Results

<br>
<video  controls>
  <source src="/image/guide/use_cases/interpreter/ml_wine_dataset.mp4" type="video/mp4">
</video>

## Mechanism Explained

Interpreter plans according to our requirements, forms several tasks, and executes them in sequence to fulfill the needs. The complete code generated by Interpreter will be stored in the data/output path.

## Extension

For targeted processing of more complex machine learning tasks, please refer to [Machine Learning Engineer](../ml_engineer.md).