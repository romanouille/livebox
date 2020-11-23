jQuery.orange.config.areacontent.wifiVisitorAccess = {
		postLoad: function() {
			
		$("#help").bind("click",function() {
			helpPopup("html/main/help_wifiVisitor.html");
		});
		
		/*var HotspotStatus = "Device/Networks/LAN[@name='LAN']/LANPorts/HotspotWiFiPort[@Name='']/HotspotStatus";
		jQuery.orange.config.api.crud.read(
			[HotspotStatus],
			function (result) {
				if( result[HotspotStatus].values[HotspotStatus] == 'DISABLED'
						|| result[HotspotStatus].values[HotspotStatus] == 'DEACTIVATION_IN_PROGRESS' )
					jQuery.orange.widget.MenuItem.setCurrent("m1.m13.m131");
				else if(result[HotspotStatus].values[HotspotStatus] == 'ON_GOING')
					jQuery.orange.widget.MenuItem.setCurrent("m1.m13.m133");
				else if(result[HotspotStatus].values[HotspotStatus] == 'ENABLED')
					jQuery.orange.widget.MenuItem.setCurrent("m1.m13.m135");
				else
					jQuery.orange.widget.MenuItem.setCurrent("m1.m13.m134");
			});*/
	}
};