var types = {
	"any": Array,
	"int8": Int8Array, "uint8": Uint8Array,
	"int16": Int16Array, "uint16": Uint16Array,
	"int32": Int32Array, "uint32": Uint32Array,
	"float32": Float32Array,
	"float64": Float64Array,
	"int64": BigInt64Array, "uint64": BigUint64Array,
};
var actions = new Map();
var components = {};
actions.set("component", (data)=>{
	var recursive = function(buffer, target, target_parent, key){
		if(buffer.type != null && buffer.type && typeof buffer.type == "string" && types[buffer.type]){
			target_parent[key] = new types[buffer.type](buffer.buffer);
		}else{
			for(var key in buffer){
				target[key] = {};
				recursive(buffer[key], target[key], target, key);
			}
		}
	};
	recursive(data, components);
});
var queries = {};
actions.set("query", (data)=>{
	queries[data.id] = new types[data.type](data.set);
});
var systems = {};
actions.set("system", (data)=>{
	data.event = "systems[data.id] = " + data.event;
	eval(data.event);
});
actions.set("run", (data)=>{
	var event = systems[data.event];
	var query = queries[data.query];
	for(var i=data.min; i<data.max;i++){
		event(query[i], components);
	}
	// console.log("done: ", data.event, data.min, data.max);
	this.postMessage(data);
});
actions.set("log", ()=>{
	console.log("components: ", components);
	console.log("queries: ", queries);
	console.log("systems: ", systems);
});
this.onmessage = function(e){
	actions.get(e.data.type)(e.data.data);
};