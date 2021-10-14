var neutrino = require('../bin/index.js');
var {cmd, files} = require('virtuosity-server');






module.exports = function(args, dirname, compile_target, output_target){
	var debug = args.includes("--debug");
	var verbose = args.includes('--verbose');
	var log = function(msg, color){
		if(verbose){
			cmd.log(msg, color);
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////////

	log(`Neutrino build project`, cmd.color.cyan);
	log(`----------------------`, cmd.color.cyan);

	var nt_files = [];
	var num_of_files = 0;
	var build_files_recursive = function(dir, path, relative){
		dir.forEach((item)=>{
			if(item.type == "folder"){
				if(item.dir != null){
					build_files_recursive(item.dir, path + "/" + item.name, relative + item.name + "/");
				}
			}else{
				if(item.type == ".nt"){
					item.path = path;
					item.input_file = relative + item.name + ".nt";
					item.relative = relative;
					nt_files.push(item);
				}else if(item.type == ".ntm"){
					item.path = path;
					item.relative = relative + item.name + ".ntm";
					nt_files.push(item);
				}
			}
		});
	}


	var dir = files.getFiles(dirname, Infinity);
	build_files_recursive(dir, dirname, '');

	var ntm_tokens = new Map();
	var nt_tokens = new Set();
	nt_files.forEach((file)=>{
		if(file.type != ".nt" || (compile_target == null || compile_target == file.name + ".nt")){
			var read_file = files.readFile(file.path + "/" + file.name + file.type);
			var character_stream = new neutrino.CharacterStream(read_file);
			var tokens = neutrino.Tokenizer(character_stream, {});


			if(file.type == ".ntm"){
				tokens.splice(tokens.length-1);
				tokens.forEach((token)=>{
					if(token.type != 'END'){
						token.position.file = file.relative;
					}
				});

				var path = files.getFilePath(file.relative).replaceAll("\\", "/");
				ntm_tokens.set(path + file.name, tokens);
				log(`Tokenized: ${cmd.color.yellow + path + cmd.color.blue + file.name}.ntm`, cmd.color.green);
			}else{
				var name = file.name;
				if(output_target){
					name = output_target;
				}

				tokens.forEach((token)=>{
					if(token.type != 'END'){
						token.position.file = file.input_file;
					}
				});

				nt_tokens.add({
					tokens: tokens,
					relative: file.relative,
					name: name,
					path: file.path
				});
			}
		}
	});



	nt_tokens.forEach((file)=>{
		var parsed = neutrino.Parser(file.tokens, ntm_tokens, {});

		if(args.includes('--view')){
			console.log("~~~~~~~~~~~~~~~");
			console.log(require('util').inspect(parsed, false, null, true));
			console.log("~~~~~~~~~~~~~~~");
		}

		var compiled = neutrino.Compiler(parsed.output, parsed.const_dict, {
			debug: debug,
			plugin: args.includes('--plugin'),
		});
		files.writeFile(file.path + "/" + file.name + ".js", compiled);
		log(`> Compiled: ${cmd.color.yellow + file.relative.replaceAll("\\", "/") + cmd.color.blue + file.name}.nt`, cmd.color.green);
	});
}