# RoleZero

## What is RoleZero?

`RoleZero` is a role in the MetaGPT system. It inherits from the base role class `Role` and is used to implement an agent that can think and act dynamically. The main function of the `RoleZero` class is to provide a flexible framework for the agent, so that it can dynamically select and execute tasks based on the information in the environment. Specifically, `RoleZero` can:

**Dynamic thinking and decision-making**: Determine which operation to perform next by calling LLM (Large Language Model), and update its own state based on the current context, history, and memory information.

**Execute tool instructions**: `RoleZero` has built-in calls to tools such as browsers (`Browser`) and editors (`Editor`). The instructions are associated with the corresponding tool methods through a mapping mechanism to realize the automatic execution of functions such as web page operations and file operations.

**Planning and Task Management**: Built-in `Planner` module, which can plan, decompose and track the status of tasks, and support the thinking-action cycle similar to the ReAct model.

**Interacting with people**: Provides ask_human and reply_to_human methods. When the agent encounters difficult problems or needs human assistance, it can actively ask or reply to humans.

## RoleZero role operation mechanism

![Operation Mechanism转存失败，建议直接上传图片文件](/public/image/guide/tutorials/role_zero.png)

## Code Encapsulation and Detailed Explanation

The code encapsulation of `RoleZero` implements the design concept of modularization and clear responsibilities. The following is an explanation of each functional module:

**1. Basic inheritance and tool registration**

- `RoleZero` inherits from the base class `Role`, and reuses the memory, context, message processing and other functions of the base role.

- Expose itself as a callable tool through the `@register_tool(include_functions=["ask_human", "reply_to_human"])` decorator. This allows other modules in the system to access the interactive interface of `RoleZero` through a unified tool registration mechanism.

**2. Initialization and Validation (Validator)**

- In the model validator (such as `set_plan_and_tool` and `set_tool_execution`), `RoleZero` initializes the internal state of the role after instantiation:

- Planning and tool settings: through `set_plan_and_tool`, initialize `Planner`, set the reaction mode to **react** and make corresponding settings; at the same time, through `set_tool_execution`, construct a tool execution map (tool_execution_map) and register the corresponding methods of external tools (such as browsers, editors, terminals), so that when executing commands, the corresponding tool functions can be called through mapping.

- Long-term Memory: In `set_longterm_memory`, the configuration conditions determine whether to enable long-term memory, which facilitates saving and retrieving historical information in multiple dialogue rounds.

**3. Thinking and Action Loop**

- **\_think method**: `RoleZero` overrides the `_think` method to construct a prompt (`prompt`) based on the current state, memory, and historical dialogue records, use `LLM` to determine the next action, and update the internal state (for example, call `_set_state` to set the next action to be performed).

- **\_act and react methods**:

- The `_act` method is responsible for executing the action determined by the `_think` method, processing the instructions returned by `LLM`, and calling the corresponding tools.

- The `_react` method is a typical thinking-action loop: multiple calls to `_think` and `_act` until the set upper limit is reached, thus forming a complete reaction closed loop.

- **Quick thinking mode**: In the `_quick_think` method, `RoleZero` provides a quick response capability. When it is found that the current message may not require a complete cycle, the answer is quickly generated to save the LLM call cost.

**4. Command parsing and execution**

- Command parsing: The method `_parse_commands` is used to parse the text results returned by LLM into a command list in JSON format, and perform error repair, such as handling JSON format errors, escape character problems, etc., to ensure that subsequent commands can be executed correctly.

- Duplicate check: In the `_check_duplicates` method, by detecting whether there are similar answers in recent memory, avoid repeatedly generating the same response, and call the human interaction interface for help when necessary.

- Command execution: Through the `_run_commands` method, traverse the parsed commands, and call the corresponding tool method according to the priority or special command rules. After executing the command, the results are summarized to form the agent's final answer.

**5. Human Interface**

- `ask_human` and `reply_to_human` methods encapsulate how to ask or reply to users when the system encounters complex problems or repeated errors. These methods usually determine the current environment type (for example, whether it belongs to MGXEnv), and then decide whether to actually hand it over to human intervention.

## Customizing the RoleZero Role Process

1.  ### Registering Tools

One of the most important features of `RoleZero` is the dynamic operation of tools. If the functions or classes you want to use LLM have not been registered as tools, you need to register them as tools first. After registration, `ToolRegistry` and `ToolRecommender` will play a role, presenting the tool's signature, `docstring`, etc. to `Agent` for selection and decision

2.  ### Fill in initialization parameters

- `tools` fill in the name of the tool to be used. If all functions in the entire class are used, fill in `class name`. If some functions in a class are used, fill in `class name. function name`; in the `_think` stage, all tools specified by `tools` will be presented for LLM decision selection

```python
@register_tool(include_functions=["ask_human", "reply_to_human"])
class RoleZero(Role):
    """A role who can think and act dynamically"""

    # Basic Info
    name: str = "Zero"
    profile: str = "RoleZero"
    goal: str = "" # Describe the role responsibilities to facilitate TL to assign tasks
    system_msg: list[str] = None # Use None to conform to the default value at llm.aask
    cmd_prompt: str = CMD_PROMPT # Used to determine the command generated by the current step_think
    instruction: str = ROLE_INSTRUCTION # Role-specific logic will be filled in cmd_prompt as a paragraph. For simpler roles, just change instruction. Otherwise, change cmd_prompt

    # React Mode
    react_mode: Literal["react"] = "react"
    max_react_loop: int = 50 # used for react mode

    # Tools
    tools: list[str] = []  # Use special symbol ["<all>"] to indicate use of all registered tools
    tool_recommender: Optional[ToolRecommender] = None
    tool_execution_map: Annotated[dict[str, Callable], Field(exclude=True)] = {}
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
    editor: Editor = Editor(enable_auto_lint=True)
    browser: Browser = Browser()

    # Experience
    experience_retriever: Annotated[ExpRetriever, Field(exclude=True)] = DummyExpRetriever()

    # Others
    observe_all_msg_from_buffer: bool = True
    command_rsp: str = ""  # the raw string containing the commands
    commands: list[dict] = []  # commands to be executed
    memory_k: int = 200  # number of memories (messages) to use as historical context
    use_fixed_sop: bool = False
    respond_language: str = ""  # Language for responding humans and publishing messages.
    use_summary: bool = True  # whether to summarize at the end

```

3.  ### Define the mapping from tool name to tool function

Rewrite `_update_tool_execution`. This step mainly specifies how the command generated by the role corresponds to the function to be executed

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

## **Product Manager Role Case Analysis**

In the `ProductManager` role implementation, we can see that `use_fixed_sop` is used to be compatible with the SOP method, allowing the role to switch between fixed processes and flexible thinking modes. In addition, the role also defines tools, configures `Action`, and implements tool registration and use.

```python
from metagpt.actions import UserRequirement, WritePRD
from metagpt.actions.prepare_documents import PrepareDocuments
from metagpt.actions.search_enhanced_qa import SearchEnhancedQA
from metagpt.prompts.product_manager import PRODUCT_MANAGER_INSTRUCTION
from metagpt.roles.di.role_zero import RoleZero
from metagpt.roles.role import RoleReactMode
from metagpt.tools.libs.browser import Browser
from metagpt.tools.libs.editor import Editor
from metagpt.utils.common import any_to_name, any_to_str, tool2name
from metagpt.utils.git_repository import GitRepository


class ProductManager(RoleZero):
    """
    Represents a Product Manager role responsible for product development and management.

    Attributes:
        name (str): Name of the product manager.
        profile (str): Role profile, default is 'Product Manager'.
        goal (str): Goal of the product manager.
        constraints (str): Constraints or limitations for the product manager.
    """

    name: str = "Alice"
    profile: str = "Product Manager"
    goal: str = "Create a Product Requirement Document or market research/competitive product research."
    constraints: str = "utilize the same language as the user requirements for seamless communication"
    instruction: str = PRODUCT_MANAGER_INSTRUCTION
    tools: list[str] = ["RoleZero", Browser.__name__, Editor.__name__, SearchEnhancedQA.__name__]

    todo_action: str = any_to_name(WritePRD)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
        if self.use_fixed_sop:
            self.enable_memory = False
            self.set_actions([PrepareDocuments(send_to=any_to_str(self)), WritePRD])
            self._watch([UserRequirement, PrepareDocuments])
            self.rc.react_mode = RoleReactMode.BY_ORDER

    def _update_tool_execution(self):
        wp = WritePRD()
        self.tool_execution_map.update(tool2name(WritePRD, ["run"], wp.run))

    async def _think(self) -> bool:
        """Decide what to do"""
        if not self.use_fixed_sop:
            return await super()._think()

        if GitRepository.is_git_dir(self.config.project_path) and not self.config.git_reinit:
            self._set_state(1)
        else:
            self._set_state(0)
            self.config.git_reinit = False
            self.todo_action = any_to_name(WritePRD)
        return bool(self.rc.todo)

```

### **1. `use_fixed_sop` is compatible with SOP mode**

`use_fixed_sop` enables `ProductManager` to:

- **Turn on fixed SOP mode**:

  - Turn off memory (`self.enable_memory = False`).

  - `set_actions()` predefines the SOP process to ensure the execution order of PRD generation.

  - `self.rc.react_mode = RoleReactMode.BY_ORDER`: Execute predefined `Action` in order.

- **Turn on flexible reasoning mode**:

  - Inherit `RoleZero` for dynamic thinking (`_think()`).

**Code snippet**

```python
def __init__(self, **kwargs) -> None:
    super().__init__(**kwargs)
    if self.use_fixed_sop:
        self.enable_memory = False
        self.set_actions([PrepareDocuments(send_to=any_to_str(self)), WritePRD])
        self._watch([UserRequirement, PrepareDocuments])
        self.rc.react_mode = RoleReactMode.BY_ORDER
```

- **When `use_fixed_sop=True`**:

  - Turn off memory (`self.enable_memory = False`) to prevent context from affecting SOP execution.
  - Preset the execution order of `PrepareDocuments → WritePRD` to ensure the PRD document writing process.
  - `_watch([UserRequirement, PrepareDocuments])` listens to `UserRequirement` and triggers `PrepareDocuments` when the requirement changes.

- **When `use_fixed_sop=False`**:

  - `ProductManager` inherits `RoleZero` and dynamically decides the `Action` to be executed.

---

### **2. `Action` and `Tools` definitions**

**`Action` configuration**

In `ProductManager`, `todo_action` sets the default `Action`:

```python
todo_action: str = any_to_name(WritePRD)
```

This means:

- The default execution task is `WritePRD`, which is used to write PRD documents.

- When `use_fixed_sop=True`, `PrepareDocuments` is used as a pre-step to ensure that the materials required for PRD generation are ready.

**`Action Tools` registration**

In `_update_tool_execution()`:

```python
def _update_tool_execution(self):
    wp = WritePRD()
    self.tool_execution_map.update(tool2name(WritePRD, ["run"], wp.run))
```

- `WritePRD` is registered to `tool_execution_map` via the `tool2name` method, enabling `ProductManager` to execute `WritePRD.run()`.

### **3. Role tool (`Tools`) registration and use**

`ProductManager` inherits `RoleZero` and registers some tools:

```python
tools: list[str] = ["RoleZero", Browser.__name__, Editor.__name__, SearchEnhancedQA.__name__]
```

Among them:

- `RoleZero`: Register tools registered with RoleZero (`ask_human`, `reply_to_human`).

- `Browser`: Register browser operations as tools.

- `Editor`: Register editor tools.

- `SearchEnhancedQA`: Register search engine tools.

The execution logic of these tools is managed internally by `RoleZero` and registered through `_update_tool_execution()` so that they can be called in the `ProductManager` role.

### **4. `_think` method analysis**

```python
async def _think(self) -> bool:
    """Decide what to do"""
    if not self.use_fixed_sop:
        return await super()._think()

    if GitRepository.is_git_dir(self.config.project_path) and not self.config.git_reinit:
        self._set_state(1)
    else:
        self._set_state(0)
        self.config.git_reinit = False
        self.todo_action = any_to_name(WritePRD)
    return bool(self.rc.todo)
```

**Method logic**

- **`use_fixed_sop=False`** → Enter `_think()` logic of `RoleZero` and make independent decisions on the next action.

  - When the role is in `think`, dynamically select `WritePRD` and fill in the appropriate parameters. When `act`, execute `WritePRD.run` (corresponding parameters)

  ```python
  class WritePRD(Action):

    def run(
        self,
        with_messages: List[Message] = None,
        *,
        user_requirement: str = "",
        output_path: str = "",  # Output PRD path
        exists_prd_filename: str = "",  # Original PRD path
        extra_info: str = "",  # If additional information search is performed
    ) -> Message:  # Messsage.content contains the path of the output PRD
        ...
  ```

- **`use_fixed_sop=True`**:

  - If the Git repository exists (`GitRepository.is_git_dir(self.config.project_path)`):

    - `self._set_state(1)` indicates that the PRD generation task can be executed.

  - Otherwise:

    - `self._set_state(0)` and reset `self.config.git_reinit = False` to ensure the correct order of task execution.
    - Reset `todo_action = any_to_name(WritePRD)` to specify that the `WritePRD` task is to be executed.

### **5. Summary**

`RoleZero` and its subclasses can be compatible with fixed SOP processes through `use_fixed_sop` to achieve strict execution order, while also making flexible decisions in dynamic mode.

In addition, the `tools` attribute allows for convenient configuration of tools, supporting direct specification of tool class names or `class name.method name` formats, allowing roles to seamlessly call various functions. For example, tools such as browsers (`Browser`), editors (`Editor`), and search engines (`SearchEnhancedQA`) can be directly registered and used.

For `Action` or custom tool methods, `_update_tool_execution()` can be overridden, and `Action` can be converted to a tool through the `tool2name` method, and mapped to `tool_execution_map` for registration, making `RoleZero` highly scalable and flexible. This design not only ensures the controllability of the SOP method, but also allows roles to dynamically adjust tools and tasks according to specific scenarios.
