function mainMenu_reload() {
	$("#tabsMenu").orangeLoad(menu.mapping.mainMenu, function() {
		setTimeout("mainMenu_check()", 100);
	});
	setTimeout("mainMenu_check()", 100);
}

/**
 * THIS is a BIG UGLY workaround to skip the case when VisibleDependent.onParse() is not
 * called (for whatever reason, probably a js exception) and then the menu items visibility
 * is not connected to the "expert"/"standard" mode.
 * This works by examining if the menu items have the class assigned if the VisibleDependent
 * widget has been initialized completely. If not, it reloads the menu bar, until the menu items
 * are correctly initialized (beuark).
 */
function mainMenu_check() {
	var jItem = $("#tabsMenu [i18n='menuNetwork.dhcpdns']").parent();
	if (jItem.length > 0) {
		if (!jItem.hasClass("visibledependent-display") && !jItem.hasClass("visibledependent-hide")) {
			setTimeout("mainMenu_reload()", 10);
		}
	} else {
		setTimeout("mainMenu_check()", 100);
	}
//	var meshEnabled = "Device/MESH/Enable";
//	jQuery.orange.config.api.crud.read([meshEnabled],function(result){
//		if(result["Device/MESH/Enable"].values["Device/MESH/Enable"] == true){
//			$("#meshNework2").show();
//		}
//		else {
//			$("#meshNework2").hide();
//		}
//	});
	if (window.location.protocol == "https:") {
		$("#menuserviceinternet")[0].setDataValue('false');
	}
	else {
		$("#menuserviceinternet")[0].setDataValue('true');
	}
}

jQuery.orange.config.areacontent.tabsMenu = {
	postLoad: function() {
		$("#tabsMenu ul li ul").hover(
			function () {
				$(this).prev().addClass('menuitem-hover');
			},
			function () {
				$(this).prev().removeClass('menuitem-hover');	
			}
		);
		
		$("#tabsMenu ul li").bind("click", function() {
			$(this).children('ul').css('display', 'none');
			$(this).bind('mouseout', function() {
				$(this).children('ul').removeAttr('style');
				$(this).unbind('mouseout');
			});
		});
		
		mainMenu_check();
		
		if(jQuery.orange.config.api.authorization.accessRemoteDisable){
			jQuery.orange.config.menu.items.m1.defaultItem='m11';
		}
	}
};