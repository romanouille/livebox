define(["utils/console","utils/basics","lib/stateCtrlInterface"],function(console,basicUtilities,StateCtrlClass){"use strict";function SystemInformationinternetCtrlClass(aStateId,aStateManager,aSahObj,aViewObj){var fields,globalResult,onViewEvent=function(aEventId,aData){if(aEventId==="ViewUpdated"){console.debug("SystemInformationinternetCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else if(aEventId==="ViewCancelled"){console.debug("SystemInformationinternetCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));this.quit()}else if(aEventId==="ViewSubmitted"){console.debug("SystemInformationinternetCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));if(aData.state==="General"){window.location.hash="#General"}else if(aData.state==="DSL"){window.location.hash="#DSL"}else if(aData.state==="FTTH"){window.location.hash="#FTTH"}else if(aData.state==="Internet"){window.location.hash="#Internet"}else if(aData.state==="Wifi"){window.location.hash="#Wifi"}else if(aData.state==="LAN"){window.location.hash="#LAN"}else if(aData.state==="voIP"){window.location.hash="#voIP"}else if(aData.state==="USB"){window.location.hash="#USB"}else if(aData.state==="TV"){window.location.hash="#TV"}}else{console.warn("SystemInformationinternetCtrlClass: Unexpected event '"+aEventId+"'")}};fields={};globalResult={};StateCtrlClass.call(this,aStateId,aStateManager,aSahObj,aViewObj);this.init=function(aCallback){console.debug("SystemInformationinternetCtrlClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().subscribeEvents(this.getId(),onViewEvent.bind(this));this.getViewObj().init(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.quit=function(aCallback){console.debug("SystemInformationinternetCtrlClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().quit(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.enable=function(aCallback){console.debug("SystemInformationinternetCtrlClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().enable(aNext);this.getInternetStatus()},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.disable=function(aCallback){console.debug("SystemInformationinternetCtrlClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().disable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.getInternetStatus=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Client.Wan.getStatus",aNext,null)},function(aNext,aResult){if(!aResult||aResult.status===0){globalResult.wanStatus=aResult.data;this.callSahApi("sah.Connection.Client.Wan.getStatistics",aNext,null)}else{this.getViewObj().notifyError("SystemInformationinternetCtrlClass:  failed to get wan status","yke0001");basicUtilities.callback(aCallback,false,0,null)}},function(aNext,aResult){if(!aResult||aResult.status===0){globalResult.statistics=aResult.data;this.callSahApi("sah.Connection.Client.getConnectionState",aNext,null)}else{this.getViewObj().notifyError("failed to get wan status","yke0002");basicUtilities.callback(aCallback,false,0,null)}},function(aNext,aResult){if(!aResult||aResult.status===0){globalResult.connectionState=aResult.data;this.callSahApi("sah.Connection.Client.getCurrentConfiguration",aNext,null)}else{this.getViewObj().notifyError("SystemInformationinternetCtrlClass: failed to get connection state","yke0003");basicUtilities.callback(aCallback,false,0,null)}},function(aNext,aResult){if(!aResult||aResult.status===0){globalResult.currentConfiguration=aResult.data;basicUtilities.callback(aCallback,false,0,null)}else{this.getViewObj().notifyError("SystemInformationinternetCtrlClass: failed to get current configuration","yke0004");basicUtilities.callback(aCallback,false,-1,null)}this.getViewObj().displayInternetInfo(globalResult)}],this)}}return SystemInformationinternetCtrlClass});