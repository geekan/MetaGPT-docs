# 序列化&断点恢复

## 定义

断点恢复指在程序运行过程中，记录程序不同模块的产出并落盘。当程序碰到外部如`Ctrl-C`或内部执行异常如LLM Api网络异常导致退出等情况时。再次执行程序，能够从中断前的结果中恢复继续执行，而无需从0到1开始执行，降低开发者的时间和费用成本。

## 序列化与反序列化

为了能支持断点恢复操作，需要对程序中的不同模块产出进行结构化存储即序列化的过程，保存后续用于恢复操作的现场。序列化的操作根据不同模块的功能有所区分，比如角色基本信息，初始化后即可以进行序列化，过程中不会发生改变。记忆信息，需要执行过程中，实时进行序列化保证完整性（序列化耗时在整个程序执行中的占比很低）。这里，我们统一在发生异常或正常结束运行时进行序列化。

## 实现逻辑

### 可能产生中断的情况

- 网络等问题，LLM-Api调用重试多次后仍失败
- Action执行过程中，输出内容解析失败导致退出
- 人为的`Ctrl-C`对程序进行中断

### 序列化存储结构

为了减少后续新增功能对存储结构的影响，使用“一体化“的单json文件进行存储。

当程序发生中断或结束后，在存储目录下的文件结构如下：

```bash
./workspace
  storage
    team
      team.json          # 包含团队、环境、角色、动作等信息
```

<details>

<summary>team.json 对应内容的数据概要示例。</summary>

```json
{
  "env": {
    "desc": "",
    "roles": {
      "Role A": {},
      "Role B": {
        "name": "RoleB",
        "profile": "Role B",
        "goal": "RoleB's goal",
        "constraints": "RoleB's constraints",
        "desc": "",
        "is_human": false,
        "role_id": "",
        "states": [
          "0. <class 'tests.metagpt.serialize_deserialize.test_serdeser_base.ActionOK'>",
          "1. <class 'tests.metagpt.serialize_deserialize.test_serdeser_base.ActionRaise'>"
        ],
        "actions": [
          {
            "name": "ActionOK",
            "context": "",
            "prefix": "You are a Role B, named RoleB, your goal is RoleB's goal. the constraint is RoleB's constraints. ",
            "desc": "",
            "__module_class_name": "tests.metagpt.serialize_deserialize.test_serdeser_base.ActionOK"
          },
          {
            "name": "ActionRaise",
            "context": "",
            "prefix": "You are a Role B, named RoleB, your goal is RoleB's goal. the constraint is RoleB's constraints. ",
            "desc": "",
            "__module_class_name": "tests.metagpt.serialize_deserialize.test_serdeser_base.ActionRaise"
          }
        ],
        "rc": {
          "memory": {
            "storage": [
              {
                "id": "7cc01798c3324c6c8b676d282ea9e92c",
                "content": "ActionPass run passed",
                "instruct_content": {
                  "class": "pass",
                  "mapping": {
                    "result": "(<class 'str'>, Ellipsis)"
                  },
                  "value": {
                    "result": "pass result"
                  }
                },
                "role": "RoleA(Role A)",
                "cause_by": "tests.metagpt.serialize_deserialize.test_serdeser_base.ActionPass",
                "sent_from": "tests.metagpt.serialize_deserialize.test_serdeser_base.RoleA",
                "send_to": ["<all>"]
              }
            ],
            "index": {
              "tests.metagpt.serialize_deserialize.test_serdeser_base.ActionOK": [
                {
                  "id": "018bde1d4bdb4e9387c1053da0dc0cb3",
                  "content": "ok",
                  "instruct_content": null,
                  "role": "Role B",
                  "cause_by": "tests.metagpt.serialize_deserialize.test_serdeser_base.ActionOK",
                  "sent_from": "tests.metagpt.serialize_deserialize.test_serdeser_base.RoleB",
                  "send_to": ["<all>"]
                }
              ]
            },
            "ignore_id": false
          },
          "state": 1,
          "watch": [
            "tests.metagpt.serialize_deserialize.test_serdeser_base.ActionPass"
          ],
          "react_mode": "by_order",
          "max_react_loop": 1
        },
        "addresses": [
          "RoleB",
          "tests.metagpt.serialize_deserialize.test_serdeser_base.RoleB"
        ],
        "recovered": true,
        "latest_observed_msg": {
          "id": "7cc01798c3324c6c8b676d282ea9e92c",
          "content": "ActionPass run passed",
          "instruct_content": {
            "class": "pass",
            "mapping": {
              "result": "(<class 'str'>, Ellipsis)"
            },
            "value": {
              "result": "pass result"
            }
          },
          "role": "RoleA(Role A)",
          "cause_by": "tests.metagpt.serialize_deserialize.test_serdeser_base.ActionPass",
          "sent_from": "tests.metagpt.serialize_deserialize.test_serdeser_base.RoleA",
          "send_to": ["<all>"]
        },
        "__module_class_name": "tests.metagpt.serialize_deserialize.test_serdeser_base.RoleB"
      }
    },
    "history": "\nHuman: write a snake game\nRoleA(Role A): {'result': 'pass result'}\nHuman: write a snake game"
  },
  "investment": 10.0,
  "idea": "write a snake game"
}
```

</details>

### 恢复时的执行顺序

由于MetaGPT是异步执行框架，对于下述几种典型的中断截点和恢复顺序。

1. 角色A（1个action）-> 角色B（2个action），角色A进行action选择时出现异常退出。
2. 角色A（1个action）-> 角色B（2个action），角色B第1个action执行正常，第2个action执行时出现异常退出。

#### 情况1

执行入口重新执行后，各模块进行反序列化。角色A未观察到属于自己处理的Message，重新执行对应的action。角色B恢复后，观察到一条之前未处理完毕的Message，则在`_observe`后重新执行对应的`react`操作，按react策略执行对应2个动作。

#### 情况2

执行入口重新执行后，各模块进行反序列化。角色A未观察到属于自己处理的Message，不处理。角色B恢复后，`_observe`到一条之前未完整处理完毕的Message，在`react`中，知道自己在第2个action执行失败，则直接从第2个action开始执行。

### 从中断前的Message开始重新执行

一般来说，Message是不同角色间沟通协作的桥梁，当在Message的执行过程中发生中断后，由于该Message已经被该角色存入环境（Environment）记忆（Memory）中。在进行恢复中，如果直接加载角色全部Memory，该角色的`_observe`将不会观察到中断时引发当时执行`Message`，从而不能恢复该Message的继续执行。  
因此，为了保证该Message在恢复时能够继续执行，需要在发生中断后，根据`_observe`到的最新信息，从角色记忆中删除对应的该条Message。

### 从中断前的Action开始重新执行

一般来说，Action是一个相对较小的执行模块粒度，当在Action的执行过程中发生中断后，需要知道多个Actions的执行顺序以及当前执行到哪个Action（`_rc.state`）。当进行恢复时，定位到中断时的Action位置并重新执行该Action。

## 结果

### 断点恢复入口

`metagpt "xxx" --recover_path "./workspace/storage/team"` # 默认序列化到`./workspace/storage/team`中。

### 恢复后继续执行结果

这里提供了一个单测用例用于说明断点恢复执行：

`python3 -s tests/metagpt/serialize_deserialize/test_team.py`的`test_team_recover_multi_roles_save`的执行case

`RoleB`的`ActionRaise`模拟Action异常。执行到该Action时发生异常，序列化项目后退出。 重新启动后，`RoleA`和`RoleB`的`ActionOK`已经执行过，不继续执行。`RoleB`继续从`ActionRaise`执行，碰到异常继续退出。

```bash
2023-12-19 10:26:01.380 | DEBUG    | metagpt.config:__init__:50 - Config loading done.
2023-12-19 10:26:01.381 | DEBUG    | metagpt.config:_ensure_workspace_exists:125 - WORKSPACE_PATH set to /Users/xxxx/work/MetaGPT/workspace
2023-12-19 10:26:02.476 | DEBUG    | metagpt.environment:publish_message:117 - publish_message: {"id": "771137834c34447981f5c66c94eb2657", "content": "write a snake game", "role": "Human", "cause_by": "metagpt.actions.add_requirement.UserRequirement", "sent_from": "", "send_to": ["<all>"]}
2023-12-19 10:26:02.477 | DEBUG    | metagpt.team:run:101 - max n_round=3 left.
2023-12-19 10:26:02.477 | DEBUG    | metagpt.roles.role:_observe:421 - RoleA(Role A) observed: ['Human: write a snake game...']
2023-12-19 10:26:02.477 | DEBUG    | metagpt.roles.role:_set_state:314 - actions=[ActionPass], state=0
2023-12-19 10:26:02.477 | DEBUG    | metagpt.roles.role:_react:452 - RoleA(Role A): self.rc.state=0, will do ActionPass
2023-12-19 10:26:02.477 | INFO     | metagpt.roles.role:_act:373 - RoleA(Role A): ready to ActionPass
2023-12-19 10:26:02.478 | DEBUG    | metagpt.roles.role:run:517 - RoleB(Role B): no news. waiting.
2023-12-19 10:26:07.484 | DEBUG    | metagpt.roles.role:_set_state:314 - actions=[ActionPass], state=-1
2023-12-19 10:26:07.485 | DEBUG    | metagpt.environment:publish_message:117 - publish_message: {"id": "00f068c2570c4435897ef126ee736258", "content": "ActionPass run passed", "instruct_content": {"result": "pass result"}, "role": "Role A", "cause_by": "tests.metagpt.serialize_deserialize.test_serdeser_base.ActionPass", "sent_from": "tests.metagpt.serialize_deserialize.test_serdeser_base.RoleA", "send_to": ["<all>"]}
2023-12-19 10:26:07.486 | DEBUG    | metagpt.environment:run:141 - is idle: False
2023-12-19 10:26:07.486 | DEBUG    | metagpt.team:run:101 - max n_round=2 left.
2023-12-19 10:26:07.487 | DEBUG    | metagpt.roles.role:run:517 - RoleA(Role A): no news. waiting.
2023-12-19 10:26:07.488 | DEBUG    | metagpt.roles.role:_observe:421 - RoleB(Role B) observed: ['Role A: ActionPass run passe...']
2023-12-19 10:26:07.488 | DEBUG    | metagpt.roles.role:_set_state:314 - actions=[ActionOK, ActionRaise], state=0
2023-12-19 10:26:07.489 | INFO     | metagpt.roles.role:_act:373 - RoleB(Role B): ready to ActionOK
2023-12-19 10:26:12.492 | DEBUG    | metagpt.roles.role:_set_state:314 - actions=[ActionOK, ActionRaise], state=1
2023-12-19 10:26:12.492 | INFO     | metagpt.roles.role:_act:373 - RoleB(Role B): ready to ActionRaise
2023-12-19 10:26:12.493 | WARNING  | metagpt.utils.utils:wrapper:96 - There is a exception in role's execution, in order to resume, we delete the newest role communication message in the role's memory.
2023-12-19 10:26:12.499 | ERROR    | metagpt.utils.utils:wrapper:79 - Exception occurs, start to serialize the project, exp:
Traceback (most recent call last):
  File "/Users/xxxx/work/MetaGPT/metagpt/utils/utils.py", line 88, in wrapper
....
    rsp = await self._act_by_order()
  File "/Users/xxxx/work/MetaGPT/metagpt/roles/role.py", line 462, in _act_by_order
    rsp = await self._act()
  File "/Users/xxxx/work/MetaGPT/metagpt/roles/role.py", line 374, in _act
    response = await self.rc.todo.run(self.rc.important_memory)
  File "/Users/xxxx/work/MetaGPT/tests/metagpt/serialize_deserialize/test_serdeser_base.py", line 50, in run
    raise RuntimeError("parse error in ActionRaise")
RuntimeError: parse error in ActionRaise

############################# ---------  此处开始重新执行 ----------- ############################
2023-12-19 10:26:12.515 | DEBUG    | metagpt.environment:publish_message:117 - publish_message: {"id": "0bfdde08d4294f07923201d51b2b0068", "content": "write a snake game", "role": "Human", "cause_by": "metagpt.actions.add_requirement.UserRequirement", "sent_from": "", "send_to": ["<all>"]}
2023-12-19 10:26:12.516 | DEBUG    | metagpt.team:run:101 - max n_round=3 left.
2023-12-19 10:26:12.517 | DEBUG    | metagpt.roles.role:run:517 - RoleA(Role A): no news. waiting.
2023-12-19 10:26:12.517 | DEBUG    | metagpt.roles.role:_observe:421 - RoleB(Role B) observed: ['Role A: ActionPass run passe...']
2023-12-19 10:26:12.517 | DEBUG    | metagpt.roles.role:_set_state:314 - actions=[ActionOK, ActionRaise], state=1         # 从失败Action处继续执行
2023-12-19 10:26:12.518 | INFO     | metagpt.roles.role:_act:373 - RoleB(Role B): ready to ActionRaise
2023-12-19 10:26:12.518 | WARNING  | metagpt.utils.utils:wrapper:96 - There is a exception in role's execution, in order to resume, we delete the newest role communication message in the role's memory.
2023-12-19 10:26:12.519 | ERROR    | metagpt.utils.utils:wrapper:79 - Exception occurs, start to serialize the project, exp:
Traceback (most recent call last):
....
    rsp = await self._act_by_order()
  File "/Users/xxxx/work/MetaGPT/metagpt/roles/role.py", line 462, in _act_by_order
    rsp = await self._act()
  File "/Users/xxxx/work/MetaGPT/metagpt/roles/role.py", line 374, in _act
    response = await self.rc.todo.run(self.rc.important_memory)
  File "/Users/xxxx/work/MetaGPT/tests/metagpt/serialize_deserialize/test_serdeser_base.py", line 50, in run
    raise RuntimeError("parse error in ActionRaise")
RuntimeError: parse error in ActionRaise
```
