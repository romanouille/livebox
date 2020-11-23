define(["utils/console","utils/basics","lib/stateCtrlInterface"],function(console,basicUtilities,StateCtrlClass){"use strict";function Step3DefaultCtrlClass(aStateId,aStateManager,aSahObj,aViewObj){var fields,setLanguage=function(aCallback,aLangId){basicUtilities.queue([function(aNext){fields.sahObj.invokeApi("semantic","sah.Device.Information.setLanguage",aNext,[{languageId:aLangId}])},function(aNext,aResult){if(aResult.status!==0){console.error("Step3DefaultCtrlClass: Failed to update default language")}basicUtilities.callback(null,false,0,null)}],this)},onViewEvent=function(aEventId,aData){if(aEventId==="ViewUpdated"){console.debug("Step3DefaultCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));if(aData&&aData.langId){setLanguage.call(this,null,aData.langId)}}else if(aEventId==="ViewCancelled"){console.debug("Step3DefaultCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else if(aEventId==="ViewSubmitted"){console.debug("Step3DefaultCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else{console.warn("Step3DefaultCtrlClass: Unexpected event '"+aEventId+"'")}};fields={sahObj:aSahObj};StateCtrlClass.call(this,aStateId,aStateManager,aSahObj,aViewObj);this.init=function(aCallback){console.debug("Step3DefaultCtrlClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().subscribeEvents(this.getId(),onViewEvent.bind(this));this.getViewObj().init(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.quit=function(aCallback){console.debug("Step3DefaultCtrlClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().quit(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.enable=function(aCallback){console.debug("Step3DefaultCtrlClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().enable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.disable=function(aCallback){console.debug("Step3DefaultCtrlClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().disable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)}}return Step3DefaultCtrlClass});