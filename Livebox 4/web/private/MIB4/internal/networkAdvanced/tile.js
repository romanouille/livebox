$.widget("sah.internal_networkAdvanced",{options:{},_create:function(){"use strict";this.element.on("activate",function(){SAH.WM.launchApp(this.options.manifest)}.bind(this))},start:function(){"use strict";var appdir="networkAdvanced",preloaded;this.element.closest(".tile-orange").css("background","url(internal/"+appdir+"/tile_bg.png) no-repeat");if($("html").hasClass("no-touch")&&this.element.closest(".tile-orange").css("opacity")!=="0.5"){if(window.document.images){preloaded=new Image;preloaded.src="internal/"+appdir+"/tile_bg_p.png"}this.element.closest(".tile-orange").on("click",function(){$(this).css("background","url(internal/"+appdir+"/tile_bg_p.png) no-repeat");window.setTimeout(function(){$(this).css("background","url(internal/"+appdir+"/tile_bg.png) no-repeat")}.bind(this),1e3)})}SAH.TranslateObj.putTranslation();return},stop:function(){"use strict";return},resize:function(){"use strict";return}});