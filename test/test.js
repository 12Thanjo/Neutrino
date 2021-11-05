let $plugins=new Map();let $pending_plugins=new Map();let $get_plugin=function(name){if($plugins.has(name)){return $plugins.get(name);}else{var output=$pending_plugins.get(name)();$plugins.set(name,output);$pending_plugins.delete(name);return output;};};
$pending_plugins.set('assert',()=>{let plugin={};let cmd=$get_plugin('cmd');let check="✓";let x='✘';plugin=function(title,value,condition){if(condition()==value){cmd.log(check+" "+title,cmd.color.green);}else{cmd.log(x+" "+title,cmd.color.red);};};plugin.metadata={"name":"assert","version":"0.1.0","description":"assert module","main":"index.nt","author":"12Thanjo","dependancies":["cmd"]};return plugin;}); //34:7
$pending_plugins.set('cmd',()=>{let plugin={};plugin.color={black:"\x1b[30m",red:"\x1b[31m",yellow:"\x1b[33m",green:"\x1b[32m",blue:"\x1b[34m",magenta:"\x1b[35m",cyan:"\x1b[36m",white:"\x1b[37m"};plugin.backgroundColor={black:"\x1b[40m",red:"\x1b[41m",green:"\x1b[42m",yellow:"\x1b[43m",blue:"\x1b[44m",magenta:"\x1b[45m",cyan:"\x1b[46m",white:"\x1b[47m"};plugin.style={reset:"\x1b[0m",bright:"\x1b[1m",dim:"\x1b[2m",underscore:"\x1b[4m",blink:"\x1b[5m",reverse:"\x1b[7m",hidden:"\x1b[8m"};plugin.log=function(string,color,backgroundColor){string=string||"";color=color||"";backgroundColor=backgroundColor||"";console.log(color+backgroundColor+string+plugin.color.white+plugin.backgroundColor.black+plugin.style.reset);};plugin.specialLog=function(data){if(typeof data=="string"==false){console.log(data);console.log();}else{if(isNaN(data)==false){console.log(plugin.color.orange+data+plugin.color.white+"\n");}else{console.log(plugin.color.green+"'"+data+"'"+plugin.color.white+"\n");};};};plugin.metadata={"name":"cmd","version":"0.1.0","description":"command line interaction","main":"index.nt","author":"12Thanjo","dependancies":[]};return plugin;}); //34:7
$pending_plugins.set('OCS',()=>{let plugin={metadata:{"name":"OCS","version":"0.1.0","description":"ECS architecture thats feature rich and incredibly fast","main":"index.nt","author":"12Thanjo","dependancies":["multithread"]}};let multithread=$get_plugin('multithread');let OCS=function(){console.log('%c OCS Initialized | v0.1.0',"background-color: #00667f ; color: #cccccc ; font-size: 16px ; font-family: 'american typewriter';");let all=function(...conditionals){return {test:(entity)=>{let pass=true;for(var[i,comp]of conditionals.entries()){if(typeof comp=="string"){if(entity[comp]==null){pass=false;break;};}else{if(entity[comp.id]==null){pass=false;break;};};};return pass;}};};let none=function(...conditionals){return {test:(entity)=>{let pass=true;for(var[i,comp]of conditionals.entries()){if(typeof comp=="string"){if(entity[comp]!=null){pass=false;break;};}else{if(entity[comp.id]!=null){pass=false;break;};};};return pass;}};};let some=function(...conditionals){return {test:(entity)=>{let pass=false;for(var[i,comp]of conditionals.entries()){if(typeof comp=="string"){if(entity[comp]!=null){pass=true;break;};}else{if(entity[comp.id]!=null){pass=true;break;};};};return pass;}};};let _Prop_=function(auto){let private={};_Prop_.$map.set(auto,this);this.auto=auto;};_Prop_.$map=new Map();_Prop_.get=function(id){return _Prop_.$map.get(id);};_Prop_.has=function(id){return _Prop_.$map.has(id);};_Prop_.forEach=function(cb){_Prop_.$map.forEach(cb);};_Prop_.delete=function(cb){_Prop_.$map.delete(cb);};let _Component_=function(id,builder){let private={};_Component_.$map.set(id,this);this.id=id;this.builder=builder;};_Component_.$map=new Map();_Component_.get=function(id){return _Component_.$map.get(id);};_Component_.has=function(id){return _Component_.$map.has(id);};_Component_.forEach=function(cb){_Component_.$map.forEach(cb);};_Component_.delete=function(cb){_Component_.$map.delete(cb);};let _Environment_=function(id){let private={};_Environment_.$map.set(id,this);private.id=id;private.entity_id=0;private.entity_lookup=new Map();private.removed=new Set();private.entities=[];let env_priv=private;let _Entity_=function(id,name){let private={};env_priv.entities[id]=this;private.id=id;Object.defineProperty(this, "id", {get: ()=>{return private.id;}});private.name=name;Object.defineProperty(this, "name", {get: ()=>{return private.name;}});if(name!=null){env_priv.entity_lookup.set(private.name,this);this.destroy=function(){_Query_.forEach((query)=>{query.remove(this);});env_priv.entity_lookup.delete(private.name);env_priv.removed.add(private.id);env_priv.entities[private.id]=null;};}else{this.destroy=function(){_Query_.forEach((query)=>{query.remove(this);});env_priv.removed.add(private.id);env_priv.entities[private.id]=null;};};this.bindComponent=function(component,...params){if(component instanceof _Component_||component instanceof EnvComponent){component=component.id;};if(EnvComponent.has(component)==false){throw ReferenceError("Environment ("+(env_priv.id)+") does not have component ("+(component)+")");};let component_target=EnvComponent.get(component);;if(component_target.builder instanceof _Prop_){if(params[0]==null){params[0]=component_target.builder.auto;};this[component]=params[0];}else{let builder_obj=Object.assign({},component_target.builder);;let i=0;let create_component_props=function(builder,depth_arr){if(builder instanceof _Prop_){if(params[i]==null){params[i]=builder.auto;};let target=builder_obj;for(var j=0;j<depth_arr.length-1;j++){target=target[depth_arr[j]];};target[depth_arr[depth_arr.length-1]]=params[i];i+=1;}else{for(let key in builder){let value=builder[key];create_component_props(value,[...depth_arr,key]);};};};create_component_props(builder_obj,[]);this[component]=builder_obj;};_Query_.forEach((query)=>{query.audit(this);});return this;};};let EnvComponent=function(id,builder){let private={};EnvComponent.$map.set(id,this);private.id=id;Object.defineProperty(this, "id", {get: ()=>{return private.id;}});this.builder=builder;};EnvComponent.$map=new Map();EnvComponent.get=function(id){return EnvComponent.$map.get(id);};EnvComponent.has=function(id){return EnvComponent.$map.has(id);};EnvComponent.forEach=function(cb){EnvComponent.$map.forEach(cb);};EnvComponent.delete=function(cb){EnvComponent.$map.delete(cb);};let _Query_=function(id,conditionals){let private={};_Query_.$map.set(id,this);this.entities=new Set();private.conditionals=conditionals;this.audit=function(entity){let pass=true;for(var[i,conditional]of private.conditionals.entries()){if(conditional.test(entity)==false){pass=false;break;};};if(pass){this.entities.add(entity.id);}else{this.entities.delete(entity.id);};};this.remove=function(entity){this.entities.delete(entity.id);};for(var[i,entity]of env_priv.entities.entries()){if(entity!=null){this.audit(entity);};};this.forEach=function(event){for(var[i,id]of this.entities.entries()){event(env_priv.entities[id],i);};};};_Query_.$map=new Map();_Query_.get=function(id){return _Query_.$map.get(id);};_Query_.has=function(id){return _Query_.$map.has(id);};_Query_.forEach=function(cb){_Query_.$map.forEach(cb);};_Query_.delete=function(cb){_Query_.$map.delete(cb);};let _System_=function(id,query,event){let private={};_System_.$map.set(id,this);private.query=_Query_.get(query);private.event=event;this.run=function(){private.query.forEach((entity,i)=>{private.event(entity,i);});};this.setupCluster=function(threads){event_str="evnt=($data)=>{$data.data=("+(event.toString())+")($data.data, $data.i);return $data;};";let evnt=null;eval(event_str);private.cluster=new multithread.cluster.forEach(threads,evnt);};this.runThreaded=function(components,callback){let array=[];private.query.forEach((entity)=>{let obj={};for(var[i,component]of components.entries()){obj[component]=entity[component];};array.push(obj);});private.cluster.run(array,(i,data)=>{private.query.forEach((entity)=>{for(var[j,component]of components.entries()){entity[component]=data[component];};});},callback);};this.runThreadedSafe=function(components,callback){let array=[];let entities=[];private.query.forEach((entity)=>{let obj={};for(var[i,component]of components.entries()){obj[component]=entity[component];entities.push(i);};array.push(obj);entities.push(entity);});private.cluster.run(array,(i,data)=>{for(var[j,entity]of entities.entries()){for(var[k,component]of components.entries()){entity[component]=data[component];};};},callback);};};_System_.$map=new Map();_System_.get=function(id){return _System_.$map.get(id);};_System_.has=function(id){return _System_.$map.has(id);};_System_.forEach=function(cb){_System_.$map.forEach(cb);};_System_.delete=function(cb){_System_.$map.delete(cb);};this.bindComponent=function(component){return new EnvComponent(component.id,component.builder);};this.getComponent=function(id){return EnvComponent.get(id);};this.createEntity=function(name){let new_entity=null;if(private.removed.size==0){new_entity=new _Entity_(private.entity_id,name);private.entity_id+=1;}else{let entity_id=private.removed.values().next().value;private.removed.delete(entity_id);new_entity=new _Entity_(entity_id,name);};return new_entity;};this.getEntity=function(name){return private.entity_lookup.get(name);};this.createQuery=function(id,...conditionals){new _Query_(id,conditionals)};this.deleteQuery=function(id){_Query_.delete(id);};this.createSystem=function(id,query,event){return new _System_(id,query,event);};this.getSystem=function(id){return _System_.get(id);};this.deleteSystem=function(id){_System_.delete(id);};};_Environment_.$map=new Map();_Environment_.get=function(id){return _Environment_.$map.get(id);};_Environment_.has=function(id){return _Environment_.$map.has(id);};_Environment_.forEach=function(cb){_Environment_.$map.forEach(cb);};_Environment_.delete=function(cb){_Environment_.$map.delete(cb);};let EventLoop=function(name){let private={};EventLoop.$map.set(name,this);private.name=name;Object.defineProperty(this, "name", {get: ()=>{return private.name;}});private.i=0;private.queue=[];this.add=function(event){private.queue.push(event);};this.next=function(){private.i+=1;try{private.queue[private.i](this.next);}catch{};};this.start=function(){private.i=-1;this.next();};};EventLoop.$map=new Map();EventLoop.get=function(id){return EventLoop.$map.get(id);};EventLoop.has=function(id){return EventLoop.$map.has(id);};EventLoop.forEach=function(cb){EventLoop.$map.forEach(cb);};EventLoop.delete=function(cb){EventLoop.$map.delete(cb);};return {_Environment_:_Environment_,_Component_:_Component_,_Prop_:_Prop_,all:all,none:none,some:some,EventLoop:EventLoop};};plugin=new OCS();;return plugin;}); //409:7
$pending_plugins.set('multithread',()=>{let plugin={metadata:{"name":"multithread","version":"0.1.0","description":"multithreading","main":"index.nt","author":"12Thanjo","dependancies":[]}};let worker=null;try{if(Worker!=null){worker=Worker;}else{worker=require('worker_threads').Worker;};}catch{worker=require('worker_threads').Worker;};let Thread=function(event,callback){let private={};let str="let $event="+event.toString();;str+=";this.onmessage=(e)=>{this.postMessage($event(e.data));};";let blob=new Blob([str]);let obj_url=URL.createObjectURL(blob,{type:'text/javascript'});;let new_worker=new worker(obj_url);new_worker.onmessage=(e)=>{callback(e.data);};return new_worker;};plugin.Thread=Thread;let num_CPUs=require('os').cpus().length;let forAll=function(threads,event){let private={};if(threads>num_CPUs-1){console.error("there are only "+(num_CPUs-1)+" threads available | got "+(threads)+"\ndefualting to "+(num_CPUs)+" threads");threads=num_CPUs;};private.threads=[];private.data_set=[];private.output=[];private.callback=()=>{};private.data_set_length=0;private.data_set_i=-1;private.threads_left=threads;for(var i=0;i<threads;i++){let new_thread=new Thread(event,(e)=>{private.data_set_i+=1;private.data_set_length-=1;if(private.data_set_length>threads){private.data_set_length-=1;new_thread.postMessage({i:private.data_set_i,data:private.data_set[private.data_set_i]});private.output[e.i]=e.data;}else{private.output[e.i]=e.data;private.threads_left-=1;if(private.threads_left==0){private.callback(private.output);};};});private.threads.push(new_thread);};this.run=function(dataSet,callback){private.data_set=dataSet;private.output=[];private.callback=callback;private.data_set_length=dataSet.length;private.data_set_i=-1;private.threads_left=threads;for(var[i,thread]of private.threads.entries()){private.data_set_i+=1;thread.postMessage({i:private.data_set_i,data:private.data_set[private.data_set_i]});};};};let forEach=function(threads,event){let private={};if(threads==null){threads=num_CPUs-1;};if(threads>num_CPUs-1){console.error("there are only "+(num_CPUs-1)+" threads available | got ("+(threads)+")\n\tdefaulting to "+(num_CPUs-1)+" threads");threads=num_CPUs;};private.threads=[];private.data_set=[];private.output=[];private.event=()=>{};private.callback=()=>{};private.data_set_length=0;private.data_set_i=-1;private.threads_left=threads;for(var i=0;i<threads;i++){let new_thread=new Thread(event,(e)=>{private.data_set_i+=1;if(private.data_set_length>threads){private.data_set_length-=1;new_thread.postMessage({i:private.data_set_i,data:private.data_set[private.data_set_i]});private.event(e.i,e.data);}else{private.threads_left-=1;private.event(e.i,e.data);if(private.threads_left==0){private.callback(private.output);};};});private.threads.push(new_thread);};this.run=function(dataSet,event,callback){private.data_set=dataSet;private.event=event;private.callback=callback;let data_set_length=dataSet.length;private.data_set_length=data_set_length;private.data_set_i=-1;private.threads_left=threads;for(var[i,thread]of private.threads.entries()){private.data_set_i+=1;if(private.data_set_i<data_set_length){thread.postMessage({i:private.data_set_i,data:private.data_set[private.data_set_i]});}else{private.threads_left-=1;};};};};plugin.cluster={forAll:forAll,forEach:forEach};;return plugin;}); //409:7
for(var[$key,$value]of $pending_plugins.entries()){$get_plugin($key);};
let foo=-1; //4:10 | test.nt
let integer=12; //6:14 | test.nt
var negative_and_decimal=-12.4; //9:30 | test.nt
globalThis.var3={
	string:"Hello World",
	array:[1.2,"3",["2D"],{
		foo:"bar"
	}],
	boolean:[true,false],
	foo:"bar"
}; //13:12 | test.nt
var3.nulish=[null,undefined]; //21:5 | test.nt
let assert=$plugins.get('assert'); //34:7
console.log('Modules:'); //35:12 | test.nt
assert("import (tau .ntp)",true,()=>{
	return assert.metadata.name=="assert"; //38:11 | test.nt
}); //36:7 | test.nt
assert('macro (.ntm)',true,()=>{
	return true; //1:7 | macro test.ntm
}); //40:7 | test.nt
console.log(); //43:12 | test.nt
console.log("Variable Initialization:"); //47:12 | test.nt
assert('local',true,()=>{
	let local_var=true; //49:20 | test.nt
	return local_var; //50:11 | test.nt
}); //48:7 | test.nt
assert('regional',true,()=>{
	var regional_var=true; //53:26 | test.nt
	return regional_var; //54:11 | test.nt
}); //52:7 | test.nt
assert('global',true,()=>{
	globalThis.global_var=true; //57:22 | test.nt
	return global_var; //58:11 | test.nt
}); //56:7 | test.nt
console.log(); //60:12 | test.nt
console.log("Misc: "); //63:12 | test.nt
assert('function',true,()=>{
	var func=function(param){ //65:28 | test.nt
		return param; //66:15 | test.nt
	}; //65:18 | test.nt
	return func(true); //68:11 | test.nt
}); //64:7 | test.nt
assert('arrow function (@()->{})',true,()=>{
	var a_func=(param)=>{
		return param; //72:15 | test.nt
	}; //71:20 | test.nt
	return a_func(true); //74:11 | test.nt
}); //70:7 | test.nt
assert('spread (~)',1,()=>{
	let arr=[1]; //77:14 | test.nt
	let spread_arr=[...arr]; //78:21 | test.nt
	return spread_arr[0]; //79:11 | test.nt
}); //76:7 | test.nt
assert('concat (| |)',true,()=>{
	let foo="c"; //82:14 | test.nt
	let bar="d"; //83:14 | test.nt
	let str="a"+(5)+"b"+(foo)+(bar); //84:14 | test.nt
	return str=="a5bcd"; //85:11 | test.nt
}); //81:7 | test.nt
console.log(); //87:12 | test.nt
console.log("Arithmetic Operators:"); //90:12 | test.nt
assert('addition (+)',10,()=>{
	return 10; //91:38 | test.nt
}); //91:7 | test.nt
assert('subtraction (-)',2,()=>{
	return 2; //92:40 | test.nt
}); //92:7 | test.nt
assert('multiplication (*)',24,()=>{
	return 24; //93:44 | test.nt
}); //93:7 | test.nt
assert('division (/)',1.5,()=>{
	return 1.5; //94:39 | test.nt
}); //94:7 | test.nt
assert('modulus (%)',2,()=>{
	return 2; //95:36 | test.nt
}); //95:7 | test.nt
console.log(); //96:12 | test.nt
console.log("Assignment Operators:"); //99:12 | test.nt
var num=10; //100:13 | test.nt
assert('addition (+=)',14,()=>{
	num+=4; //101:36 | test.nt
	return num; //101:47 | test.nt
}); //101:7 | test.nt
assert('subtraction (-=)',12,()=>{
	num-=2; //102:39 | test.nt
	return num; //102:50 | test.nt
}); //102:7 | test.nt
assert('multiplication (*=)',24,()=>{
	num*=2; //103:42 | test.nt
	return num; //103:53 | test.nt
}); //103:7 | test.nt
assert('division (/=)',6,()=>{
	num/=4; //104:35 | test.nt
	return num; //104:46 | test.nt
}); //104:7 | test.nt
assert('modulus (%=)',2,()=>{
	num%=4; //105:34 | test.nt
	return num; //105:45 | test.nt
}); //105:7 | test.nt
console.log(); //106:12 | test.nt
console.log("Reverse Assignment Operators:"); //109:12 | test.nt
var num=10; //110:13 | test.nt
var str="foo"; //111:13 | test.nt
assert('addition (=+)','barfoo',()=>{
	str="bar"+str; //112:42 | test.nt
	return str; //112:57 | test.nt
}); //112:7 | test.nt
assert('subtraction (=-)',-8,()=>{
	num=2-num; //113:39 | test.nt
	return num; //113:50 | test.nt
}); //113:7 | test.nt
assert('multiplication (=*)',-16,()=>{
	num=2*num; //114:43 | test.nt
	return num; //114:54 | test.nt
}); //114:7 | test.nt
assert('division (=/)',2,()=>{
	num=-32/num; //115:35 | test.nt
	return num; //115:48 | test.nt
}); //115:7 | test.nt
assert('modulus (=%)',1,()=>{
	num=5%num; //116:34 | test.nt
	return num; //116:45 | test.nt
}); //116:7 | test.nt
console.log(); //117:12 | test.nt
console.log("Special Assignment Operators:"); //120:12 | test.nt
var num=5; //121:13 | test.nt
assert("set greater (=>) smaller",5,()=>{
	if(3>num){num=3}; //122:46 | test.nt
	return num; //122:57 | test.nt
}); //122:7 | test.nt
assert("set greater (=>) larger",8,()=>{
	if(8>num){num=8}; //123:45 | test.nt
	return num; //123:56 | test.nt
}); //123:7 | test.nt
assert("set lesser (=<) smaller",3,()=>{
	if(3<num){num=3}; //124:45 | test.nt
	return num; //124:56 | test.nt
}); //124:7 | test.nt
assert("set lesser (=<) larger",3,()=>{
	if(8<num){num=8}; //125:44 | test.nt
	return num; //125:55 | test.nt
}); //125:7 | test.nt
console.log(); //126:12 | test.nt
console.log("Conditionals:"); //129:12 | test.nt
assert('if',true,()=>{
	if(true){
		return true; //132:15 | test.nt
	}; //131:7 | test.nt
}); //130:7 | test.nt
assert('else',true,()=>{
	if(false){
		return false; //137:15 | test.nt
	}else{
		return true; //139:15 | test.nt
	}; //136:7 | test.nt
}); //135:7 | test.nt
assert('else if',true,()=>{
	if(false){
		return false; //144:15 | test.nt
	}else if(true){
		return true; //146:15 | test.nt
	}else{
		return false; //148:15 | test.nt
	}; //143:7 | test.nt
}); //142:7 | test.nt
assert('equals (==)',true,()=>{
	return 1; //151:39 | test.nt
}); //151:7 | test.nt
assert('not equals (!=)',true,()=>{
	return 1; //152:43 | test.nt
}); //152:7 | test.nt
assert('greater than (>)',true,()=>{
	return 1; //153:44 | test.nt
}); //153:7 | test.nt
assert('less than (<)',true,()=>{
	return 1; //154:41 | test.nt
}); //154:7 | test.nt
assert('greater than or equal to (<=)',true,()=>{
	return 1; //155:57 | test.nt
}); //155:7 | test.nt
assert('less than or equal to (>=)',true,()=>{
	return 1; //156:54 | test.nt
}); //156:7 | test.nt
assert('and (&&)',false,()=>{
	return 0&&"foo"=="foo"; //157:37 | test.nt
}); //157:7 | test.nt
assert('or (||)',true,()=>{
	return 0||"foo"=="foo"; //158:35 | test.nt
}); //158:7 | test.nt
console.log(); //159:12 | test.nt
console.log("Loops:"); //162:12 | test.nt
assert("while",1,()=>{
	let count=0; //164:16 | test.nt
	while(true){
		count+=1; //166:14 | test.nt
		break; //167:14 | test.nt
}; //165:10 | test.nt
	return count; //169:11 | test.nt
}); //163:7 | test.nt
assert("for",6,()=>{
	let forArr=[1,2,3]; //172:17 | test.nt
	let count=0; //173:16 | test.nt
	let $arr_length=forArr.length;
	for(var i=0;i<$arr_length;i++){
		count+=forArr[i]; //175:14 | test.nt
	}; //174:8 | test.nt
	return count; //177:11 | test.nt
}); //171:7 | test.nt
assert("forNum",6,()=>{
	let count=0; //180:16 | test.nt
	for(var i=0;i<4;i++){
		count+=i; //183:14 | test.nt
	}; //181:11 | test.nt
	return count; //185:11 | test.nt
}); //179:7 | test.nt
assert("itterate",true,()=>{
	let forArr=[1,2,3]; //188:17 | test.nt
	let key_count=0; //189:20 | test.nt
	let value_count=0; //190:22 | test.nt
	for(var[key,value]of forArr.entries()){
		key_count+=key; //192:18 | test.nt
		value_count+=value; //193:20 | test.nt
	}; //191:13 | test.nt
	return key_count==3&&value_count==6; //195:11 | test.nt
}); //187:7 | test.nt
assert("forKeys",true,()=>{
	let forKeysObj={
		foo:"bar",
		hello:"world"
	}; //198:21 | test.nt
	let key_arr=[]; //202:18 | test.nt
	let value_arr=[]; //203:20 | test.nt
	for(let key in forKeysObj){
		let value=forKeysObj[key];
		key_arr.push(key); //205:21 | test.nt
		value_arr.push(value); //206:23 | test.nt
	}; //204:12 | test.nt
	return key_arr[0]=='foo'&&key_arr[1]=='hello'&&value_arr[0]=='bar'&&value_arr[1]=='world'; //208:11 | test.nt
}); //197:7 | test.nt
console.log(); //213:12 | test.nt
console.log("Classes:"); //216:12 | test.nt
assert('struct',true,()=>{
	let GenericStruct=function(param){
		let private={};
		this.name=param; //219:13 | test.nt
		private.priv_prop="hi"; //220:16 | test.nt
	}; //218:11 | test.nt
	let gen=new GenericStruct("name"); //223:14 | test.nt
	return gen.name=="name"&&gen.priv_prop==null; //224:11 | test.nt
}); //217:7 | test.nt
assert('class',true,()=>{
	let GenericClass=function(param){
		let private={};GenericClass.$map.set(GenericClass.$i,this);let id=GenericClass.$i;GenericClass.$i+=1;
		private.id=id; //230:18 | test.nt
		Object.defineProperty(this, "id", {get: ()=>{return private.id;}}); //230:15 | test.nt
		this.param=param; //231:13 | test.nt
		private.priv_prop="hi"; //232:16 | test.nt
	}; //229:10 | test.nt
	GenericClass.$i=0;GenericClass.resetI=function(){GenericClass.$i=0;};GenericClass.$map=new Map();GenericClass.get=function(id){return GenericClass.$map.get(id);};GenericClass.has=function(id){return GenericClass.$map.has(id);};GenericClass.forEach=function(cb){GenericClass.$map.forEach(cb);};GenericClass.delete=function(cb){GenericClass.$map.delete(cb);}; //229:10 | test.nt
new GenericClass("foo"); //235:10 | test.nt
new GenericClass("bar"); //236:10 | test.nt
	return GenericClass.has(0)&&GenericClass.get(0).param=="foo"&&GenericClass.get(1).param=="bar"; //238:11 | test.nt
}); //226:7 | test.nt
assert('species',true,()=>{
	let GenericSpecies=function(id,param){
		let private={};GenericSpecies.$map.set(id,this);
		this.name=id; //245:13 | test.nt
		this.param=param; //246:13 | test.nt
		private.priv_prop="hi"; //247:16 | test.nt
		private.getter_prop=0; //248:27 | test.nt
		Object.defineProperty(this, "getter_prop", {get: ()=>{return private.getter_prop;}}); //248:15 | test.nt
		private.getter_prop+=1; //249:16 | test.nt
	}; //244:12 | test.nt
	GenericSpecies.$map=new Map();GenericSpecies.get=function(id){return GenericSpecies.$map.get(id);};GenericSpecies.has=function(id){return GenericSpecies.$map.has(id);};GenericSpecies.forEach=function(cb){GenericSpecies.$map.forEach(cb);};GenericSpecies.delete=function(cb){GenericSpecies.$map.delete(cb);}; //244:12 | test.nt
	let gen=new GenericSpecies('id','foo'); //252:14 | test.nt
	gen.getter_prop=2; //254:8 | test.nt
	let getter_count=0; //256:23 | test.nt
	GenericSpecies.forEach((target)=>{
		getter_count+=target.getter_prop; //258:21 | test.nt
	}); //257:27 | test.nt
	return GenericSpecies.has('id')&&GenericSpecies.get('id')==gen&&gen.param=='foo'&&gen.priv_prop==null&&gen.getter_prop==1&&getter_count==1; //260:11 | test.nt
}); //240:7 | test.nt
console.log(); //262:12 | test.nt
console.log("Keywords:"); //265:12 | test.nt
assert('return',true,()=>{
	return true; //267:11 | test.nt
}); //266:7 | test.nt
assert('try',true,()=>{
	try{
		return true; //271:15 | test.nt
	}catch{}; //270:8 | test.nt
}); //269:7 | test.nt
assert('catch',true,()=>{
	try{
		foo=doesnt_exist; //276:12 | test.nt
		return false; //277:15 | test.nt
	}catch{
		return true; //279:15 | test.nt
	};
}); //274:7 | test.nt
assert('catch (e)',true,()=>{
	try{
		foo=doesnt_exist; //284:12 | test.nt
		return false; //285:15 | test.nt
	}catch(e){
		return e!=null; //287:15 | test.nt
	};
}); //282:7 | test.nt
assert('typeof',true,()=>{
	let num=1234; //291:14 | test.nt
	return typeof num=='number'; //292:11 | test.nt
}); //290:7 | test.nt
assert('instanceof',true,()=>{
	let Spec=function(){
		let private={};
	}; //295:11 | test.nt
	let foo=new Spec(); //297:14 | test.nt
	return foo instanceof Spec; //299:11 | test.nt
}); //294:7 | test.nt
assert('swap',true,()=>{
	let a="foo"; //302:12 | test.nt
	let b="bar"; //303:12 | test.nt
	let $save=a;a=b;b=$save; //305:6 | test.nt
	return a=="bar"&&b=="foo"; //307:11 | test.nt
}); //301:7 | test.nt
assert('toggle',true,()=>{
	let foo=false; //310:14 | test.nt
	if(foo==false){foo=true;}else{foo=false;}; //311:8 | test.nt
	return foo; //312:11 | test.nt
}); //309:7 | test.nt
assert('break',1,()=>{
	let count=0; //315:16 | test.nt
	for(var i=0;i<3;i++){
		count+=i+1; //317:14 | test.nt
		break; //318:14 | test.nt
	}; //316:11 | test.nt
	return count; //320:11 | test.nt
}); //314:7 | test.nt
assert('default',2,()=>{
	let foo=null; //323:14 | test.nt
	if(foo==null){foo=2;}; //324:8 | test.nt
	return foo; //325:11 | test.nt
}); //322:7 | test.nt
assert('delete',null,()=>{
	let foo={
		bar:"asdf"
	}; //328:14 | test.nt
	delete foo.bar; //331:11 | test.nt
	return foo.bar; //332:11 | test.nt
}); //327:7 | test.nt
assert('is',true,()=>{
	let foo="foo"; //335:14 | test.nt
	let search=['asdf','foo']; //336:17 | test.nt
	return (['asdf','foo'].includes('foo'))&&(search.includes('foo')); //337:11 | test.nt
}); //334:7 | test.nt
assert('scope',true,()=>{
	let foo=true; //340:14 | test.nt
	let bar=false; //341:14 | test.nt
	{
		let foo=false; //343:18 | test.nt
		bar=true; //344:12 | test.nt
	}; //342:10 | test.nt
	return foo&&bar; //346:11 | test.nt
}); //339:7 | test.nt
console.log(); //348:12 | test.nt
console.log("Errors:"); //351:12 | test.nt
assert('Error','message',()=>{
	try{
		throw Error("message");
	}catch(e){
		return e.message; //356:15 | test.nt
	};
}); //352:7 | test.nt
assert('SyntaxError','message',()=>{
	try{
		throw SyntaxError("message");
	}catch(e){
		return e.message; //363:15 | test.nt
	};
}); //359:7 | test.nt
assert('ReferenceError','message',()=>{
	try{
		throw ReferenceError("message");
	}catch(e){
		return e.message; //370:15 | test.nt
	};
}); //366:7 | test.nt
assert('RangeError','message',()=>{
	try{
		throw RangeError("message");
	}catch(e){
		return e.message; //377:15 | test.nt
	};
}); //373:7 | test.nt
console.log(); //380:12 | test.nt
let OCS=$plugins.get('OCS'); //409:7
console.log("OCS:"); //411:12 | test.nt
assert("Environment",true,()=>{
	let main=new OCS._Environment_("main"); //414:16 | test.nt
	let remove=new OCS._Environment_("remove"); //415:16 | test.nt
	OCS._Environment_.delete('remove'); //416:16 | test.nt
	return OCS._Environment_.has('main')&&OCS._Environment_.has('remove')==false; //418:11 | test.nt
}); //412:7 | test.nt
assert("Entity",true,()=>{
	let main=OCS._Environment_.get("main"); //421:15 | test.nt
	let foo=main.createEntity("foo"); //424:17 | test.nt
	let bar=main.createEntity(); //425:17 | test.nt
	bar.destroy(); //426:11 | test.nt
	return main.getEntity('foo')!=null; //427:11 | test.nt
}); //420:7 | test.nt
assert("Component",true,()=>{
	let main=OCS._Environment_.get("main"); //431:15 | test.nt
	let foo=main.getEntity('foo'); //432:14 | test.nt
	let position=new OCS._Component_("position",{
		x:new OCS._Prop_(0),
		y:new OCS._Prop_(0),
		z:0
	}); //435:14 | test.nt
	main.bindComponent(position); //442:19 | test.nt
	foo.bindComponent(position,1); //445:18 | test.nt
	let success=foo.position.x==1&&foo.position.y==0&&foo.position.z==0; //447:18 | test.nt
	return success; //451:11 | test.nt
}); //429:7 | test.nt
assert("Query",true,()=>{
	let main=OCS._Environment_.get("main"); //456:15 | test.nt
	let position=main.getComponent("position"); //457:19 | test.nt
	let rotation=new OCS._Component_("rotation",{
		x:new OCS._Prop_(0),
		y:new OCS._Prop_(0)
	}); //460:14 | test.nt
	main.bindComponent(rotation); //464:19 | test.nt
	let alpha=new OCS._Component_("alpha",{
		alpha:new OCS._Prop_(1)
	}); //466:14 | test.nt
	main.bindComponent(alpha); //469:16 | test.nt
	let a=main.createEntity("a"); //472:17 | test.nt
	a.bindComponent(position); //473:16 | test.nt
	a.bindComponent(rotation); //474:16 | test.nt
	let b=main.createEntity("b"); //477:17 | test.nt
	b.bindComponent(position); //478:16 | test.nt
	let c=main.createEntity("c"); //481:17 | test.nt
	c.bindComponent(alpha); //482:13 | test.nt
	main.createQuery("query_all",OCS.all("position")); //486:16 | test.nt
	main.createQuery("query_some",OCS.some("rotation","alpha")); //487:16 | test.nt
	main.createQuery("query_none",OCS.none("position")); //488:16 | test.nt
	main.createQuery("query_multiple",OCS.all(OCS.some("position"),"rotation"),OCS.none("alpha")); //489:16 | test.nt
	return true; //499:11 | test.nt
}); //454:7 | test.nt
assert("System",true,()=>{
	let main=OCS._Environment_.get("main"); //503:15 | test.nt
	main.getEntity('foo').destroy(); //504:34 | test.nt
	let success=true; //505:18 | test.nt
	let should_pass=function(val){ //506:32 | test.nt
		if(val==false){
			success=false; //508:20 | test.nt
		}; //507:11 | test.nt
	}; //506:22 | test.nt
	let should_fail=function(val){ //511:32 | test.nt
		if(val==true){
			success=false; //513:20 | test.nt
		}; //512:11 | test.nt
	}; //511:22 | test.nt
	let system_all=main.createSystem("system_all","query_all",(entity,i)=>{
		entity.position.x+=1; //520:15 | test.nt
		should_pass(["a","b"].includes(entity.name)); //521:20 | test.nt
		should_fail(["c"].includes(entity.name)); //522:20 | test.nt
		return entity;
	}); //519:17 | test.nt
	system_all.run(); //524:19 | test.nt
	let system_some=main.createSystem("system_some","query_some",(entity,i)=>{
		should_pass(["a","c"].includes(entity.name)); //527:20 | test.nt
		should_fail(["b"].includes(entity.name)); //528:20 | test.nt
		return entity;
	}); //526:17 | test.nt
	system_some.run(); //530:20 | test.nt
	let system_none=main.createSystem("system_none","query_none",(entity,i)=>{
		should_pass(["c"].includes(entity.name)); //533:20 | test.nt
		should_fail(["a","b"].includes(entity.name)); //534:20 | test.nt
		return entity;
	}); //532:17 | test.nt
	system_none.run(); //536:20 | test.nt
	let system_multiple=main.createSystem("system_multiple","query_multiple",(entity,i)=>{
		should_pass(["a"].includes(entity.name)); //539:20 | test.nt
		should_fail(["b","c"].includes(entity.name)); //540:20 | test.nt
		return entity;
	}); //538:17 | test.nt
	system_multiple.run(); //542:24 | test.nt
	return success; //545:11 | test.nt
}); //501:7 | test.nt
console.log(); //547:12 | test.nt
