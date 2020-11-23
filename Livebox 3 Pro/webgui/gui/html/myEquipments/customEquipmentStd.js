jQuery.orange.config.areacontent.customEquipmentStd = {
	postParse: function() {
		var XpathDevice = $('#customEquipmentStd span:eq(0)').text();
		
		var Rooms = "Device/UserInterface/Rooms/Room";
		jQuery.orange.config.api.crud.read(
			[Rooms],
			function (result) {
				if(result[Rooms].nb == 0) {
					$("#location").replaceWith($('<span/>').attr('i18n', 'page.myEquipments.userEquipment.filtre.location.none'));
				}
				else {
					var enum0 = "", room;
					for (room in result[Rooms].values) {
							enum0 += "'"+result[Rooms].values[room]["Name"]+"',";
					}
					enum0 = enum0.substr(0, enum0.length-1);
					$("#location").replaceWith('<span id="location" widgetType="EnumInput" widgetArg="\'select\'" dataId="'+XpathDevice+'/Location" enumerated="['+enum0+']" i18n="page.myEquipments.customEquipmentEth.config.location"/>');
				}
			});
		
		$("#location").parent().orangeParse();
	},
	postLoad: function(){
		var XpathDevice = $('#customEquipmentStd span:eq(0)').text();
		
		var Icons = XpathDevice+"/Icon";
		jQuery.orange.config.api.crud.read(
				[Icons],
				function (result) {
					if(result[Icons].values[Icons] == undefined
							|| result[Icons].values[Icons] == ""
							|| result[Icons].values[Icons] == null ) {
						$("#equicon")[0].setDataValue("theme/webCorporate/image/device/usb.png");
						$("#equicon").orangeParse();
						
						var form = $("#customEquipmentStd form")[0];
						var oldState = jQuery.orange.widget.Form.getState.call(form);
						form.dataKO=[];
						form.modifsOK=[];
						var newState = jQuery.orange.widget.Form.getState.call(form);
						if (newState != oldState){
							jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
						}
					}
				});
		
		$("#btnBack").bind('click', function() {
			jQuery.orange.widget.MenuItem.setCurrent('m3.m31.m310');
		});
		
		$("#connectionstatuslabel").bind('change',function(){
			var valueInForm = $("#connectionstatuslabel")[0].getDataValue();
			if(valueInForm == "CONNECTED"){
				$("#btnDelete").setDisabled(true);
			}else{
				$("#btnDelete").setDisabled(false);
			}
		});
		$("#connectionstatuslabel").trigger("change");
	}
};