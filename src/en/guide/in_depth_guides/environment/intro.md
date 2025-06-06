# Environment

Early MetaGPT versions used the same implementation of `Environment` in `metagpt/environment/base_env.py` to describe the environment of a software team. In order to support the application of multiple agents in different environments (such as games, mobile phones, etc.), we have expanded the overall definition and functions of the environment to better support the development of different scenarios.

## Definition

`ExtEnv` external environment is defined as the carrier for the interaction between the agent and different environments. For example, the game to be connected by the agent is a remote engine service and a collection of API interfaces provided externally. We manage the docking API by defining the external environment, so that the agent has the direct ability to interact with the game. For another example, the agent connects to the role-playing Werewolf game and defines the external environment to implement the Werewolf game rules itself, so that the agent can know the current status of the character after dark and dawn.

The internal environment of `XxxEnv` is defined as the environment used directly by the agent and its team, similar to the `Environment` used in software development. Generally, it directly inherits `ExtEnv` and adds additional custom parts as required.

In `ExtEnv`, we refer to the design of `gymnasium` in the reinforcement learning scenario and introduce the `observation_space` and the `action_space`, which are used to represent the set of states obtained from the external environment and the action collection that can act on the environment respectively. Through the definition of two spaces, you can simplify the abstraction in different environments, allowing the environment provider to focus on the implementation of environment logic and the user to focus on the use of different space values.

In addition, the decorators `mark_as_readable` and `mark_as_writeable` for the different `read-write` interfaces provided by `ExtEnv` are also provided to facilitate the unified management of method interfaces for external environment docking, so that subsequent agents can use them as A tool capability that can directly and automatically call different external environment docking interfaces based on the input natural language (this part of the function is to be opened).

### Observation space, action space definition specification

When defining observation and action space in `gymnasium`, discrete values ​​or continuous values ​​are generally defined. However, in the supported scene environments, game engine services or external simulators are more often accessed through APIs or interfaces. Therefore, for the action space (`gymnasium.spaces.Dict`), it contains subspace definitions of different action types and required input parameters under different actions. For the search space (`gymnasium.spaces.Dict`), it contains environmental information that can be obtained from the environment, such as maps, screenshots, etc.

`BaseEnvActionType` in `metagpt.base.base_env_space` defines the action type, `BaseEnvAction` defines a set of values ​​corresponding to the action space, and `BaseEnvObsType` defines the observation type.
Generally, the observation space values ​​obtained in `gymnasium` are a complete set of observation values, but in practical applications, it is often necessary to obtain local observation values ​​from the environment (for example, in Stanford Town, it is necessary to obtain map information within the field of view of the agent's location, rather than the complete map). We have added the `observe(self, obs_params: Optional[BaseEnvObsParams] = None)` method to obtain local environment information. `BaseEnvObsParams` defines the parameters required to obtain observation values, including the observation type and its required input parameters.

## Different Environments

Currently, we provide several scenario environments and provide corresponding scenario usage entrances under `MetaGPT/examples/`.

- ToBeAdded, [Minecraft Environment](./minecraft.md)
- Added, [Werewolf Environment](./werewolf.md)
- Added, [Stanford Town Environment](./stanford_town.md)
- Added, [Android Environment](./android.md)
- Added, [MGXEnv Environment](./mgx.md)
- ToBeAdded, [Web Environment](./web.md)
