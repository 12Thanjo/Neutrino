const {cmd, files} = require('virtuosity-server');
const util = require('util');

module.exports = function(dirname){
	var plugin = {};
	fields = [];
	var Field = function(name, question){
		fields.push({
			name: name,
			question: question ?? name
		});
	}

	new Field("name", "plugin name");
	new Field("version", `version ${cmd.color.blue}(0.1.0)${cmd.color.green}`);
	new Field("description");
	new Field("main", `main ${cmd.color.blue}(index.nt)${cmd.color.green}`);
	new Field("author");



	cmd.log("Tau plugin initialize", cmd.color.black, cmd.backgroundColor.cyan);
	cmd.log("Press ^C at any time to quit", cmd.color.yellow);
	console.log();

	var end = false;
	var i = 0;
	var field = fields[i];
	process.stdout.write(cmd.color.green + field.question + ": " + cmd.color.white);


	cmd.enableInput((data)=>{
		data = data.substring(0, data.length-2);

		if(!end){
			if(field.name == "name" && files.fileExists(__dirname + "\\..\\plugins\\" + data + "\\")){
				// name of an already existant plugin
				cmd.log(`plugin (${data}) already exists\n`, cmd.color.red);
				process.stdout.write(cmd.color.green + field.question + ": " + cmd.color.white);
			}else if(field.name == "name" && data.includes(" ")){
				// name included spaces
				cmd.log(`plugin names cannot have spaces\n`, cmd.color.red);
				process.stdout.write(cmd.color.green + field.question + ": " + cmd.color.white);
			}else{
				// input entered and move onto next field
				plugin[field.name] = data;
				i += 1;
				field = fields[i];

				if(field != null){
					process.stdout.write(cmd.color.green + field.question + ": " + cmd.color.white);			
				}else{
					end = true;

					if(plugin.main == ""){
						plugin.main = "index.nt";
					}

					if(plugin.version == ""){
						plugin.version = '0.1.0';
					}

					plugin.dependancies = [];

					console.log();
					console.log(util.inspect(plugin, false, null, true));
					console.log();
					cmd.log("Is this ok? (Y/N): ", cmd.color.yellow);
				}
			}


		}else{
			data = data.toLowerCase();

			if(data == "y" || data == ""){
				var plugin_dir = __dirname + "\\..\\plugins\\" + plugin.name + "\\";
				files.createDirectory(plugin_dir);

				var plugin_str = JSON.stringify(plugin, null, 4);
				files.writeFile(plugin_dir + "plugin.json", plugin_str);

				files.writeFile(plugin_dir + plugin.main,
`// plugin: ${plugin.name}
// description: ${plugin.description}
// author: ${plugin.author}

plugin.name = "${plugin.name}";
`);				

				cmd.log("Plugin initialized", cmd.color.cyan);
			}else{
				cmd.log("Exited", cmd.color.red);
			}

			process.exit();
		}
	});
}