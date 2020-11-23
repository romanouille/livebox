define(["utils/console","engine/callStack"],function(console,callStack){"use strict";return{activate:{name:"Activate and set remote access settings",description:"This method activate remote access and sets login, password and port for it",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{},initialParameters:{}},call:function(aStep,aResult){var result;if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;this.fields.mxStep+=1;this.fields.initialParameters=aResult.inputList[0];if(typeof this.fields.initialParameters.login==="string"&&typeof this.fields.initialParameters.password==="string"&&typeof this.fields.initialParameters.portNumber==="number"&&typeof this.fields.initialParameters.timeout==="number"){callStack.push("api","pcb.NMC.enableRemoteAccess","1",this,{username:this.fields.initialParameters.login,password:this.fields.initialParameters.password,port:this.fields.initialParameters.portNumber,timeout:this.fields.initialParameters.timeout})}else{this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}}else{this.fields.nbStep+=1;switch(aStep){case"1":if(aResult.status!==0&&aResult.status!==true){this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if(this.fields.status===0&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}},restartTimeout:{name:"restart remote access timer",description:"This method restart remote access timer",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{},initialParameters:{}},call:function(aStep,aResult){var result;if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;this.fields.mxStep+=1;callStack.push("api","pcb.RemoteAccess.restartTimer","1",this)}else{this.fields.nbStep+=1;switch(aStep){case"1":if(aResult.status!==0&&aResult.status!==true){this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if(this.fields.status===0&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}},deactivate:{name:"Deactivate remote access",description:"This method deactivates remote access",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{},initialParameters:{}},call:function(aStep,aResult){var result;if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;this.fields.mxStep+=1;callStack.push("api","pcb.NMC.disableRemoteAccess","1",this,{})}else{this.fields.nbStep+=1;switch(aStep){case"1":if(aResult.status!==0&&aResult.status!==true){this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if(this.fields.status===0&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}},getState:{name:"Return state of remote access",description:"This method returns the activation state of remote access and if activated url of access",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{},initialParameters:{},intermediateResult:{}},call:function(aStep,aResult){var result;if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;this.fields.mxStep+=1;this.fields.data={};this.fields.intermediateResult={};this.fields.intermediateResult.isActivated=false;callStack.push("api","pcb.RemoteAccess.get","1",this,{})}else{this.fields.nbStep+=1;switch(aStep){case"1":if(aResult.status===0||aResult.status===true){if(aResult.data){this.fields.mxStep+=1;this.fields.intermediateResult.isActivated=aResult.data.Enable;this.fields.intermediateResult.timeout=aResult.data.Timeout;this.fields.intermediateResult.timeLeft=aResult.data.TimeLeft;this.fields.intermediateResult.port=aResult.data.Port;this.fields.intermediateResult.protocol=aResult.data.Protocol?aResult.data.Protocol.toLowerCase():"http";if(aResult.data.Enable){this.fields.intermediateResult.remoteAccessPortNumber=aResult.data.Port;callStack.push("semantic","sah.Connection.Client.getCurrentConfiguration","2",this)}else{callStack.reCall(this,"4",0)}}else{this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}}else{this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}break;case"2":if(aResult.status===0||aResult.status===true){if(aResult.data){if(typeof aResult.data.linkModeList[0].ipIpv4==="string"){this.fields.mxStep+=1;this.fields.intermediateResult.remoteAccessAddress=aResult.data.linkModeList[0].ipIpv4;callStack.push("semantic","sah.Device.User.listUsers","3",this)}}}else{this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}break;case"3":if(aResult.status===0||aResult.status===true){var indexUser;for(indexUser=0;indexUser<aResult.data.userList.length;indexUser+=1){var userGroupParticipation=aResult.data.userList[indexUser].groupList.join(" ");if(userGroupParticipation.indexOf("remoteadmin")>=0){this.fields.intermediateResult.login=aResult.data.userList[indexUser].login}}this.fields.mxStep+=1;callStack.reCall(this,"4",0)}else{this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}break;case"4":this.fields.data.isActivated=this.fields.intermediateResult.isActivated;if(this.fields.intermediateResult.isActivated){this.fields.data.login=this.fields.intermediateResult.login;this.fields.data.url=this.fields.intermediateResult.protocol+"://"+this.fields.intermediateResult.remoteAccessAddress+":"+this.fields.intermediateResult.remoteAccessPortNumber;this.fields.data.ipIpv4=this.fields.intermediateResult.remoteAccessAddress;this.fields.data.port=this.fields.intermediateResult.port;this.fields.data.protocol=this.fields.intermediateResult.protocol;this.fields.data.timeout=this.fields.intermediateResult.timeout;this.fields.data.timeLeft=this.fields.intermediateResult.timeLeft}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if(this.fields.status===0&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}}}});