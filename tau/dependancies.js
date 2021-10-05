var {cmd, files} = require('virtuosity-server');

var error = function(msg){
	cmd.log("Error: " + msg, cmd.color.red);
	process.exit();
}

module.exports = function(mode, args){
	var plugin = args[0];

	if(!files.fileExists(__dirname + "\\..\\plugins\\" + plugin)){
		error(`Plugin (${plugin}) doesn't exist`);
	}
	var plugin_config = require(__dirname + "\\..\\plugins\\" + plugin + "\\plugin.json");

	if(mode == "add"){
		var add_plugin = args[1];
		if(!files.fileExists(__dirname + "\\..\\plugins\\" + add_plugin)){
			error(`Plugin (${add_plugin}) doesn't exist`);
		}

		plugin_config.dependancies.push(add_plugin);

		files.writeFile(__dirname + "\\..\\plugins\\" + plugin + "\\plugin.json", JSON.stringify(plugin_config, null, 4));
	}else if(mode == "remove"){
		var remove_plugin = args[1];
		if(!plugin_config.dependancies.includes(remove_plugin)){
			error(`Plugin (${plugin}) doesn't have (${remove_plugin}) as a dependancy`);
		}

		var remove_index = plugin_config.dependancies.indexOf(remove_plugin);
		plugin_config.dependancies.splice(remove_index, 1);
		files.writeFile(__dirname + "\\..\\plugins\\" + plugin + "\\plugin.json", JSON.stringify(plugin_config, null, 4));
	}else if(mode == "list"){
		plugin_config.dependancies.forEach((dependant)=>{
			console.log(dependant);
		});
	}
}