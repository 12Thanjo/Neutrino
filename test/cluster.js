let $plugins=new Map();let $set_plugin=function(name,func){let $plugin={plugin:{}};func($plugin.plugin);$plugins.set(name,$plugin.plugin);};
$set_plugin('test_plugin',(plugin)=>{plugin.name="test plugin";}); //1:1
(()=>{
let test_plugin=$plugins.get('test_plugin'); //1:1
let cluster=require('cluster'); //4:7
let num_CPUs=require('os').cpus().length; //5:7
worker_event=function(data,worker){ //15:15
	let $arr_length=data.d.length;
	for(var i=0;i<$arr_length;i++){
		data.d[i]*=data.d[i]; //17:9
	}; //16:5
	return data; //20:5
}; //15:1
let Cluster=function(threads,send){
	let private={};
	if(threads>num_CPUs-1){
		throw RangeError("there are only "+(num_CPUs-1)+" threads available | got "+(threads));
	}; //29:7
	console.log("Master is running (pid: "+(process.pid)+")"); //33:13
	for(var i=0;i<threads;i++){
		cluster.fork(); //36:17
	}; //35:5
	this.run=function(data_set,callback){ //39:15
		let data_set_length=data_set.length; //40:15
		let data_set_i=0; //41:15
		let itter_size=Math.floor(data_set_length/threads); //43:15
		let arr_count=0; //44:15
		let threads_left=threads; //46:15
		let recieved={}; //47:15
		for(let i in cluster.workers){
			let worker=cluster.workers[i];
			send(worker,{
				i:i,
				d:data_set.splice(0,itter_size)
			}); //51:13
			if(i==threads-2){
				itter_size=data_set.length+1; //57:17
			}; //56:15
			worker.on('message',(data)=>{
				recieved[data.i]=data.d; //61:17
				threads_left-=1; //62:17
				if(threads_left==0){
					for(let key in recieved){
						let value=recieved[key];
						try{
							data_set.push(...value); //66:38
						}catch{
							data_set=[...data_set,...value]; //68:29
						};
					}; //64:21
					callback(); //71:21
				}; //63:19
			}); //60:20
		}; //50:9
	}; //39:5
}; //28:1
if(cluster.isWorker){
	let worker=cluster.worker; //81:11
	process.on("message",(data)=>{
		process.send(worker_event(data,worker)); //83:17
	}); //82:13
}else{
	let data_set=[]; //87:11
	for(var i=0;i<5000000;i++){
		data_set.push(i); //89:18
	}; //88:5
	let test=new Cluster(11,(worker,data)=>{
worker.send(data); //92:16
}); //91:11
	console.time("cluster"); //95:13
	test.run(data_set,()=>{
		test.run(data_set,()=>{
			test.run(data_set,()=>{
				test.run(data_set,()=>{
					console.timeEnd('cluster'); //101:29
					process.exit(); //102:29
				}); //100:22
			}); //99:18
		}); //98:14
	}); //97:10
}; //80:3
})();