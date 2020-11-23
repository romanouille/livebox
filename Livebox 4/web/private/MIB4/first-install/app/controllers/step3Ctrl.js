define(["utils/console","utils/basics","lib/stateCtrlInterface"],function(console,basicUtilities,StateCtrlClass){"use strict";function Step3CtrlClass(aStateId,aStateManager,aSahObj,aViewObj){var fields,setLanguage=function(aCallback,aLangId){basicUtilities.queue([function(aNext){fields.sahObj.invokeApi("semantic","sah.Device.Information.setLanguage",aNext,[{languageId:aLangId}])},function(aNext,aResult){if(aResult.status!==0){console.error("Step3CtrlClass: Failed to update default language")}basicUtilities.callback(null,false,0,null)}],this)},onViewEvent=function(aEventId,aData){if(aEventId==="ViewUpdated"){console.debug("Step3CtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));if(aData&&aData.langId){setLanguage.call(this,null,aData.langId)}}else if(aEventId==="ViewCancelled"){console.debug("Step3CtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else if(aEventId==="ViewSubmitted"){console.debug("Step3CtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));if(aData.optionSelected==="0"){aStateManager.switchState(null,"step3Cloud",null)}else if(aData.optionSelected==="1"){aStateManager.switchState(null,"step3Local",null)}else{this.goToHomePage()}}else{console.warn("Step3CtrlClass: Unexpected event '"+aEventId+"'");this.getViewObj().notifyError("Step3CtrlClass: Unexpected event '"+aEventId+"'","rra0136")}};fields={sahObj:aSahObj};StateCtrlClass.call(this,aStateId,aStateManager,aSahObj,aViewObj);this.init=function(aCallback){console.debug("Step3CtrlClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().subscribeEvents(this.getId(),onViewEvent.bind(this));this.getViewObj().init(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("Step3CtrlClass: Initialising state '"+this.getId()+"'","rra0137")}}],this)};this.quit=function(aCallback){console.debug("Step3CtrlClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().quit(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("Step3CtrlClass: Releasing state '"+this.getId()+"'","rra0138")}}],this)};this.enable=function(aCallback){console.debug("Step3CtrlClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().enable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){this.getNetworkConfig(aNext)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("Step3CtrlClass: Enabling state '"+this.getId()+"'","rra0139")}},function(aNext,aResult){if(!aResult||aResult.status===0){this.getViewObj().selectRestoreMode(aResult.data);basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("Step3CtrlClass: Enabling state '"+this.getId()+"'","rra0139")}}],this)};this.disable=function(aCallback){console.debug("Step3CtrlClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().disable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("Step3CtrlClass: Disabling state '"+this.getId()+"'","rra0140")}}],this)};this.goToHomePage=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.Installation.setInstallationState",aNext,{isInstallationRequired:false,isFirstConnectionRequired:true})},function(aNext,aResult){if(aResult.status===0||aResult.status){this.goToMhs()}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("Step3CtrlClass: Internal error setInstallationState failed","rra0141")}}],this)};this.getNetworkConfig=function(aCallback){console.debug("Step3CtrlClass: getNetworkConfig ");basicUtilities.queue([function(aNext){this.callSahApi("sah.Device.System.getBackupAndRestoreNetworkState",aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,aResult.status,aResult.data)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("Step3CtrlClass: getBackupAndRestoreNetworkState failed","rra0142")}}],this)}}return Step3CtrlClass});