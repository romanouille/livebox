define(["utils/console","utils/basics","lib/eventHandler","lib/stateViewInterface","jquery","text","templates_app/template","text!bootstrap/bootstrap.css","text!app/config/hubNotInstalledState.json"],function(console,basicUtilities,EventHandlerClass,StateViewClass,$,Text,TemplateClass,Bootstrap,Config){"use strict";function HubNotInstalledStateViewClass(aStateId,aTranslateObj){var fields;fields={loadingTimer:null,storageTimer:null,language:{id:"",data:{}}};StateViewClass.call(this,aStateId,aTranslateObj);this.init=function(aCallback){console.debug("HubNotInstalledStateViewClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.setStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{this.notifyError("HubNotInstalledStateViewClass: Initialising state '"+this.getId()+"'","rra0212");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.quit=function(aCallback){console.debug("HubNotInstalledStateViewClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.unsetStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{this.notifyError("HubNotInstalledStateViewClass: Releasing state '"+this.getId()+"'","rra0213");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.enable=function(aCallback){console.debug("HubNotInstalledStateViewClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.setAppCloseButton(aNext,"app_close")},function(aNext){this.viewDisplayPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{this.notifyError("HubNotInstalledStateViewClass: Enabling state '"+this.getId()+"'","rra0214");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.disable=function(aCallback){console.debug("HubNotInstalledStateViewClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.viewEmptyPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{this.notifyError("HubNotInstalledStateViewClass: Disabling state '"+this.getId()+"'","rra0215");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.stripLines=function(aCallback,aString){basicUtilities.callback(aCallback,false,0,aString.replace(/(\r\n|\n|\r|\t)/gm,""))};this.fillTemplate=function(aCallback,template,context){basicUtilities.queue([function(aNext){this.stripLines(aNext,context)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,template(JSON.parse(aResult.data)))}else{this.notifyError("HubNotInstalledStateViewClass: fillTemplate failed","rra0216");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.setStyle=function(aCallback){basicUtilities.queue([function(aNext){this.stripLines(aNext,Bootstrap)},function(aNext,aResult){if(!aResult||aResult.status===0){if(!$("#app_conf_style_sheet").length){$("head").append('<style id="app_conf_style_sheet">'+aResult.data+"</style>")}if(!$("#bootstrap_style_sheet").length){$("head").append('<style id="bootstrap_style_sheet">'+TemplateClass.style+"</style>")}basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("HubNotInstalledStateViewClass: setStyle failed","rra0217")}}],this)};this.unsetStyle=function(aCallback){if($("#app_conf_style_sheet").length){$("head").children("#app_conf_style_sheet").remove()}if($("#bootstrap_style_sheet").length){$("head").children("#bootstrap_style_sheet").remove()}basicUtilities.callback(aCallback,false,0,null)};this.viewEmptyPage=function(aCallback){$(window.document.body).html();basicUtilities.callback(aCallback,false,0,null)};this.viewDisplayPage=function(aCallback){basicUtilities.queue([function(aNext){this.fillTemplate(aNext,TemplateClass.template,Config)},function(aNext,aResult){if(!aResult||aResult.status===0){$(window.document.body).html(aResult.data);this.translate();this.setPageTitle(null,$(".header-title").find("h1").find("span").html());aNext()}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("HubNotInstalledStateViewClass: Failed to fill template with config data","rra0218")}},function(){$("#save").off().on("click",function(event){event.preventDefault();TemplateClass.showPopup($("#popup_install_hub"));this.generateEvent("ViewSubmitted",{origin:fields.id,state:"get_storage_state"});this.displayPopupInfo("install");this.translate()}.bind(this));$("#popup_install_hub_next").off().on("click",function(event){event.preventDefault();this.generateEvent("ViewSubmitted",{origin:fields.id,state:"start_install"})}.bind(this));$("#popup_install_hub_cancel").off().on("click",function(event){event.preventDefault();TemplateClass.hidePopup($("#popup_install_hub"))}.bind(this));$("#popup_install_hub_format_cancel").off().on("click",function(event){event.preventDefault();this.displayPopupInfo("install")}.bind(this));$("#popup_install_hub_activate_close").off().on("click",function(event){event.preventDefault();TemplateClass.hidePopup($("#popup_install_hub"));window.location.hash="#hubInstalled"}.bind(this));$("#popup_notactivate_hub_next").off().on("click",function(event){event.preventDefault();this.generateEvent("ViewSubmitted",{origin:fields.id,state:"start_install"})}.bind(this));$("#popup_notactivate_hub_cancel").off().on("click",function(event){event.preventDefault();this.displayPopupInfo("install")}.bind(this));basicUtilities.callback(aCallback,false,0,null)}],this)};this.displayPopupInfo=function(state){$("#logoOrangeCloud").css("width","15em");$("#logoOrangeCloud").css("display","block");$("#logoOrangeCloud").css("margin","0 auto");$("#logoHub").css("width","18em");$("#logoHub").css("display","block");$("#logoHub").css("margin","0 auto");$("#activate_thirdDesc").css("width","15em");$("#activate_thirdDesc").css("display","block");$("#activate_thirdDesc").css("margin","0 auto");$("#format_fourthDesc").css("width","15em");$("#format_fourthDesc").css("display","block");$("#format_fourthDesc").css("margin","0 auto");if(fields.storageTimer){window.clearInterval(fields.storageTimer)}if(state==="install"){fields.storageTimer=window.setInterval(function(){this.generateEvent("ViewSubmitted",{origin:fields.id,state:"get_storage_state"})}.bind(this),5e3);$("#install_firstDesc").show();$("#install_secondDesc").show();$("#popup_install_button").show();$("#format_firstDesc").hide();$("#format_secondDesc").hide();$("#format_thirdDesc").hide();$("#format_fourthDesc").hide();$("#popup_format_button").hide();$("#activate_firstDesc").hide();$("#activate_secondDesc").hide();$("#activate_thirdDesc").hide();$("#activate_fourthDesc").hide();$("#popup_activate_button").hide();$("#notactivate_firstDesc").hide();$("#notactivate_secondDesc").hide();$("#notactivate_thirdDesc").hide();$("#popup_notactivate_button").hide();$("#activate_img").hide();$("#install_img").show();$("#progressId").hide();$("#setupStep").text(" (1/3)")}else if(state==="format"){if($("#progressBarId").length===0){TemplateClass.progressBarCreate("progressId","progressBarId")}TemplateClass.progressBarStop("progressBarId");TemplateClass.progressBarSetValue("progressBarId",0);TemplateClass.progressBarStartTimer("progressBarId",20,null);$("#format_firstDesc").show();$("#format_secondDesc").show();$("#format_thirdDesc").show();$("#format_fourthDesc").show();$("#popup_format_button").show();$("#install_firstDesc").hide();$("#install_secondDesc").hide();$("#popup_install_button").hide();$("#activate_firstDesc").hide();$("#activate_secondDesc").hide();$("#activate_thirdDesc").hide();$("#activate_fourthDesc").hide();$("#popup_activate_button").hide();$("#notactivate_firstDesc").hide();$("#notactivate_secondDesc").hide();$("#notactivate_thirdDesc").hide();$("#popup_notactivate_button").hide();$("#activate_img").hide();$("#install_img").hide();$("#progressId").show();$("#setupStep").text(" (2/3)")}else if(state==="activate"){if(fields.loadingTimer){window.clearTimeout(fields.loadingTimer)}$("#activate_firstDesc").show();$("#activate_secondDesc").show();$("#activate_thirdDesc").show();$("#activate_fourthDesc").show();$("#popup_activate_button").show();$("#install_firstDesc").hide();$("#install_secondDesc").hide();$("#popup_install_button").hide();$("#format_firstDesc").hide();$("#format_secondDesc").hide();$("#format_thirdDesc").hide();$("#format_fourthDesc").hide();$("#popup_format_button").hide();$("#notactivate_firstDesc").hide();$("#notactivate_secondDesc").hide();$("#notactivate_thirdDesc").hide();$("#popup_notactivate_button").hide();$("#activate_img").show();$("#install_img").hide();$("#progressId").hide();$("#setupStep").text(" (3/3)")}else if(state==="notactivate"){if(fields.loadingTimer){window.clearTimeout(fields.loadingTimer)}$("#activate_firstDesc").hide();$("#activate_secondDesc").hide();$("#activate_thirdDesc").hide();$("#activate_fourthDesc").hide();$("#popup_activate_button").hide();$("#install_firstDesc").hide();$("#install_secondDesc").hide();$("#popup_install_button").hide();$("#format_firstDesc").hide();$("#format_secondDesc").hide();$("#format_thirdDesc").hide();$("#format_fourthDesc").hide();$("#popup_format_button").hide();$("#notactivate_firstDesc").show();$("#notactivate_secondDesc").show();$("#notactivate_thirdDesc").show();$("#popup_notactivate_button").show();$("#activate_img").hide();$("#install_img").hide();$("#progressId").hide();$("#setupStep").text(" (2/3)")}TemplateClass.positionPopup($("#popup_install_hub"))};this.toggleInstallButton=function(disabled){if(disabled){$("#popup_install_hub_next").attr("disabled",true)}else{$("#popup_install_hub_next").attr("disabled",false)}}}return HubNotInstalledStateViewClass});