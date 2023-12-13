# Concepts

After this tutorial, you will be able to:

- Understand MetaGPT's concept of agent and environment
- How agents interact with each other and what a multi-agent collaboration may look like

The goal is to provide an intuitive and <b>simplified</b> explanation of the concepts so that users have a background to further explore the tutorial series. While we aim for clarity, we also recognize simplifications can produce inaccuracy or omission. Therefore, we encourage more navigation over subsequent documents for a complete comprehension.

You may also jump to [Agent101](agent_101) if you want hands-on coding first.

Check out our [paper](https://arxiv.org/abs/2308.00352) if you want more rigorous explanation.

## Agent

Academia and industry have proposed various definitions for the term "agent". Roughly speaking, an agent should be able to think or plan like human, possesses memories or even emotions, is equipped with a certain skill set to interact with the environment, other agents, and human. An agent, in a comprehensive examination, is a sophisticated system by itself.

In our view, we imagine an agent as a digital organism within an environment, where

> Agent = Large Language Model (LLM) + Observation + Thought + Action + Memory

This formula encapsulates the essence of what makes an agent function. To understand each component, let's draw parallels with human functionality:

1. Large Language Model (LLM): The LLM functions as part of the 'brain' of the agent, enables it to process information, learn from interactions, make decisions, and perform actions.
2. Observation: This is the agent's sensory mechanism, allowing it to perceive its environment. An agent might receive a range of signals such as text inputs from another agent's messages, visual data from surveillance cameras, or audio from a customer service recording. The observations form the basis for all subsequent actions.
3. Thought: Thought processes involve analyzing observations, drawing from memory, and considering possible actions. It's the agent's internal decision-making process, which may be powered by LLM.
4. Action: These are the agent's visible responses to its thoughts and observations. They can range from generating code with LLM to manually predefined operations such as reading a local file. Agents can also execute tool-using actions, including searching the web for weather, using a calculator to do maths, and more.
5. Memory: An agent's memory stores past experiences. It is crucial for learning, as it allows the agent to reference previous outcomes and adjust future actions accordingly.

## MultiAgent

A MultiAgent System can be thought of as a society of agents, where

> MultiAgent = Agents + Environment + Standard Operating Procedure (SOP) + Communication + Economy

Each of these components plays a vital role:

1. Agents: Defined individually above, agents within a multi-agent system work in concert, each with their unique LLM, observations, thoughts, actions, and memories.
2. Environment: The environment is the shared space where agents exist and interact. Agents observe important information from the environment and publish action output for others to make use of.
3. Standard Operating Procedure (SOP): These are the established procedures that govern agent behaviors and interactions, ensuring orderly and efficient operations within the system. For example, in a car manufacturing SOP, one agent welds the car parts while another installs the wiring, maintaining an orderly assembly line.
4. Communication: Communication is the exchange of information among agents. It's vital for collaboration, negotiation, and competition within the system.
5. Economy: This refers to the system of value exchange within the multi-agent environment, dictating how resources are allocated and tasks are prioritized.

## An Illustration

![img](/image/guide/tutorials/concepts_example.png)

This is a simple example showing how agents work

- In the environment, three agents Alice, Bob, Charlie interact with each other.
- They can publish messages or their action output to the environment, which, in turn, are observed by others.
- We expose the inner process of one agent, Charlie. The same process also applies to Alice and Bob.
- Internally, agent Charlie possess the components we introduce above. They are LLM, Observation, Thought, Action, where the Thought and Action process can be empowered by LLM. The agent can also use tools during its action.
- Charlie observes relevant documents from Alice and requirements from Bob, recall useful memories, thinks about how to write code, take the actual writing action, and finally publishes any outcome.
- Charlie informs Bob of its action outcome by publishing it to the environment. Bob responds with a compliment after receiving it.

Now you have a first glance of the concepts. Feel free to proceed to the next step and see how MetaGPT provides a framework for you to create agents and their dynamics.
