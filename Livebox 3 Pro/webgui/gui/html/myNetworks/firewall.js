jQuery.orange.config.areacontent.firewall = {
	postParse: function() {
		$("#radioFWL span:eq(0)").after('<div class="fwdescription" i18n="data.firewallmodedescription.LOW"/>');
		$("#radioFWL span:eq(1)").after('<div class="fwdescription" i18n="data.firewallmodedescription.MEDIUM"/>');
		$("#radioFWL span:eq(2)").after('<div class="fwdescription" i18n="data.firewallmodedescription.HIGH"/>');
		$("#radioFWL span:eq(3)").after('<div class="fwdescription" i18n="data.firewallmodedescription.CUSTOM"/>');
		$("#radioFWL").orangeParse();
	
		$("#radioFWL").bind("change", function(event, newValue) {
			if(newValue != undefined) {
				if(newValue != "CUSTOM")
				{
					$(".customfw").hide();
				}
				else
				{				
					var fwConfig = "Device/Firewall/Config";
					jQuery.orange.config.api.crud.read(
						[fwConfig],
						function (result) {
							if(result[fwConfig].values[fwConfig] == 'CUSTOM')
								$(".customfw").show();
							else
								$(".customfw").hide();
						});
				}
			}
		});
		
		$("#firewall form")[0].crudCallDelegate = function(crudExec) {
			crudExec();
		};
		
		$("#firewall form")[0].crudCallback = function() {
			var fwConfig = "Device/Firewall/Config";
			jQuery.orange.config.api.crud.read(
				[fwConfig],
				function (result) {
					if(result[fwConfig].values[fwConfig] == 'CUSTOM')
						$(".customfw").show();
					else
						$(".customfw").hide();
				});
		};
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_firewall.html");
		});
	}
};