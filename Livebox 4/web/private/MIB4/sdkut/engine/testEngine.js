define(["engine/callStack"],function(callStack){"use strict";return{Init:function(aTestObj,aResult,aMoreParams){aTestObj.fields={};aTestObj.fields.uuid=aResult.uuid;aTestObj.fields.status=0;aTestObj.fields.nbStep=0;aTestObj.fields.mxStep=0;var elt;for(elt in aMoreParams){if(aMoreParams.hasOwnProperty(elt)){aTestObj.fields[elt]=aMoreParams[elt]}}},Step:function(){arguments[0].fields.mxStep+=1;if(arguments.length>4){callStack.push.apply(arguments[0],Array.prototype.concat([arguments[2],arguments[3],arguments[1],arguments[0]],Array.prototype.slice.call(arguments,4)))}else{callStack.push(arguments[2],arguments[3],arguments[1],arguments[0])}},Check:function(aTestObj,aResult,aError,aErrMsg){var undef;if(aResult===undef){aTestObj.fields.nbStep+=1;return true}if(aResult.status!==0){aTestObj.fields.mxStep=-1;aTestObj.fields.status=-1;if(aError){callStack.logMessage(aError,aErrMsg)}return false}else{aTestObj.fields.nbStep+=1;return true}},Fail:function(aTestObj,aError,aErrMsg){aTestObj.fields.mxStep=-1;aTestObj.fields.status=-1;if(aError){if(aTestObj.stackId&&aTestObj.fields.uuid){callStack.logErrorMessage(aError,aErrMsg,aTestObj.stackId,aTestObj.fields.uuid)}else{callStack.logMessage(aError,aErrMsg)}}},Jump:function(aTestObj,aNextStep,aTimeout){aTestObj.fields.mxStep+=1;callStack.reCall(aTestObj,aNextStep,aTimeout)},End:function(aTestObj,aType){if(aTestObj.fields.nbStep>=aTestObj.fields.mxStep){var result={status:aTestObj.fields.status};if(aTestObj.fields.data){result.data=aTestObj.fields.data}callStack.popAll(aType,result,aTestObj.fields.uuid)}}}});