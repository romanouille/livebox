define(["utils/console","utils/basics","lib/stateCtrlInterface"],function(console,basicUtilities,StateCtrlClass){"use strict";function SystemBackupCtrlClass(aStateId,aStateManager,aSahObj,aViewObj){var fields,onViewEvent=function(aEventId,aData){if(aEventId==="ViewSubmitted"){console.debug("SystemBackupCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));if(aData.state==="local_backup"){this.backupLocal()}else if(aData.state==="enableNetworkBR"){basicUtilities.queue([function(aNext){this.enableNetworkBR(aData.enable,aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){if(aData.enable){this.backupNetwork(true,aNext)}else{aNext()}}else{console.error("SystemBackupCtrlClass: Internal error")}},function(aNext,aResult){if(!aResult||aResult.status===0){this.getNetworkConfig(aNext)}else{console.error("SystemBackupCtrlClass: Internal error")}},function(aNext,aResult){if(!aResult||aResult.status===0){this.getViewObj().displayBackupAndRestoreState(aResult.data)}else{console.error("SystemBackupCtrlClass: Internal error")}basicUtilities.callback(aNext,false,0,null)}],this)}else if(aData.state==="restore"){this.restore(aData.inputFileId);this.getViewObj().displayPopupRestore()}else if(aData.state==="reboot"){basicUtilities.queue([function(aNext){this.pingSahApi(aNext)},function(aNext){this.goToHomePage(aNext)},function(aNext,aResult){if(aResult.status===0||aResult.status){basicUtilities.callback(aNext,false,0,null)}else{basicUtilities.callback(aNext,false,-1,null)}}],this)}}else{console.warn("SystemBackupCtrlClass: Unexpected event '"+aEventId+"'");this.getViewObj().notifyError("SystemBackupCtrlClass: Unexpected event '"+aEventId+"'","rra0105")}};fields={};StateCtrlClass.call(this,aStateId,aStateManager,aSahObj,aViewObj);this.init=function(aCallback){console.debug("SystemBackupCtrlClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().subscribeEvents(this.getId(),onViewEvent.bind(this));this.getViewObj().init(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("SystemBackupCtrlClass: Initialising state '"+this.getId()+"'","rra0106")}}],this)};this.quit=function(aCallback){console.debug("SystemBackupCtrlClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().quit(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("SystemBackupCtrlClass: Releasing state '"+this.getId()+"'","rra0107")}}],this)};this.enable=function(aCallback){console.debug("SystemBackupCtrlClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){aNext()},function(aNext,aResult){if(!aResult||aResult.status===0){this.getViewObj().enable(aNext)}else{console.error("SystemBackupCtrlClass: Internal error")}},function(aNext){this.getNetworkConfig(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){this.getViewObj().displayBackupAndRestoreState(aResult.data)}else{console.error("SystemBackupCtrlClass: Internal error")}aNext()},function(){basicUtilities.callback(aCallback,false,0,null)}],this)};this.disable=function(aCallback){console.debug("SystemBackupCtrlClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().disable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("SystemBackupCtrlClass: Disabling state '"+this.getId()+"'","rra0108")}}],this)};this.restore=function(inputFileId){console.debug("SystemBackupCtrlClass: restore width inputFileId '"+inputFileId+"'");basicUtilities.queue([function(aNext){this.callSahApi("sah.Device.System.restoreLocal",aNext,{fileInputId:inputFileId})},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(null,false,0,null)}else{basicUtilities.callback(null,false,-1,null);this.getViewObj().notifyError("SystemBackupCtrlClass: restore width inputFileId '"+inputFileId+"'","rra0109")}}],this)};this.backupLocal=function(){console.debug("SystemBackupCtrlClass: backupLocal ");basicUtilities.queue([function(aNext){this.callSahApi("sah.Device.System.backupLocal",aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(null,false,0,null)}else{basicUtilities.callback(null,false,-1,null);this.getViewObj().notifyError("SystemBackupCtrlClass: backupLocal failed","rra0110")}}],this)};this.backupNetwork=function(activate,aCallback){console.debug("SystemBackupCtrlClass: backupNetwork ");basicUtilities.queue([function(aNext){this.callSahApi("sah.Device.System.backupNetwork",aNext,{activate:activate})},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("SystemBackupCtrlClass: backupNetwork failed","rra0110")}}],this)};this.enableNetworkBR=function(state,aCallback){console.debug("SystemBackupCtrlClass: enable Network BR ");basicUtilities.queue([function(aNext){this.callSahApi("sah.Device.System.enableNetworkBR",aNext,{state:state})},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("SystemBackupCtrlClass: enableNetworkBR failed","rra0110")}}],this)};this.getNetworkConfig=function(aCallback){console.debug("SystemBackupCtrlClass: getNetworkConfig ");basicUtilities.queue([function(aNext){this.callSahApi("sah.Device.System.getBackupAndRestoreNetworkState",aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,aResult.status,aResult.data)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("SystemBackupCtrlClass: getBackupAndRestoreNetworkState failed","rra0110")}}],this)};this.goToHomePage=function(aCallback){this.goToMhs();basicUtilities.callback(aCallback,false,0,null)}}return SystemBackupCtrlClass});