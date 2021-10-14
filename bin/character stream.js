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

var CharacterStream = function(input, config){
    config = config ?? {};
    config.exit = config.exit ?? true;


    var position = -1;
    var line = 1;
    var collumn = 1;
    var line_str = "";

    this.next = function(){
    	position += 1;
        var char = input[position];
        if(char == "\n"){
            line+=1;
            collumn = 1; 
            line_str = "";
        }else if(char == "\t"){
            collumn += 4;
            line_str += char;
        }else{
            collumn+=1;
            line_str += char;
        }
        return char;
    }
    this.peek = function(){
        return input[position + 1];
    }
    this.look = function(i){
        return input[position + i + 1];
    }
    this.end = function(){
        return this.peek() == null;
    }

    this.move = function(move){
        position += move;
    }

    this.size = function(){
        return input.length;
    }

    this.error = function(type, msg){
        console.log(colors.red + type + ":\n\t" + msg + "\n\t<" + colors.magenta + line + ":" + collumn + colors.red + "> " + colors.yellow + line_str + colors.red + "..." + colors.white);
        if(config.exit){
            process.exit();
        }else{
            // process.stdout.write("\n> ");
        }
    }

    this.warning = function(msg, position){
        console.log(`${colors.yellow}Warning:\n\t${msg}\n\t<${colors.green + position.line + colors.yellow}:${colors.green + position.collumn + colors.yellow}>${colors.white}`)
    }

    this.position = function(){
        return {
            line,
            collumn,
            line_str: line_str.replaceAll("\t", "")
       };
    }
}

module.exports = CharacterStream;