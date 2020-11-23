jQuery.orange.config.areacontent.advancedlogs = {
	postLoad: function() {
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_advancedlogs.html");
		});
		
		var AdvancedLog = "Device/DeviceInfo/Logs/AdvancedLogs/AdvancedLog";
		jQuery.orange.config.api.crud.read([AdvancedLog], function(result) {
			var widget = $("#advancedlogs_table")[0];
			var columns = widget.conf.columns;
			var form = $("form", widget)[0];

			var data = result[AdvancedLog];
			if (data != undefined) {
				var id;
				for (id in data.values) {
					var values = data.values[id];
					/*if(values['Type'] == "START_REBOOT") {
						var StartRebootLog = id+"/StartRebootLog";
						jQuery.orange.config.api.crud.read([StartRebootLog], function(result) {
							values['Detail'] = "Type: ";
							values['Detail'] += result[StartRebootLog].values[StartRebootLog]['Type'];
							values['Detail'] += " UserLaunched: ";
							values['Detail'] += result[StartRebootLog].values[StartRebootLog]['UserLaunched'];
						});
					}
					else if(values['Type'] == "PASSWORD") {
						values['Detail'] = '<span i18n="page.diagnostic.logs.advancedlogs.table.detail.password"/>';
					}
					else if(values['Type'] == "CONNECTIONS") {
						var ConnectionsLog = id+"/ConnectionsLog";
						jQuery.orange.config.api.crud.read([ConnectionsLog], function(result) {
							values['Detail'] = "Service: ";
							values['Detail'] += result[ConnectionsLog].values[ConnectionsLog]['Service'];
							values['Detail'] += " LoginUsed: ";
							values['Detail'] += result[ConnectionsLog].values[ConnectionsLog]['LoginUsed'];
							values['Detail'] += " SourceMachine: ";
							values['Detail'] += result[ConnectionsLog].values[ConnectionsLog]['SourceMachine'];
							values['Detail'] += " Success: ";
							values['Detail'] += result[ConnectionsLog].values[ConnectionsLog]['Success'];
						});
					}
					else if(values['Type'] == "SECURITY") {
						var SecurityLog = id+"/SecurityLog";
						jQuery.orange.config.api.crud.read([SecurityLog], function(result) {
							values['Detail'] = "Source: ";
							values['Detail'] += result[SecurityLog].values[SecurityLog]['Source'];
							values['Detail'] += " Destination: ";
							values['Detail'] += result[SecurityLog].values[SecurityLog]['Destination'];
							values['Detail'] += " IPProtocol: ";
							values['Detail'] += result[SecurityLog].values[SecurityLog]['IPProtocol'];
							values['Detail'] += " SourcePort: ";
							values['Detail'] += result[SecurityLog].values[SecurityLog]['SourcePort'];
							values['Detail'] += " DestinationPort: ";
							values['Detail'] += result[SecurityLog].values[SecurityLog]['DestinationPort'];
						});
					}
					else if(values['Type'] == "DOS") {
						var DoSProtectionLog = id+"/DoSProtectionLog";
						jQuery.orange.config.api.crud.read([DoSProtectionLog], function(result) {
							values['Detail'] = "BlockType: ";
							values['Detail'] += result[DoSProtectionLog].values[DoSProtectionLog]['BlockType'];
						});
					}
					else if(values['Type'] == "TIME") {
						var TimeLog = id+"/TimeLog";
						jQuery.orange.config.api.crud.read([TimeLog], function(result) {
							values['Detail'] = "OldDateTime: ";
							values['Detail'] += result[TimeLog].values[TimeLog]['OldDateTime'];
						});
					}*/
										
					jQuery.orange.widget.Table.addRow.call(widget, id, values);
				}
			}
		});
		$("#advancedlogs_table").orangeParse();
		
		//$('#ckAll')[0].checked = true;
		$("#ckAll")[0].setDataValue(true);
		$("#ckAll").attr('title', jQuery.orange.config.i18n.map['page.diagnostic.logs.advancedlogs.showsort.type.ALL.true.tip']);
		$('#ckList input').each(function() {
			this.checked = true;
			$(this).attr('title', jQuery.orange.config.i18n.map[$(this).next().attr('i18n')+'.true.tip']);			
		});
		/*
		$('#type select option').each(function() {
			$(this).attr('disabled', 'disabled');
		});

		$('#ckList input').each(function() {
			if(this.checked)
				$(this).attr('title', jQuery.orange.config.i18n.map[$(this).next().attr('i18n')+'.true.tip']);
			else
				$(this).attr('title', jQuery.orange.config.i18n.map[$(this).next().attr('i18n')+'.false.tip']);
		});
		*/
		$('#ckAll').bind('change', function(event,newValue) {
			if(newValue) {
				$("#ckAll").attr('title', jQuery.orange.config.i18n.map['page.diagnostic.logs.advancedlogs.showsort.type.ALL.true.tip']);
				$('#ckList input').each(function() {
					this.checked = true;
					$(this).attr('title', jQuery.orange.config.i18n.map[$(this).next().attr('i18n')+'.true.tip']);
				});
				
				$('#type select option').each(function() {
					/*
					if($(this)[0].dataValue != 'ALL') {
						$(this).attr('disabled', 'disabled');
					}
					else {
					*/
						$(this).removeAttr('disabled');
					//}
				});
				
				$('#type select').val($('#type select option:eq(0)').val());
				$('#type select').trigger('change');
			}
			else if (newValue!=undefined){
				$("#ckAll").attr('title', jQuery.orange.config.i18n.map['page.diagnostic.logs.advancedlogs.showsort.type.ALL.false.tip']);
				//$('#ckList input:eq(0)')[0].checked = true;
				//$('#ckList input:eq(0)').attr('title', jQuery.orange.config.i18n.map[$('#ckList input:eq(0)').next().attr('i18n')+'.true.tip']);
				$('#type select option').each(function() {
					if($(this)[0].dataValue == 'ALL') {
						$(this).attr('disabled', 'disabled');
					}
				});
				$('#type select option:eq(1)').removeAttr('disabled');
				$('#type select').val($('#type select option:eq(1)').val());
				$('#type select').trigger('change');
			}
		grayDisabledOptionsIE7('type');
		});
		
		$('#ckList input').each(function() {
			$(this).bind('change', function(event) {
				if(event.target.checked) {
					$(event.target).attr('title', jQuery.orange.config.i18n.map[$(event.target).next().attr('i18n')+'.true.tip']);
				}
				else {
					$(event.target).attr('title', jQuery.orange.config.i18n.map[$(event.target).next().attr('i18n')+'.false.tip']);
				}
				var isOneChecked = false;
				var allAreChecked = true;
				$('#ckList input').each(function() {
					if(this.checked) {
						isOneChecked = true;
						$('#type select option[i18n="'+$(this).next().attr('i18n')+'"]').removeAttr('disabled');
					}
					else {
						allAreChecked = false;
						$('#type select option[i18n="'+$(this).next().attr('i18n')+'"]').attr('disabled', 'disabled');
					}
				});
				if(isOneChecked) {
					//$('#ckAll')[0].checked = false;
					$("#ckAll")[0].setDataValue(false);
					$("#ckAll").attr('title', jQuery.orange.config.i18n.map['page.diagnostic.logs.advancedlogs.showsort.type.ALL.false.tip']);
					$('#type select option:eq(0)').attr('disabled', 'disabled');
					
					$('#type select').val($('#type select option:enabled').val());
					$('#type select').trigger('change');
				}
				else {
					//$('#ckAll')[0].checked = true;
					$("#ckAll")[0].setDataValue(true);
					$("#ckAll").attr('title', jQuery.orange.config.i18n.map['page.diagnostic.logs.advancedlogs.showsort.type.ALL.true.tip']);
					$('#type select option:eq(0)').removeAttr('disabled');
					
					$('#type select').val($('#type select option:eq(0)').val());
					$('#type select').trigger('change');
				}
				
				if(allAreChecked) {
					//$('#ckAll')[0].checked = true;
					$("#ckAll")[0].setDataValue(true);
					$("#ckAll").attr('title', jQuery.orange.config.i18n.map['page.diagnostic.logs.advancedlogs.showsort.type.ALL.true.tip']);
					$('#type select option:eq(0)').removeAttr('disabled');
					/*
					$('#ckList input').each(function() {
						this.checked = false;
						$(this).attr('title', jQuery.orange.config.i18n.map[$(this).next().attr('i18n')+'.false.tip']);
						$('#type select option[i18n="'+$(this).next().attr('i18n')+'"]').attr('disabled', 'disabled');
					});
					*/
					$('#type select').val($('#type select option:eq(0)').val());
					$('#type select').trigger('change');
				}
			grayDisabledOptionsIE7('type');
			});
		});
		
		/*$('#date').bind('change', function(event, newvalue) {
			if(newvalue == 'FIRST')
				jQuery.orange.widget.Table.sort.call($('#advancedlogs_table table')[0], 1, true);
			else
				jQuery.orange.widget.Table.sort.call($('#advancedlogs_table table')[0], 1, false);
		});*/
		
		$('#type').bind('change', function(event, newvalue) {
			if(newvalue == 'ALL') {
				$('#advancedlogs_table tr.table-row').each(function() {
					$(this).show();
				});
			}
			else {
				$('#advancedlogs_table td.table-col-1').each(function() {
					if($(this)[0].dataValueRef != newvalue) {
						$(this).parent().hide();
					}
					else {
						$(this).parent().show();
					}
				});
			}
		});
		$("#saveLog").bind('click',function(event){
			jQuery.orange.config.api.rpc.getLogsURL('syslog.txt');
		});
	}
};