jQuery.orange.config.areacontent.basiclogs = {
	postLoad: function() {
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_basiclogs.html");
		});
		
		var UdpFlood = "Device/DeviceInfo/Logs/DoSProtection/UdpFlood";
		jQuery.orange.config.api.crud.read([UdpFlood], function(result) {
			var widget = $("#dosprotection_table")[0];
			var columns = widget.conf.columns;
			var form = $("form", widget)[0];

			var data = result[UdpFlood];
			if (data != undefined) {
				form.dataConstraints = data.constraints;
				columns[0].attr = "Id";
				columns[1].attr = "Name";
				columns[2].attr = "Activate";
				columns[3].attr = "HitsNumber";
				var id;
				for (id in data.values) {
					var values = data.values[id];
					values['Id'] = 1;
					values['Name'] = "UDPflood";
					jQuery.orange.widget.Table.addRow.call(widget, id, values);
				}
			}
		});
		
		
		var TcpFlood = "Device/DeviceInfo/Logs/DoSProtection/TcpFlood";
		jQuery.orange.config.api.crud.read([TcpFlood], function(result) {
			var widget = $("#dosprotection_table")[0];
			var columns = widget.conf.columns;
			var form = $("form", widget)[0];

			var data = result[TcpFlood];
			if (data != undefined) {
				form.dataConstraints = data.constraints;
				columns[0].attr = "Id";
				columns[1].attr = "Name";
				columns[2].attr = "Activate";
				columns[3].attr = "HitsNumber";
				var id;
				for (id in data.values) {
					var values = data.values[id];
					values['Id'] = 2;
					values['Name'] = "TCPflood";
					jQuery.orange.widget.Table.addRow.call(widget, id, values);
				}
			}
		});
		
		var IcmpFlood = "Device/DeviceInfo/Logs/DoSProtection/IcmpFlood";
		jQuery.orange.config.api.crud.read([IcmpFlood], function(result) {
			var widget = $("#dosprotection_table")[0];
			var columns = widget.conf.columns;
			var form = $("form", widget)[0];

			var data = result[IcmpFlood];
			if (data != undefined) {
				form.dataConstraints = data.constraints;
				columns[0].attr = "Id";
				columns[1].attr = "Name";
				columns[2].attr = "Activate";
				columns[3].attr = "HitsNumber";
				var id;
				for (id in data.values) {
					var values = data.values[id];
					values['Id'] = 3;
					values['Name'] = "ICMPflood";
					jQuery.orange.widget.Table.addRow.call(widget, id, values);
				}
			}
		});
		
		var WinNuke = "Device/DeviceInfo/Logs/DoSProtection/WinNuke";
		jQuery.orange.config.api.crud.read([WinNuke], function(result) {
			var widget = $("#dosprotection_table")[0];
			var columns = widget.conf.columns;
			var form = $("form", widget)[0];

			var data = result[WinNuke];
			if (data != undefined) {
				form.dataConstraints = data.constraints;
				columns[0].attr = "Id";
				columns[1].attr = "Name";
				columns[2].attr = "Activate";
				columns[3].attr = "HitsNumber";
				var id;
				for (id in data.values) {
					var values = data.values[id];
					values['Id'] = 4;
					values['Name'] = "WINNuke";
					jQuery.orange.widget.Table.addRow.call(widget, id, values);
				}
			}
		});		
	}
};