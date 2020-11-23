define(["utils/console","utils/basics","lib/stateCtrlInterface"],function(console,basicUtilities,StateCtrlClass){"use strict";function NetworkFirewallIPv6CtrlClass(aStateId,aStateManager,aSahObj,aViewObj){var fields,onViewEvent=function(aEventId,aData){if(aEventId==="ViewUpdated"){console.debug("NetworkFirewallIPv6CtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else if(aEventId==="ViewCancelled"){console.debug("NetworkFirewallIPv6CtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));if(aData.aData!==undefined){this.deleteRule(aData.aData)}else{this.goToMain()}}else if(aEventId==="ViewSubmitted"){console.debug("NetworkFirewallIPv6CtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));this.addRule(aData.aData)}else{console.warn("NetworkFirewallIPv6CtrlClass: Unexpected event '"+aEventId+"'")}};fields={};StateCtrlClass.call(this,aStateId,aStateManager,aSahObj,aViewObj);this.init=function(aCallback){console.debug("NetworkFirewallIPv6CtrlClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().subscribeEvents(this.getId(),onViewEvent.bind(this));this.getViewObj().init(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.quit=function(aCallback){console.debug("NetworkFirewallIPv6CtrlClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().quit(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.enable=function(aCallback){console.debug("NetworkFirewallIPv6CtrlClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().enable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){this.getRulesList(aNext)}else{basicUtilities.callback(aNext,false,-1,null)}},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.disable=function(aCallback){console.debug("NetworkFirewallIPv6CtrlClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().disable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.getRulesList=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.HomeNetwork.Firewall.CustomRulesIPv6.listRules",aNext,null)},function(aNext,aResult){var rulesList;if(!aResult||aResult.status===0){rulesList=aResult.data.ruleList;if(rulesList.length>0){console.debug(rulesList);this.getViewObj().displayInfo(rulesList)}basicUtilities.callback(aCallback,false,0,null)}else{this.getViewObj().notifyError("NetworkFirewallIPv6CtrlClass: Failed to get rules list ","yke0001");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.addRule=function(aData,aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.HomeNetwork.Firewall.CustomRulesIPv6.addRule",aNext,aData)},function(aNext,aResult){if(!aResult||aResult.status===0){this.getRulesList(aCallback)}else{this.getViewObj().notifyError("NetworkFirewallIPv6CtrlClass: Failed to add this rule ","yke0002");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.deleteRule=function(aData,aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.HomeNetwork.Firewall.CustomRulesIPv6.deleteRule",aNext,aData)},function(aNext,aResult){if(!aResult||aResult.status===0){this.getRulesList(aCallback)}else{this.getViewObj().notifyError("NetworkFirewallIPv6CtrlClass: Failed to delete this rule ","yke0003");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.goToMain=function(){console.debug("GO TO MAIN");aStateManager.switchState(null,"NetworkFirewall",null)}}return NetworkFirewallIPv6CtrlClass});