define(["utils/console","utils/basics","lib/stateCtrlInterface"],function(console,basicUtilities,StateCtrlClass){"use strict";function OrangePhoneCtrlClass(aStateId,aStateManager,aSahObj,aViewObj){var fields,onViewEvent=function(aEventId,aData){if(aEventId==="ViewUpdated"){console.debug("OrangePhoneCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else if(aEventId==="ViewCancelled"){console.debug("OrangePhoneCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else if(aEventId==="ViewSubmitted"){console.debug("OrangePhoneCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));this.switchState(null,"Second",null)}else{console.warn("OrangePhoneCtrlClass: Unexpected event '"+aEventId+"'")}};fields={};StateCtrlClass.call(this,aStateId,aStateManager,aSahObj,aViewObj);this.init=function(aCallback){console.debug("OrangePhoneCtrlClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().subscribeEvents(this.getId(),onViewEvent.bind(this));this.getViewObj().init(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("OrangePhoneCtrlClass: Initialising state '"+this.getId()+"'","rra0233")}}],this)};this.quit=function(aCallback){console.debug("OrangePhoneCtrlClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().quit(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("OrangePhoneCtrlClass: Releasing state '"+this.getId()+"'","rra0234")}}],this)};this.enable=function(aCallback){console.debug("OrangePhoneCtrlClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().enable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("OrangePhoneCtrlClass: Enabling state '"+this.getId()+"'","rra0235")}}],this)};this.disable=function(aCallback){console.debug("OrangePhoneCtrlClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().disable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("OrangePhoneCtrlClass: Disabling state '"+this.getId()+"'","rra0236")}}],this)}}return OrangePhoneCtrlClass});