define(["utils/console","utils/basics","lib/eventHandler","lib/stateViewInterface","jquery","text","templates_app/template","text!bootstrap/bootstrap.css","text!app/config/tv.json","app/systemInformationSharedView"],function(console,basicUtilities,EventHandlerClass,StateViewClass,$,Text,TemplateClass,Bootstrap,Config,SharedViewClass){"use strict";function SystemInformationTVViewClass(aStateId,aTranslateObj){var fields;fields={};StateViewClass.call(this,aStateId,aTranslateObj);this.init=function(aCallback){console.debug("SystemInformationTVViewClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.setStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.quit=function(aCallback){console.debug("SystemInformationTVViewClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.unsetStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.enable=function(aCallback){console.debug("SystemInformationTVViewClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.setAppCloseButton(aNext,"app_close")},function(aNext){this.viewDisplayPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){SharedViewClass.import(aNext,this)}else{basicUtilities.callback(aNext,false,-1,null)}},function(aNext,aResult){if(!aResult||aResult.status===0){this.hideTab(sessionStorage.getItem("tab"));basicUtilities.callback(aNext,false,0,null)}else{basicUtilities.callback(aNext,false,-1,null)}},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.disable=function(aCallback){console.debug("SystemInformationTVViewClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.viewEmptyPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.stripLines=function(aCallback,aString){basicUtilities.callback(aCallback,false,0,aString.replace(/(\r\n|\n|\r|\t)/gm,""))};this.fillTemplate=function(aCallback,template,context){basicUtilities.queue([function(aNext){this.stripLines(aNext,context)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,template(JSON.parse(aResult.data)))}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.setStyle=function(aCallback){basicUtilities.queue([function(aNext){this.stripLines(aNext,Bootstrap)},function(aNext,aResult){if(!aResult||aResult.status===0){if(!$("#app_conf_style_sheet").length){$("head").append('<style id="app_conf_style_sheet">'+aResult.data+"</style>")}if(!$("#bootstrap_style_sheet").length){$("head").append('<style id="bootstrap_style_sheet">'+TemplateClass.style+"</style>")}basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.unsetStyle=function(aCallback){if($("#app_conf_style_sheet").length){$("head").children("#app_conf_style_sheet").remove()}if($("#bootstrap_style_sheet").length){$("head").children("#bootstrap_style_sheet").remove()}basicUtilities.callback(aCallback,false,0,null)};this.viewEmptyPage=function(aCallback){$(window.document.body).html();basicUtilities.callback(aCallback,false,0,null)};this.viewDisplayPage=function(aCallback){basicUtilities.queue([function(aNext){this.fillTemplate(aNext,TemplateClass.template,Config)},function(aNext,aResult){if(!aResult||aResult.status===0){$(window.document.body).html(aResult.data);this.translate();this.setPageTitle(null,$(".header-title").find("h1").find("span").html());aNext()}else{basicUtilities.callback(aCallback,false,-1,null)}},function(){$("#tab_information_general").on("click",function(){this.generateEvent("ViewSubmitted",{state:"General"})}.bind(this));$("#tab_information_dsl").on("click",function(){this.generateEvent("ViewSubmitted",{state:"DSL"})}.bind(this));$("#tab_information_ftth").on("click",function(){this.generateEvent("ViewSubmitted",{state:"FTTH"})}.bind(this));$("#tab_information_lan").on("click",function(){this.generateEvent("ViewSubmitted",{state:"LAN"})}.bind(this));$("#tab_information_internet").on("click",function(){this.generateEvent("ViewSubmitted",{state:"Internet"})}.bind(this));$("#tab_information_voip").on("click",function(){this.generateEvent("ViewSubmitted",{state:"voIP"})}.bind(this));$("#tab_information_wifi").on("click",function(){this.generateEvent("ViewSubmitted",{state:"Wifi"})}.bind(this));$("#tab_information_usb").on("click",function(){this.generateEvent("ViewSubmitted",{state:"USB"})}.bind(this));$("#tab_information_tv").on("click",function(){this.generateEvent("ViewSubmitted",{state:"TV"})}.bind(this));$("#tab_template_container").off().on("keydown",function(event){var keyCode=event.keyCode||event.which;if(keyCode===39){event.preventDefault();this.generateEvent("ViewSubmitted",{state:"General"})}else if(keyCode===37){event.preventDefault();this.generateEvent("ViewSubmitted",{state:"USB"})}}.bind(this));basicUtilities.callback(aCallback,false,0,null)}],this)};this.displayTVInfo=function(dataObject){var i;for(i=dataObject.tvServiceState.serviceList.length-1;i>=0;i-=1){if(dataObject.tvServiceState.serviceList[i].isEnabled===true){dataObject.tvServiceState.serviceList[i].isEnabled="on"}else{dataObject.tvServiceState.serviceList[i].isEnabled="off"}}$("#tv_1").append(dataObject.tvServiceState.serviceList[0].isEnabled?"disponible":"non disponible");if(dataObject.tvServiceState.serviceList[0].vlan!==undefined&&dataObject.tvServiceState.serviceList[0].vlan!==""){$("#tv_2").append("VLAN : "+dataObject.tvServiceState.serviceList[0].vlan)}else if(dataObject.tvServiceState.serviceList[0].vpvc!==undefined&&dataObject.tvServiceState.serviceList[0].vpvc!==""){$("#tv_2").append("VP/VC : "+dataObject.tvServiceState.serviceList[0].vpvc)}$("#tv_3").append(dataObject.tvServiceState.serviceList[1].isEnabled?"disponible":"non disponible");if(dataObject.tvServiceState.serviceList[1].vlan!==undefined&&dataObject.tvServiceState.serviceList[1].vlan!==""){$("#tv_4").append("VLAN : "+dataObject.tvServiceState.serviceList[1].vlan)}else if(dataObject.tvServiceState.serviceList[1].vpvc!==undefined&&dataObject.tvServiceState.serviceList[1].vpvc!==""){$("#tv_4").append("VP/VC : "+dataObject.tvServiceState.serviceList[1].vpvc)}$("#tv_5").append(dataObject.tvServiceState.serviceList[2].isEnabled?"disponible":"non disponible");if(dataObject.tvServiceState.serviceList[2].vlan!==undefined&&dataObject.tvServiceState.serviceList[2].vlan!==""){$("#tv_6").append("VLAN : "+dataObject.tvServiceState.serviceList[2].vlan)}else if(dataObject.tvServiceState.serviceList[2].vpvc!==undefined&&dataObject.tvServiceState.serviceList[2].vpvc!==""){$("#tv_6").append("VP/VC : "+dataObject.tvServiceState.serviceList[2].vpvc)}$("#tv_7").append(dataObject.tvServiceState.serviceList[3].isEnabled?"disponible":"non disponible");if(dataObject.tvServiceState.serviceList[3].vlan!==undefined&&dataObject.tvServiceState.serviceList[3].vlan!==""){$("#tv_8").append("VLAN : "+dataObject.tvServiceState.serviceList[3].vlan)}else if(dataObject.tvServiceState.serviceList[3].vpvc!==undefined&&dataObject.tvServiceState.serviceList[3].vpvc!==""){$("#tv_8").append("VP/VC : "+dataObject.tvServiceState.serviceList[3].vpvc)}}}return SystemInformationTVViewClass});