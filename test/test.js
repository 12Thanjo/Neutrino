$plugins=new Map();$pending_plugins=new Map();$get_plugin=function(name){if($plugins.has(name)){return $plugins.get(name);}else{var output=$pending_plugins.get(name)();$plugins.set(name,output);$pending_plugins.delete(name);return output;};};
require("./neutrino_plugins/assert.js");
require("./neutrino_plugins/cmd.js");
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
assert('power (^)',128,()=>{
	return 128; //96:36 | test.nt
}); //96:7 | test.nt
console.log(); //97:12 | test.nt
console.log("Assignment Operators:"); //100:12 | test.nt
var num=10; //101:13 | test.nt
assert('addition (+=)',14,()=>{
	num+=4; //102:36 | test.nt
	return num; //102:47 | test.nt
}); //102:7 | test.nt
assert('subtraction (-=)',12,()=>{
	num-=2; //103:39 | test.nt
	return num; //103:50 | test.nt
}); //103:7 | test.nt
assert('multiplication (*=)',24,()=>{
	num*=2; //104:42 | test.nt
	return num; //104:53 | test.nt
}); //104:7 | test.nt
assert('division (/=)',6,()=>{
	num/=4; //105:35 | test.nt
	return num; //105:46 | test.nt
}); //105:7 | test.nt
assert('modulus (%=)',2,()=>{
	num%=4; //106:34 | test.nt
	return num; //106:45 | test.nt
}); //106:7 | test.nt
assert('power (^=)',16,()=>{
	num=Math.pow(num, 4); //107:33 | test.nt
	return num; //107:44 | test.nt
}); //107:7 | test.nt
console.log(); //108:12 | test.nt
console.log("Reverse Assignment Operators:"); //111:12 | test.nt
var num=10; //112:13 | test.nt
var str="foo"; //113:13 | test.nt
assert('addition (=+)','barfoo',()=>{
	str="bar"+str; //114:42 | test.nt
	return str; //114:57 | test.nt
}); //114:7 | test.nt
assert('subtraction (=-)',-8,()=>{
	num=2-num; //115:39 | test.nt
	return num; //115:50 | test.nt
}); //115:7 | test.nt
assert('multiplication (=*)',-16,()=>{
	num=2*num; //116:43 | test.nt
	return num; //116:54 | test.nt
}); //116:7 | test.nt
assert('division (=/)',2,()=>{
	num=-32/num; //117:35 | test.nt
	return num; //117:48 | test.nt
}); //117:7 | test.nt
assert('modulus (=%)',1,()=>{
	num=5%num; //118:34 | test.nt
	return num; //118:45 | test.nt
}); //118:7 | test.nt
assert('modulus (=^)',4,()=>{
	num=Math.pow(4,num); //119:34 | test.nt
	return num; //119:45 | test.nt
}); //119:7 | test.nt
console.log(); //120:12 | test.nt
console.log("Special Assignment Operators:"); //123:12 | test.nt
var num=5; //124:13 | test.nt
assert("set greater (=>) smaller",5,()=>{
	if(3>num){num=3}; //125:46 | test.nt
	return num; //125:57 | test.nt
}); //125:7 | test.nt
assert("set greater (=>) larger",8,()=>{
	if(8>num){num=8}; //126:45 | test.nt
	return num; //126:56 | test.nt
}); //126:7 | test.nt
assert("set lesser (=<) smaller",3,()=>{
	if(3<num){num=3}; //127:45 | test.nt
	return num; //127:56 | test.nt
}); //127:7 | test.nt
assert("set lesser (=<) larger",3,()=>{
	if(8<num){num=8}; //128:44 | test.nt
	return num; //128:55 | test.nt
}); //128:7 | test.nt
console.log(); //129:12 | test.nt
console.log("Conditionals:"); //132:12 | test.nt
assert('if',true,()=>{
	if(true){
		return true; //135:15 | test.nt
	}; //134:7 | test.nt
}); //133:7 | test.nt
assert('else',true,()=>{
	if(false){
		return false; //140:15 | test.nt
	}else{
		return true; //142:15 | test.nt
	}; //139:7 | test.nt
}); //138:7 | test.nt
assert('else if',true,()=>{
	if(false){
		return false; //147:15 | test.nt
	}else if(true){
		return true; //149:15 | test.nt
	}else{
		return false; //151:15 | test.nt
	}; //146:7 | test.nt
}); //145:7 | test.nt
assert('equals (==)',true,()=>{
	return 1; //154:39 | test.nt
}); //154:7 | test.nt
assert('not equals (!=)',true,()=>{
	return 1; //155:43 | test.nt
}); //155:7 | test.nt
assert('greater than (>)',true,()=>{
	return 1; //156:44 | test.nt
}); //156:7 | test.nt
assert('less than (<)',true,()=>{
	return 1; //157:41 | test.nt
}); //157:7 | test.nt
assert('greater than or equal to (<=)',true,()=>{
	return 1; //158:57 | test.nt
}); //158:7 | test.nt
assert('less than or equal to (>=)',true,()=>{
	return 1; //159:54 | test.nt
}); //159:7 | test.nt
assert('and (&&)',false,()=>{
	return 0&&"foo"=="foo"; //160:37 | test.nt
}); //160:7 | test.nt
assert('or (||)',true,()=>{
	return 0||"foo"=="foo"; //161:35 | test.nt
}); //161:7 | test.nt
console.log(); //162:12 | test.nt
console.log("Loops:"); //165:12 | test.nt
assert("while",1,()=>{
	let count=0; //167:16 | test.nt
	while(true){
		count+=1; //169:14 | test.nt
		break; //170:14 | test.nt
	}; //168:10 | test.nt
	return count; //172:11 | test.nt
}); //166:7 | test.nt
assert("for",6,()=>{
	let forArr=[1,2,3]; //175:17 | test.nt
	let count=0; //176:16 | test.nt
	var $arr_length=forArr.length;
	for(var i=0;i<$arr_length;i++){
		count+=forArr[i]; //178:14 | test.nt
	}; //177:8 | test.nt
	return count; //180:11 | test.nt
}); //174:7 | test.nt
assert("forNum",true,()=>{
	let count=0; //183:16 | test.nt
	for(var i=0;i<4;i++){
		count+=i; //186:14 | test.nt
	}; //184:11 | test.nt
	let count2=0; //189:17 | test.nt
	for(var i=2;i<5;i++){
		count2+=i; //192:15 | test.nt
	}; //190:11 | test.nt
	return count==6&&count2==9; //195:11 | test.nt
}); //182:7 | test.nt
assert("iterate",true,()=>{
	let forArr=[1,2,3]; //198:17 | test.nt
	let key_count=0; //199:20 | test.nt
	let value_count=0; //200:22 | test.nt
	for(var[key,value]of forArr.entries()){
		key_count+=key; //202:18 | test.nt
		value_count+=value; //203:20 | test.nt
	}; //201:12 | test.nt
	return key_count==3&&value_count==6; //205:11 | test.nt
}); //197:7 | test.nt
assert("forKeys",true,()=>{
	let forKeysObj={
		foo:"bar",
		hello:"world"
	}; //208:21 | test.nt
	let key_arr=[]; //212:18 | test.nt
	let value_arr=[]; //213:20 | test.nt
	for(let key in forKeysObj){
		let value=forKeysObj[key];
		key_arr.push(key); //215:21 | test.nt
		value_arr.push(value); //216:23 | test.nt
	}; //214:12 | test.nt
	return key_arr[0]=='foo'&&key_arr[1]=='hello'&&value_arr[0]=='bar'&&value_arr[1]=='world'; //218:11 | test.nt
}); //207:7 | test.nt
console.log(); //223:12 | test.nt
console.log("Classes:"); //226:12 | test.nt
assert('struct',true,()=>{
	let GenericStruct=function(param){
		let $this=this;let private={};this.$op={};
		$this.name=param; //229:13 | test.nt
		private.priv_prop="hi"; //230:16 | test.nt
	}; //228:11 | test.nt
	let gen=new GenericStruct("name"); //233:14 | test.nt
	return gen.name=="name"&&gen.priv_prop==null; //234:11 | test.nt
}); //227:7 | test.nt
assert('class',true,()=>{
	let GenericClass=function(param){
		let $this=this;let private={};this.$op={};GenericClass.$map.set(GenericClass.$i,this);let id=GenericClass.$i;GenericClass.$i+=1;
		private.id=id; //242:18 | test.nt
		Object.defineProperty(this, "id", {get: ()=>{return private.id;}}); //242:15 | test.nt
		$this.param=param; //244:13 | test.nt
		private.priv_prop="hi"; //245:16 | test.nt
	}; //239:10 | test.nt
	GenericClass.$i=0;GenericClass.resetI=function(){GenericClass.$i=0;};GenericClass.$map=new Map();GenericClass.get=function(id){return GenericClass.$map.get(id);};GenericClass.has=function(id){return GenericClass.$map.has(id);};GenericClass.forEach=function(cb){GenericClass.$map.forEach(cb);};GenericClass.delete=function(cb){GenericClass.$map.delete(cb);}; //239:10 | test.nt
	new GenericClass("foo"); //248:10 | test.nt
	new GenericClass("bar"); //249:10 | test.nt
	return GenericClass.has(0)&&GenericClass.get(0).param=="foo"&&GenericClass.get(1).param=="bar"; //251:11 | test.nt
}); //236:7 | test.nt
assert('species',true,()=>{
	let GenericSpecies=function(id,param){
		let $this=this;let private={};this.$op={};GenericSpecies.$map.set(id,this);
		$this.name=id; //258:13 | test.nt
		$this.param=param; //259:13 | test.nt
		private.priv_prop="hi"; //260:16 | test.nt
		private.getter_prop=0; //261:27 | test.nt
		Object.defineProperty(this, "getter_prop", {get: ()=>{return private.getter_prop;}}); //261:15 | test.nt
		private.getter_prop+=1; //262:16 | test.nt
	}; //257:12 | test.nt
	GenericSpecies.$map=new Map();GenericSpecies.get=function(id){return GenericSpecies.$map.get(id);};GenericSpecies.has=function(id){return GenericSpecies.$map.has(id);};GenericSpecies.forEach=function(cb){GenericSpecies.$map.forEach(cb);};GenericSpecies.delete=function(cb){GenericSpecies.$map.delete(cb);}; //257:12 | test.nt
	let gen=new GenericSpecies('id','foo'); //265:14 | test.nt
	gen.getter_prop=2; //267:8 | test.nt
	let getter_count=0; //269:23 | test.nt
	GenericSpecies.forEach((target)=>{
		getter_count+=target.getter_prop; //271:21 | test.nt
	}); //270:27 | test.nt
	return GenericSpecies.has('id')&&GenericSpecies.get('id')==gen&&gen.param=='foo'&&gen.priv_prop==null&&gen.getter_prop==1&&getter_count==1; //273:11 | test.nt
}); //253:7 | test.nt
assert("Operator Overloading ($)",true,()=>{
	let Scalar=function(value){
		let $this=this;let private={};this.$op={};
		$this.value=value; //277:13 | test.nt
	}; //276:11 | test.nt
	let Vector2=function(x,y){
		let $this=this;let private={};this.$op={};
		$this.x=x; //280:13 | test.nt
		$this.y=y; //281:13 | test.nt
		this.$op["+= <Scalar>"]=function(scalar){
			$this.x+=scalar.value; //285:17 | test.nt
			$this.y+=scalar.value; //286:17 | test.nt
		}; //284:18 | test.nt
		this.$op["+ <Vector2>"]=function(vector){
			let new_x=$this.x+vector.x; //290:24 | test.nt
			let new_y=$this.y+vector.y; //291:24 | test.nt
			return new Vector2(new_x,new_y); //292:19 | test.nt
		}; //289:18 | test.nt
	}; //279:11 | test.nt
	let s1=new Scalar(1); //297:13 | test.nt
	let v1=new Vector2(2,3); //298:13 | test.nt
	let v2=new Vector2(4,5); //299:13 | test.nt
	v1.$op["+= <"+s1.constructor.name+">"](s1); //303:8 | test.nt
	v1.$op["+= <"+s1.constructor.name+">"](s1); //304:8 | test.nt
	let v3=v1.$op["+ <"+v2.constructor.name+">"](v2); //305:13 | test.nt
	return v3.x==8&&v3.y==10; //307:11 | test.nt
}); //275:7 | test.nt
console.log(); //309:12 | test.nt
console.log("Keywords:"); //312:12 | test.nt
assert('return',true,()=>{
	return true; //314:11 | test.nt
}); //313:7 | test.nt
assert('try',true,()=>{
	try{
		return true; //318:15 | test.nt
	}catch{}; //317:8 | test.nt
}); //316:7 | test.nt
assert('catch',true,()=>{
	try{
		foo=doesnt_exist; //323:12 | test.nt
		return false; //324:15 | test.nt
	}catch{
		return true; //326:15 | test.nt
	};
}); //321:7 | test.nt
assert('catch (e)',true,()=>{
	try{
		foo=doesnt_exist; //331:12 | test.nt
		return false; //332:15 | test.nt
	}catch(e){
		return e!=null; //334:15 | test.nt
	};
}); //329:7 | test.nt
assert('typeof',true,()=>{
	let num=1234; //338:14 | test.nt
	return typeof num==='number'; //339:11 | test.nt
}); //337:7 | test.nt
assert('instanceof',true,()=>{
	let Spec=function(){
		let $this=this;let private={};this.$op={};
	}; //342:11 | test.nt
	let foo=new Spec(); //344:14 | test.nt
	return foo instanceof Spec; //346:11 | test.nt
}); //341:7 | test.nt
assert('instanceof',true,()=>{
	let Spec=function(){
		let $this=this;let private={};this.$op={};
	}; //349:11 | test.nt
	let foo=new Spec(); //351:14 | test.nt
	return foo.constructor.name ==="Spec"; //353:11 | test.nt
}); //348:7 | test.nt
assert('swap',true,()=>{
	let a="foo"; //356:12 | test.nt
	let b="bar"; //357:12 | test.nt
	var $save=a;a=b;b=$save; //359:6 | test.nt
	return a=="bar"&&b=="foo"; //361:11 | test.nt
}); //355:7 | test.nt
assert('toggle',true,()=>{
	let foo=false; //364:14 | test.nt
	if(foo===false){foo=true;}else{foo=false;}; //365:8 | test.nt
	return foo; //366:11 | test.nt
}); //363:7 | test.nt
assert('break',1,()=>{
	let count=0; //369:16 | test.nt
	for(var i=0;i<3;i++){
		count+=i+1; //371:14 | test.nt
		break; //372:14 | test.nt
	}; //370:11 | test.nt
	return count; //374:11 | test.nt
}); //368:7 | test.nt
assert('default',2,()=>{
	let foo=null; //377:14 | test.nt
	if(foo==null){foo=2;}; //378:8 | test.nt
	return foo; //379:11 | test.nt
}); //376:7 | test.nt
assert('delete',null,()=>{
	let foo={
		bar:"asdf"
	}; //382:14 | test.nt
	delete foo.bar; //385:11 | test.nt
	return foo.bar; //386:11 | test.nt
}); //381:7 | test.nt
assert('is',true,()=>{
	let foo="foo"; //389:14 | test.nt
	let search=['asdf','foo']; //390:17 | test.nt
	return (['asdf','foo'].includes('foo'))&&(search.includes('foo')); //391:11 | test.nt
}); //388:7 | test.nt
assert('scope',true,()=>{
	let foo=true; //394:14 | test.nt
	let bar=false; //395:14 | test.nt
	{
		let foo=false; //397:18 | test.nt
		bar=true; //398:12 | test.nt
	}; //396:10 | test.nt
	return foo&&bar; //400:11 | test.nt
}); //393:7 | test.nt
console.log(); //402:12 | test.nt
console.log("Errors:"); //405:12 | test.nt
assert('Error','message',()=>{
	try{
		throw Error("message");
	}catch(e){
		return e.message; //410:15 | test.nt
	};
}); //406:7 | test.nt
assert('SyntaxError','message',()=>{
	try{
		throw SyntaxError("message");
	}catch(e){
		return e.message; //417:15 | test.nt
	};
}); //413:7 | test.nt
assert('ReferenceError','message',()=>{
	try{
		throw ReferenceError("message");
	}catch(e){
		return e.message; //424:15 | test.nt
	};
}); //420:7 | test.nt
assert('RangeError','message',()=>{
	try{
		throw RangeError("message");
	}catch(e){
		return e.message; //431:15 | test.nt
	};
}); //427:7 | test.nt
console.log(); //434:12 | test.nt
