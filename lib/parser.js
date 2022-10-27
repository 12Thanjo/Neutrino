var colors = {
    black: "\x1b[30m", 
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m"
}

// var {structures} = require('virtuosity-server');

var Parser = function(tokens, macro_map, config){
	config = config ?? {};
	config.silent = config.silent ?? false;
	config.exit = config.exit ?? true;

	var const_dict = new Map();


	var self = this;

	var TOKENS_I = 0;

	this.next = function(){
		var output = tokens[TOKENS_I];
		TOKENS_I += 1;
		return output;
	}

	this.peek = function(){
		return tokens[TOKENS_I];
	}

	this.look = function(i){
		return tokens[TOKENS_I + i];
	}

	var TOKENS_LENGTH = tokens.length-1;
	this.end = function(){
		return TOKENS_I >= TOKENS_LENGTH;
	}

	this.insert = function(arr){
		tokens = [...tokens.slice(0, TOKENS_I), ...arr, ...tokens.slice(TOKENS_I, tokens.length)];
		TOKENS_LENGTH += arr.length;
	}

	this.error = function(type, msg){
		var line = this.peek()?.position?.line || this.look(-1)?.position?.line;
		var col = this.peek()?.position?.collumn || this.look(-1)?.position?.collumn;
		var line_str = this.peek()?.position?.line_str || this.look(-1)?.position?.line_str;
		var file = this.peek()?.position?.file || this.look(-1)?.position?.file;

		var output = "\n\n" + colors.red + type + ":";
		output += "\n\t" + msg;
		output += "\n\t" + "[" + colors.magenta + file + colors.red + "]";
		output += "\n\t<" + colors.magenta + line + ":" + col + colors.red + "> " + colors.yellow + line_str + colors.red + "..." + colors.white;
		console.log(output);
		if(config.exit){
			process.exit(1);
		}
	}

	this.unexpected = function(){
		var token = this.peek();
		try{
	    	this.error("Syntax Error", `Unexpected token:\n\t\ttype: ${token.type}\n\t\tvalue: ${token.value}`);
		}catch{
			this.error("Syntax Error", `Unexpected token: ${JSON.stringify(this.peek())}`);
		}
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	this.is = {
		punctuation: (punctuation)=>{
			var token = self.peek();
			return token && token.type == "PUNCTUATION" && (!punctuation || token.value == punctuation) && token;
		},
		id: (id)=>{
		    var token = self.peek();
		    return token && token.type == "ID" && (!id || token.value == id) && token;
		},
		keyword: (keyword)=>{
		    var token = self.peek();
		    return token && token.type == "KEYWORD" && (!keyword || token.value == keyword) && token;
		},
		type: (type)=>{
		    var token = self.peek();
		    return token && token.type == "TYPE" && (!type || token.value == type) && token;
		},
		operation: (operation)=>{
		    var token = self.peek();
		    return token && token.type == "OPERATION" && (!operation || token.value == operation) && token;
		} 
	}

	this.skip = {
	    punctuation: (punctuation)=>{
	        if(self.is.punctuation(punctuation)){
	            self.next();
	        }else{
	            self.error("Syntax Error", `Expecting punctuation: "${punctuation}", got "${self.peek().value}"`);
	        }
	    },
	    id: (id)=>{
	        if(self.is.id(id)){
	            self.next();
	        }else{
	            self.error("Syntax Error", `Expecting id: "${id}", got "${self.peek().value}"`);
	        }
	    },
	    keyword: (keyword)=>{
	        if(self.is.keyword(keyword)){
	            self.next();
	        }else{
	            self.error("Syntax Error", `Expecting keyword: "${keyword}", got "${self.peek().value}"`);
	        }
	    },
	    operation: (operation)=>{
	        if(self.is.operation(operation)){
	            self.next();
	        }else{
	            self.error("Syntax Error", `Expecting operation: "${operation}", got "${self.peek().value}"`);
	        }
	    }
	}

	this.get = {
	    punctuation: ()=>{
	    	var token = self.peek().value;
	        if(self.is.punctuation(token)){
	            return self.next();
	        }else{
	            self.error("Syntax Error", `Expecting punctuation, got "${token} (${self.peek().type})"`);
	        }
	    },
	    id: ()=>{
	    	var token = self.peek().value;
	        if(self.is.id(token)){
	            return self.next();
	        }else{
	            self.error("Syntax Error", `Expecting id, got "${token} (${self.peek().type})"`);
	        }
	    },
	    keyword: ()=>{
	    	var token = self.peek().value;
	        if(self.is.keyword(token)){
	            return self.next();
	        }else{
	            self.error("Syntax Error", `Expecting keyword, got "${token} (${self.peek().type})"`);
	        }
	    },
	    operation: ()=>{
	    	var token = self.peek().value;
	        if(self.is.operation(token)){
	            return self.next();
	        }else{
	            self.error("Syntax Error", `Expecting operation, got "${token} (${self.peek().type})"`);
	        }
	    }
	}



	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	this.delimited = function(start, stop, separator, parser){
	    var output = [];
	    var first = true;

	    this.skip.punctuation(start);
	    while(!this.end()){
	        if(this.is.punctuation(stop)){
	            break;
	        }

	        if(first){
	            first = false;
	        }else{
	            this.skip.punctuation(separator);
	        }

	        if(this.is.punctuation(stop)){
	            break;
	        }
	        var parsed = parser();
	        output.push(parsed);
	    }
	    this.skip.punctuation(stop);
	    return output;
	}


	this.capture = function(start, stop){
	    this.skip.punctuation(start);
	    var expr = self.parse.expression();
	    this.skip.punctuation(stop);
	    return expr;
	}


	this.maybe = {
		binary: (left, my_precedence)=>{
			var PRECEDENCE = {
				//bigger is done previous
			    "=": 1, "+=": 1, "-=": 1, "*=": 1, "/=": 1, "%=": 1, "^=": 1,
			    "=>": 1, "=<": 1, "=+": 1, "=-": 1, "=*": 1, "=/": 1, "=%": 1, "=^": 1,
			    "&&": 2, "||": 2,
			    "<": 3, ">": 3, "<=": 3, ">=": 3, "==": 3, "!=": 3,
			    "default": 4, "typeof": 4, "instanceof": 4, "classof": 4, "is": 4, "isnt": 4, 'swap': 4, 'toggle': 4,
			    "+": 5, "-": 5,
			    "*": 6, "/": 6, "%": 6,
			    "<<": 7, ">>": 7, "|||": 7, "&&&": 7,
			    "^": 8,
			};
			var position = self.peek().position;

			var overloading = self.is.punctuation("$");
			if(overloading){
				self.skip.punctuation("$");
			}


			var token = self.is.operation();

            if(token){
                var their_precedence = PRECEDENCE[token.value];
                if(their_precedence > my_precedence){
                    self.next();

                    var type = "binary";
                    if(["=", "+=", "-=", "*=", "/=", "%=", "^="].includes(token.value)){
                        type = "assign";
                    }else if(["=+", "=-", "=*", "=/", "=%", "=^"].includes(token.value)){
                    	token.value = token.value[1];
                        type = "reverse assign";
                    }else if(["=>", "=<"].includes(token.value)){
                        type = "size assign";
                    }else if(["default", 'typeof', 'instanceof', 'is', "isnt", 'swap', 'toggle', 'classof'].includes(token.value)){
                        type = token.value;
                    }


                    if(overloading){
                    	if(["assign", "reverse assign"].includes(type)){
                    		type = "operation assign cast";
                    	}else{
                    		type = "operation cast";
                    	}
                    }

                    return this.maybe.binary({
                        type: type,
                        operator: token.value,
                        left: left,
                        right: this.maybe.binary(self.parse.atom(), their_precedence),
                        position: position,
                    }, my_precedence);
                }
            }
            return left;
		}
	};



	this.parse = {

		skip: ()=>{
			return {
				type: "skip"
			};
		},

		initialization: ()=>{
			var type = self.get.keyword();
			var expr = self.parse.expression();

			expr.type = 'var';
			expr.scope = type.value;

			return expr;
		},


		const: ()=>{
			self.skip.keyword("define");
			var expr = self.parse.expression();
			self.skip.punctuation(";");

			if(const_dict.has(expr.left.value)){
				self.error("Syntax Error", `define ${expr.left.value} has already been declared`);
			}

			const_dict.set(expr.left.value, expr.right);

			// skip
			return self.parse.expression();
		},

		access: ()=>{
			var position = self.peek().position;
			self.skip.keyword('access');
			var expr = self.parse.expression();

			return {
				type: "access",
				expr: expr,
				position: position
			}
		},


		macro: ()=>{
			self.skip.keyword('macro');
			var file = self.next();
			self.skip.punctuation(";");

			if(file.type != "STRING1" && file.type != "STRING2"){
				self.error("Syntax Error", 'Invalid target for macro (must be a string)');
			}
			if(macro_map == null){
				self.error('Uncaught Error', `(macro) commands are invalid with this compile paradigm\n\tDid you mean ${colors.blue}neutrino build${colors.red}?`);
			}
			if(!macro_map.has(file.value)){
				// console.log("macro_map: ", macro_map);
				self.error("Reference Error", `(${file.value}) is not a valid neutrino macro compile target.\n\tMake sure the file path is correct and are ommiting the .ntm`);
			}

			self.insert(macro_map.get(file.value));

			// skip
			return self.parse.expression();
		},

		import: ()=>{
			var position = self.peek().position;
			self.skip.keyword('import');
			var plugin = self.get.id();
			

			var accessors = [];
			var accessors_type;
			if(self.is.punctuation("(")){
				accessors = self.delimited("(", ")", ",", self.parse.expression);
				accessors_type = "()";
			}else if(self.is.punctuation('[')){
				accessors = self.delimited("[", "]", ",", self.parse.expression);
				accessors_type = "[]";
			}

			position.file = plugin.position.file;
			return {
				type: "import",
				value: plugin,
				position: position,
				accessors: accessors,
				accessors_type: accessors_type
			};
		},


		id: ()=>{
			var value = self.next();

			var accessor;
			var attachments = [];

			while(true){
				if(self.is.punctuation('[')){
					attachments.push({
						type: "index",
						value: self.capture('[', ']')
					});
				}else if(self.is.punctuation("(")){
					attachments.push({
						type: "call",
						value: self.delimited("(", ")", ",", self.parse.expression)
					});
				}else{
					break;
				}
			}

			if(self.is.punctuation('.')){
				self.skip.punctuation('.');
				accessor = self.parse.id();
			}

			var output = {
				type: "id",
				value: value.value,
				attachments: attachments,
				accessor: accessor,
				position: value.position
			};

			// console.log(output);
			return output;
		},


		variable: ()=>{
			var value = self.next();

			var accessor;
			var attachments = [];

			while(true){
				if(self.is.punctuation('[')){
					attachments.push({
						type: "index",
						value: self.capture('[', ']')
					});
				}else{
					break;
				}
			}


			if(self.is.punctuation('.')){
				self.skip.punctuation('.');
				accessor = self.parse.variable();
			}

			var output = {
				type: "id",
				value: value.value,
				attachments: attachments,
				accessor: accessor,
				position: value.position
			};

			// console.log(output);
			return output;
		},


		spread: ()=>{
			self.skip.punctuation('~');
			var id = self.parse.id();

			return {
				type: 'spread',
				id: id
			}
		},


		array: ()=>{
			var position = self.peek().position;
			var array = self.delimited("[", "]", ",", self.parse.expression);
			return {
				type: "array",
				array: array,
				position: position
			}
		},


		concat: ()=>{
			var elems = [];
			self.skip.punctuation("|");
			while(!self.is.punctuation("|")){
				if(self.is.punctuation('(')){
					elems.push(self.capture("(", ")", self.parse.expression));
				}else{
					elems.push(self.parse.expression());
				}
			}

			self.skip.punctuation('|');

			return {
				type: "concat_string",
				elems: elems
			}
		},

		object: ()=>{
		    var props = [];
		    self.skip.punctuation('{');
		    if(!self.is.punctuation("}")){
		        while(true){
		            var key = self.next();
		            self.skip.punctuation(":");
		            var expr = self.parse.expression();
		            props.push({
		            	key: key,
		            	value: expr
		            });

		            if(self.is.punctuation(',')){
		                self.skip.punctuation(',');
		                if(self.is.punctuation('}')){
		                    self.skip.punctuation("}")
		                    break;
		                }
		            }else{
		                self.skip.punctuation("}");
		                break;
		            }
		        }
		    }else{
		        self.skip.punctuation("}");
		    }
		    
		    return {
		        type: "object",
		        props: props
		    }
		},

		call: (func)=>{
		    var params = self.delimited("(", ")", ",", self.parse.expression);
		    
		    var accessors = [];
		    while(self.peek().type == "accessor"){
		        var next = self.next();
		        next.type = "variable";

		        if(self.is.punctuation('(')){
		            var accessor_params = self.delimited("(", ")", ",", self.parse.expression);
		            next = {
		                type: "call",
		                func: {
		                    type: 'variable',
		                    value: next.value,
		                    accessors: []
		                },
		                params: accessor_params,
		                accessors: []
		            }
		        }else if(self.is.punctuation('[')){
		            next.index = self.parse.index(next).index;
		            next.type = "index variable";
		        }

		        accessors.push(next);
		    }

		    return {
		        type: "call",
		        func: func,
		        params: params,
		        accessors: accessors
		    };
		},


		program: ()=>{
		    var program = self.delimited("{", "}", ";", self.parse.expression);

		    // if(program.length == 0){
		    //     return false;
		    // }else if(program.length == 1){
		    //     return program[0];
		    // }else{
		        return { type: "program", program };
		    // }
		},


		atom: ()=>{

			if(self.is.punctuation("(")){
			    return self.parse.call();
			}else if(self.is.punctuation('[')){
				return self.parse.array();
			}else if(self.is.punctuation('{')){
				return self.parse.object();
			}


			if(self.is.keyword("local") || self.is.keyword("regional") || self.is.keyword("global")){
				return self.parse.initialization();
			}else if(self.is.keyword("define")){
				return self.parse.const();
			}else if(self.is.keyword("access")){
				return self.parse.access();
			}


			if(self.is.keyword('function')){
				return self.parse.function();
			}else if(self.is.punctuation("@")){
				return self.parse.arrow();
			}

			if(self.is.keyword("macro")){
				return self.parse.macro();
			}else if(self.is.keyword("import")){
				return self.parse.import();
			}else if(self.is.keyword('return')){
				return self.parse.return();
			}else if(self.is.keyword('delete')){
				return self.parse.delete();
			}else if(self.is.keyword('break')){
				return self.parse.break();
			}

			if(self.is.keyword("if")){
				return self.parse.if();
			}else if(self.is.keyword("while")){
				return self.parse.while();
			}

			if(self.is.keyword("for")){
				return self.parse.for("for");
			}else if(self.is.keyword('forNum')){
				return self.parse.for("forNum");
			}else if(self.is.keyword("iterate")){
				return self.parse.iterate("iterate");
			}else if(self.is.keyword('forKeys')){
				return self.parse.iterate('forKeys');
			}


			if(self.is.keyword('new')){
				return self.parse.new('new');
			}else if(self.is.keyword('spawn')){
				return self.parse.new('spawn');
			}
			if(self.is.keyword('species')){
				return self.parse.class("species");
			}else if(self.is.keyword('class')){
				return self.parse.class("class");
			}else if(self.is.keyword('struct')){
				return self.parse.class("struct");
			}
			if(self.is.keyword("operation")){
				return self.parse.operation();
			};

			if(self.is.keyword("try")){
				return self.parse.try();
			}

			if(self.is.keyword('scope')){
				return self.parse.scope();
			}

			if(self.is.keyword('Error') || self.is.keyword('SyntaxError') || self.is.keyword('ReferenceError') || self.is.keyword('RangeError')){
				return self.parse.error();
			}


			if(self.is.punctuation("~")){
				return self.parse.spread();
			}

			if(self.is.punctuation('|')){
				return self.parse.concat();
			}


			var token = self.peek();
			if(self.is.id()){
			    return self.parse.id();
			}else if(token.type == "STRING1" || token.type == "STRING2"){
				return self.next();
			}else if(token.type == "DIGIT"){
                return self.next();
            }else if(token.type == "END"){
            	return {
            		type: "END"
            	};
            }

			self.unexpected();
		},


		expression: ()=>{
			var atom = self.parse.atom();
			return self.maybe.binary(atom, 0);
		},

		//////////////////////////////////////////////////////////////////////////////////////////////////


		function: ()=>{
			var position = self.peek().position;
			var id = self.look(-2).value;
			
			// parser
			self.skip.keyword('function');
			var call = self.parse.call();
			var program = self.parse.program();

			return {
				type: "function",
				params: call.params,
				program: program,
				position: position
			}
		},


		arrow: function(){
			self.skip.punctuation("@");
			var call = self.parse.call();
			self.skip.operation("->");
			var program = self.parse.program();

			return {
				type: "arrow",
				params: call.params,
				program: program
			}	
		},


		return: ()=>{
			var position = self.peek().position;
			self.skip.keyword('return');
			var expr = self.parse.expression();
			return {
				type: 'return',
				expr: expr,
				position: position,
			}
		},

		delete: ()=>{
			var position = self.peek().position;
			self.skip.keyword('delete');
			var expr = self.parse.expression();
			return {
				type: 'delete',
				expr: expr,
				position: position,
			}
		},

		break: ()=>{
			var position = self.peek().position;
			self.skip.keyword('break');

			return {
				type: 'break',
				position: position
			}
		},


		if: ()=>{
			self.skip.keyword('if');
			var position = self.peek().position;
			var condition = self.capture("(", ")", self.parse.expression);
			var then = self.parse.program();

			var chain = [];
			while(self.is.keyword('else')){
				self.skip.keyword('else');

				if(self.is.keyword('if')){
					self.skip.keyword('if');
					var push = {
						type: "elif"
					};

					push.position = self.peek().position;
					push.condition = self.capture("(", ")", self.parse.expression);
					push.then = self.parse.program();

					chain.push(push);
				}else{
					var push = self.parse.program();
					chain.push({
						type: "else",
						then: push
					});
				}
			}
			return {
				type: 'if',
				condition: condition,
				then: then,
				position: position,
				chain: chain
			};
		},

		while: ()=>{
			var position = self.peek().position;
			self.skip.keyword("while");
			var condition = self.capture("(", ")", self.parse.expression);
			var then = self.parse.program();

			return {
				type: "while",
				condition: condition,
				then: then,
				position: position
			}
		},

		for: (type)=>{
			var position = self.peek().position;
			self.skip.keyword(type);
			// var call = self.parse.call();
			var params = self.delimited("(", ")", ",", self.parse.expression);

			var i = params[0];
			var iter = params[1];
			var start = null;


			if(params.length != 2){
				if(type == "for"){
					self.error('Syntax Error', "for loops must have 2 parameters (itterator variable, array)");
				}else if(type == "forNum"){
					if(params.length == 3){
						start = params[1];
						iter = params[2];
					}else{
						self.error('Syntax Error', "for loops must have 2 parameters (itterator variable, number)");
					}
				}
			}


			var program = self.parse.program();

			return {
				type: type,
				i: i.value,
				iter: iter,
				start: start,
				program: program,
				position: position
			}
		},

		iterate: (type)=>{
			var position = self.peek().position;
			self.skip.keyword(type);
			var id = self.parse.variable();
			var call = self.parse.call();

			var key = call.params[0];
			var value = call.params[1];


			var program = self.parse.program();

			return {
				type: type,
				id: id,
				key: key.value,
				value: value.value,
				program: program,
				position: position
			}
		},


		new: (type)=>{
			var position = self.peek().position;
			self.skip.keyword(type);
			var id = self.parse.id();


			return{
				type: type,
				id: id,
				position: position,
			}
		},


		class: (type)=>{
			var position = self.peek().position;
			self.skip.keyword(type);
			var id = self.parse.variable();
			var call = self.parse.call();

			if(type == "species" && call.params.length == 0){
				self.error("Syntax Error", "species must have at least one parameter");
			}


			var program = self.parse.program();


			return {
				type: type,
				id: id,
				params: call.params,
				program: program,
				position: position
			}
		},

		operation: (type)=>{
			var position = self.peek().position;
			self.skip.keyword("operation");
			var operator = self.get.operation();

			/////////
			self.skip.punctuation("(");

			// self.skip.operation("<");
			var cast = self.get.id();
			// self.skip.operation(">");

			self.skip.punctuation(",");

			var variable = self.get.id();

			self.skip.punctuation(")");
			/////////

			var program = self.parse.program();



			return {
				type: "operation",
				operator: operator,
				cast: cast,
				variable: variable,
				program: program,
				position: position
			}
		},

		try: ()=>{
			var position = self.peek().position;
		    self.skip.keyword('try');
		    var attempt = self.parse.program();

		    var output = {
		        type: 'try',
		        try: attempt,
		        position: position,
		    };

		    if(self.is.keyword('catch')){
		        self.skip.keyword('catch');
		        if(self.is.punctuation('(')){
		            output.cond = self.parse.call().params;
		        }
		        output.catch = self.parse.program();
		    }


		    return output;
		},

		scope: ()=>{
			var position = self.peek().position;
		    self.skip.keyword('scope');
		    var program = self.parse.program();

		    return {
		    	type: "scope",
		    	program: program,
		    	position: position
		    };
		},

		error: ()=>{
			var position = self.peek().position;
			var type = self.get.keyword();
			var message = self.parse.expression();

			return {
				type: "error",
				error: type.value,
				message: message,
				position: position
			}
		},

	};



	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var program = [];
	while(!this.end()){
		try{
		    var expr = this.parse.expression();
		}catch(e){
			console.log(e);
		    this.error("Uncaught Error", e.message);
		}

		program.push(expr);

		if(!this.end()){
		    this.skip.punctuation(";");
		}
	}

	return {
		output: {
			type: "program",
			program: program
		},
		const_dict: const_dict
	}


}


module.exports = Parser;