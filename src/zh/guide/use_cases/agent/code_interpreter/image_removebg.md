# 图像去背景

## 概述
Image background removal is a technique used to separate the main objects from the background in an image. It finds applications in various fields such as image editing, person segmentation, product showcasing, and computer vision. By removing the background, it highlights the subject, enhances the visual appeal of the image, and provides a cleaner base for further processing and analysis.
## 例子 : 
### 任务
Use `codeInterpreter` to remove background from a picture of a dog.
### 代码
```python
import asyncio
from metagpt.roles.code_interpreter import CodeInterpreter

async def main(requirement: str = ""):
    code_interpreter = CodeInterpreter(use_tools=False, goal=requirement)
    await code_interpreter.run(requirement)

if __name__ == "__main__":
    image_path = '/data/luxiangtao/data_agents_opt-code_intepreter/dog.JPEG'    
    save_path = '/data/luxiangtao/data_agents_opt-code_intepreter/dog_rmg.png'
    requirement = (
        f"This is a image, you need to use python toolkit rembg to remove the background of the image and save the result. image path:{image_path}; save path:{save_path}."
    )
    asyncio.run(main(requirement))
```
### 运行过程
`CodeInterpreter` proposes the following solution steps:
```json
[
    {
        "task_id": "1",
        "dependent_task_ids": [],
        "instruction": "Install the rembg package using pip."
    },
    {
        "task_id": "2",
        "dependent_task_ids": ["1"],
        "instruction": "Use the rembg package to remove the background from the image at the specified path."
    },
    {
        "task_id": "3",
        "dependent_task_ids": ["2"],
        "instruction": "Save the image with the background removed to the specified save path."
    }
]
```
`CodeInterpreter`能够根据问题划分为合理的task，这里可以看到第一步便是安装rembg这个python库

`CodeInterpreter` writes the following code:
```python
# -----------------------------task1-------------------------------
!pip install rembg 
# -----------------------------task2-------------------------------
from rembg import remove
input_path = '/data/luxiangtao/data_agents_opt-code_intepreter/beauty.JPEG'
output_path = '/data/luxiangtao/data_agents_opt-code_intepreter/beauty_rmg.png'

# Read the input image
with open(input_path, 'rb') as i:
    input_image = i.read()

# Remove the background
output_image = remove(input_image)

# ------------------------------task3-------------------------------
# Write the output image
with open(output_path, 'wb') as o:
    o.write(output_image)
```
rembg是一个实现自动图像去背景的开源python工具包，且可以在CPU上运行。当我们在requirement中提示使用这个工具包时，`CodeInterpreter`能够自动安装这个工具包并正确使用(这很可能是因为LLM在训练时学会了'rembg'这个Python库的使用方法)
### 运行结果
这是一张有狗的输入图片以及去除了背景的狗的图片。可以看到背景去除的效果非常好，`CodeInterpreter`可以顺利完成这个问题。
<div align=center>
<img src="../../../../../public/image/guide/use_cases/CodeInterpreter/dog.JPEG" width="500" height="300"> 
<img src="../../../../../public/image/guide/use_cases/CodeInterpreter/dog_rmg.png" width="500" height="300"> 
</div>
