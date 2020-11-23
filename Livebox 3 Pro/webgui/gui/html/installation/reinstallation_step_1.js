jQuery.orange.config.areacontent.reinstallation_step_1 = {
	preParse: function(){
		
	},
	postLoad: function() {
		$(".myInfo").simpletooltip({ showEffect: "fadeIn", hideEffect: "fadeOut" });
		var passStatus=false;
		
		$("#jump2installation").bind('click',function(){
			$("#global").orangeLoad(menu.mapping.installation);
		});

		var onClickNext = function(){
			var password = $("#uPassword")[0].getDataValue();
			$("#jump2reinstallation_step_2 img").attr('src','theme/webCorporate/image/installation/btn_etape_suivante_off.gif');
			jQuery.orange.config.api.rpc.unlockWithPassword(password, function(successful) {
				if (successful) {
					$("#global").orangeLoad(menu.mapping.reinstallation_step_2);
				} else {
					$("#erroronpasswordp1").show();
					$("#erroronpasswordp2").show();
					$("#uPassword").addClass('errorInput');
				}
			});
		};

		$("#passforget").bind('click',function(){
			$("#global").orangeLoad(menu.mapping.reinstallation_step_1_1);
		});

		$("#uPassword input[type='text']").bind("keyup blur",function(event){
			$("#erroronpasswordp1").hide();
			$("#erroronpasswordp2").hide();
			$("#uPassword").removeClass('errorInput');
			$("#jump2reinstallation_step_2").removeClass("disabled");
			$("#jump2reinstallation_step_2").unbind('click');
			$("#jump2reinstallation_step_2").bind('click', onClickNext);
			$("#jump2reinstallation_step_2 img").attr('src','theme/webCorporate/image/installation/btn_etape_suivante.gif');
			passStatus=true;
			if(event.target.getDataValue().length > 32){
				$("#erroronpasswordp1").show();
				$("#erroronpasswordp2").show();
				$("#uPassword").addClass('errorInput');
				$("#jump2reinstallation_step_2").addClass("disabled");
				$("#jump2reinstallation_step_2").unbind('click');
				$("#jump2reinstallation_step_2 img").attr('src','theme/webCorporate/image/installation/btn_etape_suivante_off.gif');
				passStatus=false;
			}else if(event.target.getDataValue().length < 4){
				if(event.type=="blur"){
					$("#erroronpasswordp1").show();
					$("#erroronpasswordp2").show();
					$("#uPassword").addClass('errorInput');
				}
				$("#jump2reinstallation_step_2").addClass("disabled");
				$("#jump2reinstallation_step_2").unbind('click');
				$("#jump2reinstallation_step_2 img").attr('src','theme/webCorporate/image/installation/btn_etape_suivante_off.gif');
				passStatus=false;
			}
		});
		
		$("#memoryCardStatus").bind('change', function() {
			$("#erroronpasswordp1").hide();
			$("#erroronpasswordp2").hide();
			$("#uPassword").removeClass('errorInput');
			if($("#memoryCardStatus").val() == 'VALID_LOCK') {
				if(passStatus){
					$("#jump2reinstallation_step_2").removeClass("disabled");
					$("#jump2reinstallation_step_2").unbind('click');		
					$("#jump2reinstallation_step_2").bind('click', onClickNext);		
					$("#jump2reinstallation_step_2 img").attr('src','theme/webCorporate/image/installation/btn_etape_suivante.gif');
				}else{
					$("#jump2reinstallation_step_2").addClass("disabled");
					$("#jump2reinstallation_step_2").unbind('click');
					$("#jump2reinstallation_step_2 img").attr('src','theme/webCorporate/image/installation/btn_etape_suivante_off.gif');					
				}
			}else{
				$("#jump2reinstallation_step_2").addClass("disabled");
				$("#jump2reinstallation_step_2").unbind('click');
				$("#jump2reinstallation_step_2 img").attr('src','theme/webCorporate/image/installation/btn_etape_suivante_off.gif');
			}
		});
		$("#memoryCardStatus").trigger('change');
		customizeInstallForm();
	}
};