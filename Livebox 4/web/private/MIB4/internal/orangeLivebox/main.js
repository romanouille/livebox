define(["utils/console","utils/basics","lib/stateManager","app/orangeLiveboxCtrl","app/orangeLiveboxView","jquery"],function(console,basicUtilities,StateManagerClass,OrangeLiveboxCtrlClass,OrangeLiveboxViewClass,$){"use strict";function MainClass(aSahObj,aConfigObj,aTranslateObj){var fields;fields={sahObj:aSahObj,stateManagerObj:null};fields.stateManagerObj=new StateManagerClass("OrangeLiveboxApp",aSahObj,aTranslateObj);this.run=function(){basicUtilities.queue([function(aNext){fields.stateManagerObj.registerState(aNext,"OrangeLivebox",OrangeLiveboxCtrlClass,OrangeLiveboxViewClass,false)},function(aNext,aResult){if(!aResult||aResult.status===0){$(window).on("hashchange",{},function(){if(window.location.hash.substr(1)==="OrangeLivebox"){fields.stateManagerObj.switchState(null,"OrangeLivebox",null)}else{fields.stateManagerObj.requestAppClose(null)}});basicUtilities.callback(aNext,false,0,null)}},function(aNext,aResult){if(!aResult||aResult.status===0){window.location.hash="#OrangeLivebox";basicUtilities.callback(aNext,false,0,null)}else{console.error("MainClass: Internal error. Aborting...");basicUtilities.callback(aNext,false,-1,null)}}],this)}}return MainClass});