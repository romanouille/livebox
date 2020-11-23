jQuery.orange.config.areacontent.ping = {
	postLoad: function() {
		$("#btnPing").setDisabled(true);
		$("#repetition")[0].setDataValue('5');
		var ExternalIPAddress = "Device/Networks/WAN[@name='WAN']/ExternalIPAddress";
		jQuery.orange.config.api.crud.read(
				[ExternalIPAddress],
				function (result) {
					$("#origin").append('<option value="'+result[ExternalIPAddress].values[ExternalIPAddress]+'">'+result[ExternalIPAddress].values[ExternalIPAddress]+'</option>');
				});
		
		var IPRouters = "Device/Networks/LAN[@name='LAN']/IPRouters";
		jQuery.orange.config.api.crud.read(
				[IPRouters],
				function (result) {
					$("#origin").append('<option value="'+result[IPRouters].values[IPRouters]+'">'+result[IPRouters].values[IPRouters]+'</option>');
				});
				
		var APDevice = "Device/MESH/AccessPoints/AccessPoint[Alias!='GWC']";
		jQuery.orange.config.api.crud.read(
			[APDevice],
			function (result) {
				if (result[APDevice].nb > 0) {
					var box;
					for (box in result[APDevice].values) {
						$("#origin").append('<option value="'+result[APDevice].values[box]["IPAddress"]+'">'+result[APDevice].values[box]["IPAddress"]+'</option>');
					}
				}
			});
		
		$("#target").add($("#size")).bind('change keyup', function(event) {
			var error = false;
			$("#ping input").each(function() {
				if (jQuery.orange.widget.Form.verifyConstraints(this) == false)
					error = true;
			});

			$("#btnPing").setDisabled(error);
		});
		
		$("#btnPing").bind('click', function() {
			var target = $("#target").val();
			var origin = $("#origin").val();
			var size = $("#size").val();
			var repetition = $("#repetition")[0].getDataValue();
			$("#results").val(jQuery.orange.config.api.rpc.IPv4Ping(target, origin, size, repetition));
		});
	}
};