# Use Memories

As discussed in [Concepts](concepts), Memory is one of the core components of an agent. Agent needs memory to have an essential context for making decision or perform actions. It also need memory to learn skills or accumulate experience. In this tutorial, we cover basic memory usage.

After this tutorial, you will be able to:

1. Understand what memories are like in MetaGPT
2. How to add or retrieve memories

## What are memories like

Class `Memory` is the abstraction for an agent's memory in MetaGPT. When initialized, `Role` acquire its `Memory` as `self.rc.memory`, which will store every `Message` it later `_observe` in a list for future retrieval. The initialization and storage are handled by the framework. In short, memories of a `Role` are a list of `Message`s.

## Retrieve memory

When recorded memories are needed, such as serving as context for a LLM call, you can use `self.get_memories`. The function definition is as follows:

```python
def get_memories(self, k=0) -> list[Message]:
    """A wrapper to return the most recent k memories of this role, return all when k=0"""
    return self.rc.memory.get(k=k)
```

For example, in [MultiAgent101](multi_agent_101), we call this function to provide the tester with the full history. In this way, if the reviewer provides feedback, the tester can modify test cases with reference to their previous version. The snippet is as follows

```python
async def _act(self) -> Message:
        logger.info(f"{self._setting}: ready to {self.rc.todo}")
        todo = self.rc.todo

        # context = self.get_memories(k=1)[0].content # use the most recent memory as context
        context = self.get_memories() # use all memories as context

        code_text = await todo.run(context, k=5) # specify arguments

        msg = Message(content=code_text, role=self.profile, cause_by=todo)

        return msg
```

## Add memory

For adding memories, one can use `self.rc.memory.add(msg)` where `msg` must be an instance of `Message`. Check the snippet above for an example usage.

It is recommended to add `Message`s of action output to the `Role`'s memory when defining the `_act` logic. `Role` normally needs to remember what it said or did previously in order to take a next step.

## Next step

Memory is a huge topic in agents. To be precise, the memory this tutorial talks about corresponds to the concept of "short-term memory". The retrieval is also based on simple recency. However, there are multiple branches of memories as well as a wide range of memory generation and retrieval techniques. Please consult [Memory](/en/guide/in_depth_guides/memory) for using memory to really boost your agent's performance.
