define(["utils/console","utils/basics","lib/eventHandler","lib/stateViewInterface","jquery","text","templates_app/template","text!bootstrap/bootstrap.css","text!app/config/hubMaintenance.json"],function(console,basicUtilities,EventHandlerClass,StateViewClass,$,Text,TemplateClass,Bootstrap,Config){"use strict";function HubMaintenanceViewClass(aStateId,aTranslateObj){var fields;fields={loadingTimer:null,storageTimer:null,language:{id:"",data:{}}};StateViewClass.call(this,aStateId,aTranslateObj);this.init=function(aCallback){console.debug("HubMaintenanceViewClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.setStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{this.notifyError("HubMaintenanceViewClass: Initialising state '"+this.getId()+"'","rra0212");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.quit=function(aCallback){console.debug("HubMaintenanceViewClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.unsetStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{this.notifyError("HubMaintenanceViewClass: Releasing state '"+this.getId()+"'","rra0213");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.enable=function(aCallback){console.debug("HubMaintenanceViewClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.setAppCloseButton(aNext,"app_close")},function(aNext){this.viewDisplayPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{this.notifyError("HubMaintenanceViewClass: Enabling state '"+this.getId()+"'","rra0214");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.disable=function(aCallback){console.debug("HubMaintenanceViewClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.viewEmptyPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{this.notifyError("HubMaintenanceViewClass: Disabling state '"+this.getId()+"'","rra0215");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.stripLines=function(aCallback,aString){basicUtilities.callback(aCallback,false,0,aString.replace(/(\r\n|\n|\r|\t)/gm,""))};this.fillTemplate=function(aCallback,template,context){basicUtilities.queue([function(aNext){this.stripLines(aNext,context)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,template(JSON.parse(aResult.data)))}else{this.notifyError("HubMaintenanceViewClass: fillTemplate failed","rra0216");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.setStyle=function(aCallback){basicUtilities.queue([function(aNext){this.stripLines(aNext,Bootstrap)},function(aNext,aResult){if(!aResult||aResult.status===0){if(!$("#app_conf_style_sheet").length){$("head").append('<style id="app_conf_style_sheet">'+aResult.data+"</style>")}if(!$("#bootstrap_style_sheet").length){$("head").append('<style id="bootstrap_style_sheet">'+TemplateClass.style+"</style>")}basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("HubMaintenanceViewClass: setStyle failed","rra0217")}}],this)};this.unsetStyle=function(aCallback){if($("#app_conf_style_sheet").length){$("head").children("#app_conf_style_sheet").remove()}if($("#bootstrap_style_sheet").length){$("head").children("#bootstrap_style_sheet").remove()}basicUtilities.callback(aCallback,false,0,null)};this.viewEmptyPage=function(aCallback){$(window.document.body).html();basicUtilities.callback(aCallback,false,0,null)};this.viewDisplayPage=function(aCallback){basicUtilities.queue([function(aNext){this.fillTemplate(aNext,TemplateClass.template,Config)},function(aNext,aResult){if(!aResult||aResult.status===0){$(window.document.body).html(aResult.data);this.translate();this.setPageTitle(null,$(".header-title").find("h1").find("span").html());aNext()}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("HubMaintenanceViewClass: Failed to fill template with config data","rra0218")}},function(){$("#format").off().on("click",function(event){event.preventDefault();TemplateClass.showPopup($("#popup_format_hub"));this.displayPopupInfo("init_format");this.translate()}.bind(this));$("#popup_format_hub_init").off().on("click",function(event){event.preventDefault();this.generateEvent("ViewSubmitted",{origin:fields.id,state:"start_format"});this.displayPopupInfo("inprogress_format");fields.loadingTimer=window.setTimeout(function(){this.generateEvent("ViewSubmitted",{origin:fields.id,state:"get_format_state"})}.bind(this),2e4)}.bind(this));$("#popup_format_hub_cancel").off().on("click",function(event){event.preventDefault();TemplateClass.hidePopup($("#popup_format_hub"))}.bind(this));$("#popup_format_success_hub_close").off().on("click",function(event){event.preventDefault();TemplateClass.hidePopup($("#popup_format_hub"))}.bind(this));$("#popup_format_error_hub_close").off().on("click",function(event){event.preventDefault();TemplateClass.hidePopup($("#popup_format_hub"))}.bind(this));$("#eject").off().on("click",function(event){event.preventDefault();TemplateClass.showPopup($("#popup_eject_hub"));this.displayPopupInfo("init_eject");this.translate()}.bind(this));$("#eject_error_secondDesc span").off().on("click",function(event){event.preventDefault();this.generateEvent("ViewSubmitted",{origin:fields.id,state:"start_eject"});this.displayPopupInfo("inprogress_eject");fields.loadingTimer=window.setTimeout(function(){this.generateEvent("ViewSubmitted",{origin:fields.id,state:"get_storage_state"})}.bind(this),2e4)}.bind(this));$("#popup_eject_hub_init").off().on("click",function(event){event.preventDefault();this.generateEvent("ViewSubmitted",{origin:fields.id,state:"start_eject"});this.displayPopupInfo("inprogress_eject");fields.loadingTimer=window.setTimeout(function(){this.generateEvent("ViewSubmitted",{origin:fields.id,state:"get_storage_state"})}.bind(this),2e4)}.bind(this));$("#popup_eject_hub_cancel").off().on("click",function(event){event.preventDefault();TemplateClass.hidePopup($("#popup_eject_hub"))}.bind(this));$("#popup_eject_success_hub_close").off().on("click",function(event){event.preventDefault();TemplateClass.hidePopup($("#popup_eject_hub"))}.bind(this));$("#popup_eject_error_hub_close").off().on("click",function(event){event.preventDefault();TemplateClass.hidePopup($("#popup_eject_hub"))}.bind(this));$("#stop").off().on("click",function(event){event.preventDefault();TemplateClass.showPopup($("#popup_stop_hub"));this.displayPopupInfo("init_stop");this.translate()}.bind(this));$("#stop_error_secondDesc span").off().on("click",function(event){event.preventDefault();this.generateEvent("ViewSubmitted",{origin:fields.id,state:"start_stopHub"});this.displayPopupInfo("inprogress_stop");fields.loadingTimer=window.setTimeout(function(){this.generateEvent("ViewSubmitted",{origin:fields.id,state:"get_service_state"})}.bind(this),2e4)}.bind(this));$("#popup_stop_hub_init").off().on("click",function(event){event.preventDefault();this.generateEvent("ViewSubmitted",{origin:fields.id,state:"start_stopHub"});this.displayPopupInfo("inprogress_stop");fields.loadingTimer=window.setTimeout(function(){this.generateEvent("ViewSubmitted",{origin:fields.id,state:"get_service_state"})}.bind(this),2e4)}.bind(this));$("#popup_stop_hub_cancel").off().on("click",function(event){event.preventDefault();TemplateClass.hidePopup($("#popup_stop_hub"))}.bind(this));$("#popup_stop_success_hub_close").off().on("click",function(event){event.preventDefault();TemplateClass.hidePopup($("#popup_stop_hub"))}.bind(this));$("#popup_stop_error_hub_close").off().on("click",function(event){event.preventDefault();TemplateClass.hidePopup($("#popup_stop_hub"))}.bind(this));$("#start").off().on("click",function(event){event.preventDefault();TemplateClass.showPopup($("#popup_start_hub"));this.displayPopupInfo("init_start");this.translate()}.bind(this));$("#start_error_secondDesc span").off().on("click",function(event){event.preventDefault();this.generateEvent("ViewSubmitted",{origin:fields.id,state:"start_startHub"});this.displayPopupInfo("inprogress_start");fields.loadingTimer=window.setTimeout(function(){this.generateEvent("ViewSubmitted",{origin:fields.id,state:"get_service_state"})}.bind(this),2e4)}.bind(this));$("#popup_start_hub_init").off().on("click",function(event){event.preventDefault();this.generateEvent("ViewSubmitted",{origin:fields.id,state:"start_startHub"});this.displayPopupInfo("inprogress_start");fields.loadingTimer=window.setTimeout(function(){this.generateEvent("ViewSubmitted",{origin:fields.id,state:"get_service_state"})}.bind(this),2e4)}.bind(this));$("#popup_start_hub_cancel").off().on("click",function(event){event.preventDefault();TemplateClass.hidePopup($("#popup_start_hub"))}.bind(this));$("#popup_start_success_hub_close").off().on("click",function(event){event.preventDefault();TemplateClass.hidePopup($("#popup_start_hub"))}.bind(this));$("#popup_start_error_hub_close").off().on("click",function(event){event.preventDefault();TemplateClass.hidePopup($("#popup_start_hub"))}.bind(this));$("#synchronisation_error_fourthDesc").off().on("click",function(event){event.preventDefault();console.log(event);this.generateEvent("ViewSubmitted",{origin:fields.id,state:"start_synchronisation"});this.displayPopupInfo("inprogress_synchronisation");fields.loadingTimer=window.setTimeout(function(){this.generateEvent("ViewSubmitted",{origin:fields.id,state:"get_synchronisation_state"})}.bind(this),2e4)}.bind(this));$("#synchronisation").off().on("click",function(event){event.preventDefault();this.generateEvent("ViewSubmitted",{origin:fields.id,state:"start_synchronisation"});fields.loadingTimer=window.setTimeout(function(){this.generateEvent("ViewSubmitted",{origin:fields.id,state:"get_synchronisation_state"})}.bind(this),2e4)}.bind(this));$("#format_init_secondDesc").attr("class","bodytxtred");basicUtilities.callback(aCallback,false,0,null)}],this)};this.displayPopupInfo=function(state){$("#format_inprogress_fourthDesc").css("width","10em");$("#format_inprogress_fourthDesc").css("display","block");$("#format_inprogress_fourthDesc").css("margin","0 auto");$("#eject_inprogress_fourthDesc").css("width","10em");$("#eject_inprogress_fourthDesc").css("display","block");$("#eject_inprogress_fourthDesc").css("margin","0 auto");$("#synchronisation_inprogress_secondDesc").css("width","10em");$("#synchronisation_inprogress_secondDesc").css("display","block");$("#synchronisation_inprogress_secondDesc").css("margin","0 auto");if(state==="init_format"){$("#format_init_title").show();$("#format_init_firstDesc").show();$("#format_init_secondDesc").show();$("#popup_format_init_button").show();$("#format_inprogress_title").hide();$("#format_inprogress_firstDesc").hide();$("#format_inprogress_secondDesc").hide();$("#format_inprogress_thirdDesc").hide();$("#format_inprogress_fourthDesc").hide();$("#format_success_title").hide();$("#format_success_firstDesc").hide();$("#popup_format_success_button").hide();$("#format_error_title").hide();$("#format_error_firstDesc").hide();$("#format_error_secondDesc").hide();$("#format_error_thirdDesc").hide();$("#format_error_fourthDesc").hide();$("#popup_format_error_button").hide();$("#progressId").hide()}else if(state==="inprogress_format"){if($("#progressBarId").length===0){TemplateClass.progressBarCreate("progressId","progressBarId")}TemplateClass.progressBarStop("progressBarId");TemplateClass.progressBarSetValue("progressBarId",0);TemplateClass.progressBarStartTimer("progressBarId",20,null);$("#format_init_title").hide();$("#format_init_firstDesc").hide();$("#format_init_secondDesc").hide();$("#popup_format_init_button").hide();$("#format_inprogress_title").show();$("#format_inprogress_firstDesc").show();$("#format_inprogress_secondDesc").show();$("#format_inprogress_thirdDesc").show();$("#format_inprogress_fourthDesc").show();$("#format_success_title").hide();$("#format_success_firstDesc").hide();$("#popup_format_success_button").hide();$("#format_error_title").hide();$("#format_error_firstDesc").hide();$("#format_error_secondDesc").hide();$("#format_error_thirdDesc").hide();$("#format_error_fourthDesc").hide();$("#popup_format_error_button").hide();$("#progressId").show()}else if(state==="error_format"){if(fields.loadingTimer){window.clearTimeout(fields.loadingTimer)}TemplateClass.hidePopup($("#popup_format_hub"));$("#format_init_title").hide();$("#format_init_firstDesc").hide();$("#format_init_secondDesc").hide();$("#popup_format_init_button").hide();$("#format_inprogress_title").hide();$("#format_inprogress_firstDesc").hide();$("#format_inprogress_secondDesc").hide();$("#format_inprogress_thirdDesc").hide();$("#format_inprogress_fourthDesc").hide();$("#format_success_title").hide();$("#format_success_firstDesc").hide();$("#format_success_secondDesc").hide();$("#format_success_thirdDesc").hide();$("#format_success_fourthDesc").hide();$("#popup_format_success_button").hide();$("#format_error_title").show();$("#format_error_firstDesc").show();$("#format_error_secondDesc").show();$("#format_error_thirdDesc").show();$("#format_error_fourthDesc").show();$("#popup_format_error_button").show();$("#progressId").hide()}else if(state==="success_format"){if(fields.loadingTimer){window.clearTimeout(fields.loadingTimer)}TemplateClass.hidePopup($("#popup_format_hub"));$("#format_init_title").hide();$("#format_init_firstDesc").hide();$("#format_init_secondDesc").hide();$("#popup_format_init_button").hide();$("#format_inprogress_title").hide();$("#format_inprogress_firstDesc").hide();$("#format_inprogress_secondDesc").hide();$("#format_inprogress_thirdDesc").hide();$("#format_inprogress_fourthDesc").hide();$("#format_success_title").show();$("#format_success_firstDesc").show();$("#popup_format_success_button").show();$("#format_error_title").hide();$("#format_error_firstDesc").hide();$("#format_error_secondDesc").hide();$("#format_error_thirdDesc").hide();$("#format_error_fourthDesc").hide();$("#popup_format_error_button").hide();$("#progressId").hide()}else if(state==="init_eject"){$("#eject_init_title").show();$("#eject_init_firstDesc").show();$("#eject_init_secondDesc").show();$("#popup_eject_init_button").show();$("#eject_inprogress_title").hide();$("#eject_inprogress_firstDesc").hide();$("#eject_inprogress_secondDesc").hide();$("#eject_inprogress_thirdDesc").hide();$("#eject_inprogress_fourthDesc").hide();$("#eject_success_title").hide();$("#eject_success_firstDesc").hide();$("#popup_eject_success_button").hide();$("#eject_error_title").hide();$("#eject_error_firstDesc").hide();$("#eject_error_secondDesc").hide();$("#eject_error_thirdDesc").hide();$("#eject_error_fourthDesc").hide();$("#popup_eject_error_button").hide();$(".spinner").hide()}else if(state==="inprogress_eject"){TemplateClass.spinnerAnimate();$("#eject_init_title").hide();$("#eject_init_firstDesc").hide();$("#eject_init_secondDesc").hide();$("#popup_eject_init_button").hide();$("#eject_inprogress_title").show();$("#eject_inprogress_firstDesc").show();$("#eject_inprogress_secondDesc").show();$("#eject_inprogress_thirdDesc").show();$("#eject_inprogress_fourthDesc").show();$("#eject_success_title").hide();$("#eject_success_firstDesc").hide();$("#popup_eject_success_button").hide();$("#eject_error_title").hide();$("#eject_error_firstDesc").hide();$("#eject_error_secondDesc").hide();$("#eject_error_thirdDesc").hide();$("#eject_error_fourthDesc").hide();$("#popup_eject_error_button").hide();$(".spinner").show()}else if(state==="error_eject"){if(fields.loadingTimer){window.clearTimeout(fields.loadingTimer)}TemplateClass.hidePopup($("#popup_eject_hub"));$("#eject_init_title").hide();$("#eject_init_firstDesc").hide();$("#eject_init_secondDesc").hide();$("#popup_eject_init_button").hide();$("#eject_inprogress_title").hide();$("#eject_inprogress_firstDesc").hide();$("#eject_inprogress_secondDesc").hide();$("#eject_inprogress_thirdDesc").hide();$("#eject_inprogress_fourthDesc").hide();$("#eject_success_title").hide();$("#eject_success_firstDesc").hide();$("#eject_success_secondDesc").hide();$("#eject_success_thirdDesc").hide();$("#eject_success_fourthDesc").hide();$("#popup_eject_success_button").hide();$("#eject_error_title").show();$("#eject_error_firstDesc").show();$("#eject_error_secondDesc").show();$("#eject_error_thirdDesc").show();$("#eject_error_fourthDesc").show();$("#popup_eject_error_button").show();$(".spinner").hide()}else if(state==="success_eject"){if(fields.loadingTimer){window.clearTimeout(fields.loadingTimer)}TemplateClass.hidePopup($("#popup_eject_hub"));$("#eject_init_title").hide();$("#eject_init_firstDesc").hide();$("#eject_init_secondDesc").hide();$("#popup_eject_init_button").hide();$("#eject_inprogress_title").hide();$("#eject_inprogress_firstDesc").hide();$("#eject_inprogress_secondDesc").hide();$("#eject_inprogress_thirdDesc").hide();$("#eject_inprogress_fourthDesc").hide();$("#eject_success_title").show();$("#eject_success_firstDesc").show();$("#popup_eject_success_button").show();$("#eject_error_title").hide();$("#eject_error_firstDesc").hide();$("#eject_error_secondDesc").hide();$("#eject_error_thirdDesc").hide();$("#eject_error_fourthDesc").hide();$("#popup_eject_error_button").hide();$(".spinner").hide()}else if(state==="init_stop"){$("#stop_init_title").show();$("#stop_init_firstDesc").show();$("#stop_init_secondDesc").show();$("#popup_stop_init_button").show();$("#stop_inprogress_title").hide();$("#stop_inprogress_firstDesc").hide();$("#stop_inprogress_secondDesc").hide();$("#stop_inprogress_thirdDesc").hide();$("#stop_inprogress_fourthDesc").hide();$("#stop_success_title").hide();$("#stop_success_firstDesc").hide();$("#stop_success_secondDesc").hide();$("#popup_stop_success_button").hide();$("#stop_error_title").hide();$("#stop_error_firstDesc").hide();$("#stop_error_secondDesc").hide();$("#stop_error_thirdDesc").hide();$("#stop_error_fourthDesc").hide();$("#popup_stop_error_button").hide();$("#stopHub_progressId").hide()}else if(state==="inprogress_stop"){if($("#stopHub_progressBarId").length===0){TemplateClass.progressBarCreate("stopHub_progressId","stopHub_progressBarId")}TemplateClass.progressBarStop("stopHub_progressBarId");TemplateClass.progressBarSetValue("stopHub_progressBarId",0);TemplateClass.progressBarStartTimer("stopHub_progressBarId",20,null);$("#stop_init_title").hide();$("#stop_init_firstDesc").hide();$("#stop_init_secondDesc").hide();$("#popup_stop_init_button").hide();$("#stop_inprogress_title").show();$("#stop_inprogress_firstDesc").show();$("#stop_inprogress_secondDesc").show();$("#stop_inprogress_thirdDesc").show();$("#stop_inprogress_fourthDesc").show();$("#stop_success_title").hide();$("#stop_success_firstDesc").hide();$("#stop_success_secondDesc").hide();$("#popup_stop_success_button").hide();$("#stop_error_title").hide();$("#stop_error_firstDesc").hide();$("#stop_error_secondDesc").hide();$("#stop_error_thirdDesc").hide();$("#stop_error_fourthDesc").hide();$("#popup_stop_error_button").hide();$("#stopHub_progressId").show()}else if(state==="error_stop"){if(fields.loadingTimer){window.clearTimeout(fields.loadingTimer)}TemplateClass.hidePopup($("#popup_stop_hub"));$("#stop_init_title").hide();$("#stop_init_firstDesc").hide();$("#stop_init_secondDesc").hide();$("#popup_stop_init_button").hide();$("#stop_inprogress_title").hide();$("#stop_inprogress_firstDesc").hide();$("#stop_inprogress_secondDesc").hide();$("#stop_inprogress_thirdDesc").hide();$("#stop_inprogress_fourthDesc").hide();$("#stop_success_title").hide();$("#stop_success_firstDesc").hide();$("#stop_success_secondDesc").hide();$("#stop_success_thirdDesc").hide();$("#stop_success_fourthDesc").hide();$("#popup_stop_success_button").hide();$("#stop_error_title").show();$("#stop_error_firstDesc").show();$("#stop_error_secondDesc").show();$("#stop_error_thirdDesc").show();$("#stop_error_fourthDesc").show();$("#popup_stop_error_button").show();$("#stopHub_progressId").hide()}else if(state==="success_stop"){if(fields.loadingTimer){window.clearTimeout(fields.loadingTimer)}TemplateClass.hidePopup($("#popup_stop_hub"));$("#stop_init_title").hide();$("#stop_init_firstDesc").hide();$("#stop_init_secondDesc").hide();$("#popup_stop_init_button").hide();$("#stop_inprogress_title").hide();$("#stop_inprogress_firstDesc").hide();$("#stop_inprogress_secondDesc").hide();$("#stop_inprogress_thirdDesc").hide();$("#stop_inprogress_fourthDesc").hide();$("#stop_success_title").show();$("#stop_success_firstDesc").show();$("#stop_success_secondDesc").show();$("#popup_stop_success_button").show();$("#stop_error_title").hide();$("#stop_error_firstDesc").hide();$("#stop_error_secondDesc").hide();$("#stop_error_thirdDesc").hide();$("#stop_error_fourthDesc").hide();$("#popup_stop_error_button").hide();$("#stopHub_progressId").hide()}else if(state==="init_start"){$("#start_init_title").show();$("#start_init_firstDesc").show();$("#start_init_secondDesc").show();$("#popup_start_init_button").show();$("#start_inprogress_title").hide();$("#start_inprogress_firstDesc").hide();$("#start_inprogress_secondDesc").hide();$("#start_inprogress_thirdDesc").hide();$("#start_inprogress_fourthDesc").hide();$("#start_success_title").hide();$("#start_success_firstDesc").hide();$("#start_success_secondDesc").hide();$("#popup_start_success_button").hide();$("#start_error_title").hide();$("#start_error_firstDesc").hide();$("#start_error_secondDesc").hide();$("#start_error_thirdDesc").hide();$("#start_error_fourthDesc").hide();$("#popup_start_error_button").hide();$("#startHub_progressId").hide()}else if(state==="inprogress_start"){if($("#startHub_progressBarId").length===0){TemplateClass.progressBarCreate("startHub_progressId","startHub_progressBarId")}TemplateClass.progressBarStop("startHub_progressBarId");TemplateClass.progressBarSetValue("startHub_progressBarId",0);TemplateClass.progressBarStartTimer("startHub_progressBarId",20,null);$("#start_init_title").hide();$("#start_init_firstDesc").hide();$("#start_init_secondDesc").hide();$("#popup_start_init_button").hide();$("#start_inprogress_title").show();$("#start_inprogress_firstDesc").show();$("#start_inprogress_secondDesc").show();$("#start_inprogress_thirdDesc").show();$("#start_inprogress_fourthDesc").show();$("#start_success_title").hide();$("#start_success_firstDesc").hide();$("#start_success_secondDesc").hide();$("#popup_start_success_button").hide();$("#start_error_title").hide();$("#start_error_firstDesc").hide();$("#start_error_secondDesc").hide();$("#start_error_thirdDesc").hide();$("#start_error_fourthDesc").hide();$("#popup_start_error_button").hide();$("#startHub_progressId").show()}else if(state==="error_start"){if(fields.loadingTimer){window.clearTimeout(fields.loadingTimer)}TemplateClass.hidePopup($("#popup_start_hub"));$("#start_init_title").hide();$("#start_init_firstDesc").hide();$("#start_init_secondDesc").hide();$("#popup_start_init_button").hide();$("#start_inprogress_title").hide();$("#start_inprogress_firstDesc").hide();$("#start_inprogress_secondDesc").hide();$("#start_inprogress_thirdDesc").hide();$("#start_inprogress_fourthDesc").hide();$("#start_success_title").hide();$("#start_success_firstDesc").hide();$("#start_success_secondDesc").hide();$("#start_success_thirdDesc").hide();$("#start_success_fourthDesc").hide();$("#popup_start_success_button").hide();$("#start_error_title").show();$("#start_error_firstDesc").show();$("#start_error_secondDesc").show();$("#start_error_thirdDesc").show();$("#start_error_fourthDesc").show();$("#popup_start_error_button").show();$("#startHub_progressId").hide()}else if(state==="success_start"){if(fields.loadingTimer){window.clearTimeout(fields.loadingTimer)}TemplateClass.hidePopup($("#popup_start_hub"));$("#start_init_title").hide();$("#start_init_firstDesc").hide();$("#start_init_secondDesc").hide();$("#popup_start_init_button").hide();$("#start_inprogress_title").hide();$("#start_inprogress_firstDesc").hide();$("#start_inprogress_secondDesc").hide();$("#start_inprogress_thirdDesc").hide();$("#start_inprogress_fourthDesc").hide();$("#start_success_title").show();$("#start_success_firstDesc").show();$("#start_success_secondDesc").show();$("#popup_start_success_button").show();$("#start_error_title").hide();$("#start_error_firstDesc").hide();$("#start_error_secondDesc").hide();$("#start_error_thirdDesc").hide();$("#start_error_fourthDesc").hide();$("#popup_start_error_button").hide();$("#startHub_progressId").hide()}TemplateClass.positionPopup($("#popup_format_hub"));TemplateClass.positionPopup($("#popup_eject_hub"));TemplateClass.positionPopup($("#popup_stop_hub"));TemplateClass.positionPopup($("#popup_start_hub"))};this.toggleStopButton=function(isEnabled){if(isEnabled){$("#stop").show();$("#start").hide()}else{$("#stop").hide();$("#start").show()}}}return HubMaintenanceViewClass});