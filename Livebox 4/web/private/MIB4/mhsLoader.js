require(["utils/console","utils/compatibility","utils/basics","semantic/sah/sah","common/lib/config","json!appConfig.json","json!manifest/manifest","libs/translate","jquery","wm","jquery-cookie/jquery.cookie","jquery-ui","modernizr/modernizr-1.7.min","lib/sah-core/sah","manifest/sah-manifest","widget-sahgrid/sahgrid","widget-swiper/idangerous.swiper","widget-swiper/idangerous.swiper.progress","tiles/launcher","tiles/slider","tiles/custom_sliders","tiles/settings","tiles/profile","apps/iframeapp","apps/configapp","apps/favorites"],function(console,compatibility,basicUtilities,SahClass,ConfigClass,aAppConfig,aManifest,aTranslateObj,$){"use strict";var sahObj,configObj,hgwUrl,fields,doUpdateLanguage=function(aCallback,aLangTab,aLangData){var langRes;if(aLangTab.length<=0){basicUtilities.callback(aCallback,false,0,null);return}if(aLangData){fields.langData=Object.deepExtend(fields.langData,aLangData)}langRes=aLangTab.pop();require([langRes],doUpdateLanguage.bind(this,aCallback,aLangTab))},updateLanguage=function(aCallback,aLanguageId){basicUtilities.queue([function(aNext){var indexApp,langTab;fields.langData={};langTab=[];for(indexApp=1;indexApp<aManifest.manifests.status.length;indexApp+=1){langTab.push("json!"+aManifest.manifests.status[indexApp].Application.settings.target.split("index")[0]+"lang/"+aLanguageId+".json")}doUpdateLanguage.call(this,aNext,langTab,null)},function(){require(["json!langCommon/"+aLanguageId+".json"],function(aCommonLang){fields.langId=aLanguageId;fields.langData=Object.deepExtend(fields.langData,aCommonLang);SAH.TranslateObj.init(fields.langId,fields.langData);SAH.TranslateObj.updateTranslation(SAH.TranslateObj.putTranslation());basicUtilities.callback(aCallback,false,0,null)})}])},processLanguageMessage=function(aMessage){console.info("mhsLoader: Received event to change language to '"+aMessage.data+"'");if(aMessage.data==="LANGUAGE_UPDATE_fr"){updateLanguage.call(this,null,"fr")}else if(aMessage.data==="LANGUAGE_UPDATE_en"){updateLanguage.call(this,null,"en")}else{console.warn("mhsLoader: Skipping unexpected language event '"+aMessage.data+"'")}};fields={langId:null,langData:{}};sahObj=new SahClass("HGW Portal","FT-MIB4");configObj=new ConfigClass(aAppConfig);hgwUrl=configObj.getCommonConfig("hgwUrl");sahObj.setEnvironment({useApiSimulationMode:false,useSemanticSimulationMode:configObj.getCommonConfig("isEmulated"),useValidationMode:configObj.getCommonConfig("useValidation"),useRemoteControlMode:configObj.getCommonConfig("useRemoteControl"),useApplicationMode:true,reporterUrl:configObj.getCommonConfig("reporterUrl"),ajaxCrosserUrl:hgwUrl?configObj.getCommonConfig("ajaxCrosserUrl"):""});basicUtilities.queue([function(aNext){sahObj.setDeviceTarget({deviceType:"hgw",host:hgwUrl||window.location.hostname,port:window.location.port||0,protocol:window.location.protocol||null},aNext)},function(aNext){sahObj.invokeApi("semantic","sah.Device.Information.getLanguage",aNext)},function(aNext,aResult){var language;if(aResult.status===0){language=aResult.data.languageId}else{console.error("appLoader: Failed to retrieve default language");language="fr"}basicUtilities.setCookie("UILang",language);SAH.TranslateObj=aTranslateObj;updateLanguage.call(this,aNext,language)},function(){SAH.SDKut=sahObj;window.addEventListener("message",processLanguageMessage.bind(this),false);window.document.addEventListener("sahLogout",function(){console.error("mhsLoader: Moving back to authentication as session has expired");SAH.SDKut.logOut();window.location.href=window.location.href.split("?")[0].split("/").slice(0,-1).join("/")+"/index.html"+window.location.search});$("#wm3").wm3();$("#wm3").fadeIn(1500)}]);return});