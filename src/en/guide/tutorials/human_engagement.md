# Human Engagement

When we talk about agents, we usually mean it to be LLM-driven. However, in some real scenarios, we do want humans to step in, whether it's for quality assurance in a project, guidance offering in critical decision-making, or role playing in a game. In this tutorial, we talk about how to take humans into the SOP.

After this tutorial, you will be able to:

- Introduce interaction between LLM-based agents and human

## Switch between LLM and human

We will reuse the exact example in [MultiAgent 101](multi_agent_101).

Originally, an LLM assumes the `SimpleReviewer`. Suppose we want more control over the review process, we may take up the `Role` ourselves. This is enabled by just one switch: set `is_human=True` upon initialization. The code becomes:

```python
team.hire(
    [
        SimpleCoder(),
        SimpleTester(),
        # SimpleReviewer(), # the original line
        SimpleReviewer(is_human=True), # change to this line
    ]
)
```

We are a human `SimpleReviewer` interacting with the two LLM-based agents `SimpleCoder` and `SimpleTester` now. We can comment on the unit tests from `SimpleTester`, requesting more coverage or edge cases. The feedback is then sent back to the tester for writing a new version. The switch is complete agnostic to the original SOP and `Role` definition, meaning applicability to general scenarios.

Each time when it's our turn to respond, the running process will pause to wait for our input. Just type in what we want, we are sending our messages to the agents!

> Constraint:  
> For develops who customize `Role`'s `_act` function, the `Action`s called in `_act` must be among the `self._actions` initialized with `set_actions` for the human engagement to take effect.

> LIMITATION:  
> Currently the interaction is through terminal input, which is inconvenient for multi-line or structured writeup. Meanwhile, users must adhere to the prompt in content or format like what we require of an LLM, in order for the logic after human input works as usual. We will provide solutions to these issues in following update.

## Complete script of this tutorial

https://github.com/geekan/MetaGPT/blob/main/examples/build_customized_multi_agents.py

Run it with

```sh
python3 examples/build_customized_multi_agents.py --add_human True
```

A sample interaction

<video  controls>
  <source src="/image/guide/tutorials/human_engagement.mp4" type="video/mp4">
</video>
