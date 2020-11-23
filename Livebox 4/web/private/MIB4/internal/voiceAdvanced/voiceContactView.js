define(["utils/console","utils/basics","lib/eventHandler","lib/stateViewInterface","jquery","text","templates_app/template","text!bootstrap/bootstrap.css","text!app/config/contacts.json"],function(console,basicUtilities,EventHandlerClass,StateViewClass,$,Text,TemplateClass,Bootstrap,Config){"use strict";function VoiceContactViewClass(aStateId,aTranslateObj){var fields,validatePhone=function(phoneNumber){var phoneNumberPattern=/^([\+|\*|\#])*(\*|\#|[0-9]*)*$/;return phoneNumberPattern.test(phoneNumber)},toggleSaveButton=function(){if(($("#firstname").val()+$("#lastname").val()).trim().length===0){$("#popup_updatecontact_update").attr("disabled",true)}else if(($("#mobile").val()+$("#office").val()+$("#home").val()).trim().length===0){$("#popup_updatecontact_update").attr("disabled",true)}else{$("#popup_updatecontact_update").attr("disabled",false)}},deleteContact=function(event){event.preventDefault();fields.selected=parseInt($(event.target).parent().parent().parent().children(":first-child").children(":first-child").attr("id").split("_")[1],10);this.generateEvent("ViewSubmitted",{origin:fields.id,state:"confirm_delete_contact",param:fields.dataContactsTable[fields.selected].defaultvalue[0].split(">")[3].split("<")[0]})},editContact=function(event){event.preventDefault();TemplateClass.showPopup($("#popup_update_contact"));$("#popup_update_contact .title").html('<span data-translation="voiceAdvanced.journal.popup.updatecontact.title" class="Translation"></span>');$("#popup_updatecontact_update").attr("data-translation","voiceAdvanced.journal.popup.updatecontact.update");fields.selected=parseInt(event.target.id.split("_")[1],10);this.generateEvent("ViewSubmitted",{origin:fields.id,state:"get_contact",param:fields.dataContactsTable[fields.selected].defaultvalue[0].split(">")[3].split("<")[0]});$("#popup_update_contact span:eq(1)").hide();this.translate()},displayContactTable=function(aList){var context={type:"dynamictable",label:"",id:"contacts_telephone_table",titlevalue:["<span class='Translation' data-translation='voiceAdvanced.contacts.headtable.name'></span>","<span class='Translation' data-translation='voiceAdvanced.contacts.headtable.number'></span>","<span class='Translation' data-translation='voiceAdvanced.contacts.headtable.place'></span>","<span class='Translation' data-translation='voiceAdvanced.contacts.headtable.ring'></span>"],value:aList};if(aList.length===0){context={type:"dynamictable",label:"",emptyLabel:"<span class='Translation' data-translation='voiceAdvanced.contacts.empty'></span>",id:"contacts_telephone_table",titlevalue:["<span class='Translation' data-translation='voiceAdvanced.contacts.headtable.name'></span>","<span class='Translation' data-translation='voiceAdvanced.contacts.headtable.number'></span>","<span class='Translation' data-translation='voiceAdvanced.contacts.headtable.place'></span>","<span class='Translation' data-translation='voiceAdvanced.contacts.headtable.ring'></span>"],value:[]}}basicUtilities.queue([function(aNext){TemplateClass.boundDataTable($("#contacts_telephone_table"),context);aNext()},function(){listenViewEvents.call(this);this.translate()}],this)},filterContactTable=function(val){function checkContact(value){if(value.defaultvalue[0].split(">")[1].split("<")[0].toLowerCase().indexOf(val.toLowerCase())>-1||value.defaultvalue[1].split("<")[0].toLowerCase().indexOf(val.toLowerCase())>-1){return true}return false}var list=fields.dataContactsTable.filter(checkContact);if(Object.doCompare(fields.oldListContacts,list)!==""){displayContactTable.call(this,list)}fields.oldListContacts=list},listenViewEvents=function(){var index;if(this){$("#tab_template_container").off().on("keydown",function(event){var keyCode=event.keyCode||event.which;if(keyCode===39){event.preventDefault();this.generateEvent("ViewSubmitted",{origin:fields.id,state:"associate"})}else if(keyCode===37){event.preventDefault();this.generateEvent("ViewSubmitted",{origin:fields.id,state:"journal"})}}.bind(this));$("#tab_telephone_status").off().on("click",function(){this.generateEvent("ViewSubmitted",{origin:fields.id,state:"status"})}.bind(this));$("#tab_telephone_contacts").off().on("click",function(){this.generateEvent("ViewSubmitted",{origin:fields.id,state:"contacts"})}.bind(this));$("#tab_telephone_journal").off().on("click",function(){this.generateEvent("ViewSubmitted",{origin:fields.id,state:"journal"})}.bind(this));$("#tab_telephone_associate").off().on("click",function(){this.generateEvent("ViewSubmitted",{origin:fields.id,state:"associate"})}.bind(this))}if(basicUtilities.getCookie("missedCall")>0){$("#missedCall").text(" ("+basicUtilities.getCookie("missedCall")+") ")}else{$("#missedCall").text("")}$("#search").off().on("input",function(event){event.preventDefault();filterContactTable.call(this,$("#search").val())}.bind(this));$(".searchfield-cancel").off().on("click",function(event){event.preventDefault();$("#search").val("");filterContactTable.call(this,$("#search").val())}.bind(this));$("#add_contact").off().on("click",function(event){event.preventDefault();TemplateClass.showPopup($("#popup_update_contact"));$("#popup_update_contact .title").html('<span data-translation="voiceAdvanced.journal.popup.addcontact.title" class="Translation"></span>');$("#popup_updatecontact_update").attr("data-translation","voiceAdvanced.journal.popup.addcontact.add");this.displayContact();$("#popup_update_contact span:eq(1)").hide();this.translate()}.bind(this));for(index=0;index<fields.dataContactsTable.length;index+=1){$("#contacts_telephone_table_delete_"+index).off().on("click",deleteContact.bind(this));$(".conf-table-cell a:eq("+index+")").off().on("click",editContact.bind(this))}$("#popup_updatecontact_cancel").off().on("click",function(event){event.preventDefault();$(".txtandfield-container:eq(2) div").attr("class","row txtandfield-text-input");$(".txtandfield-container:eq(3) div").attr("class","row txtandfield-text-input");$(".txtandfield-container:eq(4) div").attr("class","row txtandfield-text-input");$("#popup_update_contact span:eq(1)").attr("class","");$("#popup_update_contact span:eq(1)").hide();TemplateClass.hidePopup($("#popup_update_contact"))}.bind(this));$("#popup_updatecontact_update").off().on("click",function(event){var contact;event.preventDefault();if(!validatePhone($("#mobile").val())){$("#popup_update_contact span:eq(1)").show();$("#popup_update_contact span:eq(1)").attr("class","redtxt");$(".txtandfield-container:eq(3) div").attr("class","row txtandfield-text-input");$(".txtandfield-container:eq(4) div").attr("class","row txtandfield-text-input");$(".txtandfield-container:eq(2) div").attr("class","row txtandfield-text-input-red")}else if(!validatePhone($("#office").val())){$("#popup_update_contact span:eq(1)").show();$("#popup_update_contact span:eq(1)").attr("class","redtxt");$(".txtandfield-container:eq(2) div").attr("class","row txtandfield-text-input");$(".txtandfield-container:eq(4) div").attr("class","row txtandfield-text-input");$(".txtandfield-container:eq(3) div").attr("class","row txtandfield-text-input-red")}else if(!validatePhone($("#home").val())){$("#popup_update_contact span:eq(1)").show();$("#popup_update_contact span:eq(1)").attr("class","redtxt");$(".txtandfield-container:eq(2) div").attr("class","row txtandfield-text-input");$(".txtandfield-container:eq(3) div").attr("class","row txtandfield-text-input");$(".txtandfield-container:eq(4) div").attr("class","row txtandfield-text-input-red")}else{$(".txtandfield-container:eq(2) div").attr("class","row txtandfield-text-input");$(".txtandfield-container:eq(3) div").attr("class","row txtandfield-text-input");$(".txtandfield-container:eq(4) div").attr("class","row txtandfield-text-input");$("#popup_update_contact span:eq(1)").attr("class","");$("#popup_update_contact span:eq(1)").hide();contact={givenName:$("#firstname").val(),familyName:$("#lastname").val(),formattedName:$("#lastname").val()+" "+$("#firstname").val(),birthDay:"",title:"",organisation:"",url:"",isFavourite:false,ringtoneId:$("#ring option:selected").text(),emailList:[],addressList:[],phoneNumberList:[]};if($("#mobile").val()!==""){contact.phoneNumberList.push({number:$("#mobile").val().toString(),type:"CELL",preferred:false})}if($("#office").val()!==""){contact.phoneNumberList.push({number:$("#office").val().toString(),type:"WORK",preferred:false})}if($("#home").val()!==""){contact.phoneNumberList.push({number:$("#home").val().toString(),type:"HOME",preferred:false})}if($("#popup_update_contact .title").html().indexOf("updatecontact")>0){contact.contactId=fields.dataContactsTable[fields.selected].defaultvalue[0].split(">")[3].split("<")[0];this.generateEvent("ViewSubmitted",{origin:fields.id,state:"update_contact",param:contact})}else{this.generateEvent("ViewSubmitted",{origin:fields.id,state:"add_contact",param:contact})}TemplateClass.hidePopup($("#popup_update_contact"))}}.bind(this));$("#firstname, #lastname, #home, #office, #mobile").off().on("input",function(event){event.preventDefault();toggleSaveButton.call(this)}.bind(this));$("#popup_delete").off().on("click",function(event){event.preventDefault();$("#contacts_telephone_table_table .conf-table-row:eq("+fields.selected+")").remove();this.generateEvent("ViewSubmitted",{origin:fields.id,state:"delete_contact",param:fields.contactToDelete.contactId});TemplateClass.hidePopup($("#popup_delete_contacts"))}.bind(this));$("#popup_cancel").off().on("click",function(){TemplateClass.hidePopup($("#popup_delete_contacts"))}.bind(this));$("#popup_ring_form a").off().on("click",function(event){event.preventDefault();this.generateEvent("ViewSubmitted",{origin:fields.id,state:"ringtest",param:$("#ring option:selected").text()})}.bind(this))};fields={language:{id:"",data:{}},loggedUserBehaviour:{lastFocusedElt:[],lastClickedElt:[],lastRelevantElt:""},currentData:{},maxNumberOfContacts:0,selected:0,oldListContacts:[],dataContact:[],dataContactsTable:[],contactToDelete:null};StateViewClass.call(this,aStateId,aTranslateObj);this.init=function(aCallback){console.debug("VoiceContactViewClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.setStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("VoiceContactViewClass: Initialising state '"+this.getId()+"'","rra0059")}}],this)};this.quit=function(aCallback){console.debug("VoiceContactViewClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.unsetStyle(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("VoiceContactViewClass: Releasing state '"+this.getId()+"'","rra0060")}}],this)};this.enable=function(aCallback){console.debug("VoiceContactViewClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.setAppCloseButton(aNext,"app_close")},function(aNext){this.viewDisplayPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("VoiceContactViewClass: Enabling state '"+this.getId()+"'","rra0061")}}],this)};this.disable=function(aCallback){console.debug("VoiceContactViewClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){fields.dataContactsTable=[];this.viewEmptyPage(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("VoiceContactViewClass: Disabling state '"+this.getId()+"'","rra0062")}}],this)};this.logUserBehaviour=function(aCallback){$(window.document).on("click",function(event){if(fields.loggedUserBehaviour.lastClickedElt.length>10){fields.loggedUserBehaviour.lastClickedElt.shift()}fields.loggedUserBehaviour.lastClickedElt.push($(event.target))});$(window.document).on("focus",function(event){if(fields.loggedUserBehaviour.lastFocusedElt.length>10){fields.loggedUserBehaviour.lastFocusedElt.shift()}fields.loggedUserBehaviour.lastFocusedElt.push($(event.target))});basicUtilities.callback(aCallback,false,0,null)};this.logLastRelevantElt=function(aCallback,aObj){fields.loggedUserBehaviour.lastRelevantElt=aObj;basicUtilities.callback(aCallback,false,0,null)};this.getLastClickedHistory=function(){return fields.loggedUserBehaviour.lastClickedElt};this.getLastFocusedHistory=function(){return fields.loggedUserBehaviour.lastFocusedElt};this.getLastRelevantElt=function(){return fields.loggedUserBehaviour.lastRelevantElt};this.stripLines=function(aCallback,aString){basicUtilities.callback(aCallback,false,0,aString.replace(/(\r\n|\n|\r|\t)/gm,""))};this.fillTemplate=function(aCallback,template,context){basicUtilities.queue([function(aNext){this.stripLines(aNext,context)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,template(JSON.parse(aResult.data)))}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("VoiceContactViewClass fillTemplate failed","rra0063")}}],this)};this.setStyle=function(aCallback){basicUtilities.queue([function(aNext){this.stripLines(aNext,Bootstrap)},function(aNext,aResult){if(!aResult||aResult.status===0){if(!$("#app_conf_style_sheet").length){$("head").append('<style id="app_conf_style_sheet">'+aResult.data+"</style>")}if(!$("#bootstrap_style_sheet").length){$("head").append('<style id="bootstrap_style_sheet">'+TemplateClass.style+"</style>")}basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("VoiceContactViewClass setStyle failed","rra0064")}}],this)};this.unsetStyle=function(aCallback){if($("#app_conf_style_sheet").length){$("head").children("#app_conf_style_sheet").remove()}if($("#bootstrap_style_sheet").length){$("head").children("#bootstrap_style_sheet").remove()}basicUtilities.callback(aCallback,false,0,null)};this.viewEmptyPage=function(aCallback){$(window.document.body).html();basicUtilities.callback(aCallback,false,0,null)};this.setDisabledInput=function(aCallback,aId,aDisabled){if(aDisabled){$("#"+aId).prop("disabled",true)}else{$("#"+aId).prop("disabled",false)}basicUtilities.callback(aCallback,false,0,null)};this.displayStatuts=function(aStatut){var undef;if($("#telnumber").length===0){$(".header-title span").after('<span id="telnumber"></span>')}if(aStatut.phoneNumber!==undef&&aStatut.phoneNumber!==""){var prefix,indexPrefix,phoneNumber;prefix=["262","590","594","596"];phoneNumber=aStatut.phoneNumber;for(indexPrefix=0;indexPrefix<prefix.length;indexPrefix+=1){if(phoneNumber===aStatut.phoneNumber){phoneNumber=phoneNumber.replace(new RegExp(prefix[indexPrefix],"g"),"0")}}$("#telnumber").text(" (N° "+phoneNumber+")")}this.translate()};this.displayContacts=function(aList){var indexContact,contact,phoneNumberList,phoneTypeList,phoneNumberStr,phoneTypeStr,indexPhoneNumber,max_list;fields.dataContactsTable=[];fields.dataContact=aList;max_list=aList.length>fields.maxNumberOfContacts?fields.maxNumberOfContacts:aList.length;for(indexContact=0;indexContact<max_list;indexContact+=1){contact={};phoneNumberList=["","",""];phoneTypeList=["","",""];phoneNumberStr="";phoneTypeStr="";for(indexPhoneNumber=0;indexPhoneNumber<aList[indexContact].phoneNumberList.length;indexPhoneNumber+=1){if(aList[indexContact].phoneNumberList[indexPhoneNumber].type.toLowerCase()==="cell"){phoneNumberList[0]=aList[indexContact].phoneNumberList[indexPhoneNumber].number;phoneTypeList[0]=aList[indexContact].phoneNumberList[indexPhoneNumber].type.toLowerCase()}else if(aList[indexContact].phoneNumberList[indexPhoneNumber].type.toLowerCase()==="work"){phoneNumberList[1]=aList[indexContact].phoneNumberList[indexPhoneNumber].number;phoneTypeList[1]=aList[indexContact].phoneNumberList[indexPhoneNumber].type.toLowerCase()}else{phoneNumberList[2]=aList[indexContact].phoneNumberList[indexPhoneNumber].number;phoneTypeList[2]=aList[indexContact].phoneNumberList[indexPhoneNumber].type.toLowerCase()}}for(indexPhoneNumber=0;indexPhoneNumber<3;indexPhoneNumber+=1){if(phoneNumberList[indexPhoneNumber]!==""){phoneNumberStr+=phoneNumberList[indexPhoneNumber]+"<br>";phoneTypeStr+="<span class='Translation' data-translation='voiceAdvanced.journal.popup.updatecontact."+phoneTypeList[indexPhoneNumber]+"'></span><br>"}}contact={type:"static",defaultvalue:["<a id='contact_"+indexContact+"' href='#'>"+this.escapeString("js",this.escapeString("html",aList[indexContact].givenName+" "+aList[indexContact].familyName))+"</a><span style='display:none;'>"+aList[indexContact].contactId+"</span>",phoneNumberStr,phoneTypeStr,aList[indexContact].ringtoneId]};fields.dataContactsTable.push(contact)}if(aList.length>=fields.maxNumberOfContacts){$("#max_contact_msg").show();$("#add_contact").hide()}else{$("#max_contact_msg").hide();$("#add_contact").show()}fields.oldListContacts=fields.dataContactsTable;displayContactTable.call(this,fields.dataContactsTable)};this.displayContact=function(aContact){var undef,indexPhoneNumber;$("#mobile").val("");$("#office").val("");$("#home").val("");$("#firstname").val("");$("#lastname").val("");$("#ring").val(1);if(aContact!==undef){$("#firstname").val(aContact.givenName);$("#lastname").val(aContact.familyName);$("#ring").val(aContact.ringtoneId);for(indexPhoneNumber=0;indexPhoneNumber<aContact.phoneNumberList.length;indexPhoneNumber+=1){if(aContact.phoneNumberList[indexPhoneNumber].type==="HOME"){$("#home").val(aContact.phoneNumberList[indexPhoneNumber].number)}else if(aContact.phoneNumberList[indexPhoneNumber].type==="WORK"){$("#office").val(aContact.phoneNumberList[indexPhoneNumber].number)}else{$("#mobile").val(aContact.phoneNumberList[indexPhoneNumber].number)}}}$("#popup_ring_form .txtandfield-label").attr("class","txtandfield-label col-xs-1");$("#popup_ring_form .txtandfield-text-input:eq(0)").attr("class","col-xs-2 txtandfield-text-input small-select-padding");$("#ring").attr("class","small-select");$("#mobile").attr("maxlength","20");$("#office").attr("maxlength","20");$("#home").attr("maxlength","20");$("#firstname").attr("maxlength","16");$("#lastname").attr("maxlength","16");$("#popup_updatecontact_update").attr("disabled",true)};this.viewDisplayPage=function(aCallback){basicUtilities.queue([function(aNext){this.fillTemplate(aNext,TemplateClass.template,Config)},function(aNext,aResult){if(!aResult||aResult.status===0){$(window.document.body).html(aResult.data);this.translate();TemplateClass.enablePopOver();$(window).resize(function(){TemplateClass.enablePopOver()});aNext()}else{basicUtilities.callback(aCallback,false,-1,null);this.notifyError("VoiceContactViewClass:  Failed to fill template with config data","rra0065")}},function(){$("#max_contact_msg").hide();$("#tab_template_container").focus();$("#content_template_container .bodytxt:eq(1)").attr("class","bodytxt link-padding");if(this.getMobileOperatingSystem()==="Android"){$("#search").attr("class","Translation txtandfield-field search-margin")}else{$("#search").attr("class","Translation txtandfield-field search-margin search-padding-top")}listenViewEvents.call(this);this.setPageTitle(null,$(".header-title").find("h1").find("span").html());basicUtilities.callback(aCallback,false,0,null)}],this)};this.setMaxNumberOfContacts=function(aCallback,max){fields.maxNumberOfContacts=max;basicUtilities.callback(aCallback,false,0,null)};this.confirmDelete=function(contact){fields.contactToDelete=contact;TemplateClass.showPopup($("#popup_delete_contacts"));$("#popup_delete_contacts p:eq(0)").html('<span data-translation="voiceAdvanced.contacts.popup.confirmdelete" class="Translation"></span>'+contact.givenName+" "+contact.familyName+" ?");this.translate()}}return VoiceContactViewClass});