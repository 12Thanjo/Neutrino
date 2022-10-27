var neutrino = require('./lib/index.js');
var {cmd, files} = require('virtuosity-server');


var args = process.argv.slice(3);
var dirname = process.argv[2];

if(args.length == 0){
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
			help_color = "green";
		}else{
			help_color = "yellow";
		}

		cmd.log(title + ": " + cmd.color[help_color] + description);
	}


	var help = function(){
		cmd.log("Neutrino help:", cmd.color.cyan);
		cmd.log('----------------', cmd.color.cyan);

		help_log("<no arguments>", "Starts Neutrino runtime");
		help_log("<file name>", 'run given compiled file (automatically adds ".js" if not present)');
		help_log("build", 'compiles all .nt files in directory (and sub-directories)');
		help_log("compile <file name>", 'compiles a .nt file and outputs a .js file (automatically adds ".nt" if not present)');
		help_log("help", 'shows "help" menu ( this is the help menu :) )');

		console.log();

		help_log("-o", 'sets the name of the file to output (only used with the "compile" command)');

		console.log();

		help_log('--debug', 'Compiled output in debug mode');
		help_log('--run', 'run the program after it compiled if it compiled successfully (only used with the "compile" command)');
		help_log('--legacy', 'Attempts to maintain compatibility with older versions of JS');
		help_log('--legacy_nw', 'same as --legacy, but supresses warnings');
		help_log('--module', 'compile without imports (for internal use of Tau)');
		help_log('--node', 'Compiles for node. This option is not necessary, but has some improvements (for example, more readable errors)');
		help_log('--package', 'Plugins will be written into the file instead of a separate folder');
		help_log('--preserve', 'Preserve the math (don\'t pre-simplify expressions)');
		help_log('--verbose', 'logs to the console');
		help_log('--view', 'will ouput the parsed program to the console (for the purpose of debugging the compiler)');

		console.log();

		process.exit();
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	if(args[0] == "compile"){
		var compile_target = args[1];
		if(files.getFileExtention(compile_target) != "nt"){
			compile_target += ".nt";
		}
		if(!files.fileExists(dirname + "\\" + compile_target)){
			cmd.log(`file (${compile_target}) does not exist`, cmd.color.red);
			process.exit(1);
		}

		var output_target;

		if(args.includes('-o')){
			var o_index = args.indexOf("-o");
			output_target = args[o_index+1];
		}

		require('./neutrino/build.js')(args.slice(2), dirname, compile_target, output_target);

		if(args.includes("--run")){
			console.log("run: ");
			var { spawn } = require("child_process");

			var child_process = spawn("node", [dirname + "\\" + args[1]]);
			child_process.stdout.on("data", (data)=>{
			    process.stdout.write(data + "");
			});
			child_process.stderr.on("data", (data)=>{
			    process.stdout.write(cmd.color.red + data + cmd.color.white);
			});
			child_process.on('error', (error)=>{
			    process.stdout.write(cmd.color.red + data + cmd.color.white);
			});
			child_process.on("close", (code)=>{
			    console.log(`> child process exited with code ${code}`);
			    process.exit();
			});
		}
	}else if(args[0] == "build"){
		require('./neutrino/build.js')(args.slice(1), dirname);
	}else if(args[0] == "help"){
		help();
	}else{
		var path = dirname + "\\" + args[0];
		if(files.getFileExtention(path) != ".js"){
			path += ".js";
		}

		if(files.fileExists(path)){
			var { spawn } = require("child_process");

			var child_process = spawn("node", [path]);
			child_process.stdout.on("data", (data)=>{
			    process.stdout.write(data + "");
			});
			child_process.stderr.on("data", (data)=>{
			    process.stdout.write(cmd.color.red + data + cmd.color.white);
			});
			child_process.on('error', (error)=>{
			    process.stdout.write(cmd.color.red + data + cmd.color.white);
			});
			child_process.on("close", (code)=>{
			    console.log(`> child process exited with code ${code}`);
			    process.exit();
			});
		}else{
			cmd.log("Cannot find file path: \n\t" + path, cmd.color.red);
		}
	}
}