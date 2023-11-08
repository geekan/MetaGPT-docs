# [T]RFC-116-MetaGPT优化方案

**文档负责人** ：马莘权

文档修改记录

| **日期**   | **版本** | **作者** | **修改内容**   |
| ---------- | -------- | -------- | -------------- |
| 2023-10-25 | v1       | 马莘权   | 创建           |
| 2023-11-3  | v2       | 马莘权   | 删掉无用的设计 |
|            |          |          |                |

- *撰写设计文档时，请删除模板中的绿色注释*
- 设计文档的版本信息请使用产品版本，便于跟踪，例如 v2.10.0、v1.4.2 等
- 对于某个项目或功能是否需要设计文档，由设计者根据工作量和同事的反馈决定。设计文档需要包含修改记录，从而方便辨识文档的修改历史。文档出来后，每轮评审需指定时间窗口，设计者根据评审反馈更新文档，并最新上述文档版本。设计文档需要包含文档状态

文档审核状态

| **审核人** | **邀请日期** | **审核日期** | **评论** |
| ---------- | ------------ | ------------ | -------- |
| @洪思睿    | 2023-10-26   | 2023-10-30   | LGTM     |
| @林义章    | 2023-10-30   | 2023-10-30   |          |
| @王金淋    | 2023-10-30   | 2023-10-30   |          |
| @吴承霖    | 2023-10-30   | 2023-10-30   |          |
| @沈楚城    | 2023-10-26   | 2023-10-30   | LGTM     |

设计文档必须包含文档审核记录，审核人必须包含相关模块的负责人或开发（必须包括团队 TL，其他审核人由作者自行邀请）。设计者需要得到审核人的通过设计才能通过。审核的评论包括 **Reviewing | LGTM | LBTM | 自定义**：Reviewing 表示正在审核中，LGTM（looks good to me） 表示审核通过，LBTM（looks bad to me）表示审核不通过，自定义表示一些 General 的评论

系统设计文档审核通过标准：

1. 文档中不存在明显细节性错误：大小写、缩进、空格、标题、错别字等
2. 解决评审会上提出的问题，更新设计文档
3. 绝大部分评论由评论者关闭
4. 所有审核人在上述“文档审核状态”表格中给出 LGTM

1. ## 引言

1. ### 背景

鉴于MetaGPT框架已经在软件公司、狼人杀等场景得到应用，希望通过总结现有落地过程中发现的问题，来优化MetaGPT框架设计，以简化后续算法同学、第三方同学的开发工作，简化MetaGPT向Agent的迁移工作。

相关会议记录参阅[MG复刻-框架合入设计](https://deepwisdom.feishu.cn/wiki/Vd0twem2Xi683lk0qPqcj1RFnhe) 

1. ### 目标

明确下一步的MetaGPT框架优化方向，以：

1. 简化后续算法同学的开发工作
2. 简化第三方的开发工作
3. 简化MetaGPT向Agent的迁移工作

1. ## 系统设计

1. ### 系统架构

1. #### MetaGPT内部的消息处理

1. ##### 现状

![img](https://deepwisdom.feishu.cn/space/api/box/stream/download/asynccode/?code=NzJlNjNmNDA1ZGNkMDg3NWIxNWY1ODM3NGU0MjRiMGFfMG1sUklQcllvU0tUTG1QWnF5dVk2bEdkbzdoc2ptM0VfVG9rZW46SjA4TmJFMjJ5b1ZRYTV4bFgyNGNTaVZ4bkZmXzE2OTkzNDA5NjA6MTY5OTM0NDU2MF9WNA)

现有设计适合简单、轻量的智能体应用。

在处理持续交互、跨网交互方面存在如下问题：

1. 对于多轮场景，超参“n_round”的值难统一、难推荐。比如挖矿场景、软件开发场景。
2. 共享式的消息存放不支持跨网的消息消费；
3. 共享式的消息存放不支持个性化role对象的记忆压缩和信息隔离，如下图所示：

![img](https://deepwisdom.feishu.cn/space/api/box/stream/download/asynccode/?code=Mjc0MTQxMjZjOTJiZTcxOGNiODA5ZDU3MmJmZjY4YmRfUHpJS2VPN3VMUDY2bDJ0ZU53dndMMkcwMWNXWElrdXpfVG9rZW46QVVqMWJiWm1kb3l6UGV4a2R4TGM3SGV4blZkXzE2OTkzNDA5NjA6MTY5OTM0NDU2MF9WNA)

1. ##### 新的架构方案

1. ###### 自适配event loop

新架构中，Env对象的event loop终止的方式为：

1. Env对外提供`is_idle`状态；
2. 外部可通过调Env的stop函数来终止event loop;
3. 外部通过调start函数来启动event loop。start参数中可指定event loop是否在空闲时自动终止。

![img](https://deepwisdom.feishu.cn/space/api/box/stream/download/asynccode/?code=OWMxOGYyY2MwZjU4MzliYTYwOGE1YWJmYTg4ZGQ4NTRfTWVaNWY0NWttaUlJSU5zWkdpVTlqWDAyVVF3alY1SWxfVG9rZW46U0dYcWJuNlVXb29qTzd4bnhmQmNtMVc3bnFiXzE2OTkzNDA5NjA6MTY5OTM0NDU2MF9WNA)

新架构中：

1. 所有消息均通过`Environment`对象提供的路由功能，将消息存放到各个`Role`对象私有的消息buffer中；
2. 所有状态数据都存放到一个支持序列化和反序列化的`StateContext`对象中；
3. Env对象通过检查内部各个role是否都空闲来判断是否需要结束event loop；
4. 跨role对象的消息转发统一由`Environment`对象负责。

1. #### 状态数据管理

现状中，并未规范状态数据的存放原则。

新方案中，`Role`对象私用的状态数据统一存放在Role对象自己的`StateContext`对象中；跨`Role`对象的状态数据统一存放在`Environment`对象的`StateContext`对象中。

`Environment`提供`save`和`load`函数，用于对`Environment`对象内部的状态数据存档和恢复。

1. #### 消息结构

1. ##### 现状

现存的消息结构如图所示：

![img](https://deepwisdom.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTM5YzU4YTNlM2JiYWRiNDkzNGU2YTM5MGEwZGI5YmFfTWhZV2Ntam8xb3dMQmFXeHpuZ3FSZ3d2cmp6R3JrZlBfVG9rZW46RnBMb2JLRzhab0RjSzh4U0Ywd2NWUjA4bkFjXzE2OTkzNDA5NjA6MTY5OTM0NDU2MF9WNA)

其中：

1. `content`用来存放消息内容；
2. `instruct_content`功能与`content`相同，区别是存放的是结构化的数据。
3. `role`是OPENAI规范中定义的`role`的值，是调LLM的参数的一部分。本质是meta信息的一部分。
4. `cause_by`被同时用作分类（一种meta信息）标签和路由标签：
   1. ```Python
      async def _observe(self) -> int:
          await super()._observe()
          # accept the very first human instruction (the debate topic) or messages sent (from opponent) to self,
          # disregard own messages from the last round
          self._rc.news = [msg for msg in self._rc.news if msg.cause_by == BossRequirement or msg.send_to == self.name]
          return len(self._rc.news)
      ```
5. `sent_from`被用作展示时显示的发言者信息。本质是meta信息的一部分。
6. `send_to`被用作路由参数，用来在从共享消息队列中筛选发给自己的消息：
   1. ```Python
      async def _observe(self) -> int:
          await super()._observe()
          self._rc.news = [
              msg for msg in self._rc.news if msg.send_to == self.profile
          ]  # only relevant msgs count as observed news
          return len(self._rc.news)
      ```
7. `restricted_to`被用作群发（一发多）的路由参数，用来从共享消息队列中筛选发给自己的消息：
   1. ```Python
      async def _think(self):
          news = self._rc.news[0]
          assert news.cause_by == InstructSpeak  # 消息为来自Moderator的指令时，才去做动作
          if not news.restricted_to:
              # 消息接收范围为全体角色的，做公开发言（发表投票观点也算发言）
              self._rc.todo = Speak()
          elif self.profile in news.restricted_to.split(","):
              # FIXME: hard code to split, restricted为"Moderator"或"Moderator,角色profile"
              # Moderator加密发给自己的，意味着要执行角色的特殊动作
              self._rc.todo = self.special_actions[0]()
      ```

1. ##### 新的方案

新方案明确定义了Meta信息和路由信息：

1. 独立的Meta信息改用key-value形式存储，以支持更轻便的业务扩展；
2. 路由信息采用结构化数据格式，以支持：
   1. 在事件驱动的框架内，支持按指定的工作流来处理消息；
   2. 增强路由功能，支持单发（一发一）和群发（一发多）；
3. 有些群发逻辑与场景逻辑相关，可通过在Environment类中增加代码的方式实现。比如狼人杀中，给所有狼人发消息。开发者只需在Environment类中定义相应的路由规则和名称，就可以在Message的路由信息中使用这些名称。

新方案的消息结构分成3块：消息内容、meta信息和路由信息。比如下面这种消息结构，既支持单发、群发，又支持按DAG顺序调用：

```Python
{
    "content": "xxxx",
    "instruct_content": null,
    "meta_info_": {
        "role": "user",
        "cause_by": "WriteCode",
        "send_from": "A"
    },
    "route_": [
        {
            "from": "A",
            "to": [
                "B"
            ]
        }
    ]
}
```

1. #### 代码移植

1. ##### 多机交互

由于新方案将路由收敛到Environment类的对象Env内，在与外部业务对接时，只需修改Environment类的代码就可实现消息路由的互联互通。

![img](https://deepwisdom.feishu.cn/space/api/box/stream/download/asynccode/?code=YTM1M2JjZDg4YWQ3MTc0Yzc0YmQ0ZjJiNzgzNjliYjNfN2R1NlRCNFVFZzJIMHpHQjFyTlNkQTRCYlpxMU5aRnRfVG9rZW46UkFjUmI4ZDdUbzliSnp4UEtmWmN3VzZkbkRmXzE2OTkzNDA5NjA6MTY5OTM0NDU2MF9WNA)

以狼人杀为例：

Console版的狼人杀，“Env”中用户名与role对象是一一对应的。

在人机交互情况下，“Env”中的用户名与role无法一一对应。当“Env”无法找到消息接收者的路由时，可以将消息转发给“业务Env”处理，由“业务Env”进行转发。

1. ##### 分布式部署

![img](https://deepwisdom.feishu.cn/space/api/box/stream/download/asynccode/?code=OGU1MDczOTc0MTNjZTNhZGM3YzM5YzA2YTk2MmYzMWVfalBGZ0JOZndjY1YzdGtGSzVGTzc1T2MxMkNrYzhVaTFfVG9rZW46VlB5RGJCMTBVb2RlWXN4OHRaSmNtWGdubk9kXzE2OTkzNDA5NjA6MTY5OTM0NDU2MF9WNA)

新方案规范了状态数据的使用，便于实现快速平行扩容和故障恢复。

1. #### 可编程框架

现有框架并未提供可编程能力。

新方案将Agent的编程能力分为两层：

1. ##### API层

API层完全由人工开发，它提供了基础的python函数。

为了支持LLM识别和使用这些API，API采用[[S\]RFC-086-Agent Store OPENAPI接口协议规范](https://deepwisdom.feishu.cn/wiki/J1UMw1iNLiY3q8k1iXncpT2InLh) 标准进行声明。Agent可通过理解这些声明文件来学习如何调用这些API。

1. ##### SKILL层

SKILL层的API可以由Agent开发和积累。

为了支持LLM识别和使用这些API，API采用[[R\]RFC-102-Agent Skill Specification](https://deepwisdom.feishu.cn/wiki/LQ6lwD5GSiGF4FklLE1cbNzPnvd) 标准进行声明。

Agent在完成函数代码开发后，还需要额外写函数对应的声明文件，供后续查询、调用使用。

1. ### MetaGPT需改造的模块

1. #### Message结构（shenquan)

现有的Message结构需要优化如下地方：

1. 规范和简化Message的属性：将属性分成消息内容、meta信息和路由信息3部分：

```Python
{
    "content": "xxxx",
    "instruct_content": null,
    "meta_info": {},
    "route": []
}
```

1. Message对象增加序列化反序列化函数：save/load

代码如下：

```Python
class Routes(BaseModel):
    """Responsible for managing routing information for the Message class."""

    routes: List[Dict] = Field(default_factory=list)

    def set_from(self, value):
        """Set the label of the message sender."""
        route = self._get_route()
        route[MESSAGE_ROUTE_FROM] = value

    def set_to(self, tags: Set):
        """Set the labels of the message recipient."""
        route = self._get_route()
        if tags:
            route[MESSAGE_ROUTE_TO] = tags
            return

        if MESSAGE_ROUTE_TO in route:
            del route[MESSAGE_ROUTE_TO]

    def add_to(self, tag: str):
        """Add a label of the message recipient."""
        route = self._get_route()
        tags = route.get(MESSAGE_ROUTE_TO, set())
        tags.add(tag)
        route[MESSAGE_ROUTE_TO] = tags

    def _get_route(self) -> Dict:
        if not self.routes:
            self.routes.append({})
        return self.routes[0]

    def is_recipient(self, tags: Set) -> bool:
        """Check if it is the message recipient."""
        route = self._get_route()
        to_tags = route.get(MESSAGE_ROUTE_TO)
        if not to_tags:
            return True

        for k in tags:
            if k in to_tags:
                return True
        return False

    @property
    def tx_from(self):
        """Message route info tells who sent this message."""
        route = self._get_route()
        return route.get(MESSAGE_ROUTE_FROM)

    @property
    def tx_to(self):
        """Labels for the consumer to filter its subscribed messages."""
        route = self._get_route()
        return route.get(MESSAGE_ROUTE_TO)


class Message(BaseModel):
    """list[<role>: <content>]"""

    content: str
    instruct_content: BaseModel = None
    meta_info: Dict = Field(default_factory=dict)
    route: Routes = Field(default_factory=Routes)

    def __init__(self, content, **kwargs):
        """
        Parameters not listed below will be stored as meta info.
        :param content: Message content.
        :param instruct_content: Message content struct.
        :param meta_info: Message meta info.
        :param route: Message route configuration.
        :param tx_from: Message route info tells who sent this message.
        :param tx_to: Labels for the consumer to filter its subscribed messages.
        :param cause_by: Labels for the consumer to filter its subscribed messages, also serving as meta info.
        :param role: Message meta info tells who sent this message.
        """
        super(Message, self).__init__(
            content=content or kwargs.get("content"),
            instruct_content=kwargs.get("instruct_content"),
            meta_info=kwargs.get("meta_info", {}),
            route=kwargs.get("route", Routes()),
        )

        attribute_names = Message.__annotations__.keys()
        for k, v in kwargs.items():
            if k in attribute_names:
                continue
            if k == MESSAGE_ROUTE_FROM:
                self.set_from(v)
                continue
            if k == MESSAGE_ROUTE_CAUSE_BY:
                self.meta_info[k] = v
            if k == MESSAGE_ROUTE_TO or k == MESSAGE_ROUTE_CAUSE_BY:
                self.add_to(v)
                continue
            self.meta_info[k] = v

    def get_meta(self, key):
        """Get meta info"""
        return self.meta_info.get(key)

    def set_meta(self, key, value):
        """Set meta info"""
        self.meta_info[key] = value

    @property
    def role(self):
        """Message meta info tells who sent this message."""
        return self.get_meta(MESSAGE_META_ROLE)

    @property
    def cause_by(self):
        """Labels for the consumer to filter its subscribed messages, also serving as meta info."""
        return self.get_meta(MESSAGE_ROUTE_CAUSE_BY)

    @property
    def tx_from(self):
        """Message route info tells who sent this message."""
        return self.route.tx_from

    @property
    def tx_to(self):
        """Labels for the consumer to filter its subscribed messages."""
        return self.route.tx_to

    def set_role(self, v):
        """Set the message's meta info indicating the sender."""
        self.set_meta(MESSAGE_META_ROLE, v)

    def set_from(self, v):
        """Set the message's meta info indicating the sender."""
        self.route.set_from(v)

    def set_to(self, tags: Set):
        """Set the message's meta info indicating the sender."""
        self.route.set_to(tags)

    def add_to(self, tag: str):
        """Add a subscription label for the recipients."""
        self.route.add_to(tag)

    def is_recipient(self, tags: Set):
        """Return true if any input label exists in the message's subscription labels."""
        return self.route.is_recipient(tags)

    def __str__(self):
        # prefix = '-'.join([self.role, str(self.cause_by)])
        return f"{self.role}: {self.content}"

    def __repr__(self):
        return self.__str__()

    def to_dict(self) -> dict:
        """Return a dict containing `role` and `content` for the LLM call.l"""
        return {"role": self.role, "content": self.content}

    def save(self) -> str:
        """Convert the object to json string"""
        return self.json(exclude_none=True)

    @staticmethod
    def load(v):
        """Convert the json string to object."""
        try:
            d = json.loads(v)
            return Message(**d)
        except JSONDecodeError as err:
            logger.error(f"parse json failed: {v}, error:{err}")
        return None
```

1. #### 将公共消息存储改造成Role私有的消息存储(shenquan)

1. 取消公共消息存储，改为Role私有的消息存储。
   1. ```Python
      class RoleContext(BaseModel):
          """Role Runtime Context"""
          env: 'Environment' = Field(default=None)
          memory: Memory = Field(default_factory=Memory)
          long_term_memory: LongTermMemory = Field(default_factory=LongTermMemory)
          state: int = Field(default=0)
          todo: Action = Field(default=None)
          watch: set[Type[Action]] = Field(default_factory=set)
          news: list[Type[Message]] = Field(default=[])
      ```

   2. Role中的所有`self._rc.env.memory`操作变更为`self._rc.memory`操作。
2. 所有消息转发都由`Environment`类的Env对象负责。禁止role对象之间通过访问对方的私有消息存储来交换消息。
   1. ![img](https://deepwisdom.feishu.cn/space/api/box/stream/download/asynccode/?code=NGFiYzQzYTI2ZDNlZmY5ZjhiM2Y1YTBjYzNkMDhhYzJfRVMzeDFvZjRuRDZxYk5BdUFMR1h5WDJiQjhuWnFsTkVfVG9rZW46V24wQWJVZWx6b0FYMnp4REM0YmNJTEdZbllnXzE2OTkzNDA5NjA6MTY5OTM0NDU2MF9WNA)
3. 所有role对象增加一个私有的消息buffer，来接收异步put_message写入的消息。role对象的observe操作需要同时看消息buffer和memory。

1. #### 取消超参k(chucheng)

目前流程的终止依靠`Environment`的`run`的超参`k`和`CostManager`的成本超支检查。

```Python
async def run(self, k=1):
    """处理一次所有信息的运行
    Process all Role runs at once
    """
    # while not self.message_queue.empty():
    # message = self.message_queue.get()
    # rsp = await self.manager.handle(message, self)
    # self.message_queue.put(rsp)
    for _ in range(k):
        futures = []
        for role in self.roles.values():
            future = role.run()
            futures.append(future)

        await asyncio.gather(*futures)
```

新的流程终止条件改为所有的roles对象的think都为空（Role对象私有的消息buffer为空，且无action），或者成本超支。

1. #### 规范状态数据的存储

1. 新建一个支持序列化和反序列化save/load的StateContext类
2. 所有状态数据都需要放到这个类对象中。
3. 仅限`Environment`类和`Role`类拥有这个类的对象。

1. ## 风险评估

1. ### 风险与应对措施

说明一下方案的风险，比如前后兼容性、安全漏洞、信息不一致、性能影响等问题

针对每个风险，设计者需要评估一个较为合理的应对措施，例如升级脚本、操作手册、文档说明等（可以与评审人讨论）

1. ### 局限性

（可选）局限性指明方案当前所不具备的能力或不足之处

1. ### 遗留问题与优化点

遗留问题与优化点章节需要将未解决的问题，但计划在未来版本中解决的问题列出来。例如：本设计文档未对接某权限角色，计划在 v2.xx 版本中由权限小组统一优化架构。

注意尽量保证这里列出的问题都能在 Jira 系统中追溯

1. ## 附录[optional]

1. ### 术语及定义

将比较生僻的概念，使用的技术，或者文档自定义的概念进行说明，同时也可以给出链接。推荐使用表格形式

| 术语 | 定义 |
| ---- | ---- |
|      |      |
|      |      |

1. ### 参考

列出参考过的文档，方便评审人理解和验证文档中提到的功能