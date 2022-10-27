let $plugins=new Map();let $pending_plugins=new Map();let $get_plugin=function(name){if($plugins.has(name)){return $plugins.get(name);}else{let $plugin=$pending_plugins.get(name)();$plugins.set(name,$plugin);$pending_plugins.delete(name);return $plugin;};};
require("./neutrino_plugins/assert.js")($pending_plugins,$get_plugin);
require("./neutrino_plugins/cmd.js")($pending_plugins,$get_plugin);
for(var[$key,$value]of $pending_plugins.entries()){$get_plugin($key);};
if(globalThis.process!=null){process.neutrino_legacy_mode=false;}else{window.neutrino_legacy_mode=false;};let foo=-1; //4:10 | test.nt
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
let assert=$plugins.get('assert'); //34:7 | test.nt
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
assert('power (^)',128,()=>{
	return 128; //96:36 | test.nt
}); //96:7 | test.nt
console.log(); //97:12 | test.nt
console.log("Bitwise Operators:"); //100:12 | test.nt
assert('bitwise shift left (<<)',32,()=>{
	return 32; //101:49 | test.nt
}); //101:7 | test.nt
assert('bitwise shift right (>>)',31,()=>{
	return 31; //102:50 | test.nt
}); //102:7 | test.nt
assert('bitwise or (|||)',37,()=>{
	return 37; //103:42 | test.nt
}); //103:7 | test.nt
assert('bitwise and (&&&)',4,()=>{
	return 4; //104:42 | test.nt
}); //104:7 | test.nt
console.log(); //105:12 | test.nt
console.log("Assignment Operators:"); //108:12 | test.nt
var num=10; //109:13 | test.nt
assert('addition (+=)',14,()=>{
	num+=4; //110:36 | test.nt
	return num; //110:47 | test.nt
}); //110:7 | test.nt
assert('subtraction (-=)',12,()=>{
	num-=2; //111:39 | test.nt
	return num; //111:50 | test.nt
}); //111:7 | test.nt
assert('multiplication (*=)',24,()=>{
	num*=2; //112:42 | test.nt
	return num; //112:53 | test.nt
}); //112:7 | test.nt
assert('division (/=)',6,()=>{
	num/=4; //113:35 | test.nt
	return num; //113:46 | test.nt
}); //113:7 | test.nt
assert('modulus (%=)',2,()=>{
	num%=4; //114:34 | test.nt
	return num; //114:45 | test.nt
}); //114:7 | test.nt
assert('power (^=)',16,()=>{
	num=Math.pow(num, 4); //115:33 | test.nt
	return num; //115:44 | test.nt
}); //115:7 | test.nt
console.log(); //116:12 | test.nt
console.log("Reverse Assignment Operators:"); //119:12 | test.nt
var num=10; //120:13 | test.nt
var str="foo"; //121:13 | test.nt
assert('addition (=+)','barfoo',()=>{
	str="bar"+str; //122:42 | test.nt
	return str; //122:57 | test.nt
}); //122:7 | test.nt
assert('subtraction (=-)',-8,()=>{
	num=2-num; //123:39 | test.nt
	return num; //123:50 | test.nt
}); //123:7 | test.nt
assert('multiplication (=*)',-16,()=>{
	num=2*num; //124:43 | test.nt
	return num; //124:54 | test.nt
}); //124:7 | test.nt
assert('division (=/)',2,()=>{
	num=-32/num; //125:35 | test.nt
	return num; //125:48 | test.nt
}); //125:7 | test.nt
assert('modulus (=%)',1,()=>{
	num=5%num; //126:34 | test.nt
	return num; //126:45 | test.nt
}); //126:7 | test.nt
assert('modulus (=^)',4,()=>{
	num=Math.pow(4,num); //127:34 | test.nt
	return num; //127:45 | test.nt
}); //127:7 | test.nt
console.log(); //128:12 | test.nt
console.log("Special Assignment Operators:"); //131:12 | test.nt
var num=5; //132:13 | test.nt
assert("set greater (=>) smaller",5,()=>{
	if(3>num){num=3}; //133:46 | test.nt
	return num; //133:57 | test.nt
}); //133:7 | test.nt
assert("set greater (=>) larger",8,()=>{
	if(8>num){num=8}; //134:45 | test.nt
	return num; //134:56 | test.nt
}); //134:7 | test.nt
assert("set lesser (=<) smaller",3,()=>{
	if(3<num){num=3}; //135:45 | test.nt
	return num; //135:56 | test.nt
}); //135:7 | test.nt
assert("set lesser (=<) larger",3,()=>{
	if(8<num){num=8}; //136:44 | test.nt
	return num; //136:55 | test.nt
}); //136:7 | test.nt
console.log(); //137:12 | test.nt
console.log("Conditionals:"); //140:12 | test.nt
assert('if',true,()=>{
	if(true){
		return true; //143:15 | test.nt
	}; //142:7 | test.nt
}); //141:7 | test.nt
assert('else',true,()=>{
	if(false){
		return false; //148:15 | test.nt
	}else{
		return true; //150:15 | test.nt
	}; //147:7 | test.nt
}); //146:7 | test.nt
assert('else if',true,()=>{
	if(false){
		return false; //155:15 | test.nt
	}else if(true){
		return true; //157:15 | test.nt
	}else{
		return false; //159:15 | test.nt
	}; //154:7 | test.nt
}); //153:7 | test.nt
assert('equals (==)',true,()=>{
	return 1; //162:39 | test.nt
}); //162:7 | test.nt
assert('not equals (!=)',true,()=>{
	return 1; //163:43 | test.nt
}); //163:7 | test.nt
assert('greater than (>)',true,()=>{
	return 1; //164:44 | test.nt
}); //164:7 | test.nt
assert('less than (<)',true,()=>{
	return 1; //165:41 | test.nt
}); //165:7 | test.nt
assert('greater than or equal to (<=)',true,()=>{
	return 1; //166:57 | test.nt
}); //166:7 | test.nt
assert('less than or equal to (>=)',true,()=>{
	return 1; //167:54 | test.nt
}); //167:7 | test.nt
assert('and (&&)',false,()=>{
	return 0&&"foo"=="foo"; //168:37 | test.nt
}); //168:7 | test.nt
assert('or (||)',true,()=>{
	return 0||"foo"=="foo"; //169:35 | test.nt
}); //169:7 | test.nt
console.log(); //170:12 | test.nt
console.log("Loops:"); //173:12 | test.nt
assert("while",1,()=>{
	let count=0; //175:16 | test.nt
	while(true){
		count+=1; //177:14 | test.nt
		break; //178:14 | test.nt
	}; //176:10 | test.nt
	return count; //180:11 | test.nt
}); //174:7 | test.nt
assert("for",6,()=>{
	let forArr=[1,2,3]; //183:17 | test.nt
	let count=0; //184:16 | test.nt
	var $0=forArr.length;
	for(var i=0;i<$0;i++){
		count+=forArr[i]; //186:14 | test.nt
	}; //185:8 | test.nt
	return count; //188:11 | test.nt
}); //182:7 | test.nt
assert("forNum",true,()=>{
	let count=0; //191:16 | test.nt
	for(var i=0;i<4;i++){
		count+=i; //194:14 | test.nt
	}; //192:11 | test.nt
	let count2=0; //197:17 | test.nt
	for(var i=2;i<5;i++){
		count2+=i; //200:15 | test.nt
	}; //198:11 | test.nt
	return count==6&&count2==9; //203:11 | test.nt
}); //190:7 | test.nt
assert("iterate",true,()=>{
	let forArr=[1,2,3]; //206:17 | test.nt
	let key_count=0; //207:20 | test.nt
	let value_count=0; //208:22 | test.nt
	for(var[key,value]of forArr.entries()){
		key_count+=key; //210:18 | test.nt
		value_count+=value; //211:20 | test.nt
	}; //209:12 | test.nt
	return key_count==3&&value_count==6; //213:11 | test.nt
}); //205:7 | test.nt
assert("forKeys",true,()=>{
	let forKeysObj={
		foo:"bar",
		hello:"world"
	}; //216:21 | test.nt
	let key_arr=[]; //220:18 | test.nt
	let value_arr=[]; //221:20 | test.nt
	for(let key in forKeysObj){
		let value=forKeysObj[key];
		key_arr.push(key); //223:21 | test.nt
		value_arr.push(value); //224:23 | test.nt
	}; //222:12 | test.nt
	return key_arr[0]=='foo'&&key_arr[1]=='hello'&&value_arr[0]=='bar'&&value_arr[1]=='world'; //226:11 | test.nt
}); //215:7 | test.nt
console.log(); //231:12 | test.nt
console.log("Classes:"); //234:12 | test.nt
assert('struct',true,()=>{
	let GenericStruct=function(param){
		let $this=this;let private={};this.$op={};
		$this.name=param; //237:13 | test.nt
		private.priv_prop="hi"; //238:16 | test.nt
	}; //236:11 | test.nt
	let gen=new GenericStruct("name"); //241:14 | test.nt
	return gen.name=="name"&&gen.priv_prop==null; //242:11 | test.nt
}); //235:7 | test.nt
assert('class',true,()=>{
	let GenericClass=function(param){
		let $this=this;let private={};this.$op={};GenericClass.$map.set(GenericClass.$i,this);let id=GenericClass.$i;GenericClass.$i+=1;
		private.id=id; //251:18 | test.nt
		Object.defineProperty(this, "id", {get: ()=>{return private.id;}}); //251:15 | test.nt
		$this.param=param; //253:13 | test.nt
		private.priv_prop="hi"; //254:16 | test.nt
	}; //247:10 | test.nt
	GenericClass.$i=0;GenericClass.resetI=function(){GenericClass.$i=0;};GenericClass.$map=new Map();GenericClass.get=function(id){return GenericClass.$map.get(id);};GenericClass.has=function(id){return GenericClass.$map.has(id);};GenericClass.forEach=function(cb){GenericClass.$map.forEach(cb);};GenericClass.delete=function(cb){GenericClass.$map.delete(cb);}; //247:10 | test.nt
	new GenericClass("foo"); //258:23 | test.nt
	new GenericClass("bar"); //259:23 | test.nt
	let delete_me=new GenericClass("delete me"); //262:20 | test.nt
	GenericClass.delete(delete_me.id); //263:24 | test.nt
	return GenericClass.has(0)&&GenericClass.get(0).param=="foo"&&GenericClass.get(1).param=="bar"&&GenericClass.has(2)==false; //267:11 | test.nt
}); //244:7 | test.nt
assert('species',true,()=>{
	let GenericSpecies=function(id,param){
		let $this=this;let private={};this.$op={};GenericSpecies.$map.set(id,this);
		$this.name=id; //278:13 | test.nt
		$this.param=param; //279:13 | test.nt
		private.priv_prop="hi"; //280:16 | test.nt
		private.getter_prop=0; //282:27 | test.nt
		Object.defineProperty(this, "getter_prop", {get: ()=>{return private.getter_prop;}}); //282:15 | test.nt
		private.getter_prop+=1; //283:16 | test.nt
	}; //277:12 | test.nt
	GenericSpecies.$map=new Map();GenericSpecies.get=function(id){return GenericSpecies.$map.get(id);};GenericSpecies.has=function(id){return GenericSpecies.$map.has(id);};GenericSpecies.forEach=function(cb){GenericSpecies.$map.forEach(cb);};GenericSpecies.delete=function(id){GenericSpecies.$map.delete(id);}; //277:12 | test.nt
	let gen=new GenericSpecies('id','foo'); //286:14 | test.nt
	gen.getter_prop=2; //288:8 | test.nt
	let getter_count=0; //290:23 | test.nt
	GenericSpecies.forEach((target)=>{
		getter_count+=target.getter_prop; //292:21 | test.nt
	}); //291:27 | test.nt
	return GenericSpecies.has('id')&&GenericSpecies.get('id')==gen&&gen.param=='foo'&&gen.priv_prop==null&&gen.getter_prop==1&&getter_count==1; //294:11 | test.nt
}); //272:7 | test.nt
assert("Operator Overloading ($)",true,()=>{
	let Scalar=function(value){
		let $this=this;let private={};this.$op={};
		$this.value=value; //303:13 | test.nt
	}; //302:11 | test.nt
	let Vector2=function(x,y){
		let $this=this;let private={};this.$op={};
		$this.x=x; //306:13 | test.nt
		$this.y=y; //307:13 | test.nt
		this.$op["+= <Scalar>"]=function(scalar){
			$this.x+=scalar.value; //311:17 | test.nt
			$this.y+=scalar.value; //312:17 | test.nt
		}; //310:18 | test.nt
		this.$op["+ <Vector2>"]=function(vector){
			let new_x=$this.x+vector.x; //316:24 | test.nt
			let new_y=$this.y+vector.y; //317:24 | test.nt
			return new Vector2(new_x,new_y); //318:19 | test.nt
		}; //315:18 | test.nt
	}; //305:11 | test.nt
	let s1=new Scalar(1); //323:13 | test.nt
	let v1=new Vector2(2,3); //324:13 | test.nt
	let v2=new Vector2(4,5); //325:13 | test.nt
	v1.$op["+= <"+s1.constructor.name+">"](s1); //329:8 | test.nt
	v1.$op["+= <"+s1.constructor.name+">"](s1); //330:8 | test.nt
	let v3=v1.$op["+ <"+v2.constructor.name+">"](v2); //331:13 | test.nt
	return v3.x==8&&v3.y==10; //333:11 | test.nt
}); //301:7 | test.nt
console.log(); //335:12 | test.nt
console.log("Keywords:"); //338:12 | test.nt
assert('return',true,()=>{
	return true; //340:11 | test.nt
}); //339:7 | test.nt
assert('try',true,()=>{
	try{
		return true; //344:15 | test.nt
	}catch{}; //343:8 | test.nt
}); //342:7 | test.nt
assert('catch',true,()=>{
	try{
		foo=doesnt_exist; //349:12 | test.nt
		return false; //350:15 | test.nt
	}catch{
		return true; //352:15 | test.nt
	};
}); //347:7 | test.nt
assert('catch (e)',true,()=>{
	try{
		foo=doesnt_exist; //357:12 | test.nt
		return false; //358:15 | test.nt
	}catch(e){
		return e!=null; //360:15 | test.nt
	};
}); //355:7 | test.nt
assert('typeof',true,()=>{
	let num=1234; //364:14 | test.nt
	return typeof num==='number'; //365:11 | test.nt
}); //363:7 | test.nt
assert('instanceof',true,()=>{
	let Spec=function(){
		let $this=this;let private={};this.$op={};
	}; //368:11 | test.nt
	let foo=new Spec(); //370:14 | test.nt
	return foo instanceof Spec; //372:11 | test.nt
}); //367:7 | test.nt
assert('instanceof',true,()=>{
	let Spec=function(){
		let $this=this;let private={};this.$op={};
	}; //375:11 | test.nt
	let foo=new Spec(); //377:14 | test.nt
	return foo.constructor.name ==="Spec"; //379:11 | test.nt
}); //374:7 | test.nt
assert('swap',true,()=>{
	let a="a"; //382:12 | test.nt
	let b="b"; //383:12 | test.nt
	var $save=a;a=b;b=$save; //385:6 | test.nt
	return a=="b"&&b=="a"; //387:11 | test.nt
}); //381:7 | test.nt
assert('toggle',true,()=>{
	let foo=false; //390:14 | test.nt
	if(foo===false){foo=true;}else{foo=false;}; //391:8 | test.nt
	return foo; //392:11 | test.nt
}); //389:7 | test.nt
assert('break',1,()=>{
	let count=0; //395:16 | test.nt
	for(var i=0;i<3;i++){
		count+=i+1; //397:14 | test.nt
		break; //398:14 | test.nt
	}; //396:11 | test.nt
	return count; //400:11 | test.nt
}); //394:7 | test.nt
assert('default',2,()=>{
	let foo=null; //403:14 | test.nt
	if(foo==null){foo=2;}; //404:8 | test.nt
	return foo; //405:11 | test.nt
}); //402:7 | test.nt
assert('delete',null,()=>{
	let foo={
		bar:"asdf"
	}; //408:14 | test.nt
	delete foo.bar; //411:11 | test.nt
	return foo.bar; //412:11 | test.nt
}); //407:7 | test.nt
assert('is',true,()=>{
	let foo="foo"; //415:14 | test.nt
	let search=['asdf','foo']; //416:17 | test.nt
	return (['asdf','foo'].includes('foo'))&&(search.includes('foo')); //417:11 | test.nt
}); //414:7 | test.nt
assert('isnt',true,()=>{
	let foo="foo"; //420:14 | test.nt
	let search=['asdf','bar']; //421:17 | test.nt
	return ((['asdf','bar'].includes(foo)==false))&&((search.includes("foo")==false)); //422:11 | test.nt
}); //419:7 | test.nt
assert('scope',true,()=>{
	let foo=true; //425:14 | test.nt
	let bar=false; //426:14 | test.nt
	{
		let foo=false; //428:18 | test.nt
		bar=true; //429:12 | test.nt
	}; //427:10 | test.nt
	return foo&&bar; //431:11 | test.nt
}); //424:7 | test.nt
console.log(); //433:12 | test.nt
console.log("Errors:"); //436:12 | test.nt
assert('Error','message',()=>{
	try{
		throw new Error("message");
	}catch(e){
		return e.message; //441:15 | test.nt
	};
}); //437:7 | test.nt
assert('SyntaxError','message',()=>{
	try{
		throw new SyntaxError("message");
	}catch(e){
		return e.message; //448:15 | test.nt
	};
}); //444:7 | test.nt
assert('ReferenceError','message',()=>{
	try{
		throw new ReferenceError("message");
	}catch(e){
		return e.message; //455:15 | test.nt
	};
}); //451:7 | test.nt
assert('RangeError','message',()=>{
	try{
		throw new RangeError("message");
	}catch(e){
		return e.message; //462:15 | test.nt
	};
}); //458:7 | test.nt
console.log(); //465:12 | test.nt
assert.result(); //467:14 | test.nt
