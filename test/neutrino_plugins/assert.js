$pending_plugins.set('assert',()=>{let plugin={};let cmd=$get_plugin('cmd');let check="✓";let x='✘';plugin=function(title,value,condition){if(condition()==value){cmd.log(check+" "+title,cmd.color.green);}else{cmd.log(x+" "+title,cmd.color.red);};};plugin.metadata={"name":"assert","version":"0.1.0","description":"assert module","main":"index.nt","author":"12Thanjo","dependancies":["cmd"]};return plugin;}); //34:7
