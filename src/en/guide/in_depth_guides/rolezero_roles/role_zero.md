# RoleZero

## What is RoleZero?

`RoleZero` is a role in the MetaGPT system that inherits from the base role class `Role` and is designed to implement an intelligent agent capable of dynamic thinking and action. The primary function of the `RoleZero` class is to provide a flexible framework for agents to dynamically select and execute tasks based on environmental information. Specifically, `RoleZero` can:

- **Think and make decisions dynamically**: Determine the next action by calling an LLM (Large Language Model), updating its state based on the current context, history, and memory.
- **Execute tool instructions**: `RoleZero` has built-in support for tools like the browser and editor, using a mapping mechanism to associate commands with corresponding tool methods for automating web and file operations.
- **Plan and manage tasks**: It includes a `Planner` module that enables task planning, decomposition, and state tracking, supporting a ReAct-like think-act loop.
- **Interact with humans**: It provides `ask_human` and `reply_to_human` methods to seek user assistance when encountering complex problems.

## RoleZero Operation Mechanism

![Operation Mechanism](/public/image/guide/in_depth_guides/role_zero.png)

## Code Structure and Details

### 1. Basic Inheritance and Tool Registration

- `RoleZero` inherits from the base class `Role`, reusing its memory, context, and message processing functions.
- The `@register_tool(include_functions=["ask_human", "reply_to_human"])` decorator registers RoleZero as an invokable tool, enabling other system modules to access its interaction interfaces.

### 2. Initialization and Validation

- The `set_plan_and_tool` and `set_tool_execution` validators initialize RoleZero's internal state:

  - **Planning and tool setup**: Initializes the `Planner`, sets the reaction mode to `react`, and registers external tools (e.g., browser, editor) for execution.
  - **Long-term memory**: Determines whether to enable long-term memory for multi-turn interactions.

### 3. Thinking and Acting Loop

- **\_think method**: Constructs a prompt based on the current state and history, using the LLM to determine the next action and update the internal state.

- **\_act and \_react methods**:

  - `_act` executes the action determined by `_think`, processing the LLM’s returned instructions.
  - `_react` forms a complete thought-action loop by repeatedly calling `_think` and `_act` until a predefined limit is reached.

- **Quick thinking mode**: The `_quick_think` method enables rapid responses to avoid unnecessary LLM calls when a full loop is unnecessary.

### 4. Command Parsing and Execution

- **Parsing**: `_parse_commands` converts LLM outputs into a JSON command list, handling errors like JSON formatting issues.
- **Duplicate check**: `_check_duplicates` prevents redundant responses by checking memory for similar past responses.
- **Execution**: `_run_commands` executes parsed commands, prioritizing or handling special cases as needed.

### 5. Human Interaction Interfaces

- `ask_human` and `reply_to_human` manage interactions with users when complex problems arise, determining whether human intervention is necessary.

## Customizing RoleZero

### 1. Registering Tools

To use new functions or classes, register them as tools. The `ToolRegistry` and `ToolRecommender` help present available tools to the agent.

### 2. Initializing Parameters

Define the tools available to `RoleZero`:

```python
class RoleZero(Role):
    name: str = "Zero"
    profile: str = "RoleZero"
    goal: str = ""
    react_mode: Literal["react"] = "react"
    tools: list[str] = []  # Specify tools to use
    tool_execution_map: dict[str, Callable] = {}
    editor: Editor = Editor()
    browser: Browser = Browser()
```

### 3. Mapping Commands to Functions

Override `_update_tool_execution` to map commands to corresponding functions:

```python
@model_validator(mode="after")
def set_tool_execution(self) -> "RoleZero":
    self.tool_execution_map = {
        "Plan.append_task": self.planner.plan.append_task,
        "Editor.write": self.editor.write,
        "RoleZero.ask_human": self.ask_human,
    }
    self._update_tool_execution()
    return self

def _update_tool_execution(self):
    pass
```

This enables `RoleZero` to execute commands effectively and dynamically manage tasks.
