# MGX环境

[代码入口](https://github.com/geekan/MetaGPT/tree/main/metagpt/environment/mgx/mgx_env.py)
MGXEnv 是一个通用的多智能体协作环境，提供了一个灵活而强大的交互框架。在初始化时，环境支持自定义配置多个不同角色的智能体，每个智能体都配备有特定的提示词系统来指导其行为和职责。环境的核心特征是其独特的消息管理机制：由 TeamLeader 作为中央协调者，统一管理所有消息的流转和分发。这种设计既确保了信息传递的有序性，又支持灵活的交互方式，包括公开对话和私密通信。 通过这种架构设计，MGXEnv 能够有效支持复杂的多智能体协作场景，使得不同角色能够根据各自的专业领域和任务要求，高效地完成分工协作。

## 空间定义

### 消息空间

MGXEnv 主要处理多智能体环境中的消息路由和发布。核心消息空间由 Message 类定义,结构如下:

定义:

```python
from gymnasium import spaces

space = {
    "role": spaces.Text(16),         # 消息角色类型
    "content": spaces.Text(1024),    # 实际消息内容
    "sent_from": spaces.Text(32),    # 发送者名称
    "send_to": spaces.Set(spaces.Text(32)),  # 接收者名称集合
    "metadata": spaces.Dict(),       # 额外元数据如图片
}
```

消息空间组件说明:

| 字段      | 说明             | 取值说明                             |
| --------- | ---------------- | ------------------------------------ |
| role      | 消息角色类型     | ["user", "assistant", "system"] 之一 |
| content   | 实际消息内容     | 最大长度1024字符                     |
| sent_from | 消息发送者名称   | 最大长度32字符                       |
| send_to   | 接收者名称集合   | 每个名称最大32字符                   |
| metadata  | 额外的消息元数据 | 包含可选字段(如图片)的字典           |

消息示例:

```python
from metagpt.schema import Message

Message(
    role="assistant",
    content="我已完成分析。",
    sent_from="Alice",
    send_to={"Mike", "<all>"},
    metadata={"agent": "Emma"}
)
```

### 通信模式

环境支持两种通信模式:

1. 公共聊天模式(默认)

- 所有消息对所有角色可见(send_to 包含 \<all\>)
- 由团队领导(Mike)协调消息流
- 消息存储在环境历史记录中

2. 直接聊天模式

- 当用户直接与特定角色对话时触发
- 仅在用户和目标角色之间进行
- 绕过团队领导
- 消息是否发布给所有人取决于 is_public_chat 标志

这个环境主要关注消息的路由和协调,而不是其他环境中常见的状态/动作空间。

## 使用

```python
from metagpt.environment.mgx.mgx_env import MGXEnv
from metagpt.roles.di.team_leader import TeamLeader
from metagpt.schema import Message
from metagpt.roles import (
    Architect,
    Engineer,
    ProductManager,
    ProjectManager,
    QaEngineer,
)

env = MGXEnv()

env.add_roles(
        [
            TeamLeader(),
            ProductManager(),
            Architect(),
            ProjectManager(),
            Engineer(n_borg=5, use_code_review=True),
            QaEngineer(),
        ]
    )
requirement = "create a 2048 game"
tl = env.get_role("Mike")
env.publish_message(Message(content=requirement, send_to=tl.name))
await tl.run()

```
