require(["utils/console","utils/compatibility","utils/basics","semantic/sah/sah","lib/config","json!common/appConfig.json","lib/translate","app/main"],function(console,compatibility,basicUtilities,SahClass,ConfigClass,aAppConfig,aTranslateObj,MainClass){"use strict";var sahObj,configObj,mainObj;configObj=new ConfigClass(aAppConfig);basicUtilities.queue([function(aNext){var hgwUrl;if(window.parent.SAH){sahObj=window.parent.SAH.SDKut;aNext()}else{console.error("Loader: Direct access to the application");sahObj=new SahClass(configObj.getCommonConfig("applicationName"),configObj.getCommonConfig("project"));hgwUrl=configObj.getCommonConfig("hgwUrl");sahObj.setEnvironment({useApiSimulationMode:false,useSemanticSimulationMode:configObj.getCommonConfig("isEmulated"),useValidationMode:configObj.getCommonConfig("useValidation"),useRemoteControlMode:configObj.getCommonConfig("useRemoteControl"),useApplicationMode:true,reporterUrl:configObj.getCommonConfig("reporterUrl"),ajaxCrosserUrl:hgwUrl?configObj.getCommonConfig("ajaxCrosserUrl"):""});sahObj.setDeviceTarget({deviceType:"hgw",host:hgwUrl||window.location.hostname,port:window.location.port||0,protocol:window.location.protocol||null},aNext)}},function(aNext){sahObj.invokeApi("semantic","sah.Device.Information.getLanguage",aNext)},function(aNext,aResult){var language;if(aResult.status===0){language=aResult.data.languageId}else{console.error("appLoader: Failed to retrieve default language");language="fr"}basicUtilities.setCookie("UILang",language);aTranslateObj.loadTranslation(aNext,language)},function(){mainObj=new MainClass(sahObj,configObj,aTranslateObj);mainObj.run()}]);return});