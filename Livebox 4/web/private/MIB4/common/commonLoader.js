require(["json!common/appConfig.json"],function(aAppConfig){"use strict";var isOptimized,moduleName;isOptimized=aAppConfig.common.isOptimized;if(window.location.search.indexOf("isOptimized")>=0){if(window.location.search.indexOf("isOptimized=false")>=0){isOptimized=false}else{isOptimized=true}}moduleName=isOptimized?"app/appLoader-built":"app/appLoader";require([moduleName],function(){return})});