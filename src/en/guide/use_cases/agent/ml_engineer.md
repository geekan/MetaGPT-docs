# Machine Learning Engineer: Analyze, Visualize, and Model Datasets

## Batch Use of Tools

### Task

Use `MLEngineer` to model and predict the [ICR](https://www.kaggle.com/competitions/icr-identify-age-related-conditions/data) dataset, and batch invoke tools during the data preprocessing and feature engineering stages (multiple tools of types data_preprocess and feature_engineering have already been created).

### Code

```bash
python examples/mi/ml_engineer_with_tools.py
```

### Execution Result

The data preprocessing code (which includes the use of 3 tools: `FillMissingValue`, `MinMaxScale`, and `LabelEncode`) is as follows:

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

The feature engineering code (which includes the use of 2 tools: `PolynomialExpansion` and `CatCount`) is as follows:

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

## Mechanism Explanation

### Tool Creation

In the `metagpt.tools.libs` directory, we have predefined two types of tools: `data_preprocess` and `feature_engineering`. Below, taking data_preprocess tasks as an example, we provide a complete guide for creating a simple tool, including how to define and register the tool.

- First, create a file named `data_preprocess.py` in the `metagpt.tools.libs` directory.
- In this file, you will define your data preprocessing tool and complete the registration of the tool using the `@register_tool` decorator. By setting the `tool_type` parameter, you can explicitly specify the category of the tool.

**Code Example**:

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

In the example above, the `FillMissingValue` class implements the functionality for filling missing values and is registered as a data_preprocess tool using the `@register_tool` decorator.

After registering the tool, the system will automatically create a corresponding subdirectory in the `metagpt.tools.schemas` directory for your tool type (in this case, `data_preprocess`).

In this subdirectory, the system will generate a schema file for each tool (such as `FillMissingValue.yml`), detailing the structure, methods, and parameter types of the tool class, ensuring that the LLM can accurately understand and utilize the tool.

Additionally, saving such schema files also facilitates users in verifying their correctness and completeness.

**Schema File Example**:

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

### Automatic Tool Registration and Task Allocation

When `MLEngineer` starts, it automatically registers all tools in the `metagpt.tools.libs` directory. Concurrently, during the task planning phase, `MLEngineer` allocates appropriate task types for each task based on requirements, facilitating the match with tool types.

### Dynamic Tool Retrieval

During the task execution phase, if there are tools in the registry that match the task type, `MLEngineer` automatically retrieves all available tools of that type from the registry.

### Tool Selection and Combination

Once the available tools are identified, `MLEngineer` automatically selects and combines these tools based on the task requirements, forming a code solution tailored to the specific task.
