# 断点恢复

## 定义
断点恢复指在程序运行过程中，记录程序不同模块的产出并落盘，当程序碰到外部如`Ctrl-C`或内部执行异常如LLM Api网络异常导致退出等情况时。再次执行程序，能够从中断前的结果中恢复继续执行，而无需从0到1开始执行，降低开发者的时间和费用成本。

## 序列化与反序列化
为了能支持断点恢复操作，需要对程序中的不同模块产出进行结构化存储即序列化的过程，保存后续用于恢复操作的现场。序列化的操作根据不同模块的功能有所区分，比如角色信息，初始化后即可以进行序列化，过程中不会发生改变。记忆信息，需要执行过程中，实时进行序列化保证完整性（序列化耗时在整个程序执行中的占比很低）。

## 实现逻辑

### 可能产生中断的情况

- 网络等问题，LLM-Api调用重试多次后仍失败
- Action执行过程中，输出内容解析失败导致退出
- 人为的`Ctrl-C`对程序进行中断

### 序列化存储结构
为了清晰化**整体项目的结构信息**，采用层级化的方式进行内容的序列化存储。

当程序发生中断后，对应不同模块在存储目录下的文件结构如下：  
结构概要  
```bash
./workspace
  storage
    team
      team_info.json          # 团队需求、预算等信息
      environment             # 环境
        roles.json            # 团队内的角色基础信息
        history.json          # 历史信息
        roles                 # 团队内角色
          RoleA_Alice         # 具体一个角色
            memory.json       # 角色记忆
            role_info.json    # 包括角色身份、执行动作、监听动作等信息
```

每个`xxx.json`下的为对应内容的数据概要示例。  
```bash
./workspace
  storage
    team
      team_info.json          # investment and so on
        {
            "investment": 10.0,
            "idea": "write a snake game"
        }
      environment
        roles.json            # roles' meta info
            [
                {
                    "role_class": "RoleA",
                    "module_name": "tests.metagpt.serialize_deserialize.test_serdeser_base",
                    "role_name": "RoleA"
                },
                {
                    "role_class": "RoleB",
                    "module_name": "tests.metagpt.serialize_deserialize.test_serdeser_base",
                    "role_name": "RoleB"
                }
            ]
        history.json
            {
                "content": "\nHuman: write a snake game\nRole A: ActionPass run passed\nHuman: write a snake game"
            }
        roles
          ProductManager_Alice
            memory.json
                {
                    "storage": [
                    ],
                    "index": {
                    }
                }
            role_info.json       # RoleSetting _actions _states
                {
                    "name": "RoleA",
                    "profile": "Role A",
                    "goal": "RoleA's goal",
                    "constraints": "RoleA's constraints",
                    "desc": "",
                    "is_human": false,
                    "recovered": true,
                    "builtin_class_name": "RoleA",
                    "_role_id": "RoleA(Role A)",
                    "_states": [
                        "0. <class 'tests.metagpt.serialize_deserialize.test_serdeser_base.ActionPass'>"
                    ],
                    "_actions": [
                        {
                            "name": "",
                            "builtin_class_name": "ActionPass",
                            "context": "",
                            "prefix": "You are a Role A, named RoleA, your goal is RoleA's goal, and the constraint is RoleA's constraints. ",
                            "profile": "Role A",
                            "desc": "",
                            "nodes": []
                        }
                    ],
                    "_rc": {
                        "state": -1,
                        "watch": [
                            "metagpt.actions.add_requirement.UserRequirement"
                        ],
                        "react_mode": "react",
                        "max_react_loop": 1
                    },
                    "_subscription": [
                        "tests.metagpt.serialize_deserialize.test_serdeser_base.RoleA",
                        "RoleA"
                    ],
                    "role_class": "RoleA",
                    "module_name": "tests.metagpt.serialize_deserialize.test_serdeser_base"
                }
```

### 恢复时的执行顺序
由于MetaGPT是异步执行框架，对于下述几种典型的中断截点和恢复顺序。  

1. 角色A（一个action）-> 角色B（2个action），角色A进行action选择时出现异常退出。
2. 角色A（一个action）-> 角色B（2个action），角色B第1个action执行正常，第2个action执行时出现异常退出。
#### 情况1
执行入口重新执行后，各模块进行反序列化。角色A未观察到属于自己处理的Message，不处理。角色B恢复后，观察到一条之前未处理完毕的Message，则在`_observe`后重新执行对应的`react`操作，按react策略执行对应2个动作。

#### 情况2
执行入口重新执行后，各模块进行反序列化。角色A未观察到属于自己处理的Message，不处理。角色B恢复后，`_observe`到一条之前未完整处理完毕的Message，在`react`中，知道自己在第2个action执行失败，则直接从第2个action开始执行。


### 从中断前的Message开始重新执行
一般来说，Message是不同角色间沟通协作的桥梁，当在Message的执行过程中发生中断后，由于该Message已经被该角色存入环境（Environment）记忆（Memory）中。在进行恢复中，如果直接加载环境内的全部Memory，该角色的`_observe`将不会观察到中断时引发当时执行`Message`，从而不能恢复该Message的继续执行。  
因此，为了保证该Message在恢复时能够继续执行，需要在发生中断后，从角色记忆中删除对应的该条Message。

### 从中断前的Action开始重新执行
一般来说，Action是一个相对较小的执行模块粒度，当在Action的执行过程中发生中断后，需要知道多个Actions的执行顺序以及当前执行到哪个Action。当进行恢复时，定位到中断时的Action位置并重新执行该Action。

## 结果

### 断点恢复入口
`metagpt "xxx" --recover_path "./workspace/storage/team"` # 默认序列化到`./workspace/storage/team`中。  

### 恢复后继续执行结果
`python3 -s tests/metagpt/serialize_deserialize/test_team.py`的`test_team_recover_multi_roles_save`的执行case  

`RoleB`的`ActionRaise`模拟Action异常，执行到该Action时发生异常，序列化项目后退出。 重新启动后，`RoleA`已经执行过，不继续执行。`RoleB`的`ActionOK`已经执行过，不继续执行。继续从`ActionRaise`执行，仍异常。

```bash
2023-11-30 20:41:22.313 | DEBUG    | metagpt.team:run:92 - n_round=3
2023-11-30 20:41:22.314 | DEBUG    | metagpt.roles.role:_observe:389 - RoleA(Role A) observed: ['Human: write a snake game...']
2023-11-30 20:41:22.314 | DEBUG    | metagpt.roles.role:_set_state:316 - [ActionPass]
2023-11-30 20:41:22.314 | DEBUG    | metagpt.roles.role:_react:412 - RoleA(Role A): self._rc.state=0, will do ActionPass
2023-11-30 20:41:22.314 | INFO     | metagpt.roles.role:_act:361 - RoleA(Role A): ready to ActionPass
2023-11-30 20:41:22.315 | DEBUG    | metagpt.roles.role:run:472 - RoleB(Role B): no news. waiting.
2023-11-30 20:41:27.322 | DEBUG    | metagpt.roles.role:_set_state:316 - [ActionPass]
2023-11-30 20:41:27.322 | DEBUG    | metagpt.team:run:92 - n_round=2
2023-11-30 20:41:27.323 | DEBUG    | metagpt.roles.role:run:472 - RoleA(Role A): no news. waiting.
2023-11-30 20:41:27.324 | DEBUG    | metagpt.roles.role:_observe:389 - RoleB(Role B) observed: ['Role A: ActionPass run passe...']
2023-11-30 20:41:27.325 | DEBUG    | metagpt.roles.role:_set_state:316 - [ActionOK, ActionRaise]
2023-11-30 20:41:27.325 | INFO     | metagpt.roles.role:_act:361 - RoleB(Role B): ready to ActionOK
2023-11-30 20:41:32.327 | DEBUG    | metagpt.roles.role:_set_state:316 - [ActionOK, ActionRaise]
2023-11-30 20:41:32.328 | INFO     | metagpt.roles.role:_act:361 - RoleB(Role B): ready to ActionRaise
2023-11-30 20:41:32.329 | WARNING  | metagpt.utils.utils:wrapper:82 - There is a exception in role's execution, in order to resume, we delete the newest role communication message in the role's memory.
2023-11-30 20:41:32.331 | ERROR    | metagpt.utils.utils:wrapper:61 - Exception occurs, start to serialize the project, exp:
Traceback (most recent call last):
...
  File "/Users/xxxx/work/code/MetaGPT/metagpt/roles/role.py", line 362, in _act
    response = await self._rc.todo.run(self._rc.important_memory)
  File "/Users/xxxx/work/code/MetaGPT/tests/metagpt/serialize_deserialize/test_serdeser_base.py", line 50, in run
    raise RuntimeError("parse error in ActionRaise")
RuntimeError: parse error in ActionRaise

############################# ---------  此处开始重新执行 ----------- ############################
2023-11-30 20:41:32.351 | DEBUG    | metagpt.team:run:92 - n_round=3
2023-11-30 20:41:32.351 | DEBUG    | metagpt.roles.role:run:472 - RoleA(Role A): no news. waiting.
2023-11-30 20:41:32.352 | DEBUG    | metagpt.roles.role:_observe:389 - RoleB(Role B) observed: ['Role A: ActionPass run passe...']
2023-11-30 20:41:32.352 | DEBUG    | metagpt.roles.role:_set_state:316 - [ActionOK, ActionRaise]
2023-11-30 20:41:32.352 | INFO     | metagpt.roles.role:_act:361 - RoleB(Role B): ready to ActionRaise
2023-11-30 20:41:32.353 | WARNING  | metagpt.utils.utils:wrapper:82 - There is a exception in role's execution, in order to resume, we delete the newest role communication message in the role's memory.
2023-11-30 20:41:32.353 | ERROR    | metagpt.utils.utils:wrapper:61 - Exception occurs, start to serialize the project, exp:
Traceback (most recent call last):
...
  File "/Users/xxxx/work/code/MetaGPT/metagpt/roles/role.py", line 362, in _act
    response = await self._rc.todo.run(self._rc.important_memory)
  File "/Users/xxxx/work/code/MetaGPT/tests/metagpt/serialize_deserialize/test_serdeser_base.py", line 50, in run
    raise RuntimeError("parse error in ActionRaise")
RuntimeError: parse error in ActionRaise
```