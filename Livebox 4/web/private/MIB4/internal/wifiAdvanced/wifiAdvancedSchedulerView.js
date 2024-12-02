define(["utils/console","utils/basics","lib/eventHandler","lib/stateViewInterface","jquery","text","templates_app/template","text!bootstrap/bootstrap.css","json!app/config/wifiScheduler.json","app/wifiAdvancedSharedView"],function(console,basicUtilities,EventHandlerClass,StateViewClass,$,Text,TemplateClass,Bootstrap,Config,SharedViewClass){"use strict";function WifiAdvancedSchedulerViewClass(aStateId,aTranslateObj){this.fields={loggedUserBehaviour:{lastFocusedElt:[],lastClickedElt:[],lastRelevantElt:""},currentData:{},knownProfiles:["eco","weekdays","holidays","custom"],defaultScheduleValues:{eco:[0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0],weekdays:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],holidays:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0],custom:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},defaultScheduleValuesFormatted:{eco:[{start:0,end:25200},{start:32400,end:61200},{start:79200,end:111600},{start:118800,end:147600},{start:165600,end:198e3},{start:205200,end:234e3},{start:252e3,end:284400},{start:291600,end:320400},{start:338400,end:370800},{start:378e3,end:406800},{start:424800,end:457200},{start:464400,end:493200},{start:511200,end:543600},{start:550800,end:579600},{start:597600,end:604800}],weekdays:[{start:0,end:61200},{start:79200,end:147600},{start:165600,end:234e3},{start:252e3,end:320400},{start:338400,end:406800},{start:424800,end:460800},{start:518400,end:547200}],holidays:[{start:0,end:50400},{start:79200,end:136800},{start:165600,end:223200},{start:252e3,end:309600},{start:338400,end:396e3},{start:424800,end:482400},{start:511200,end:568800},{start:597600,end:604800}],custom:[]}};StateViewClass.call(this,aStateId,aTranslateObj);this.init=function(aCallback){console.debug("WifiAdvancedSchedulerViewClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){SharedViewClass.import(aNext,this)},function(aNext,aResult){if(!aResult||aResult.status===0){this.setStyle(aNext)}else{basicUtilities.callback(aNext,false,0,null);this.notifyError("WifiAdvancedSchedulerViewClass: Failed to import share view class","aba0089")}},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("WifiAdvancedSchedulerViewClass: Failed to set style","aba0090")}}],this)};this.quit=function(aCallback){console.debug("WifiAdvancedSchedulerViewClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.unsetStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("WifiAdvancedSchedulerViewClass: Failed to unset style","aba0091")}}],this)};this.enable=function(aCallback){console.debug("WifiAdvancedSchedulerViewClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){$(document).off("click","#app_close");$(document).off("keypress","#app_close");$(document).on("click","#app_close",function(event){event.preventDefault();window.location.hash="#summary"});$(document).on("keypress","#app_close",function(event){var keyCode=event.keyCode||event.which;if(keyCode===13){event.preventDefault();$("#app_close").trigger("click")}});basicUtilities.callback(aNext,false,0,null)},function(aNext,aResult){if(!aResult||aResult.status===0){this.viewDisplayPage(aNext)}else{basicUtilities.callback(aNext,false,0,null);this.notifyError("WifiAdvancedSchedulerViewClass: Failed to set app close button","aba0092")}},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("WifiAdvancedSchedulerViewClass: Failed to display view","aba0093")}}],this)};this.disable=function(aCallback){console.debug("WifiAdvancedSchedulerViewClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.viewEmptyPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("WifiAdvancedSchedulerViewClass: Failed to empty view","aba0094")}}],this)};this.formatSchedule=function(aTimetable){var result=[],topLimit=0,bottomLimit=0,previousState=1,index;if(aTimetable.length>0){aTimetable[aTimetable.length]=1;for(index=0;index<aTimetable.length;index=index+1){if(aTimetable[index]===0&&previousState===1){topLimit=index}else if(aTimetable[index]===1&&previousState===0){bottomLimit=index;result.push({start:topLimit*3600,end:bottomLimit*3600})}previousState=aTimetable[index]}}return result};this.unformatSchedule=function(timeTable){var result=[],index,subindex,start=0,stop=0;for(index=0;index<168;index=index+1){result[index]=1}for(index=0;index<timeTable.length;index=index+1){start=timeTable[index].start/3600;stop=timeTable[index].end/3600;for(subindex=start;subindex<stop;subindex=subindex+1){result[subindex]=0}}return result};this.isSameSchedule=function(schedule1,schedule2){var index;if(schedule1.length!==schedule2.length){return false}for(index=0;index<schedule1.length;index=index+1){if(schedule1[index].start!==schedule2[index].start){return false}if(schedule1[index].end!==schedule2[index].end){return false}}return true};this.recognizeSchedule=function(schedule){if(this.isSameSchedule(schedule,this.fields.defaultScheduleValuesFormatted.eco)){return"eco"}if(this.isSameSchedule(schedule,this.fields.defaultScheduleValuesFormatted.weekdays)){return"weekdays"}if(this.isSameSchedule(schedule,this.fields.defaultScheduleValuesFormatted.holidays)){return"holidays"}return"custom"};this.setValuesOnScheduler=function(aCallback,aSchedulerId,aValues){TemplateClass.setValuesOnScheduler(aSchedulerId,aValues,this.translate);basicUtilities.callback(aCallback,false,0,null)};this.inSwitchScheduleProfile=function(aCallback,profileName){var index,possibleProfilName;possibleProfilName=this.fields.knownProfiles;for(index=0;index<possibleProfilName.length;index=index+1){if(possibleProfilName[index]===profileName){$("#wifi_scheduler_"+possibleProfilName[index]).show();$("#wifi_scheduler_profile_"+possibleProfilName[index]).addClass("sub-menu-button-selected");$("#wifi_scheduler_profile_"+possibleProfilName[index]).attr("aria-pressed",true);$("#wifi_scheduler_profile_"+possibleProfilName[index]).off("click");$("#wifi_scheduler_profile_"+possibleProfilName[index]).off("keypress")}else{$("#wifi_scheduler_"+possibleProfilName[index]).hide();$("#wifi_scheduler_profile_"+possibleProfilName[index]).removeClass("sub-menu-button-selected");$("#wifi_scheduler_profile_"+possibleProfilName[index]).attr("aria-pressed",false);$("#wifi_scheduler_profile_"+possibleProfilName[index]).off("click");$("#wifi_scheduler_profile_"+possibleProfilName[index]).on("click",{currentprofileNameValue:possibleProfilName[index]},function(event){event.preventDefault();this.inSwitchScheduleProfile(null,event.data.currentprofileNameValue)}.bind(this));$("#wifi_scheduler_profile_"+possibleProfilName[index]).on("keypress",{currentprofileNameValue:possibleProfilName[index]},function(event){var keyCode=event.keyCode||event.which;if(keyCode===13){event.preventDefault();$("#wifi_scheduler_profile_"+event.data.currentprofileNameValue).trigger("click")}}.bind(this))}}basicUtilities.callback(aCallback,false,0,null)};this.viewDisplayPage=function(aCallback){basicUtilities.queue([function(aNext){this.fillTemplate(aNext,TemplateClass.template,Config)},function(aNext,aResult){if(!aResult||aResult.status===0){$(window.document.body).html(aResult.data);TemplateClass.enableSchedule("wifi_scheduler_custom",this.translate);$("#wifi_scheduler_enable_id_all").closest(".checkbox-container").css({"margin-top":"3em","margin-bottom":"2.5em"});$("#wifi_scheduler_profile_submenu").css({"padding-top":"1.25em"});aNext()}else{basicUtilities.callback(aNext,false,0,null);this.notifyError("WifiAdvancedSchedulerViewClass: Failed to fill template with config data","aba0095")}},function(aNext){if(this.fields.currentData.getGlobalWifiStatus.isActivated){if(this.fields.currentData.getGlobalWifiStatus.useSchedule&&!this.fields.currentData.getGlobalWifiStatus.isScheduleOverridden){$("#scheduler_timeslot_state").html("<span class='Translation' data-translation='wifiAdvanced.wifischeduler.stateactivatedbyscheduler'></span>")}else{$("#scheduler_timeslot_state").html("<span class='Translation' data-translation='wifiAdvanced.wifischeduler.stateactivatedbybutton'></span>")}}else{if(this.fields.currentData.getGlobalWifiStatus.useSchedule&&!this.fields.currentData.getGlobalWifiStatus.isScheduleOverridden){$("#scheduler_timeslot_state").html("<span class='Translation' data-translation='wifiAdvanced.wifischeduler.statedeactivatedbyscheduler'></span>")}else{$("#scheduler_timeslot_state").html("<span class='Translation' data-translation='wifiAdvanced.wifischeduler.statedeactivatedbybutton'></span>")}}this.translate();this.setCheckedInput(aNext,"wifi_scheduler_enable_id_all",this.fields.currentData.getGlobalWifiStatus.useSchedule)},function(aNext,aResult){if(!aResult||aResult.status===0){$("#wifi_scheduler_eco").attr("aria-hidden",true);$("#wifi_scheduler_weekdays").attr("aria-hidden",true);$("#wifi_scheduler_holidays").attr("aria-hidden",true);$("#wifi_scheduler_custom").find(".scheduler-legend").attr("aria-hidden",true);this.setValuesOnScheduler(aNext,"wifi_scheduler_eco",this.fields.defaultScheduleValues.eco)}else{basicUtilities.callback(aNext,false,0,null);this.notifyError("WifiAdvancedSchedulerViewClass: Failed to set view of schedule status","aba0096")}},function(aNext,aResult){if(!aResult||aResult.status===0){this.setValuesOnScheduler(aNext,"wifi_scheduler_weekdays",this.fields.defaultScheduleValues.weekdays)}else{basicUtilities.callback(aNext,false,0,null);this.notifyError("WifiAdvancedSchedulerViewClass: Failed to set values on eco schedule in view","aba0097")}},function(aNext,aResult){if(!aResult||aResult.status===0){this.setValuesOnScheduler(aNext,"wifi_scheduler_holidays",this.fields.defaultScheduleValues.holidays)}else{basicUtilities.callback(aNext,false,0,null);this.notifyError("WifiAdvancedSchedulerViewClass: Failed to set values on weekdays schedule in view","aba0098")}},function(aNext,aResult){var customValues;if(!aResult||aResult.status===0){if(this.fields.currentData.hasOwnProperty("getSchedule")){if(this.fields.currentData.getSchedule.hasOwnProperty("scheduleList")){customValues=this.unformatSchedule(this.fields.currentData.getSchedule.scheduleList)}else{customValues=this.fields.defaultScheduleValues.custom}}else{customValues=this.fields.defaultScheduleValues.custom}this.setValuesOnScheduler(aNext,"wifi_scheduler_custom",customValues);basicUtilities.callback(aNext,false,0,null)}else{basicUtilities.callback(aNext,false,0,null);this.notifyError("WifiAdvancedSchedulerViewClass: Failed to set values on holidays schedule in view","aba0099")}},function(aNext,aResult){var scheduleRetrieved;if(!aResult||aResult.status===0){if(this.fields.currentData.hasOwnProperty("getSchedule")){if(this.fields.currentData.getSchedule.hasOwnProperty("scheduleList")){scheduleRetrieved=this.fields.currentData.getSchedule.scheduleList}else{scheduleRetrieved=this.fields.defaultScheduleValuesFormatted.custom}}else{scheduleRetrieved=this.fields.defaultScheduleValuesFormatted.custom}this.viewSetTimeSlotValue(null,this.fields.currentData.getTime.time,scheduleRetrieved);$(document).ready(function(){this.inSwitchScheduleProfile(null,this.recognizeSchedule(scheduleRetrieved))}.bind(this));$("#wifi_scheduler_enable_id_all").change(function(){this.setDisabledInput(null,"save",false)}.bind(this));$("#wifi_scheduler_profile_eco, #wifi_scheduler_profile_weekdays, #wifi_scheduler_profile_holidays, #wifi_scheduler_profile_custom").on("click",function(){this.setDisabledInput(null,"save",false)}.bind(this));$("#wifi_scheduler_custom").find(".scheduler-case").mousedown(function(){this.setDisabledInput(null,"save",false)}.bind(this));$("#wifi_scheduler_custom").find(".scheduler-case").keydown(function(event){if(event.keyCode===13){this.setDisabledInput(null,"save",false)}}.bind(this));aNext()}else{basicUtilities.callback(aNext,false,0,null);this.notifyError("WifiAdvancedSchedulerViewClass: Failed to set values on custom schedule in view","aba0100")}},function(){this.setPageTitle(null,$(".header-title").find("h1").html());$("#cancel").on("click",function(event){event.preventDefault();window.location.hash="#summary"}.bind(this));$("#save").on("click",function(event){var test=this.isWifiScheduledToTurnOffNow(this.fields.currentData.getTime.time);event.preventDefault();if(this.fields.currentData.isWifiUsedByDevices&&test){TemplateClass.showPopup($("#popup_confirm"));$("#popup_confirm_submit").off("click");$("#popup_confirm_submit").on("click",function(){TemplateClass.hidePopup($("#popup_confirm"));this.fireEvent("ViewSubmitted",{value:this.viewRetrieveScheduleList(null)})}.bind(this))}else{this.fireEvent("ViewSubmitted",{value:this.viewRetrieveScheduleList(null)})}}.bind(this));$("#popup_confirm_cancel").on("click",function(){TemplateClass.hidePopup($("#popup_confirm"))});this.setDisabledInput(null,"save",true);basicUtilities.callback(aCallback,false,0,null)}],this)};this.viewSetTimeSlotValue=function(aCallback,aDate){var result,hour,dateArray=aDate.split(" ");hour=dateArray[4].split(":")[0];result=hour+":00 - "+(parseInt(hour,10)+1).toString()+":00";$("#scheduler_timeslot_value").html(result);return true};this.viewRetrieveScheduleList=function(){var result={},scheduleList=[];$(".scheduler-container").each(function(){if($(this).css("display")==="block"){$(this).find(".scheduler-case").each(function(){if($(this).hasClass("scheduler-case-filled")){scheduleList.push(1)}else{scheduleList.push(0)}})}});if(scheduleList.length===168){result.scheduleList=this.formatSchedule(scheduleList);result.useSchedule=$("#wifi_scheduler_enable_id_all").prop("checked");return result}console.error("WifiAdvancedSchedulerViewClass: could not retrieve schedule data on form");return false};this.isWifiScheduledToTurnOffNow=function(aDate){var result,dateArray=aDate.split(" "),dayMultiplicator=0,hour,dataSchedule="";switch(dateArray[0].substr(0,3)){case"Tue":dayMultiplicator=1;break;case"Wed":dayMultiplicator=2;break;case"Thu":dayMultiplicator=3;break;case"Fri":dayMultiplicator=4;break;case"Sat":dayMultiplicator=5;break;case"Sun":dayMultiplicator=6;break;case"Mon":dayMultiplicator=0;break;default:dayMultiplicator=0;break}hour=parseInt(dateArray[4].split(":")[0],10);dataSchedule="day"+dayMultiplicator.toString()+"_"+(hour.toString().length===1?"0"+hour.toString():hour.toString());$(".scheduler-container").each(function(){if($(this).css("display")==="block"){$(this).find(".scheduler-case[data-schedule='"+dataSchedule+"']").each(function(){if(!$(this).hasClass("scheduler-case-filled")){result=true}else{result=false}})}});return result}}return WifiAdvancedSchedulerViewClass});