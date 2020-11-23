jQuery.orange.config.areacontent.customEquipmentUsb = {
	postParse: function() {
		var XpathDevice = $('#customEquipmentUsb span:eq(0)').text();
		var url = $('#customEquipmentUsb span:eq(1)').text();
		
		
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
		
		$("#btnEject").click(function(){			
			openConfirmationPopup('popup.eject.title', 'popup.eject.text',
				function() {
					jQuery.orange.config.api.rpc.eject(
						false,
						XpathDevice,
						function(error, reply) {
							// TODO vérifier code erreur et afficher la popup correspondante
							//openErrorPopup('popup.ejectinuse.title', 'popup.ejectinuse.text');
							openErrorPopup();
						}
					);
				});			
		});
	},
	postLoad: function() {
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_customEquipmentUSB.html");
		});
		
		var XpathDevice = $('#customEquipmentUsb span:eq(0)').text();
		var url = $('#customEquipmentUsb span:eq(1)').text();
		
		var Icons = XpathDevice+"/Icon";
		jQuery.orange.config.api.crud.read(
				[Icons],
				function (result) {
					if(result[Icons].values[Icons] == undefined
							|| result[Icons].values[Icons] == ""
							|| result[Icons].values[Icons] == null ) {
//						if(url!=null){
//							$("#equicon")[0].setDataValue(url);
//						}else{
							$("#equicon")[0].setDataValue("ico_devices_usbhdd.png");
//						}						
						$("#equicon").orangeParse();
						
						var form = $("#customEquipmentUsb form")[0];
						var oldState = jQuery.orange.widget.Form.getState.call(form);
						form.dataKO=[];
						form.modifsOK=[];
						var newState = jQuery.orange.widget.Form.getState.call(form);
						if (newState != oldState){
							jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
						}
					}
				});
		
		var Volume = XpathDevice+"/Volumes/Volume";
		jQuery.orange.config.api.crud.read([Volume], function(result) {
			var widget = $("#customEquipmentUsb_table")[0];
			var columns = widget.conf.columns;
			var form = $("form", widget)[0];

			var data = result[Volume];
			if (data != undefined) {
				form.dataConstraints = data.constraints;
				columns[0].attr = "Name";
				columns[1].attr = "FileSystem";
				columns[2].attr = "Capacity";
				columns[5].attr = "Status";
				var id;
				for (id in data.values) {
					var values = data.values[id];
					values['FreeSpace'] = values['Capacity'] - values['UsedSpace'];
					values['PercentageUsed'] = Math.round((values['UsedSpace'] / values['Capacity'])*100)+"%";
					values['FormatBtn'] = '<span id="btnFormat_'+values['Name']+'" widgetType="ButtonImage"  i18n="page.myEquipments.customEquipmentUsb.infos.format.btn"/>';
					values['VerifBtn'] = '<span id="btnVerif_'+values['Name']+'" widgetType="ButtonImage"  i18n="page.myEquipments.customEquipmentUsb.infos.verif.btn"/>';
					jQuery.orange.widget.Table.addRow.call(widget, id, values);
				}
			}
			$('#customEquipmentUsb_table').orangeParse();
		});
		
		$('#customEquipmentUsb_table span[id^="btnFormat"]').each(function() {
			$(this).bind('click', function() {
				var xpath = $(this).parents("tr").attr("dataid");
				var i18nTitle;
				var i18nText;
				// Verification du type de partition
				if($(this).parent().parent().children('td:eq(1)')[0].dataValueRef == "FAT32") {
					i18nTitle = 'popup.format.title';
					i18nText = 'popup.format.text';
				}
				else {
					i18nTitle = 'popup.formatfat32.title';
					i18nText = 'popup.formatfat32.text';
				}
				openConfirmationPopup(i18nTitle, i18nText,
					function() {
						jQuery.orange.config.api.rpc.format(
							xpath,
							"FAT32",
							null,
							function(error, reply) {
								// TODO vérifier code erreur et afficher la popup correspondante
								//openErrorPopup('popup.formatinuse.title', 'popup.formatinuse.text');
								openErrorPopup();
							}
						);
					});
			});
		});
		
		$('#customEquipmentUsb_table span[id^="btnVerif"]').each(function() {
			$(this).bind('click', function() {				
				// Verifie que le type de partition est different de NTFS sinon affichage erreur et stop
				if($(this).parent().parent().children('td:eq(1)')[0].dataValueRef == "NTFS") {
					openErrorPopup('popup.checkerr.title', 'popup.checkerr.text');
					return;
				}
				
				// Lance la RPC
				var xpath = $(this).parents("tr").attr("dataid");
				jQuery.orange.config.api.rpc.check(
					xpath,
					null,
					function(error, reply) {
						// TODO vérifier code erreur et afficher la popup correspondante
						if(error.code == jQuery.gui.XMO_USED_DEVICE_ERR
						|| error.code == jQuery.gui.XMO_NO_DEVICE_ERR) {
							openErrorPopup('popup.checkerr.title', 'popup.checkerr.text');
						}
						else {
							openErrorPopup();
						}
					}
				);
			});
		});
		$("#btnBack").bind('click', function() {
			jQuery.orange.widget.MenuItem.setCurrent('m3.m31.m310');
		});
		
		//Suppression 
		$("#btnDelete").click(function(){
			openConfirmationPopup('popup.deletedevice.title', 'popup.deletedevice.text',
				function() {
					jQuery.orange.config.api.crud.del(XpathDevice,function(result){
						jQuery.orange.widget.MenuItem.setCurrent('m3.m31.m310');
					});
				});	
		});
		
		$("#connectionstatuslabel").bind('change',function(){
			// grisé ou dégrisé le buton suppression
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