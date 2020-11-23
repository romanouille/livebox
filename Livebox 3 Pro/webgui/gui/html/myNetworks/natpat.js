// Default values for new rows, by description

natpat_tableDefaultValues = {
	"ALL": {protocol: "ALL", port: "0"},
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
	"NTP": {protocol: "UDP", port: "123"},
	"NNTP": {protocol: "TCP", port: "119"},
	"Telnet": {protocol: "TCP", port: "23"},
	"SSH": {protocol: "TCP", port: "22"},
	"Ping": {protocol: "ICMP"}
};
//// Define NatpatOrder widget specific to this page
/*jQuery.orange.widget.NatpatOrder = {
	getDataValue: function() {
		return parseInt(this.dataValue);
	},
	setDataValue: function(value) {
		this.dataValue = value;
		$(this).trigger("valueChange", [value]);
	}
};
(function($) {
	$.fn.widgetNatpatOrder = function(options) {
		return this.each(function() {
			this.getDataValue = jQuery.orange.widget.NatpatOrder.getDataValue;
			this.setDataValue = jQuery.orange.widget.NatpatOrder.setDataValue;
			var up = $("<span class='arrowup'>&#160;</span>");
			up.attr("title", jQuery.orange.config.i18n.map["table.order.up.tip"]);
			up.click(NatpatOrder_tableSortUp);
			$(this).append(up[0]);
			var down = $("<span class='arrowdown'>&#160;</span>");
			down.attr("title", jQuery.orange.config.i18n.map["table.order.down.tip"]);
			down.click(NatpatOrder_tableSortDown);
			$(this).append(down[0]);
		});
	};
}) (jQuery);

function NatpatOrder_tableSortUp(event) {
	var widget = event.target.parentNode;
	var tr = widget.parentNode.parentNode;
	var trPrev = tr.previousSibling;
	if (trPrev == undefined)
		return;
	var order = widget.getDataValue();
	widget.setDataValue(order - 1);
	$("td:eq(5)", trPrev)[0].firstChild.setDataValue(order);
	var tbody = tr.parentNode;
	tbody.removeChild(tr);
	tbody.insertBefore(tr, trPrev);
	natpat_tableArrowsDisable.call(tbody.parentNode);
	natpat_tableResetOrder();
}

function natpat_tableArrowsDisable() {
	// this = widget node or table node
	$('.arrowup.disabled', this).removeClass('disabled').attr("title", jQuery.orange.config.i18n.map["table.order.up.tip"]);
	$('.arrowdown.disabled', this).removeClass('disabled').attr("title", jQuery.orange.config.i18n.map["table.order.down.tip"]);
	var notDeleted = $("tbody tr:not(.table-row-deleted)", this);
	$(".table-col-5 .arrowup", notDeleted[0]).addClass('disabled').removeAttr("title");
	$(".table-col-5 .arrowdown", notDeleted[notDeleted.length - 1]).addClass('disabled').removeAttr("title");
}
function natpat_tableResetOrder() {
	var orderList = $("div.table-col-5[widgettype='FirewallOrder']");
	for(var i=0;i<orderList.length;i++) {
		orderList[i].setDataValue(i);
	}
}

function NatpatOrder_tableSortDown(event) {
	var widget = event.target.parentNode;
	var tr = widget.parentNode.parentNode;
	var trNext = tr.nextSibling;
	if (trNext == undefined)
		return;
	var order = widget.getDataValue();
	widget.setDataValue(order + 1);
	$("td:eq(5)", trNext)[0].firstChild.setDataValue(order);
	var tbody = tr.parentNode;
	tbody.removeChild(trNext);
	tbody.insertBefore(trNext, tr);
	natpat_tableArrowsDisable.call(tbody.parentNode);
	natpat_tableResetOrder();
}*/

//
function natpat_tableRangeOnDataUpdate(value, result) {
	if (result != undefined)
		return;
	this.dataValueRef = this.getDataValue();
	jQuery.orange.widget.Form.onDataChange.call(getFirstParentWithNodeName(this, "FORM"), this);
}

function natpat_tableSelect4Change(event, ui) {
	var input = event.target;
	if(input.value == jQuery.orange.config.i18n.map["page.myNetwork.natpat.redirections.equipmentip.ipchoice"]){
		input.setDataValue("");
		jQuery.orange.widget.Form.verifyConstraints(input,false);
	}
}

function natpat_tableSelect0Change(event, ui) {
	var input = event.target;
	var value = (ui.item != undefined) ? ui.item.value : input.value;
	var td = input.parentNode;
	
	if (value != jQuery.orange.config.i18n.map[$(input).attr("i18n")+AUTOCOMPLETE_EMPTYTEXT_I18N_SUFFIX]) {
		var protocolAndPort = natpat_tableDefaultValues[value];
		if (protocolAndPort != undefined) {
			var tr = td.parentNode;
			if (protocolAndPort.port != undefined){
				$("td:eq(1)  [widgettype='PortRange']", tr)[0].setDataValue(protocolAndPort.port);
			}
			$("td:eq(2) [widgettype='PortRange']", tr)[0].setDataValue("0");
			
			natpat_tableOnRowSelect(null, tr);
			
			select = $("td:eq(3) select", tr)[0];
			var protocol = protocolAndPort.protocol;
			select.setDataValue(protocol);
		}
	}
	else {
		var tr = td.parentNode;
		$("td:eq(1) input", tr)[0].setDataValue("");		
		$("td:eq(3) select", tr)[0].setDataValue("TCP");
		
	}
}

function natpat_tableAddRow(id, attrs) {
	// this = widget node
	if (attrs != undefined) {
		if (attrs.ExternalPort != undefined)
			if (attrs.ExternalPortEndRange != undefined && parseInt(attrs.ExternalPortEndRange) > 0)
				attrs.ExternalPortRange = attrs.ExternalPort + "-" + attrs.ExternalPortEndRange;
			else
				attrs.ExternalPortRange = "" + attrs.ExternalPort;
		if (attrs.InternalPort != undefined)
			if (attrs.InternalPortEndRange != undefined && parseInt(attrs.InternalPortEndRange) > 0 && attrs.InternalPort != attrs.InternalPortEndRange)
				attrs.InternalPortRange = attrs.InternalPort + "-" + attrs.InternalPortEndRange;
			else
				attrs.InternalPortRange = "" + attrs.InternalPort;
	}

	var currentId;
	var tr;
	if (attrs != undefined && attrs.uid != undefined) {
		currentId = $("#natpatTable").attr("dataid") + "[@uid='"+attrs.uid+"']";
	}
	else if (id != undefined) {
		currentId = $("#natpatTable").attr("dataid") + "[@uid='"+id+"']"; 
	}
	else {
		currentId = id;
	}
	tr = jQuery.orange.widget.Table.addRow.call(this, currentId, attrs);
	
	$("td:eq(3) select", tr).each(function() {
		if (this.dataValueRef != undefined && this.getDataValue() != this.dataValueRef) { // For example ICMP for Ping
			var value = this.dataValueRef;
			$(this).empty().attr("enumerated", "['" + value + "']").append("<option value='" + value + "'>" + value + "</option>");
			this.setDataValue(value);
		}
	});
	$("td:eq(1) input", tr)[0].onDataUpdate = natpat_tableRangeOnDataUpdate;
	$("td:eq(2) input", tr)[0].onDataUpdate = natpat_tableRangeOnDataUpdate;

	var source = new Array();
	for (var name in natpat_tableDefaultValues)
		source.push(name);
	var inputAppli = $("td:eq(0) input", tr);
	var emptyText = jQuery.orange.config.i18n.map[inputAppli.attr("i18n")+AUTOCOMPLETE_EMPTYTEXT_I18N_SUFFIX];
	makeAutoComplete(inputAppli, emptyText, source);
	if (attrs != undefined)
		jQuery.orange.setDataValue(inputAppli[0], attrs['Description']);
	inputAppli.bind("valueChange autocompletechange autocompleteclose", natpat_tableSelect0Change);
	/////////////////////////////////////
	
	var inputEquip = $("td:eq(4) input", tr);
	inputEquip.bind("valueChange autocompletechange autocompleteclose", natpat_tableSelect4Change);
	
	/////////////////////////////////////

	source = new Array();
	for (var index in natpat_tableDeviceList) {		
		var active = natpat_tableDeviceList[index]["Active"];
		var IPAddress = natpat_tableDeviceList[index]["IPAddress"];
		var userFriendlyName = natpat_tableDeviceList[index]["UserFriendlyName"];
		var sourceNature = natpat_tableDeviceList[index]["AddressSource"];
		if (active =="CONNECTED"){
			source.push(userFriendlyName);
		}else if(sourceNature == "STATIC"){
			source.push(IPAddress);
		}
				
	}
	var inputDevice = $("td:eq(4) input", tr);
	var emptyTextDevice = jQuery.orange.config.i18n.map[inputDevice.attr("i18n")+AUTOCOMPLETE_EMPTYTEXT_I18N_SUFFIX];
	var ipchoiceDevice = jQuery.orange.config.i18n.map[inputDevice.attr("i18n")+".ipchoice"];
	emptyTextDevice = ipchoiceDevice;
	if( source.length > 0){
		source.push("");
	}
	source.push(ipchoiceDevice);
	makeAutoComplete(inputDevice, ipchoiceDevice, source, ipchoiceDevice);

	inputDevice[0].getDataValue = function() {
		var value = inputDevice.val();
		if (value != "") {
			for (var index in natpat_tableDeviceList) {
				if (natpat_tableDeviceList[index]["UserFriendlyName"] == value) {
					return natpat_tableDeviceList[index]["IPAddress"];	
				}
			}
		}
		return (this.value == ipchoiceDevice) ? "" : this.value;
	};
	
	inputDevice[0].setDataValue = function(value) {
		this.value = value;
		$(this).trigger("valueChange", [value]);
	};
	
	// Surcharge la fonction validate/getError pour le cas de la combo editable equipement.
	inputDevice[0].validate = function() {
		var NOT_GOOD_NOT_WRONG = fr.orange.livebox.gui.api.ProgressiveRegexp.NOT_GOOD_NOT_WRONG;
		var GOOD = fr.orange.livebox.gui.api.ProgressiveRegexp.GOOD;
		var WRONG = fr.orange.livebox.gui.api.ProgressiveRegexp.WRONG;
		
		var displayValue = inputDevice.val();
		
		if (displayValue == ""|| displayValue == jQuery.orange.config.i18n.map["page.myNetwork.natpat.redirections.equipmentip.ipchoice"]) {
			return NOT_GOOD_NOT_WRONG;
		}
		
		for (var index in natpat_tableDeviceList) {
			if (natpat_tableDeviceList[index]["UserFriendlyName"] == displayValue || natpat_tableDeviceList[index]["IPAddress"] == displayValue){
//				var ipRegex = '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}';
//				var stringRegex = '[a-zA-Z].*';
//				var macRegex = '([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])';
//				var matchIPResult = displayValue.match(ipRegex);
//				var matchStringRegex = displayValue.match(stringRegex);
//				var matchMACResult = displayValue.match(macRegex);
				
				if(natpat_isStatic(natpat_tableDeviceList[index]["PhysAddress"]) /*|| (matchIPResult != null && matchIPResult[0] == displayValue)
  					|| (matchMACResult != null && matchMACResult[0] == displayValue)
					|| natpat_tableDeviceList[index]["AddressSource"] == "STATIC"*/){
					this.error = undefined;
					return GOOD;
				} else {
					this.error = "notstatic";
					return WRONG;
				}
			}
		}
		if (jQuery.orange.widget.Form.constraint.regex(jQuery.orange.config.namedregex.ipaddress, natpat_tableDeviceList[index]["IPAddress"]) == WRONG){
			this.error = "ip";
			return WRONG;
		} else {
			this.error = undefined;
			return GOOD;
		}
	};
	inputDevice[0].getError = function() {
		return this.error;
	};
	
	//Selection de la valeur affich�e dans inputDevice.
	if (attrs != undefined && attrs['InternalClient'] != "") {	
		for(var index in natpat_tableDeviceList ){
			if (natpat_tableDeviceList[index]["IPAddress"] == attrs['InternalClient'] ){
				if (natpat_tableDeviceList[index]["UserFriendlyName"]!=""){
					inputDevice.val(natpat_tableDeviceList[index]["UserFriendlyName"]);
				}else{
					inputDevice.val(attrs['InternalClient']);
				}
			}
			
		}
	}else {
		inputDevice.val(emptyTextDevice);
		inputDevice.addClass(AUTOCOMPLETE_EMPTYTEXT_CSS_CLASS);
	}
	
	inputDevice.bind("valueChange", function(event, ui) {
		inputDevice.trigger("change");
	});
	
	inputDevice.bind("autocompletechange autocompleteclose", function(event, ui) {
		if (ui.item != undefined){
			inputDevice[0].setDataValue(ui.item.value);
		}
	});
	///////////////////
	
	if (attrs != undefined)
		return tr;

	$("td:eq(2) input", tr)[0].setDataValue("0");
	$("td:eq(5) input", tr)[0].setDataValue(true);
	return tr;
}

function natpat_tableGetActions(crudAction) {
	// this = <form> node
	var actions = jQuery.orange.widget.Table.getActions.call(this, crudAction);
	if (actions === false)
		return false;
	for (var i in actions) {
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
						id: action.id + "EndRange",
						crud: "update",
						node: action.node,
						value: end
					});
				}
			}
		} else if (action.crud == "create") {			
			action.id="Device/NAT/PortMappings/PortMapping";
			var attrs = action.attrs, newAttrs = {Creator: "USER"};
			for (var name in attrs) {
				var value = attrs[name];
				if (name.endsWith("Range")) {
					var prefix = name.substring(0, name.length - 5);
					var index = value.indexOf("-");
					if (index != -1) {
						newAttrs[prefix] = value.substring(0, index);
						newAttrs[prefix + "EndRange"] = value.substring(index + 1);
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

function natpat_tableOnRowSelect(event, tr) {
	$("#natpat #externalport").text($("td:eq(1) input", tr)[0].value);
	$("#natpat #internalport").text($("td:eq(2) input", tr)[0].value);
	$("input[type=text]", tr.parentNode).unbind(".natpat");
	$("td:eq(1) input", tr).bind("keyup.natpat", function(event) {
		$("#natpat #externalport").text(event.target.value);
	});
	$("td:eq(1) [widgettype='PortRange']", tr).bind("valueChange.natpat", function(event) {
		$("#natpat #externalport").text($("input", this)[0].value);
	});
	$("td:eq(2) input", tr).bind("keyup.natpat", function(event) {
		$("#natpat #internalport").text(event.target.value);
	});
}

function natpat_initializeStaticDeviceList() {
	natpat_staticDeviceList = {};
	var xpath_staticPoolDevices = "Device/Networks/LAN[@name='LAN']/StaticPoolDevices/StaticPoolDevice";
	jQuery.orange.config.api.crud.read(
		[xpath_staticPoolDevices],
		function (result) {
			var data = result[xpath_staticPoolDevices];
			if (data != undefined) {
				for (var device in data.values) {
					var macAddress = data.values[device]["PhysAddress"];
					if (macAddress != undefined && macAddress != "") {
						natpat_staticDeviceList[macAddress] = "static";
					}
				}
			}
		}
	);
}

String.prototype.startsWith = function(str){
	return (this.match("^"+str)==str);
};

String.prototype.trim = function(){
	return 	(this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, ""));
};

function natpat_isStatic(macAddress) {
	return (natpat_staticDeviceList[macAddress] == "static");
}

jQuery.orange.config.areacontent.natpat = {
	postParse: function(area) {
		natpat_initializeStaticDeviceList();
		
		natpat_tableDeviceList = new Array();
		var EthernetDevice = "Device/Networks/LAN[@name='LAN']/ConnectedDevices/EthernetDevice";
		var i=0;
		jQuery.orange.config.api.crud.read(
			[EthernetDevice],
			function (result) {
				if (result[EthernetDevice] != undefined) {
					for (var device in result[EthernetDevice].values) {
						natpat_tableDeviceList[i] = {
							"IPAddress":result[EthernetDevice].values[device]["IPAddress"],
							"UserFriendlyName": result[EthernetDevice].values[device]["UserFriendlyName"],
							"AddressSource": result[EthernetDevice].values[device]["AddressSource"],
							"PhysAddress": result[EthernetDevice].values[device]["PhysAddress"],
							"Active": result[EthernetDevice].values[device]["Active"],
							"Uid": result[EthernetDevice].values[device]["uid"]
						}; 
						i++;
					}
				}
			}
		);
	
		var WiFiDevice = "Device/Networks/LAN[@name='LAN']/ConnectedDevices/WiFiDevice";
		jQuery.orange.config.api.crud.read(
			[WiFiDevice],
			function (result) {
				if (result[WiFiDevice] != undefined) {
					for (var device in result[WiFiDevice].values) {
						natpat_tableDeviceList[i] = {
							"IPAddress":result[WiFiDevice].values[device]["IPAddress"],
							"UserFriendlyName": result[WiFiDevice].values[device]["UserFriendlyName"],
							"AddressSource": result[WiFiDevice].values[device]["AddressSource"],
							"PhysAddress": result[WiFiDevice].values[device]["PhysAddress"],
							"Active": result[WiFiDevice].values[device]["Active"],
							"Uid": result[WiFiDevice].values[device]["uid"]
						}; 
						i++;
					}
				}; 
			}
		);
	
		var table = $("#natpatTable", area)[0];
		table.addRow = natpat_tableAddRow;
		var form = $("form", table)[0];
		form.getActions = natpat_tableGetActions;
		$(table).bind("rowSelect", natpat_tableOnRowSelect);
	},
	postLoad: function() {
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_natpat.html");
		});
		
		$("#natpatTableErr").insertAfter($("#natpatTable table"));
		$("#natpatTable .table-add-button img").attr('i18n', 'page.myNetwork.natpat.redirections.add').parent().orangeParse();
		$("#natpat form")[0].crudCallDelegate = function(crudExec) {
			$("#btnSave").setDisabled(true);
			$("#btnCancel").setDisabled(true);
			crudExec();
		};
		jQuery.orange.widget.Table.NatPatIpAdress = false;
	}
};