jQuery.orange.config.areacontent.installation_step_4 = {
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
			
			$("#memoryCardStatus").bind('change', function(event) {
				var newValue = event.target.value;
				if(newValue == 'VALID'
						|| newValue == 'VALID_SECURE' 
						|| newValue == 'VALID_LOCK') {
					$(".gosecure.installbutton>img.puce_arrow").attr('src','theme/webCorporate/image/installation/puce_arrow.gif');
					$(".gosecure").bind('click',function(){
						$("#global").orangeLoad(menu.mapping.securisation_step_1);
					});
					$(".gosecure.installbutton").removeClass('disabled');
					$(".gosecure.installlink").removeClass('disabled');
				}else{
					$(".gosecure.installbutton>img.puce_arrow").attr('src','theme/webCorporate/image/installation/puce_arrow_off.gif');
					$(".gosecure.installbutton").addClass('disabled');
					$(".gosecure").unbind('click');
					$(".gosecure.installlink").addClass('disabled');
				}
			});
			$("#memoryCardStatus").trigger('change');
	}
};