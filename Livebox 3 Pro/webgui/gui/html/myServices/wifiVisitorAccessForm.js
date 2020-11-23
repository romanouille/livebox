function wifiVisitorAccessForm_disableValidBtn() {
	if( $("#ckWiFiDir").attr('checked') == false )
	{
		$('#btnValid').setDisabled(true);
	}
	else
	{
		if( $("#wifiVisitorAccessForm input.errorInput").length == 0 ) {
			$('#btnValid').setDisabled(false);
		}
		else {
			$('#btnValid').setDisabled(true);
		}
	}
	$("#btnCancel").setDisabled(false);
}

jQuery.orange.config.areacontent.wifiVisitorAccessForm = {
	postParse: function() {
		$("#ckWiFiDir").bind("valueChange", function(event, newValue) {
			wifiVisitorAccessForm_disableValidBtn();
		});
		
		$("#wifiVisitorAccessForm form")[0].crudCallDelegate = function(crudExec) {
			crudExec();
			var HotspotStatus = "Device/Networks/LAN[@name='LAN']/LANPorts/HotspotWiFiPort[@Name='Hotspot']/HotspotStatus";
			var id2value = {};
			id2value[HotspotStatus] = "IN_PROGRESS";
			jQuery.orange.config.api.crud.update(id2value);
			jQuery.orange.widget.MenuItem.setCurrent("m1.m13.m133");
		};
		
		$("#wifiVisitorAccessForm input").add($("#wifiVisitorAccessForm select")).bind('change keyup', function(){
			wifiVisitorAccessForm_disableValidBtn();
		});
	},
	postLoad: function() {
		wifiVisitorAccessForm_disableValidBtn();

		$("#btnCancel").setDisabled(true);
	}
};