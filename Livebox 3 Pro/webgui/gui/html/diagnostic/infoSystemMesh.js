jQuery.orange.config.areacontent.infoSystemMesh = {
	postParse: function() {
			$("#help").bind("click",function() {
				helpPopup("html/main/help_infoSystem.html");
			});
			infoSystem_postParse("#infoSystemMesh");
	},
	postLoad: function() {
		var OSVersion;
		var ConfigurationVersion;
		var GUIVersion;
		var needSynchro = false;
		
		//$("#infosystemmesh_table tbody tr").remove();

		var masterBox = "Device/DeviceInfo";
		jQuery.orange.config.api.crud.read([masterBox], function(result) {
			var widget = $("#infosystemmesh_table")[0];
			var columns = widget.conf.columns;
			var form = $("form", widget)[0];

			var data = result[masterBox];
			if (data != undefined) {
				form.dataConstraints = data.constraints;
				columns[0].attr = "RouterName";
				columns[1].attr = "OSVersion";
				columns[2].attr = "ConfigurationMeshVersion";
				columns[3].attr = "GUIVersion";
				var id;
				for (id in data.values) {
					var values = data.values[id];
					jQuery.orange.widget.Table.addRow.call(widget, id, values);

					OSVersion = values['OSVersion'];
					ConfigurationVersion = values['ConfigurationMeshVersion'];
					GUIVersion = values['GUIVersion'];
				}
			}
		});

		var MeshEnable = "Device/MESH/Enable";
		jQuery.orange.config.api.crud.read(
				[MeshEnable],
				function (result) {
					MeshEnable = result[MeshEnable].values[MeshEnable];
				});
		
		if(MeshEnable == true){
			var APDevice = "Device/MESH/AccessPoints/AccessPoint[Alias!='GWC']";
			jQuery.orange.config.api.crud.read(
				[APDevice],
				function (result) {
					if (result[APDevice].nb > 0) {
						var box;
						for (box in result[APDevice].values) {
							var uid = result[APDevice].values[box]["uid"];
							var meshBox = "Device/MESH/AccessPoints/AccessPoint[@uid='"+uid+"']/DeviceInfo";
							jQuery.orange.config.api.crud.read([meshBox], function(result) {
								var widget = $("#infosystemmesh_table")[0];
								var columns = widget.conf.columns;
								var form = $("form", widget)[0];
	
								var data = result[meshBox];
								if (data != undefined) {
									form.dataConstraints = data.constraints;
									columns[0].attr = "RouterName";
									columns[1].attr = "OSVersion";
									//columns[2].attr = "ConfigurationVersion";
									columns[2].attr = "GUIVersion";
									var id;
									for (id in data.values) {
										var values = data.values[id];
										jQuery.orange.widget.Table.addRow.call(widget, id, values);
	
										if (values['OSVersion'] != OSVersion
											//|| values['ConfigurationVersion'] != ConfigurationVersion
											|| values['GUIVersion'] != GUIVersion) {
											needSynchro = true;
										}
	
									}
								}
							});
						}
					}
				}
			);
		}
		$("#infoSystemMesh #btnSynchro").setDisabled(!needSynchro);//! needSynchro);
	}
};