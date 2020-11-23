define(["utils/console","utils/basics","engine/callStack"],function(console,basicUtilities,callStack){"use strict";return{getCapabilities:{name:"getCapabilities",description:"Returns the exhaustive list of all connections supported by the device",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{supportedLinkModeList:[],hasPnp:false}},call:function(aStep,aResult){var result,supportedList,supportedMode,i,existLinkMode,indexLinkMode,existSuppLinkMode,indexSuppLinkMode;if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;this.fields.data={supportedLinkModeList:[],hasPnp:false};this.fields.mxStep+=1;if(callStack.isOnHgw()){callStack.push("api","pcb.NetMaster.getWANModeList","2",this,{})}else if(callStack.hasCapability("hasConnectionManager")){callStack.push("api","com.softathome.ConnectionManager.Client.Common.GetCapabilities","1",this)}else{this.fields.data.supportedLinkModeList.push({linkMode:"ETHERNET",supportedLinkTypeList:["ETHERNET_DHCP"]});this.fields.nbStep=1}}else{this.fields.nbStep+=1;switch(aStep){case"1":if(aResult.status===0){supportedList=[];for(i=0;i<aResult.data.supported_link_types_list.length;i+=1){switch(aResult.data.supported_link_types_list[i].toUpperCase()){case"ETHERNET":this.fields.data.supportedLinkModeList.push({linkMode:"ETHERNET",supportedLinkTypeList:["ETHERNET_DHCP"]});break;case"WIFI":this.fields.data.supportedLinkModeList.push({linkMode:"WIFI",supportedLinkTypeList:["WIFI_2.4","WIFI_5"]});break;default:console.warn("GetCapabilities: only implemented on STB")}}}else{this.fields.mxStep=-1;this.fields.status=-1;callStack.logMessage("SEM_SYN_ERROR")}break;case"2":if(aResult.status===0||aResult.status===true){this.fields.supportedLinkModeList=aResult.data.split(";");this.fields.mxStep+=1;callStack.reCall(this,"3",0)}else{this.fields.status=-1;this.fields.mxStep=-1;callStack.logMessage("SEM_SYN_ERROR")}break;case"3":if(this.fields.supportedLinkModeList.length>0){this.fields.mode=this.fields.supportedLinkModeList.pop();this.fields.mxStep+=1;callStack.push("api","pcb.NetMaster.getInterfaceConfig","4",this,{name:this.fields.mode})}break;case"4":if(aResult.status===0||aResult.status===true){if(aResult.data.PhysicalInterface==="ADSL"){aResult.data.PhysicalInterface="DSL"}supportedMode={linkMode:"",supportedLinkTypeList:[]};supportedMode.linkMode=aResult.data.PhysicalInterface.toUpperCase();supportedMode.supportedLinkTypeList.push(aResult.data.PhysicalInterface.toUpperCase()+"_"+aResult.data.data.Mode.toUpperCase());existLinkMode=false;for(indexLinkMode=0;indexLinkMode<this.fields.data.supportedLinkModeList.length;indexLinkMode+=1){if(supportedMode.linkMode===this.fields.data.supportedLinkModeList[indexLinkMode].linkMode){existLinkMode=true;existSuppLinkMode=false;for(indexSuppLinkMode=0;indexSuppLinkMode<this.fields.data.supportedLinkModeList.length;indexSuppLinkMode+=1){if(supportedMode.supportedLinkTypeList[0]===this.fields.data.supportedLinkModeList[indexLinkMode].supportedLinkTypeList[indexSuppLinkMode]){existSuppLinkMode=true}}if(!existSuppLinkMode){this.fields.data.supportedLinkModeList[indexLinkMode].supportedLinkTypeList.push(supportedMode.supportedLinkTypeList[0])}}}if(!existLinkMode){this.fields.data.supportedLinkModeList.push(supportedMode)}this.fields.mxStep+=1;callStack.reCall(this,"3",0)}else{this.fields.status=-1;this.fields.mxStep=-1;callStack.logMessage("SEM_SYN_ERROR")}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if(this.fields.status===0&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}},getConnectionState:{name:"Gets client connection state",description:"This method returns the client connection state.",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{linkModeList:[]},filter:null},call:function(aStep,aResult){var result,activeConnection,anotherActiveConnection;if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;this.fields.mxStep+=1;this.fields.data={};this.fields.data={linkModeList:[]};if(aResult.inputList&&aResult.inputList[0]){this.fields.filter=aResult.inputList[0]}if(callStack.isOnHgw()){callStack.push("api","pcb.NMC.getWANStatus","1",this,{})}else if(callStack.hasCapability("hasConnectionManager")){callStack.push("api","com.softathome.ConnectionManager.Client.Common.GetConnectionState","1",this)}else{callStack.push("api","com.softathome.Network.Common.GetEthernetStatus","2",this)}}else{this.fields.nbStep+=1;switch(aStep){case"1":if((aResult.status===0||aResult.status===true)&&aResult.data){activeConnection={};activeConnection.linkMode=callStack.isOnHgw()?aResult.data.LinkType.toUpperCase():aResult.data.link_type.toUpperCase();if(this.fields.filter&&this.fields.filter.linkModeList&&this.fields.filter.linkModeList.indexOf(activeConnection.linkMode)<0){break}if(callStack.isOnHgw()){activeConnection.linkType=(aResult.data.LinkType+"_"+aResult.data.Protocol).toUpperCase();if(aResult.data.LinkState!=="up"||aResult.data.ConnectionState==="Disconnected"){activeConnection.state="ERROR";activeConnection.stateIpv4="ERROR";activeConnection.stateIpv6="ERROR"}else if(aResult.data.ConnectionState==="Bound"||aResult.data.ConnectionState==="Connected"){activeConnection.state="OK";if(aResult.data.IPAddress&&aResult.data.IPAddress!==""&&aResult.data.IPAddress!=="0.0.0.0"){activeConnection.stateIpv4="OK"}else{activeConnection.stateIpv4="ERROR"}if(aResult.data.IPv6DelegatedPrefix&&aResult.data.IPv6DelegatedPrefix!==""){activeConnection.stateIpv6="OK"}else{activeConnection.stateIpv6="ERROR"}}else if(aResult.data.ConnectionState==="Connecting"||aResult.data.ConnectionState==="Selecting"){activeConnection.state="CONNECTING";activeConnection.stateIpv4="CONNECTING";activeConnection.stateIpv6="CONNECTING"}else{console.warn("Unexpected connection state '"+aResult.data.ConnectionState+"'");activeConnection.state="CONNECTING";activeConnection.stateIpv4="CONNECTING";activeConnection.stateIpv6="CONNECTING"}activeConnection.lastError=aResult.data.LastConnectionError}else{if(activeConnection.linkMode==="ETHERNET"){activeConnection.linkType="ETHERNET_DHCP"}else{activeConnection.linkType="WIFI_2.4"}activeConnection.state=aResult.data.state;activeConnection.stateIpv4="";activeConnection.stateIpv6="";activeConnection.lastError=aResult.data.lastError}this.fields.data.linkModeList.push(activeConnection);if(activeConnection.linkMode==="WIFI"){anotherActiveConnection=basicUtilities.cloneObj(activeConnection);anotherActiveConnection.linkType="WIFI_5";this.fields.data.linkModeList.push(anotherActiveConnection)}}else{this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}break;case"2":activeConnection={};console.info("CLIENT RETURN: "+JSON.stringify(aResult));if(aResult.status===0){activeConnection.linkMode="ETHERNET";activeConnection.linkType="ETHERNET_DHCP";if(aResult.data.result[0]==="LINK"){activeConnection.state="OK";activeConnection.lastError="NONE"}else{activeConnection.state="ERROR";activeConnection.lastError="ETHERNET_ERROR"}this.fields.data.linkModeList.push(activeConnection)}else{this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if(this.fields.status===0&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}},getCurrentConfiguration:{name:"Gets client connection configuration",description:"This method returns the client connection configuration.",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{linkModeList:[]},filter:null},call:function(aStep,aResult){var result,activeConnection,ind,indexDnsIPv4=0,indexDnsIPv6=0,dnsServersList,anotherActiveConnection;if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.data={linkModeList:[]};this.fields.nbStep=0;this.fields.mxStep=0;if(aResult.inputList&&aResult.inputList[0]){this.fields.filter=aResult.inputList[0]}this.fields.mxStep+=1;if(callStack.isOnHgw()){callStack.push("api","pcb.NMC.getWANStatus","1",this,{})}else if(!callStack.hasCapability("hasConnectionManager")){callStack.push("semantic","sah.Device.Network.getConfiguration","2",this)}else{callStack.push("api","com.softathome.ConnectionManager.Client.Common.GetConfiguration","1",this)}}else{this.fields.nbStep+=1;switch(aStep){case"1":if((aResult.status===0||aResult.status===true)&&aResult.data){activeConnection={};activeConnection.linkMode=callStack.isOnHgw()?aResult.data.LinkType.toUpperCase():aResult.data.link_type.toUpperCase();if(this.fields.filter&&this.fields.filter.linkModeList.indexOf(activeConnection.linkMode)<0){break}if(callStack.isOnHgw()){activeConnection.linkType=(aResult.data.LinkType+"_"+aResult.data.Protocol).toUpperCase();activeConnection.macAddress=aResult.data.MACAddress;if(aResult.data.LinkState.toLowerCase()==="up"){activeConnection.ipIpv4=aResult.data.IPAddress;activeConnection.maskIpv4="";activeConnection.gatewayIpv4=aResult.data.RemoteGateway;activeConnection.dnsPrimaryIpv4="";activeConnection.dnsSecondaryIpv4="";activeConnection.ipIpv6=aResult.data.IPv6Address;activeConnection.maskIpv6="";activeConnection.gatewayIpv6=aResult.data.IPv6DelegatedPrefix;activeConnection.dnsPrimaryIpv6="";activeConnection.dnsSecondaryIpv6="";dnsServersList=aResult.data.DNSServers.split(",");for(ind=0;ind<dnsServersList.length;ind+=1){if(indexDnsIPv4===0&&dnsServersList[ind].split(":").length<=1){activeConnection.dnsPrimaryIpv4=dnsServersList[ind];indexDnsIPv4+=1}else if(indexDnsIPv4===1&&dnsServersList[ind].split(":").length<=1){activeConnection.dnsSecondaryIpv4=dnsServersList[ind]}else if(indexDnsIPv6===0&&dnsServersList[ind].split(":").length>1){activeConnection.dnsPrimaryIpv6=dnsServersList[ind];indexDnsIPv6+=1}else if(indexDnsIPv6===1&&dnsServersList[ind].split(":").length>1){activeConnection.dnsSecondaryIpv6=dnsServersList[ind]}}}else{activeConnection.ipIpv4="";activeConnection.maskIpv4="";activeConnection.gatewayIpv4="";activeConnection.dnsPrimaryIpv4="";activeConnection.dnsSecondaryIpv4="";activeConnection.ipIpv6="";activeConnection.maskIpv6="";activeConnection.gatewayIpv6="";activeConnection.dnsPrimaryIpv6="";activeConnection.dnsSecondaryIpv6=""}}else{if(activeConnection.linkMode==="ETHERNET"){activeConnection.linkType="ETHERNET_DHCP"}else if(activeConnection.linkMode==="WIFI"){activeConnection.linkType="WIFI_2.4"}activeConnection.macAddress=aResult.data.hwaddr;activeConnection.ipIpv4=aResult.data.ipv4.ip_address;activeConnection.maskIpv4=aResult.data.ipv4.subnet_mask;activeConnection.gatewayIpv4=aResult.data.ipv4.gateway_address;activeConnection.dnsPrimaryIpv4="";activeConnection.dnsSecondaryIpv4="";activeConnection.ipIpv6="";activeConnection.maskIpv6="";activeConnection.gatewayIpv6="";activeConnection.dnsPrimaryIpv6="";activeConnection.dnsSecondaryIpv6="";dnsServersList=aResult.data.dns_list;for(ind=0;ind<dnsServersList.length;ind+=1){if(ind===1){activeConnection.dnsPrimaryIpv4=dnsServersList[ind]}else if(ind===2){activeConnection.dnsSecondaryIpv4=dnsServersList[ind]}}}this.fields.data.linkModeList.push(activeConnection);if(activeConnection.linkMode==="WIFI"){anotherActiveConnection=basicUtilities.cloneObj(activeConnection);anotherActiveConnection.linkType="WIFI_5";this.fields.data.linkModeList.push(anotherActiveConnection)}}else{this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}break;case"2":if(aResult.status!==0){this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}break;case"3":if((aResult.status===0||aResult.status===true)&&aResult.data){this.fields.data.linkModeList[0].maskIpv4=aResult.data.Netmask}else{callStack.logMessage("SEM_VALUE_WORK","Ignoring issue when retrieving network mask")}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if(this.fields.status===0&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}},getStatistics:{name:"getStatistics",description:"Returns statistics of all active connections",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{linkModeList:[]},filter:null,connection:{}},call:function(aStep,aResult){var result,activeConnection,anotherActiveConnection;if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;this.fields.linkState="down";if(aResult.inputList&&aResult.inputList[0]){this.fields.filter=aResult.inputList[0]}this.fields.mxStep+=1;if(callStack.isOnHgw()){callStack.push("api","pcb.NMC.getWANStatus","2",this,{})}else{callStack.push("api","com.softathome.ConnectionManager.Client.Common.GetStatistics","1",this)}}else{this.fields.nbStep+=1;switch(aStep){case"1":if(aResult.status===0){activeConnection={};activeConnection.linkMode=aResult.data.link_type.toUpperCase();if(this.fields.filter&&this.fields.filter.linkModeList.indexOf(activeConnection.linkMode)<0){break}if(activeConnection.linkMode==="ETHERNET"){activeConnection.linkType="ETHERNET_DHCP"}else{activeConnection.linkType="WIFI_2.4"}activeConnection.connectionDuration=aResult.data.connection_duration;activeConnection.signalStrength=aResult.data.signal_strength;activeConnection.noiseLevel=aResult.data.noise_level;activeConnection.bytesSent=aResult.data.bytes_sent;activeConnection.packetsSent=aResult.data.packets_sent;activeConnection.packetsSentDiscarded=aResult.data.packets_sent_discarded;activeConnection.bytesReceived=aResult.data.bytes_received;activeConnection.packetsReceived=aResult.data.packets_received;activeConnection.packetsReceivedDiscarded=aResult.data.packets_received_discarded;this.fields.data.linkModeList.push(activeConnection);if(activeConnection.linkMode==="WIFI"){anotherActiveConnection=basicUtilities.cloneObj(activeConnection);anotherActiveConnection.linkType="WIFI_5";this.fields.data.linkModeList.push(anotherActiveConnection)}}else{this.fields.mxStep=-1;this.fields.status=-1;callStack.logMessage("SEM_SYN_ERROR")}break;case"2":if(aResult.status===0||aResult.status===true){this.fields.connection.linkMode=aResult.data.LinkType.toUpperCase();this.fields.connection.linkType=aResult.data.LinkType.toUpperCase()+"_"+aResult.data.Protocol.toUpperCase();if(this.fields.filter&&this.fields.filter.linkModeList.indexOf(this.fields.connection.linkMode)<0){break}if(this.fields.connection.linkMode==="DSL"||this.fields.connection.linkMode==="VDSL"){this.fields.mxStep+=1;callStack.push("api","pcb.NeMo.getMIBs","3",this,"data",{mibs:"dsl"})}else if(this.fields.connection.linkMode==="ETHERNET"){this.fields.mxStep+=1;callStack.push("api","pcb.DeviceManager.getDeviceInfo","4",this)}else{this.fields.mxStep=-1;this.fields.status=-1;callStack.logMessage("SEM_SYN_ERROR")}}else{this.fields.mxStep=-1;this.fields.status=-1;callStack.logMessage("SEM_SYN_ERROR")}break;case"3":if(aResult.status===0||aResult.status===true){if(aResult.data.dsl.dsl0.LinkStatus.toLowerCase()!=="up"){this.fields.connection.connectionDuration=0}else{this.fields.connection.connectionDuration=aResult.data.dsl.dsl0.LastChange}this.fields.connection.signalStrength=aResult.data.dsl.dsl0.UpstreamPower;this.fields.connection.noiseLevel=aResult.data.dsl.dsl0.DownstreamNoiseMargin;this.fields.connection.bytesSent=aResult.data.dsl.dsl0.UpstreamCurrRate;this.fields.connection.packetsSent=aResult.data.dsl.dsl0.UpstreamMaxRate;this.fields.connection.packetsSentDiscarded=aResult.data.dsl.dsl0.UpstreamAttenuation;this.fields.connection.bytesReceived=aResult.data.dsl.dsl0.DownstreamCurrRate;this.fields.connection.packetsReceived=aResult.data.dsl.dsl0.DownstreamMaxRate;this.fields.connection.packetsReceivedDiscarded=aResult.data.dsl.dsl0.DownstreamAttenuation;this.fields.data.linkModeList.push(this.fields.connection)}else{this.fields.mxStep=-1;this.fields.status=-1;callStack.logMessage("SEM_SYN_ERROR")}break;case"4":if(aResult.status===0||aResult.status===true){this.fields.connection.connectionDuration=aResult.data.UpTime;this.fields.connection.signalStrength=0;this.fields.connection.noiseLevel=0;this.fields.connection.bytesSent=0;this.fields.connection.packetsSent=0;this.fields.connection.packetsSentDiscarded=0;this.fields.connection.bytesReceived=0;this.fields.connection.packetsReceived=0;this.fields.connection.packetsReceivedDiscarded=0;this.fields.data.linkModeList.push(this.fields.connection)}else{this.fields.mxStep=-1;this.fields.status=-1;callStack.logMessage("SEM_SYN_ERROR")}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if(this.fields.status===0&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}},getWanTechnicianInfo:{name:"Returns WAN advanced configuration for technician",description:"This method returns an advanced description of current WAN configuration.",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{},initialParameters:{}},call:function(aStep,aResult){var result,aNmcList,aWanModeList,aWanModeUsed,aUserName,aPassword,aDialOnPlugLust,aWanDataList,currentWanMode,buffer,buffer2,key,subkey;if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;this.fields.mxStep+=1;callStack.push("api","pcb.NMC.get","1",this,{})}else{this.fields.nbStep+=1;switch(aStep){case"1":if(aResult.status===0||aResult.status===true){callStack.cache.set("NmcList",aResult.data);callStack.cache.set("WanModeList",aResult.data.WanModeList.split(";"));this.fields.mxStep+=1;callStack.push("api","pcb.NetMaster.getDialOnPlug","2",this,{})}else{this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}break;case"2":if(aResult.status===0||aResult.status===true){callStack.cache.set("DialOnPlugList",aResult.data);callStack.cache.set("WanDataList",{});this.fields.mxStep+=1;callStack.reCall(this,"3",0)}else{this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}break;case"3":if(callStack.cache.get("WanModeList").length>0){this.fields.mxStep+=1;callStack.push("api","pcb.NetMaster.getInterfaceConfig","4",this,{name:callStack.cache.get("WanModeList")[0]})}else{this.fields.mxStep+=1;callStack.reCall(this,"5",0)}break;case"4":if(aResult.status===0||aResult.status===true){buffer=callStack.cache.get("WanDataList");buffer2=callStack.cache.get("WanModeList");buffer[aResult.data.Name]=aResult.data;callStack.cache.set("WanDataList",buffer);buffer2.shift();callStack.cache.set("WanModeList",buffer2);this.fields.mxStep+=1;callStack.reCall(this,"3",0)}else{this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}break;case"5":aNmcList=callStack.cache.get("NmcList");aWanModeList=aNmcList.WanModeList.split(";");aWanModeUsed=aNmcList.WanMode;aUserName=aNmcList.Username;aPassword=aNmcList.Password;aDialOnPlugLust=callStack.cache.get("DialOnPlugList");aWanDataList=callStack.cache.get("WanDataList");this.fields.data.wanModeList=aWanModeList;this.fields.data.wanModeUsed=aWanModeUsed;this.fields.data.username=aUserName;this.fields.data.password=aPassword;this.fields.data.dialOnPlug={};this.fields.data.dialOnPlug.enable=aDialOnPlugLust.Enable;this.fields.data.dialOnPlug.globalIdleTimeout=aDialOnPlugLust.GlobalIdleTimeout;this.fields.data.dialOnPlug.enableGlobalTimeout=aDialOnPlugLust.EnableGlobalIdleTimeout;this.fields.data.wanModeData=[];for(key in aWanDataList){if(aWanDataList.hasOwnProperty(key)){currentWanMode={};for(subkey in aWanDataList[key]){if(aWanDataList[key].hasOwnProperty(subkey)){if(subkey.indexOf("Name")>-1){currentWanMode.name=aWanDataList[key][subkey]}else if(subkey.indexOf("PhysicalInterface")>-1){currentWanMode.physicalInterface=aWanDataList[key][subkey]}else{currentWanMode[subkey]={};if(aWanDataList[key][subkey].hasOwnProperty("VLANID")){currentWanMode[subkey].vlanId=aWanDataList[key][subkey].VLANID}if(aWanDataList[key][subkey].hasOwnProperty("VLANPriority")){currentWanMode[subkey].vlanPriority=aWanDataList[key][subkey].VLANPriority}if(aWanDataList[key][subkey].hasOwnProperty("IPVersion")){currentWanMode[subkey].ipVersion=aWanDataList[key][subkey].IPVersion}if(aWanDataList[key][subkey].hasOwnProperty("DialOnPlug")){currentWanMode[subkey].dialOnPlugEnable=aWanDataList[key][subkey].DialOnPlug}if(aWanDataList[key][subkey].hasOwnProperty("DialOnPlugIdleTimeout")){currentWanMode[subkey].dialOnPlugIdleTimeout=aWanDataList[key][subkey].DialOnPlugIdleTimeout}if(aWanDataList[key][subkey].hasOwnProperty("Mode")){currentWanMode[subkey].mode=aWanDataList[key][subkey].Mode}if(aWanDataList[key][subkey].hasOwnProperty("LowerInterface")){currentWanMode[subkey].lowerInterface=aWanDataList[key][subkey].LowerInterface}if(aWanDataList[key][subkey].hasOwnProperty("DestinationAddress")){currentWanMode[subkey].destinationAddress=aWanDataList[key][subkey].DestinationAddress}if(aWanDataList[key][subkey].hasOwnProperty("Encapsulation")){currentWanMode[subkey].encapsulation=aWanDataList[key][subkey].Encapsulation}if(aWanDataList[key][subkey].hasOwnProperty("QosClass")){currentWanMode[subkey].qosClass=aWanDataList[key][subkey].QosClass}if(aWanDataList[key][subkey].hasOwnProperty("PeakCellRate")){currentWanMode[subkey].peakCellRate=aWanDataList[key][subkey].PeakCellRate}if(aWanDataList[key][subkey].hasOwnProperty("MaximumBurstSize")){currentWanMode[subkey].maximumBurstSize=aWanDataList[key][subkey].MaximumBurstSize}if(aWanDataList[key][subkey].hasOwnProperty("SustainableCellRate")){currentWanMode[subkey].sustainableCellRate=aWanDataList[key][subkey].SustainableCellRate}}}}this.fields.data.wanModeData.push(currentWanMode)}}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if(this.fields.status===0&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}},setWanTechnicianInfo:{name:"Sets WAN advanced configuration for technician",description:"This method sets an advanced description of current WAN configuration.",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{},initialParameters:{}},call:function(aStep,aResult){var result,aSetWDIFlag,aSetWanModeObj,aSetWanModeObjChanged,aSetDialOnPlugObj,aSetDialOnPlugObjChanged,aSetInterfaceConfigObj,aCurrentSetInterfaceConfig,aSetInterfaceConfigObjChanged,ind,key,test,bufferList;if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;this.fields.mxStep+=1;this.fields.initialParameters=aResult.inputList[0];if(typeof this.fields.initialParameters!=="undefined"){aSetWDIFlag={};aSetWanModeObj={};aSetWanModeObjChanged=false;aSetDialOnPlugObj={};aSetDialOnPlugObjChanged=false;aSetInterfaceConfigObj=[];aCurrentSetInterfaceConfig={};aSetInterfaceConfigObjChanged=false;if(this.fields.initialParameters.hasOwnProperty("wanModeUsed")&&typeof this.fields.initialParameters.wanModeUsed==="string"){aSetWanModeObj.WanMode=this.fields.initialParameters.wanModeUsed;aSetWanModeObjChanged=true}if(this.fields.initialParameters.hasOwnProperty("username")&&typeof this.fields.initialParameters.username==="string"){aSetWanModeObj.Username=this.fields.initialParameters.username;aSetWanModeObjChanged=true}if(this.fields.initialParameters.hasOwnProperty("password")&&typeof this.fields.initialParameters.password==="string"){aSetWanModeObj.Password=this.fields.initialParameters.password;aSetWanModeObjChanged=true}if(aSetWanModeObjChanged===true){callStack.cache.set("aSetWanModeObj",aSetWanModeObj)}if(this.fields.initialParameters.hasOwnProperty("dialOnPlug")&&typeof this.fields.initialParameters.dialOnPlug==="object"){aSetDialOnPlugObjChanged=true;if(this.fields.initialParameters.dialOnPlug.hasOwnProperty("enable")&&typeof this.fields.initialParameters.dialOnPlug.enable==="boolean"){aSetDialOnPlugObj.Enable=this.fields.initialParameters.dialOnPlug.enable}if(this.fields.initialParameters.dialOnPlug.hasOwnProperty("globalIdleTimeout")&&typeof this.fields.initialParameters.dialOnPlug.globalIdleTimeout==="number"){aSetDialOnPlugObj.GlobalIdleTimeout=this.fields.initialParameters.dialOnPlug.globalIdleTimeout}if(this.fields.initialParameters.dialOnPlug.hasOwnProperty("enableGlobalTimeout")&&typeof this.fields.initialParameters.dialOnPlug.enableGlobalTimeout==="boolean"){aSetDialOnPlugObj.EnableGlobalIdleTimeout=this.fields.initialParameters.dialOnPlug.enableGlobalTimeout}}if(aSetDialOnPlugObjChanged){callStack.cache.set("aSetDialOnPlugObj",aSetDialOnPlugObj)}if(this.fields.initialParameters.hasOwnProperty("wanModeData")&&this.fields.initialParameters.wanModeData.length>0){aSetInterfaceConfigObjChanged=true;for(ind=0;ind<this.fields.initialParameters.wanModeData.length;ind+=1){aCurrentSetInterfaceConfig={};aCurrentSetInterfaceConfig.configs={};for(key in this.fields.initialParameters.wanModeData[ind]){if(this.fields.initialParameters.wanModeData[ind].hasOwnProperty(key)){if(key.indexOf("name")>-1&&typeof this.fields.initialParameters.wanModeData[ind][key]==="string"){aCurrentSetInterfaceConfig.name=this.fields.initialParameters.wanModeData[ind][key]}else if(key.indexOf("physicalInterface")>-1&&typeof this.fields.initialParameters.wanModeData[ind][key]==="string"){aCurrentSetInterfaceConfig.interfacetype=this.fields.initialParameters.wanModeData[ind][key]}else{aCurrentSetInterfaceConfig.configs[key]={};if(this.fields.initialParameters.wanModeData[ind][key].hasOwnProperty("lowerInterface")&&typeof this.fields.initialParameters.wanModeData[ind][key].lowerInterface==="string"){aCurrentSetInterfaceConfig.configs[key].LowerInterface=this.fields.initialParameters.wanModeData[ind][key].lowerInterface}if(this.fields.initialParameters.wanModeData[ind][key].hasOwnProperty("vlanId")&&typeof this.fields.initialParameters.wanModeData[ind][key].vlanId==="number"){aCurrentSetInterfaceConfig.configs[key].VLANID=this.fields.initialParameters.wanModeData[ind][key].vlanId}if(this.fields.initialParameters.wanModeData[ind][key].hasOwnProperty("vlanPriority")&&typeof this.fields.initialParameters.wanModeData[ind][key].vlanPriority==="number"){aCurrentSetInterfaceConfig.configs[key].VLANPriority=this.fields.initialParameters.wanModeData[ind][key].vlanPriority}if(this.fields.initialParameters.wanModeData[ind][key].hasOwnProperty("destinationAddress")&&typeof this.fields.initialParameters.wanModeData[ind][key].destinationAddress==="string"){aCurrentSetInterfaceConfig.configs[key].DestinationAddress=this.fields.initialParameters.wanModeData[ind][key].destinationAddress}if(this.fields.initialParameters.wanModeData[ind][key].hasOwnProperty("encapsulation")&&typeof this.fields.initialParameters.wanModeData[ind][key].encapsulation==="string"){aCurrentSetInterfaceConfig.configs[key].Encapsulation=this.fields.initialParameters.wanModeData[ind][key].encapsulation}if(this.fields.initialParameters.wanModeData[ind][key].hasOwnProperty("qosClass")&&typeof this.fields.initialParameters.wanModeData[ind][key].qosClass==="string"){aCurrentSetInterfaceConfig.configs[key].QosClass=this.fields.initialParameters.wanModeData[ind][key].qosClass}if(this.fields.initialParameters.wanModeData[ind][key].hasOwnProperty("peakCellRate")&&typeof this.fields.initialParameters.wanModeData[ind][key].peakCellRate==="number"){aCurrentSetInterfaceConfig.configs[key].PeakCellRate=this.fields.initialParameters.wanModeData[ind][key].peakCellRate}if(this.fields.initialParameters.wanModeData[ind][key].hasOwnProperty("sustainableCellRate")&&typeof this.fields.initialParameters.wanModeData[ind][key].encapsulation==="number"){aCurrentSetInterfaceConfig.configs[key].SustainableCellRate=this.fields.initialParameters.wanModeData[ind][key].sustainableCellRate}if(this.fields.initialParameters.wanModeData[ind][key].hasOwnProperty("maximumBurstSize")&&typeof this.fields.initialParameters.wanModeData[ind][key].maximumBurstSize==="number"){aCurrentSetInterfaceConfig.configs[key].MaximumBurstSize=this.fields.initialParameters.wanModeData[ind][key].maximumBurstSize}if(this.fields.initialParameters.wanModeData[ind][key].hasOwnProperty("ipVersion")&&typeof this.fields.initialParameters.wanModeData[ind][key].ipVersion==="number"){aCurrentSetInterfaceConfig.configs[key].IPVersion=this.fields.initialParameters.wanModeData[ind][key].ipVersion}if(this.fields.initialParameters.wanModeData[ind][key].hasOwnProperty("dialOnPlugEnable")&&typeof this.fields.initialParameters.wanModeData[ind][key].dialOnPlugEnable==="boolean"){aCurrentSetInterfaceConfig.configs[key].DialOnPlug=this.fields.initialParameters.wanModeData[ind][key].dialOnPlugEnable}if(this.fields.initialParameters.wanModeData[ind][key].hasOwnProperty("dialOnPlugIdleTimeout")&&typeof this.fields.initialParameters.wanModeData[ind][key].dialOnPlugIdleTimeout==="number"){aCurrentSetInterfaceConfig.configs[key].DialOnPlugIdleTimeout=this.fields.initialParameters.wanModeData[ind][key].dialOnPlugIdleTimeout}if(this.fields.initialParameters.wanModeData[ind][key].hasOwnProperty("mode")&&typeof this.fields.initialParameters.wanModeData[ind][key].mode==="string"){aCurrentSetInterfaceConfig.configs[key].Mode=this.fields.initialParameters.wanModeData[ind][key].mode}}}}aSetInterfaceConfigObj.push(aCurrentSetInterfaceConfig)}}if(aSetInterfaceConfigObjChanged){callStack.cache.set("aSetInterfaceConfigObj",aSetInterfaceConfigObj)}callStack.cache.set("aSetWDIFlag",{aSetWanModeObjChanged:aSetWanModeObjChanged,aSetDialOnPlugObjChanged:aSetDialOnPlugObjChanged,aSetInterfaceConfigObjChanged:aSetInterfaceConfigObjChanged});callStack.reCall(this,"1",0)}else{this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}}else{this.fields.nbStep+=1;switch(aStep){case"1":test=callStack.cache.get("aSetWDIFlag");this.fields.mxStep+=1;if(test.aSetWanModeObjChanged){callStack.push("api","pcb.NMC.setWANMode","2",this,callStack.cache.get("aSetWanModeObj"))}else{callStack.reCall(this,"3",0)}break;case"2":if(aResult.status===0||aResult.status===true){this.fields.mxStep+=1;callStack.reCall(this,"3",0)}else{this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}break;case"3":test=callStack.cache.get("aSetWDIFlag");this.fields.mxStep+=1;if(test.aSetDialOnPlugObjChanged){callStack.push("api","pcb.NetMaster.setDialOnPlug","4",this,callStack.cache.get("aSetDialOnPlugObj"))}else{callStack.reCall(this,"5",0)}break;case"4":if(aResult.status===0||aResult.status===true){this.fields.mxStep+=1;callStack.reCall(this,"5",0)}else{this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}break;case"5":test=callStack.cache.get("aSetWDIFlag");if(test.aSetInterfaceConfigObjChanged){if(callStack.cache.get("aSetInterfaceConfigObj").length>0){this.fields.mxStep+=1;callStack.push("api","pcb.NetMaster.setInterfaceConfig","6",this,callStack.cache.get("aSetInterfaceConfigObj")[0])}}break;case"6":if(aResult.status===0||aResult.status===true){bufferList=callStack.cache.get("aSetInterfaceConfigObj");bufferList.shift();callStack.cache.set("aSetInterfaceConfigObj",bufferList);this.fields.mxStep+=1;callStack.reCall(this,"5",0)}else{this.fields.status=-1;this.fields.mxStep=0;callStack.logMessage("SEM_SYN_ERROR")}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if(this.fields.status===0&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}}}});