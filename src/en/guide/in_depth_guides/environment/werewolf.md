# Werewolf Environment

[Code](https://github.com/geekan/MetaGPT/tree/main/metagpt/environment/werewolf)

Werewolf Environment provides a strategy desktop game environment that allows you to customize the number of werewolves and villager when initializing the environment. When the game is executed, through the built-in prompt words of different players, non-moderator characters can conduct private chats at dusk and public speeches at dawn under the guidance of the moderator. Based on the results of different speeches and votes, the environment automatically calculates the eliminated player, the player's skill usage and survival status, whether the game is over, the winner and the reason, etc.

## Space Definition

### Observation Space

Definition:

```python
from gymnasium import spaces
from metagpt.environment.werewolf.const import STEP_INSTRUCTIONS

space = spaces.Dict(
     {
         "game_setup": spaces.Text(256),
         "step_idx": spaces.Discrete(len(STEP_INSTRUCTIONS)),
         "living_players": spaces.Tuple(
             (spaces.Text(16), spaces.Text(16))
         ), # TODO should be tuple of variable length
         "werewolf_players": spaces.Tuple(
             (spaces.Text(16), spaces.Text(16))
         ), # TODO should be tuple of variable length
         "player_hunted": spaces.Text(16),
         "player_current_dead": spaces.Tuple((spaces.Text(16))), # TODO should be tuple of variable length
         "witch_poison_left": spaces.Discrete(2),
         "witch_antidote_left": spaces.Discrete(2),
         "winner": spaces.Text(16),
         "win_reason": spaces.Text(64),
     }
 )
```

Description of observation

| Field               | Description                                               | Value Description                                                                                                                           |
| ------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| game_setup          | Game initial information text string                      | Maximum length 16                                                                                                                           |
| step_idx            | The current number of steps in each round of the game     | Value range `[0-18]`                                                                                                                        |
| living_players      | List of currently living player names                     | Multiple players possible                                                                                                                   |
| werewolf_players    | Werewolf player name list                                 | Multiple werewolves available. There is currently no isolation, and the list can be obtained directly from the environment, to be optimized |
| player_hunted       | The name of the player currently eliminated by werewolves | 0 or 1 player                                                                                                                               |
| player_current_dead | List of currently eliminated player names                 | Multiple players possible                                                                                                                   |
| witch_poison_left   | The number of poisons left by the witch                   | 0 or 1                                                                                                                                      |
| witch_antidote_left | The number of antidote left by the witch                  | 0 or 1                                                                                                                                      |
| winner              | The Winner                                                | Maximum length 16                                                                                                                           |
| win_reason          | Winning reason                                            | Maximum length 64                                                                                                                           |

Space sample example:

```
OrderedDict([('game_setup', 'Game setup: xxx'), ('living_players', ('Player1', 'Player2')), ('player_current_dead', ('Player5', 'Player6')), (' player_hunted', 'Player5'), ('step_idx', 7), ('werewolf_players', ('Player3', 'Player4')), ('win_reason', 'xx'), ('winner', 'werewolf' ), ('witch_antidote_left', 1), ('witch_poison_left', 1)])
```

### Action Space

Definition:

```python
from gymnasium import spaces
from metagpt.environment.werewolf.env_space import EnvActionType

space = spaces.Dict(
     {
         "action_type": spaces.Discrete(len(EnvActionType)),
         "player_name": spaces.Text(16), # the player to do the action
         "target_player_name": spaces.Text(16), # the target player who take the action
     }
)
```

Description of action

| Field              | Description                    | Value Description                                                                                                                                        |
| ------------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| action_type        | Action type                    | Different actions correspond to different IntEnum values, followed by None, WOLF_KILL, VOTE_KILL, WITCH_POISON, WITCH_SAVE, GUARD_PROTECT, PROGRESS_STEP |
| player_name        | The initiator of the action    | Maximum length 16                                                                                                                                        |
| target_player_name | The target party of the action | Maximum length 16                                                                                                                                        |

Space sample example:

```
OrderedDict([('action_type', 5), ('player_name', 'Player1'), ('target_player_name', 'Player2')])
```

## Usage

```python
from metagpt.environment.werewolf.werewolf_ext_env import WerewolfExtEnv
from metagpt.environment.werewolf.env_space import (
     EnvAction,
     EnvActionType
)

env = WerewolfExtEnv()

obs, _ = env.reset() # Get complete observation values

action = EnvAction(action_type=EnvActionType.VOTE_KILL, player_name="Player1", target_player_name="Player2") #Initialize a set of action values, `Player1` will kill `Player2`
obs, _, _, _, info = env.step(action) # Execute the action and get a new complete observation
```
