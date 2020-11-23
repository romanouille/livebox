define(["utils/console","utils/basics","lib/stateCtrlInterface"],function(console,basicUtilities,StateCtrlClass){"use strict";function HubAppMobileCtrlClass(aStateId,aStateManager,aSahObj,aViewObj){var fields,onViewEvent=function(aEventId,aData){if(aEventId==="ViewSubmitted"){console.debug("HubAppMobileCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));if(aData.state==="hubAppCumputer"){window.location.hash="#hubAppCumputer"}else if(aData.state==="hubAppMobile"){window.location.hash="#hubAppMobile"}}else{console.warn("HubAppMobileCtrlClass: Unexpected event '"+aEventId+"'");this.getViewObj().notifyError("HubAppMobileCtrlClass: Unexpected event '"+aEventId+"'","rra0023")}};fields={};StateCtrlClass.call(this,aStateId,aStateManager,aSahObj,aViewObj);this.init=function(aCallback){console.debug("HubAppMobileCtrlClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().subscribeEvents(this.getId(),onViewEvent.bind(this));this.getViewObj().init(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("HubAppMobileCtrlClass init failed","rra0024")}}],this)};this.quit=function(aCallback){console.debug("HubAppMobileCtrlClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().quit(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("HubAppMobileCtrlClass quit failed","rra0025")}}],this)};this.enable=function(aCallback){console.debug("HubAppMobileCtrlClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().enable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("HubAppMobileCtrlClass getSoftwareVersion failed","rra0028")}}],this)};this.disable=function(aCallback){console.debug("HubAppMobileCtrlClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().disable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("HubAppMobileCtrlClass view disable failed","rra0029")}}],this)}}return HubAppMobileCtrlClass});