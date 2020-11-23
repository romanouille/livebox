define(["utils/console","utils/basics","lib/eventHandler","lib/stateViewInterface","jquery","text","templates_app/template","text!bootstrap/bootstrap.css","text!app/config/internetHotline.json"],function(console,basicUtilities,EventHandlerClass,StateViewClass,$,Text,TemplateClass,Bootstrap,Config){"use strict";function InternetHotlineViewClass(aStateId,aTranslateObj){var fields;fields={};StateViewClass.call(this,aStateId,aTranslateObj);this.init=function(aCallback){console.debug("InternetHotlineViewClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.setStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.quit=function(aCallback){console.debug("InternetHotlineViewClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.unsetStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.enable=function(aCallback){console.debug("InternetHotlineViewClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.setAppCloseButton(aNext,"app_close")},function(aNext){this.viewDisplayPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.disable=function(aCallback){console.debug("InternetHotlineViewClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.viewEmptyPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.stripLines=function(aCallback,aString){basicUtilities.callback(aCallback,false,0,aString.replace(/(\r\n|\n|\r|\t)/gm,""))};this.fillTemplate=function(aCallback,template,context){basicUtilities.queue([function(aNext){this.stripLines(aNext,context)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,template(JSON.parse(aResult.data)))}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.setStyle=function(aCallback){basicUtilities.queue([function(aNext){this.stripLines(aNext,Bootstrap)},function(aNext,aResult){if(!aResult||aResult.status===0){if(!$("#app_conf_style_sheet").length){$("head").append('<style id="app_conf_style_sheet">'+aResult.data+"</style>")}if(!$("#bootstrap_style_sheet").length){$("head").append('<style id="bootstrap_style_sheet">'+TemplateClass.style+"</style>")}basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.unsetStyle=function(aCallback){if($("#app_conf_style_sheet").length){$("head").children("#app_conf_style_sheet").remove()}if($("#bootstrap_style_sheet").length){$("head").children("#bootstrap_style_sheet").remove()}basicUtilities.callback(aCallback,false,0,null)};this.viewEmptyPage=function(aCallback){$(window.document.body).html();basicUtilities.callback(aCallback,false,0,null)};this.viewDisplayPage=function(aCallback){basicUtilities.queue([function(aNext){this.fillTemplate(aNext,TemplateClass.template,Config)},function(aNext,aResult){if(!aResult||aResult.status===0){$(window.document.body).html(aResult.data);this.translate();this.setPageTitle(null,$(".header-title").find("h1").find("span").html());TemplateClass.progressBarCreate("remoteProgressBar","progressBar","thin",["0 min","5 min","10 min","15 min"]);this.showNote(false);aNext()}else{basicUtilities.callback(aCallback,false,-1,null)}},function(aNext){this.toggleStopButton();$("#continue").hide();$("#login").attr("disabled",true);$("#password").attr("disabled",true);$("#IP").attr("disabled",true);$("#port").attr("disabled",true);$("#url").attr("disabled",true);this.fireEvent("ViewSubmitted",{origin:fields.id,state:"get"});$("#start").on("click",function(){this.fireEvent("ViewSubmitted",{origin:fields.id,state:"start"})}.bind(this));aNext()},function(aNext){$("#stop").on("click",function(){this.stopRemoteAccess()}.bind(this));aNext()},function(){$("#continue").on("click",function(){this.resetRemoteAccess()}.bind(this));basicUtilities.callback(aCallback,false,0,null)}],this)};this.toggleStopButton=function(){if($("#start").prop("disabled")){$("#stop").attr("disabled",true)}else{if($("#start").is(":visible")){$("#stop").attr("disabled",true)}else{$("#stop").attr("disabled",false)}}};this.switchButton=function(isStarted){if(!isStarted){$("#continue").hide();$("#start").show()}else{$("#continue").show();$("#start").hide()}};this.showNote=function(show){if(show){$("#note").show()}else{$("#note").hide()}};this.startRemoteAccess=function(){TemplateClass.progressBarSetValue("progressBar",100);TemplateClass.progressBarStartCountDownTimer("progressBar",15*60,function(){this.stopRemoteAccess()}.bind(this));this.showNote(true)};this.stopRemoteAccess=function(){TemplateClass.progressBarStop("progressBar",true);this.switchButton();this.toggleStopButton();this.fireEvent("ViewCancelled",null);this.showNote(false)};this.resetRemoteAccess=function(){this.fireEvent("ViewSubmitted",{origin:fields.id,state:"restart"});this.handleProgressBar(900,900)};this.fillForm=function(login,password,ip,port,url){$("#login").val(login);$("#password").val(password);$("#IP").val(ip);$("#port").val(port);$("#url").val(url)};this.handleProgressBar=function(timeout,timeLeft){TemplateClass.progressBarStop("progressBar",true);TemplateClass.progressBarSetValue("progressBar",parseInt(timeLeft*100/timeout));TemplateClass.progressBarStartCountDownTimer("progressBar",timeout,function(){this.stopRemoteAccess()}.bind(this))}}return InternetHotlineViewClass});