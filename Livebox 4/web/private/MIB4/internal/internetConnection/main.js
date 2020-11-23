define(["utils/console","utils/basics","lib/stateManager","app/internetConnectionCtrl","app/internetConnectionView","jquery"],function(console,basicUtilities,StateManagerClass,InternetConnectionCtrlClass,InternetConnectionViewClass,$){"use strict";function MainClass(aSahObj,aConfigObj,aTranslateObj){var fields;fields={sahObj:aSahObj,stateManagerObj:null};fields.stateManagerObj=new StateManagerClass("internetConnectionApp",aSahObj,aTranslateObj);this.run=function(){basicUtilities.queue([function(aNext){fields.stateManagerObj.registerState(aNext,"clientAccess",InternetConnectionCtrlClass,InternetConnectionViewClass,false)},function(aNext,aResult){if(!aResult||aResult.status===0){$(window).on("hashchange",{},function(){if(window.location.hash.substr(1)==="clientAccess"){fields.stateManagerObj.switchState(null,"clientAccess",null)}else{fields.stateManagerObj.requestAppClose(null)}});basicUtilities.callback(aNext,false,0,null)}},function(aNext,aResult){if(!aResult||aResult.status===0){window.location.hash="#clientAccess";basicUtilities.callback(aNext,false,0,null)}else{console.error("MainClass: Internal error. Aborting...");basicUtilities.callback(aNext,false,-1,null)}}],this)}}return MainClass});