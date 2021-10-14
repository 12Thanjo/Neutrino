var {structures, cmd, files} = require('virtuosity-server');
var fix_floating_point = function(val){
	return Math.round(val*10000)/10000;
}




var Compiler = function(input, const_dict, config){
	var const_dict_enabled = const_dict != null;

	config = config ?? {};
	config.slient = config.silent ?? false;
	config.debug = config.debug ?? true;
	config.exit = config.exit ?? true;
	config.plugin = config.plugin ?? false;

	var plugins = {};
	var dir = files.getFiles(__dirname + "/../plugins", 1).forEach((folder)=>{
		if(folder.type == "folder"){
			// if config.plugin is false, then the plugin usage is set to false
			// if config.plugin is true, then the plugin usage is already set to true to prevent its addition
			plugins[folder.name] = config.plugin;
		}else{
			cmd.log(`compiler >\n\tThe Neutrino plugins folder is messed up\n\tEncountered a file that shouldn't be there` + "\x1b[37m", cmd.color.red);
		}
	});



	var error = function(message){
		cmd.log("compiler >\n\t" + message, cmd.color.red);
		if(config.exit){
			process.exit(1);
		}
	}

	var n = '';
	if(config.debug){
		n = "\n";
	}
	var t = function(){
		if(config.debug){
			var output = "";
			for(var i=0; i<tab_depth;i++){
				output += "\t";
			}
			return output;
		}else{
			return "";
		}
	}
	var comment = function(position){
		if(config.debug){
			var output = ` //${position.line}:${position.collumn}`;
			if(position.file != null){
				output += ' | ' + position.file;
			}
			return output + n;
		}else{
			return "";
		}
	}


	var simplify = function(left, operator, right){
		if(left.type == 'binary'){
			left = traverse(left);
			if(isNaN(left)){
				left = {
					type: "ID",
					value: left
				}
			}
		}

		if(right.type == 'binary'){
			right = traverse(right);
			if(isNaN(right)){
				right = {
					type: "ID",
					value: right
				}
			}
		}

		if(left.type == 'DIGIT' && right.type == "DIGIT" && ["+", "-", "*", "/", "%"].includes(operator)){
			var output = eval(evaluate(left) + " " + operator + " " + no_tab_evaluate(right));
			return fix_floating_point(output);
		}else{	
			return no_tab_evaluate(left) + operator + no_tab_evaluate(right);
		}
	}


	var simplify_expression = function(expr_init){
		var first_pass = function(expr){
			if(expr.type == "binary"){
				var left = first_pass(expr.left);
				var right = first_pass(expr.right);

				if(left.type == "DIGIT" && right.type == "DIGIT"){
					first = false;
					var value = eval(left.value + expr.operator + right.value) + "";
					return {
						type: "DIGIT",
						value: value
					}
				}else{
					return {
						type: "binary",
						operator: expr.operator,
						left: left,
						right: right
					}
				}
			}else{
				return expr;
			}
		}

		var second_pass = function(expr){
			if(expr.type == "binary"){
				var left;
				var right;
				if(expr.left.type == "binary" || expr.right.type == "binary"){
					left = second_pass(expr.left);
					right = second_pass(expr.right);
				}else{
					if(expr.right.type == "id" && expr.left.type == "DIGIT"){
						left = second_pass(expr.right);
						right = second_pass(expr.left);
					}else{
						left = second_pass(expr.left);
						right = second_pass(expr.right);
					}
				}

				expr.left = left;
				expr.right = right;
			}

			return expr;
		}

		var third_pass = function(expr){
			if(expr.type == "binary"){
				if(['+', "-"].includes(expr.operator)){
					if(expr.left.type == "binary" && ["+", "-"].includes(expr.left.operator) && expr.left.right.type == "DIGIT" && expr.right.type == "DIGIT"){
						var left = expr.left.left;
						var right = eval(expr.left.right.value + expr.left.operator + expr.right.value);
						expr.left = left;
						expr.right = {
							type: "DIGIT",
							value: right + ""
						};
					}
				}else if(expr.operator == "*"){
					if(expr.left.type == "binary" && expr.left.operator == "*" && expr.left.right.type == "DIGIT" && expr.right.type == "DIGIT"){
						var left = expr.left.left;
						var right = eval(expr.left.right.value + "*" + expr.right.value);
						expr.left = left;
						expr.right = {
							type: "DIGIT",
							value: right + ""
						};
					}
				}else if(expr.operator == "/"){
					if(expr.left.type == "binary" && expr.left.operator == "/" && expr.left.right.type == "DIGIT" && expr.right.type == "DIGIT"){
						var left = expr.left.left;
						var right = eval(expr.left.right.value + "/" + expr.right.value);
						expr.left = left;
						expr.right = {
							type: "DIGIT",
							value: right + ""
						};
					}
				}

			}

			return expr;
		}


		// the first pass simplifies a much as possible in the current structure
		var first_pass_output = first_pass(expr_init);

		// the second pass makes the variable left and the digit right (if applicable)
		var second_pass_output = second_pass(first_pass_output);

		// the third pass makes simplifies further
		var third_pass_output = third_pass(second_pass_output);	

		return third_pass_output;
	}
	
	var traverse = function(expr){
		if(expr.type == "binary"){
			var simplified = simplify_expression(expr);
			var simplified_string;

			try{
				while(simplify(simplified.left, simplified.operator, simplified.right) != simplified_string){
					simplified_string = simplify(simplified.left, simplified.operator, simplified.right);
					simplified = simplify_expression(simplified);
				}
			}catch{}
			

			if(simplified.type == "binary"){
				return simplified_string;
			}else{
				return evaluate(simplified);
			}
		}else{
			return no_tab_evaluate(expr);
		}
	}


	evaluators = new Map();

	evaluators.set("END", ()=>{return ""});
	evaluators.set("STRING1", (expr)=>{return "'" + expr.value + "'";});
	evaluators.set("STRING2", (expr)=>{return '"' + expr.value + '"';});
	evaluators.set("DIGIT", (expr)=>{return expr.value;});
	evaluators.set("KEYWORD", (expr)=>{return expr.value;});
	evaluators.set("ID", (expr)=>{return expr.value;});

	evaluators.set('concat_string', (expr)=>{
		var output = "";

		var length = expr.elems.length;
		for(var i=0; i<length;i++){
			var evaluated = evaluate(expr.elems[i]);
			if(expr.elems[i].type == "STRING1" || expr.elems[i].type == "STRING2"){
				output += evaluated;
			}else if(evaluated[0] == "(" && evaluated[evaluated.length-1] == ")"){
				output += evaluated;
			}else{
				output += "(" + evaluated + ")";
			}
			if(i < length-1){
				output += "+";
			}
		}

		return output;
	});




	evaluators.set("assign", (expr)=>{
		const_dict_enabled = false;
		var output = evaluate(expr.left);
		const_dict_enabled = true;
		add_semi();
		output += expr.operator + no_tab_evaluate(expr.right) + ";" + comment(expr.left.position);
		remove_semi();
		return output;
	});

	evaluators.set("reverse assign", (expr)=>{
		var left = no_tab_evaluate(expr.left);
		return t() + left + "=" + no_tab_evaluate(expr.right) + expr.operator + left + ";" + comment(expr.left.position);
	});

	evaluators.set("special assign", (expr)=>{
		var output = t();

		var left = no_tab_evaluate(expr.left);
		var right = no_tab_evaluate(expr.right);

		output += "if(" + right + expr.operator[1] + left + "){"+left+"="+right+"};" + comment(expr.left.position);

		return output;
	});

	evaluators.set("default", (expr)=>{
		var left = no_tab_evaluate(expr.left);
		return t() + `if(${left}==null){${left}=${no_tab_evaluate(expr.right)};};` + comment(expr.left.position);
	});


	evaluators.set('instanceof', (expr)=>{
		return evaluate(expr.left) + " instanceof " + no_tab_evaluate(expr.right);
	});

	evaluators.set('typeof', (expr)=>{
		return "typeof " + evaluate(expr.left) + "==" + no_tab_evaluate(expr.right);
	});

	evaluators.set('includes', (expr)=>{
		return evaluate(expr.left) + ".includes(" + no_tab_evaluate(expr.right) + ")";
	});



	evaluators.set("id", (expr)=>{
		if(!const_dict.has(expr.value)){

			var output = t() + expr.value;

			var call = false;

			if(expr.attachment != null){
				if(expr.attachment.type == "index"){
					add_semi();
					output += "[" +  no_tab_evaluate(expr.attachment.value) + "]";
					remove_semi();
				}else if(expr.attachment.type == "call"){
					call = true;
					add_semi();
					output += parse_call(expr.attachment.value);
					remove_semi();
				}
			}

			if(expr.accessor != null){
				call = false;
				output += "." + eat_tab_evaluate(expr.accessor);
			}

			if(call && use_semi()){
				output += ";" + comment(expr.position);
			}

			return output;
		}else{
			if(const_dict_enabled){
				return evaluate(const_dict.get(expr.value));
			}else{
				// cmd.log(`compiler >\n\tCONST variable is left-hand side in assignment` + "\x1b[37m", cmd.color.red);
				// cmd.log("\t<" + cmd.color.magenta + expr.position.line + ":" + expr.position.collumn + cmd.color.red + "> ", cmd.color.red);
				// if(config.exit){
				// 	process.exit();
				// }
				error("CONST variable is left-hand side in assignment" + "\t<" + cmd.color.magenta + expr.position.line + ":" + expr.position.collumn + cmd.color.red + "> ");
			}
		}
	});


	evaluators.set("spread", (expr)=>{
		return "..." + no_tab_evaluate(expr.id);
	});



	evaluators.set('binary', (expr)=>{
		return traverse(expr);
	});

	evaluators.set('var', (expr)=>{
		if(expr.scope == "local"){
			var output = t();

			output += `let ${no_tab_evaluate(expr.left)}`;
			var right = traverse(expr.right);
			if(expr.right.type != "function"){
				var semi_index = right.lastIndexOf(';');
				if(right[semi_index + 2] == "/" && right[semi_index+3] == "/"){
					if(right.slice(semi_index).includes("}") == false){
						right = right.slice(0, semi_index);
					}
				}
			}
			output += `=${right};`+ comment(expr.left.position);

			return output;
		}else if(expr.scope == "regional"){
			var output = t();
			output += `var ${no_tab_evaluate(expr.left)}`;
			var right = traverse(expr.right);
			if(expr.right.type != "function"){
				var semi_index = right.lastIndexOf(';');
				if(right[semi_index + 2] == "/" && right[semi_index+3] == "/"){
					if(right.slice(semi_index).includes("}") == false){
						right = right.slice(0, semi_index);
					}
				}
			}
			output += `=${right};`+ comment(expr.left.position);

			return output;
		}else if(expr.scope == "global"){
			var output = t();

			output += `globalThis.${no_tab_evaluate(expr.left)}`;
			var right = traverse(expr.right);
			if(expr.right.type != "function"){
				var semi_index = right.lastIndexOf(';');
				if(right[semi_index + 2] == "/" && right[semi_index+3] == "/"){
					if(right.slice(semi_index).includes("}") == false){
						right = right.slice(0, semi_index);
					}
				}
			}
			output += `=${right};`+ comment(expr.left.position);

			return output;
		}
	});


	evaluators.set('array', (expr)=>{
		var output = "[";

		var arr_length = expr.array.length;
		if(arr_length > 0){	
			add_semi();
			for(var i=0; i<arr_length-1;i++){
				output += no_tab_evaluate(expr.array[i]) + ",";
			}
			output += no_tab_evaluate(expr.array[arr_length-1]);
			remove_semi();
		}

		output += "]";
		return output;
	});

	evaluators.set("object", (expr)=>{
		var output = "";

		var props_length = expr.props.length;
		if(props_length > 0){
			output += "{" + n;
			tab_depth += 1;
			for(var i=0; i<props_length-1;i++){
				output += t() + expr.props[i].key.value + ":" + eat_tab_evaluate(expr.props[i].value) + "," + n;
			}
			output += t() + expr.props[props_length-1].key.value + ":" + eat_tab_evaluate(expr.props[props_length-1].value) + n;
			tab_depth -= 1;
			output += t() + "}";
		}else{
			output = "{}";
		}


		return output;
	});

	evaluators.set('function', (expr)=>{
		var output = "function" + parse_params(expr.params) + "{" + comment(expr.position);
		tab_depth += 1;

		var save_semi = semi_colon_depth;
		semi_colon_depth = 0;
		output += t() + eat_tab_evaluate(expr.program);
		semi_colon_depth = save_semi;
		
		tab_depth -= 1;
		output += t() + "}";

		return output;
	});


	evaluators.set('arrow', (expr)=>{
		var output = parse_params(expr.params);
		output += "=>{" + n;


		var save_semi = semi_colon_depth;
		semi_colon_depth = 0;
		tab_depth += 1;
		output += evaluate(expr.program);
		tab_depth -= 1;
		semi_colon_depth = save_semi;
		output += t() + "}";


		return output;
	});


	evaluators.set('for', (expr)=>{
		var output = t();
		var arr = no_tab_evaluate(expr.arr);
		output += "let $arr_length=" + arr + ".length;" + n;
		output += t() + 'for(var '+expr.i+'=0;'+expr.i+'<$arr_length;'+expr.i+'++){' + n;
		tab_depth += 1;
		output += evaluate(expr.program);
		tab_depth -= 1;
		output += t() + "};" + comment(expr.position);

		return output;
	});

	evaluators.set('forNum', (expr)=>{
		var output = t();
		var arr = no_tab_evaluate(expr.arr);
		output += 'for(var '+expr.i+'=0;'+expr.i+'<'+arr+";"+expr.i+'++){' + n;
		tab_depth += 1;
		output += evaluate(expr.program);
		tab_depth -= 1;
		output += t() + "};" + comment(expr.position);

		return output;
	});

	evaluators.set("itterate", (expr)=>{
		var output = t();

		output += 'for(var['+expr.key+','+expr.value+']of ' + no_tab_evaluate(expr.id) + ".entries()){" + n;
		tab_depth += 1;
		output += evaluate(expr.program);
		tab_depth -= 1;
		output += t() + "};" + comment(expr.position);

		return output;
	});

	evaluators.set("forKeys", (expr)=>{
		var output = t();
		
		var id = no_tab_evaluate(expr.id);

		tab_depth += 1;
		output += `for(let ${expr.key} in ${id}){${n + t()}let ${expr.value}=${id}[${expr.key}];` + n;
		output += evaluate(expr.program);
		tab_depth -= 1;
		output += t() + "};" + comment(expr.position);

		return output;
	});

	evaluators.set("while", (expr)=>{
		var output = t();

		add_semi();
		output += "while(" + no_tab_evaluate(expr.condition) + "){" + n;
		remove_semi();
		tab_depth += 1;
		output += evaluate(expr.then);
		tab_depth -= 1;
		output += "};" + comment(expr.position);

		return output;
	});


	evaluators.set('program', (program)=>{
		var output = "";
		program.program.forEach((expr)=>{
			output += evaluate(expr);
		});

		return output;
	});


	evaluators.set('return', (expr)=>{
		var output = t();

		add_semi();
		output += "return " + no_tab_evaluate(expr.expr) + ";" + comment(expr.position);
		remove_semi();

		return output;
	});

	evaluators.set('delete', (expr)=>{
		var output = t();

		add_semi();
		output += "delete " + no_tab_evaluate(expr.expr) + ";" + comment(expr.position);
		remove_semi();

		return output;
	})

	evaluators.set('break', (expr)=>{
		return t() + "break;" + comment(expr.position);
	});

	evaluators.set('new', (expr)=>{
		return "new " + no_tab_evaluate(expr.id) + parse_call(expr.params);
	});
	evaluators.set('spawn', (expr)=>{
		return "new " + no_tab_evaluate(expr.id) + parse_call(expr.params) + ";" + comment(expr.position);
	});

	evaluators.set('if', (init_expr)=>{
		var output = t();
		var parse_if = function(expr){
			output += "if";
			
			add_semi();
			var condition = no_tab_evaluate(expr.condition);
			remove_semi();

			if(condition[0] == "(" && condition[condition.length-1] == ")"){
				output += condition;
			}else{
				output += "(" + condition + ")";
			}
			tab_depth += 1;
			output += "{" + n + evaluate(expr.then);
			tab_depth -= 1;
			output += t() + "}";
		}

		var parse_elif = function(expr){
			output += "else ";
			parse_if(expr);
		}

		var parse_else = function(expr){
			tab_depth += 1;
			output += "else{" + n + evaluate(expr.then);
			tab_depth -= 1;
			output += t() + "}";
		}

		parse_if(init_expr);
		init_expr.chain.forEach((chain)=>{
			if(chain.type == "elif"){
				parse_elif(chain);
			}else if(chain.type == "else"){
				parse_else(chain);
			}
		});

		output += ";" + comment(init_expr.position);

		return output;
	});

	evaluators.set('struct', (expr)=>{
		var output = "";

		output += t() + `let ${no_tab_evaluate(expr.id)}=function${parse_params(expr.params)}{` + n;
		tab_depth += 1;
		output += t() + "let private={};" + n;
		output += evaluate(expr.program);
		tab_depth -= 1;
		output += t() + "};" + comment(expr.position);

		return output;
	});

	evaluators.set('species', (expr)=>{
		var output = "";
		var id = no_tab_evaluate(expr.id);

		output += t() + `let ${id}=function${parse_params(expr.params)}{` + n;
		tab_depth += 1;
		output += t() + "let private={};" + id + ".$map.set(" + expr.params[0].value + ",this);" + n;
		output += evaluate(expr.program);
		tab_depth -= 1;
		output += t() + "};" + comment(expr.position);
		output += t() + `${id}.$map=new Map();${id}.get=function(id){return ${id}.$map.get(id);};${id}.has=function(id){return ${id}.$map.has(id);};${id}.forEach=function(cb){${id}.$map.forEach(cb);};${id}.delete=function(cb){${id}.$map.delete(cb);};` + comment(expr.position);


		return output;
	});


	evaluators.set('class', (expr)=>{
		var output = "";
		var id = no_tab_evaluate(expr.id);

		output += t() + `let ${id}=function${parse_params(expr.params)}{` + n;
		tab_depth += 1;
		output += t() + "let private={};" + id + ".$map.set(" + id + ".$i,this);let id=" + id + ".$i;" + id + ".$i+=1;" + n;
		output += evaluate(expr.program);
		tab_depth -= 1;
		output += t() + "};" + comment(expr.position);
		output += t() + `${id}.$i=0;${id}.$map=new Map();${id}.get=function(id){return ${id}.$map.get(id);};${id}.has=function(id){return ${id}.$map.has(id);};${id}.forEach=function(cb){${id}.$map.forEach(cb);};${id}.delete=function(cb){${id}.$map.delete(cb);};` + comment(expr.position);


		return output;
	});


	evaluators.set('access', (expr)=>{
		var output = "";

		output += t();

		var left = no_tab_evaluate(expr.expr.left);
		var value = "this." + left;
		var i = value.lastIndexOf('.');
		var obj = value.slice(0, i);
		var prop = value.slice(i+1);

		output += "private." + no_tab_evaluate(expr.expr);
		output += t() + `Object.defineProperty(${obj}, "${prop}", {get: ()=>{return private.${left};}});` + comment(expr.position);

		return output;
	});

	evaluators.set('try', (expr)=>{
		var output = t() + 'try{' + n;

		tab_depth += 1;
		output += evaluate(expr.try);
		tab_depth -= 1;
		output += t() + "}catch";

		if(expr.catch){
			if(expr.cond){
				output += parse_params(expr.cond);
			}
			tab_depth += 1;
			output += "{" + n + evaluate(expr.catch);
			tab_depth -= 1;
			output +=  t() + "};" + n;
		}else{
			output += "{};" + comment(expr.position);
		}
		return output;
	});

	evaluators.set("scope", (expr)=>{
		var output = t() + "{" + n;
		tab_depth += 1;
		output += evaluate(expr.program);
		tab_depth -= 1;
		output += t() + "};" + comment(expr.position);
		return output;
	});


	evaluators.set('error', (expr)=>{
		var output = "";
		// output = t() + "try{" + n;
		// tab_depth += 1;
		output += t() + "throw " + expr.error + "(" + no_tab_evaluate(expr.message) + ");" + n;
		// tab_depth -= 1;
		// output += t() + "}catch(e){console.error(e);};" + comment(expr.position);
		return output;
	});



	evaluators.set('import', (expr)=>{
		var plugin_name = expr.value.value;
		if(plugins[plugin_name] == null){
			error(`plugin (${plugin_name}) doesn't exist`);
		}

		var plugin_var_name = plugin_name;
		if(expr.accessors.length > 0){
			plugin_var_name = "{";
			for(var i=0; i<expr.accessors.length;i++){
				plugin_var_name += no_tab_evaluate(expr.accessors[i]);

				if(i < expr.accessors.length - 1){
					plugin_var_name += ",";
				}
			}
			plugin_var_name += "}";
		}

		if(!config.plugin){
			var dependancy_recursion = function(target){
				if(plugins[target] == false){
					var plugin_script = files.readFile(__dirname + "/../plugins/" + target + "/compiled.ntp");
					plugins[target] = true;
					plugin_code += plugin_script + comment(expr.position);

					var plugin_config = require(__dirname + "/../plugins/" + target + "/plugin.json");
					// console.log("plugin_config: ", plugin_config);
					plugin_config.dependancies.forEach((dependant)=>{
						dependancy_recursion(dependant);
					});
				}
			}

			dependancy_recursion(plugin_name);

			return "let " + plugin_var_name + "=$plugins.get('" + plugin_name + "');" + comment(expr.position);
		}else{
			return "let " + plugin_var_name + "=$get_plugin('" + plugin_name + "');";
		}
	});


	evaluators.set("call", (expr)=>{
		if(expr.params.length != 1){
			error(`there should only be 1 param in this call\n\texpr> ` + expr);
		}

		return "(" + no_tab_evaluate(expr.params[0]) + ")";
	});



	var count = 0;
	var tab_depth = 0;
	var evaluate = function(expr){
		if(evaluators.has(expr.type)){
			var output = evaluators.get(expr.type)(expr);
			return output;
		}else{
			// console.error("\x1b[31m" + `compiler >\n\tunkown type: ${expr.type}` + "\x1b[37m");
			var line = expr?.position?.line;
			var col = expr?.position?.col;
			// console.log(cmd.color.red + "\t<" + cmd.color.magenta + line + ":" + col + cmd.color.red + ">\n\texpr: \n\x1b[37m", expr);
			error(`unkown type: ${expr.type}`+ "\t<" + cmd.color.magenta + line + ":" + col + cmd.color.red + ">\n\texpr: \n\x1b[37m" + expr);
			// if(config.exit){
			// 	process.exit();
			// }
		}
	}

	var no_tab_evaluate = function(expr){
		var output = evaluate(expr);
		if(['object', 'function', 'arrow'].includes(expr.type)){
			return output;
		}else{
			return output.replaceAll("\t", '');
		}
	}

	var eat_tab_evaluate = function(expr){
		var output = evaluate(expr);
		while(output[0] == "\t"){
			output = output.substring(1, output.length);
		}
		return output;
	}

	var parse_params = function(params){
		var output = "(";
		var params_length = params.length;
		for(var i=0; i<params_length;i++){
			output += no_tab_evaluate(params[i]);
			if(i < params_length - 1){
				output += ",";
			}
		}

		output += ")";
		return output;
	}

	var parse_call = function(params){
		var output = "(";
		var params_length = params.length;
		for(var i=0; i<params_length;i++){
			output += no_tab_evaluate(params[i]);
			if(i < params_length - 1){
				output += ",";
			}
		}

		output += ")";
		return output;
	}

	var semi_colon_depth = 0;
	var add_semi = function(){
		semi_colon_depth += 1;
	}
	var remove_semi = function(){
		semi_colon_depth -= 1;	
	}
	var use_semi = function(){
		return semi_colon_depth == 0;
	}

	// var plugin_starter_code = "let $plugins=new Map();let $pending_plugins=new Map();let $get_plugin=function(name){if($plugins.has(name)){return $plugins.get(name);}else{let $plugin={plugin:{}};$pending_plugins.get(name)($plugin.plugin);$plugins.set(name,$plugin.plugin);$pending_plugins.delete(name);return $plugin.plugin;};};";
	var plugin_starter_code = "let $plugins=new Map();let $pending_plugins=new Map();let $get_plugin=function(name){if($plugins.has(name)){return $plugins.get(name);}else{var output=$pending_plugins.get(name)();$plugins.set(name,output);$pending_plugins.delete(name);return output;};};";
	var plugin_setup_code = "for(var[$key,$value]of $pending_plugins.entries()){$get_plugin($key);};";
	var plugin_code = "";
	if(input.type == "program"){
		var output = "";

		input.program.forEach((expr)=>{
			output += evaluate(expr);
		});

		if(plugin_code != ""){
			// output = plugin_starter_code + n + plugin_code + plugin_setup_code + n + "(()=>{"+ n + output + "})();";
			output = plugin_starter_code + n + plugin_code + plugin_setup_code + n + output;
		}

		return output;
	};
};

module.exports = Compiler;