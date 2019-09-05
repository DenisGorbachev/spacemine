# Spacemine = Factorio + Dwarf Fortress (online)

[**Start game**](#start-game) | [How to play](#guide) | [Spacemine Energy Token economics](#spacemine-energy-token-economics)

## Overview

Spacemine is a game where you complete missions for space merchants by gathering resources on planet surface. You gather resources by commanding robots, which require energy to function. You receive energy from merchants, as reward for completing their missions.

_"Merchants -(energy)> Robots, Merchants <(resources)- Robots" diagram_

Spacemine Energy is an ERC-20 token: you can sell it on (real market)[link]. Tip: you should sell only surplus energy, since it's required to complete missions & get more energy. Want to learn more? Read (Spacemine Energy Token economics)[#spacemine-energy-token-economics]. 

## Start game

1. Register on (Discord channel)[link].
1. Request an account from (Denis Gorbachev)[link] (this is temporary, until we implement normal registration).
1. Install the client.
1. Add the API key-secret to your accounts via `sm add [name] [key] [secret]` (choose the name for yourself)
1. Start building up your energy reserves.

Robots can be assembled from multiple components:
* Engine - allows to move
* Scanner - allows to scan surroundings
* Laser - allows to fire at other robots, damaging their components
* Jammer - allows to reprogram other robots, bringing them under your control

A robot can contain only a single component. For example, it's possible to assemble a stationary turret using only laser.

## Possibilities

* Build a factory:
    * Assemble multiple scouts that search for metal.
    * As soon as the scouts find enough metal, assemble progressively more complex components
    * Sell components for energy.
    * Transfer energy to scouts with higher battery capacity to scout for more metal farther away from outpost.
* Make a trap for scouts:
    * Drop metal on the ground.
    * Move away a little.
    * Start continuously scanning surroundings.
    * As soon as scout is detected, calculate the tile on which it'll move to pick the metal.
    * Start continuously jamming that tile.
    * Jam the scout, regenerate its API secret and gain control over it.
* Capture spaceport:
    * Assemble multiple robots with scanning and jamming capabilities.
    * Move the whole group to spaceport.
    * Start scanning surroundings.
    * As soon as any other robots are detected, jam them.
    * Add new robots to your army, or disassemble them for energy.
* Attack spaceport:
    * Assemble lots of robots with moving capabilities.
    * Assemble some robots with jamming & scanning capabilities.
    * Advance with moving robots first (to trick the defenders into jamming them)
    * Scan the surroundings to discover positions of defenders.
    * Jam the defenders.

## Guide

### Resources

Resources are sold to merchants for energy or utilized to build new robots. There are four resources in Spacemine: 

* M - Meltenus (+1 move speed)
* F - Ferratus (+1 fire power)
* S - Santerus (+1 scan range)
* D - Dubnetus (+1 defense depth)

Each resource provides a bonus to robot characteristics.

## Combat mechanics (firing & defending)

* Fire power = count of "F" in your robot configuration
* Defense depth = count of "D" in target robot configuration
* Damage = Fire power - Defense depth
* Damage removes last n letters from robot configuration

Example #1:

* Robot Linda fires at robot Barney.
* Linda has MSDSFDF configuration, Barney has DFSM configuration.
* Linda fire power is 2F, Barney defense depth is 1D.
* Linda damages Barney for 1 letter.
* Barney configuration changes from DFSM to DFS, making him unable to move.

Example #2:

* Robot Barney fires at robot Linda.
* Barney config is DFS, Linda config is MSDSFDF.
* Barney fire power is 1F, Linda defense depth is 2D.
* Barney doesn't do any damage.

## Scenarios

### Move

```bash
$ spacemine connect [username] [password]
Connected to robot "Linda" (5-0-5-0) at coords [5,5] with [nothing] in trunk
45 / 60     Energy
1           Engine (range 7, drain 5)
1           Jammer (range 4, drain 10)
1           Scanner (range 7, drain 3)
1           Battery (capacity 60)
> move 10,15
Moved to 10,15
> move 20,20
Moved to 16,18
Moved to 20,20
```

* Move is allowed only within range (depending on engine model) (distance is diagonal: a robot at 5,5 with engine range 5 can move to 5,10 or 7,7, but not 8,8)
* Move is allowed only to empty tile. If the tile is occupied by another object (robot, component, resource, building), the command returns an error.  
* Move drains energy (depending on engine model)
* Move command in console automatically calculates max distance and sends multiple `move` requests to the server

### Assemble

```bash
$ spacemine connect --key SSpZmDmEf2cfzevXP --secret [secret]
Connected to robot "Stanley" #SSpZmDmEf2cfzevXP at coords [10,15] which can [move] with [Metal] in trunk 
> scan
Scanned 7 nearest squares:
    10,16   Metal
    11,15   Metal
    11,16   Metal                  
> asm
New technology unlocked: Metal + 3 Metal = Engine (range 5)
Assembled Engine (range 5)
> drop
Dropped Engine (range 5) at 10,16
```

* Assembly is based on recipes.
* Each recipe has a main component (in robot's trunk) and extra components (on 9 closest tiles).
* Recipes are generated dynamically for each server (to increase replayability).
* Recipes are unknown initially, and have to be discovered through trial-and-error.
* Recipes for higher-level components (with increased range) use similar low-level components as main ones (you need to assemble engine with range 5 in order to assemble engine with range 7).
* Assembly result is left in robot's trunk.
* Assembly that don't match any recipe leaves 1 metal in trunk (= wastes resources).
* Assembly always uses all available components (main in trunk + extra on 9 closest tiles).
* Assembly uses components regardless of their position (a robot at 5,5 can assemble the same component with metal at 5,6 or at 6,5)
* To assemble new robots, a parent robot must have a controller in the trunk.
* After a new robot is assembled, it is placed at the same tile where its engine was.
* Assembly drains energy (constant amount)

### Trade

```bash
$ spacemine connect --key DaHCnn6tuN6reZJyc --secret [secret]
Connected to robot "Husky" #DaHCnn6tuN6reZJyc at coords [5,5] which can [move,scan,jam] with [nothing] in trunk 
> scan
Scanned 7 nearest squares:
     0,0    Spaceport
    10,12   "Lint" #EcwhcnhRYaeZEHpm4
    10,11   Metal                                      
> mv 10,11
Moved to 10,11
> pick
Picked Metal
> sell
Can't sell Metal: must be close to Spaceport
> mv 0,0
Can't move to 0,0: square occupied by Spaceport
> mv 1,0
Moved to 1,0
> prices
10      Metal
120     Engine Mk3
40      Laser Mk2
> sell
Sold Metal for 10 energy
> stat
45 / 60     Energy
1           Engine (range 7, drain 5)
1           Jammer (range 4, drain 10)
1           Scanner (range 7, drain 3)
1           Battery (capacity 60)
```

* There's only one spaceport in the game.
* Spaceport accepts all components & metal.
* Spaceport quotes constant prices (accessible with `price` command).
* All spaceport-related comands must be executed within 1 tile of spaceport.
* Components are priced higher than sum of its components plus energy required to assemble them.
* Selling removes a component from current robot's trunk.
* Selling adds energy to current robot's battery.
* If selling will result in "energy overflow" (e.g. battery charge is at 55 / 60, but selling will result in +10 energy), the robot receives a warning, which can be overridden with "sell force" command. In this case, robot's battery is charged to max capacity, and remaining energy is discarded.

### Transfer energy

```bash
$ spacemine connect --key 8AzHLHrYyFK5SX5pL --secret [secret]
Connected to robot "Linda" #8AzHLHrYyFK5SX5pL at coords [10,15] which can [move,scan] with [nothing] in trunk 
> scan
Scanned 7 nearest squares:
    17,20   "Bart" #C3PWjLi84B3yuYZqB                  
> mv 17,19
Moved to 14,17
Moved to 17,19
> transfer 10 C3PWjLi84B3yuYZqB
Transferred 10 of 40 energy to "Bart" #C3PWjLi84B3yuYZqB
```

* Transfer removes energy from source robot and adds energy to destination robot.
* Same "energy overflow" rules apply to both selling and transferring.

> scan
Scanned 7 nearest squares:
    10,12   "Lint" #EcwhcnhRYaeZEHpm4
    13,14   Metal
    13,15   Metal
    14,14   Metal
    14,15   Metal                                      

## Spacemine Energy Token economics

* Type: ERC-20.
* Max supply: 1000000000.
* Initial supply: 0 (no premine).
* Future supply:
  * Airdrop: 1000 per player for first 10000 new players.
  * Quests: 250-10000 per completion.
* Future demand:
  * Actions: 1-100 per robot action.

Supply & demand balance is achieved by matching quest rewards with quest needs (energy spent on actions that lead to quest completion).

## FAQ

Q: Is there any cooldown between commands?
A: There's no cooldown in original version: you can act as fast as you can send commands. However, mods may implement cooldown in order to make the game more competitive for humans. 

## Technical specifications

* Robots are controlled via WebSocket feed.
* It's possible to subscribe to "scanning" event in order to continuously receive updates about the environment.

## Design decisions

*Should we introduce multiple resources or a single basic one, from which all other components could be crafted?*

We should introduce multiple resources: this will create scenarios like "defense of the deposit", where a large patch of a certain resource is defended by a single faction.

## Emergent gameplay

There is only one trading spaceport in the game. However, raw resources are spread evenly across the map. That means the distance between raw resources and the spaceport will increase with time, which will require more energy to transport them back to spaceport. That means expansion has a limit, after which it's economically unfeasible to gather resources. There are two ways to cope with this situation:
1. Upgrade the engines to use less energy per distance.
2. Ambush other robots carrying the resources.

That means the world will develop in three stages:

1. The Expansion - where the merchant reward is high relative to distance traveled.
1. The Tension - where the merchant reward is still high enough for gatherers, but it's increasingly more economical to fight for resources.
1. The War - where the merchant reward is too low compared to fighting, and the world deteriorates into planet-scale conflict.

It's possible that survivors may decide to reassemble the remaining engines into more efficient ones. This will enable another stage of expansion, effectively starting the next turn of the spiral.

## The Experiment

The game development is financed with energy tokens:
1. Energy tokens are rewarded for closing tickets.
1. Energy tokens can be spent for recharging robots. 

This is an experiment. We can't guarantee the future price of the energy tokens. However, we can help you form your own opinion by listing some facts:

* The world has only one spaceport. It will require progressively more energy to carry resources to it, which will increase the demand for energy tokens.
* The engine efficiency can be upgraded infinitely, which will decrease the demand for energy tokens.
* The engine upgrades will require progressively more raw resources, which will increase the demand for energy tokens.
* Engines & batteries can be destroyed during fights, which will increase the demand for energy tokens.

## Stories

### Investor profits from Spacemine Energy Token

* Investor buys Spacemine Energy Token (SET).
* Investor waits until Spacemine becomes popular.
* Investor sells Spacemine Energy Token (SET) for higher price.

### Spacemine becomes popular

* Modders create their games using Spacemine engine.
* Modders reuse Spacemine Energy Token (SET) to charge for actions.
  * Modders are incentivized to reuse SET instead of creating their own token due to network effects (more liquidity + already listed on exchanges)
  * Modders are incentivized to reuse SET because they will receive commission from actions generated by their Spacemine versions.
* Players migrate between different games, maintaining engagement.

### Server protects from SET overcharge abuse _(draft)_

* Modder creates a new game.
* Player signs up for the game created by Modder.
* Modder instantly charges 10000 SET for simple action.
* -- Server decreases player balance.
* ++ Server maintains player balance due to overcharge protection.

### Player moves his robot to distant tile with a single command

* Player types the command: `ls`
* Player types the command: `mv 15,14`

```$bash

LINDA> ls
|-----------------------------------------------|
| Type       | Structure        | Location      |
|-----------------------------------------------|
| Mine       | A*107            | 45,10         |
| Robot      | A*10+B*5         | 42,9          |
|-----------------------------------------------|

LINDA> mv 45,10
+ LINDA moved to 37,10
+ LINDA moved to 42,10
+ LINDA moved to 44,10
X LINDA can't move closer: location occupied

LINDA> pick 45,10
+ Picked "A".
+ Ability acquired: double damage to "B" letters
```
