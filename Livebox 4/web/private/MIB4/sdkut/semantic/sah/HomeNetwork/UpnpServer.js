define(["utils/console","engine/callStack"],function(console,callStack){"use strict";return{getCurrentState:{name:"Retrieves the current state of the UPnP server",description:"This method returns the current state of the UPnP server.",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{}},call:function(aStep,aResult){var result;if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;this.fields.mxStep+=1;this.fields.data={isUpnpRulesEnabled:false};callStack.push("api","pcb.Firewall.getUPnPIGD","1",this)}else{if(aStep==="1"){this.fields.nbStep+=1;if(aResult.status===0||aResult.status===true){this.fields.data.isUpnpRulesEnabled=aResult.data.Enable}else{this.fields.mxStep=-1;this.fields.status=-1;callStack.logMessage("SEM_SYN_ERROR")}}else{console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if(this.fields.status===0&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}},setCurrentState:{name:"Updates the current state of the UPnP server",description:"This method sets the current state of the UPnP server.",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{}},call:function(aStep,aResult){var result;if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;this.fields.initialParameters=aResult.inputList[0];this.fields.mxStep+=1;callStack.push("api","pcb.Firewall.setUPnPIGD","1",this,{Enable:this.fields.initialParameters.isUpnpRulesEnabled})}else{if(aStep==="1"){this.fields.nbStep+=1;if(aResult.status!==0&&aResult.status!==true){this.fields.mxStep=-1;this.fields.status=-1;callStack.logMessage("SEM_SYN_ERROR")}}else{console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if(this.fields.status===0&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}}}});