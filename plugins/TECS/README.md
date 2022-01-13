# TECS
#### Threaded ECS architecture (pronounced "TEX")

ECS architecture designed to support both single-threaded and multi-threaded systems (or a combination).
TECS uses shared array buffers when multi-threading. This means that all child threads have access to the same memory addresses instead of having to pass data between child threads and the parent. While single-threaded, TECS uses a normal array as it is faster.

ECS stands for Entity Component System, and more can be learned about it [here](https://en.wikipedia.org/wiki/Entity_component_system).


### Instalation
TECS is a built-in plugin for the [Neutrino programming language](https://github.com/12Thanjo/Neutrino).
```Neutrino
import TECS;
```

#### Usage as a Standalone Package
If you wish to use TECS as a standalone NodeJS package, you can compile it yourself as follows:

1) Install [Neutrino](https://github.com/12Thanjo/Neutrino)

2) Create plugin.nt (suggestion):
```Neutrino
scope{
	import TECS;
	module.exports = TECS;
};
```
3) Compile plugin.nt:
```bash
neutrino compile plugin.nt -o name_of_output_file.js
```

### Example Usage:
(written in JS for highlighting)
```js
var TECS = require("TECS");

// environment
var env = new TECS.Environment("main environment");


// components //////////////////////////////////////////////////////

// create a physics component that has an x and y property
env.createComponent("position", {
	x: prop("float32", 1), //default 1
	y: prop("float32"), //default 0
	z: 0
});

// create a health component
env.createComponent("health", prop("uint16"));


// queries //////////////////////////////////////////////////////////

// create a query (called "position") of all entities that has the position component
env.createQuery("position", [all("position")], true);

// create a query (called "player") of all entities that both the position and health components
env.createQuery("player", [all("position", "health")], false);


// Entities //////////////////////////////////////////////////////////

// create an entity
var entity = env.createEntity();

// add the position component to the entity
// set x to 12 and y to 14
env.bindComponent(entity.id, "position", 12, 14);

// bind the health component to the entity
entity.bindComponent(entity, "health");

// systems //////////////////////////////////////////////////////////

// create a system (called "physicsX") that iterates over the position query
var physicsX = env.createSystem("physicsX", 'position', (id, components)=>{
	components.position.x[id] += 1;
});

// create a system (called "physicsYU") that iterates over the position query
var physicsY = env.createSystem("physicsY", 'position', (id, components)=>{
	var entity = env.getPointer(id);
	entity.position.y += 1;
});

// create a system (called "health regen") that iterates over the player query
var health_regen = env.createSystem("health regen", 'player', (id, components)=>{
	if(components.health[id] < 100){
		components.health[id] += 1;
	};
});


// event loop ////////////////////////////////////////////////////////
var event_loop = new TECS.EventLoop("main loop");

// first run the physics systems
event_loop.add((done)=>{
	var manager = new TECS.EventLoop.Manager(2, done);

	// run physics systems with 4 threads
	// because both of the systems pull from a threaded query, these systems will run at the same time
	physicsX.run(manager.done, 4);
	physicsY.run(manager.done, 4);
});

// then run the health_regen system
event_loop.add((done)=>{
	health_regen.run(done);
});

// definitely not needed
event_loop.add(()=>{
	console.log("completed event loop");
});

// run the event loop 64 times a second
setTimeout(()=>{
	event_loop.start();
},1000/64);

```

# API:

- [Environment](#environment)
- [Component](#component)
- [Entity](#entity)
- [Query](#query)
- [System](#system)
- [Event Loop](#event-loop)
- [Misc.](#misc)

## Environment

### `new Environment(id, config)`
Create a new Environment (_is a Neutrino species_).

| Parameter | Type   | Description			 	    |
|-----------|--------|------------------------------|
| id        | string | unique id of the Environment |
| config    | object | config object                |

##### config

| Property | Type    | Description 										    | Default 		     |
|----------|---------|------------------------------------------------------|--------------------|
| size 	   | Integer | Maximum number of entities (pre-allocates memory)    | 1000			     |
| threads  | Integer | Maximum number of threads to use when multithreading | System Threads - 1 |


### `env.getPointer(entity_id)`
Get the entity pointer to make entity property manipulation easier, while slower. For smaller sets of entites, the difference is negligable.

| Parameter | Type    | Description			 	     |
|-----------|---------|------------------------------|
| entity_id | Integer | id of the entity to point to |



## Component

### `env.createComponent(name, builder)`
Create a component

| Parameter | Type   | Description			 	            |
|-----------|--------|--------------------------------------|
| name      | String | unique name of the Component         |
| builder   | Object | properties of the Component          |


### `prop(type, auto)`
| Parameter | Type   | Description			 	                         | Default |
|-----------|--------|---------------------------------------------------|---------|
| type      | String | type of values the property will be (types below) |         |
| auto      | Any    | properties of the Component          			 | 0       |

#### types
| Type        | signed   | size (bits) | type    |
|-------------|----------|-------------|---------|
| _"int8"_    | signed   | 8           | integer |
| _"uint8"_   | unsigned | 8           | integer |
| _"int16"_   | signed   | 16          | integer |
| _"uint16"_  | unsigned | 16          | integer |
| _"int32"_   | signed   | 32          | integer |
| _"uint32"_  | unsigned | 32          | integer |
| _"float32"_ | signed   | 32          | float   |
| _"float64"_ | signed   | 64          | float   |
| _"int64"_   | signed   | 64          | integer |
| _"uint64"_  | unsigned | 64          | integer |

There is also an _"any"_ type, which can take any type of value (numbers, strings, objects, etc.), but is slower and cannot be used multi-threaded





## Entity

### `env.createEntity(name)`
Unique objects that hold Components with values. Returns and [Entity](#entity-object).

| Parameter | Type   | Description			 	            |
|-----------|--------|--------------------------------------|
| name      | String | (OPTIONAL) unique name of the entity |


### `env.getEntity(name)`
Get an entity from their name (can only get entities that actually have names). Returns and [Entity](#entity-object).
| Parameter | Type   | Description			 	 |
|-----------|--------|---------------------------|
| name      | String | unique name of the entity |


### `env.bindComponent(entity_ref, component_id, ~params)`
Bind a component to an entity.
| Parameter     | Type    | Description			 	  																								    |
|---------------|---------|-----------------------------------------------------------------------------------------------------------------------------|
| entity_ref    | Entity  | Entity to bind component to                          																	    |
| component_id  | String  | Unique id of the component to bind to the Entity    																		|
| \~params 	    | Params  | Values to set to the properties (length is optional). The order is in which they are created (top to bottom, left to right) |

### `env.forEach(event)`
Iterate over every entity
| Parameter | Type     | Description			 	                                       |
|-----------|----------|-------------------------------------------------------------------|
| event     | Function | Function to run on every entity (takes the entity as a parameter) |


### Entity Object

#### `Entity.bindComponent(component_id, ~params)`
Baind a component ot the entity.
| Parameter     | Type    | Description			 	  																								    |
|---------------|---------|-----------------------------------------------------------------------------------------------------------------------------|
| component_id  | String  | Unique id of the component to bind to the Entity    																		|
| \~params 	    | Params  | Values to set to the properties (length is optional). The order is in which they are created (top to bottom, left to right) |

#### `Entity.components`
A set of the component_id's of all the components the entity has

#### `Entity.getPointer()`
Sets the entity pointer for the environment to this entity and returns it.

#### `Entity.hasComponent(component_id)`
Returns a boolean if the entity has the component.
| Parameter     | Type    | Description			 	  						 |
|---------------|---------|--------------------------------------------------|
| component_id  | String  | Unique id of the component to bind to the Entity |


## Query

### `env.createQuery(id, conditionals, threaded)`
Create a query. Entities will be added to queries at and after creation of the query.
| Parameter     | Type    | Description			 	                                           | Default |
|---------------|---------|--------------------------------------------------------------------|---------|
| id            | String  | unique id of the entity                                            |         |
| conditionals  | Array   | Set of conditions for an Entity to be added (more explained later) |         |
| threaded      | Boolean | whether the query should be threaded or not                        | false   |

#### Conditionals Options
- all: entity must have all contained conditionals
- some: entity must have at least one contained conditional
- none: entity must have at no contained conditional
- String ID of the component
#### Example: 
```js
["comp1", some(all("comp2", "comp3"), "comp4")]
```

The array that is put into the parameter acts the same as an _all_



## System

### `env.createSystem(id, query, event)`
Create a system (_is a Neutrino species_).
| Parameter | Type     | Description			 	            |
|-----------|----------|----------------------------------------|
| id        | String   | unique id of the system                |
| query     | String   | unique id of the query to iterate over |
| event     | function | event to run in the iteration          |

#### event
| Parameter  | Type    | Description	   | 
|------------|---------|-------------------|
| id         | Integer | id of the entity  |																											  
| components | Object  | Object containing all components, where each component property is an array and the index of array corresponds to unique id of entity. If an entity has not been created yet, the value will be 0 (or null if using the _any_ type) |


## Event Loop

### `new EventLoop(name)`
Create an event loop to manage order of completion of multi-threaded systems (_is a Neutrino species_). Built in try/catch to prevent crashes.
| Parameter | Type   | Description			 	   |
|-----------|--------|-----------------------------|
| name      | String | unique id of the Event Loop |


### `event_loop.add(event)`
| Parameter | Type   | Description			 	                           |
|-----------|--------|-----------------------------------------------------|
| event     | String | event to run (takes event_loop.next as a parameter) |


### `event_loop.next()`
Start the next event.

### `event_loop.start()`
Start the event loop.

### `new EventLoop.Manager(systems, event)`
Allows for use of multiple multi-threaded systems in one Event Loop event
| Parameter | Type     | Description			 	                                                     |
|-----------|--------- |---------------------------------------------------------------------------------|
| systems   | Integer  | Number of systems that are in the event                                         |
| event     | function | event to run when all systems have completed (number of manager.done() to call) |

### `manager.done()`
Signal to the Event Manager that a system has completed



## Misc.
```js
// Boolean value whether TECS should print to the console (default true)
// true being print, and false being don't print
print = false;
```
