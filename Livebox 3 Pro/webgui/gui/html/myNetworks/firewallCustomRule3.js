jQuery.orange.config.areacontent.firewallCustomRule3 = {
	postParse: function() {
		$("#allow")[0].setDataValue(true);
		$("#Target")[0].setDataValue("ACCEPT");
		$("#activate")[0].setDataValue(true);
		if ($("#content").data('Description') != undefined) {
			$(".application").html($("#content").data('Description'));
		}

		if ($("#content").data('SourceIP') != undefined) {
			if($("#content").data('SourceIP') == "0.0.0.0") {
				$("#from").attr('i18n', 'ipaddress.broadcast');
				$("#from").orangeTranslate();
			}
			else
				$("#from").html($("#content").data('SourceIP'));
		}

		if ($("#content").data('SourcePort') != undefined) {
			if($("#content").data('SourcePort') == "0") {
				$("#port").attr('i18n', 'portrange.all');
				$("#port").orangeTranslate();
			}
			else
				$("#port").html($("#content").data('SourcePort'));
		}

		$(".firewallCustomRuleRight").addClass('allow');
		$("#allow").bind('change', function(event, newValue) {
			  
				if ($("#activate")[0].getDataValue()) {
					if (newValue) {
						$(".firewallCustomRuleRight").removeClass('disallow');
						$(".firewallCustomRuleRight").addClass('allow');
						$("#Target")[0].setDataValue("ACCEPT");
					} else if (newValue!=undefined){
						$(".firewallCustomRuleRight").removeClass('allow');
						$(".firewallCustomRuleRight").addClass('disallow');
						$("#Target")[0].setDataValue("DROP");
					}
				}
			 
		});

		$("#activate").bind('change', function(event, newValue) {		
			if (newValue) {
				if ($("#allow")[0].getDataValue()) {
					$(".firewallCustomRuleRight").removeClass('disallow');
					$(".firewallCustomRuleRight").addClass('allow');
				} else {
					$(".firewallCustomRuleRight").removeClass('allow');
					$(".firewallCustomRuleRight").addClass('disallow');
				}
			} else if (newValue!=undefined){
				$(".firewallCustomRuleRight").removeClass('allow');
				$(".firewallCustomRuleRight").removeClass('disallow');
			}
		});
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_firewallCustomRule3.html");
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
			jQuery.orange.widget.MenuItem.setCurrent('m2.m2112');
		});

		var Description = $("#content").data('Description');
		var Protocol = $("#content").data('Protocol');
		var SourceIP = $("#content").data('SourceIP');
		var SourceMask = $("#content").data('SourceMask');
		var SourcePort_input = $("#content").data('SourcePort');
		var SourcePort;
		var SourcePortRangeEnd;
		if (SourcePort_input.indexOf("-") != -1) {
			SourcePort = jQuery.trim(SourcePort_input.substring(0, SourcePort_input.indexOf("-")));
			SourcePortRangeEnd = jQuery.trim(SourcePort_input.substring(SourcePort_input.indexOf("-")+1, SourcePort_input.length));
		} else {
			SourcePort = SourcePort_input;
			SourcePortRangeEnd = "";
		}

		var DestinationIP = $("#content").data('DestinationIP');
		var DestinationMask = $("#content").data('DestinationMask');
		var DestinationPort_input = $("#content").data('DestinationPort');
		var DestinationPort;
		var DestinationPortRangeEnd;
		if (DestinationPort_input.indexOf("-") != -1) {
			DestinationPort = jQuery.trim(DestinationPort_input.substring(0, DestinationPort_input.indexOf("-")));
			DestinationPortRangeEnd = jQuery.trim(DestinationPort_input.substring(DestinationPort_input.indexOf("-")+1, DestinationPort_input.length));
		} else {
			DestinationPort = DestinationPort_input;
			DestinationPortRangeEnd = "";
		}

		$("#Description")[0].setDataValue(Description);
		$("#Protocol")[0].setDataValue(Protocol);
		$("#SourceIP")[0].setDataValue(SourceIP);
		$("#SourceMask")[0].setDataValue(SourceMask);
		$("#SourcePort")[0].setDataValue(SourcePort);
		$("#SourcePortRangeEnd")[0].setDataValue(SourcePortRangeEnd);
		$("#DestinationIP")[0].setDataValue(DestinationIP);
		$("#DestinationMask")[0].setDataValue(DestinationMask);
		$("#DestinationPort")[0].setDataValue(DestinationPort);
		$("#DestinationPortRangeEnd")[0].setDataValue(DestinationPortRangeEnd);
		var Rule = "Device/Firewall/Rules/Rule";
		jQuery.orange.config.api.crud.read([Rule], function (result) {
			$("#Order")[0].setDataValue( result[Rule].nb+1 );
		});

		$("#firewallCustomRule3 form").bind("submitted", function() {
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
	}
};