	const {cmd} = require('virtuosity-server');
var neutrino = require("../bin/index.js");

var vm = require('vm');
var context = {
	console: {
		...console,
		log: function(msg){
			cmd.log(msg, cmd.color.magenta);
		}
	}
};
vm.createContext(context);

cmd.log(`Welcome to Neutrino runtime`, cmd.color.cyan);
cmd.log(`  "#" to use NodeJS command line`, cmd.color.green);
process.stdout.write("> ");
cmd.enableInput((data)=>{
	if(data[0] == "#"){
		console.log(cmd.color.green + "#" + cmd.color.white, vm.runInContext(data.slice(1), context));
	}else{
		try{
			if(data.slice(0, 6) != "local " && data.slice(0, 9) != "regional " && data.slice(0, 7) != "global "){
				if(data.slice(0, 7) != "return "){
					data = "return " + data;
				};
				data = "regional __INTERNAL_EVAL__=@()->{" + data + "};console.log(__INTERNAL_EVAL__());";
			}else{
				if(data[data.length-3] != ";"){
					data += ";"
				};
			}
			var character_stream = new neutrino.CharacterStream(data, {
				exit: false
			});
			var tokens = neutrino.Tokenizer(character_stream);
			var parsed = neutrino.Parser(tokens, null, {
				exit: false
			});
			var compiled = neutrino.Compiler(parsed.output, parsed.const_dict, {
				exit: false,
				debug: false
			});
			vm.runInContext(compiled, context);
		}catch(e){
			cmd.log(e.message, cmd.color.red);
		}
	}
	process.stdout.write("\n> ");
});