define(["utils/console","utils/basics","lib/eventHandler","lib/stateViewInterface","jquery","text","templates_install/template","text!bootstrap/bootstrap.css","text!app/config/first_install_step2.json"],function(console,basicUtilities,EventHandlerClass,StateViewClass,$,Text,TemplateClass,Bootstrap,Config){"use strict";function Step2ViewClass(aStateId,aTranslateObj){var fields,displayWelcomeUserName=function(isSmS){if(isSmS){$(".bodytxt:eq(1)").hide();$(".bodytxt:eq(0)").show();$(".puce-orange:eq(0)").show();$(".puce-orange:eq(1)").show()}else{$(".bodytxt:eq(0)").hide();$(".puce-orange:eq(0)").hide();$(".puce-orange:eq(1)").hide();$(".bodytxt:eq(1)").show()}};fields={};StateViewClass.call(this,aStateId,aTranslateObj);this.init=function(aCallback){console.debug("Step2ViewClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.setStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("Step2ViewClass: Initialising state '"+this.getId()+"'","rra0174")}}],this)};this.quit=function(aCallback){console.debug("Step2ViewClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.unsetStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("Step2ViewClass: Releasing state '"+this.getId()+"'","rra0175")}}],this)};this.enable=function(aCallback){console.debug("Step2ViewClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.viewDisplayPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){this.setHeaderButtons();this.setContrast();basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("Step2ViewClass: Enabling state '"+this.getId()+"'","rra0176")}}],this)};this.disable=function(aCallback){console.debug("Step2ViewClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.viewEmptyPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("Step2ViewClass: Disabling state '"+this.getId()+"'","rra0177")}}],this)};this.stripLines=function(aCallback,aString){basicUtilities.callback(aCallback,false,0,aString.replace(/(\r\n|\n|\r|\t)/gm,""))};this.fillTemplate=function(aCallback,template,context){basicUtilities.queue([function(aNext){this.stripLines(aNext,context)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,template(JSON.parse(aResult.data)))}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("Step2ViewClass: Internal Error stripLines failed","rra0178")}}],this)};this.setHeaderButtons=function(){$("a:eq(0)").on("click",function(event){event.preventDefault();basicUtilities.queue([function(aNext){this.fireEvent("ViewUpdated",{langId:"fr"});this.updateTranslationLanguage(aNext,"fr")},function(aNext,aResult){if(!aResult||aResult.status===0){this.translate()}else{basicUtilities.callback(null,false,-1,null);this.notifyError("Step2ViewClass: Internal Error updateTranslationLanguage failed","rra0179")}}],this)}.bind(this));$("a:eq(1)").on("click",function(event){event.preventDefault();basicUtilities.queue([function(aNext){this.fireEvent("ViewUpdated",{langId:"en"});this.updateTranslationLanguage(aNext,"en")},function(aNext,aResult){if(!aResult||aResult.status===0){this.translate()}else{basicUtilities.callback(null,false,-1,null);this.notifyError("Step2ViewClass: Internal Error updateTranslationLanguage failed","rra0180")}}],this)}.bind(this));$("#header_contrast").on("click",function(event){event.preventDefault();this.toggleContrast()}.bind(this))};this.setContrast=function(){var elements=["body, #header_template_container, .popup_window"],displayAttr,fontsizeAttr;if(basicUtilities.getCookie("UIContrast")==="1"){$(elements).each(function(){$(this).css({color:"#FFFFFF",backgroundColor:"#000000"})})}else{$(elements).each(function(){displayAttr=$(this).css("display");fontsizeAttr=$(this).css("font-size");$(this).removeAttr("style");$(this).css("display",displayAttr);$(this).css("font-size",fontsizeAttr)})}};this.toggleContrast=function(){if(basicUtilities.getCookie("UIContrast")==="0"){basicUtilities.setCookie("UIContrast","1")}else{basicUtilities.setCookie("UIContrast","0")}this.setContrast()};this.setStyle=function(aCallback){basicUtilities.queue([function(aNext){this.stripLines(aNext,Bootstrap)},function(aNext,aResult){if(!aResult||aResult.status===0){if(!$("#app_conf_style_sheet").length){$("head").append('<style id="app_conf_style_sheet">'+aResult.data+"</style>")}if(!$("#bootstrap_style_sheet").length){$("head").append('<style id="bootstrap_style_sheet">'+TemplateClass.style+"</style>")}basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("Step2ViewClass: Internal Error stripLines failed","rra0174")}}],this)};this.unsetStyle=function(aCallback){if($("#app_conf_style_sheet").length){$("head").children("#app_conf_style_sheet").remove()}if($("#bootstrap_style_sheet").length){$("head").children("#bootstrap_style_sheet").remove()}basicUtilities.callback(aCallback,false,0,null)};this.viewEmptyPage=function(aCallback){$(window.document.body).html();basicUtilities.callback(aCallback,false,0,null)};this.viewDisplayPage=function(aCallback){basicUtilities.queue([function(aNext){this.fillTemplate(aNext,TemplateClass.template,Config)},function(aNext,aResult){if(!aResult||aResult.status===0){$(window.document.body).html(aResult.data);this.translate();window.location.hash="#welcome";this.setPageTitle(aNext,$(".header-title").find("h1").find("span").html())}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("Step2ViewClass:  Failed to fill template with config data","rra0181")}},function(aNext){this.displayConnectionState("");this.toggleSaveButton();$("li:eq(0)").before("<ul></ul>");$("ul").append($("li"));$("li").css("margin-left","-1.5em");$("#login").before("<span>fti/ </span>");$("#login").attr("class","Translation small-field");$("#login, #password").on("input",function(event){if(event.keyCode===13&&$("#login").val()!==""&&$("#password").val()!==""){this.fireEvent("ViewSubmitted",{login:$("#login").val(),password:$("#password").val()})}else{this.toggleSaveButton()}}.bind(this));$(".bodyinfotxt").attr("role","alert");TemplateClass.spinnerAnimate();aNext()},function(aNext){$("#save").on("click",function(){this.fireEvent("ViewSubmitted",{login:$("#login").val(),password:$("#password").val()});$("#save").attr("disabled",true);$("#password_warning").css("display","none");$("#password_label").css("color","#000000");$("#password").css("color","#000000");$("#password").css("border-color","#cccccc")}.bind(this));aNext()},function(){$("#cancel").on("click",function(){this.fireEvent("ViewCancelled",null)}.bind(this));basicUtilities.callback(aCallback,false,0,null)}],this)};this.ShowConnectionPage=function(firstname,lastname,phone){var suffix,i;if(firstname===""&&lastname===""||phone===""){displayWelcomeUserName.call(this,false)}else{displayWelcomeUserName.call(this,true);suffix="";for(i=0;i<phone.length-6;i+=1){suffix+="X"}$("#phone").text(phone.substr(0,6)+suffix);$("#username").text(firstname+" "+lastname)}};this.displayConnectionState=function(state){$(".bodyinfotxt").css("padding","0.5em 0em 0em 0em");if(state==="connecting"){$(".bodyinfotxt").html('<span data-translation="first_install.welcome.connecting" class="Translation"></span> <img class="spinner" src="./img/first_install/spinner.png">');$(".bodyinfotxt").show()}else if(state==="connected"){$(".bodyinfotxt").html('<span data-translation="first_install.welcome.connected" class="Translation"></span>');$(".bodyinfotxt").show()}else if(state==="disconnected"){$(".bodyinfotxt").html('<span data-translation="first_install.welcome.disconnected" class="Translation"></span>');$(".bodyinfotxt").show()}else{$(".bodyinfotxt").hide();$("#save").attr("disabled",false)}this.translate(".bodyinfotxt")};this.toggleSaveButton=function(){if($("#login").val()===""||$("#password").val()===""){$("#save").attr("disabled",true)}else{$("#save").attr("disabled",false)}};this.displayPasswordError=function(isValid){if(isValid){$("#password_warning").css("display","none");$("#password_label").css("color","#000000");$("#password").css("color","#000000");$("#password").css("border-color","#CCCCCC")}else{$("#password_warning").css("display","inline");$("#password_label").css("color","#CC0000");$("#password").css("color","#CC0000");$("#password").css("border-color","#CC0000")}};this.displayLoginPasswordError=function(){$("#login_warning span span").attr("data-translation","first_install.welcome.login.warning");$("#login_warning").css("display","inline");$("#password_label").css("color","#CC0000");$("#password").css("color","#CC0000");$("#password").css("border-color","#CC0000");$("#login_label").css("color","#CC0000");$("#login").css("color","#CC0000");$("#login").css("border-color","#CC0000");this.translate()};this.displayLoginError=function(isValid){if(isValid){$("#login_warning").css("display","none");$("#login_label").css("color","#000000");$("#login").css("color","#000000");$("#login").css("border-color","#CCCCCC")}else{$("#login_warning span span").attr("data-translation","first_install.welcome.login.password.warning");$("#login_warning").css("display","inline");$("#login_label").css("color","#CC0000");$("#login").css("color","#CC0000");$("#login").css("border-color","#CC0000")}this.translate()}}return Step2ViewClass});