var neutrino = require('./lib/index.js');
var {cmd, files} = require('virtuosity-server');


var args = process.argv.slice(3);
var dirname = process.argv[2].replaceAll("?", " ");

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var help_color = "yellow";
var help_log = function(title, description){
	if(help_color == "yellow"){
		help_color = "green"; // actually orange due to my cmd theme
	}else{
		help_color = "yellow";
	}

	cmd.log(title + ": " + cmd.color[help_color] + description);
}


var help = function(){
	cmd.log("Tau (Neutrino's plugin manager) help:", cmd.color.cyan);
	cmd.log('----------------', cmd.color.cyan);
	help_log("add <plugin> <dependancy>", "add a dependancy to a plugin");
	help_log('build <plugin> [...args]', "build a tau project");
	help_log("help", 'shows "help" menu ( this is the help menu :) )');
	help_log("init", "initialize a new plugin");
	help_log("list <plugin>", "list all dependancies of a plugin");
	help_log("metadata <plugin>", "get all of the metadata of a plugin");
	help_log('package <plugin> [...args]', "build a tau project from a .js file instead of a .nt file");
	help_log("remove <plugin> <dependancy>", "remove a dependancy from a plugin");
	help_log("version <plugin>", "get the version of a plugin");

	console.log();

	process.exit();
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if(args[0] == 'init'){
	require('./tau/init.js')();
}else if(args[0] == 'build'){
	require('./tau/build.js')(args.slice(1));
}else if(args[0] == 'package'){
	require('./tau/package.js')(args.slice(1));
}else if(args[0] == 'help'){
	help();
}else if(['add', 'remove', 'list', 'version', 'metadata'].includes(args[0])){
	require('./tau/dependancies.js')(args[0], args.slice(1));
}else{
	console.log("Unknown command");
}