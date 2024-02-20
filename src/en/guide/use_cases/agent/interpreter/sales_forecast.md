# Tool Usage: Sales Forecast

## Overview

Store department sales forecasting is a method of predicting the sales of various departments within a store for a future period by analyzing historical sales data, market trends, seasonal variations, and other relevant factors. This predictive analysis helps stores formulate more effective strategies for inventory management, staff allocation, promotional activities, etc., aiming to optimize sales performance and increase profitability.

Here's how it helps people:

- **Optimized inventory management**: Forecasting helps stores avoid stockouts or overstock situations, ensuring adequate supply of goods to meet customer demand while reducing inventory costs.

- **Improved sales efficiency**: By predicting sales for each department, stores can better schedule staff and resources, ensuring sufficient manpower during peak demand periods to enhance sales efficiency and customer satisfaction.

- **Precision in promotional strategies**: Understanding which products or departments are likely to see sales growth or decline enables stores to tailor promotional activities accordingly, attracting more customers and boosting sales.

- **Performance evaluation**: Sales forecasting helps stores assess business performance and make timely adjustments to business strategies to achieve better results.

## Example: Using the Tool to make sales forecast

### Task

Use time series regression machine learning to make predictions for Dept sales of the stores as accurate as possible.

### Code

```bash
python examples/mi/sales_forecast.py
```

### Execution Results

<img src="../../../../../public/image/guide/use_cases/interpreter/sales_forecast.png">

## Mechanism Explained

This process utilizes the Pandas library in Python for data loading and merging, and employs custom utility functions FillMissingValue and OrdinalEncode to handle missing values and non-numeric features. The model adopts XGBRegressor from the XGBoost library for time series regression modeling. Model performance is evaluated through cross-validation, using the weighted mean absolute error (WMAE) as the evaluation metric.
