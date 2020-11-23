define(["utils/console","utils/basics","lib/eventHandler","lib/stateViewInterface","jquery","text","templates_install/template","text!bootstrap/bootstrap.css","text!app/config/first_install_step3Cloud.json"],function(console,basicUtilities,EventHandlerClass,StateViewClass,$,Text,TemplateClass,Bootstrap,Config){"use strict";function Step3CloudViewClass(aStateId,aTranslateObj){var fields;fields={};StateViewClass.call(this,aStateId,aTranslateObj);this.init=function(aCallback){console.debug("Step3CloudViewClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.setStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("Step3CloudViewClass: Initialising state '"+this.getId()+"'","rra0182")}}],this)};this.quit=function(aCallback){console.debug("Step3CloudViewClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.unsetStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("Step3CloudViewClass: Releasing state '"+this.getId()+"'","rra0183")}}],this)};this.enable=function(aCallback){console.debug("Step3CloudViewClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.viewDisplayPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){this.setHeaderButtons();this.setContrast();basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("Step3CloudViewClass: Enabling state '"+this.getId()+"'","rra0184")}}],this)};this.disable=function(aCallback){console.debug("Step3CloudViewClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.viewEmptyPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("Step3CloudViewClass: Disabling state '"+this.getId()+"'","rra0185")}}],this)};this.stripLines=function(aCallback,aString){basicUtilities.callback(aCallback,false,0,aString.replace(/(\r\n|\n|\r|\t)/gm,""))};this.setHeaderButtons=function(){$("a:eq(0)").on("click",function(event){event.preventDefault();basicUtilities.queue([function(aNext){this.fireEvent("ViewUpdated",{langId:"fr"});this.updateTranslationLanguage(aNext,"fr")},function(aNext,aResult){if(!aResult||aResult.status===0){this.translate()}else{basicUtilities.callback(null,false,-1,null);this.notifyError("Step3CloudViewClass: Internal Error updateTranslationLanguage failed","rra0179")}}],this)}.bind(this));$("a:eq(1)").on("click",function(event){event.preventDefault();basicUtilities.queue([function(aNext){this.fireEvent("ViewUpdated",{langId:"en"});this.updateTranslationLanguage(aNext,"en")},function(aNext,aResult){if(!aResult||aResult.status===0){this.translate()}else{basicUtilities.callback(null,false,-1,null);this.notifyError("Step3CloudViewClass: Internal Error updateTranslationLanguage failed","rra0180")}}],this)}.bind(this));$("#header_contrast").on("click",function(event){event.preventDefault();this.toggleContrast()}.bind(this))};this.setContrast=function(){var elements=["body, #header_template_container, .popup_window"],displayAttr,fontsizeAttr;if(basicUtilities.getCookie("UIContrast")==="1"){$(elements).each(function(){$(this).css({color:"#FFFFFF",backgroundColor:"#000000"})})}else{$(elements).each(function(){displayAttr=$(this).css("display");fontsizeAttr=$(this).css("font-size");$(this).removeAttr("style");$(this).css("display",displayAttr);$(this).css("font-size",fontsizeAttr)})}};this.toggleContrast=function(){if(basicUtilities.getCookie("UIContrast")==="0"){basicUtilities.setCookie("UIContrast","1")}else{basicUtilities.setCookie("UIContrast","0")}this.setContrast()};this.fillTemplate=function(aCallback,template,context){basicUtilities.queue([function(aNext){this.stripLines(aNext,context)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,template(JSON.parse(aResult.data)))}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("Step3CloudViewClass: Internal Error stripLines failed","rra0188")}}],this)};this.setStyle=function(aCallback){basicUtilities.queue([function(aNext){this.stripLines(aNext,Bootstrap)},function(aNext,aResult){if(!aResult||aResult.status===0){if(!$("#app_conf_style_sheet").length){$("head").append('<style id="app_conf_style_sheet">'+aResult.data+"</style>")}if(!$("#bootstrap_style_sheet").length){$("head").append('<style id="bootstrap_style_sheet">'+TemplateClass.style+"</style>")}basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("Step3CloudViewClass: Internal Error stripLines failed","rra0189")}}],this)};this.unsetStyle=function(aCallback){if($("#app_conf_style_sheet").length){$("head").children("#app_conf_style_sheet").remove()}if($("#bootstrap_style_sheet").length){$("head").children("#bootstrap_style_sheet").remove()}basicUtilities.callback(aCallback,false,0,null)};this.viewEmptyPage=function(aCallback){$(window.document.body).html();basicUtilities.callback(aCallback,false,0,null)};this.viewDisplayPage=function(aCallback){basicUtilities.queue([function(aNext){this.fillTemplate(aNext,TemplateClass.template,Config)},function(aNext,aResult){if(!aResult||aResult.status===0){$(window.document.body).html(aResult.data);this.translate();window.location.hash="#networkRestore";this.setPageTitle(aNext,$(".header-title").find("h1").find("span").html())}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("Step3CloudViewClass: Failed to fill template with config data","rra0190")}},function(){this.fireEvent("ViewSubmitted",null);basicUtilities.callback(aCallback,false,0,null)}],this)};this.toggleSaveButton=function(){if($("input:checked").length===0){$("#save").attr("disabled",true)}else{$("#save").attr("disabled",false)}}}return Step3CloudViewClass});