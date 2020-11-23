jQuery.orange.config.areacontent.phone = {
	preParse: function() {
		var phonenumber = "Device/VOIPService/Lines/Line/@number";
		jQuery.orange.config.api.crud.read(
			[phonenumber],
			function (result) {
				if(result[phonenumber].values[phonenumber] == "")
				{
					$("#phonenumber").replaceWith('<span id="phonenumber" class="bold" i18n="page.myServices.phone.status.phonenumbernotassigned"/>');
					$("#phonenumberMsg").show();
				}
				else
				{
					$("#phonenumberMsg").hide();
				}
			});		
		
		$("#ftthEnable").bind("change valueChange" , function(){			
			var newValue = $("#ftthEnable")[0].getDataValue();			
			if(newValue == 'ENABLE'){
				$("#simultring").setDisabled(true);
			}else{
				$("#simultring").setDisabled(false);
			}
			
		});
	
	},
	postParse: function() {
		if( jQuery.orange.config.api.authorization.getProfileName() == "orangeadmin" )
			$(".userSupport").show();
		else
			$(".userSupport").hide();
	},
	postLoad: function() {		
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_phone.html");
		});
		
		// pour la page phone test		
		$("#helpTestPhone").bind("click",function() {
			helpPopup("html/main/help_phoneTest.html");
		});
		
	
	
		// il  ne lit pas la valeur (remplacer par un bind dans preparse)
//		var ftthEnable = "Device/Networks/WAN[@name='WAN']/WANPorts/FTTH/Enable";
//		jQuery.orange.config.api.crud.read(
//			[ftthEnable],
//			function (result) {
//				if(result[ftthEnable].values[ftthEnable] == 'ENABLE')
//					$("#simultring").setDisabled(true);
//				else
//					$("#simultring").setDisabled(false);
//			});
		

		
		$("#testPhonesButton").click(function(){
			jQuery.orange.config.api.rpc.testPhones(function(){
			});
		});
	}
};