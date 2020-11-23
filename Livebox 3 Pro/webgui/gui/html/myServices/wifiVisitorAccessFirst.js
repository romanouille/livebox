jQuery.orange.config.areacontent.wifiVisitorAccessFirst = {
	postParse: function() {
		var HotspotStatus = "Device/Networks/LAN[@name='LAN']/LANPorts/HotspotWiFiPort[@Name='Hotspot']/HotspotStatus";
		jQuery.orange.config.api.crud.read(
			[HotspotStatus],
			function (result) {
				if(result[HotspotStatus].values[HotspotStatus] == 'DEACTIVATION_IN_PROGRESS') {
					$("#wifiVisitorAccessFirst form input").setDisabled(true);
				}
			});

		$("#wifiVisitorAccessFirst form")[0].crudCallDelegate = function(crudExec) {
			crudExec();
			jQuery.orange.widget.MenuItem.setCurrent("m1.m13.m132");
		};
		
		$("#ckWiFiVA").bind('valueChange', function(event, newValue) {
			$("#btnReg").setDisabled(! newValue);
			$("#btnCancel").setDisabled(! newValue);
		});
		
		$("#btnCancel").bind('click', function() {
			$("#ckWiFiVA").removeAttr('checked');
			$("#ckWiFiVA").trigger('valueChange');
		});
	},
	postLoad: function() {
		/*if($("#ckWiFiVA").attr('checked') == true) {
			$("#btnReg").setDisabled(false);
		}*/
	}
};