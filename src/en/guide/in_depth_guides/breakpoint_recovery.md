# Serialization & Breakpoint Recovery

## Definition

Breakpoint recovery refers to recording different increments of the program module and storing into files during program running. When the program encounters external situations such as `Ctrl-C` or internal execution exceptions such as LLM Api network abnormality leading to exit. When the program is executed again, it can resume execution from the results before the interruption without starting execution from 0 to 1, reducing the developer's time and cost.

## Serialization and deserialization

In order to support breakpoint recovery operations, the output of different modules in the program needs to be structured and stored, that is, serialized, to save the scene for subsequent recovery operations. Serialization operations are differentiated according to the functions of different modules. For example, basic character information can be serialized after initialization and will not change during the process. Memory information needs to be serialized in real time during execution to ensure integrity (serialization time-consuming accounts for a very low proportion of the entire program execution). Here, we uniformly perform serialization when an exception occurs or the run ends normally.

## Implement logic

### Possible interruptions

- Network and other problems, the LLM-Api call still fails after retrying multiple times.
- During Action execution, parsing of the output content failed, resulting in exit.
- `Ctrl-C` interrupts the program

### Serialized storage structure

In order to reduce the impact of subsequent new functions on the storage structure, an "integrated" single json file is used for storage.

When the program is interrupted or terminated, the file structure in the storage directory is as follows:

```bash
./workspace
  storage
    team
      team.json          # Contains information such as team, environment, roles, actions, etc.
```

<details>

<summary>Example of data summary corresponding to team.json </summary>

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

### Execution order during recovery

Since MetaGPT is an asynchronous execution framework, there are several typical interception points and recovery sequences as follows.

1. Role A (1 action) -> Role B (2 actions). Role A exits abnormally when selecting an action.
2. Role A (1 action) -> Role B (2 actions). The first action of role B executes normally, but an abnormal exit occurs when the second action is executed.

#### Situation 1

After the execution entry is re-executed, each module is deserialized. Role A did not observe the message that it processed and re-executed the corresponding action. After role B recovers, it observes a Message that has not been processed before, and then re-executes the corresponding `react` operation after `_observe`, and executes the corresponding 2 actions according to the react strategy.

#### Situation 2

After the execution entry is re-executed, each module is deserialized. Role A did not observe the Message that it processed and did not process it. After role B is restored, `_observe` receives a Message that has not been completely processed before. In `react`, if it knows that it failed to execute the second action, it will start execution directly from the second action.

### Re-execute from the Message before the interruption

Generally speaking, Message is a bridge for communication and collaboration between different roles. When an interruption occurs during the execution of Message, the Message has been stored in the Role's Memory(in RoleContext) by the role. During recovery, if all the memory of the character is loaded directly, the `_observe` of the character will not observe the interruption and trigger the execution of `Message` at that time, so the continued execution of the Message cannot be restored.  
Therefore, in order to ensure that the Message can continue to be executed during recovery, the corresponding Message needs to be deleted from the character memory based on the latest information obtained by `_observe` after an interruption occurs.

### Re-execute from the action before the interruption

Generally speaking, Action is a relatively small execution module granularity. When an interruption occurs during the execution of Action, you need to know the execution order of multiple Actions and which Action(`_rc.state`) is currently executed. When resuming, locate the action where it was interrupted and re-execute the action.

## Result

### The entry of Breakpoint recovery

`metagpt "xxx" --recover_path "./workspace/storage/team"` # Serialized to `./workspace/storage/team` by default.

### Continuing execution results after recovery

A single test case is provided here to illustrate breakpoint recovery execution:

Execution case of `test_team_recover_multi_roles_save` of `python3 -s tests/metagpt/serialize_deserialize/test_team.py`

`ActionRaise` of `RoleB` simulates Action exceptions. An exception occurred when executing the Action, and exited after serializing the project. After recovering, `RoleA` and `ActionOK` of `RoleB` have already been executed and will not continue to be executed. `RoleB` continues to execute from `ActionRaise` and continues to exit when an exception is encountered.

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

############################# ---------  Here re-run the Team ----------- ############################
2023-12-19 10:26:12.515 | DEBUG    | metagpt.environment:publish_message:117 - publish_message: {"id": "0bfdde08d4294f07923201d51b2b0068", "content": "write a snake game", "role": "Human", "cause_by": "metagpt.actions.add_requirement.UserRequirement", "sent_from": "", "send_to": ["<all>"]}
2023-12-19 10:26:12.516 | DEBUG    | metagpt.team:run:101 - max n_round=3 left.
2023-12-19 10:26:12.517 | DEBUG    | metagpt.roles.role:run:517 - RoleA(Role A): no news. waiting.
2023-12-19 10:26:12.517 | DEBUG    | metagpt.roles.role:_observe:421 - RoleB(Role B) observed: ['Role A: ActionPass run passe...']
2023-12-19 10:26:12.517 | DEBUG    | metagpt.roles.role:_set_state:314 - actions=[ActionOK, ActionRaise], state=1         # run from the failed action `ActionRaise`
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
