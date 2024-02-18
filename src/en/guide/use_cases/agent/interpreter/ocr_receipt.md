# Receipt OCR

## Overview

OCR (Optical Character Recognition) is a technology that recognizes text within images to obtain structured text information. We will use Interpreter for OCR information extraction from various types of receipts.

## Example: Shopping Receipt Recognition

### Task

Use Interpreter to perform OCR recognition on the following receipt, extract and save the total amount and the receipt number.

<img src="../../../../../public/image/guide/use_cases/interpreter/receipt_shopping.png" width="200">

### Code

> Note: You need to install Paddle-related dependencies to run this example, execute
> `pip install metagpt[ocr]`

```bash
python examples/mi/ocr_receipt.py
```

### Execution Results

## Mechanism Explained

Use Interpreter to first generate a plan, then generate tool code based on paddle OCR, execute OCR processing to recognize text information in the image of the catering invoice, extract relevant data, and organize these data into a table file.
