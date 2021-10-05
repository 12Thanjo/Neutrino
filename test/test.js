let $plugins=new Map();let $pending_plugins=new Map();let $get_plugin=function(name){if($plugins.has(name)){return $plugins.get(name);}else{var output=$pending_plugins.get(name)();$plugins.set(name,output);$pending_plugins.delete(name);return output;};};
$pending_plugins.set('assert',()=>{let plugin={};let cmd=$get_plugin('cmd');let check="✓";let x='✘';plugin=function(title,value,condition){if(condition()==value){cmd.log(check+" "+title,cmd.color.green);}else{cmd.log(x+" "+title,cmd.color.red);};};return plugin;}); //34:1
$pending_plugins.set('cmd',()=>{let plugin={};plugin.color={black:"\x1b[30m",red:"\x1b[31m",yellow:"\x1b[33m",green:"\x1b[32m",blue:"\x1b[34m",magenta:"\x1b[35m",cyan:"\x1b[36m",white:"\x1b[37m"};plugin.background_color={black:"\x1b[40m",red:"\x1b[41m",green:"\x1b[42m",yellow:"\x1b[43m",blue:"\x1b[44m",magenta:"\x1b[45m",cyan:"\x1b[46m",white:"\x1b[47m"};plugin.style={reset:"\x1b[0m",bright:"\x1b[1m",dim:"\x1b[2m",underscore:"\x1b[4m",blink:"\x1b[5m",reverse:"\x1b[7m",hidden:"\x1b[8m"};plugin.log=function(string,color,backgroundColor){string=string||"";color=color||"";backgroundColor=backgroundColor||"";console.log(color+backgroundColor+string+plugin.color.white+plugin.background_color.black+plugin.style.reset);};plugin.specialLog=function(data){if(typeof data=="string"==false){console.log(data);console.log();}else{if(isNaN(data)==false){console.log(plugin.color.orange+data+plugin.color.white+"\n");}else{console.log(plugin.color.green+"'"+data+"'"+plugin.color.white+"\n");};};};return plugin;}); //34:1
for(var[$key,$value]of $pending_plugins.entries()){$get_plugin($key);};
(()=>{
let foo=-1; //4:7
let integer=12; //6:7
var negative_and_decimal=-12.4; //9:10
globalThis.var3={
	string:"Hello World",
	array:[1.2,"3",["2D"],{
		foo:"bar"
	}],
	boolean:[true,false],
	foo:"bar"
}; //13:8
var3.nulish=[null,undefined]; //21:1
let assert=$plugins.get('assert'); //34:1
console.log('Modules:'); //35:9
assert("import (tau .ntp)",true,()=>{
	return true; //37:5
}); //36:1
assert('macro (.ntm)',true,()=>{
	return true; //1:1 | macro test.ntm
}); //39:1
console.log(); //42:9
console.log("Variable Initialization:"); //46:9
assert('local',true,()=>{
	let local_var=true; //48:11
	return local_var; //49:5
}); //47:1
assert('regional',true,()=>{
	var regional_var=true; //52:14
	return regional_var; //53:5
}); //51:1
assert('global',true,()=>{
	globalThis.global_var=true; //56:12
	return global_var; //57:5
}); //55:1
console.log(); //59:9
console.log("Misc: "); //62:9
assert('function',true,()=>{
	var func=function(param){ //64:20
		return param; //65:9
	}; //64:14
	return func(true); //67:5
}); //63:1
assert('arrow function (@()->{})',true,()=>{
	var a_func=(param)=>{
		return param; //71:9
	}; //70:14
	return a_func(true); //73:5
}); //69:1
assert('spread (~)',1,()=>{
	let arr=[1]; //76:11
	let spread_arr=[...arr]; //77:11
	return spread_arr[0]; //78:5
}); //75:1
assert('concat (| |)',true,()=>{
	let foo="c"; //81:11
	let bar="d"; //82:11
	let str="a"+(5)+"b"+(foo)+(bar); //83:11
	return str=="a5bcd"; //84:5
}); //80:1
console.log(); //86:9
console.log("Arithmetic Operators:"); //89:9
assert('addition (+)',10,()=>{
	return 10; //90:32
}); //90:1
assert('subtraction (-)',2,()=>{
	return 2; //91:34
}); //91:1
assert('multiplication (*)',24,()=>{
	return 24; //92:38
}); //92:1
assert('division (/)',1.5,()=>{
	return 1.5; //93:33
}); //93:1
assert('modulus (%)',2,()=>{
	return 2; //94:30
}); //94:1
console.log(); //95:9
console.log("Assignment Operators:"); //98:9
var num=10; //99:10
assert('addition (+=)',14,()=>{
	num+=4; //100:33
	return num; //100:41
}); //100:1
assert('subtraction (-=)',12,()=>{
	num-=2; //101:36
	return num; //101:44
}); //101:1
assert('multiplication (*=)',24,()=>{
	num*=2; //102:39
	return num; //102:47
}); //102:1
assert('division (/=)',6,()=>{
	num/=4; //103:32
	return num; //103:40
}); //103:1
assert('modulus (%=)',2,()=>{
	num%=4; //104:31
	return num; //104:39
}); //104:1
console.log(); //105:9
console.log("Reverse Assignment Operators:"); //108:9
var num=10; //109:10
var str="foo"; //110:10
assert('addition (=+)','barfoo',()=>{
	str="bar"+str; //111:39
	return str; //111:51
}); //111:1
assert('subtraction (=-)',-8,()=>{
	num=2-num; //112:36
	return num; //112:44
}); //112:1
assert('multiplication (=*)',-16,()=>{
	num=2*num; //113:40
	return num; //113:48
}); //113:1
assert('division (=/)',2,()=>{
	num=-32/num; //114:32
	return num; //114:42
}); //114:1
assert('modulus (=%)',1,()=>{
	num=5%num; //115:31
	return num; //115:39
}); //115:1
console.log(); //116:9
console.log("Special Assignment Operators:"); //119:9
var num=5; //120:10
assert("set greater (=>) smaller",5,()=>{
	if(3>num){num=3}; //121:43
	return num; //121:51
}); //121:1
assert("set greater (=>) larger",8,()=>{
	if(8>num){num=8}; //122:42
	return num; //122:50
}); //122:1
assert("set lesser (=<) smaller",3,()=>{
	if(3<num){num=3}; //123:42
	return num; //123:50
}); //123:1
assert("set lesser (=<) larger",3,()=>{
	if(8<num){num=8}; //124:41
	return num; //124:49
}); //124:1
console.log(); //125:9
console.log("Conditionals:"); //128:9
assert('if',true,()=>{
	if(true){
		return true; //131:9
	}; //130:7
}); //129:1
assert('else',true,()=>{
	if(false){
		return false; //136:9
	}else{
		return true; //138:9
	}; //135:7
}); //134:1
assert('else if',true,()=>{
	if(false){
		return false; //143:9
	}else if(true){
		return true; //145:9
	}else{
		return false; //147:9
	}; //142:7
}); //141:1
assert('equals (==)',true,()=>{
	return true; //150:33
}); //150:1
assert('not equals (!=)',true,()=>{
	return true; //151:37
}); //151:1
assert('greater than (>)',true,()=>{
	return true; //152:38
}); //152:1
assert('less than (<)',true,()=>{
	return true; //153:35
}); //153:1
assert('greater than or equal to (<=)',true,()=>{
	return true; //154:51
}); //154:1
assert('less than or equal to (>=)',true,()=>{
	return true; //155:48
}); //155:1
assert('and (&&)',false,()=>{
	return false&&"foo"=="foo"; //156:31
}); //156:1
assert('or (||)',true,()=>{
	return false||"foo"=="foo"; //157:29
}); //157:1
console.log(); //158:9
console.log("Loops:"); //161:9
assert("for",6,()=>{
	let forArr=[1,2,3]; //163:11
	let count=0; //164:11
	let $arr_length=forArr.length;
	for(var i=0;i<$arr_length;i++){
		count+=forArr[i]; //166:9
	}; //165:5
	return count; //168:5
}); //162:1
assert("forNum",6,()=>{
	let count=0; //171:11
	for(var i=0;i<4;i++){
		count+=i; //174:9
	}; //172:5
	return count; //176:5
}); //170:1
assert("itterate",true,()=>{
	let forArr=[1,2,3]; //179:11
	let key_count=0; //180:11
	let value_count=0; //181:11
	for(var[key,value]of 	forArr.entries()){
		key_count+=key; //183:9
		value_count+=value; //184:9
	}; //182:5
	return key_count==3&&value_count==6; //186:5
}); //178:1
assert("forKeys",true,()=>{
	let forKeysObj={
		foo:"bar",
		hello:"world"
	}; //189:11
	let key_arr=[]; //193:11
	let value_arr=[]; //194:11
	for(let key in forKeysObj){
		let value=forKeysObj[key];
		key_arr.push(key); //196:17
		value_arr.push(value); //197:19
	}; //195:5
	return key_arr[0]=='foo'&&key_arr[1]=='hello'&&value_arr[0]=='bar'&&value_arr[1]=='world'; //199:5
}); //188:1
console.log(); //204:9
console.log("Classes:"); //207:9
assert('species',true,()=>{
	let GenericClass=function(param){
		let private={};
		this.name=param; //210:9
		private.priv_prop="hi"; //211:9
	}; //209:5
	let gen=new GenericClass("name"); //214:11
	return gen.name=="name"&&gen.priv_prop==null; //215:5
}); //208:1
assert('class',true,()=>{
	let GenericClass=function(id,param){
		let private={};GenericClass.$map.set(id,this);
		this.name=id; //220:9
		this.param=param; //221:9
		private.priv_prop="hi"; //222:9
		private.getter_prop=1; //223:16
		Object.defineProperty(this, "getter_prop", {get: ()=>{return private.getter_prop;}}); //223:9
	}; //219:5
	GenericClass.$map=new Map();GenericClass.get=function(id){return GenericClass.$map.get(id);};GenericClass.has=function(id){return GenericClass.$map.has(id);};GenericClass.forEach=function(cb){GenericClass.$map.forEach(cb);}; //219:5
	let gen=new GenericClass('id','foo'); //227:11
	gen.getter_prop=2; //229:5
	let getter_count=0; //231:11
	GenericClass.forEach((e)=>{
		getter_count+=e.getter_prop; //233:9
	}); //232:18
	return GenericClass.has('id')&&GenericClass.get('id')==gen&&gen.param=='foo'&&gen.priv_prop==null&&gen.getter_prop==1&&getter_count==1; //236:5
}); //217:1
console.log(); //238:9
console.log("Keywords:"); //241:9
assert('return',true,()=>{
	return true; //243:5
}); //242:1
assert('try',true,()=>{
	try{
		return true; //247:9
	}catch{}; //246:5
}); //245:1
assert('catch',true,()=>{
	try{
		foo=doesnt_exist; //252:9
		return false; //253:9
	}catch{
		return true; //255:9
	};
}); //250:1
assert('catch (e)',true,()=>{
	try{
		foo=doesnt_exist; //260:9
		return false; //261:9
	}catch(e){
		return e!=null; //263:9
	};
}); //258:1
assert('typeof',true,()=>{
	let num=1234; //267:11
	return typeof num=='number'; //268:5
}); //266:1
assert('instanceof',true,()=>{
	let Spec=function(){
		let private={};
	}; //271:5
	let foo=new Spec(); //273:11
	return foo instanceof Spec; //275:5
}); //270:1
assert('break',1,()=>{
	let count=0; //278:11
	for(var i=0;i<3;i++){
		count+=i+1; //280:9
		break; //281:9
	}; //279:5
	return count; //283:5
}); //277:1
assert('default',2,()=>{
	let foo=null; //286:11
	if(foo==null){foo=2;}; //287:5
	return foo; //288:5
}); //285:1
console.log(); //290:9
console.log("Errors:"); //293:9
assert('Error','message',()=>{
	try{
		throw Error("message");
	}catch(e){
		return e.message; //298:9
	};
}); //294:1
assert('SyntaxError','message',()=>{
	try{
		throw SyntaxError("message");
	}catch(e){
		return e.message; //305:9
	};
}); //301:1
assert('ReferenceError','message',()=>{
	try{
		throw ReferenceError("message");
	}catch(e){
		return e.message; //312:9
	};
}); //308:1
assert('RangeError','message',()=>{
	try{
		throw RangeError("message");
	}catch(e){
		return e.message; //319:9
	};
}); //315:1
console.log(); //322:9
console.log("Multithreading:"); //328:9
assert("Thread",true,()=>{
}); //329:1
assert("Thread Pool",true,()=>{
}); //330:1
console.log(); //331:9
console.log("OCS:"); //358:9
assert("Environment",false,()=>{
}); //359:1
assert("Entity",false,()=>{
}); //360:1
assert("Component",false,()=>{
}); //361:1
assert("Query",false,()=>{
}); //362:1
assert("System",false,()=>{
}); //363:1
console.log(); //364:9
})();