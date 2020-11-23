define(["utils/console","utils/basics","lib/stateCtrlInterface"],function(console,basicUtilities,StateCtrlClass){"use strict";function SystemInformationTVCtrlClass(aStateId,aStateManager,aSahObj,aViewObj){var fields,globalResult,onViewEvent=function(aEventId,aData){if(aEventId==="ViewUpdated"){console.debug("SystemInformationTVCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else if(aEventId==="ViewCancelled"){console.debug("SystemInformationTVCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));this.quit()}else if(aEventId==="ViewSubmitted"){console.debug("SystemInformationTVCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));if(aData.state==="General"){window.location.hash="#General"}else if(aData.state==="DSL"){window.location.hash="#DSL"}else if(aData.state==="FTTH"){window.location.hash="#FTTH"}else if(aData.state==="Internet"){window.location.hash="#Internet"}else if(aData.state==="Wifi"){window.location.hash="#Wifi"}else if(aData.state==="LAN"){window.location.hash="#LAN"}else if(aData.state==="voIP"){window.location.hash="#voIP"}else if(aData.state==="USB"){window.location.hash="#USB"}else if(aData.state==="TV"){window.location.hash="#TV"}}else{console.warn("SystemInformationTVCtrlClass: Unexpected event '"+aEventId+"'")}};fields={};globalResult={};StateCtrlClass.call(this,aStateId,aStateManager,aSahObj,aViewObj);this.init=function(aCallback){console.debug("SystemInformationTVCtrlClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().subscribeEvents(this.getId(),onViewEvent.bind(this));this.getViewObj().init(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.quit=function(aCallback){console.debug("SystemInformationTVCtrlClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().quit(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.enable=function(aCallback){console.debug("SystemInformationTVCtrlClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().enable(aNext);this.getTVStatus()},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.disable=function(aCallback){console.debug("SystemInformationTVCtrlClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().disable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.getTVStatus=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.Device.Tv.getServiceState",aNext,null)},function(aNext,aResult){if(!aResult||aResult.status===0){globalResult.tvServiceState=aResult.data;this.getViewObj().displayTVInfo(globalResult)}else{this.getViewObj().notifyError("SystemInformationTVCtrlClass: failed to get tv service state","yke0001");basicUtilities.callback(aCallback,false,-1,null)}}],this)}}return SystemInformationTVCtrlClass});