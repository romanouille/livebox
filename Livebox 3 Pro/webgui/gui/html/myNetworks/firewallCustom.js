// Default values for new rows, by description
firewallCustom_tableDefaultValues = {
	"DNS": {protocol: "ALL", port: "53"},
	"HTTP": {protocol: "TCP", port: "80"},
	"HTTPS": {protocol: "TCP", port: "443"},
	"FTP-Data": {protocol: "TCP", port: "20"},
	"FTP": {protocol: "TCP", port: "21"},
	"POP3": {protocol: "TCP", port: "110"},
	"POP3S": {protocol: "TCP", port: "995"},
	"IMAP": {protocol: "TCP", port: "143"},
	"IMAPS": {protocol: "TCP", port: "993"},
	"SMTP": {protocol: "TCP", port: "25"},
	"SMTP-Auth": {protocol: "TCP", port: "587"},
	"SSMTP": {protocol: "TCP", port: "465"},
	"NTP": {protocol: "UDP", port: "123"},
	"NNTP": {protocol: "TCP", port: "119"},
	"SNMP": {protocol: "UDP", port: "161-162"},
	"Telnet": {protocol: "TCP", port: "23"},
	"SSH": {protocol: "TCP", port: "22"},
	"Traceroute": {protocol: "UDP", port: "32769-65535"},
	"Ping": {protocol: "ICMP", port: ""},
	"UNIK": {protocol: "ALL", port: ""},
	"IPsec": {protocol: "ALL", port: ""},
	"GRE": {protocol: "IP", port: "47"},
	"L2TP": {protocol: "UDP", port: "1701"},
	"H323 host call": {protocol: "ALL", port: ""},
	"SIP": {protocol: "ALL", port: "5060-5061"},
	"ICA": {protocol: "ALL", port: "1494"},
	"MS Remote Desktop": {protocol: "TCP", port: "3389"},
	"VNC": {protocol: "TCP", port: "5900-5910"}
};

function isEnterOrSpace(event) {
	var res = false;
	if (event != undefined) {
		var keycode = (event.which != undefined) ? event.which : event.charCode;
		if (keycode == 13 || keycode == 32) {
			res = true;
		}
	}
	return res;
}

// Define FirewallOrder widget specific to this page
jQuery.orange.widget.FirewallOrder = {
	getDataValue: function() {
		return parseInt(this.dataValue);
	},
	setDataValue: function(value) {
		this.dataValue = value;
		$(this).trigger("valueChange", [value]);
	}
};
(function($) {
	$.fn.widgetFirewallOrder = function(options) {
		return this.each(function() {
			this.getDataValue = jQuery.orange.widget.FirewallOrder.getDataValue;
			this.setDataValue = jQuery.orange.widget.FirewallOrder.setDataValue;
			var up = $("<span class='arrowup' tabindex='0'>&#160;</span>");
			up.attr("title", jQuery.orange.config.i18n.map["table.order.up.tip"]);
			up.click(firewallCustom_tableSortUp);
			up.keyup(function(event) {
				if (isEnterOrSpace(event)) {
					firewallCustom_tableSortUp(event);
				}
			});
			$(this).append(up[0]);
			var down = $("<span class='arrowdown' tabindex='0'>&#160;</span>");
			down.attr("title", jQuery.orange.config.i18n.map["table.order.down.tip"]);
			down.click(firewallCustom_tableSortDown);
			down.keyup(function(event) {
				if (isEnterOrSpace(event)) {
					firewallCustom_tableSortDown(event);
				}
			});
			$(this).append(down[0]);
		});
	};
}) (jQuery);

// Auto-complete with text when empty
var autoCompleteDivId = 0;
AUTOCOMPLETE_EMPTYTEXT_CSS_CLASS = "emptyText";
AUTOCOMPLETE_EMPTYTEXT_I18N_SUFFIX = ".emptyText";
function makeAutoComplete(jNode, emptyText, completionArray, stringInItalic) {
	
	var divId = "combobox-autocomplete-" + autoCompleteDivId;
	autoCompleteDivId++;
	$("<div></div>", {
	    id: divId
	}).appendTo("#content");
	
	jNode[0].focused = false;
	jNode[0].unfolded = false;
	
	jNode.autocomplete({minLength: 0, appendTo: ("#" + divId), source: completionArray});
	
	jNode.focus(function() {
		this.focused = true;
		if (jNode[0].value == emptyText)
			jNode[0].value = "";
		jNode.removeClass(AUTOCOMPLETE_EMPTYTEXT_CSS_CLASS);
	});
	jNode.blur(function() {
		this.focused = false;
		if (this.getDataValue() == "") {
			if (this.value != emptyText) {
				this.value = emptyText;
			}
			$(this).addClass(AUTOCOMPLETE_EMPTYTEXT_CSS_CLASS);
		} else {
			$(this).removeClass(AUTOCOMPLETE_EMPTYTEXT_CSS_CLASS);
		}
	});
	jNode.bind("autocompleteopen", function(event, ui) {
		this.unfolded = true;
		if (stringInItalic != undefined) {
			$(".ui-autocomplete > li:last > a", $("#" + divId)).filter(
					function() {
						return this.text == stringInItalic;
					}
				).css("font-style", "italic");
		}
	});
	jNode.bind("autocompleteclose", function(event, ui) {
		this.unfolded = false;
	});
	jNode.click(function() {
		if (this.unfolded) {
			jNode.autocomplete("close"); // fold
		} else {
			jNode.autocomplete("search", ""); // unfold
		}
	});
	
	jNode.bind("change valueChange", function() {
		if (this.focused) {
			
		} else {
			if (this.getDataValue() == "") {
				if (this.value != emptyText) {
					this.value = emptyText;
				}
				$(this).addClass(AUTOCOMPLETE_EMPTYTEXT_CSS_CLASS);
			} else {
				$(this).removeClass(AUTOCOMPLETE_EMPTYTEXT_CSS_CLASS);
			}
		}
	});

	jNode.bind("autocompletechange", function(event, ui) {
		if (ui.item != null) {
			this.setDataValue(ui.item.value);
		}
	});

	jNode.bind("autocompleteselect", function(event, ui) {
		if (ui.item != null) {
			if (ui.item.value == emptyText) {
				this.setDataValue("");
			} else {
				this.setDataValue(ui.item.value);
			}
		}
	});

	jNode[0].getDataValue = function() {
		return (this.value == emptyText) ? "" : this.value;
	};
	
	jNode.trigger("change");
}

function firewallCustom_tableOnDataRead(data) {
	// this = widget node
	this.onDataReadOri.call(this, {nb: data.nb, constraints: data.constraints, values: data.values});
	jQuery.orange.widget.Table.sort.call(this, 9);
	firewallCustom_tableArrowsDisable.call(this);
}

function firewallCustom_tableArrowsDisable() {
	// this = widget node or table node
	$('.arrowup.disabled', this).removeClass('disabled').attr("title", jQuery.orange.config.i18n.map["table.order.up.tip"]);
	$('.arrowdown.disabled', this).removeClass('disabled').attr("title", jQuery.orange.config.i18n.map["table.order.down.tip"]);
	var notDeleted = $("tbody tr:not(.table-row-deleted)", this);
	$(".table-col-9 .arrowup", notDeleted[0]).addClass('disabled').removeAttr("title");
	$(".table-col-9 .arrowdown", notDeleted[notDeleted.length - 1]).addClass('disabled').removeAttr("title");
}

function firewallCustom_tableResetOrder() {
	var orderList = $("div.table-col-9[widgettype='FirewallOrder']");
	for(var i=0;i<orderList.length;i++) {
		orderList[i].setDataValue(i);
	}
}

function firewallCustom_tableSortUp(event) {
	var widget = event.target.parentNode;
	var tr = widget.parentNode.parentNode;
	var trPrev = tr.previousSibling;
	if (trPrev == undefined)
		return;
	var order = widget.getDataValue();
	widget.setDataValue(order - 1);
	$("td:eq(9)", trPrev)[0].firstChild.setDataValue(order);
	var tbody = tr.parentNode;
	tbody.removeChild(tr);
	tbody.insertBefore(tr, trPrev);
	firewallCustom_tableArrowsDisable.call(tbody.parentNode);
	firewallCustom_tableResetOrder();
}

function firewallCustom_tableSortDown(event) {
	var widget = event.target.parentNode;
	var tr = widget.parentNode.parentNode;
	var trNext = tr.nextSibling;
	if (trNext == undefined)
		return;
	var order = widget.getDataValue();
	widget.setDataValue(order + 1);
	$("td:eq(9)", trNext)[0].firstChild.setDataValue(order);
	var tbody = tr.parentNode;
	tbody.removeChild(trNext);
	tbody.insertBefore(trNext, tr);
	firewallCustom_tableArrowsDisable.call(tbody.parentNode);
	firewallCustom_tableResetOrder();
}

function firewallCustom_tableRangeOnDataUpdate(value, result) {
	if (result != undefined)
		return;
	this.dataValueRef = this.getDataValue();
	jQuery.orange.widget.Form.onDataChange.call(getFirstParentWithNodeName(this, "FORM"), this);
}

function firewallCustom_tableDescSelectChange(event, ui) {
	var input = event.target;
	//arrayRemove(getFirstParentWithNodeName(td, "FORM").modifsOK, input);
//	var value = (ui != undefined && ui.item != undefined) ? ui.item.value : input.value;
	var value = (ui != undefined) ? ui : input.value;
	var td = input.parentNode;
	
	if (value != jQuery.orange.config.i18n.map[$(input).attr("i18n")+AUTOCOMPLETE_EMPTYTEXT_I18N_SUFFIX]) {
		var protocolAndPort = firewallCustom_tableDefaultValues[value];
		if (protocolAndPort != undefined) {
			var tr = td.parentNode;
			select = $("td:eq(1) select", tr)[0];
			var protocol = protocolAndPort.protocol;
			//if (protocol == "Any" || protocol == "TCP" || protocol == "UDP") {
			//	$(select).empty().attr("enumerated", "['Any','TCP','UDP']").append("<option value='Any'>Any</option><option value='TCP'>TCP</option><option value='UDP'>UDP</option>");
			//	select.selectedIndex = (protocol == "Any") ? 0 : (protocol == "TCP") ? 1 : 2;
			//} else {
			//	$(select).empty().attr("enumerated", "['" + protocol + "']").append("<option value='" + protocol + "'>" + protocol + "</option>");
			//}
			if(protocol == undefined){
				protocol = "ALL";
			}
			if (protocol == "ALL") {
				protocol = jQuery.orange.config.i18n.map["page.myNetwork.firewallCustom.customrules.ipsrc.protocol.ALL"];
			}
//			select.setDataValue(protocol);
			for (var i = 0; i < select.length; i++){
				
				if (select.item(i).text == protocol){
					select.item(i).selected = true;
				}
			}
			$("td:eq(7) input", tr)[0].setDataValue(protocolAndPort.port);
		}
	}
	else {
		var tr = td.parentNode;
		$("td:eq(1) select", tr)[0].setDataValue("TCP");
		$("td:eq(7) input", tr)[0].setDataValue("");
	}
}

function firewallCustom_tableAddRow(id, attrs) {
	// this = widget node
	if (attrs != undefined) {
		if (attrs.SourcePort != undefined){
			if (attrs.SourcePortRangeEnd != undefined && parseInt(attrs.SourcePortRangeEnd) > 0){
				attrs.SourcePortRange = attrs.SourcePort + "-" + attrs.SourcePortRangeEnd;
			}else{
				attrs.SourcePortRange = "" + attrs.SourcePort;
			}
		}
		if (attrs.DestinationPort != undefined){
			if (attrs.DestinationPortRangeEnd != undefined && parseInt(attrs.DestinationPortRangeEnd) > 0){
				attrs.DestinationPortRange = attrs.DestinationPort + "-" + attrs.DestinationPortRangeEnd;
			}else{
				attrs.DestinationPortRange = "" + attrs.DestinationPort;
			}
		}
	}

	var currentId;
	var tr;
	if (attrs != undefined && attrs.uid != undefined) {
		currentId = $("#firewallTable").attr("dataid") + "[@uid='"+attrs.uid+"']";
	}
	else if (id != undefined) {
		currentId = $("#firewallTable").attr("dataid") + "[@uid='"+id+"']"; 
	}
	else {
		currentId = id;
	}
	tr = jQuery.orange.widget.Table.addRow.call(this, currentId, attrs);

	$("td:eq(1) select", tr).each(function() {
		if (this.dataValueRef != undefined && this.getDataValue() != this.dataValueRef) { // For example ICMP for Ping
			var value = this.dataValueRef;
			$(this).empty().attr("enumerated", "['" + value + "']").append("<option value='" + value + "'>" + value + "</option>");
			this.setDataValue(value);
		}
	});
	$("td:eq(4) input", tr)[0].onDataUpdate = firewallCustom_tableRangeOnDataUpdate;
	$("td:eq(7) input", tr)[0].onDataUpdate = firewallCustom_tableRangeOnDataUpdate;

	firewallCustom_tableArrowsDisable.call(this);

	var name, source = new Array();
	for (name in firewallCustom_tableDefaultValues)
		source.push(name);
	var inputAppli = $("td:eq(0) input", tr);
	var emptyText = jQuery.orange.config.i18n.map[inputAppli.attr("i18n") + AUTOCOMPLETE_EMPTYTEXT_I18N_SUFFIX];
	makeAutoComplete(inputAppli, emptyText, source);
	if (attrs != undefined)
		jQuery.orange.setDataValue(inputAppli[0], attrs['Description']);
	inputAppli.bind("valueChange", firewallCustom_tableDescSelectChange);
	
	if (attrs != undefined)
		return tr;

	$("td:eq(2) input", tr)[0].setDataValue("192.168.1.0");
	$("td:eq(3) input", tr)[0].setDataValue("255.255.255.0");
	$("td:eq(4) input", tr)[0].setDataValue("0");
	$("td:eq(5) input", tr)[0].setDataValue("0.0.0.0");
	$("td:eq(6) input", tr)[0].setDataValue("0.0.0.0");
	$("td:eq(7) input", tr)[0].setDataValue("0");
//	$("td:eq(8) select", tr)[1].setDataValue(true);
	if($("td:eq(8) select", tr)[0].item(0).text == "Rejeter"){
		$("td:eq(8) select", tr)[0].item(1).selected = true;
	}
	var order;
	if (tr.previousSibling != undefined)
		order = parseInt($("td:eq(9)", tr.previousSibling)[0].firstChild.getDataValue()) + 1;
	else
		order = 2;
	$("td:eq(9) div", tr)[0].setDataValue(order);
	$("td:eq(10) input", tr)[0].setDataValue(true);

	return tr;
}

function firewallCustom_tableGetActions(crudAction) {
	// this = <form> node
	var actions = jQuery.orange.widget.Table.getActions.call(this, crudAction);
	if (actions === false)
		return false;
	var i;
	for (i in actions) {
		var action = actions[i];
		if (action.crud == "update") {
			if (action.id.endsWith("Range")) {
				var prefix = action.id.substring(0, action.id.length - 5);
				action.id = prefix;
				var index = action.value.indexOf("-");
				if (index != -1) {
					var end = action.value.substring(index + 1);
					action.value = action.value.substring(0, index);
					actions.push({
						id: action.id + "RangeEnd",
						crud: "update",
						node: action.node,
						value: end
					});
				} else
					actions.push({
						id: action.id + "RangeEnd",
						crud: "update",
						node: action.node,
						value: ""
					});
			}
		} else if (action.crud == "create") {
			var attrs = action.attrs, newAttrs = {};
			var name;
			for (name in attrs) {
				var value = attrs[name];
				if (name.endsWith("Range")) {
					var prefix = name.substring(0, name.length - 5);
					var index = value.indexOf("-");
					if (index != -1) {
						var end = value.substring(index + 1);
						newAttrs[prefix] = value.substring(0, index);
						newAttrs[prefix + "RangeEnd"] = value.substring(index + 1);
					} else
						newAttrs[prefix] = value;
				} else
					newAttrs[name] = value;
			}
			action.attrs = newAttrs;
		}
	}

	return actions;
}

function firewallCustom_tableOnReset() {
	// this = <form> node
	jQuery.orange.widget.Table.onReset.call(this);
	jQuery.orange.widget.Table.sort.call(this.parentNode.parentNode, 9);

	firewallCustom_tableArrowsDisable.call(this);
	
	// WARNING: Necessaire pour desactiver le bouton "Annuler" alors qu'il y a plus rien dans dataKO ni modifsOK
	// (dataKO est reinitialisé par l'appel au onReset de la form parente)
	// le current state est déja à STATE_NO_MODIF
	jQuery.orange.widget.Form.onStateChange.call(this, jQuery.orange.widget.Form.STATE_MODIF_OK, jQuery.orange.widget.Form.STATE_NO_MODIF);
}

jQuery.orange.config.areacontent.firewallCustom = {
	postParse: function(area) {
		var table = $("#firewallTable", area)[0];
		$(".table-add-container", table).append('<span class="spacer"/>');
		$(".table-add-container", table).append($("#firewallStep", area)[0]);
		$(".table-add-container", table).before($("#firewallStepLabel", area)[0]);
		table.addRow = firewallCustom_tableAddRow;
		table.onDataReadOri = table.onDataRead;
		table.onDataRead = firewallCustom_tableOnDataRead;
		$(table).bind("rowMarkedToDelete", function(event, tr) {
			var form = getFirstParentWithNodeName(tr, "FORM");
			firewallCustom_tableArrowsDisable.call(form);
		});
		$(table).bind("rowDeleted", function(event, tr, previousSibling) {
			var form = getFirstParentWithNodeName(previousSibling, "FORM");
			firewallCustom_tableArrowsDisable.call(form);
		});
		var form = $("form", table)[0];
		form.getActions = firewallCustom_tableGetActions;
		form.onReset = firewallCustom_tableOnReset;
	},
	postLoad: function() {
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_firewallCustom.html");
		});
		
		$("#firewallTableErr").insertAfter($("#firewallTable table"));
		$("#firewallTable .table-add-button a").attr('i18n', 'page.myNetwork.firewallCustom.customrules.add2').parent().orangeParse();
		$("#firewallTable .table-add-button img").attr('i18n', 'page.myNetwork.firewallCustom.customrules.add').parent().orangeParse();
		
		$("#restorebtn").click(function(){
			openConfirmationPopup('popup.confirm.title', 'popup.confirm.text',
				function() {
					jQuery.orange.config.api.rpc.restoreFirewall(function() {
						// Refresh the table with the new values
						$("#content").orangeLoad(menu.mapping.firewallCustom, function() {
							popups_crudCallback();
						});
					});
				}
			);
		});
		
		$("#firewallCustom form")[0].crudCallDelegate = function(crudExec) {
			crudExec();
		};
		$(".table-col-9 > div").css("width","30px");
	}
};