function firewallCustomRule2_setForm(dataId, area) {
	var val = $("#content").data(dataId);
	var element = $("#"+dataId, area).attr("dataId", dataId)[0];
	if (val != undefined) {
		element.dataValueRef = val;
		element.setDataValue(val);
	} else {
		element.dataValueRef = "";
		$("#btnNext").setDisabled(true);
	}
}

jQuery.orange.config.areacontent.firewallCustomRule2 = {
	postLoad: function(area) {
		area.popupOnUnsubmitted = false;
		$("form", area)[0].setButtonsDisabled = function(newState) {
			var notModif = true;
			$("[dataId]", this).each(function() {
				if (this.getDataValue() != this.dataValueRef)
					notModif = false;
			});
			$("#btnCancel", this).setDisabled(notModif);
			var error = false;
			$("[dataId]", this).each(function() {
				if ($(this).hasClass('errorInput'))
					error = true;
			});
			$("#btnNext", this).setDisabled(error);
		};

		if ($("#content").data('Description') != undefined) {
			$(".application").html($("#content").data('Description'));
		}

		firewallCustomRule2_setForm('SourceIP', area);
		firewallCustomRule2_setForm('SourceMask', area);
		firewallCustomRule2_setForm('SourcePort', area);
		firewallCustomRule2_setForm('DestinationIP', area);
		firewallCustomRule2_setForm('DestinationMask', area);
		firewallCustomRule2_setForm('DestinationPort', area);
		
		if($("#content").data('SourceIP') == undefined) {
			/*var IPRouters = "Device/Networks/LAN[@name='LAN']/IPRouters";
			jQuery.orange.config.api.crud.read(
				[IPRouters],
				function (result) {
					for(var resultValue in result[IPRouters].values) {
						$("#SourceIP")[0].dataValueRef = result[IPRouters].values[resultValue];
						$("#SourceIP")[0].setDataValue(result[IPRouters].values[resultValue]);
						$("#SourceIP").trigger('change');
						$("#from").html($("#SourceIP")[0].getDataValue());
					}
				});*/
			
			$("#SourceIP")[0].dataValueRef = "192.168.1.0";
			$("#SourceIP")[0].setDataValue("192.168.1.0");
			$("#SourceIP").trigger('change');
			$("#from").html($("#SourceIP")[0].getDataValue());
		}
		
		if($("#content").data('SourceMask') == undefined) {
			/*var SubnetMask = "Device/Networks/LAN[@name='LAN']/SubnetMask";
			jQuery.orange.config.api.crud.read(
				[SubnetMask],
				function (result) {
					for(var resultValue in result[SubnetMask].values) {
						$("#SourceMask")[0].dataValueRef = result[SubnetMask].values[resultValue];
						$("#SourceMask")[0].setDataValue(result[SubnetMask].values[resultValue]);
						$("#SourceMask").trigger('change');
					}
				});*/
			
			$("#SourceMask")[0].dataValueRef = "255.255.255.0";
			$("#SourceMask")[0].setDataValue("255.255.255.0");
			$("#SourceMask").trigger('change');
		}
		
		if($("#content").data('SourcePort') == undefined) {
			$("#SourcePort")[0].dataValueRef = "0";
			$("#SourcePort")[0].setDataValue("0");
			$("#SourcePort").trigger('change');
			$("#port").html($("#SourcePort input").val());
		}
		
		if($("#content").data('DestinationPort') == undefined) {
			if(firewallCustom_tableDefaultValues[$("#content").data('Description')] != undefined && firewallCustom_tableDefaultValues[$("#content").data('Description')]['port'] != "") {
				$("#DestinationPort")[0].setDataValue(firewallCustom_tableDefaultValues[$("#content").data('Description')]['port']);
				$("#DestinationPort")[0].dataValueRef = firewallCustom_tableDefaultValues[$("#content").data('Description')]['port'];
			}
			else {
				$("#DestinationPort")[0].dataValueRef = "0";
				$("#DestinationPort")[0].setDataValue("0");
			}
			$("#DestinationPort").trigger('change');
		}
		
		if($("#content").data('DestinationIP') == undefined) {
			$("#DestinationIP")[0].dataValueRef = "0.0.0.0";
			$("#DestinationIP")[0].setDataValue("0.0.0.0");
			$("#DestinationIP").trigger('change');
		}
		
		if($("#content").data('DestinationMask') == undefined) {
			$("#DestinationMask")[0].dataValueRef = "0.0.0.0";
			$("#DestinationMask")[0].setDataValue("0.0.0.0");
			$("#DestinationMask").trigger('change');
		}
		
		
		
		if ($("#content").data('SourceIP') != undefined) {
			$("#from").html($("#SourceIP input").val());
		}
		
		if ($("#content").data('SourcePort') != undefined) {
			$("#port").html($("#SourcePort input").val());
		}

		$("#SourceIP input").bind('change', function(event) {
			if($("#SourceIP").hasClass("errorInput") == false)
				$("#from").html(event.target.value);
		});

		$("#SourcePort input").bind('change', function(event) {
			if($("#SourcePort").hasClass("errorInput") == false)
				$("#port").html(event.target.value);
		});

		$("#btnBack").bind('click', function() {
			$("#content").removeData('Description');
			$("#content").removeData('Protocol');
			$("#content").removeData('SourceIP');
			$("#content").removeData('SourceMask');
			$("#content").removeData('SourcePort');
			$("#content").removeData('DestinationIP');
			$("#content").removeData('DestinationMask');
			$("#content").removeData('DestinationPort');
			jQuery.orange.widget.MenuItem.setCurrent('m2.m211');
		});

		$("#btnPreviousStep").bind('click', function() {
			jQuery.orange.widget.MenuItem.setCurrent('m2.m2111');
		});

		$("#btnNext").bind('click', function() {			
			$("#content").data('SourceIP', $("#SourceIP")[0].getDataValue());
			$("#content").data('SourceMask', $("#SourceMask")[0].getDataValue());
			$("#content").data('SourcePort', $("#SourcePort")[0].getDataValue());
			$("#content").data('DestinationIP', $("#DestinationIP")[0].getDataValue());
			$("#content").data('DestinationMask', $("#DestinationMask")[0].getDataValue());
			$("#content").data('DestinationPort', $("#DestinationPort")[0].getDataValue());
			jQuery.orange.widget.MenuItem.setCurrent('m2.m2113');
		});
		
		$("form", area)[0].setButtonsDisabled();
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_firewallCustomRule2.html");
		});
	}
};