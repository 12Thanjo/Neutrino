
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
				'local', 'regional', 'global', 'substitute', 'access',
				'import', 'macro',
				'function', 'return', 'break',
				'for', 'itterate', 'forKeys', 'forNum',
				'spawn', 'species', 'class',
				'try', 'catch',
				'Error', 'SyntaxError', 'ReferenceError', 'RangeError',
			].includes(keyword);
		},

		type: function(keyword){
			return ["Environment", "Component", "Query", "System"].includes(keyword);
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
			return ['(', ')', '[', ']', '{', '}', ';', '.', ':', ',', '@', '$', '~', "|"].includes(char);
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
			var _10 = self.get(10);
			if(['instanceof'].includes(_10)){
				self.move(10);
				read_operation = _10;
				return _7;
			}


			var _7 = self.get(7);
			if(['default'].includes(_7)){
				self.move(7);
				read_operation = _7;
				return _7;
			}


			var _6 = self.get(6);
			if(['typeof'].includes(_6)){
				self.move(6);
				read_operation = _6;
				return _7;
			}


			var _2 = self.get(2);
			if([
				'==', "+=", "-=", "*=", "/=", "%=", "!=",
				"=+", "=-", "=*", "=/", "=%", '=>', "=<",
				'>=', "<=",
				"&&", "||",
				">>", '->'
			].includes(_2)){
				self.move(2);
				read_operation = _2;
				return _2;
			}

			var _1 = self.get(1);
			if([
				'=', '+', '-', '/', '*', '%', '<', '>'
			].includes(_1)){
				self.move(1);
				read_operation = _1;
				return _1;
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
		var position = stream.position();
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
            	position: position
            });
        }else if(char == "'"){
            tokens.push({
            	type: "STRING1",
            	value: this.read.escaped("'"),
            	position: position
            });
		}else if(this.is.digit_start(char)){
			var value = self.next();
			value += this.read.digit();

			tokens.push({
				type: "DIGIT",
				value: value,
				position: position
			});
		}else if(this.read.operation() != false){
			var value = read_operation;

			tokens.push({
				type: "OPERATION",
				value: value,
				position: position
			});
		}else if(this.is.punctuation(char)){
			tokens.push({
				type: "PUNCTUATION",
				value: char,
				position: position
			});
			self.next();
        }else if(this.is.id_start(char)){
			var value = this.read.while(this.is.id);
			var type = "ID";
			if(this.is.keyword(value)){
				type = "KEYWORD";
			}else if(this.is.type(value)){
				type = "TYPE";
			}


			tokens.push({
				type: type,
				value: value,
				position: position
			});
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