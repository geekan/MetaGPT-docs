# 机器学习工程师：分析、可视化数据集和建模

## 工具批量使用

### 任务

使用 `MLEngineer` 对 [ICR](https://www.kaggle.com/competitions/icr-identify-age-related-conditions/data) 数据集进行建模预测，并在数据预处理和特征工程阶段批量调用工具（已经预先创建了多个 data_preprocess 和 feature_engineering 类型的工具）。

### 代码

```bash
python examples/mi/ml_engineer_with_tools.py
```

### 运行结果

数据预处理代码（其中包含 3 个工具的使用：`FillMissingValue`、`MinMaxScale` 和 `LabelEncode`）如下：

```python
# Load the evaluation dataset
import pandas as pd

eval_data_path = '/data/icr-identify-age-related-conditions/split_eval.csv'
eval_data = pd.read_csv(eval_data_path)

# Make a copy of the datasets
copy_train_data = train_data.copy()
copy_eval_data = eval_data.copy()

# Fill missing values for numeric columns
numeric_features = copy_train_data.select_dtypes(include=[np.number]).columns.tolist()
fill_missing_numeric = FillMissingValue(features=numeric_features, strategy='mean')
fill_missing_numeric.fit(copy_train_data)
copy_train_data = fill_missing_numeric.transform(copy_train_data)
copy_eval_data = fill_missing_numeric.transform(copy_eval_data)

# Fill missing values for categorical columns
categorical_features = ['EJ']
fill_missing_categorical = FillMissingValue(features=categorical_features, strategy='most_frequent')
fill_missing_categorical.fit(copy_train_data)
copy_train_data = fill_missing_categorical.transform(copy_train_data)
copy_eval_data = fill_missing_categorical.transform(copy_eval_data)

# Scale numerical features
from metagpt.tools.libs.data_preprocess import MinMaxScale

# Exclude the target column 'Class' from scaling
scaling_features = [feature for feature in numeric_features if feature != 'Class']
minmax_scale = MinMaxScale(features=scaling_features)
minmax_scale.fit(copy_train_data)
copy_train_data = minmax_scale.transform(copy_train_data)
copy_eval_data = minmax_scale.transform(copy_eval_data)

# Encode categorical variables
from metagpt.tools.libs.data_preprocess import LabelEncode

# Apply label encoding to the categorical feature 'EJ'
label_encode = LabelEncode(features=categorical_features)
label_encode.fit(copy_train_data)
copy_train_data = label_encode.transform(copy_train_data)
copy_eval_data = label_encode.transform(copy_eval_data)
```

特征工程代码（其中包含 2 个工具的使用：`PolynomialExpansion` 和 `CatCount`）如下：

```python
# Step 1: Add polynomial and interaction features
from metagpt.tools.libs.feature_engineering import PolynomialExpansion

# List of numeric columns for polynomial expansion, excluding the 'Id' and 'Class' columns
numeric_features_for_poly = [col for col in numeric_features if col not in ['Id', 'Class']]
polynomial_expansion = PolynomialExpansion(cols=numeric_features_for_poly, label_col='Class')
polynomial_expansion.fit(copy_train_data)
copy_train_data = polynomial_expansion.transform(copy_train_data)
copy_eval_data = polynomial_expansion.transform(copy_eval_data)

# Step 2: Add value counts of a categorical column as new feature
# Since 'EJ' is the only categorical feature, we will use it for CatCount
from metagpt.tools.libs.feature_engineering import CatCount
cat_count = CatCount(col='EJ')
cat_count.fit(copy_train_data)
copy_train_data = cat_count.transform(copy_train_data)
copy_eval_data = cat_count.transform(copy_eval_data)
```

## 机制解释

### 工具创建

在 `metagpt.tools.libs` 目录下，我们预先定义了两类工具：数据预处理（`data_preprocess`）和特征工程（`feature_engineering`）。下面以数据预处理任务为例，给出一个简单工具的完整创建指引，包括工具的定义和注册方法。

- 首先，在 `metagpt.tools.libs` 目录下创建文件 `data_preprocess.py`。
- 在该文件中，您将定义您的数据预处理工具，并利用 `@register_tool` 装饰器完成工具的注册。通过设置 `tool_type` 参数，明确指定工具的类别。

**代码示例**：

```python
import pandas as pd
from sklearn.impute import SimpleImputer

from metagpt.tools.tool_registry import register_tool


@register_tool(tool_type="data_preprocess")
class FillMissingValue:
    """
    Completing missing values with simple strategies.
    """

    def __init__(self, features: list, strategy: str = "mean", fill_value=None):
        """
        Initialize self.

        Args:
            features (list): Columns to be processed.
            strategy (str, optional): The imputation strategy, notice 'mean' and 'median' can only
                                      be used for numeric features. Enum: ['mean', 'median', 'most_frequent', 'constant']. Defaults to 'mean'.
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

在上述示例中，`FillMissingValue` 类具体实现了缺失值的填充功能，并通过 `@register_tool` 装饰器注册为数据预处理工具。

注册工具后，系统将自动在 `metagpt.tools.schemas` 目录下为您的工具类型（此例中为 `data_preprocess`）创建相应的子目录。

在该子目录中，系统会为每个工具生成相应的 schema 文件（如 `FillMissingValue.yml`），详细描述工具类的结构、方法以及参数类型，确保LLM能够准确理解并使用该工具。

同时，通过保存这样的 schema 文件，也便于用户验证其正确性和完整性。

**Schema 文件示例**：

```yaml
FillMissingValue:
  type: class
  description: 'Completing missing values with simple strategies'
  methods:
    __init__:
      description: 'Initialize self.'
      parameters:
        properties:
          features:
            type: list
            description: 'columns to be processed'
          strategy:
            type: str
            description: 'the imputation strategy, notice mean/median can only be used for numeric features'
            default: mean
            enum:
              - mean
              - median
              - most_frequent
              - constant
          fill_value:
            type: int
            description: 'fill_value is used to replace all occurrences of missing_values'
            default: null
        required:
          - features
    fit:
      description: 'Fit the FillMissingValue model.'
      parameters:
        properties:
          df:
            type: DataFrame
            description: 'The input DataFrame.'
        required:
          - df
    transform:
      description: 'Transform the input DataFrame with the fitted model.'
      parameters:
        properties:
          df:
            type: DataFrame
            description: 'The input DataFrame.'
        required:
          - df
      returns:
        df:
          type: DataFrame
          description: 'The transformed DataFrame.'
    fit_transform:
      description: 'Fit and transform the input DataFrame.'
      parameters:
        properties:
          df:
            type: DataFrame
            description: 'The input DataFrame.'
        required:
          - df
      returns:
        df:
          type: DataFrame
          description: 'The transformed DataFrame.'
```

### 自动工具注册与任务分配

当 `MLEngineer` 启动时，它会自动注册 `metagpt.tools.libs` 目录下的所有工具。同时，在任务规划阶段，`MLEngineer` 会根据需求为每个任务分配适当的任务类型，便于与工具类型匹配。

### 动态工具提取

在任务执行阶段，如果注册器中存在与任务类型相匹配的工具，`MLEngineer` 会自动从注册器中提取该类型的所有可用工具。

### 工具选择与组合

一旦可用工具被识别，`MLEngineer` 会根据任务需求自动选择和组合这些工具，以形成针对特定任务的代码解决方案。
