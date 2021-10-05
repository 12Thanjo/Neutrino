let $plugins=new Map();let $pending_plugins=new Map();let $set_plugin=function(name,func){let $plugin={plugin:{}};func($plugin.plugin);$plugins.set(name,$plugin.plugin);};
let $get_plugin = function(name){
	if($plugins.has(name)){
		return $plugins.get(name);
	}else{
		let $plugin={
			plugin:{}
		};
		$pending_plugins.get(name)($plugin.plugin);
		$plugins.set(name,$plugin.plugin);
		$pending_plugins.delete(name);
		return $plugin.plugin;
	};
};


$pending_plugins.set('test', (plugin)=>{
	var dept = $get_plugin('dept');
	console.log(dept);
});

$pending_plugins.set('dept', (plugin)=>{
	plugin.name = "dept";
});


for(var[$key,$value]of $pending_plugins.entries()){
	$get_plugin($key);
};



(()=>{
	var test = $plugins.get("test");
})();