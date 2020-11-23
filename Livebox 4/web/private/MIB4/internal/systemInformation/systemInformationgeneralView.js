define(["utils/console","utils/basics","lib/eventHandler","lib/stateViewInterface","jquery","text","templates_app/template","text!bootstrap/bootstrap.css","text!app/config/general.json","app/systemInformationSharedView"],function(console,basicUtilities,EventHandlerClass,StateViewClass,$,Text,TemplateClass,Bootstrap,Config,SharedViewClass){"use strict";function SystemInformationgeneralViewClass(aStateId,aTranslateObj){var fields;fields={language:{id:"",data:{}}};StateViewClass.call(this,aStateId,aTranslateObj);this.init=function(aCallback){console.debug("SystemInformationgeneralViewClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.setStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){SharedViewClass.import(aNext,this)}else{basicUtilities.callback(aNext,false,-1,null)}},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.quit=function(aCallback){console.debug("SystemInformationgeneralViewClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.unsetStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.enable=function(aCallback){console.debug("SystemInformationgeneralViewClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.setAppCloseButton(aNext,"app_close")},function(aNext){this.viewDisplayPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){SharedViewClass.import(aNext,this)}else{basicUtilities.callback(aNext,false,-1,null)}},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.disable=function(aCallback){console.debug("SystemInformationgeneralViewClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.viewEmptyPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.stripLines=function(aCallback,aString){basicUtilities.callback(aCallback,false,0,aString.replace(/(\r\n|\n|\r|\t)/gm,""))};this.fillTemplate=function(aCallback,template,context){basicUtilities.queue([function(aNext){this.stripLines(aNext,context)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,template(JSON.parse(aResult.data)))}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.setStyle=function(aCallback){basicUtilities.queue([function(aNext){this.stripLines(aNext,Bootstrap)},function(aNext,aResult){if(!aResult||aResult.status===0){if(!$("#app_conf_style_sheet").length){$("head").append('<style id="app_conf_style_sheet">'+aResult.data+"</style>")}if(!$("#bootstrap_style_sheet").length){$("head").append('<style id="bootstrap_style_sheet">'+TemplateClass.style+"</style>")}basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.unsetStyle=function(aCallback){if($("#app_conf_style_sheet").length){$("head").children("#app_conf_style_sheet").remove()}if($("#bootstrap_style_sheet").length){$("head").children("#bootstrap_style_sheet").remove()}basicUtilities.callback(aCallback,false,0,null)};this.viewEmptyPage=function(aCallback){$(window.document.body).html();basicUtilities.callback(aCallback,false,0,null)};this.viewDisplayPage=function(aCallback){basicUtilities.queue([function(aNext){this.fillTemplate(aNext,TemplateClass.template,Config)},function(aNext,aResult){if(!aResult||aResult.status===0){$(window.document.body).html(aResult.data);this.translate();this.setPageTitle(null,$(".header-title").find("h1").find("span").html());aNext()}else{basicUtilities.callback(aCallback,false,-1,null)}},function(){$("#tab_information_general").on("click",function(){this.generateEvent("ViewSubmitted",{state:"General"})}.bind(this));$("#tab_information_dsl").on("click",function(){this.generateEvent("ViewSubmitted",{state:"DSL"})}.bind(this));$("#tab_information_ftth").on("click",function(){this.generateEvent("ViewSubmitted",{state:"FTTH"})}.bind(this));$("#tab_information_lan").on("click",function(){this.generateEvent("ViewSubmitted",{state:"LAN"})}.bind(this));$("#tab_information_internet").on("click",function(){this.generateEvent("ViewSubmitted",{state:"Internet"})}.bind(this));$("#tab_information_voip").on("click",function(){this.generateEvent("ViewSubmitted",{state:"voIP"})}.bind(this));$("#tab_information_wifi").on("click",function(){this.generateEvent("ViewSubmitted",{state:"Wifi"})}.bind(this));$("#tab_information_usb").on("click",function(){this.generateEvent("ViewSubmitted",{state:"USB"})}.bind(this));$("#tab_information_tv").on("click",function(){this.generateEvent("ViewSubmitted",{state:"TV"})}.bind(this));$("#tab_template_container").off().on("keydown",function(event){var keyCode=event.keyCode||event.which;if(keyCode===39){event.preventDefault();this.generateEvent("ViewSubmitted",{state:$(event.currentTarget).find("div:visible:nth-child(2)").attr("id")==="tab_information_dsl"?"DSL":"FTTH"})}else if(keyCode===37){event.preventDefault();this.generateEvent("ViewSubmitted",{state:"TV"})}}.bind(this));basicUtilities.callback(aCallback,false,0,null)}],this)};this.displayGeneralInfo=function(dataObject){$("#general_information_1").append(dataObject.basicInformation.manufacturerName);$("#general_information_2").append(dataObject.basicInformation.productId);$("#general_information_3").append(dataObject.country.countryCode.convertCountry());$("#general_information_4").append(dataObject.basicInformation.serialNumber);$("#general_information_5").append(dataObject.currentConfiguration.linkModeList[0].macAddress);$("#general_information_6").append(dataObject.basicInformation.softwareVersion);$("#general_information_7").append(dataObject.basicInformation.operatorVersion);console.debug(dataObject.statistics.linkModeList[0].connectionDuration);$("#general_information_8").append(dataObject.statistics.linkModeList[0].connectionDuration.convertToTime());$("#general_information_9").append(jQuery.inArray(dataObject.wanStatistics.linkMode,["ETHERNET","DSL"])!==-1?"connecté":"non connecté")}}return SystemInformationgeneralViewClass});