# RoleZero

## What is RoleZero?

`RoleZero` is a role in the MetaGPT system. It inherits from the base role class `Role` and is used to implement an agent that can think and act dynamically. The main function of the `RoleZero` class is to provide a flexible framework for the agent, so that it can dynamically select and execute tasks based on the information in the environment. Specifically, `RoleZero` can:

**Dynamic thinking and decision-making**: Determine which operation to perform next by calling LLM (Large Language Model), and update its own state based on the current context, history, and memory information.

**Execute tool instructions**: `RoleZero` has built-in calls to tools such as browsers (`Browser`) and editors (`Editor`). The instructions are associated with the corresponding tool methods through a mapping mechanism to realize the automatic execution of functions such as web page operations and file operations.

**Planning and Task Management**: Built-in `Planner` module, which can plan, decompose and track the status of tasks, and support the thinking-action cycle similar to the ReAct model.

**Interacting with people**: Provides ask_human and reply_to_human methods. When the agent encounters difficult problems or needs human assistance, it can actively ask or reply to humans.

## RoleZero role operation mechanism

![Operation Mechanism](/public/image/guide/tutorials/role_zero.png)

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

### **1. `Action` configuration and execution**

In `ProductManager`, `todo_action` sets the default `Action` to ensure that the role can automatically execute the PRD generation task:

```python
todo_action: str = any_to_name(WritePRD)
```

This means:

- `WritePRD` is executed by default to write the product requirement document (PRD).

- The role can automatically enter the execution logic of `WritePRD` according to the `todo_action` task guide.

In addition, in the `_update_tool_execution()` method, `WritePRD` is registered to the `tool_execution_map` to ensure that `ProductManager` can correctly call the `WritePRD.run()` method:

```python
def _update_tool_execution(self):
    wp = WritePRD()
    self.tool_execution_map.update(tool2name(WritePRD, ["run"], wp.run))
```

`WritePRD` is registered to the `tool_execution_map` through the `tool2name` method, which allows the role to directly call the `run()` method of `WritePRD` when executing the task to complete the generation of the PRD document.

### **2. Configuration and use of role tools (`Tools`)**

`ProductManager` inherits `RoleZero` and registers some tools to enable it to have search, editing, interaction and other capabilities:

```python
tools: list[str] = [
    "RoleZero",
    Browser.__name__,
    Editor.__name__,
    SearchEnhancedQA.__name__
]
```

Among them:

- **`Browser`**: used for web search and information query.

- **`Editor`**: provides text editing capabilities, such as document modification and adjustment.

- **`SearchEnhancedQA`**: enhances search capabilities and supports intelligent question and answer based on search engines.

The execution logic of these tools is managed internally by `RoleZero` and registered through the `_update_tool_execution()` method so that they can be called in the `ProductManager` role. For example, `SearchEnhancedQA` can be used to intelligently query competitor information, and `Editor` can be used to write and modify PRD documents.

### **3. `_think` method analysis**

In the `_think()` method, `ProductManager` decides the next action and checks whether the `WritePRD` task needs to be executed:

```python
async def _think(self) -> bool:
    """Decide what to do"""
    if GitRepository.is_git_dir(self.config.project_path) and not self.config.git_reinit:
        self._set_state(1)
    else:
        self._set_state(0)
        self.config.git_reinit = False
        self.todo_action = any_to_name(WritePRD)
    return bool(self.rc.todo)
```

**Method logic analysis**:

- **Check Git repository status**:

- If the project is a Git repository, execute the task (`self._set_state(1)`).
- Otherwise, reset `todo_action` to `WritePRD` to ensure that the PRD generation task proceeds normally.

This ensures that `ProductManager` executes `WritePRD` at the appropriate time to complete the writing of the product requirement document.

### **4. Summary**

`RoleZero` and its subclass `ProductManager` enable the role to have efficient task execution capabilities while ensuring its scalability through **flexible configuration of tools (`Tools`) and tasks (`Action`)**.

- **Tools (`Tools`) configuration**

- The role can directly register tools such as `Browser`, `Editor`, `SearchEnhancedQA`, etc., and can enhance functions without additional development.

- The tool calling method is flexible, supporting direct specification of tool `class name` and `class name.method name` mapping, which facilitates the role to perform complex tasks.

- **Task (`Action`) configuration and execution**

- Set the default task through `todo_action` to ensure that `WritePRD` can be automatically executed.

- For `Action` or custom tool methods, `_update_tool_execution()` can be overridden, and `Action` can be converted to a tool through the `tool2name` method, and mapped to `tool_execution_map` for registration, making `RoleZero` highly scalable and flexible.

- **Execution logic (`_think`)**

- The `ProductManager` role will dynamically decide whether to execute the PRD task based on the project status.

- Combined with the configuration of tools and tasks, the role can efficiently and accurately complete tasks such as PRD writing and market research.

This design not only ensures the controllability of the SOP method, but also allows the role to dynamically adjust tools and tasks according to specific scenarios to achieve more intelligent task processing.
