$pending_plugins.set('cmd',()=>{let plugin={};plugin.color={black:"\x1b[30m",red:"\x1b[31m",yellow:"\x1b[33m",green:"\x1b[32m",blue:"\x1b[34m",magenta:"\x1b[35m",cyan:"\x1b[36m",white:"\x1b[37m"};plugin.backgroundColor={black:"\x1b[40m",red:"\x1b[41m",green:"\x1b[42m",yellow:"\x1b[43m",blue:"\x1b[44m",magenta:"\x1b[45m",cyan:"\x1b[46m",white:"\x1b[47m"};plugin.style={reset:"\x1b[0m",bright:"\x1b[1m",dim:"\x1b[2m",underscore:"\x1b[4m",blink:"\x1b[5m",reverse:"\x1b[7m",hidden:"\x1b[8m"};plugin.log=function(string,color,backgroundColor){string=string||"";color=color||"";backgroundColor=backgroundColor||"";console.log(color+backgroundColor+string+plugin.color.white+plugin.backgroundColor.black+plugin.style.reset);};plugin.specialLog=function(data){if(typeof data=="string"==false){console.log(data);console.log();}else{if(isNaN(data)==false){console.log(plugin.color.orange+data+plugin.color.white+"\n");}else{console.log(plugin.color.green+"'"+data+"'"+plugin.color.white+"\n");};};};plugin.metadata={"name":"cmd","version":"0.1.0","description":"command line interaction","main":"index.nt","author":"12Thanjo","dependancies":[]};return plugin;}); //34:7
