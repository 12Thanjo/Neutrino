let $plugins=new Map();let $pending_plugins=new Map();let $get_plugin=function(name){if($plugins.has(name)){return $plugins.get(name);}else{var output=$pending_plugins.get(name)();$plugins.set(name,output);$pending_plugins.delete(name);return output;};};
$pending_plugins.set('assert',()=>{let plugin={};let cmd=$get_plugin('cmd');let check="✓";let x='✘';plugin=function(title,value,condition){if(condition()==value){cmd.log(check+" "+title,cmd.color.green);}else{cmd.log(x+" "+title,cmd.color.red);};};plugin.metadata={"name":"assert","version":"0.1.0","description":"assert module","main":"index.nt","author":"12Thanjo","dependancies":["cmd"]};return plugin;}); //34:7
$pending_plugins.set('cmd',()=>{let plugin={};plugin.color={black:"\x1b[30m",red:"\x1b[31m",yellow:"\x1b[33m",green:"\x1b[32m",blue:"\x1b[34m",magenta:"\x1b[35m",cyan:"\x1b[36m",white:"\x1b[37m"};plugin.backgroundColor={black:"\x1b[40m",red:"\x1b[41m",green:"\x1b[42m",yellow:"\x1b[43m",blue:"\x1b[44m",magenta:"\x1b[45m",cyan:"\x1b[46m",white:"\x1b[47m"};plugin.style={reset:"\x1b[0m",bright:"\x1b[1m",dim:"\x1b[2m",underscore:"\x1b[4m",blink:"\x1b[5m",reverse:"\x1b[7m",hidden:"\x1b[8m"};plugin.log=function(string,color,backgroundColor){string=string||"";color=color||"";backgroundColor=backgroundColor||"";console.log(color+backgroundColor+string+plugin.color.white+plugin.backgroundColor.black+plugin.style.reset);};plugin.specialLog=function(data){if(typeof data=="string"==false){console.log(data);console.log();}else{if(isNaN(data)==false){console.log(plugin.color.orange+data+plugin.color.white+"\n");}else{console.log(plugin.color.green+"'"+data+"'"+plugin.color.white+"\n");};};};plugin.metadata={"name":"cmd","version":"0.1.0","description":"command line interaction","main":"index.nt","author":"12Thanjo","dependancies":[]};return plugin;}); //34:7
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
assert('includes',true,()=>{
	let foo="foo"; //335:14 | test.nt
	return (['asdf','foo'].includes('foo')); //336:11 | test.nt
}); //334:7 | test.nt
assert('scope',true,()=>{
	let foo=true; //339:14 | test.nt
	let bar=false; //340:14 | test.nt
	{
		let foo=false; //342:18 | test.nt
		bar=true; //343:12 | test.nt
	}; //341:10 | test.nt
	return foo&&bar; //345:11 | test.nt
}); //338:7 | test.nt
console.log(); //347:12 | test.nt
console.log("Errors:"); //350:12 | test.nt
assert('Error','message',()=>{
	try{
		throw Error("message");
	}catch(e){
		return e.message; //355:15 | test.nt
	};
}); //351:7 | test.nt
assert('SyntaxError','message',()=>{
	try{
		throw SyntaxError("message");
	}catch(e){
		return e.message; //362:15 | test.nt
	};
}); //358:7 | test.nt
assert('ReferenceError','message',()=>{
	try{
		throw ReferenceError("message");
	}catch(e){
		return e.message; //369:15 | test.nt
	};
}); //365:7 | test.nt
assert('RangeError','message',()=>{
	try{
		throw RangeError("message");
	}catch(e){
		return e.message; //376:15 | test.nt
	};
}); //372:7 | test.nt
console.log(); //379:12 | test.nt
console.log("Multithreading:"); //385:12 | test.nt
assert("Thread",true,()=>{
}); //386:7 | test.nt
assert("Thread Pool",true,()=>{
}); //387:7 | test.nt
console.log(); //388:12 | test.nt
console.log("OCS:"); //415:12 | test.nt
assert("Environment",false,()=>{
}); //416:7 | test.nt
assert("Entity",false,()=>{
}); //417:7 | test.nt
assert("Component",false,()=>{
}); //418:7 | test.nt
assert("Query",false,()=>{
}); //419:7 | test.nt
assert("System",false,()=>{
}); //420:7 | test.nt
console.log(); //421:12 | test.nt
