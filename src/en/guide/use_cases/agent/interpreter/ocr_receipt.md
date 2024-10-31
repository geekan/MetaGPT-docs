# Receipt OCR

## Overview

OCR (Optical Character Recognition) is a technology that recognizes text within images to obtain structured text information. We will use `DataInterpreter` for OCR information extraction from various types of receipts.

## Example: Shopping Receipt Recognition

### Task

Use `DataInterpreter` to perform OCR recognition on the following receipt, extract and save the total amount.

<img src="../../../../../public/image/guide/use_cases/interpreter/receipt_shopping.png" width="200">

### Code

[examples/di/ocr_receipt.py](https://github.com/geekan/MetaGPT/blob/main/examples/di/ocr_receipt.py)

> Note: You need to install Paddle-related dependencies to run this example, execute
> `pip install metagpt[ocr]`

```bash
python examples/di/ocr_receipt.py
```

### Execution Results

`DataInterpreter` will save a csv file containing the total amount under current working directory.

<img src="../../../../../public/image/guide/use_cases/interpreter/receipt_shopping_ocr_result.png" width="200">

## Mechanism Explained

Use `DataInterpreter` to first generate a plan, then generate tool code based on paddle OCR, execute OCR processing to recognize text information in the image of the catering invoice, extract relevant data, and organize these data into a table file.
