$.widget("sah.internal_hubUser",{options:{},_create:function(){"use strict";this.element.on("activate",function(){if(SAH.isHubStorage){SAH.WM.launchApp(this.options.manifest)}}.bind(this))},start:function(){"use strict";var appdir="hubUser",preloaded;$("#internal_hubUser_0").css("opacity","0.5");this.element.closest(".tile-orange").attr("aria-disabled",true);if(SAH.isHubActive&&SAH.isHubStorage){$("#internal_hubUser_0").css("opacity","1");this.element.closest(".tile-orange").attr("aria-disabled",false)}this.element.closest(".tile-orange").css("background","url(internal/"+appdir+"/tile_bg.png) no-repeat");if($("html").hasClass("no-touch")&&this.element.closest(".tile-orange").css("opacity")!=="0.5"){if(window.document.images){preloaded=new Image;preloaded.src="internal/"+appdir+"/tile_bg_p.png"}this.element.closest(".tile-orange").on("click",function(){$(this).css("background","url(internal/"+appdir+"/tile_bg_p.png) no-repeat");window.setTimeout(function(){$(this).css("background","url(internal/"+appdir+"/tile_bg.png) no-repeat")}.bind(this),1e3)})}if(SAH.isHubActive&&SAH.isHubStorage){SAH.SDKut.invokeApi("semantic","sah.Device.MediaCloud.countUsers",function(result){if(result.status===0){if(result.hasOwnProperty("data")){$(this).find(".widget-notification-count").html(result.data.nbUsers);$(this).find(".widget-notification").show();SAH.TranslateObj.putTranslation()}}}.bind(this.element),{})}SAH.TranslateObj.putTranslation();return},stop:function(){"use strict";return},resize:function(){"use strict";return}});