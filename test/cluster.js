let cluster=require('cluster'); //1:7
let num_CPUs=require('os').cpus().length; //2:7
let run_master=function(){ //5:19
	console.log("Master is running (pid: "+(process.pid)+")"); //6:13
	let num_threads=(num_CPUs-1); //7:11
	let data_set=[]; //10:11
	for(var i=0;i<50000;i++){
		data_set.push(i); //12:18
	}; //11:5
	let data_set_length=data_set.length; //14:11
	let data_set_i=0; //15:11
	let done=false; //17:11
	for(var i=0;i<11;i++){
		let worker=cluster.fork(); //20:15
		worker.on('message',(data)=>{
			data_set[data.i]=data.v; //22:13
			if(data_set_i<data_set_length){
				let send={
					i:data_set_i,
					v:data_set[data_set_i]
				}; //25:23
				data_set_i+=1; //30:17
				worker.send(send); //32:24
			}else if(done==false){
				done=true; //34:17
				console.log('data_set: ',data_set); //35:25
				console.timeEnd('cluster'); //36:25
			}; //24:15
		}); //21:16
	}; //19:5
	console.time("cluster"); //41:13
	for(let id in cluster.workers){
		let worker=cluster.workers[id];
		let send={
			i:data_set_i,
			v:data_set[data_set_i]
		}; //43:15
		data_set_i+=1; //48:9
		worker.send(send); //50:16
	}; //42:5
}; //5:7
let run_worker=function(){ //57:19
	let worker=cluster.worker; //58:11
	let log=function(msg){ //60:16
		console.log('\x1b[36m'+(worker.id)+": \x1b[37m"+(msg)+"\x1b[37m"); //61:17
	}; //60:11
	log("\x1b[32m"+'initialized'); //64:5
	process.on("message",(data)=>{
		data.v*=data.v; //68:9
		process.send(data); //69:17
	}); //67:13
}; //57:7
var Cluster=function(threads){
	let private={};
	if(threads>num_CPUs){
		try{
			throw RangeError("there are only "+(num_CPUs-1)+" threads available | got "+(threads));
		}catch(e){console.error(e);}; //76:9
	}; //75:7
}; //74:1
let test=new Cluster(11); //84:7
