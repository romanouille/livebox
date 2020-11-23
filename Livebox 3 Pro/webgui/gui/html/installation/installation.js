function installation_reinstall_setEnabled(enabled) {
	if(enabled) {
		$(".reinstallstart.installbutton>img.puce_arrow").attr('src','theme/webCorporate/image/installation/puce_arrow.gif');
		$(".reinstallstart").bind('click',function(){
			$("#global").orangeLoad(menu.mapping.reinstallation_step_1);
		});
		$(".reinstallstart.installbutton").removeClass('disabled');
		$(".reinstallstart.installlink").removeClass('disabled');
	}else{
		$(".reinstallstart.installbutton>img.puce_arrow").attr('src','theme/webCorporate/image/installation/puce_arrow_off.gif');
		$(".reinstallstart.installbutton").addClass('disabled');
		$(".reinstallstart").unbind('click');
		$(".reinstallstart.installlink").addClass('disabled');
	}
}

jQuery.orange.config.areacontent.installation = {
	preParse: function() {
		installation_toggleDisplay(false);
	},
	postParse: function(area) {
	},
	postLoad: function(area) {
		$(".myInfo").simpletooltip({ showEffect: "fadeIn", hideEffect: "fadeOut" });
		$(".installstart").bind('click',function(){
			$("#global").orangeLoad(menu.mapping.installation_step_1);
		});
		
		if($("#memoryCardStatus").val() == 'VALID_LOCK') {
			installation_reinstall_setEnabled(true);
		}else{
			installation_reinstall_setEnabled(false);
		}
		
		$("#memoryCardStatus").bind('change', function(event) {
			var newValue = event.target.value;
			if(newValue == 'VALID'){
				$("#global").orangeLoad(menu.mapping.reinstallation_step_2);
			}else if(newValue == 'VALID_SECURE'){
				$("#global").orangeLoad(menu.mapping.reinstallation_step_2);
			}else if(newValue == 'VALID_LOCK') {
				installation_reinstall_setEnabled(true);
			}else if(newValue == 'CONF_VERSION_NOT_SUPPORTED') {
				$("#global").orangeLoad(menu.mapping.firmware_upgrade_inprogress);
			}else{
				installation_reinstall_setEnabled(false);
			}
		});
	}
};