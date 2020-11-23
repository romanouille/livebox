define(["utils/console","engine/callStack"],function(console,callStack){"use strict";return{getConfiguration:{name:"Retrieves the current state of the DHCP server",description:"This method returns the current state of the DHCP server.",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{}},call:function(aStep,aResult){var result;if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.data={isDhcpEnabled:true,addressPrefix:"",addressGUA:""};this.fields.nbStep=0;this.fields.mxStep=0;this.fields.mxStep+=1;callStack.push("api","pcb.NMC.getWANStatus","1",this)}else{this.fields.nbStep+=1;switch(aStep){case"1":if(aResult.status===0||aResult.status===true){if(aResult.data.IPv6DelegatedPrefix&&aResult.data.IPv6DelegatedPrefix!==""){this.fields.data.addressPrefix=aResult.data.IPv6DelegatedPrefix}if(aResult.data.IPv6Address&&aResult.data.IPv6Address!==""){this.fields.data.addressGUA=aResult.data.IPv6Address}this.fields.mxStep+=1;callStack.push("api","pcb.DHCPv6.Server.getDHCPv6ServerStatus","2",this)}else{callStack.logMessage("SEM_SYN_ERROR");this.fields.status=-1;this.fields.mxStep=0}break;case"2":if(aResult.status===0||aResult.status===true){if(aResult.data){this.fields.data.isDhcpEnabled=false;if(aResult.data==="Enabled"){this.fields.data.isDhcpEnabled=true}else if(aResult.data==="Disabled"){this.fields.data.isDhcpEnabled=false}else if(aResult.data==="Error"){callStack.logMessage("SEM_INVALID_VALUE","DHCPv6 server status API returned an error.");this.fields.data.isDhcpEnabled=false}}}else{callStack.logMessage("SEM_SYN_ERROR");this.fields.status=-1;this.fields.mxStep=0}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if(this.fields.status===0&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}},setConfiguration:{name:"Updates the current state of the DHCP server",description:"This method sets the current state of the DHCP server.",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{}},call:function(aStep,aResult){var result,configObj;if(aStep==="0"){this.fields.uuid=aResult.uuid;configObj={enable:aResult.inputList[0].isDhcpEnabled};this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;if(Object.typeOf(configObj.enable)==="boolean"){this.fields.mxStep+=1;callStack.push("api","pcb.DHCPv6.Server.enableDHCPv6Server","1",this,configObj)}else{callStack.logMessage("SYN_BAD_ARGS","isDhcpEnabled parameter not recognized (must be a boolean)");this.fields.status=-1;this.fields.mxStep=0}}else{this.fields.nbStep+=1;if(aStep==="1"){if(aResult.status!==0&&aResult.status!==true){callStack.logMessage("SEM_SYN_ERROR");this.fields.status=-1;this.fields.mxStep=0}}else{console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};callStack.popAll("api",result,this.fields.uuid)}}}}});