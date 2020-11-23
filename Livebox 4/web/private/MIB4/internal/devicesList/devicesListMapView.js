define(["utils/console","utils/basics","lib/eventHandler","lib/stateViewInterface","jquery","text","templates_app/template","text!bootstrap/bootstrap.css","json!app/config/devicesListMap.json","app/devicesListSharedView"],function(console,basicUtilities,EventHandlerClass,StateViewClass,$,Text,TemplateClass,Bootstrap,Config,SharedViewClass){"use strict";function DevicesListMapViewClass(aStateId,aTranslateObj){this.fields={currentData:{},container:"#mapper_container"};StateViewClass.call(this,aStateId,aTranslateObj);this.init=function(aCallback){console.debug("DevicesListMapViewClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){SharedViewClass.import(aNext,this)},function(aNext,aResult){if(!aResult||aResult.status===0){this.setStyle(aNext)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("DevicesListMapViewClass: Failed to import shared view class","aba0xxx")}},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("DevicesListMapViewClass: Failed to set style","aba0xxx")}}],this)};this.quit=function(aCallback){console.debug("DevicesListMapViewClass: Releasing state '"+this.getId()+"'");basicUtilities.callback(aCallback,false,0,null)};this.enable=function(aCallback){console.debug("DevicesListMapViewClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.viewDisplayPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){this.setAppCloseButton(aNext,"app_close")}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("DevicesListMapViewClass: Failed to set app close button","aba0157")}},function(aNext,aResult){if(!aResult||aResult.status===0){this.setPageTitle(null,$(".header-title").find("h1").find("span").html());basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("DevicesListMapViewClass: Failed to display view","aba0158")}}],this)};this.disable=function(aCallback){console.debug("DevicesListMapViewClass: Disabling state '"+this.getId()+"'");basicUtilities.callback(aCallback,false,0,null)};this.viewDisplayPage=function(aCallback){basicUtilities.queue([function(aNext){this.fillTemplate(aNext,TemplateClass.template,Config)},function(aNext,aResult){if(!aResult||aResult.status===0){$(window.document.body).html(aResult.data);$("#content_template_container").append("<div id='"+this.fields.container+"' class='mapper-container'></div>");$("#tab_devicelist").off().on("click",function(event){event.preventDefault();window.location.hash="#devicelist"});$("#tab_template_container").off().on("keydown",function(event){var keyCode=event.keyCode||event.which;if(keyCode===39){event.preventDefault();window.location.hash="#devicelist"}}.bind(this));aNext()}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("DevicesListMapViewClass: ","abaxxx")}},function(aNext,aResult){if(!aResult||aResult.status===0){this.createTree();aNext()}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("DevicesListMapViewClass: ","abaxxx")}},function(aNext,aResult){if(!aResult||aResult.status===0){this.translate();TemplateClass.enableHover();basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("DevicesListMapViewClass: ","abaxxx")}}],this)};this.createDeviceNode=function(targetKey,obj){var target=$("#node_"+this.jQueryEscape(targetKey)+"_devices_container"),iconStyle;switch(obj.deviceType){case"Console":iconStyle="node-device-icon-vgconsole";break;case"Homelibrary":iconStyle="node-device-icon-homelibrary";break;case"SetTopBox":iconStyle="node-device-icon-stb";break;case"Homepoint":iconStyle="node-device-icon-homepoint";break;case"Printer":iconStyle="node-device-icon-printer";break;case"Liveradio":iconStyle="node-device-icon-liveradio";break;case"HomeLive":iconStyle="node-device-icon-homelive";break;case"HomePoint":iconStyle="node-device-icon-homepoint";break;case"Squeezebox":iconStyle="node-device-icon-squeezebox";break;case"Sensorhome":iconStyle="node-device-icon-sensorhome";break;case"Disk":iconStyle="node-device-icon-storage";break;case"Phone":iconStyle="node-device-icon-phone-new";break;case"TV":iconStyle="node-device-icon-tv";break;case"Mobile":iconStyle="node-device-icon-mobile";break;case"Mobile_ios":iconStyle="node-device-icon-mobile-ios";break;case"Mobile_android":iconStyle="node-device-icon-mobile-android";break;case"Mobile_windows":iconStyle="node-device-icon-mobile-windows";break;case"Tablet":iconStyle="node-device-icon-tablet";break;case"Tablet_ios":iconStyle="node-device-icon-tablet-ios";break;case"Tablet_android":iconStyle="node-device-icon-tablet-android";break;case"Tablet-windows":iconStyle="node-device-icon-tablet-windows";break;case"Notebook":iconStyle="node-device-icon-notebook";break;case"Notebook_windows":iconStyle="node-device-icon-notebook-windows";break;case"Notebook_linux":iconStyle="node-device-icon-notebook-linux";break;case"Laptop":iconStyle="node-device-icon-laptop";break;case"Laptop_ios":iconStyle="node-device-icon-laptop-ios";break;case"Laptop_windows":iconStyle="node-device-icon-laptop-windows";break;case"Laptop_linux":iconStyle="node-device-icon-laptop-linux";break;case"Computer_ios":iconStyle="node-device-icon-computer-ios";break;case"Computer_linux":iconStyle="node-device-icon-computer-linux";break;case"Computer_windows":iconStyle="node-device-icon-computer-windows";break;case"Computer":iconStyle="node-device-icon-computer";break;default:iconStyle="node-device-icon-computer";break}target.append("<div id='node_"+obj.deviceId+"'class='node-device'><div class='node-device-link'></div><div class='node-device-round-box' tabindex='0'><div class='node-device-icon "+iconStyle+"'></div><div class='node-device-name'>"+this.shortenName(this.escapeString("js",this.escapeString("html",obj.deviceName)))+"</div></div></div>");$("#node_"+this.jQueryEscape(obj.deviceId)).find(".node-device-round-box").on("click",function(){window.location.hash="devicelist_"+obj.deviceId});$("#node_"+this.jQueryEscape(obj.deviceId)).find(".node-device-round-box").on("keypress",function(event){var keyCode=event.keyCode||event.which;if(keyCode===13){event.preventDefault();$(this).trigger("click")}})};this.createExtenderNode=function(targetKey,obj,deepness){var index,target=$("#node_"+this.jQueryEscape(targetKey)+"_extenders_container"),iconStyle;switch(obj.deviceType){case"Homeplug_extender":iconStyle="node-liveplug-icon-extender";break;case"HomePlug":iconStyle="node-liveplug-icon-solo";break;case"Homeplug_hd":iconStyle="node-liveplug-icon-solo";break;default:iconStyle="node-liveplug-icon-solo";break}target.append("<div id='node_"+obj.deviceId+"' class='node-extender' style='clear:left;'><div class='node-device-link'></div><div class='node-device-round-box' tabindex='0'><div class='node-device-icon "+iconStyle+"'></div><div class='node-device-name'>"+this.shortenName(this.escapeString("js",this.escapeString("html",obj.deviceName)))+"</div></div></div></div>");$("#node_"+this.jQueryEscape(obj.deviceId)).find(".node-device-round-box").on("click",function(){window.location.hash="devicelist_"+obj.deviceId});$("#node_"+this.jQueryEscape(obj.deviceId)).find(".node-device-round-box").on("keypress",function(event){var keyCode=event.keyCode||event.which;if(keyCode===13){event.preventDefault();$(this).trigger("click")}});if(obj.hasOwnProperty("children")){for(index=0;index<obj.children.length;index=index+1){if(obj.children[index].deviceType.toLowerCase().indexOf("portintf")>-1){target.append("<div class='node-link-852-thin-short' style='clear:left;'><div id='node_"+obj.children[index].deviceId+"_box' class='node-connection-box "+(obj.children[index].deviceType.toLowerCase().indexOf("portintf_cpl")>-1?"node-cpl-connection-box":"")+"' style='clear:left;'><span>"+this.escapeString("js",this.escapeString("html",obj.children[index].deviceName))+"</span></div><div id='node_"+obj.children[index].deviceId+"_bandwidth' class='node-bandwidth-container'><div class='node-bandwidth-upload'>1 Mb/s</div><div class='node-bandwidth-download'>10 Mb/s</div></div></div>");target.append("<div id='node_"+obj.children[index].deviceId+"_devices_container' class='node-devices-container "+(deepness>1?"":"deepness-"+(deepness+1).toString())+"'></div>");target.append("<div class='node-link-852-thin-short' style='clear:left;'></div>");target.append("<div id='node_"+obj.children[index].deviceId+"_extenders_container' class='node-extenders-container'></div>")}this.createNodes(obj.children[index].deviceId,obj.children[index].children,deepness+1)}}};this.createNodes=function(targetKey,obj,deepness){var index,currentObj,isLast,newdeepness;if(typeof obj==="undefined"||obj===null){return false}if(typeof deepness!=="number"){newdeepness=0;if($("#node_"+this.jQueryEscape(targetKey)+"_devices_container")){if($("#node_"+this.jQueryEscape(targetKey)+"_devices_container").hasClass("deepness-1")){newdeepness=1}else if($("#node_"+this.jQueryEscape(targetKey)+"_devices_container").hasClass("deepness-2")){newdeepness=2}else if($("#node_"+this.jQueryEscape(targetKey)+"_devices_container").hasClass("deepness-3")){newdeepness=3}else if($("#node_"+this.jQueryEscape(targetKey)+"_devices_container").hasClass("deepness-4")){newdeepness=4}}}else{newdeepness=deepness}for(index=0;index<obj.length;index=index+1){isLast=false;currentObj=obj[index];if(index+1===obj.length||obj.length===1){isLast=true}if(currentObj.deviceType.toLowerCase().indexOf("homeplug")>-1){this.createExtenderNode(targetKey,currentObj,newdeepness,isLast)}else{this.createDeviceNode(targetKey,currentObj,isLast)}}this.checkBranchToContainersDisplay()};this.removeDeviceNode=function(targetKey){$("#node_"+this.jQueryEscape(targetKey)).remove()};this.removeExtenderNode=function(targetKey){var target=$("#node_"+this.jQueryEscape(targetKey)),targetNext=target.next(),targetNextNext;while(targetNext.hasClass("node-link-852-thin-short")||targetNext.hasClass("node-devices-container")||targetNext.hasClass("node-extenders-container")){targetNextNext=targetNext.next();targetNext.remove();targetNext=targetNextNext}target.remove()};this.removeNode=function(targetKey){var target=$("#node_"+this.jQueryEscape(targetKey));if(target.hasClass("node-device")){this.removeDeviceNode(targetKey)}else if(target.hasClass("node-extender")){this.removeExtenderNode(targetKey)}this.checkBranchToContainersDisplay()};this.checkBranchToContainersDisplay=function(){var propagateBlue=function(a){if(a.hasClass("node-link-856-thick")){a.addClass("node-link-856-thick-blue")}else if(a.hasClass("node-link-856-thick-last")){a.addClass("node-link-856-thick-last-blue")}else if(a.hasClass("node-link-452-thick")){a.addClass("node-link-452-thick-blue")}else if(a.hasClass("node-link-856-thin-short")){a.addClass("node-link-856-thin-short-blue")}else if(a.hasClass("node-link-852-thin-short")){a.addClass("node-link-852-thin-short-blue")}else if(a.hasClass("node-devices-container")){a.addClass("node-devices-container-blue")}else if(a.hasClass("node-connection-container")){a.addClass("node-connection-container-blue")}else if(a.hasClass("node-device")){a.addClass("node-device-blue")}else if(a.hasClass("node-device-link")){a.addClass("node-device-link-blue")}else if(a.hasClass("node-firstlevel-extenders-container")){a.addClass("node-firstlevel-extenders-container-blue")}else if(a.hasClass("node-extender")){a.addClass("node-extender-blue")}if(a.children().length>0){var index;for(index=0;index<a.children().length;index=index+1){propagateBlue(a.children().eq(index))}}};$(document).find(".node-extenders-container, .node-devices-container, .node-firstlevel-extenders-container, .node-firstlevel-devices-container").each(function(){if($(this).children().length>0){if($(this).hasClass("node-extenders-container")&&$(this).prev().hasClass("node-link-852-thin-short")&&$(this).prev().prev().hasClass("node-devices-container")&&$(this).prev().prev().children().length===0&&$(this).prev().prev().prev().hasClass("node-link-852-thin-short")){$(this).prev().css("display","none");$(this).prev().prev().css("display","inline-block")}else if($(this).prev().hasClass("node-link-852-thin-short")&&($(this).hasClass("node-extenders-container")||$(this).hasClass("node-devices-container"))){$(this).prev().css("display","inline-block")}$(this).css("display","inline-block")}else{if($(this).prev().hasClass("node-link-852-thin-short")&&$(this).hasClass("node-extenders-container")){$(this).prev().css("display","none")}$(this).css("display","none")}if($(this).hasClass("node-firstlevel-extenders-container")||$(this).hasClass("node-extenders-container")){var containerSize=$(this).height();$(this).css("background-size","6.25em "+(containerSize/16-4)+"em")}});$(document).find(".node-cpl-connection-box").each(function(){$(this).parent(".node-device-link").addClass("node-device-link-blue");$(this).parent(".node-link-852-thin-short").addClass("node-link-852-thin-short-blue");$(this).parent().siblings(".node-devices-container, .node-extenders-container").each(function(){propagateBlue($(this))})})};this.createRoot=function(target){function makeRoot(aTarget,aKey,aTranslation){aTarget.append("<div id='node_"+aKey+"_container' class='node-root-container'><div id='node_"+aKey+"_box' class='node-root-box'><span data-translation='"+aTranslation+"' class='Translation'></span></div></div>")}function makeFirstLevelNode(aTarget,aKey,aType,aTranslation,aIsLast){$(aTarget).append("<div id='node_"+aKey+"_container' class='node-"+aType+"-container "+(aIsLast?"node-firstlevel-last":"")+"'><div class='node-link-856-thick "+(aIsLast?"node-link-856-thick-last":"")+"' style='clear:left;'></div><div class='node-link-452-thick'><div id='node_"+aKey+"_box' class='node-"+aType+"-box'><div data-translation='"+aTranslation+"' class='Translation'></div></div></div></div>")}function makeSecondLevelNode(aTarget,aKey,aTranslation,aHasExtender,aIsLast){$(aTarget).append("<div id='node_"+aKey+"_container' class='node-firstlevel-connection-container' style='clear:left;'><div class='node-link-852-thick-short' style='clear:left;'></div><div class='node-link-852-thin-short'><div id='node_"+aKey+"_box' class='node-connection-box'><span data-translation='"+aTranslation+"' class='Translation'></span></div><div id='node_"+aKey+"_bandwidth' class='node-bandwidth-container'><div class='node-bandwidth-upload'>1 Mb/s</div><div class='node-bandwidth-download'>10 Mb/s</div></div></div><div class='node-connection-container "+(aIsLast?"node-connection-container-last":"")+"'><div id='node_"+aKey+"_devices_container' class='node-firstlevel-devices-container'></div><div id='node_"+aKey+"_extenders_container' style='clear:left;' class='node-firstlevel-extenders-container'></div></div></div>")}var rootKey="livebox_root",rootTranslation="devicesList.map.nodes.livebox",wifiPrivateKey="livebox_wifiprivate",wifiPrivateType="wifiprivate",wifiPrivateTranslation="devicesList.map.nodes.wifiprivate",wifiPrivate24Key="livebox_wifiprivate_24",wifiPrivate24Translation="devicesList.map.nodes.24ghz",wifiPrivate5Key="livebox_wifiprivate_5",wifiPrivate5Translation="devicesList.map.nodes.5ghz",wifiGuestKey="livebox_wifiguest",wifiGuestType="wifiguest",wifiGuestTranslation="devicesList.map.nodes.wifiguest",wifiGuest24Key="livebox_wifiguest_24",wifiGuest24Translation="devicesList.map.nodes.24ghz",wifiGuest5Key="livebox_wifiguest_5",wifiGuest5Translation="devicesList.map.nodes.5ghz",wifiEthernetKey="livebox_ethernet",wifiEthernetType="ethernet",wifiEthernetTranslation="devicesList.map.nodes.ethernet",wifiEthernet1Key="livebox_ethernet_1",wifiEthernet1Translation="devicesList.map.nodes.eth1",wifiEthernet2Key="livebox_ethernet_2",wifiEthernet2Translation="devicesList.map.nodes.eth2",wifiEthernet3Key="livebox_ethernet_3",wifiEthernet3Translation="devicesList.map.nodes.eth3",wifiEthernet4Key="livebox_ethernet_4",wifiEthernet4Translation="devicesList.map.nodes.eth4",phoneKey="livebox_phone",phoneType="phone",phoneTranslation="devicesList.map.nodes.phone",phoneFxsKey="livebox_phonefxs",phoneFxsTranslation="devicesList.map.nodes.fxs",phoneDectKey="livebox_phonedect",phoneDectTranslation="devicesList.map.nodes.dect",usbKey="livebox_usb",usbType="usb",usbTranslation="devicesList.map.nodes.usb",usb1Key="livebox_usb_1",usb1Translation="devicesList.map.nodes.usb1",usb2Key="livebox_usb_2",usb2Translation="devicesList.map.nodes.usb2";makeRoot(target,rootKey,rootTranslation);makeFirstLevelNode("#node_"+rootKey+"_container",phoneKey,phoneType,phoneTranslation);makeSecondLevelNode("#node_"+phoneKey+"_container",phoneFxsKey,phoneFxsTranslation,false);makeSecondLevelNode("#node_"+phoneKey+"_container",phoneDectKey,phoneDectTranslation,false,true);makeFirstLevelNode("#node_"+rootKey+"_container",wifiPrivateKey,wifiPrivateType,wifiPrivateTranslation);makeSecondLevelNode("#node_"+wifiPrivateKey+"_container",wifiPrivate24Key,wifiPrivate24Translation,true);makeSecondLevelNode("#node_"+wifiPrivateKey+"_container",wifiPrivate5Key,wifiPrivate5Translation,true,true);if(this.fields.currentData.guest24IsEnabled||this.fields.currentData.guest5IsEnabled){makeFirstLevelNode("#node_"+rootKey+"_container",wifiGuestKey,wifiGuestType,wifiGuestTranslation);makeSecondLevelNode("#node_"+wifiGuestKey+"_container",wifiGuest24Key,wifiGuest24Translation,true);makeSecondLevelNode("#node_"+wifiGuestKey+"_container",wifiGuest5Key,wifiGuest5Translation,true,true)}makeFirstLevelNode("#node_"+rootKey+"_container",wifiEthernetKey,wifiEthernetType,wifiEthernetTranslation);makeSecondLevelNode("#node_"+wifiEthernetKey+"_container",wifiEthernet1Key,wifiEthernet1Translation,true);makeSecondLevelNode("#node_"+wifiEthernetKey+"_container",wifiEthernet2Key,wifiEthernet2Translation,true);makeSecondLevelNode("#node_"+wifiEthernetKey+"_container",wifiEthernet3Key,wifiEthernet3Translation,true);makeSecondLevelNode("#node_"+wifiEthernetKey+"_container",wifiEthernet4Key,wifiEthernet4Translation,true,true);makeFirstLevelNode("#node_"+rootKey+"_container",usbKey,usbType,usbTranslation,true);makeSecondLevelNode("#node_"+usbKey+"_container",usb1Key,usb1Translation,false);makeSecondLevelNode("#node_"+usbKey+"_container",usb2Key,usb2Translation,false,true);this.translate()};this.createTree=function(){var divTarget=$(this.fields.container),treeData=this.fields.currentData.getTopology[0],wifiprivate24_pointer,wifiprivate5_pointer,wifiguest24_pointer,wifiguest5_pointer,ethernet1_pointer,ethernet2_pointer,ethernet3_pointer,ethernet4_pointer,dect_pointer,fxs_pointer,usb1_pointer,usb2_pointer,index,index2,currentPointer,currentPointer2;this.createRoot(divTarget);if(treeData.hasOwnProperty("deviceType")&&treeData.hasOwnProperty("children")){if(treeData.deviceType==="HGW"){for(index=0;index<treeData.children.length;index=index+1){currentPointer=treeData.children[index];if(currentPointer.deviceType==="lanIntf"){for(index2=0;index2<currentPointer.children.length;index2=index2+1){currentPointer2=currentPointer.children[index2];if(currentPointer2.deviceType==="portIntf_private_wifi24"){if(currentPointer2.hasOwnProperty("children")){wifiprivate24_pointer=treeData.children[index].children[index2].children}}else if(currentPointer2.deviceType==="portIntf_private_wifi5"){if(currentPointer2.hasOwnProperty("children")){wifiprivate5_pointer=treeData.children[index].children[index2].children}}else if(currentPointer2.deviceType==="portIntf"&&currentPointer2.deviceId==="eth1"){if(currentPointer2.hasOwnProperty("children")){ethernet1_pointer=treeData.children[index].children[index2].children}}else if(currentPointer2.deviceType==="portIntf"&&currentPointer2.deviceId==="eth2"){if(currentPointer2.hasOwnProperty("children")){ethernet2_pointer=treeData.children[index].children[index2].children}}else if(currentPointer2.deviceType==="portIntf"&&currentPointer2.deviceId==="eth3"){if(currentPointer2.hasOwnProperty("children")){ethernet3_pointer=treeData.children[index].children[index2].children}}else if(currentPointer2.deviceType==="portIntf"&&currentPointer2.deviceId==="eth4"){if(currentPointer2.hasOwnProperty("children")){ethernet4_pointer=treeData.children[index].children[index2].children}}}}else if(currentPointer.deviceType==="guestIntf"){for(index2=0;index2<currentPointer.children.length;index2=index2+1){currentPointer2=currentPointer.children[index2];if(currentPointer2.deviceType==="portIntf_guest_wifi24"){if(currentPointer2.hasOwnProperty("children")){wifiguest24_pointer=treeData.children[index].children[index2].children}}else if(currentPointer2.deviceType==="portIntf_guest_wifi5"){if(currentPointer2.hasOwnProperty("children")){wifiguest5_pointer=treeData.children[index].children[index2].children}}}}else if(currentPointer.deviceType==="dectIntf"){if(currentPointer.hasOwnProperty("children")){dect_pointer=treeData.children[index].children}}else if(currentPointer.deviceType==="fxsIntf"){fxs_pointer=treeData.children[index].children}else if(currentPointer.deviceType==="usbIntf"){for(index2=0;index2<currentPointer.children.length;index2=index2+1){currentPointer2=currentPointer.children[index2];if(currentPointer2.deviceType==="portIntf"&&currentPointer2.deviceId==="Port1"){if(currentPointer2.hasOwnProperty("children")){usb1_pointer=treeData.children[index].children[index2].children}}else if(currentPointer2.deviceType==="portIntf"&&currentPointer2.deviceId==="Port2"){if(currentPointer2.hasOwnProperty("children")){usb2_pointer=treeData.children[index].children[index2].children}}}}}this.createNodes("livebox_wifiprivate_24",wifiprivate24_pointer,0);this.createNodes("livebox_wifiprivate_5",wifiprivate5_pointer,0);if(this.fields.currentData.guest24IsEnabled||this.fields.currentData.guest5IsEnabled){this.createNodes("livebox_wifiguest_24",wifiguest24_pointer,0);this.createNodes("livebox_wifiguest_5",wifiguest5_pointer,0)}this.createNodes("livebox_ethernet_1",ethernet1_pointer,0);this.createNodes("livebox_ethernet_2",ethernet2_pointer,0);this.createNodes("livebox_ethernet_3",ethernet3_pointer,0);this.createNodes("livebox_ethernet_4",ethernet4_pointer,0);this.createNodes("livebox_phonedect",dect_pointer,0);this.createNodes("livebox_phonefxs",fxs_pointer,0);this.createNodes("livebox_usb_1",usb1_pointer,0);this.createNodes("livebox_usb_2",usb2_pointer,0);this.checkBranchToContainersDisplay()}}};this.setBandwidthDisplay=function(aTargetKey,aDisplay){var target=$("#node_"+this.jQueryEscape(aTargetKey)+"_bandwidth");if(typeof aDisplay==="boolean"&&aDisplay){target.css("display","block")}else if(typeof aDisplay==="boolean"&&!aDisplay){target.css("display","none")}};this.setBandwidthValues=function(aTargetKey,aUploadValue,aDownloadValue){var target=$("#node_"+this.jQueryEscape(aTargetKey)+"_bandwidth"),targetUpload=target.find(".node-bandwidth-upload"),targetDownload=target.find(".node-bandwidth-download");targetUpload.html(aUploadValue);targetDownload.html(aDownloadValue);this.translate()};this.setBandwidth=function(aTargetKey,aDisplay,aUploadValue,aDownloadValue){this.setBandwidthValues(aTargetKey,aUploadValue,aDownloadValue);this.setBandwidthDisplay(aTargetKey,aDisplay)}}return DevicesListMapViewClass});