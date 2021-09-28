// var fs = require('fs');
var neutrino = require('./bin/index.js');
var {cmd, files} = require('virtuosity-server');


var args = process.argv.slice(3);
var dirname = process.argv[2].replaceAll("?", " ");;

if(args.length == 0){
	// process.env["VM"] = true;
	// require('./runtime');
	require('./neutrino/runtime.js');
}else{
	var error = function(msg){
		log("Error: " + msg, cmd.color.red);
		process.exit();
	}

	var use_log = true;
	var log = function(msg, color){
		if(use_log){
			cmd.log(msg, color);
		}
	}


	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var help_color = "yellow";
	var help_log = function(title, description){
		if(help_color == "yellow"){
			help_color = "blue"; // actually orange due to my cmd theme
		}else{
			help_color = "yellow";
		}

		cmd.log(title + ": " + cmd.color[help_color] + description, cmd.color.green);
	}


	var help = function(){
		cmd.log("Virtuosity help:", cmd.color.cyan);
		cmd.log('----------------', cmd.color.cyan);
		help_log("no arguments", "Starts Neutrino runtime");
		help_log("<file name>", 'run given compiled file (automatically adds ".js" if not present)');
		help_log("build", 'compiles all .nt files in directory');
		help_log("compile <file name>", 'compiles a .nt file and outputs a .js file (automatically adds ".nt" if not present)');
		help_log("help", 'shows "help" menu');
		// help_log('-t or -target', "next argument is the file where the Neutrino will write the compiles program to");
		// help_log('-n or -name', "next argument is the name of file where the Neutrino will write the compiles program to");
		// help_log('--output', 'will ouput the compiled program to the console (.js)');
		help_log('--debug', 'Compiled output in debug mode');
		help_log('--verbose', 'logs to the console');
		help_log('--view', 'will ouput the parsed program to the console (for the purpose of debugging the compiler)');


		process.exit();
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	if(args[0] == "compile"){
		var compile_target = args[1];
		if(files.getFileExtention(compile_target) != ".nt"){
			compile_target += ".nt";
		}
		if(!files.fileExists(dirname + "\\" + compile_target)){
			cmd.log(`file (${compile_target}) does not exist`, cmd.color.red);
			process.exit(1);
		}
		require('./neutrino/build.js')(args.slice(2), dirname, compile_target);

		if(args.includes("--run")){
			const { exec } = require("child_process");
			var command = exec('node ' + dirname + "\\" + args[1], (error, stdout, stderr)=>{
			    if(error){
			        cmd.log(`error: ${error.message}`, cmd.color.red);
			        return;
			    }
			    if(stderr){
		        	if(stderr.message){
		            	cmd.log(`stderr: ${stderr.message}`, cmd.color.red);
		        	}else{
		        		cmd.log(stderr, cmd.color.red);
		        	}
			    }


			    if(stdout){
			    	console.log(stdout);
			    }
			});
		}
	}else if(args[0] == "build"){
		require('./neutrino/build.js')(args.slice(1), dirname);
	}else if(args[0] == "help"){
		help();
	}else{
		const { exec } = require("child_process");
		var path = dirname + "\\" + args[0];
		if(files.getFileExtention(path) != ".js"){
			path += ".js";
		}

		if(files.fileExists(path)){
			var command = exec('node ' + path, (error, stdout, stderr)=>{
			    if(error){
			        cmd.log(`error: ${error.message}`, cmd.color.red);
			        return;
			    }
			    if(stderr){
			    	if(stderr.message){
			        	cmd.log(`stderr: ${stderr.message}`, cmd.color.red);
			    	}else{
			    		cmd.log(stderr, cmd.color.red);
			    	}
			        return;
			    }


			    if(stdout){
			    	console.log(stdout);
			    }
			});
		}else{
			cmd.log("Cannot find file path: \n\t" + path, cmd.color.red);
		}
	}
}