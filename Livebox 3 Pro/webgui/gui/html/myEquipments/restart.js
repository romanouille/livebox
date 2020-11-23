jQuery.orange.config.areacontent.restart = {
	postParse: function() {
	
		$("#help").bind("click",function() {
			helpPopup("html/main/help_restart.html");
		});
		
		$("#btnRebootBox").click(function(){			
			openConfirmationPopup('popup.confirmrebootlivebox.title', 'popup.confirmrebootlivebox.text',
				function() {
					var boxName = $("#restart h1 span:eq(1)").text();
					var XpathRPC = $('#restart span:eq(1)').text();
					
					jQuery.orange.config.api.rpc.reboot(
							XpathRPC,
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
				});
		});
		
		$("#btnRebootWiFi").click(function(){
			openConfirmationPopup('popup.rebootwifi.title', 'popup.rebootwifi.text',
				function() {
					var Xwifienable = "Device/Networks/LAN[@name=\'LAN\']/LANPorts/LANWiFiPort/Enable";
					// cas Mesh, pour plus tard  
					// Device/MESH/AccessPoints/AccessPoint[@uid='']/WiFiEnabled
					
					var id2value = {};
					id2value[Xwifienable] = false;
					jQuery.orange.config.api.crud.update(id2value);
					
					id2value[Xwifienable] = true;
					jQuery.orange.config.api.crud.update(id2value);
				});
		});
	}
};