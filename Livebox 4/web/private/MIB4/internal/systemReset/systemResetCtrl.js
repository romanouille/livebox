define(["utils/console","utils/basics","lib/stateCtrlInterface"],function(console,basicUtilities,StateCtrlClass){"use strict";function SystemResetCtrlClass(aStateId,aStateManager,aSahObj,aViewObj){var fields,onViewEvent=function(aEventId,aData){if(aEventId==="ViewUpdated"){console.debug("SystemResetCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else if(aEventId==="ViewCancelled"){console.debug("SystemResetCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));this.quit()}else if(aEventId==="ViewSubmitted"){console.debug("SystemResetCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));this.reset()}else{console.warn("SystemResetCtrlClass: Unexpected event '"+aEventId+"'")}};fields={};StateCtrlClass.call(this,aStateId,aStateManager,aSahObj,aViewObj);this.init=function(aCallback){console.debug("SystemResetCtrlClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().subscribeEvents(this.getId(),onViewEvent.bind(this));this.getViewObj().init(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.quit=function(aCallback){console.debug("SystemResetCtrlClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().quit(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.enable=function(aCallback){console.debug("SystemResetCtrlClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().enable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.disable=function(aCallback){console.debug("SystemResetCtrlClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().disable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.reset=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.Device.System.hardReset",aNext,null)},function(aNext,aResult){if(aResult.status===0){this.getViewObj().showSpinner(aNext)}else{this.getViewObj().notifyError("SystemResetCtrlClass: Failed to reset the box","yke0001");basicUtilities.callback(aCallback,false,-1,null)}},function(aNext){this.pingSahApi(aNext)},function(aNext){this.goToHomePage(aNext)},function(aNext,aResult){if(aResult.status===0||aResult.status){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.goToHomePage=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.Installation.setInstallationState",aNext,{isInstallationRequired:true,isFirstConnectionRequired:true})},function(aNext,aResult){if(aResult.status===0||aResult.status){this.goToMhs();basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)}}return SystemResetCtrlClass});