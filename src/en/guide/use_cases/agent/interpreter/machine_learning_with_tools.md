# Machine Learning with Tools

## Batch Use of Tools

### Task

Use `DataInterpreter` to model and predict the [titanic](https://www.kaggle.com/competitions/titanic/data) dataset, and batch invoke tools during the data preprocessing and feature engineering stages (multiple tools of types data_preprocess and feature_engineering have already been created, located in the `metagpt/tools/libs` directory)).

### Code

[examples/di/machine_learning_with_tools.py](https://github.com/geekan/MetaGPT/blob/main/examples/di/machine_learning_with_tools.py)

```bash
python examples/di/machine_learning_with_tools.py
```

### Execution Results

The data preprocessing code (which includes the use of 3 tools: `FillMissingValue`, `StandardScale`, and `OneHotEncode`) is as follows:

```python
from metagpt.tools.libs.data_preprocess import FillMissingValue, StandardScale, OneHotEncode

fill_age = FillMissingValue(features=['Age'], strategy='median')
fill_embarked = FillMissingValue(features=['Embarked'], strategy='most_frequent')

train_data = fill_age.fit_transform(train_data)
train_data = fill_embarked.fit_transform(train_data)

if 'Cabin' in train_data.columns:
    train_data.drop('Cabin', axis=1, inplace=True)

numerical_features = ['Age', 'SibSp', 'Parch', 'Fare']

scale = StandardScale(features=numerical_features)
scaled_features = scale.fit_transform(train_data)

for feature in numerical_features:
    train_data[feature] = scaled_features[feature]

categorical_features = ['Sex', 'Embarked']
one_hot = OneHotEncode(features=categorical_features)
train_data = one_hot.fit_transform(train_data)

non_informative_columns = ['PassengerId', 'Name', 'Ticket']
train_data.drop(columns=non_informative_columns, axis=1, inplace=True, errors='ignore')
train_data.head()
```

The feature engineering code (which includes the use of 1 tool: `PolynomialExpansion`) is as follows:

```python
from metagpt.tools.libs.feature_engineering import PolynomialExpansion
numeric_features = ['Pclass', 'Age', 'SibSp', 'Parch', 'Fare']
poly_expansion = PolynomialExpansion(cols=numeric_features, label_col='Survived')
train_data = poly_expansion.fit_transform(train_data)
train_data.head()
```

## Mechanism

### Tool Creation

In the `metagpt.tools.libs` directory, we have predefined two types of tools: `data_preprocess` and `feature_engineering`. Below, taking data_preprocess tasks as an example, we provide a complete guide for creating a simple tool, including how to define and register the tool.

- First, create a file named `data_preprocess.py` in the `metagpt.tools.libs` directory.
- In this file, you will define your data preprocessing tool and complete the registration of the tool using the `@register_tool` decorator. Additionally, you can specify the category of the tool by setting the `tags` parameter.

**Code Example**:

```python
from typing import Literal

import pandas as pd
from sklearn.impute import SimpleImputer

from metagpt.tools.tool_registry import register_tool


TAGS = ["data preprocessing", "machine learning"]

@register_tool(tags=TAGS)
class FillMissingValue:
    """
    Completing missing values with simple strategies.
    """

    def __init__(
        self, features: list, strategy: Literal["mean", "median", "most_frequent", "constant"] = "mean", fill_value=None
    ):
        """
        Initialize self.

        Args:
            features (list): Columns to be processed.
            strategy (Literal["mean", "median", "most_frequent", "constant"], optional): The imputation strategy, notice 'mean' and 'median' can only
                                      be used for numeric features. Defaults to 'mean'.
            fill_value (int, optional): Fill_value is used to replace all occurrences of missing_values.
                                        Defaults to None.
        """
        self.features = features
        self.strategy = strategy
        self.fill_value = fill_value
        self.si = None

    def fit(self, df: pd.DataFrame):
        """
        Fit the FillMissingValue model.

        Args:
            df (pd.DataFrame): The input DataFrame.
        """
        if len(self.features) == 0:
            return
        self.si = SimpleImputer(strategy=self.strategy, fill_value=self.fill_value)
        self.si.fit(df[self.features])

    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Transform the input DataFrame with the fitted model.

        Args:
            df (pd.DataFrame): The input DataFrame.

        Returns:
            pd.DataFrame: The transformed DataFrame.
        """
        if len(self.features) == 0:
            return df
        new_df = df.copy()
        new_df[self.features] = self.si.transform(new_df[self.features])
        return new_df

    def fit_transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Fit and transform the input DataFrame.

        Args:
            df (pd.DataFrame): The input DataFrame.

        Returns:
            pd.DataFrame: The transformed DataFrame.
        """
        self.fit(df)
        return self.transform(df)
```

In the example above, the `FillMissingValue` class implements the functionality for filling missing values and is registered as a data_preprocess tool using the `@register_tool` decorator.

After registering the tool, the system will automatically generate a corresponding schema file (such as FillMissingValue.yml) for each tool in `metagpt.tools.schemas` based on the comments of the tool functions, detailing the structure, methods, and parameter types of the tool class, ensuring that the LLM can accurately understand and utilize the tool.

**Schema File Example (FillMissingValue.yml)**:

```yaml
type: class
description: Completing missing values with simple strategies.
methods:
  __init__:
    type: function
    description: 'Initialize self. '
    signature:
      '(self, features: ''list'', strategy: "Literal[''mean'', ''median'',
      ''most_frequent'', ''constant'']" = ''mean'', fill_value=None)'
    parameters:
      'Args: features (list): Columns to be processed. strategy (Literal["mean",
      "median", "most_frequent", "constant"], optional): The imputation strategy,
      notice ''mean'' and ''median'' can only be used for numeric features. Defaults
      to ''mean''. fill_value (int, optional): Fill_value is used to replace all occurrences
      of missing_values. Defaults to None.'
  fit:
    type: function
    description: 'Fit a model to be used in subsequent transform. '
    signature: "(self, df: 'pd.DataFrame')"
    parameters: 'Args: df (pd.DataFrame): The input DataFrame.'
  fit_transform:
    type: function
    description: 'Fit and transform the input DataFrame. '
    signature: "(self, df: 'pd.DataFrame') -> 'pd.DataFrame'"
    parameters:
      'Args: df (pd.DataFrame): The input DataFrame. Returns: pd.DataFrame:
      The transformed DataFrame.'
  transform:
    type: function
    description: 'Transform the input DataFrame with the fitted model. '
    signature: "(self, df: 'pd.DataFrame') -> 'pd.DataFrame'"
    parameters:
      'Args: df (pd.DataFrame): The input DataFrame. Returns: pd.DataFrame:
      The transformed DataFrame.'
```

### Automatic Tool Registration and Selection

By setting the `tools` parameter of `DataInterpreter`, you can manually specify which tools to use. If you want to use all tools, you can set `tools=["<all>"]`.

When `DataInterpreter` starts, it will automatically register all the tools in the `tools` list. At the same time, during the task planning stage, `DataInterpreter` will recommend available tools for each task based on the requirements, and select the TOP-k for LLM to use.

### Tool Combination and Invocation

During task execution, once the available TOP tools are identified, `DataInterpreter` will automatically combine and call these tools as needed according to the task requirements to form a code solution for a specific task.
