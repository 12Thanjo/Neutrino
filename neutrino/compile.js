var {cmd, files} = require('virtuosity-server');
var neutrino = require('../bin/index.js');

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



module.exports = function(args, dirname){
	var file_path;
	var target = dirname;
	var name;
	var view = false;
	var output_compiled = false;
	var expand = false;


	file_path = args[0];

	var l = args.length;
	for(var i=1; i<l;i++){
		var arg = args[i];

		if(arg == "-t" || arg == "-target"){
			i += 1;
			target = args[i];
		}else if(arg == "-n" || arg == "-name"){
			i += 1;
			name = args[i];
		}else if(arg == "--view"){
			view = true;
		}else if(arg == "--output"){
			output_compiled = true;
		}else if(arg == "--silent"){
			use_log = false;
		}else if(arg == "--expand"){
			expand = true;
		}


	};

	if(name == null){
		name = files.getFileNameWithoutExtention(file_path);
	}

	if(file_path == null){
		error("File is not set");
	}else if(files.getFileExtention(file_path) == ""){
		file_path += ".nt";
	}


	var output_path = target + "\\" + name + ".js";


	log("Neutrino Compiler v0.1.0", cmd.color.cyan);
	log("------------------------", cmd.color.cyan);
	log(`file: ${`${dirname}\\${file_path}`}`, cmd.color.blue);
	log(`target: ${output_path}`, cmd.color.blue);
	log(`mode: compile`, cmd.color.cyan);
	if(expand){log(`Expanding compiled files (alpha)`, cmd.color.yellow)};
	log();

	log("Reading the file...", cmd.color.green);
	
	var read_file = files.readFile(`${dirname}/${file_path}`);
	log("Read file", cmd.color.green);
	log();

	log("Building Streams...", cmd.color.green);
	var character_stream = new neutrino.CharacterStream(read_file);
	log("Streams Built", cmd.color.green);
	log();


	log("Tokenizing...", cmd.color.green);
	var tokens = neutrino.Tokenizer(character_stream);
	log("\nTokenized", cmd.color.green);
	log();

	log("Parsing...", cmd.color.green);
	var parsed = neutrino.Parser(tokens);
	log("\nParsed", cmd.color.green);



	if(view){
		log();
		const util = require('util');
		log("~~~~~~~~~~~~~~~");
		log(util.inspect(parsed.output, false, null, true /* enable colors */));
		log("~~~~~~~~~~~~~~~");
	}
	log();

	log("Compiling...", cmd.color.green);
	var compiled = neutrino.Compiler(parsed.output, parsed.compiler_progress_count, {}, {
		silent: false
	});
	log("\nCompiled", cmd.color.green);

	if(output_compiled){
		log();
		log("Compiled Output:");
		log("----------------");
		log(compiled);
	}

	log();

	files.writeFile(output_path, compiled);
	log(`Wrote file (${name}.js)`, cmd.color.green);

}