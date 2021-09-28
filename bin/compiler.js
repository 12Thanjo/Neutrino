var {structures, cmd} = require('virtuosity-server');
var fix_floating_point = function(val){
	return Math.round(val*10000)/10000;
}


var Compiler = function(input, const_dict, config){
	var const_dict_enabled = const_dict != null;

	config = config ?? {};
	config.slient = config.silent ?? false;
	config.debug = config.debug ?? true;
	config.exit = config.exit ?? true;

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
					type: "DIGIT",
					value: left
				}
			}
		}

		if(right.type == 'binary'){
			right = traverse(right);
			if(isNaN(right)){
				right = {
					type: "DIGIT",
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
	
	var traverse = function(expr){
		if(expr.type == "binary"){
			return "(" + simplify(expr.left, expr.operator, expr.right) + ")";
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
		output += expr.operator + no_tab_evaluate(expr.right) + ";" + comment(expr.left.position);
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
		var output = evaluate(expr.left) + " instanceof " + no_tab_evaluate(expr.right);
		output.replaceAll('\t', '');
		return output;
	});

	evaluators.set('typeof', (expr)=>{
		var output = "typeof " + evaluate(expr.left) + "==" + no_tab_evaluate(expr.right);
		output.replaceAll('\t', '');
		return output;
	});



	evaluators.set("id", (expr)=>{
		if(!const_dict.has(expr.value)){
			var output = t() + expr.value;

			var call = false;

			if(expr.attachment != null){
				if(expr.attachment.type == "index"){
					output += "[" + no_tab_evaluate(expr.attachment.value) + "]";
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
				cmd.log(`compiler >\n\tCONST variable is left-hand side in assignment` + "\x1b[37m", cmd.color.red);
				cmd.log("\t<" + cmd.color.magenta + expr.position.line + ":" + expr.position.collumn + cmd.color.red + "> ", cmd.color.red);
				if(config.exit){
					process.exit();
				}
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
					right = right.slice(0, semi_index);
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
					right = right.slice(0, semi_index);
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
					right = right.slice(0, semi_index);
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
			for(var i=0; i<arr_length-1;i++){
				output += no_tab_evaluate(expr.array[i]) + ",";
			}
			output += no_tab_evaluate(expr.array[arr_length-1]);
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
		output += t() + eat_tab_evaluate(expr.program);
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
		output += "let $" + expr.arr + '_length=' + expr.arr + ".length;" + n;
		output += t() + 'for(var '+expr.i+'=0;'+expr.i+'<$'+expr.arr+'_length;'+expr.i+'++){' + n;
		tab_depth += 1;
		output += evaluate(expr.program);
		tab_depth -= 1;
		output += t() + "};" + comment(expr.position);

		return output;
	});

	evaluators.set('forNum', (expr)=>{
		var output = t();
		output += 'for(var '+expr.i+'=0;'+expr.i+'<'+expr.arr+";"+expr.i+'++){' + n;
		tab_depth += 1;
		output += evaluate(expr.program);
		tab_depth -= 1;
		output += t() + "};" + comment(expr.position);

		return output;
	});

	evaluators.set("itterate", (expr)=>{
		var output = t();

		output += 'for(var['+expr.key+','+expr.value+']of ' + expr.id + ".entries()){" + n;
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

	evaluators.set('break', (expr)=>{
		return t() + "break;" + comment(expr.position);
	});

	evaluators.set('spawn', (expr)=>{
		return "new " + no_tab_evaluate(expr.id) + parse_call(expr.params);
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

	evaluators.set('species', (expr)=>{
		var output = "";

		output += t() + `var ${no_tab_evaluate(expr.id)}=function${parse_params(expr.params)}{` + n;
		tab_depth += 1;
		output += t() + "let private={};" + n;
		output += evaluate(expr.program);
		tab_depth -= 1;
		output += t() + "};" + comment(expr.position);

		return output;
	});

	evaluators.set('class', (expr)=>{
		var output = "";
		var id = no_tab_evaluate(expr.id);

		output += t() + `var ${id}=function${parse_params(expr.params)}{` + n;
		tab_depth += 1;
		output += t() + "let private={};" + id + ".$map.set(" + expr.params[0].value + ",this);" + n;
		output += evaluate(expr.program);
		tab_depth -= 1;
		output += t() + "};" + comment(expr.position);
		output += t() + `${id}.$map=new Map();${id}.get=function(id){return ${id}.$map.get(id);};${id}.has=function(id){return ${id}.$map.has(id);};${id}.forEach=function(cb){${id}.$map.forEach(cb);};` + comment(expr.position);


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


	evaluators.set('error', (expr)=>{
		var output = t() + "try{" + n;
		tab_depth += 1;
		output += t() + "throw " + expr.error + "(" + no_tab_evaluate(expr.message) + ");" + n;
		tab_depth -= 1;
		output += t() + "}catch(e){console.error(e);};" + comment(expr.position);
		return output;
	});



	var count = 0;
	var tab_depth = 0;
	var evaluate = function(expr){
		if(evaluators.has(expr.type)){
			var output = evaluators.get(expr.type)(expr);
			return output;
		}else{
			console.error("\x1b[31m" + `compiler >\n\tunkown type: ${expr.type}` + "\x1b[37m");
			var line = expr?.position?.line;
			var col = expr?.position?.col;
			console.log(cmd.color.red + "\t<" + cmd.color.magenta + line + ":" + col + cmd.color.red + ">\n\texpr: \n\x1b[37m", expr);
			if(config.exit){
				process.exit();
			}
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
			output += params[i].value;
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


	if(input.type == "program"){
		var output = "";

		input.program.forEach((expr)=>{
			output += evaluate(expr);
		});

		return output;
	};
};

module.exports = Compiler;