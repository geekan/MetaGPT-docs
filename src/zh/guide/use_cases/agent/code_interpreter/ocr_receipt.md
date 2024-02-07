# 票据OCR

## 概述

OCR，是一种识别图片中文字，得到结构化文本信息的技术手段。我们将使用CodeInterpreter进行各类票据的OCR信息抽取

## 示例：购物小票识别

### 任务

使用CodeInterpreter对如下的票据进行OCR识别，提取并保存总金额和票据号码

<img src="../../../../../public/image/guide/use_cases/code_interpreter/receipt_shopping.png" width="200">

### 代码

```
from metagpt.roles.ci.code_interpreter import CodeInterpreter


async def main():
    image_path = 'image.jpg'
    language = 'English'
    requirement = f"""This is a {language} invoice image.
    Your goal is to perform OCR on images using PaddleOCR, then extract the total amount from ocr text results, and finally save as table. Image path: {image_path}.
    NOTE: The environments for Paddle and PaddleOCR are all ready and has been fully installed."""
    ci = CodeInterpreter(goal=requirement)

    await ci.run(requirement)

if __name__ == '__main__':
    import asyncio
    asyncio.run(main())
```

### 运行结果

## 机制解释

使用CodeInterpreter先生成规划Plan，再生成基于paddle OCR的工具代码，执行OCR处理以识别餐饮发票图片中的文本信息，提取相关数据，并将这些数据整理成表格文件。
