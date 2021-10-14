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



	var { exec } = require("child_process");

	var flags = "";
	args = args.slice(1);
	args.forEach((arg)=>{
		flags += " " + arg;
		// if(arg == "--verbose"){
		// 	error("Cannot use the (--verbose) flag");
		// }
	});


	var command = exec(`cd "${plugin_path}" && neutrino compile ${plugin_config.main} --plugin -o compiled${flags}`, (error, stdout, stderr)=>{
	    // if(error){
	    //     cmd.log(`error: ${error.message}`, cmd.color.red);
	    //     return;
	    // }
	    // if(stderr){
	    //     cmd.log(`stderr: ${stderr.message}`, cmd.color.red);
	    //     return;
	    // }


	    if(stdout){
	    	console.log(stdout.substring(0, stdout.length-1));
	    }

	    if(files.fileExists(plugin_path + "\\compiled.js")){
	    	files.renameFile(plugin_path + "\\compiled.js", plugin_path + "\\compiled.ntp");
	    	var code = files.readFile(plugin_path + "\\compiled.ntp");
	    	code = `$pending_plugins.set('${target}',()=>{let plugin={};${code}plugin.metadata=${JSON.stringify(plugin_config)};return plugin;});`;
	    	files.writeFile(plugin_path + "\\compiled.ntp", code);
	    }
	});
}