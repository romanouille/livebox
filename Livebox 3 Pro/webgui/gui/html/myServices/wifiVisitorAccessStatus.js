jQuery.orange.config.areacontent.wifiVisitorAccessStatus = {
	postLoad: function() {
		if( $("#UsersConnected")[0].dataValueRef <= 1 ) {
			$("#UsersConnectedLabel").attr('i18n', 'page.myServices.wifiaccessstatus.nbuser2');
		}
		else {
			$("#UsersConnectedLabel").attr('i18n', 'page.myServices.wifiaccessstatus.nbuser2_pluriel');
		}
		$("#UsersConnectedLabel").orangeTranslate();
		
		$("#disableBtn").bind('click', function() {			
			openConfirmationPopup('popup.wifiguestaccessdeactivation.title', 'popup.wifiguestaccessdeactivation.text',
				function() {
					var HotspotStatus = "Device/Networks/LAN[@name='LAN']/LANPorts/HotspotWiFiPort[@Name='Hotspot']/HotspotStatus";
					var id2value = {};
					id2value[HotspotStatus] = "DEACTIVATION_IN_PROGRESS";
					jQuery.orange.config.api.crud.update(id2value);
					jQuery.orange.widget.MenuItem.setCurrent("m1.m13.m131");
				});
		});
	}
};