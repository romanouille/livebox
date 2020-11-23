define(["utils/console","engine/callStack"],function(console,callStack){"use strict";return{browse:{name:"Browses call available in the Call Log",description:"This method browses calls that are available in the Call Log.",fields:{uuid:null,nbStep:0,mxStep:0,indCall:0,callLogList:[],status:0,data:{}},call:function(aStep,aResult){var result,inputObj,listCall,indCall,callLogEntry,addressBook,contact,exist,indexAddressBook,indexTelephoneNumbers,capabilities;inputObj={uniqueID:""};if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.data={callLogList:[]};this.fields.nbStep=0;this.fields.mxStep=0;this.fields.indCall=0;this.fields.callLogList=[];this.fields.mxStep+=1;callStack.push("api","pcb.VoiceService.getCallList","1",this)}else{this.fields.nbStep+=1;switch(aStep){case"1":if(aResult.status===0||aResult.status===true){listCall=aResult.data;for(indCall=0;indCall<listCall.length;indCall+=1){callLogEntry={callLogId:"",date:"",duration:"",type:"",phoneNumber:"",line:"",device:"",hasBeenViewed:false,matchContact:false,contact:{}};callLogEntry.callLogId=listCall[indCall].callId;callLogEntry.date=listCall[indCall].startTime;callLogEntry.duration=listCall[indCall].duration;if(listCall[indCall].callType==="missed"){callLogEntry.type="missed"}else if(listCall[indCall].callDestination==="local"){callLogEntry.type="in"}else{callLogEntry.type="out"}callLogEntry.phoneNumber=listCall[indCall].remoteNumber;callLogEntry.line=listCall[indCall].trunkLineNumber;callLogEntry.device=listCall[indCall].terminal;callLogEntry.hasBeenViewed=listCall[indCall].viewed;callLogEntry.matchContact=listCall[indCall].remoteName;this.fields.callLogList[indCall]=callLogEntry}capabilities=callStack.getCapabilities();if(capabilities.hasPhoneBook){this.fields.mxStep+=1;callStack.push("api","pcb.Phonebook.getAllContacts","2",this)}}else{callStack.logMessage("SEM_SYN_ERROR");this.fields.status=-1;this.fields.mxStep=-1}break;case"2":if(aResult.status===0||aResult.status===true){addressBook=aResult.data;for(indCall=0;indCall<this.fields.callLogList.length;indCall+=1){contact={contactId:"",familyName:"",givenName:"",additionalNameList:[],honorificPrefixes:"",honorificSuffixes:"",formattedName:"",title:""};exist=false;indexAddressBook=0;while(!exist&&indexAddressBook<addressBook.length){indexTelephoneNumbers=0;while(indexTelephoneNumbers<addressBook[indexAddressBook].telephoneNumbers.length&&this.fields.callLogList[indCall].phoneNumber!==addressBook[indexAddressBook].telephoneNumbers[indexTelephoneNumbers].name){indexTelephoneNumbers+=1}if(indexTelephoneNumbers!==addressBook[indexAddressBook].telephoneNumbers.length){exist=true}else{indexAddressBook+=1}}if(exist){contact.contactId=addressBook[indexAddressBook].uniqueID;var name;if(addressBook[indexAddressBook].name){name=addressBook[indexAddressBook].name.split(":")[1];contact.givenName=name.split(";")[1];contact.familyName=name.split(";")[0]}else{name=addressBook[indexAddressBook].formattedName;contact.givenName=addressBook[indexAddressBook].formattedName;contact.familyName=""}contact.formattedName=addressBook[indexAddressBook].formattedName;contact.title=addressBook[indexAddressBook].title}this.fields.callLogList[indCall].contact=contact}}else{callStack.logMessage("SEM_SYN_ERROR");this.fields.status=-1;this.fields.mxStep=-1}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if((this.fields.status===0||this.fields.status===true)&&this.fields.data){result.data=this.fields.callLogList}callStack.popAll("api",result,this.fields.uuid)}}},setEntryViewedState:{name:"setEntryViewedState",description:"setEntryViewedState",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{}},call:function(aStep,aResult){var result,configObj;if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;configObj=aResult.inputList[0];this.fields.data=null;this.fields.mxStep+=1;callStack.push("api","pcb.VoiceService.setViewedCallList","1",this,{callId:configObj.callLogId,viewed:configObj.hasBeenViewed})}else{this.fields.nbStep+=1;switch(aStep){case"1":if(aResult.status!==0&&aResult.status!==true){this.fields.status=-1;this.fields.mxStep=-1;callStack.logMessage("SEM_SYN_ERROR")}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if(this.fields.status===0&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}},deleteEntry:{name:"Removes a call from the Call Log",description:"This method removes a call from the Call Log from the unique call identifier.",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{}},call:function(aStep,aResult){var result,inputObj={callId:""};if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;if(aResult.inputList[0]&&aResult.inputList[0].callLogId){this.fields.mxStep+=1;inputObj.callId=aResult.inputList[0].callLogId;callStack.push("api","pcb.VoiceService.clearCallList","1",this,inputObj)}else{callStack.logMessage("SEM_SYN_ERROR");this.fields.status=-1}}else{this.fields.nbStep+=1;switch(aStep){case"1":if(aResult.status!==0&&aResult.status!==true){callStack.logMessage("SEM_SYN_ERROR");this.fields.status=-1;this.fields.mxStep=-1}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};if((this.fields.status===0||this.fields.status===true)&&this.fields.data){result.data=this.fields.data}callStack.popAll("api",result,this.fields.uuid)}}},deleteAllEntries:{name:"Removes all calls from the Call Log",description:"This method removes all calls available in the Call Log.",fields:{uuid:null,nbStep:0,mxStep:0,status:0,data:{}},call:function(aStep,aResult){var result;if(aStep==="0"){this.fields.uuid=aResult.uuid;this.fields.status=0;this.fields.nbStep=0;this.fields.mxStep=0;this.fields.mxStep+=1;callStack.push("api","pcb.VoiceService.clearCallList","1",this)}else{this.fields.nbStep+=1;switch(aStep){case"1":if(aResult.status!==0&&aResult.status!==true){callStack.logMessage("SEM_SYN_ERROR");this.fields.status=-1;this.fields.mxStep=-1}break;default:console.warn("Unexpected step '"+aStep+"' in call stack");this.fields.nbStep-=1;break}}if(this.fields.nbStep>=this.fields.mxStep){result={status:this.fields.status};callStack.popAll("api",result,this.fields.uuid)}}}}});