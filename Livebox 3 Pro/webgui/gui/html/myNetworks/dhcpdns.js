function dhcpdns_disableElements() {
	var disabled = $("#ckDHCP")[0].getDataValue() == false;
	
	$("#dhcpSlotStart").setDisabled(disabled);
	$("#dhcpSlotEnd").setDisabled(disabled);
	$("#dnsmode").setDisabled(disabled);
	
	var isAutomaticDNS = ($("#dnsmode")[0].getDataValue() == "AUTOMATIC");
	$("#primaryDNS").setDisabled(disabled || isAutomaticDNS);
	$("#secondaryDNS").setDisabled(disabled || isAutomaticDNS);
	
	$("#ipvpnstart").setDisabled(disabled);
	$("#ipvpnend").setDisabled(disabled);
	$("#dhcpdnsTable").setDisabled(disabled);
	
	$("#tableStaticIP").setDisabled(disabled);
}

dhcpdns_tableId0 = "Device/Networks/LAN[@name='LAN']/ConnectedDevices/EthernetDevice";
dhcpdns_tableId1 = "Device/Networks/LAN[@name='LAN']/ConnectedDevices/WiFiDevice";
dhcpdns_tableId2 = "Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser[@Login='']";

function dhcpdns_tableSelectChange(event) {
	var select = event.target;
	var id = select.options[select.selectedIndex].value;
	var tr = select.parentNode.parentNode;
	$(tr).attr("dataId", id);
	var widget = getFirstParentWithNodeName(tr, "FORM").parentNode;
	var values = widget.mapping[id];
	var input = document.createElement("input");
	$(input).attr("dataId", values.nameAttr).attr("value", values.name).css('display', 'none');
	input.dataValueRef = values.name;

	var form = getFirstParentWithNodeName(select, "FORM");
	var oldState = jQuery.orange.widget.Table.getState.call(form);
	arrayRemove(form.dataKO, select);
	var newState = jQuery.orange.widget.Table.getState.call(form);
	if (newState != oldState)
		jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);


	$("td:eq(0)", tr).empty().append(input).orangeParse();
	$("td:eq(0)", tr).append(values.name);
	var jInput = $("td:eq(1) input", tr).attr("dataId", values.ipAttr).attr("value", values.ip);
	//jInput[0].dataValueRef = values.ip;
	jInput.trigger("change");
	$("td:eq(2) span", tr).empty().text(values.mac);
}

function dhcpdns_tableCheckIPSubnet_Validate(node) {
	var NOT_GOOD_NOT_WRONG = fr.orange.livebox.gui.api.ProgressiveRegexp.NOT_GOOD_NOT_WRONG;
	var GOOD = fr.orange.livebox.gui.api.ProgressiveRegexp.GOOD;
	var WRONG = fr.orange.livebox.gui.api.ProgressiveRegexp.WRONG;

	var dependentFuncs = [dhcpdns_checkBusinessRules_single_routerIp, dhcpdns_checkBusinessRules_single_subnetMask];
	var businessRule = 	function(value) { // business rule
		var iprouter = $("#iprouter")[0].getDataValue();
		var subnetmask = $("#subnetMask")[0].getDataValue();
		var iprouter32 = stringToIP32(iprouter);
		var subnet32 = stringToIP32(subnetmask);
		
		var ipvpnstart = $("#ipvpnstart")[0].getDataValue(); 
		var ipvpnstart32 = stringToIP32(ipvpnstart);
		
		var value32 = stringToIP32(value);
		
		return ( (iprouter32 & subnet32) == (value32 & subnet32)
			/*|| (ipvpnstart32 & subnet32) == (value32 & subnet32)*/ );
	};
	
	///ticket 1055

	function verifyNatPatIpAdressWithcurrentValue(node){
		var boolresult = false;
		var adressNatPat = "Device/NAT/PortMappings/PortMapping[InternalClient='" + node.dataValueRef + "']";
		jQuery.orange.config.api.crud.read(
				[adressNatPat],
				function (result) {
					if (result [adressNatPat] != undefined){
						if(node.dataValueRef != node.value){
							$("#natpatRuleForIp").css('display', 'block');
							boolresult = false;
						}
						else {
							boolresult = true;
						}
					}
					else{
						boolresult = true;
					}
				});
		return boolresult;
	}

	var hasNatPatAdressAssociated = !verifyNatPatIpAdressWithcurrentValue(node);
	////fin ticket 1055 
	       
	var res = false;
	
	// 1. First, check whether each dependent field has its constraints respected
	var depFuncsResult = true;
	for (var i = 0; i < dependentFuncs.length; i++) {
		if (dependentFuncs[i].call(this) != GOOD) {
			depFuncsResult = false;
			break;
		}
	}
	var regex = jQuery.orange.config.namedregex.ipaddress;
	var regexResult = jQuery.orange.widget.Form.constraint.regex(regex, node.getDataValue());
	if(regexResult != GOOD) {
		node.error = "ip";
		return regexResult;
	} else {
		if (depFuncsResult) {	
			if (hasNatPatAdressAssociated) {
				return WRONG;
			} else {
				res = businessRule(node.getDataValue());
				if(res) {
					node.error = undefined;
					return GOOD;
				} else {
					node.error = "badsubnet";
					return WRONG;
				}
				
			}
		} else {
			node.error = undefined;
			return NOT_GOOD_NOT_WRONG;
		}
	}
}

function buildSelectEquipmentList(jSelect, XConnectedDevices) {
	jQuery.orange.config.api.crud.read(
			[XConnectedDevices],
			function (result) {
				for(var connectedDevice in result[XConnectedDevices].values){
					var equipLabel;
					if(result[XConnectedDevices].values[connectedDevice]['UserFriendlyName'] != ""
							&& result[XConnectedDevices].values[connectedDevice]['UserFriendlyName'] != undefined
							&& result[XConnectedDevices].values[connectedDevice]['UserFriendlyName'] != null){
						equipLabel = result[XConnectedDevices].values[connectedDevice]['UserFriendlyName'];							
					}else if(result[XConnectedDevices].values[connectedDevice]['Login'] != ""
							&& result[XConnectedDevices].values[connectedDevice]['Login'] != undefined
							&& result[XConnectedDevices].values[connectedDevice]['Login'] != null){
						equipLabel = result[XConnectedDevices].values[connectedDevice]['Login'];
					}
					else{
						equipLabel = "";
					}

					//build enumerated
					var knowndevices = jSelect.attr("enumerated");
					connectedDevice = connectedDevice.replace("'","\'");
					knowndevices = knowndevices.substring(0, knowndevices.length-1);
					knowndevices = knowndevices+",\""+equipLabel+"\"]";
					jSelect.attr("enumerated", knowndevices);
					
					//build options
					var newoption = $("<option/>");
					newoption.attr("value",equipLabel);
					newoption.attr("refId",connectedDevice);
					newoption.text(equipLabel);
					jSelect.append(newoption);
				}
			});
}

function dhcpdns_postLoadTableAddRow(id, attrs) {
	
	var currentId;
	if (attrs != undefined && attrs.uid != undefined) {
		currentId = $("#dhcpdnsTable").attr("dataid") + "[@uid='"+attrs.uid+"']";
	} else if (id != undefined) {
		currentId = $("#dhcpdnsTable").attr("dataid") + "[@uid='"+id+"']"; 
	} else {
		currentId = id;
	}
	var tr = jQuery.orange.widget.Table.addRow.call(this, currentId, attrs);
	
	$(tr).bind('verifyNatPatIpAdress',function(){
		var adressNatPat = "Device/NAT/PortMappings/PortMapping[InternalClient='" + $("td:eq(1) input", this)[0].getDataValue() + "']";
		jQuery.orange.config.api.crud.read(
			[adressNatPat],
			function (result) {
				if (result [adressNatPat] != undefined || result [adressNatPat] != null){
					$("#natpatRuleForIp").css('display', 'block');
					jQuery.orange.widget.Table.NatPatIpAdress = true;
				}
				else{
					$("#natpatRuleForIp").css('display', 'none');
					jQuery.orange.widget.Table.NatPatIpAdress = false;
				}
			});
	});
	buildSelectEquipmentList($("td:eq(0) select", tr), "Device/Networks/LAN[@name='LAN']/ConnectedDevices/EthernetDevice");
	buildSelectEquipmentList($("td:eq(0) select", tr), "Device/Networks/LAN[@name='LAN']/ConnectedDevices/WiFiDevice");
	//buildSelectEquipmentList($("td:eq(0) select", tr), "Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser");
	$("td:eq(0) select.table-col-0", tr).addClass("italic-font-style")	;
	$("td:eq(0) select", tr).bind('valueChange',function(event, newvalue){
		var jTR = $(event.target).parent().parent();
		var XSelectedDevice = $(event.target[event.target.selectedIndex]).attr("refId");
		var ip;
		var mac;
		
		jQuery.orange.config.api.crud.read(
				[XSelectedDevice],
				function (result) {
					if(result[XSelectedDevice].values[XSelectedDevice]['Login'] != ""
						&& result[XSelectedDevice].values[XSelectedDevice]['Login'] != undefined
						&& result[XSelectedDevice].values[XSelectedDevice]['Login'] != null ){
						ip = result[XSelectedDevice].values[XSelectedDevice]['RemoteIPAddress'];						
						mac = result[XSelectedDevice].values[XSelectedDevice]['MACAddress'];
					}else{
						ip = result[XSelectedDevice].values[XSelectedDevice]['IPAddress'];						
						mac = result[XSelectedDevice].values[XSelectedDevice]['PhysAddress'];
					}
				});

		if(ip != undefined){
			$("td:eq(1) input", jTR)[0].setDataValue(ip);
		}

		if(mac != undefined){
			$("td:eq(2) input", jTR)[0].setDataValue(mac);
		}
	});
	
	// Creation d'une méthode validate qui sera appellée par VerifyConstraint du Form
	$("td:eq(1) input", tr)[0].validate = function() {
		return dhcpdns_tableCheckIPSubnet_Validate(this);
	};
	
	$("td:eq(1) input", tr)[0].getError = function() {
		return this.error;
	};
	
	return tr;
}


function dhcpdns_tableOnDataUpdateBecomeStatic() {
	// this = <tr> node
	this.crudAction = "update";
	var form = getFirstParentWithNodeName(this, "FORM");
	var oldState = jQuery.orange.widget.Table.getState.call(form);
	arrayRemove(form.addPending, this);
	$(form)[0].modifsOK = [];
	var newState = jQuery.orange.widget.Table.getState.call(form);
	if (newState != oldState)
		jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
	var self = $(this);
	var id = self.attr("dataId");
	form.parentNode.mapping[id]["static"] = true;
	self.removeClass("table-row-added");

	var jInput = $("td:eq(1) input", self);
	jInput[0].dataValueRef = jInput.val();

//	$("[dataId]", this).each(function() {
//		$(this).attr("dataId", id + "/" + $(this).attr("dataId"));
//	});
	$("select", form).each(function() {
		dhcpdns_fillNameSelect(form.parentNode.mapping, $(this));
	});
}

function dhcpdns_tableOnDataUpdateBecomeNotStatic() {
	// this = <tr> node
	var form = getFirstParentWithNodeName(this, "FORM");
	var oldState = jQuery.orange.widget.Table.getState.call(form);
	arrayRemove(form.deletePending, this);
	$(this).remove();
	var newState = jQuery.orange.widget.Table.getState.call(form);
	if (newState != oldState)
		jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
	var self = $(this);
	var id = self.attr("dataId");
	form.parentNode.mapping[id]["static"] = false;
	$("select", form).each(function() {
		dhcpdns_fillNameSelect(form.parentNode.mapping, $(this));
	});
}

function dhcpdns_fillNameSelect(mapping, jSelect) {
	jSelect.empty();
	var option = $("<option value='' i18n='page.myNetwork.dhcpdns.staticip.select.choose'/>").orangeTranslate();
	jSelect.append(option[0]);
	for (var id in mapping)
		if (! mapping[id]["static"])
			jSelect.append($("<option/>").attr("value", id).text(mapping[id].name)[0]);
	//Device/NAT/PortMappings/PortMapping[@InternalClient=""]
}

function dhcpdns_tableGetActions(crudAction) {
	// this = <form> node
	var actions = jQuery.orange.widget.Table.getActions.call(this, crudAction);
	if (actions === false)
		return false;
	for (var i in actions) {
		var action = actions[i];
		if (action.crud == "delete") {
			action.crud = "update";
			
			//Device/NAT/PortMappings/PortMapping[@InternalClient=""]
			action.node.onDataUpdate = dhcpdns_tableOnDataUpdateBecomeNotStatic;
			if (action.id.indexOf("ConnectedDevices") != -1) {
				action.id += "/AddressSource";
				action.value = "DHCP";
			} else {
				action.id += "/StaticIPAddress";
				action.value = false;
			}
		} else if (action.crud == "create") {
			action.crud = "update";
//			action.node.onDataUpdate = dhcpdns_tableOnDataUpdateBecomeStatic;
			var id = action.id;
			var widget = getFirstParentWithNodeName(action.node, "FORM").parentNode;
			var values = widget.mapping[id];
			if (action.attrs[values.nameAttr] != values.name)
				actions.push({
					crud: "update",
					id: id + "/" + values.nameAttr,
					node: $("td:eq(0) input", action.node)[0],
					value: action.attrs[values.nameAttr]
				});
			if (action.attrs[values.ipAttr] != values.ip)
				actions.push({
					crud: "update",
					id: id + "/" + values.ipAttr,
					node: $("td:eq(1) input", action.node)[0],
					value: action.attrs[values.ipAttr]
				});
			action.attrs = undefined;
			if (id.indexOf("ConnectedDevices") != -1) {
				action.id = id + "/AddressSource";
				action.value = "STATIC";
			} else {
				action.id = id + "/StaticIPAddress";
				action.value = true;
			}
		}
	}
	return actions;
}

/**
 * 
 */
function dhcpdns_clearErrorMessages() {
	var fields = [$("#iprouter"), $("#dhcpSlotStart"), $("#dhcpSlotEnd"), $("#ipvpnstart"), $("#ipvpnend")];
	
	// Reset all business error messages (regex, etc..)
	for (var i = 0; i < fields.length; i++) {
		fields[i].removeClass("errorInput");
	}
	
	$("#dhcpsloterror").hide();
	$("#vpnsloterror").hide();
	$("#dhcpSlotStartBadNetwork").hide();
	$("#dhcpSlotEndBadNetwork").hide();
	$("#vpnSlotStartBadNetwork").hide();
	$("#vpnSlotStartSameNetwork").hide();
	$("#vpnSlotEndBadNetwork").hide();
	$("#vpnSlotEndSameNetwork").hide();
	$("#staticIPBadSubnet").hide();
}

/**
 * 
 * @param ip1
 * @param ip2
 * @param maxDots
 * @returns {Boolean}
 */
function dhcpdns_isSameIP(ip1, ip2, maxDots) {
	var nbDots = 0;
	
	ip1 += ".";
	ip2 += ".";
	
	var diff = false;	
	for (var i = 0; i < ip1.length && i < ip2.length && nbDots < maxDots; i++) {
		if (ip1.charAt(i) != ip2.charAt(i)) {
			diff = true;
			break;
		}
		if (ip1.charAt(i) == '.') {
			nbDots++;
		}
	}
	
	return !diff && nbDots == maxDots;
}

function dhcpdns_worst(a, b) {
	var GOOD = fr.orange.livebox.gui.api.ProgressiveRegexp.GOOD;
	var NOT_GOOD_NOT_WRONG = fr.orange.livebox.gui.api.ProgressiveRegexp.NOT_GOOD_NOT_WRONG;
	var WRONG = fr.orange.livebox.gui.api.ProgressiveRegexp.WRONG;
	
	if (a == WRONG || b == WRONG) {
		return WRONG;
	} else if (a == GOOD && b == GOOD) {
		return GOOD;
	} else {
		return NOT_GOOD_NOT_WRONG;
	}
}

function dhcpdns_areConstraintsOK(jNodes) {
	var GOOD = fr.orange.livebox.gui.api.ProgressiveRegexp.GOOD;
	
	var worst = GOOD;
	for (var i = 0; i < jNodes.length; i++) {
		worst = dhcpdns_worst(worst, jQuery.orange.widget.Form.verifyConstraints(jNodes[i][0], true));
	}

	return worst;
}

var dhcpdns_msgKO_map = {};

function dhcpdns_isKO(node) {
	
	var form = $("#dhcpdns form")[0];
	if (arrayIndexOf(form.dataKO, node) != -1) {
		return true;
	}
	
	var isKO = false;
	for (var n in dhcpdns_msgKO_map) {
		if (arrayIndexOf(dhcpdns_msgKO_map[n], node) != -1) {
			isKO = true;
			break;
		}
	}
	
	return isKO;
}

// JALIZIER : Ne pas toucher sinon ça explose
function dhcpdns_addToDataKO(jNode, jErrorMessage) {
	var form = $("#dhcpdns form")[0];
	var jErrorMessageID = jErrorMessage.attr("id");
	var nodesAssociatedToThisError = dhcpdns_msgKO_map[jErrorMessageID];
	if (nodesAssociatedToThisError == undefined) {
		nodesAssociatedToThisError = new Array();
		dhcpdns_msgKO_map[jErrorMessageID] = nodesAssociatedToThisError;
	}
	if (arrayIndexOf(nodesAssociatedToThisError, jNode[0]) == -1) {
		nodesAssociatedToThisError.push(jNode[0]);
		if (arrayIndexOf(form.dataKO, jErrorMessage[0]) == -1) {
			form.dataKO.push(jErrorMessage[0]);
		}
		jNode.addClass("errorInput");
		jErrorMessage.show();
	}
}

//JALIZIER : Ne pas toucher sinon ça explose
function dhcpdns_removeFromDataKO(jNode, jErrorMessage) {
	var form = $("#dhcpdns form")[0];
	var jErrorMessageID = jErrorMessage.attr("id");
	var nodesAssociatedToThisError = dhcpdns_msgKO_map[jErrorMessageID];
	if (nodesAssociatedToThisError != undefined) {
		if (arrayIndexOf(nodesAssociatedToThisError, jNode[0]) != -1) {
			arrayRemove(nodesAssociatedToThisError, jNode[0]);
			if (nodesAssociatedToThisError.length == 0) {
				dhcpdns_msgKO_map[jErrorMessageID] = undefined;
				arrayRemove(form.dataKO, jErrorMessage[0]);
				jErrorMessage.hide();
			}
			if (!dhcpdns_isKO(jNode[0])) {
				jNode.removeClass("errorInput");
			}
		}
	}
}

function dhcpdns_checkBusinessRules_single_routerIp() {
	// A priori rien à faire, il n'y a que la regex qui joue
	return dhcpdns_areConstraintsOK([$("#iprouter")]);
}

function dhcpdns_checkBusinessRules_single_subnetMask() {
	// A priori rien à faire, il n'y a que la regex qui joue
	return dhcpdns_areConstraintsOK([$("#subnetMask")]);
}

function dhcpdns_checkBusinessRules_single_vpnStart() {
	// A priori rien à faire, il n'y a que la regex qui joue
	return dhcpdns_areConstraintsOK([$("#ipvpnstart")]);
}

function dhcpdns_checkBusinessRules_single_vpnEnd() {
	// A priori rien à faire, il n'y a que la regex qui joue
	return dhcpdns_areConstraintsOK([$("#ipvpnend")]);
}

/**
 * Return true if the provided jNode is disabled. False otherwise
 */
function dhcpdns_isDisabled(jNode) {
	return jNode.attr("disabled") != undefined && jNode.attr("disabled") != "";
}

/**
 * Return true if all the provided jNode are disabled. False otherwise.
 * @param jNodes an array of individual jquery nodes
 */
function dhcpdns_areAllDisabled(jNodes) {
	var res = true;
	for (var i = 0; i < jNodes.length; i++) {
		if (!dhcpdns_isDisabled(jNodes[i])) {
			res = false;
			break;
		}
	}
	return res;
}

function dhcpdns_checkBusinessRules_single_generic(jNodes, dependentFuncs, jErrorMsg, businessRule) {
	var GOOD = fr.orange.livebox.gui.api.ProgressiveRegexp.GOOD;
	var NOT_GOOD_NOT_WRONG = fr.orange.livebox.gui.api.ProgressiveRegexp.NOT_GOOD_NOT_WRONG;
	var WRONG = fr.orange.livebox.gui.api.ProgressiveRegexp.WRONG;
	
	// If the nodes needed to evaluate this business constraint are all disabled, do not eveluate this constraint
	if (dhcpdns_areAllDisabled(jNodes)) {
		return GOOD;
	}
	
	var res = NOT_GOOD_NOT_WRONG;
	
	// 1. First, check whether each dependent field has its constraints respected
	var depFuncsResult = GOOD;
	for (var i = 0; i < dependentFuncs.length; i++) {
		depFuncsResult = dhcpdns_worst(depFuncsResult, dependentFuncs[i].call(this));
//		if (depFuncsResult == WRONG) {
//			break;
//		}
	}
	
	if (depFuncsResult == GOOD) {
		
		if (dhcpdns_areConstraintsOK(jNodes) == GOOD) {
			var arguments = new Array();
			for (var i = 0; i < jNodes.length; i++) {
				arguments.push(jNodes[i][0].getDataValue());
			}
			
			var form = $("#dhcpdns form")[0];
			var oldState = jQuery.orange.widget.Form.getState.call(form);
		
			// 2. If all the fields are OK, let's check the business rules
			var isRuleOK = businessRule.apply(this, arguments);
			
			if (!isRuleOK) {
				for (var i = 0; i < jNodes.length; i++) {
					dhcpdns_addToDataKO(jNodes[i], jErrorMsg);
				}
				res = WRONG;
			} else {
				for (var i = 0; i < jNodes.length; i++) {
					dhcpdns_removeFromDataKO(jNodes[i], jErrorMsg);
				}
				res = GOOD;
			}
			
			// rafraichir l'état du formulaire
			var newState = jQuery.orange.widget.Form.getState.call(form);
			if (newState != oldState){
				jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
			}
		} else {
			// If the dependent fields are already in error, do not display any additional message
			for (var i = 0; i < jNodes.length; i++) {
				dhcpdns_removeFromDataKO(jNodes[i], jErrorMsg);
			}
		}
	} else if (depFuncsResult == WRONG || depFuncsResult == NOT_GOOD_NOT_WRONG) {
		// patch to hide all other error messages that are already displayed
		for (var i = 0; i < jNodes.length; i++) {
			dhcpdns_removeFromDataKO(jNodes[i], jErrorMsg);
		}
		res = WRONG;
	}
	
	return res;
}

function dhcpdns_checkBusinessRules_single_dhcpSlotIpStart() {
	
	return dhcpdns_checkBusinessRules_single_generic(
			[$("#dhcpSlotStart")], // Nodes to test
			[dhcpdns_checkBusinessRules_single_routerIp], // preconditions
			$("#dhcpSlotStartBadNetwork"), // error message
			function(dhcpSlotStart) { // business rule
				var iprouter = $("#iprouter")[0].getDataValue();
				var subnetmask = $("#subnetMask")[0].getDataValue();
				var iprouter32 = stringToIP32(iprouter);
				var subnet32 = stringToIP32(subnetmask);

				var dhcpSlotStart32 = stringToIP32(dhcpSlotStart);

				return ( (iprouter32 & subnet32) == (dhcpSlotStart32 & subnet32) );
			}
	);
}

function dhcpdns_checkBusinessRules_single_dhcpSlotIpEnd() {
	
	return dhcpdns_checkBusinessRules_single_generic(
			[$("#dhcpSlotEnd")], // Nodes to test
			[dhcpdns_checkBusinessRules_single_routerIp], // preconditions
			$("#dhcpSlotEndBadNetwork"), // error message
			function(dhcpSlotEnd) { // business rule
				var iprouter = $("#iprouter")[0].getDataValue();
				var subnetmask = $("#subnetMask")[0].getDataValue();
				var iprouter32 = stringToIP32(iprouter);
				var subnet32 = stringToIP32(subnetmask);

				var dhcpSlotEnd32 = stringToIP32(dhcpSlotEnd);

				return ( (iprouter32 & subnet32) == (dhcpSlotEnd32 & subnet32) );
			}
	);
}

function dhcpdns_checkBusinessRules_combined_dhcpSlotRange() {
	return dhcpdns_checkBusinessRules_single_generic(
			[$("#dhcpSlotStart"), $("#dhcpSlotEnd")], // Nodes to test
			[dhcpdns_checkBusinessRules_single_dhcpSlotIpStart, dhcpdns_checkBusinessRules_single_dhcpSlotIpEnd], // preconditions
			$("#dhcpsloterror"), // error message
			function(ipstart, ipend) { // business rule
				var dhcpSlotStart32 = stringToIP32(ipstart);
				var dhcpSlotEnd32 = stringToIP32(ipend);
				return (dhcpSlotStart32 <= dhcpSlotEnd32 );
			}
		);
}

/**
 * Check that the VPN subnet is different from the Livebox's subnet
 * @returns {Boolean}
 */
function dhcpdns_checkBusinessRules_single_vpnSlotIpStart() {
	return dhcpdns_checkBusinessRules_single_generic(
			[$("#ipvpnstart")], // Nodes to test
			[dhcpdns_checkBusinessRules_single_routerIp], // preconditions
			$("#vpnSlotStartBadNetwork"), // error message
			function(ipvpnstart) { // business rule
				var iprouter = $("#iprouter")[0].getDataValue();
				var subnetmask = $("#subnetMask")[0].getDataValue();
				var iprouter32 = stringToIP32(iprouter);
				var subnet32 = stringToIP32(subnetmask);

				var ipvpnstart32 = stringToIP32(ipvpnstart);

				return ( (iprouter32 & subnet32) != (ipvpnstart32 & subnet32) );
			}
	);
}

function dhcpdns_checkBusinessRules_single_vpnSlotIpEnd() {
	return dhcpdns_checkBusinessRules_single_generic(
			[$("#ipvpnend")], // Nodes to test
			[dhcpdns_checkBusinessRules_single_routerIp], // preconditions
			$("#vpnSlotEndBadNetwork"), // error message
			function(ipvpnend) { // business rule
				var iprouter = $("#iprouter")[0].getDataValue();
				var subnetmask = $("#subnetMask")[0].getDataValue();
				var iprouter32 = stringToIP32(iprouter);
				var subnet32 = stringToIP32(subnetmask);

				var ipvpnend32 = stringToIP32(ipvpnend);

				return ( (iprouter32 & subnet32) != (ipvpnend32 & subnet32) );
			}
			);
}

function dhcpdns_checkBusinessRules_combined_vpnSlotRange() {
	return dhcpdns_checkBusinessRules_single_generic(
			[$("#ipvpnstart"), $("#ipvpnend")], // Nodes to test
			[dhcpdns_checkBusinessRules_single_vpnSlotIpStart, dhcpdns_checkBusinessRules_single_vpnSlotIpEnd], // preconditions
			$("#vpnsloterror"), // error message
			function(ipstart, ipend) { // business rule
				var ipvpnstart32 = stringToIP32(ipstart);
				var ipvpnend32 = stringToIP32(ipend);
				
				return  (ipvpnstart32 <= ipvpnend32);
			}
			);
}

/**
 * Check the business rules for all fields in the page and display the corresponding error
 * messages.
 */
function dhcpdns_checkFieldValue() {
	dhcpdns_checkBusinessRules_single_routerIp();
	dhcpdns_checkBusinessRules_single_dhcpSlotIpStart();
	dhcpdns_checkBusinessRules_single_dhcpSlotIpEnd();
	dhcpdns_checkBusinessRules_combined_dhcpSlotRange();
	dhcpdns_checkBusinessRules_single_vpnSlotIpStart();
	dhcpdns_checkBusinessRules_single_vpnSlotIpEnd();
	dhcpdns_checkBusinessRules_combined_vpnSlotRange();
	/*$("#dhcpdnsTable input[class*='table-col-1']").each(function () {
		dhcpdns_tableCheckIPSubnet(this);
	});*/
}

function dhcpdns_onDataChange(node, showErrorMsg) {
	jQuery.orange.widget.Form.onDataChange.call(this, node, showErrorMsg);
	
	dhcpdns_checkFieldValue();
	
	// rafraichir l'état du formulaire
	var form = $("#dhcpdns form")[0];
	var newState = jQuery.orange.widget.Form.getState.call(form);
	if (newState == jQuery.orange.widget.Form.STATE_MODIF_OK
			&& (
				   arrayIndexOf(form.modifsOK, $("#iprouter")[0]) != -1
				|| arrayIndexOf(form.modifsOK, $("#dhcpSlotStart")[0]) != -1
				|| arrayIndexOf(form.modifsOK, $("#dhcpSlotEnd")[0]) != -1
				|| (arrayIndexOf(form.modifsOK, $("#ckDHCP")[0]) != -1 && $("#ckDHCP")[0].getDataValue() == true) // == activation du DHCP
				)
			) {
		$("#rebootnote").css('display', 'inline');
	} else {
		$("#rebootnote").css('display', 'none');
	}
}

jQuery.orange.config.areacontent.dhcpdns = {
	preParse: function(){
		//gestion des valeurs par defauts du range IP VPN.
		var XminAdressVPN = "Device/Networks/LAN[@name='LAN']/MinAddressVPN";
		jQuery.orange.config.api.crud.read(
			[XminAdressVPN],
			function (result) {
				for(var minAdressVPN in result[XminAdressVPN].values){
					if(result[XminAdressVPN].values[minAdressVPN]==""
						|| result[XminAdressVPN].values[minAdressVPN]==undefined
						|| result[XminAdressVPN].values[minAdressVPN]==null){
						var id2value = {};
						id2value[minAdressVPN] = "192.168.5.1";
						jQuery.orange.config.api.crud.update(id2value);
					}
				}
			});
		var XmaxAdressVPN = "Device/Networks/LAN[@name='LAN']/MaxAddressVPN";
		jQuery.orange.config.api.crud.read(
			[XmaxAdressVPN],
			function (result) {
				for(var maxAdressVPN in result[XmaxAdressVPN].values){
					if(result[XmaxAdressVPN].values[maxAdressVPN]==""
						|| result[XmaxAdressVPN].values[maxAdressVPN]==undefined
						|| result[XmaxAdressVPN].values[maxAdressVPN]==null){
						var id2value = {};
						id2value[maxAdressVPN] = "192.168.5.11";
						jQuery.orange.config.api.crud.update(id2value);
					}
				}
			});
	},
	preParse: function(){
		//gestion des valeurs par defauts du range IP VPN.
		var XminAdressVPN = "Device/Networks/LAN[@name='LAN']/MinAddressVPN";
		jQuery.orange.config.api.crud.read(
			[XminAdressVPN],
			function (result) {
				for(var minAdressVPN in result[XminAdressVPN].values){
					if(result[XminAdressVPN].values[minAdressVPN]==""
						|| result[XminAdressVPN].values[minAdressVPN]==undefined
						|| result[XminAdressVPN].values[minAdressVPN]==null){
						var id2value = {};
						id2value[minAdressVPN] = "192.168.5.1";
						jQuery.orange.config.api.crud.update(id2value);
					}
				}
			});
		var XmaxAdressVPN = "Device/Networks/LAN[@name='LAN']/MaxAddressVPN";
		jQuery.orange.config.api.crud.read(
			[XmaxAdressVPN],
			function (result) {
				for(var maxAdressVPN in result[XmaxAdressVPN].values){
					if(result[XmaxAdressVPN].values[maxAdressVPN]==""
						|| result[XmaxAdressVPN].values[maxAdressVPN]==undefined
						|| result[XmaxAdressVPN].values[maxAdressVPN]==null){
						var id2value = {};
						id2value[maxAdressVPN] = "192.168.5.11";
						jQuery.orange.config.api.crud.update(id2value);
					}
				}
			});
	},
	
	postParse: function() {
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_dhcpdns.html");
		});
		
		$("#ckDHCP").bind("change", function(event, newValue) {
			dhcpdns_disableElements();
			dhcpdns_checkFieldValue();
			if ($("#ckDHCP")[0].getDataValue()){
				$("#ServerErrorState").attr("class","error block visibledependent-hide");
			}else {
				$("#ServerErrorState").attr("class","error block");
			}
			
			$("#natpatRuleForIp").css('display', 'none');
		});
		
		$("#dnsmode").bind("valueChange", function(event, newValue) {
			dhcpdns_disableElements();
			dhcpdns_checkFieldValue();
			$("#natpatRuleForIp").css('display', 'none');
		});
		
		dhcpdns_clearErrorMessages();
		
		$("#dhcpdns form")[0].onDataChange = dhcpdns_onDataChange;
		
		$("#dhcpdnsTable")[0].addRow = dhcpdns_postLoadTableAddRow;
		
	},
	
	postLoad: function() {
		var MeshEnable = "Device/MESH/Enable";
		jQuery.orange.config.api.crud.read([MeshEnable], function (result) {
			if (result[MeshEnable].values[MeshEnable] == true) {
				$("#ckDHCP").setDisabled(true);
				if ($("#ckDHCP")[0].attr('checked'))
					$("#meshnote").css('display', 'inline');
				else
					$("#meshnote").css('display', 'none');
			} else
				$("#meshnote").css('display', 'none');
		});

		function verifyNatPatIpAdressWithcurrentValue(tr){
			var boolresult = false;
			var adressNatPat = "Device/NAT/PortMappings/PortMapping[InternalClient='" + tr.children[1].children[0].dataValueRef + "']";
			jQuery.orange.config.api.crud.read(
					[adressNatPat],
					function (result) {
						if (result [adressNatPat] != undefined){
							if(tr.children[1].children[0].dataValueRef != tr.children[1].children[0].value){
								$("#natpatRuleForIp").css('display', 'block');
								boolresult = false;
							}
							else {
								boolresult = true;
							}
						}
						else{
							boolresult = true;
						}
					});
			return boolresult;
		}
		
		//dhcpsubmit
		$("#dhcpsubmit").bind("click", function() {
			$("#rebootnote").css('display', 'none');
			
			var innerNatPatIpAdress = true;
			function tableValid (){
				var i = 0;
				while (this[i]){
					var haschangedAndnatPat = verifyNatPatIpAdressWithcurrentValue(this[i]);
					innerNatPatIpAdress = innerNatPatIpAdress && haschangedAndnatPat;
					i++;
				}
			}
			var child = $("#dhcpdnsTable form table tbody").children();
			if (child){
				tableValid.apply(child);
			}
			jQuery.orange.widget.Table.NatPatIpAdress = innerNatPatIpAdress;
			if (!innerNatPatIpAdress){
				$("#dhcpdnsTable form").action = false;
			}
		});
		
		
		$("#dhcpcancel").bind("click", function() {
			$("#rebootnote").css('display', 'none');
			$("#natpatRuleForIp").css('display', 'none');
			//parcours des tr du tableau et déclanchement du trigger

		});
		
		$("#iprouter").bind("keyup change", function() {
			dhcpdns_checkBusinessRules_single_routerIp();
			dhcpdns_checkBusinessRules_single_dhcpSlotIpStart();
			dhcpdns_checkBusinessRules_single_dhcpSlotIpEnd();
			dhcpdns_checkBusinessRules_combined_dhcpSlotRange();
			dhcpdns_checkBusinessRules_single_vpnSlotIpStart();
			dhcpdns_checkBusinessRules_single_vpnSlotIpEnd();
			dhcpdns_checkBusinessRules_combined_vpnSlotRange();
			$("#natpatRuleForIp").css('display', 'none');
			$("#dhcpdnsTable input[class*='table-col-1']").each(function () {
				//dhcpdns_tableCheckIPSubnet(this);
				jQuery.orange.widget.Form.onDataChange.call($("#dhcpdnsTable form")[0], this);
			});
		});
		
		$("#dhcpSlotStart").bind("keyup change", function() {
			dhcpdns_checkBusinessRules_single_dhcpSlotIpStart();
			dhcpdns_checkBusinessRules_combined_dhcpSlotRange();
			$("#natpatRuleForIp").css('display', 'none');
		});
	
		$("#dhcpSlotEnd").bind("keyup change", function() {
			dhcpdns_checkBusinessRules_single_dhcpSlotIpEnd();
			dhcpdns_checkBusinessRules_combined_dhcpSlotRange();
			$("#natpatRuleForIp").css('display', 'none');
		});
		
		$("#ipvpnstart").bind("keyup change", function() {
			//dhcpdns_checkBusinessRules_single_vpnSlotIpStart();
			dhcpdns_checkBusinessRules_combined_vpnSlotRange();
			$("#natpatRuleForIp").css('display', 'none');
		});
	
		$("#ipvpnend").bind("keyup change", function() {
			dhcpdns_checkBusinessRules_single_vpnSlotIpEnd();
			dhcpdns_checkBusinessRules_combined_vpnSlotRange();
			$("#natpatRuleForIp").css('display', 'none');
		});
	
		dhcpdns_checkFieldValue();
	
		// Static IP table
		$("#dhcpdnsTable .table-add-button img").attr('i18n', 'page.myNetwork.dhcpdns.staticip.add').parent().orangeParse();
	
//		$("#dhcpdnsTable")[0].addRow = dhcpdns_tableAddRow;
//		$("#dhcpdnsTable form")[0].getActions = dhcpdns_tableGetActions;
//		jQuery.orange.config.api.crud.read([dhcpdns_tableId0, dhcpdns_tableId1, dhcpdns_tableId2], dhcpdns_tableReadCallback);

		$("#dhcpdnsTableErr").insertAfter($("#dhcpdnsTable table"));
		$("#staticIPBadSubnet").insertAfter($("#dhcpdnsTable table"));
	}
	
};
