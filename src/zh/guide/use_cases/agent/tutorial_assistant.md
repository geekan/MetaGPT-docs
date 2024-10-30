# 教程助手：生成技术类教程

## 角色介绍

### 功能说明

输入一句话，生成一篇偏技术类教程文档，支持自定义语言。

### 设计思路

先通过 `LLM` 大模型生成教程的目录，再对目录按照二级标题进行分块，对于每块目录按照标题生成详细内容，最后再将标题和内容进行拼接。分块的设计解决了 `LLM` 大模型长文本的限制问题。

### 源码

[metagpt/roles/tutorial_assistant.py](https://github.com/geekan/MetaGPT/blob/main/metagpt/roles/tutorial_assistant.py)

## 角色定义

1. 定义角色类，继承 `Role` 基类，重写 `__init__` 初始化方法。`__init__` 方法必须包含`name`、`profile`、`goal`、`constraints` 参数。第一行代码使用`super().__init__(name, profile, goal, constraints)` 调用父类的构造函数，实现 `Role` 的初始化。使用 `self.set_actions([WriteDirectory(language=language)])` 添加初始的 `action` 和 `states`，这里先添加写目录的 `action`。同时，也可以自定义参数，这里加了 `language` 参数支持自定义语言。使用`self._set_react_mode(react_mode="by_order")` 将 `set_actions` 的 `action` 执行顺序设置为顺序。

   ```python
   class TutorialAssistant(Role):
       """Tutorial assistant, input one sentence to generate a tutorial document in markup format.

       Args:
           name: The name of the role.
           profile: The role profile description.
           goal: The goal of the role.
           constraints: Constraints or requirements for the role.
           language: The language in which the tutorial documents will be generated.
       """

       def __init__(
           self,
           name: str = "Stitch",
           profile: str = "Tutorial Assistant",
           goal: str = "Generate tutorial documents",
           constraints: str = "Strictly follow Markdown's syntax, with neat and standardized layout",
           language: str = "Chinese",
       ):
           super().__init__(name, profile, goal, constraints)
           self.set_actions([WriteDirectory(language=language)])
           self.topic = ""
           self.main_title = ""
           self.total_content = ""
           self.language = language
           self._set_react_mode(react_mode="by_order")
   ```

2. 重写 `react` 方法。使用 `await super().react()` 调用 `Role` 基类的 `react` 方法，根据 `__init__` 初始化方法设置的 `react_mode="by_order"` 按顺序执行 `states` 的每一个 `action` 。这里重写的目的是为了执行完所有的 `action` 后可以做最后的操作，即把拼接完的教程内容写成 `markdown` 文件。

   ```python
   async def react(self) -> Message:
       msg = await super().react()
       root_path = TUTORIAL_PATH / datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
       await File.write(root_path, f"{self.main_title}.md", self.total_content.encode('utf-8'))
       return msg
   ```

3. 重写 `_act` 方法，`_act` 方法是执行 `action`。使用 `todo = self.rc.todo` 从上下文获取下一步要执行的 `action`，再执行 `action` 的 `run` 方法。这里是先通过 `WriteDirectory` 获取教程的目录结构，再分块目录，每块生成一个 `WriteContent` 的 `action`，再初始化新添加的 `action`。这里再次调用 `await super().react()` 是为了从头执行新添加的所有 `WriteContent` `action`。每个 action 执行完的结果生成消息 `Message(content=resp, role=self.profile)`，可以将其放入上下文内存 `self.rc.memory`，该角色不需要存入。

   ```python
   async def _act(self) -> Message:
       """Perform an action as determined by the role.

       Returns:
       	A message containing the result of the action.
       """
       todo = self.rc.todo
       if type(todo) is WriteDirectory:
           msg = self.rc.memory.get(k=1)[0]
           self.topic = msg.content
           resp = await todo.run(topic=self.topic)
           logger.info(resp)
           await self._handle_directory(resp)
           return await super().react()
       resp = await todo.run(topic=self.topic)
       logger.info(resp)
       if self.total_content != "":
           self.total_content += "\n\n\n"
       self.total_content += resp
       return Message(content=resp, role=self.profile)

   async def _handle_directory(self, titles: Dict) -> Message:
       """Handle the directories for the tutorial document.

       Args:
           titles: A dictionary containing the titles and directory structure,
                   such as {"title": "xxx", "directory": [{"dir 1": ["sub dir 1", "sub dir 2"]}]}

       Returns:
           A message containing information about the directory.
       """
       self.main_title = titles.get("title")
       directory = f"{self.main_title}\n"
       self.total_content += f"# {self.main_title}"
       actions = list()
       for first_dir in titles.get("directory"):
           actions.append(WriteContent(language=self.language, directory=first_dir))
           key = list(first_dir.keys())[0]
           directory += f"- {key}\n"
           for second_dir in first_dir[key]:
               directory += f"  - {second_dir}\n"
       self.set_actions(actions)
   ```

## Action定义

1. 定义 `action`，每个 `action` 对应一个 `class` 对象，继承 `Action` 基类，重写 `__init__` 初始化方法。。`__init__` 方法包含 `name` 参数。第一行代码使用 `super().__init__(name, *args, **kwargs)` 调用父类的构造函数，实现 `action` 的初始化。这里使用 `args`、`kwargs` 将其他参数传递给父类的构造函数，比如 `context`、`llm`。

   ```python
   #!/usr/bin/env python3
   # _*_ coding: utf-8 _*_
   """
   @Time    : 2023/9/4 15:40:40
   @Author  : Stitch-z
   @File    : tutorial_assistant.py
   @Describe : Actions of the tutorial assistant, including writing directories and document content.
   """

   from typing import Dict

   from metagpt.actions import Action
   from metagpt.prompts.tutorial_assistant import DIRECTORY_PROMPT, CONTENT_PROMPT
   from metagpt.utils.common import OutputParser


   class WriteDirectory(Action):
       """Action class for writing tutorial directories.

       Args:
           name: The name of the action.
           language: The language to output, default is "Chinese".
       """

       def __init__(self, name: str = "", language: str = "Chinese", *args, **kwargs):
           super().__init__(name, *args, **kwargs)
           self.language = language
   ```

2. 重写 `run` 方法。`run` 方法是 `action` 执行的主要函数，使用 `self._aask(prompt=prompt)` 方法提问 `LLM` 大模型。

   ```python
   async def run(self, topic: str, *args, **kwargs) -> Dict:
       """Execute the action to generate a tutorial directory according to the topic.

       Args:
           topic: The tutorial topic.

       Returns:
           the tutorial directory information, including {"title": "xxx", "directory": [{"dir 1": ["sub dir 1", "sub dir 2"]}]}.
       """
       prompt = DIRECTORY_PROMPT.format(topic=topic, language=self.language)
       resp = await self._aask(prompt=prompt)
       return OutputParser.extract_struct(resp, dict)
   ```

3. 其他 `action` 写法类似。

   ```python
   class WriteContent(Action):
       """Action class for writing tutorial content.

       Args:
           name: The name of the action.
           directory: The content to write.
           language: The language to output, default is "Chinese".
       """

       def __init__(self, name: str = "", directory: str = "", language: str = "Chinese", *args, **kwargs):
           super().__init__(name, *args, **kwargs)
           self.language = language
           self.directory = directory

       async def run(self, topic: str, *args, **kwargs) -> str:
           """Execute the action to write document content according to the directory and topic.

           Args:
               topic: The tutorial topic.

           Returns:
               The written tutorial content.
           """
           prompt = CONTENT_PROMPT.format(topic=topic, language=self.language, directory=self.directory)
           return await self._aask(prompt=prompt)
   ```

## 角色执行结果

### 输入样例

- `MySQL` 教程
- `Redis` 教程
- `Hive` 教程

### 执行命令样例

```bash
python examples/write_tutorial.py
```

### 执行结果

生成的教程文档在项目的 `/data/tutorial_docx` 目录下。截图如下：

![image](/image/guide/use_cases/tutorial_assistant/output_zh_1.png)

![image](/image/guide/use_cases/tutorial_assistant/output_zh_2.png)

## 注意点

该角色暂未支持联网搜索能力，内容生成依赖 `LLM` 大模型训练的数据。
