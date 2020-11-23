define(["utils/console","engine/callStack"],function(console,callStack){"use strict";return{listRules:{name:"Lists Firewall custom rules",description:"This method returns the list of all Firewall custom rules.",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{}},call:function(aStep,aResult){var result,ruleItem={},aRule,listRules,item;if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.data={ruleList:[]};this.fields.nbStep=0;this.fields.mxStep=0;this.fields.mxStep+=1;callStack.push("api","pcb.Firewall.getCustomRule","1",this,{})}else{this.fields.nbStep+=1;switch(aStep){case"1":if(aResult.status===0||aResult.status===true){listRules=aResult.data;for(item in listRules){if(listRules.hasOwnProperty(item)){aRule=listRules[item];switch(aRule.Protocol){case"6":aRule.Protocol="tcp";break;case"6,17":aRule.Protocol="both";break;case"17":aRule.Protocol="udp";break;default:break}ruleItem={name:aRule.Id,isEnabled:aRule.Enable,protocol:aRule.Protocol,ipVersion:aRule.IPVersion,action:aRule.Target,externalIpAddress:aRule.SourcePrefix.indexOf("/")>0?aRule.SourcePrefix.split("/")[0]:aRule.SourcePrefix,externalMask:aRule.SourcePrefix.indexOf("/")>0?aRule.SourcePrefix.split("/")[1]:aRule.SourcePrefix,externalPortRange:aRule.SourcePort,internalIpAddress:aRule.DestinationPrefix.indexOf("/")>0?aRule.DestinationPrefix.split("/")[0]:aRule.DestinationPrefix,internalMask:aRule.DestinationPrefix.indexOf("/")>0?aRule.DestinationPrefix.split("/")[1]:aRule.DestinationPrefix,internalPortRange:aRule.DestinationPort};this.fields.data.ruleList.push(ruleItem)}}}else{callStack.logMessage("SEM_SYN_ERROR")}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if(this.fields.status===0&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}}},addRule:{name:"Adds a new Firewall custom rule",description:"This method adds a new Firewall custom rule.",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{}},call:function(aStep,aResult){var inputArg,inputObj,inputObjCustom_V6In,inputObjCustom_V6Out,result;if(aStep==="0"){this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;this.fields.uuid=aResult.uuid;inputArg=aResult.inputList[0];this.fields.inputArg=inputArg;console.log(aResult);if(Object.typeOf(inputArg.name)==="string"&&Object.typeOf(inputArg.isEnabled)==="boolean"&&Object.typeOf(inputArg.protocol)==="string"&&Object.typeOf(inputArg.ipVersion)==="string"&&Object.typeOf(inputArg.action)==="string"&&Object.typeOf(inputArg.externalIpAddress)==="string"&&Object.typeOf(inputArg.externalMask)==="string"&&Object.typeOf(inputArg.externalPortRange)==="string"&&Object.typeOf(inputArg.internalIpAddress)==="string"&&Object.typeOf(inputArg.internalMask)==="string"&&Object.typeOf(inputArg.internalPortRange)==="string"){if(inputArg.action.charAt(0)!==inputArg.action.charAt(0).toUpperCase()){inputArg.action=inputArg.action.charAt(0).toUpperCase()+inputArg.action.substring(1,inputArg.action.length)}if(inputArg.internalPortRange.indexOf("-")===-1){inputArg.internalPortRange=inputArg.internalPortRange+"-"+inputArg.internalPortRange}if(inputArg.externalPortRange.indexOf("-")===-1){inputArg.externalPortRange=inputArg.externalPortRange+"-"+inputArg.externalPortRange}switch(inputArg.protocol){case"tcp":inputArg.protocol="6";break;case"both":inputArg.protocol="6,17";break;case"udp":inputArg.protocol="17";break;default:break}inputObj={description:inputArg.name,enable:inputArg.isEnabled,protocol:inputArg.protocol,action:inputArg.action,destinationPort:inputArg.internalPortRange,destinationPrefix:inputArg.internalIpAddress+"/0",sourcePort:inputArg.externalPortRange,sourcePrefix:inputArg.externalIpAddress+"/0",ipversion:4,persistent:true,chain:"Custom",id:inputArg.name};if(inputArg.ipVersion==="6"){inputObjCustom_V6In={description:inputArg.name,enable:inputArg.isEnabled,protocol:inputArg.protocol,action:inputArg.action,destinationPort:inputArg.internalPortRange,destinationPrefix:inputArg.internalIpAddress+"/0",sourcePort:inputArg.externalPortRange,sourcePrefix:inputArg.externalIpAddress+"/0",ipversion:6,persistent:true,chain:"Custom_V6In",id:inputArg.name};inputObjCustom_V6Out={description:inputArg.name,enable:inputArg.isEnabled,protocol:inputArg.protocol,action:inputArg.action,destinationPort:inputArg.internalPortRange,destinationPrefix:inputArg.internalIpAddress+"/0",sourcePort:inputArg.externalPortRange,sourcePrefix:inputArg.externalIpAddress+"/0",ipversion:6,persistent:true,chain:"Custom_V6Out",id:inputArg.name};this.fields.mxStep+=1;callStack.push("api","pcb.Firewall.setCustomRule","1",this,inputObjCustom_V6In)}else{this.fields.mxStep+=1;callStack.push("api","pcb.Firewall.setCustomRule","3",this,inputObj)}}}else{this.fields.nbStep+=1;switch(aStep){case"1":this.fields.mxStep+=1;callStack.push("api","pcb.Firewall.setCustomRule","2",this,inputObjCustom_V6Out);break;case"2":this.fields.mxStep+=1;callStack.push("api","pcb.Firewall.setCustomRule","3",this,inputObj);break;case"3":if(aResult.status===this.fields.inputArg.name&&!aResult.errors){this.fields.mxStep+=1;callStack.push("api","pcb.Firewall.commit","4",this,{})}else{callStack.logMessage("SEM_SYN_ERROR");this.fields.status=-1;this.fields.mxStep=0}break;case"4":if(aResult.status!==0&&aResult.status!==true){callStack.logMessage("SEM_SYN_ERROR");this.fields.status=-1;this.fields.mxStep=0}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};callStack.popAll("api",result,this.fields.uuid)}}}},deleteRule:{name:"Deletes a Firewall custom rule",description:"This method deletes a Firewall custom rule.",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{}},call:function(aStep,aResult){var inputArg,inputObj,result;if(aStep==="0"){this.fields.nbStep=0;this.fields.mxStep=0;this.fields.status=0;this.fields.uuid=aResult.uuid;inputArg=aResult.inputList[0];if(Object.typeOf(inputArg.name)==="string"){this.fields.mxStep+=1;inputObj={id:inputArg.name,chain:"Custom"};callStack.push("api","pcb.Firewall.deleteCustomRule","1",this,inputObj)}}else{this.fields.nbStep+=1;switch(aStep){case"1":if(aResult.status!==0&&aResult.status!==true||aResult.errors){callStack.logMessage("SEM_SYN_ERROR");this.fields.status=-1;this.fields.mxStep=0}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};callStack.popAll("api",result,this.fields.uuid)}}}}}});