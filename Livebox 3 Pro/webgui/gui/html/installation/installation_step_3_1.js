jQuery.orange.config.areacontent.installation_step_3_1 = {
	postParse: function(area) {
	},
	postLoad: function() {
		
		$(".restest").bind('click',function(){
			$("#global").orangeLoad(menu.mapping.installation_step_3);
		});
		$(".stopinstall").bind('click',function(){
			jQuery.orange.config.api.authorization.login("guest", "guest");
			installation_toggleDisplay(true);
			jQuery.orange.widget.MenuItem.setCurrent('m0');
	    });
		
		if($("#container").data('detectedStatus') == "ADSL_LINE_NOT_SYNCHRONISED"){
			$("#synchroerror").css('display','block');
		}else if($("#container").data('detectedStatus') == "BAS_NOT_REPLY"){
			$("#connerror").css('display','block');
		}else if($("#container").data('detectedStatus') == "ONT_DOWN"){
			$("#fibreerror").css('display','block');
		}
	}
};