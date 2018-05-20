## SpaceMine = Factorio + Dwarf Fortress

## Overview

TradePost is a game where you gather resources to fulfill the requests of space merchants. You navigate a fleet of drones using programmatic commands, which require energy to execute. You get the energy from merchants, as a reward for fulfilling their requests.

By a lucky chance, the planet provides all raw materials to assemble new drones or upgrade existing ones. However, the resources are limited: use them wisely!

There is no registration process. In order to play the game, you have to receive the API key for your first drone from another player (who assembled it himself).

Drones can be assembled from multiple components:
* Controller - generates the API key & secret for operating the drone (required)
* Engine - allows the drone to move
* Laser - allows the drone to fire
* Assembler - allows the drone to assemble new parts (and new drones)
* Scanner - allows the drone to scan surroundings
* Trunk - allows the drone to carry resources

Apart from controller, no other components are required. For example, it's possible to assemble an immobile turret using only controller + laser.

## Scenarios

### Trade

```bash
$ spacemine connect --key [key] --secret [secret]
Connected to drone "Husky" #DaHCnn6tuN6reZJyc at coords 5,5 with the following components:
 - 
> scan
Object                                            Coords
----------------------------------------------------------
Deuterium                                      10,11
"Lint" #EcwhcnhRYaeZEHpm4         10,12
Tradepost                                         0,0
> mv 10,11
```

## Technical specifications

* Drones are controlled via WebSocket feed.
* It's possible to subscribe to "scanning" event in order to continuously receive updates about the environment.

## Design decisions

*Should we introduce multiple resources or a single basic one, from which all other components could be crafted?*

We should introduce multiple resources: this will create scenarios like "defense of the deposit", where a large patch of a certain resource is defended by a single faction.

## Emergent gameplay

There is only one trading spaceport in the game. However, raw resources are spread evenly across the map. That means the distance between raw resources and the spaceport will increase with time, which will require more energy to transport them back to spaceport. That means expansion has a limit, after which it's economically unfeasible to gather resources. There are two ways to cope with this situation:
1. Upgrade the engines to use less energy per distance.
2. Ambush other drones carrying the resources.

That means the world will develop in three stages:

1. The Expansion - where the merchant reward is high relative to distance traveled.
1. The Tension - where the merchant reward is still high enough for gatherers, but it's increasingly more economical to fight for resources.
1. The War - where the merchant reward is too low compared to fighting, and the world deteriorates into planet-scale conflict.

It's possible that survivors may decide to reassemble the remaining engines into more efficient ones. This will enable another stage of expansion, effectively starting the next turn of the spiral.

## The Experiment

The game development is financed with energy tokens:
1. Energy tokens are rewarded for closing tickets.
1. Energy tokens can be spent for recharging drones. 

This is an experiment. We can't guarantee the future price of the energy tokens. However, we can help you form your own opinion by listing some facts:

* The world has only one spaceport. It will require progressively more energy to carry resources to it, which will increase the demand for energy tokens.
* The engine efficiency can be upgraded infinitely, which will decrease the demand for energy tokens.
* The engine upgrades will require progressively more raw resources, which will increase the demand for energy tokens.
* Engines & batteries can be destroyed during fights, which will increase the demand for energy tokens.
