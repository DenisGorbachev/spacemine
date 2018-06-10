## SpaceMine = Factorio + Dwarf Fortress

## Overview

SpaceMine is a game where you gather resources to fulfill the requests of space merchants. You navigate a fleet of robots using programmatic commands, which require energy to execute. You get the energy from merchants, as a reward for fulfilling their requests.

By a lucky chance, the planet provides all raw materials to assemble new robots or upgrade existing ones. However, the resources are limited: use them wisely!

There is no registration process. In order to play the game, you have to receive the API key for your first robot from another player (who assembled it himself).

Each robot has its own API key & secret (which you can regenerate if you want to).

Robots can be assembled from multiple components:
* Controller - creates the API key & secret for operating the robot (required)
* Engine - allows to move
* Jammer - allows to reprogram other robots (regenerate their API keys, bringing them under your control)
* Scanner - allows to scan surroundings
* Battery - allows to store energy

Apart from controller, no other components are required. For example, it's possible to assemble an immobile turret using only controller + jammer.

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
    * Jam the scout, regenerating its API secret and gaining control over it.
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

## Scenarios

### Move

```bash
$ spacemine connect --key MC4GhvmbsYr43k5tn --secret [secret]
Connected to robot "Linda" #MC4GhvmbsYr43k5tn at coords [5,5] with [nothing] in trunk
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

## 

## FAQ

Q: Can I buy from spaceport?
A: No, you can only sell.

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
