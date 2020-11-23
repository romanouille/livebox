define(["utils/console","utils/basics","lib/stateManager","app/hubDiagnosticCtrl","app/hubDiagnosticView","jquery"],function(console,basicUtilities,StateManagerClass,HubDiagnosticCtrlClass,HubDiagnosticViewClass,$){"use strict";function MainClass(aSahObj,aConfigObj,aTranslateObj){var fields;fields={sahObj:aSahObj,stateManagerObj:null};fields.stateManagerObj=new StateManagerClass("hubDiagnosticApp",aSahObj,aTranslateObj);this.run=function(){basicUtilities.queue([function(aNext){fields.stateManagerObj.registerState(aNext,"hubDiagnostic",HubDiagnosticCtrlClass,HubDiagnosticViewClass,false)},function(aNext,aResult){if(!aResult||aResult.status===0){$(window).on("hashchange",{},function(){if(window.location.hash.substr(1)==="hubDiagnostic"){fields.stateManagerObj.switchState(null,"hubDiagnostic",null)}else{fields.stateManagerObj.requestAppClose(null)}});basicUtilities.callback(aNext,false,0,null)}},function(aNext,aResult){if(!aResult||aResult.status===0){window.location.hash="#hubDiagnostic";basicUtilities.callback(aNext,false,0,null)}else{console.error("MainClass: Internal error. Aborting...");basicUtilities.callback(aNext,false,-1,null)}}],this)}}return MainClass});