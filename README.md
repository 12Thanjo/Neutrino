![Logo](Logo.png)
# Neutrino
A programming language that compiles to NodeJS and was designed to make programming easier (at least for me).

### Instalation
(NodeJS/npm is required)

Install the repo in your chosen method, and run:
```bash
$ npm install
```

### Usage
Neutrino files use the `.nt` file extention.

The `bin` folder contains the `.bat` files to run the Neutrino compiler. `neutrino.bat` and `nt.bat` are the same, and `tau.bat` is for the creation of built-in plugins (`.sh` files are also available)

```batch
$ ./bin/neutrino.bat compile file_to_compile.nt --debug --run
```

You can run `$./bin/neutrino.bat help` to see all of the compiler functionality.
You can also do the same with `tau`, but this is not necesarily designed for public use at this time (maybe coming in the future).

##### Suggested Use:
Add `./bin` to 

### Example Program:

```Neutrino
// create an array
local arr = [];

// add numbers 0 - 11 to arr
forNum(i, 12){
	arr.push(i);
};

// itterate over the array and add the index to each value
iterate arr(i, value){
	value += i;
};




// create a Vector class
class Vector(x, y){
	// automatically gives an id
	// private scope
	private.id = id;


	this.x = x;
	access.y = y;//this.y is readonly, private.y is writable

	// operator overloading with another Vector`
	operation += (Vector, vec){
		this.x += vec.x;
		private.y += vec.y;
	};
};


// create a subscope
scope {
	// create new vector available in this scope
	// will have an id of 0
	local vec1 = new Vector(1, 2);

	// create new vector available globally
	// will have an id of 1
	global vec2 = new Vector(3, 4);

	// use the overloaded operator
	vec2 $+= Vector.get(0);
};

console.log(vec2.x, vec2.y);
```

Since it just compiles to NodeJS, you have access to all of the built in objects and methods.

`.\test\test.nt`  has a usage example of every feature of Neutrino (it is the file I use to make sure everything is working).
It is possible that I have forgotten to add something to it, so if you see something missing feel free to make an issue.
Also, if there are feature(s) you would like to be added, feel free to add a pull request.
