jQuery.orange.config.areacontent.home = {
	preParse: function() {
		
		if(!jQuery.orange.config.api.authorization.isConnected()){
			jQuery.orange.config.api.authorization.login("guest", "guest");
		}
	
	},
	postLoad: function() {

		//home's popups management
		var showPopupSCStatus = function(){
			var PopupSCStatus = "Device/UserInterface/WebUI/PopupSCStatus";
			jQuery.orange.config.api.crud.read(
				[PopupSCStatus],
				function (result) {
					if(result[PopupSCStatus].values[PopupSCStatus] == false) {
						var SmartCardStatus = "Device/DeviceInfo/SmartCard/Status";
						jQuery.orange.config.api.crud.read(
								[SmartCardStatus],
								function (result) {
									var cm_status = result[SmartCardStatus].values[SmartCardStatus];
									if(cm_status == 'NOT_PRESENT') {
										$('#cm_abs').orangeRead();
										$('#cm_abs').dialog('open');
									}
									else if(cm_status == 'REMOVED' || cm_status == 'ERROR') {
										$('#cm_removed').orangeRead();
										$('#cm_removed').dialog('open');
									}
								});
					}
				});
		};
		showPopupSCStatus();
	}
};