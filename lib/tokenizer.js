
// "stream" must be a CharacterStream
var Tokenizer = function(stream, config){
	config = config ?? {};
	config.silent = config.silent ?? false;

	var tokens = [];
	var self = this;


	var count = 0;
	this.move = function(i){
		count += i;
		return stream.move(i);
	}

	this.next = function(){
		count += 1;
		return stream.next();
	}


	this.is = {
	 	whitespace: function(char){
		    return " \t\n\r".includes(char);
		},

		id_start: function(char){
	    	return /([a-zA_Z]|_)/i.test(char);
		},
		id: function(char){
			return self.is.id_start(char) || "0123456789_".includes(char);	
		},

		keyword: function(keyword){
			return [
				'if', 'else',
				// 'true', 'false',
				'local', 'regional', 'global', 'define', 'access',
				'import', 'macro', 'scope',
				'function', 'return', 'break', 'delete',
				'for', 'iterate', 'forKeys', 'forNum', 'while',
				'new', 'spawn', 'species', 'class', 'struct', 'operation',
				'try', 'catch',
				'Error', 'SyntaxError', 'ReferenceError', 'RangeError',
			].includes(keyword);
		},

		digit: function(char){
			return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(char);
		},

		digit_start: function(char){
			if(char == "-"){
				var is_digit = self.is.digit(stream.look(1));
				var prev_not_digit = tokens[tokens.length-1].type != "DIGIT";
				return is_digit && prev_not_digit;
			}else{
				return self.is.digit(char);
			}
		},

		punctuation: function(char){
			return ['(', ')', '[', ']', '{', '}', ';', '.', ':', ',', '@', '~', "|", "$"].includes(char);
		},
	}


	this.get = function(num){
		var str = "";
		for(var i=0; i<num;i++){
			str += stream.look(i);
		}
		return str;
	}


	var read_operation;
	this.read = {
		operation: function(){
			// look 10 becasue thats length of the longest word
			var look = self.get(11);
			var words = ['instanceof', 'is', 'isnt', 'default', 'typeof', 'swap', 'toggle', 'classof'];
			for(var i = words.length - 1; i>=0; i--){
				var word = words[i];
				if(look.indexOf(word) == 0 && !self.is.id(look[word.length])){
					self.move(word.length);
					read_operation = word;
					stream.add_to_line_str(word);
					return word;
				}
			}


			var symbols = [
				'=', '+', '-', '/', '*', '%', '<', '>', '^',

				'==', "!=",
				'>=', "<=", '=>', "=<",

				"+=", "-=", "*=", "/=", "%=", "^=",
				"=+", "=-", "=*", "=/", "=%", "=^",

				"&&", "||",
				'->',
			];
			for(var i = symbols.length - 1; i>=0; i--){
				var symbol = symbols[i];
				if(look.indexOf(symbol) == 0){
					self.move(symbol.length);
					read_operation = symbol;
					stream.add_to_line_str(symbol);
					return symbol;
				}
			}


			return false;
		},

		digit: function(){
			var has_dot = false;
			return self.read.while((char)=>{
				if(char == "."){
				    if(has_dot){
				        return false;
				    }
				    has_dot = true;
				    return true;
				}
				return self.is.digit(char);
			});
		},

		while: function(predicate){
			var str = "";
	        while(!stream.end() && predicate(stream.peek())){
	            str += self.next();
	        }

	        return str;
	    },

	    escaped: function(end){
	        var escaped = false;
	        var str = "";
	        self.next();
	        while(!stream.end()){
	            var char = self.next();
	            if(escaped){
	                str += char;
	                escaped = false;
	            }else if(char == "\\"){
	                escaped = true;
	                str += "\\";
	            }else if(char == end){
	                break;
	            }else{
	                str += char;
	            }
	        }
	        return str;
	    }	
	}


	while(!stream.end()){
		this.read.while(this.is.whitespace);
		var char = stream.peek();

		if(this.get(2) == "//"){
			self.move(2);
			this.read.while((char)=>{
				return char != "\n";
			});
		}else if(char == '"'){
            tokens.push({
            	type: "STRING2",
            	value: this.read.escaped('"'),
            	position: stream.position()
            });
        }else if(char == "'"){
            tokens.push({
            	type: "STRING1",
            	value: this.read.escaped("'"),
            	position: stream.position()
            });
		}else if(this.is.digit_start(char) && this.is.id(stream.look(-1)) == false){
			var value = self.next();
			value += this.read.digit();

			tokens.push({
				type: "DIGIT",
				value: value,
				position: stream.position()
			});
		}else if(this.read.operation() != false){
			var value = read_operation;

			tokens.push({
				type: "OPERATION",
				value: value,
				position: stream.position()
			});
		}else if(this.is.punctuation(char)){
			tokens.push({
				type: "PUNCTUATION",
				value: char,
				position: stream.position()
			});
			self.next();
        }else if(this.is.id_start(char)){
			var value = this.read.while(this.is.id);
			var type = "ID";
			if(this.is.keyword(value)){
				type = "KEYWORD";
			}

			
			if(['async', 'await', 'continue'].includes(value)){
				value = "$" + value;
			}

			// not 100% sure I want to keep this
			if(value == "this"){
				value = "$this";
			}


			if(value != ""){
				tokens.push({
					type: type,
					value: value,
					position: stream.position()
				});
			}
		}else{
            stream.error("Syntax Error", "Can't handle character: " + char);
        }

	}

	tokens.push({
		type: "END"
	});
	return tokens;
}


module.exports = Tokenizer;