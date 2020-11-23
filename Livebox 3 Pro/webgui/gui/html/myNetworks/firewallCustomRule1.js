jQuery.orange.config.areacontent.firewallCustomRule1 = {
	postParse: function() {
		var name, source = new Array();
		for (name in firewallCustom_tableDefaultValues)
			source.push(name);
		var inputAppli = $("#applicationInput");
		var emptyText = jQuery.orange.config.i18n.map[inputAppli.attr("i18n")+AUTOCOMPLETE_EMPTYTEXT_I18N_SUFFIX];
		makeAutoComplete(inputAppli, emptyText, source);
		var jSelect = $("#protocol select");
		var select = jSelect[0];

		inputAppli.bind("valueChange autocompletechange autocompleteclose", function(event, ui) {
			var enumerated = "['ALL','TCP','UDP','ICMP','GRE','ESP','AH']";
			var appliName = event.target.getDataValue();
			if (appliName != "") {
				if (appliName == 'Ping') {
					enumerated = "['ICMP']";
				} else if(appliName == 'GRE') {
					enumerated = "['GRE']";
				}
				jSelect.empty().attr("enumerated", enumerated);
				jQuery.orange.widget.Select.buildFromEnumerated.call(select);
				if (firewallCustom_tableDefaultValues[appliName] != undefined) {
					select.setDataValue(firewallCustom_tableDefaultValues[appliName]['protocol']);
				}
				$(".application").html(appliName);
				$("#btnNext").setDisabled(false);
			} else {
				jSelect.attr("enumerated", enumerated);
				jQuery.orange.widget.Select.buildFromEnumerated.call(select);
				$(".application").html("&#160;");
				$("#btnNext").setDisabled(true);
			}
		});

		$("#btnNext").setDisabled(true);

		if( $("#content").data('Description') != undefined ) {
			$("#applicationInput").val($("#content").data('Description'));
			$("#applicationInput").trigger('valueChange');
			$("#applicationInput").removeClass(AUTOCOMPLETE_EMPTYTEXT_CSS_CLASS);
		}

		if( $("#content").data('Protocol') != undefined ) {
			$("#protocol select")[0].setDataValue($("#content").data('Protocol'));
		}

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

		$("#btnNext").bind('click', function() {
			$("#content").data('Description', $("#applicationInput")[0].getDataValue());

			$("#content").data('Protocol', $("#protocol select")[0].getDataValue());
			jQuery.orange.widget.MenuItem.setCurrent('m2.m2112');
		});
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_firewallCustomRule1.html");
		});
	}
};