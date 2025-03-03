# RoleZero

## RoleZero 核心概念

`RoleZero` 是 MetaGPT 系统中的一个角色，它继承自基础角色类 `Role`，用于实现一个能够动态思考和行动的智能体（Agent）。`RoleZero` 类的主要作用是为智能体提供一个灵活的框架，使其能够根据环境中的信息动态地选择和执行任务。具体来说，`RoleZero` 能够：

**动态思考和决策**：通过调用 LLM（大语言模型）来判断下一步该执行哪种操作，并根据当前的上下文、历史记录以及内存信息更新自己的状态。

**执行工具指令**：`RoleZero` 内置了对浏览器（`Browser`）、编辑器（`Editor`）等工具的调用，通过映射机制将指令与相应的工具方法关联起来，实现对网页操作、文件操作等功能的自动化执行。

**规划与任务管理**：内置了 `Planner` 模块，可以对任务进行规划、分解以及状态跟踪，支持类似 ReAct 模型的思考—行动循环。

**与人交互**：提供了 ask_human 和 reply_to_human 方法，当代理遇到疑难问题或需要人工辅助时，可主动向人类发问或进行回复。

## RoleZero角色运行机制

![Operation Mechanism](/public/image/guide/tutorials/role_zero.png)

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

- `tools` 填写要被使用的工具名，若整个类中全部函数都使用，填写`类名`，若一个类中部分函数使用，填写`类名.函数名` ；在 `_think` 阶段，`tools` 指定的全部工具都将被呈现供LLM决策选择

```python
@register_tool(include_functions=["ask_human", "reply_to_human"])
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
    max_react_loop: int = 50  # used for react mode

    # Tools
    tools: list [ str ] = [] # Use special symbol ["<all>"] to indicate use of all registered tools 最关键的一处，指定角色持有哪些工具
    tool_recommender: ToolRecommender = None
    tool_execution_map: dict[str, Callable] = {}
    special_tool_commands: list[str] = ["Plan.finish_current_task", "end", "Terminal.run_command", "RoleZero.ask_human"]
    # List of exclusive tool commands.
    # If multiple instances of these commands appear, only the first occurrence will be retained.
    exclusive_tool_commands: list[str] = [
        "Editor.edit_file_by_replace",
        "Editor.insert_content_at_line",
        "Editor.append_file",
        "Editor.open_file",
    ]

    # Equipped with three basic tools by default for optional use
    editor: Editor = Editor()
    browser: Browser = Browser()

    # Experience
    experience_retriever: ExpRetriever = DummyExpRetriever()

    # Others
    observe_all_msg_from_buffer: bool = True
    command_rsp: str = ""  # the raw string containing the commands
    commands: list[dict] = []  # commands to be executed
    memory_k: int = 200  # number of memories (messages) to use as historical context
    use_fixed_sop: bool = False
    respond_language: str = ""  # Language for responding humans and publishing messages.
    use_summary: bool = True  # whether to summarize at the end

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

## **`SimpleReviewAssistant` 角色案例解析**

在 `SimpleReviewAssistant` 角色的实现中，该角色被设计为一个简单的自动化好评生成助手，它能够使用 `GeneratePositiveReview` 工具生成针对产品、商店或服务的正面评价。该角色继承自 `RoleZero`，并注册了必要的工具，使其具备浏览器、好评生成工具等功能。

```python
class SimpleReviewAssistant(RoleZero):
    """Rating Assistant helps users automatically generate positive reviews for products, stores or services"""

    name: str = "SimpleReviewAssistant"
    profile: str = "Automated Positive Review Generator"
    goal: str = "Generate positive reviews for your product, store or service."
    tools: list[str] = ["RoleZero", Browser.__name__, "GeneratePositiveReview"]

    instruction: str = "Use GeneratePositiveReview tool to generate a positive review for a given product, store or service."

    def _update_tool_execution(self):
        review_generator = GeneratePositiveReview()
        self.tool_execution_map.update(tool2name(GeneratePositiveReview, ["run"], review_generator.run))
```

## **1. `Action` 配置与执行**

`SimpleReviewAssistant` 依赖 `GeneratePositiveReview` 这一 `Action` 来完成自动化评论生成任务。

```python
@register_tool(include_functions=["run"])
class GeneratePositiveReview(Action):
    """Generates a positive review for a product, store, or service."""

    name: str = "GeneratePositiveReview"
    input_args: Optional[BaseModel] = Field(default=None, exclude=True)

    PROMPT_TEMPLATE: str = """
    You are a professional product reviewer, and your task is to write a positive review for the following item:

    Item Type: {category}
    Item Name: {item_name}

    Review Guidelines:
    - Use a friendly, engaging, and positive tone.
    - Highlight key advantages such as quality, value for money, experience, or convenience.
    - Add a touch of personal experience to make the review more authentic.
    - Ensure the review fits the intended platform, such as an e-commerce site (Amazon, eBay, Shopify), a food delivery service (UberEats, DoorDash, Meituan), or a local store/service.

    Examples of Positive Reviews:

    E-commerce Product (Electronics):
    - "The {item_name} is absolutely fantastic! The build quality is excellent, and the performance exceeded my expectations. Battery life is great, and the sleek design makes it super stylish. Highly recommend!"

    Restaurant (Food Delivery - Meituan, UberEats, Yelp):
    - "I ordered from {item_name}, and the food was delicious! Fresh ingredients, perfect seasoning, and fast delivery. The packaging was neat, and the portion size was generous. Will definitely order again!"

    Local Store (Retail, Clothing, Cosmetics):
    - "Shopping at {item_name} was a wonderful experience! The store was well-organized, the staff was friendly, and the product selection was amazing. Prices were fair, and I found exactly what I needed!"

    Service (Salon, Repair, Cleaning, etc.):
    - "I booked a service at {item_name}, and I’m beyond satisfied! The staff was professional, punctual, and highly skilled. Everything was handled smoothly, and I felt valued as a customer. Highly recommend!"

    Please generate a 50-100 word review following these examples:
    """

    async def run(
            self,
            with_messages: List[Message] = None,
            *,
            item_name: str = "This product",
            category: str = "General",
            **kwargs,
    ) -> Union[AIMessage, str]:
        """
        Generates a positive review for a product, store, or service.

        Args:
            item_name (str): The name of the product, store, or service (default: "This product").
            category (str): The category of the item (e.g., "Electronics", "Restaurant", "Service").

        Returns:
            AIMessage: A well-crafted positive review.

        Example:
            >>> action = GeneratePositiveReview()
            >>> result = await action.run(item_name="Wireless Earbuds", category="Electronics")
            >>> print(result)
            AIMessage(content="These wireless earbuds are fantastic! The sound quality is crisp, the fit is comfortable, and the battery lasts forever. Highly recommend!")
        """
        if not item_name:
            return AIMessage(content="Please provide an item name for the review.", cause_by=self)

        # Fill the prompt with user inputs
        prompt = self.PROMPT_TEMPLATE.format(item_name=item_name, category=category)

        # Generate a review using LLM
        generated_review = await self._aask(prompt)

        return AIMessage(content=generated_review, cause_by=self)

```

### **`GeneratePositiveReview` 作用**

- `GeneratePositiveReview` 是一个 `Action`，被注册到 `tool_registry`，并可以在 `SimpleReviewAssistant` 角色中调用。
- 其 `run()` 方法会使用 LLM 生成符合 `PROMPT_TEMPLATE` 规范的正面评价。
- `run` 方法接收 `item_name`（商品/店铺/服务名称）和 `category`（类别），然后填充 `PROMPT_TEMPLATE`，向 LLM 发送请求，最终返回 AI 生成的评论。
- 工具方法需要严格说明其作用、参数含义以及调用方式等信息，这有助于角色动态选择这工具并生成相应的参数进行调用。

---

## **2. 角色工具 (`Tools`) 配置**

在 `SimpleReviewAssistant` 角色定义中，注册了多个工具，包括：

```python
tools: list[str] = ["RoleZero", Browser.__name__, "GeneratePositiveReview"]
```

- **`RoleZero`**：继承的基础角色框架。
- **`Browser`**：提供网页搜索能力（如获取产品评论数据）。
- **`GeneratePositiveReview`**：用于自动生成好评的 `Action`。

这些工具被 `RoleZero` 内部管理，并可通过 `_update_tool_execution()` 进行注册，使角色能够正确调用 `GeneratePositiveReview`：

```python

def _update_tool_execution(self):
    review_generator = GeneratePositiveReview()
    self.tool_execution_map.update(tool2name(GeneratePositiveReview, ["run"], review_generator.run))
```

也可以通过 `tool2name` 方法将 `GeneratePositiveReview` 被注册到 `tool_execution_map`，这使得角色在执行任务时，可以直接调用 `GeneratePositiveReview` 的 `run()` 方法，完成好评的生成。

---

## **3. `MGXEnv` 运行流程**

```python
async def run_on_mgx_env():
    mgx_env = MGXEnv()
    ra = SimpleReviewAssistant()
    msg = Message(content="Write a good review for airpods pro2")
    mgx_env.add_roles([TeamLeader(), ra])
    mgx_env.publish_message(msg)

    start_time = time.time()
    while time.time() - start_time < 15:
        if not mgx_env.is_idle:
            ret = await mgx_env.run()
            logger.debug(ret)
            start_time = time.time()
```

### **执行流程解析**

1.  **初始化 `MGXEnv` 运行环境**，并创建 `SimpleReviewAssistant` 角色 (`ra`)。

2.  **添加角色**（`TeamLeader()` 和 `SimpleReviewAssistant()`）。

3.  **发布任务**，例如 `"Write a good review for airpods pro2"`。

4.  **循环检测 `MGXEnv` 状态**：

    - 若 `MGXEnv` 处于活跃状态，则运行任务。
    - 角色根据任务和工具信息动态决定选择合适的工具进行执行。

### **4. 总结**

`RoleZero` 及其子类 `SimpleReviewAssistant` 通过 **工具 (`Tools`) 和任务 (`Action`) 的灵活配置**，使角色具备动态的任务执行能力，同时确保其可扩展性。

- **工具 (`Tools`) 配置**

  - 角色可直接注册 `Browser`、`Editor`、`SearchEnhancedQA` 等工具，无需额外开发即可增强功能。
  - 工具调用方式灵活，支持直接指定工具 `类名` 和 `类名.方法名` 方式映射，便于角色执行复杂任务。

- **任务 (`Action`) 配置与执行**

  - 对于 `Action` 或自定义工具方法，`_update_tool_execution()` 可被重写，通过 `tool2name` 方法将 `Action` 转换为工具，并映射到 `tool_execution_map` 进行注册，使 `RoleZero` 具备高度的可扩展性和灵活性。

这种设计不仅确保了 SOP 方式的可控性，也允许角色根据具体场景动态调整工具与任务，实现更智能化的任务处理。
