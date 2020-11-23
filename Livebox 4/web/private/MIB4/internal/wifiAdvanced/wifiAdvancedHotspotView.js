define(["utils/console","utils/basics","lib/eventHandler","lib/stateViewInterface","jquery","text","templates_app/template","text!bootstrap/bootstrap.css","json!app/config/wifiHotspotConfig.json","app/wifiAdvancedSharedView"],function(console,basicUtilities,EventHandlerClass,StateViewClass,$,Text,TemplateClass,Bootstrap,Config,SharedViewClass){"use strict";function WifiAdvancedHotspotViewClass(aStateId,aTranslateObj){this.fields={loggedUserBehaviour:{lastFocusedElt:[],lastClickedElt:[],lastRelevantElt:""},currentData:{}};StateViewClass.call(this,aStateId,aTranslateObj);this.init=function(aCallback){console.debug("WifiAdvancedHotspotViewClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){SharedViewClass.import(aNext,this)},function(aNext,aResult){if(!aResult||aResult.status===0){this.setStyle(aNext)}else{basicUtilities.callback(aNext,false,0,null);this.notifyError("WifiAdvancedHotspotViewClass: Failed to import shared view class","aba0193")}},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("WifiAdvancedHotspotViewClass: Failed to set style","aba0194")}}],this)};this.quit=function(aCallback){console.debug("WifiAdvancedHotspotViewClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.unsetStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("WifiAdvancedHotspotViewClass: Failed to unset style","aba0195")}}],this)};this.enable=function(aCallback){console.debug("WifiAdvancedHotspotViewClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){$(document).off("click","#app_close");$(document).off("keypress","#app_close");$(document).on("click","#app_close",function(event){event.preventDefault();window.location.hash="#summary"});$(document).on("keypress","#app_close",function(event){var keyCode=event.keyCode||event.which;if(keyCode===13){event.preventDefault();$("#app_close").trigger("click")}});basicUtilities.callback(aNext,false,0,null)},function(aNext,aResult){if(!aResult||aResult.status===0){this.viewDisplayPage(aNext)}else{basicUtilities.callback(aNext,false,0,null);this.notifyError("WifiAdvancedHotspotViewClass: Failed to set app close button","aba0196")}},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("WifiAdvancedHotspotViewClass: Failed to display view","aba0197")}}],this)};this.disable=function(aCallback){console.debug("WifiAdvancedHotspotViewClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.viewEmptyPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("WifiAdvancedHotspotViewClass: Failed to empty view","aba0198")}}],this)};this.viewDisplayPage=function(){basicUtilities.queue([function(aNext){this.fillTemplate(aNext,TemplateClass.template,Config)},function(aNext,aResult){if(!aResult||aResult.status===0){$(window.document.body).html(aResult.data);this.translate();aNext()}else{basicUtilities.callback(aNext,false,0,null);this.notifyError("WifiAdvancedHotspotViewClass: Failed to fill template with config data","aba0199")}},function(aNext){this.viewSetHotspotDisplay(aNext,this.fields.currentData.getHotspot.hostspotList);this.setPageTitle(null,$(".header-title").find("h1").html())}],this)};this.viewSetHotspotDisplay=function(aCallback,aData){var index,target="#wifi_accesspointhotspot_link",target2="#wifi_accesspointhotspot",displaySecured=false;if(window.location.hash.substr(1)==="securehotspot"){displaySecured=true}for(index=0;index<aData.length;index=index+1){if(aData[index].isSecured===displaySecured){$(target).closest(".row.txtandfield-row.no-margin").show();if(aData[index].hotSpotServiceState.toLowerCase()==="activated"&&aData[index].isWiFiActivatedOnHotSpot===true){$(target2).html("<span class='Translation orangetxt' data-translation='common.activated'></span>")}else if(aData[index].hotSpotServiceState.toLowerCase()==="activated"&&aData[index].isWiFiActivatedOnHotSpot===false){$(target2).html("<span class='Translation orangetxt' data-translation='common.wifioff'></span>")}else if(aData[index].hotSpotServiceState.toLowerCase()==="error"){$(target2).html("<span class='Translation orangetxt' data-translation='common.error'></span>")}else if(aData[index].hotSpotServiceState.toLowerCase()==="not eligible"){$(target2).html("<span class='Translation orangetxt' data-translation='common.noteligible'></span>")}else{$(target2).html("<span class='Translation orangetxt' data-translation='common.deactivated'></span>")}this.translate(target);this.translate(target2);$(".header-title").children("h1").html($(".header-title").children("h1").html()+this.escapeString("js",this.escapeString("html",aData[index].ssid)));break}}basicUtilities.callback(aCallback,false,0,null)}}return WifiAdvancedHotspotViewClass});