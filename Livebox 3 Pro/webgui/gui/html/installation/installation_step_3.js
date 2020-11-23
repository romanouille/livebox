jQuery.orange.config.areacontent.installation_step_3 = {
	postParse: function(area) {
	},
	postLoad: function() {
		
		$(".restest").bind('click',function(){
			$("#global").orangeLoad(menu.mapping.installation_step_2);
		});
		$(".stopinstall").bind('click',function(){
			jQuery.orange.config.api.authorization.login("guest", "guest");
			installation_toggleDisplay(true);
			jQuery.orange.widget.MenuItem.setCurrent('m0');
	    });
		
		var newStatusCheck = function(){
			
			//dev cases
			//detectedStatus = "MODEM_CONNECTED";
			//detectedStatus = "PPP_AUTHENTICATION_FAILED";
			
			var detectedStatus = $("#bdConnectionStatus")[0].getDataValue();
			$("#container").data('detectedStatus',detectedStatus);
			
			if(detectedStatus=="MODEM_CONNECTED"){
				$("#global").orangeLoad(menu.mapping.installation_step_4);
			}else if(detectedStatus=="PPP_AUTHENTICATION_FAILED"){
				$("#global").orangeLoad(menu.mapping.installation_step_2);
			}else{
				$("#global").orangeLoad(menu.mapping.installation_step_3_1);
			}
		};

		var timeoutId = window.setTimeout(newStatusCheck, 15000);
		var t0 = new Date().getTime();
		$("#bdConnectionStatus").bind('change', function(event, newValue) {
			var dt = new Date().getTime() - t0;
			// Filters out some intermediate values while waiting
			if (newValue == "MODEM_CONNECTED" || dt > 15000) {
				window.clearTimeout(timeoutId);
				newStatusCheck();
			}
		});
	}
};