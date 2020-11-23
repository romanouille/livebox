define(["utils/console","utils/basics","lib/eventHandler","lib/stateViewInterface","jquery","text","templates_app/template","text!bootstrap/bootstrap.css","text!app/config/internetState.json"],function(console,basicUtilities,EventHandlerClass,StateViewClass,$,Text,TemplateClass,Bootstrap,Config){"use strict";function InternetStateViewClass(aStateId,aTranslateObj){var fields,formatDate=function(secs){var date,hours,minutes,day,month,year,strTime,strDay;if(secs===""){return""}date=(new Date).getTime()-parseInt(secs,10)*1e3;date=new Date(date);hours=date.getHours();minutes=date.getMinutes();day=date.getDate();month=date.getMonth()+1;year=date.getFullYear();hours=hours%24;hours=hours<10?"0"+hours:hours;minutes=minutes<10?"0"+minutes:minutes;strTime=hours+"<span class='Translation' data-translation='internetState.hour'></span>"+minutes+"<span class='Translation' data-translation='internetState.minute'></span>";day=date.getDate();month=date.getMonth()+1;year=date.getFullYear();day=day<10?"0"+day:day;month=month<10?"0"+month:month;year=year<10?"0"+year:year;strDay=day+"/"+month+"/"+year;return strDay+" <span class='Translation' data-translation='internetState.at'></span> "+strTime};fields={language:{id:"",data:{}}};StateViewClass.call(this,aStateId,aTranslateObj);this.init=function(aCallback){console.debug("InternetStateViewClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.setStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{this.notifyError("InternetStateViewClass: Initialising state '"+this.getId()+"'","rra0212");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.quit=function(aCallback){console.debug("InternetStateViewClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.unsetStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{this.notifyError("InternetStateViewClass: Releasing state '"+this.getId()+"'","rra0213");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.enable=function(aCallback){console.debug("InternetStateViewClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.setAppCloseButton(aNext,"app_close")},function(aNext){this.viewDisplayPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{this.notifyError("InternetStateViewClass: Enabling state '"+this.getId()+"'","rra0214");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.disable=function(aCallback){console.debug("InternetStateViewClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.viewEmptyPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{this.notifyError("InternetStateViewClass: Disabling state '"+this.getId()+"'","rra0215");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.stripLines=function(aCallback,aString){basicUtilities.callback(aCallback,false,0,aString.replace(/(\r\n|\n|\r|\t)/gm,""))};this.fillTemplate=function(aCallback,template,context){basicUtilities.queue([function(aNext){this.stripLines(aNext,context)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,template(JSON.parse(aResult.data)))}else{this.notifyError("InternetStateViewClass: fillTemplate failed","rra0216");basicUtilities.callback(aCallback,false,-1,null)}}],this)};this.setStyle=function(aCallback){basicUtilities.queue([function(aNext){this.stripLines(aNext,Bootstrap)},function(aNext,aResult){if(!aResult||aResult.status===0){if(!$("#app_conf_style_sheet").length){$("head").append('<style id="app_conf_style_sheet">'+aResult.data+"</style>")}if(!$("#bootstrap_style_sheet").length){$("head").append('<style id="bootstrap_style_sheet">'+TemplateClass.style+"</style>")}basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("InternetStateViewClass: setStyle failed","rra0217")}}],this)};this.unsetStyle=function(aCallback){if($("#app_conf_style_sheet").length){$("head").children("#app_conf_style_sheet").remove()}if($("#bootstrap_style_sheet").length){$("head").children("#bootstrap_style_sheet").remove()}basicUtilities.callback(aCallback,false,0,null)};this.viewEmptyPage=function(aCallback){$(window.document.body).html();basicUtilities.callback(aCallback,false,0,null)};this.viewDisplayPage=function(aCallback){basicUtilities.queue([function(aNext){this.fillTemplate(aNext,TemplateClass.template,Config)},function(aNext,aResult){if(!aResult||aResult.status===0){$(window.document.body).html(aResult.data);this.translate();this.setPageTitle(null,$(".header-title").find("h1").find("span").html());$(".toggleonoff-label:eq(2)").parent().hide();$(".toggleonoff-label:eq(3)").parent().hide();aNext()}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("InternetStateViewClass: Failed to fill template with config data","rra0218")}},function(){basicUtilities.callback(aCallback,false,0,null)}],this)};this.displayInternetInfo=function(dataObject){console.debug(dataObject);if(dataObject.wanStatus.linkModeList[0].state==="OK"){$(".form-toggleinfo-container span:eq(0)").attr("class","Translation");$(".form-toggleinfo-container span:eq(0)").attr("data-translation","internetState.state.disponible")}else{$(".form-toggleinfo-container span:eq(0)").attr("class","Translation");$(".form-toggleinfo-container span:eq(0)").attr("data-translation","internetState.state.indisponible")}$(".toggleinfo-input:eq(1)").attr("class","col-xs-3 no-padding toggleinfo-input");if(typeof dataObject.currentConfiguration.FTTH!=="undefined"){$(".form-toggleinfo-container:eq(1)").html(formatDate(dataObject.currentConfiguration.FTTH.connectionDuration));$(".toggleonoff-label:eq(2)").parent().hide();$(".toggleonoff-label:eq(3)").parent().hide()}if(typeof dataObject.currentConfiguration.DSL!=="undefined"){$(".toggleonoff-label:eq(2)").parent().show();$(".toggleonoff-label:eq(3)").parent().show();$(".form-toggleinfo-container:eq(1)").html(formatDate(dataObject.currentConfiguration.DSL.connectionDuration));if(parseInt(dataObject.currentConfiguration.DSL.downloadBandwidth/1024)===0){$(".form-toggleinfo-container:eq(2)").text(dataObject.currentConfiguration.DSL.downloadBandwidth+" Kbit/s")}else{$(".form-toggleinfo-container:eq(2)").text(parseInt(dataObject.currentConfiguration.DSL.downloadBandwidth/1024)+" Mbit/s")}if(parseInt(dataObject.currentConfiguration.DSL.uploadBandwidth/1024)===0){$(".form-toggleinfo-container:eq(3)").text(dataObject.currentConfiguration.DSL.uploadBandwidth+" Kbit/s")}else{$(".form-toggleinfo-container:eq(3)").text(parseInt(dataObject.currentConfiguration.DSL.uploadBandwidth/1024)+" Mbit/s")}}$(".form-toggleinfo-container:eq(4)").text(dataObject.wanStatus.linkModeList[0].linkMode);this.translate()}}return InternetStateViewClass});