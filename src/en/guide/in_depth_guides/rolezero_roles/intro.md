# RoleZero Architecture Design Specification

## **Background: Evolution from SOPs to a General Agent Framework**

In traditional agent frameworks, **Standard Operating Procedures (SOPs)** serve as the core solution for addressing specific scenarios. For example, in a software development environment, SOPs strictly define the code directory structure, data interaction formats, and task execution sequences. However, these SOPs have significant drawbacks:

1.  **Strong scenario dependency**: SOPs are highly coupled with specific business scenarios, making them difficult to adapt to other domains (e.g., healthcare, finance).
1.  **Poor scalability**: Adding new business requirements necessitates custom development, leading to high development costs and low iteration efficiency.
1.  **Weak fault tolerance**: If the process is interrupted, it cannot resume from the breakpoint and must restart from the beginning.

For example, in a software company, SOPs require agents to interact with data in a fixed directory structure. However, third-party projects may use different structures, rendering the agent incompatible. Therefore, a **modular and generalized** framework is needed to decouple processes from scenarios, enhancing the agent's adaptability.

## **Objective: Building Core Capabilities for a General Agent**

The goal of RoleZero is to **overcome the limitations of SOPs through atomic functional elements and dynamic process orchestration**, achieving the following capabilities:

1.  **Flexible process orchestration**: Solve business problems dynamically using `while loops` or **chained atomic units** without custom development.
1.  **Breakpoint recovery**: Resume tasks from the last successful node in case of an exception.
1.  **Seamless business integration**: Support cross-domain collaboration (e.g., software company SOPs directly modifying third-party code) without additional development.

## **Core Capabilities of RoleZero**

As a general template for agents, RoleZero covers the entire lifecycle of intelligent agents:

1.  **Data Understanding (ENV/IO)** : Dynamically parse the structure and semantics of environmental inputs (e.g., code, documents).

2.  **Observation (Observe)** : Filter and format key data from the environment (ENV) for decision-making.

3.  **Thinking (Think)** : Dynamically generate or adjust task plans, supporting four types of decision logic:

    - **Task decomposition**: Break down ambiguous goals into atomic subtasks (e.g., "Develop login feature" → Design API → Write code → Test).
    - **Task retry**: Adjust task constraints based on error feedback (e.g., add code format checks).
    - **Process progression**: Mark the current task as complete and trigger the next task.
    - **Human assistance**: Seek user clarification when unable to make decisions (e.g., asking for additional data or seeking user suggestions in case of errors or uncertainty).

4.  **Execution (Act)** : Call tools to execute atomic tasks, supporting experience reuse and context injection.

5.  **Memory (Memory)** : Store task states and historical data.

6.  **Evaluation (Evaluate)** : Dynamically verify task results.
