define(["utils/console","utils/basics","lib/stateCtrlInterface"],function(console,basicUtilities,StateCtrlClass){"use strict";function WifiAdvancedHotspotCtrlClass(aStateId,aStateManager,aSahObj,aViewObj){var fields={currentData:{getHotspot:{}}},onViewEvent=function(aEventId,aData){if(aEventId==="ViewUpdated"){console.debug("WifiAdvancedGuestCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else if(aEventId==="ViewCancelled"){console.debug("WifiAdvancedGuestCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else if(aEventId==="ViewSubmitted"){console.debug("WifiAdvancedGuestCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else{console.warn("WifiAdvancedGuestCtrlClass: Unexpected event '"+aEventId+"'")}};StateCtrlClass.call(this,aStateId,aStateManager,aSahObj,aViewObj);this.init=function(aCallback){console.debug("WifiAdvancedHotspotCtrlClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().subscribeEvents(this.getId(),onViewEvent.bind(this));this.getViewObj().init(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedHotspotCtrlClass: Failed to init","aba0186")}}],this)};this.quit=function(aCallback){console.debug("FakeFirstCtrlClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().quit(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedHotspotCtrlClass: Failed to quit","aba0187")}}],this)};this.enable=function(aCallback){console.debug("WifiAdvancedHotspotCtrlClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getHotspot(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){this.getViewObj().fields.currentData=fields.currentData;aNext()}else{console.error("WifiAdvancedGuestCtrlClass: Internal error");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedHotspotCtrlClass: Failed to get hotspot status","aba0188")}},function(aNext){this.getViewObj().enable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){aViewObj.setToggleOnOff(null,"wifi_toggle",aResult.isActivated);aViewObj.setToggleOnOff(null,"wifi_scheduler_toggle",aResult.useSchedule);basicUtilities.callback(aNext,false,0,null)}else{basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedHotspotCtrlClass: Failed to enable view","aba0189")}},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedHotspotCtrlClass: Failed to set toggles in view","aba0190")}}],this)};this.disable=function(aCallback){console.debug("WifiAdvancedHotspotCtrlClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().disable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedHotspotCtrlClass: Failed to disable view","aba0191")}}],this)};this.getHotspot=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.getHotSpotState",aNext,null)},function(aNext,aResult){if(aResult.status===0){fields.currentData.getHotspot=aResult.data;basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("WifiAdvancedSummaryCtrlClass: Failed to retrieve hotspot state");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedHotspotCtrlClass: Failed to retrieve hotspot state","aba0192")}}],this)}}return WifiAdvancedHotspotCtrlClass});