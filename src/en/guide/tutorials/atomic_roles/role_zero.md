# RoleZero

## RoleZero Core Concepts

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

## **`SimpleReviewAssistant` role case analysis**

In the implementation of the `SimpleReviewAssistant` role, the role is designed as a simple automated review generation assistant that can use the `GeneratePositiveReview` tool to generate positive reviews for products, stores, or services. This role inherits from `RoleZero` and registers the necessary tools to enable it to have functions such as a browser and a review generation tool.

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

### **1. `Action` configuration and execution**

`SimpleReviewAssistant` relies on the `GeneratePositiveReview` `Action` to complete the automatic review generation task.

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

**What `GeneratePositiveReview` does**

- `GeneratePositiveReview` is an `Action` that is registered to `tool_registry` and can be called from the `SimpleReviewAssistant` role.
- Its `run()` method uses LLM to generate a positive review that conforms to the `PROMPT_TEMPLATE` specification.
- The `run` method receives `item_name` (product/store/service name) and `category` (category), then fills in `PROMPT_TEMPLATE`, sends a request to LLM, and finally returns the AI-generated review.
- Tool methods need to strictly explain their functions, parameter meanings, and calling methods, which helps roles dynamically select this tool and generate corresponding parameters for calling.

---

### **2. Role Tools (`Tools`) Configuration**

In the `SimpleReviewAssistant` role definition, multiple tools are registered, including:

```python
tools: list[str] = ["RoleZero", Browser.__name__, "GeneratePositiveReview"]
```

- **`RoleZero`**: The inherited basic role framework.
- **`Browser`**: Provides web search capabilities (such as obtaining product review data).
- **`GeneratePositiveReview`**: An `Action` for automatically generating positive reviews.

These tools are managed internally by `RoleZero` and can be registered through `_update_tool_execution()`, so that the role can correctly call `GeneratePositiveReview`:

```python

def _update_tool_execution(self):
    review_generator = GeneratePositiveReview()
    self.tool_execution_map.update(tool2name(GeneratePositiveReview, ["run"], review_generator.run))
```

You can also register `GeneratePositiveReview` to `tool_execution_map` through the `tool2name` method, so that when the role executes the task, it can directly call the `run()` method of `GeneratePositiveReview` to complete the generation of positive reviews.

---

### **3. `MGXEnv` operation process**

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

**Execution process analysis**

1. **Initialize the `MGXEnv` runtime environment** and create the `SimpleReviewAssistant` role (`ra`).

2. **Add roles** (`TeamLeader()` and `SimpleReviewAssistant()`).

3. **Publish tasks**, such as `"Write a good review for airpods pro2"`.

4. **Loop to check the `MGXEnv` status**:

   - If `MGXEnv` is active, run the task.
   - The role dynamically decides to select the appropriate tool for execution based on the task and tool information.

### **4. Summary**

`RoleZero` and its subclass `SimpleReviewAssistant` enable the role to have dynamic task execution capabilities while ensuring its scalability through \*\*flexible configuration of tools (`Tools`) and tasks (`Action`).

- **Tools (`Tools`) configuration**

- The role can directly register tools such as `Browser`, `Editor`, `SearchEnhancedQA`, etc., and can enhance functions without additional development.

- The tool calling method is flexible, supporting direct specification of tool `class name` and `class name.method name` mapping, which facilitates the role to perform complex tasks.

- **Task (`Action`) configuration and execution**

- For `Action` or custom tool methods, `_update_tool_execution()` can be overridden, and `Action` can be converted to a tool through the `tool2name` method, and mapped to `tool_execution_map` for registration, making `RoleZero` highly scalable and flexible.

This design not only ensures the controllability of the SOP method, but also allows the role to dynamically adjust tools and tasks according to specific scenarios, achieving more intelligent task processing.
