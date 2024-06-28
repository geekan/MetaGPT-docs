# 创建和使用工具

在 MetaGPT 中创建工具是一个直接的过程，涉及创建自己的函数或类，并将它们放在 `metagpt/tools/libs` 目录下。本教程提供了一个如何创建工具并在数据解释器`DataInterpreter`中使用它们的逐步指南。

## 创建工具的步骤

1. **创建预提供的函数或类**:

   编写专门用于与外部环境进行特定交互的函数或类，并将它们放置在`metagpt/tools/libs`目录中。

2. **使用谷歌风格的文档字符串（Docstring）**:

   为每个函数或类配备谷歌风格的文档字符串。这作为一个简洁而全面的参考资料，详细说明其用途、输入参数和预期输出。

3. **应用@register_tool装饰器**:

   使用`@register_tool`装饰器以确保在工具注册表中准确注册。这个装饰器简化了函数或类与`DataInterpreter`的集成。

## 自定义工具案例

为了说明这个过程，请阅读下列从函数和类中自定义工具的示例。

### 自定义计算阶乘的工具

1.  **在 `metagpt/tools/libs` 中创建一个你自己的函数，假设它是 `calculate_factorial.py`，并添加装饰器 `@register_tool` 以将其注册为工具**

    ```python
    # metagpt/tools/libs/calculate_factorial.py
    import math
    from metagpt.tools.tool_registry import register_tool

    # 使用装饰器注册工具
    @register_tool()
    def calculate_factorial(n):
        """
        计算非负整数的阶乘
        """
        if n < 0:
            raise ValueError("输入必须是非负整数")
        return math.factorial(n)
    ```

2.  **在数据解释器`DataInterpreter`中使用工具**

    ```python
    # main.py
    import asyncio
    from metagpt.roles.di.data_interpreter import DataInterpreter
    from metagpt.tools.libs import calculate_factorial

    async def main(requirement: str):
        role = DataInterpreter(tools=["calculate_factorial"]) # 集成工具
        await role.run(requirement)

    if __name__ == "__main__":
        requirement = "请计算 5 的阶乘"
        asyncio.run(main(requirement))
    ```

**注意**：

1. 别忘了为你的函数编写文档字符串（docstring），这将有助于 `DataInterpreter` 选择合适的工具并理解其工作方式。
2. 在注册工具时，工具的名称就是函数的名称。
3. 在运行 DataInterpreter 之前，记得从 `metagpt.tools.libs` 导入你的 `calculate_factorial` 模块，以确保该工具已被注册。

### 自定义计算器工具

1. **在 `metagpt/tools/libs` 中创建一个你自己的类，假设它是 `calculator.py`，并添加装饰器 `@register_tool` 以将其注册为工具**

   ```python
   # metagpt/tools/libs/calculator.py
   import math
   from metagpt.tools.tool_registry import register_tool

   # 使用装饰器注册工具
   # “math”的tag用于将工具分类为数学工具，include_functions 参数用于指定要包含的函数。这有利于`DataInterpreter`选择并理解工具
   @register_tool(tags=["math"], include_functions=["__init__", "add", "subtract", "multiply", "divide", "factorial"])
   class Calculator:
      """
      一个简单的计算器工具，可以执行基本的算术运算并计算阶乘。
      """

      @staticmethod
      def add(a, b):
          """
          计算两个数的和。
          """
          return a + b

      @staticmethod
      def subtract(a, b):
          """
          计算两个数的差。
          """
          return a - b

      @staticmethod
      def multiply(a, b):
          """
          计算两个数的乘积。
          """
          return a * b

      @staticmethod
      def divide(a, b):
          """
          计算两个数的商。
          """
          if b == 0:
              return "错误：除数不能为零"
          else:
              return a / b

      @staticmethod
      def factorial(n):
          """
          计算非负整数的阶乘。
          """
          if n < 0:
              raise ValueError("输入必须是非负整数")
          return math.factorial(n)
   ```

2. **在数据解释器`DataInterpreter`中使用工具**

   ```python
   # main.py
   import asyncio
   from metagpt.roles.di.data_interpreter import DataInterpreter
   from metagpt.tools.libs import calculator

   async def main(requirement: str):
      role = DataInterpreter(tools=["Calculator"])   # 集成工具
      await role.run(requirement)

   if __name__ == "__main__":
      requirement = "请计算 3 和 11 的和，然后计算 5 的阶乘"
      asyncio.run(main(requirement))
   ```

**注意**：

1. 别忘了为你的类和函数编写文档字符串（docstring），这将有助于 `DataInterpreter` 选择合适的工具并理解其工作方式。
2. 在注册工具时，工具的名称就是类的名称。
3. 在运行 DataInterpreter 之前，记得从 `metagpt.tools.libs` 导入你的 `calculator` 模块，以确保该工具已被注册。

通过遵循这些步骤，用户可以无缝地创建并整合MetaGPT中`Tools`框架内的工具，使`DataInterpreter`能够有效地与外部环境交互。
