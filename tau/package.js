var {cmd, files} = require('virtuosity-server');

var error = function(msg){
	cmd.log("Error: " + msg, cmd.color.red);
	process.exit();
}


module.exports = function(args){
	var target = args[0];
	var plugin_path = __dirname + "\\..\\plugins\\" + target;
	if(!files.fileExists(plugin_path)){
		error(`Module (${target}) does not exist`);
	}

	var plugin_config = require(plugin_path + "\\plugin.json");


	var code = files.readFile(plugin_path + "\\" + plugin_config.main);


	if(args.includes('--debug') == false){
		// minify code
		code_lines = code.split("\n");
		code = "";
		code_lines.forEach((line)=>{
			if(line.includes("//")){
				line = line.slice(0, line.indexOf('//'));
			}

			line = line.replaceAll("\t", "");

			code += line;
		});
	}


	// files.renameFile(plugin_path + "\\compiled.js", plugin_path + "\\compiled.ntp");
	// var code = files.readFile(plugin_path + "\\compiled.ntp");
	code = `module.exports=function($pending_plugins,$get_plugin){$pending_plugins.set('${target}',()=>{let plugin={metadata:${JSON.stringify(plugin_config)}};${code};return plugin;});};`;
	files.writeFile(plugin_path + "\\compiled.ntp", code);
}