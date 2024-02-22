# Create and Utilize Tools

Creating tools in MetaGPT is a straightforward process that involves creating your own functions or classes within the `metagpt/tools/libs` directory and updating the tool registry in `metagpt/tools/tool_type.py`. This tutorial provides a step-by-step guide to creating tools and utilizing them within the `Interpreter`(Agent in MetaGPT).

## Steps for creating tools

1. **Create Pre-provided Functions or Classes:**

   - Craft functions or classes tailored to enable specific interactions with the external environment. Place them in the `metagpt/tools/libs` directory.

2. **Employ Google Style Docstring:**

   - Accompany each function or class with a Google-style Docstring. This serves as a concise yet comprehensive reference, detailing the purpose, input parameters, and expected output.

3. **Apply @register_tool Decorator:**
   - Utilize the `@register_tool` decorator to ensure accurate registration within the tool registry. This decorator simplifies the integration of functions or classes with the `Interpreter`.

## Customizing tools case

To illustrate the process, consider the following example of customizing a tool named "addition."

### Customizing the Addition Tool

1. **Create the addition method in `metagpt/tools/libs/addition.py`:**

   ```python
   # metagpt/tools/libs/addition.py

   from metagpt.tools.tool_registry import register_tool
   from metagpt.tools.tool_type import ToolType

   @register_tool(tool_type=ToolType.MATH.type_name)
   def addition(number1: float, number2: float) -> float:
       """
       Method for adding two numbers.
       Args:
           number1 (float): The first number to add.
           number2 (float): The second number to add.
       Returns:
           float: The sum of number1 and number2.
       """
       return number1 + number2
   ```

2. **Update `metagpt/tools/libs/__init__.py`:**

   ```python
   # metagpt/tools/libs/__init__.py

   from metagpt.tools.libs import addition

   _ = addition
   ```

3. **Update `metagpt/tools/tool_type.py`:**

   ```python
   # metagpt/tools/tool_type.py

   from metagpt.tools.tool_registry import ToolTypeDef

   MATH = ToolTypeDef(
       name="addition",
       desc="For calculating the sum of two numbers",
   )
   ```

4. **Utilize the Tool in the Interpreter:**

   ```python
   from metagpt.roles.ci.code_interpreter import CodeInterpreter

   async def main():
       prompt = "Please calculate the sum of 3 and 11 using tool."
       ci = CodeInterpreter(goal=prompt, use_tools=True)

       await ci.run(prompt)

   if __name__ == "__main__":
       import asyncio

       asyncio.run(main())
   ```

By following these steps, users can seamlessly create and integrate tools within the `Tool` framework of MetaGPT. This empowers the `Interpreter` to effectively interact with the external environment.
