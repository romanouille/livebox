function reinitialisation_enableDisableSimCardReinit(simcardState, isGateway) {
	if(isGateway && (simcardState == 'VALID' || simcardState == 'VALID_SECURE')) {
		$("#insertCard").hide();
		$("#radioType input:eq(0)").removeAttr('disabled');
		$("#radioType input:eq(1)").removeAttr('disabled');
		$("#radioType")[0].setDataValue('0');
	} else {
		if (isGateway) {
			$("#insertCard").show();
		} else {
			$("#insertCard").hide();
		}
		$("#radioType input:eq(0)").attr('disabled', 'disabled');
		$("#radioType input:eq(1)").attr('disabled', 'disabled');
		$("#radioType")[0].setDataValue('2');
	}
}

jQuery.orange.config.areacontent.reinitialisation = {
	postParse: function() {
		var isGateway = ($("#rpcpath").text() == "Device");
				
		$("#help").bind("click",function() {
			helpPopup("html/main/help_reinitialisation.html");
		});
		
		$("#radioType span:eq(0)").after('<div class="margin-left-20" i18n="page.myEquipments.reinitialisation.reinit.typedescription.0"/>');
		$("#radioType span:eq(1)").after('<div class="margin-left-20" i18n="page.myEquipments.reinitialisation.reinit.typedescription.1"/>');
		$("#radioType span:eq(2)").after('<div class="margin-left-20"  i18n="page.myEquipments.reinitialisation.reinit.typedescription.2"/>');
		$("#radioType").orangeParse();
		
		$("#memoryCardStatus").bind('change', function(event) {
			reinitialisation_enableDisableSimCardReinit(event.target.value, isGateway);
		});
		
		if (!isGateway) {
			reinitialisation_enableDisableSimCardReinit("NOT_PRESENT", false);
		}
	
		$("#btnReinitBox").click(function(){			
			openConfirmationPopup('popup.reinitlivebox.title', 'popup.reinitlivebox.text',
				function() {
					var type = "SIMCARD_FULL";
					if($("#radioType input:eq(0)").is(':checked'))
						type = "SIMCARD_FULL";
					else if($("#radioType input:eq(1)").is(':checked'))
						type = "SIMCARD_MINI";
					else if($("#radioType input:eq(2)").is(':checked'))
						type = "FACTORY";
					
					var boxName = $("#reinitialisation h1 span:eq(1)").text();
					var XpathRPC = $('#reinitialisation span:eq(1)').text();
					
					jQuery.orange.config.api.rpc.reinitialize(
							XpathRPC,
							type,
							function(reply, cb) {
								showRebootPage(boxName);
							},
							function(error, reply) {
								if (error != undefined && error.code == jQuery.gui.XMO_REQUEST_NO_ERR) {
									showRebootPage(boxName);
								} else {
									openErrorPopup();
								}
							}
					);
					showRebootPage(boxName);
				});
		});
		
		$("#btnReinitBox").setDisabled(jQuery.orange.config.api.authorization.accessRemoteDisable);
		// enlever le cursor
		$("#btnReinitBox > img").setDisabled(jQuery.orange.config.api.authorization.accessRemoteDisable);
		
	}
};