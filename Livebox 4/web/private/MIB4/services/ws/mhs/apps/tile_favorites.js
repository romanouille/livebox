$.widget("sah.tile_favorites",{options:{},_create:function(){"use strict";this.element.on("activate",function(){SAH.WM.launchApp(this.options.manifest)}.bind(this));this.element.closest(".tile-orange").css("background","url(services/ws/mhs/apps/tile_bg.png) no-repeat");this.element.closest(".tile-orange").on("click",function(){$(this).css("background","url(services/ws/mhs/apps/tile_bg_p.png) no-repeat");window.setTimeout(function(){$(this).css("background","url(services/ws/mhs/apps/tile_bg.png) no-repeat")}.bind(this),50);SAH.currentTranslator().run()})},start:function(){"use strict";SAH.currentTranslator().run();return},stop:function(){"use strict";return},resize:function(){"use strict";return}});