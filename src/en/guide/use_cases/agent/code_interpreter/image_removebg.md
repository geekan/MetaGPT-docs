# Remove The Background of Image

## Overview
Image background removal is a technique used to separate the main objects from the background in an image. It finds applications in various fields such as image editing, person segmentation, product showcasing, and computer vision. By removing the background, it highlights the subject, enhances the visual appeal of the image, and provides a cleaner base for further processing and analysis.
## Example : 
### Task
Use `codeInterpreter` to remove background from a picture of a dog.
### Code
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
### Execution process
1. `CodeInterpreter` proposes the following solution steps:
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
`CodeInterpreter` is able to divide the problem into logical tasks, and here we can see that the first step is to install the Python library "rembg".

2. `CodeInterpreter` writes the following code:
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
rembg is an open-source Python toolkit that enables automatic image background removal and can run on CPU. When we mention the use of this toolkit in the requirements, `CodeInterpreter` is capable of automatically installing and correctly utilizing this toolkit.(This is likely because LLM learned the usage of the "rembg" Python library during its training)
### Output
Here is the input image of a dog and the image of the dog with the background removed. It can be seen that the background removal effect is excellent, and `CodeInterpreter` can smoothly accomplish this problem.
<div align=center>
<img src="../../../../../public/image/guide/use_cases/CodeInterpreter/dog.JPEG" width="500" height="300"> 
<img src="../../../../../public/image/guide/use_cases/CodeInterpreter/dog_rmg.png" width="500" height="300"> 
</div>

