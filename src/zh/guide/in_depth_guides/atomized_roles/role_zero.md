# RoleZero

## RoleZero 是干嘛的？

`RoleZero` 是 MetaGPT 系统中的一个角色，它继承自基础角色类 `Role`，用于实现一个能够动态思考和行动的智能体（Agent）。`RoleZero` 类的主要作用是为智能体提供一个灵活的框架，使其能够根据环境中的信息动态地选择和执行任务。具体来说，`RoleZero` 能够：

**动态思考和决策**：通过调用 LLM（大语言模型）来判断下一步该执行哪种操作，并根据当前的上下文、历史记录以及内存信息更新自己的状态。

**执行工具指令**：RoleZero 内置了对浏览器（Browser）、编辑器（Editor）等工具的调用，通过映射机制将指令与相应的工具方法关联起来，实现对网页操作、文件操作等功能的自动化执行。

**规划与任务管理**：内置了 Planner 模块，可以对任务进行规划、分解以及状态跟踪，支持类似 ReAct 模型的思考—行动循环。

**与人交互**：提供了 ask_human 和 reply_to_human 方法，当代理遇到疑难问题或需要人工辅助时，可主动向人类发问或进行回复。

## RoleZero角色运行机制

![Operation Mechanism](/public/image/guide/in_depth_guides/role_zero.png)

## 代码封装与详解

`RoleZero` 的代码封装贯彻了模块化、职责明确的设计思想，下面按功能模块逐一说明：

**1. 基础继承与工具注册**

- `RoleZero` 继承自基础类 `Role`，复用了基础角色的内存、上下文、消息处理等功能。

- 通过 `@register_tool(include_functions=["ask_human", "reply_to_human"])` 装饰器，将自身暴露为可调用的工具。这使得在系统中其他模块能够通过统一的工具注册机制访问 `RoleZero` 的交互接口。

**2. 初始化与验证（Validator）**

- 在模型验证器（例如 `set_plan_and_tool` 和 `set_tool_execution`）中，`RoleZero` 实例化后对角色的内部状态进行初始化：

  - 规划与工具设置：通过 `set_plan_and_tool`，初始化 `Planner`，将反应模式（react mode）设为 **react** 并进行相应设置；同时通过 `set_tool_execution` 构造一个工具执行映射（tool_execution_map），将外部工具（如浏览器、编辑器、终端）的对应方法注册进来，这样一来在执行命令时，就能通过映射调用对应的工具功能。

  - 长时记忆（`Long-term Memory`）：在 `set_longterm_memory` 中，根据配置条件决定是否启用长时记忆，便于在多个对话轮次中保存和检索历史信息。

**3. 思考与行动循环**

- **\_think 方法**：`RoleZero` 重写了 `_think` 方法，用于根据当前状态、记忆和历史对话记录构造提示（`prompt`），利用 `LLM` 决定下一步行动，并更新内部状态（例如调用 `_set_state` 设置下一步要执行的动作）。

- **\_act 与 react 方法**：

  - `_act` 方法负责执行由 `_think` 方法确定的行动，处理 `LLM` 返回的指令，并调用对应工具。

  - `_react` 方法则是典型的思考—再行动循环：多次调用 `_think` 与 `_act`，直至达到设定的上限，从而形成一个完整的反应闭环。

- **快速思考模式**：在 `_quick_think` 方法中，`RoleZero` 提供了一种快速响应的能力，当发现当前消息可能无需完整循环时，快速生成回答以节省 LLM 调用成本。

**4. 命令解析与执行**

- 命令解析：方法 `_parse_commands` 用于将 LLM 返回的文本结果解析为 JSON 格式的命令列表，并进行错误修复，如处理 JSON 格式错误、逃逸字符问题等，从而确保后续命令能够正确执行。

- 重复检查：在 `_check_duplicates` 方法中，通过检测近期记忆中是否已经存在相似的回答，避免重复生成相同的响应，并在必要时调用人工交互接口请求帮助。

- 命令执行：通过 `_run_commands` 方法，遍历解析得到的命令，并按优先级或特殊命令的规则调用相应工具方法，执行命令后将结果进行汇总，最终形成代理的最终回答。

**5. 与人交互接口**

- `ask_human` 和 `reply_to_human` 方法封装了当系统遇到复杂问题或重复错误时，如何向使用者询问或回复。这些方法通常会判断当前的环境类型（例如是否属于 MGXEnv），从而决定是否实际交由人工干预。

## 自定义RoleZero角色的流程

1.  ### 注册工具

`RoleZero` 的一个最主要特性即是动态操作工具，若希望LLM使用的函数或类尚未被注册为工具，则需要先将它们注册为工具。注册好后，`ToolRegistry` 和 `ToolRecommender` 会发挥作用，将工具的签名、`docstring` 等呈递给 `Agent`，供其选择决策

2.  ### 填写初始化参数

- 加粗的是应该特别注意的
- `tools` 填写要被使用的工具名，若整个类中全部函数都使用，填写`类名`，若一个类中部分函数使用，填写`类名.函数名` ；在 `_think` 阶段，`tools` 指定的全部工具都将被呈现供LLM决策选择

```python
class RoleZero(Role):
    """A role who can think and act dynamically"""

    # Basic Info
    name: str = "Zero"
    profile: str = "RoleZero"
    goal: str = ""  # 描述角色职责，方便TL分配任务
    system_msg: list[str] = None  # Use None to conform to the default value at llm.aask
    cmd_prompt: str = CMD_PROMPT # 用于确定当前步_think生成的命令
    instruction: str = ROLE_INSTRUCTION # 角色特异性的逻辑，会作为一个段落填入cmd_prompt内，对于较简单的角色而言，改instruction即可，否则，可改cmd_prompt

    # React Mode
    react_mode: Literal["react"] = "react"
    max_react_loop: int = 20  # used for react mode

    # Tools
    tools: list [ str ] = [] # Use special symbol ["<all>"] to indicate use of all registered tools 最关键的一处，指定角色持有哪些工具
    tool_recommender: ToolRecommender = None
    tool_execution_map: dict[str, Callable] = {}
    special_tool_commands: list[str] = ["Plan.finish_current_task", "end"]
    # Equipped with three basic tools by default for optional use
    editor: Editor = Editor()
    browser: Browser = Browser()
    # terminal: Terminal = Terminal()  # FIXME: TypeError: cannot pickle '_thread.lock' object

    # Experience
    experience_retriever: ExpRetriever = DummyExpRetriever()

    # Others
    command_rsp: str = ""  # the raw string containing the commands
    commands: list[dict] = []  # commands to be executed
    memory_k: int = 20  # number of memories (messages) to use as historical context
    use_fixed_sop: bool = False
```

3.  ### 定义工具名到工具函数的映射

重写 `_update_tool_execution`，这一步主要是指定，角色生成的命令，怎样对应到要被执行的函数

```python
    @model_validator(mode="after")
    def set_tool_execution(self) -> "RoleZero":
        # default map
        self.tool_execution_map = {
            "Plan.append_task": self.planner.plan.append_task,
            "Plan.reset_task": self.planner.plan.reset_task,
            "Plan.replace_task": self.planner.plan.replace_task,
            "Editor.write": self.editor.write,
            "Editor.write_content": self.editor.write_content,
            "Editor.read": self.editor.read,
            "RoleZero.ask_human": self.ask_human,
            "RoleZero.reply_to_human": self.reply_to_human,
        }
        # can be updated by subclass
        self._update_tool_execution()
        return self

    def _update_tool_execution(self):
        pass
```
