jQuery.orange.config.areacontent.securisation_step_3 = {
	postParse: function(area) {
	},
	postLoad: function() {
			$(".myInfo").simpletooltip({ showEffect: "fadeIn", hideEffect: "fadeOut" });
			
			$(".gohome").bind('click',function(){
				jQuery.orange.config.api.authorization.login("guest", "guest");
				installation_toggleDisplay(true);
				jQuery.orange.widget.MenuItem.setCurrent('m0');
			});
			$(".gonet").bind('click',function(){
				window.location.href="http://www.pro.orange.fr";
			});
	}
};