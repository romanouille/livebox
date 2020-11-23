jQuery.orange.config.areacontent.reinstallation_step_1_1 = {
	postLoad: function() {
		$(".myInfo").simpletooltip({ showEffect: "fadeIn", hideEffect: "fadeOut" });
		
		$("#jump2reinstallation_step_1").bind('click',function(){
			$("#global").orangeLoad(menu.mapping.reinstallation_step_1);
		});
		
		var onClickNext = function(){
			var sanswer = $("#sAnswer")[0].getDataValue();
			$("#jump2reinstallation_step_2 img").attr('src','theme/webCorporate/image/installation/btn_etape_suivante_off.gif');
			jQuery.orange.config.api.rpc.unlockWithSecretAnswer(sanswer, function(successful) {
				if (successful) {
					$("#global").orangeLoad(menu.mapping.reinstallation_step_2);
				} else {
					$("#failedSecretAnswer").show();
					$("#sAnswer").addClass('errorInput');
				}
			});
		};
		
		$("#sAnswer input[type='text']").bind('keyup blur',function(event){
			$("#failedSecretAnswer").hide();
			$("#sAnswer").removeClass('errorInput');
			$("#jump2reinstallation_step_2").removeClass("disabled");
			$("#jump2reinstallation_step_2").unbind('click');
			$("#jump2reinstallation_step_2").bind('click', onClickNext);
			$("#jump2reinstallation_step_2 img").attr('src','theme/webCorporate/image/installation/btn_etape_suivante.gif');
			if(event.type="blur" && $("#sAnswer")[0].getDataValue()==""){
				$("#failedSecretAnswer").show();
				$("#sAnswer").addClass('errorInput');
				$("#jump2reinstallation_step_2").addClass("disabled");
				$("#jump2reinstallation_step_2").unbind('click');
				$("#jump2reinstallation_step_2 img").attr('src','theme/webCorporate/image/installation/btn_etape_suivante_off.gif');
			}
		});
		customizeInstallForm();
	}
};