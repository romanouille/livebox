define(["utils/console","utils/basics","lib/stateCtrlInterface"],function(console,basicUtilities,StateCtrlClass){"use strict";function VoiceContactCtrlClass(aStateId,aStateManager,aSahObj,aViewObj){var fields,onViewEvent=function(aEventId,aData){if(aEventId==="ViewSubmitted"){console.debug("VoiceContactCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));if(aData.state==="status"){window.location.hash="#statut"}else if(aData.state==="journal"){window.location.hash="#journal"}else if(aData.state==="contacts"){window.location.hash="#contacts"}else if(aData.state==="associate"){window.location.hash="#associate"}else if(aData.state==="delete_contact"){basicUtilities.queue([function(aNext){this.deleteContact(aNext,aData.param)},function(aNext,aResult){if(aResult.status===0){this.getAllContacts(aNext)}else{console.warn("VoiceContactCtrlClass: Failed to retrieve voice contacts");basicUtilities.callback(aNext,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass: Failed to delete contact","rra0037")}},function(aNext,aResult){if(!aResult||aResult.status===0){aViewObj.displayContacts(aResult.data.contactList);basicUtilities.callback(aNext,false,0,null)}else{basicUtilities.callback(aNext,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass: Failed to retrieve voice contacts","rra0038")}}],this)}else if(aData.state==="add_contact"){basicUtilities.queue([function(aNext){this.addContact(aNext,aData.param)},function(aNext,aResult){if(aResult.status===0){this.getAllContacts(aNext)}else{console.warn("VoiceContactCtrlClass: Failed to add contact");basicUtilities.callback(aNext,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass: Failed to add contact","rra0039")}},function(aNext,aResult){if(!aResult||aResult.status===0){aViewObj.displayContacts(aResult.data.contactList);basicUtilities.callback(aNext,false,0,null)}else{basicUtilities.callback(aNext,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass: Failed to retrieve voice contacts","rra0040")}}],this)}else if(aData.state==="update_contact"){basicUtilities.queue([function(aNext){this.updateContact(aNext,aData.param)},function(aNext,aResult){if(aResult.status===0){this.getAllContacts(aNext)}else{console.warn("VoiceContactCtrlClass: Failed to update contact");basicUtilities.callback(aNext,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass: Failed to update contact","rra0041")}},function(aNext,aResult){if(!aResult||aResult.status===0){aViewObj.displayContacts(aResult.data.contactList);basicUtilities.callback(aNext,false,0,null)}else{basicUtilities.callback(aNext,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass: Failed to retrieve voice contacts","rra0042")}}],this)}else if(aData.state==="get_contact"){basicUtilities.queue([function(aNext){this.getContact(aNext,aData.param)},function(aNext,aResult){if(aResult.status||aResult.status===0){aViewObj.displayContact(aResult.data);basicUtilities.callback(aNext,false,0,null)}else{basicUtilities.callback(aNext,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass: Failed to retrieve voice contact","rra0043")}}],this)}else if(aData.state==="confirm_delete_contact"){basicUtilities.queue([function(aNext){this.getContact(aNext,aData.param)},function(aNext,aResult){if(aResult.status||aResult.status===0){aViewObj.confirmDelete(aResult.data);basicUtilities.callback(aNext,false,0,null)}else{basicUtilities.callback(aNext,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass: Failed to retrieve voice contact","rra0043")}}],this)}else if(aData.state==="ringtest"){basicUtilities.queue([function(aNext){this.ring(aNext,aData.param)},function(aNext,aResult){if(aResult.status||aResult.status===0){basicUtilities.callback(aNext,false,0,null)}else{basicUtilities.callback(aNext,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass: Failed to start ring test","rra0044")}}],this)}}else{console.warn("VoiceContactCtrlClass: Unexpected event '"+aEventId+"'");this.getViewObj().notifyError("VoiceContactCtrlClass: Unexpected event '"+aEventId+"'","rra0045")}};fields={};StateCtrlClass.call(this,aStateId,aStateManager,aSahObj,aViewObj);this.init=function(aCallback){console.debug("VoiceContactCtrlClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().subscribeEvents(this.getId(),onViewEvent.bind(this));this.getViewObj().init(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass init failed","rra0046")}}],this)};this.quit=function(aCallback){console.debug("VoiceContactCtrlClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().quit(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass view quit failed","rra0047")}}],this)};this.enable=function(aCallback){console.debug("VoiceContactCtrlClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getVoiceStatuts(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){this.getViewObj().enable(aNext);aViewObj.displayStatuts(aResult.data)}else{console.error("VoiceContactCtrlClass: Internal error");this.getViewObj().notifyError("VoiceContactCtrlClass: Internal error getVoiceStatuts failed","rra0048")}},function(aNext,aResult){if(!aResult||aResult.status===0){this.getMaxNumberOfContacts(aNext)}else{console.error("VoiceContactCtrlClass: Internal error");this.getViewObj().notifyError("VoiceContactCtrlClass: Internal error displayStatuts failed","rra0048")}},function(aNext,aResult){if(!aResult||aResult.status===0){this.getViewObj().setMaxNumberOfContacts(aNext,aResult.data.maxContacts)}else{console.error("VoiceContactCtrlClass: Internal error");this.getViewObj().notifyError("VoiceContactCtrlClass: Internal errorgetMaxNumberOfContacts failed","rra0048")}},function(aNext,aResult){if(!aResult||aResult.status===0){this.getAllContacts(aNext)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass setMaxNumberOfContacts failed","rra0049")}},function(aNext,aResult){if(!aResult||aResult.status===0&&aResult.data){aViewObj.displayContacts(aResult.data.contactList)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass: Failed to retrieve voice contacts","rra0050")}}],this)};this.disable=function(aCallback){console.debug("VoiceContactCtrlClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().disable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass view disable failed","rra0051")}}],this)};this.getVoiceStatuts=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.Device.Phone.getServerState",aNext,null)},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("VoiceContactCtrlClass: Failed to retrieve voice status");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass: Failed to retrieve voice status","rra0052")}}],this)};this.getAllContacts=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.Content.AddressBook.browseContacts",aNext,null)},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("VoiceContactCtrlClass: Failed to retrieve all contacts");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass: Failed to retrieve all contacts","rra0053")}}],this)};this.getMaxNumberOfContacts=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.Content.AddressBook.getMaxNumberOfContacts",aNext,null)},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("VoiceContactCtrlClass: Failed to retrieve all contacts");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass: Failed to get Max Number Of Contacts","rra0053")}}],this)};this.deleteContact=function(aCallback,contactId){basicUtilities.queue([function(aNext){this.callSahApi("sah.Content.AddressBook.deleteContact",aNext,contactId)},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("VoiceContactCtrlClass: Failed to delete contact");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass: Failed to delete contact","rra0054")}}],this)};this.addContact=function(aCallback,contact){basicUtilities.queue([function(aNext){this.callSahApi("sah.Content.AddressBook.addContact",aNext,contact)},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("VoiceContactCtrlClass: Failed to add contact");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass: Failed to add contact","rra0055")}}],this)};this.updateContact=function(aCallback,contact){basicUtilities.queue([function(aNext){this.callSahApi("sah.Content.AddressBook.updateContact",aNext,contact)},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("VoiceContactCtrlClass: Failed to update contact");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass: Failed to update contact","rra0056")}}],this)};this.getContact=function(aCallback,contactId){basicUtilities.queue([function(aNext){this.callSahApi("sah.Content.AddressBook.getContact",aNext,contactId)},function(aNext,aResult){if(aResult.status===0||aResult.status){basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("VoiceContactCtrlClass: Failed to get contact");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass: Failed to retreive contact","rra0057")}}],this)};this.ring=function(aCallback,ringToneId){basicUtilities.queue([function(aNext){this.callSahApi("sah.Device.Phone.startRingTest",aNext,{ringtone:ringToneId})},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("VoiceContactCtrlClass: Failed to start Ring Test");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("VoiceContactCtrlClass: Failed to start Ring Test","rra0058")}}],this)}}return VoiceContactCtrlClass});