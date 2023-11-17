# 人类参与

当我们谈论智能体时，通常指的是由LLM驱动的。然而，在一些实际情境中，我们确实希望人类介入，无论是为了项目的质量保证，在关键决策中提供指导，还是在游戏中扮演角色。在本教程中，我们将讨论如何让人类参与纳入SOP。

完成本教程后，你将能够：
- 引入基于LLM的智能体和人类之间的交互

## 在LLM和人类之间切换
我们将重用 [多智能体入门](multi_agent_101) 中的确切示例。

最初，LLM扮演 `SimpleReviewer` 的角色。假设我们想对更好地控制审阅过程，我们可以亲自担任这个`Role`。这只需要一个开关：在初始化时设置 `is_human=True`。代码变为：
```python
team.hire(
    [
        SimpleCoder(),
        SimpleTester(),
        # SimpleReviewer(), # 原始行
        SimpleReviewer(is_human=True), # 更改为这一行 
    ]
)
```
我们作为人类充当 `SimpleReviewer`，现在与两个基于LLM的智能体 `SimpleCoder` 和 `SimpleTester` 进行交互。这个切换对于原始的SOP和 `Role` 定义是完全不可见的（无影响），这意味着可以应用于任何场景。

每次轮到我们回应时，运行过程将暂停并等待我们的输入。只需输入我们想要输入的内容，然后就将消息发送给替他智能体！

> 约束：
> 对于自定义 `Role` 的 `_act` 函数的开发人员，`_act` 中调用的 `Action` 必须是在 `self._init_actions` 初始化时与 `self._actions` 中的动作之一，以便人类参与生效。

## 本教程的完整脚本
https://github.com/geekan/MetaGPT/blob/main/examples/build_customized_multi_agents.py

使用以下命令运行
```sh
python examples/build_customized_multi_agents.py --add_human True
```

一个交互示例

<video  controls>
  <source src="/image/guide/tutorials/human_engagement.mp4" type="video/mp4">
</video>