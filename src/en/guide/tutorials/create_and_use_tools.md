# Create and Use Tools

Creating tools in MetaGPT is a straightforward process that involves creating your own functions or classes within the `metagpt/tools/libs` directory. This tutorial provides a step-by-step guide to creating tools and utilizing them within the `DataInterpreter`.

## Steps for creating tools

1. **Create Pre-provided Functions or Classes**:

   Craft functions or classes tailored to enable specific interactions with the external environment and place them in the `metagpt/tools/libs` directory.

2. **Employ Google Style Docstring:**

   Accompany each function or class with a Google-style Docstring. This serves as a concise yet comprehensive reference, detailing the purpose, input parameters, and expected output.

3. **Apply @register_tool Decorator:**

   Utilize the `@register_tool` decorator to ensure accurate registration within the tool registry. This decorator simplifies the integration of functions or classes with the `DataInterpreter`.

## Customizing tools case

To illustrate the process, consider the following examples of customizing tools from function and class.

### Customizing the calculate factorial tool from a function

1. **Create and place your own function in `metagpt/tools/libs`, supposing it is `calculate_factorial.py`, and add the decorator @register_tool for it to register as a tool.**

   ```python
   # metagpt/tools/libs/calculate_factorial.py
   import math
   from metagpt.tools.tool_registry import register_tool

   # Register tool with the decorator
   @register_tool()
   def calculate_factorial(n):
       """
       Calculate the factorial of a non-negative integer.
       """
       if n < 0:
           raise ValueError("Input must be a non-negative integer")
       return math.factorial(n)
   ```

2. **Use DataInterpreter with your custom tool, supposing in the `main.py` file.**

   ```python
   # main.py
   import asyncio
   from metagpt.roles.di.data_interpreter import DataInterpreter
   from metagpt.tools.libs import calculate_factorial

   async def main(requirement: str):
      role = DataInterpreter(tools=["calculate_factorial"])    # integrate the tool
      await role.run(requirement)

   if __name__ == "__main__":
      requirement = "Please calculate the factorial of 5."
      asyncio.run(main(requirement))
   ```

**Note**:

1. Don't forget to write the docstring for your function that will help to select the tool and understand how it works for the `DataInterpreter`.
2. The tool name is the function name when registering the tool.
3. Remember to import your `calculate_factorial` from `metagpt.tools.libs` to make sure the tool is registered before running DataInterpreter

### Customizing the calculator tool from a class

1.  **Create and place your own class in `metagpt/tools/libs`, supposing it is `calculator.py`, and add the decorator @register_tool for it to register as a tool.**

    ```python
    # metagpt/tools/libs/calculator.py
    import math
    from metagpt.tools.tool_registry import register_tool

    # Register tool with the decorator.
    # The tag "math" is used to categorize the tool and the include_functions list specifies the functions to include, which makes `DataInterpreter` select and understand the tool.
    @register_tool(tags=["math"], include_functions=["__init__", "add", "subtract", "multiply", "divide", "factorial"])
    class Calculator:
       """
       A simple calculator tool that performs basic arithmetic operations and calculates factorials.
       """

       @staticmethod
       def add(a, b):
           """
           Calculate the sum of two numbers.
           """
           return a + b

       @staticmethod
       def subtract(a, b):
           """
           Calculate the difference of two numbers.
           """
           return a - b

       @staticmethod
       def multiply(a, b):
           """
           Calculate the product of two numbers.
           """
           return a * b

       @staticmethod
       def divide(a, b):
           """
           Calculate the quotient of two numbers.
           """
           if b == 0:
               return "Error: Division by zero"
           else:
               return a / b

       @staticmethod
       def factorial(n):
           """
           Calculate the factorial of a non-negative integer.
           """
           if n < 0:
               raise ValueError("Input must be a non-negative integer")
           return math.factorial(n)
    ```

2.  **Use DataInterpreter with your custom tool, supposing in the `main.py` file.**

    ```python
    # main.py
    import asyncio
    from metagpt.roles.di.data_interpreter import DataInterpreter
    from metagpt.tools.libs import calculator

    async def main(requirement: str):
        role = DataInterpreter(tools=["Calculator"]) # integrate the tool
        await role.run(requirement)

    if __name__ == "__main__":
        requirement = "Please calculate 5 plus 3 and then calculate the factorial of 5."
        asyncio.run(main(requirement))
    ```

**Note**:

1. Don't forget to write the docstring for your class and its functions that will help to select the tool and understand how it works for the `DataInterpreter`.
2. The tool name is the class name when registering the tool.
3. Remember to import your `calculator` from `metagpt.tools.libs` to make sure the tool is registered before running DataInterpreter

By following these steps, users can seamlessly create and integrate tools within the `Tool` framework of MetaGPT. This empowers the `DataInterpreter` to effectively interact with the external environment.
