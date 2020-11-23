define(["utils/console","utils/basics","lib/stateManager","app/userPasswordCtrl","app/userPasswordView","jquery"],function(console,basicUtilities,StateManagerClass,UserPasswordCtrlClass,UserPasswordViewClass,$){"use strict";function MainClass(aSahObj,aConfigObj,aTranslateObj){var fields;fields={sahObj:aSahObj,stateManagerObj:null};fields.stateManagerObj=new StateManagerClass("UserPasswordApp",aSahObj,aTranslateObj);this.run=function(){basicUtilities.queue([function(aNext){fields.stateManagerObj.registerState(aNext,"password",UserPasswordCtrlClass,UserPasswordViewClass,false)},function(aNext,aResult){if(!aResult||aResult.status===0){$(window).on("hashchange",{},function(){if(window.location.hash.substr(1)==="password"){fields.stateManagerObj.switchState(null,"password",null)}else{fields.stateManagerObj.requestAppClose(null)}});basicUtilities.callback(aNext,false,0,null)}},function(aNext,aResult){if(!aResult||aResult.status===0){window.location.hash="#password";basicUtilities.callback(aNext,false,0,null)}else{console.error("MainClass: Internal error. Aborting...");basicUtilities.callback(aNext,false,-1,null)}}],this)}}return MainClass});