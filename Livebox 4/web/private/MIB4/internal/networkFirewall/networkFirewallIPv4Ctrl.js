define(["utils/console","utils/basics","lib/stateCtrlInterface"],function(console,basicUtilities,StateCtrlClass){"use strict";function NetworkFirewallIPv4CtrlClass(aStateId,aStateManager,aSahObj,aViewObj){var fields,rulesList,IPv4Adress,regexRange,regexCutRange,regexIP,regexMASK,onViewEvent=function(aEventId,aData){if(aEventId==="ViewUpdated"){console.debug("NetworkFirewallIPv4CtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));this.addRule(aData.aData,null)}else if(aEventId==="ViewCancelled"){console.debug("NetworkFirewallIPv4CtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));if(aData.aData!==undefined){this.deleteRule(aData.aData,null)}else{this.goToMain()}}else if(aEventId==="ViewSubmitted"){console.debug("NetworkFirewallIPv4CtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));this.setCurrentState(aData.state)}else{console.warn("NetworkFirewallIPv4CtrlClass: Unexpected event '"+aEventId+"'")}};fields={privateClassA:new RegExp(/^10/),privateClassB:new RegExp(/^172.16/),privateClassC:new RegExp(/^192.168/),forbiddenAddress:new RegExp(/^192.168.128/)};IPv4Adress="";regexRange=new RegExp(/-/);regexCutRange=new RegExp(/([0-9]+)-([0-9]+)/);regexIP=new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);regexMASK=new RegExp(/^((128|192|224|240|248|252|254)\.0\.0\.0)|(255\.(((0|128|192|224|240|248|252|254)\.0\.0)|(255\.(((0|128|192|224|240|248|252|254)\.0)|255\.(0|128|192|224|240|248|252|254)))))$/);StateCtrlClass.call(this,aStateId,aStateManager,aSahObj,aViewObj);this.init=function(aCallback){console.debug("NetworkFirewallIPv4CtrlClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().subscribeEvents(this.getId(),onViewEvent.bind(this));this.getViewObj().init(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.quit=function(aCallback){console.debug("NetworkFirewallIPv4CtrlClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().quit(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.enable=function(aCallback){console.debug("NetworkFirewallIPv4CtrlClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().enable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){this.getRulesList(aNext)}else{basicUtilities.callback(aNext,false,-1,null)}},function(aNext,aResult){if(!aResult||aResult.status===0){this.getCurrentState(aNext)}else{basicUtilities.callback(aNext,false,-1,null)}},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.disable=function(aCallback){console.debug("NetworkFirewallIPv4CtrlClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().disable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.getRulesList=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.HomeNetwork.Firewall.CustomRules.listRules",aNext,{ipVersion:window.ipVersion})},function(aNext,aResult){if(!aResult||aResult.status===0){rulesList=aResult.data.ruleList;if(rulesList.length>0){this.getViewObj().displayInfo(rulesList)}basicUtilities.callback(aCallback,false,0,null)}else{this.getViewObj().notifyError("NetworkFirewallIPv4CtrlClass: Failed get rules list ","yke0001");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.addRule=function(aData,aCallback){var arrayExternal,minExternalRange,maxExternalRange,arrayInternal,minInternalRange,maxInternalRange;basicUtilities.queue([function(aNext){if(aData.name.length>0){this.getViewObj().displayApplicationError(true);if(regexIP.test(aData.externalIpAddress)&&!fields.forbiddenAddress.test(aData.externalIpAddress.substr(0,aData.externalIpAddress.lastIndexOf(".")))&&(fields.privateClassA.test(aData.externalIpAddress)||fields.privateClassB.test(aData.externalIpAddress)||fields.privateClassC.test(aData.externalIpAddress))){this.getViewObj().displayIpDestError(true);if(regexIP.test(aData.internalIpAddress)&&!fields.forbiddenAddress.test(aData.internalIpAddress.substr(0,aData.internalIpAddress.lastIndexOf(".")))&&(fields.privateClassA.test(aData.internalIpAddress)||fields.privateClassB.test(aData.internalIpAddress)||fields.privateClassC.test(aData.internalIpAddress))){this.getViewObj().displayIpSourceError(true);if(regexMASK.test(aData.externalMask)){this.getViewObj().displayMaskDestError(true);if(regexMASK.test(aData.internalMask)){this.getViewObj().displayMaskSourceError(true);if(regexRange.test(aData.externalPortRange)||regexRange.test(aData.internalPortRange)){arrayExternal=regexCutRange.exec(aData.externalPortRange);minExternalRange=arrayExternal===null?"":arrayExternal[1];maxExternalRange=arrayExternal===null?"":arrayExternal[2];arrayInternal=regexCutRange.exec(aData.internalPortRange);minInternalRange=arrayInternal===null?"":arrayInternal[1];maxInternalRange=arrayInternal===null?"":arrayInternal[2];if(minInternalRange<maxInternalRange&&minExternalRange<maxExternalRange){this.getViewObj().displayPortSourceError(true);this.getViewObj().displayPortDestError(true);if(minExternalRange>0&&minExternalRange<65535&&maxExternalRange>0&&maxExternalRange<65535){this.getViewObj().displayPortDestError(true);if(minInternalRange>0&&minInternalRange<65535&&maxInternalRange>0&&maxInternalRange<65535){this.getViewObj().displayPortSourceError(true);if(aData.externalPortRange===aData.internalPortRange){this.getViewObj().hidePopup();this.getViewObj().displayPortSourceError(true);this.getViewObj().displayPortDestError(true);this.callSahApi("sah.HomeNetwork.Firewall.CustomRules.addRule",aNext,aData)}else{this.getViewObj().displayPortSourceError(false);this.getViewObj().displayPortDestError(false);basicUtilities.callback(aNext,false,-1,null)}}else{this.getViewObj().displayPortSourceError(false);basicUtilities.callback(aNext,false,-1,null)}}else{this.getViewObj().displayPortDestError(false);basicUtilities.callback(aNext,false,-1,null)}}else{this.getViewObj().displayPortSourceError(false);this.getViewObj().displayPortDestError(false)}}else{if(aData.externalPortRange>0&&aData.externalPortRange<65535){this.getViewObj().displayPortDestError(true);if(aData.internalPortRange>0&&aData.internalPortRange<65535){this.getViewObj().hidePopup();this.getViewObj().displayPortSourceError(true);this.callSahApi("sah.HomeNetwork.Firewall.CustomRules.addRule",aNext,aData)}else{this.getViewObj().displayPortSourceError(false);basicUtilities.callback(aNext,false,-1,null)}}else{this.getViewObj().displayPortDestErrorss(false);basicUtilities.callback(aNext,false,-1,null)}}}else{this.getViewObj().displayMaskSourceError(false);basicUtilities.callback(aNext,false,-1,null)}}else{this.getViewObj().displayMaskDestError(false);basicUtilities.callback(aNext,false,-1,null)}}else{this.getViewObj().displayIpSourceError(false);basicUtilities.callback(aNext,false,-1,null)}}else{this.getViewObj().displayIpDestError(false);basicUtilities.callback(aNext,false,-1,null)}}else{this.getViewObj().displayApplicationError(false)}},function(aNext,aResult){if(!aResult||aResult.status===0){this.getRulesList(aCallback)}else{this.getViewObj().notifyError("NetworkFirewallIPv4CtrlClass: Failed to add new rules ","yke0002");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.deleteRule=function(aData,aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.HomeNetwork.Firewall.CustomRules.deleteRule",aNext,aData)},function(aNext,aResult){if(!aResult||aResult.status===0){this.getRulesList(aCallback)}else{this.getViewObj().notifyError("NetworkFirewallIPv4CtrlClass: Failed to delete this rule ","yke0003");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.getCurrentState=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.HomeNetwork.Firewall.Ping.getRespondToPingState",aNext,null)},function(aNext,aResult){if(!aResult||aResult.status===0){this.getViewObj().getPingState(aResult.data);basicUtilities.callback(aCallback,false,0,null)}else{this.getViewObj().notifyError("NetworkFirewallIPv4CtrlClass: Failed to get dmz state ","yke0004");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.setCurrentState=function(state,aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.HomeNetwork.Firewall.Ping.setRespondToPingState",aNext,{isEnabledIPv4:state,isEnabledIPv6:state})},function(aNext,aResult){if(!aResult||aResult.status===0){this.goToMain()}else{this.getViewObj().notifyError("NetworkFirewallIPv4CtrlClass: Failed to set ping state ","yke0005");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.goToMain=function(){aStateManager.switchState(null,"NetworkFirewall",null)}}return NetworkFirewallIPv4CtrlClass});