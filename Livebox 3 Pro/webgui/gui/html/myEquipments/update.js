jQuery.orange.config.areacontent.update = {
	postParse: function() {
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_update.html");
		});
		
		$("#btnUpdate").click(function(){
			var XpathRouter = $('#update span:eq(0)').text();
			var XpathRPC = $('#update span:eq(1)').text();
			openConfirmationPopup('popup.confirmupdate.title', 'popup.confirmupdate.text',
				function() {
					jQuery.orange.config.api.rpc.requestDownload(XpathRPC,
						function(isUpdateInProgress) {
							if (isUpdateInProgress) {
								jQuery.orange.widget.MenuItem.setCurrent('m3.m30.m3041', {XpathRouter: XpathRouter});
							} else {
								// Open popup saying there is no firmware available
								openErrorPopup("page.myEquipments.update.popup.nonewfirmware.title", 
										"page.myEquipments.update.popup.nonewfirmware.msg");
							}
						},
						function(error, reply) {
							openErrorPopup("page.myEquipments.update.popup.error.title", 
									"page.myEquipments.update.popup.error.msg");
						}
					);
				});
		});
	}
};