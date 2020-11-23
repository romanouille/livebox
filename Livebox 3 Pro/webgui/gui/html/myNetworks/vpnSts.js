function vpnStS_preset2Gui(remotehardware) {
	var preset = IPSecEasyModeStS[remotehardware];
	if (preset === undefined) {
		preset = IPSecEasyModeStS["default"];
	}
	if (preset != undefined) {
		if (preset.ExpertMode === true) {
			$("#vpnexpertmode")[0].setDataValue(true);
		}
		$("#Protocol")[0].setDataValue(preset.Protocol);
		$("#AggressiveMode")[0].setDataValue(preset.Mode);
		$("#Encryption1")[0].setDataValue(preset.Encryption1);
		$("#Authentication1")[0].setDataValue(preset.Authentication1);
		$("#DiffieGroup")[0].setDataValue(preset.HellmannGroup);
		$("#LifeTime1")[0].setDataValue(preset.LifeTime1);
		$("#Encryption2")[0].setDataValue(preset.Encryption2);
		$("#Authentication2")[0].setDataValue(preset.Authentication2);
		$("#PFSGroup")[0].setDataValue(preset.PFSGroup);
		$("#LifeTime2")[0].setDataValue(preset.LifeTime2);
		$("#DeadPeerDetection")[0].setDataValue(preset.DeadPeerDetection);
	}
}

jQuery.orange.config.areacontent.vpnSts = {
		setDefaultsValuesOnCreation: function(){
			$("#connectedSts")[0].setDataValue(false);
			$("#enableSts")[0].setDataValue(true);
			$("#enableSts")[0].dataValueRef = true;
			//$("#enableSts").trigger('valueChange');
			$("#sitename")[0].setDataValue("");
			$("#sitename")[0].dataValueRef = "";
			$("#sitename").trigger('valueChange');
			$("#hostname")[0].setDataValue("");
			$("#hostname")[0].dataValueRef = "";
			$("#hostname").trigger('valueChange');
			$("#remotehardware")[0].setDataValue("LIVEBOXPROV3");
			$("#remotehardware")[0].dataValueRef = "LIVEBOXPROV3";
			$("#remotehardware").trigger('valueChange');
			$("#psk")[0].setDataValue("");
			$("#psk")[0].dataValueRef = "";
			$("#psk").trigger('valueChange');
			$("#destip")[0].setDataValue("");
			$("#destip")[0].dataValueRef = "";
			$("#destip").trigger('valueChange');
			$("#destmask")[0].setDataValue("");
			$("#destmask")[0].dataValueRef = "";
			$("#destmask").trigger('valueChange');
			$("#vpnexpertmode")[0].setDataValue(false);
		},
		onReset: function() {
			//appel fonction onReset par defaut
			$("#stsForm")[0].onReset = undefined;
			var resetresult = jQuery.orange.widget.Form.onReset.call(this);
			$("#stsForm")[0].onReset = jQuery.orange.config.areacontent.vpnSts.onReset;
			
			//traitement cas de test
			var form = this;
			if($("#vpnSts form").attr('creation')){
				$("[dataId]", this).each(function() {
					var node = this;
					if(arrayIndexOf($("[widgetType='Button'] input"), node) == -1){
							var valueStatus = jQuery.orange.widget.Form.verifyConstraints(this,false); 
							if(valueStatus == fr.orange.livebox.gui.api.ProgressiveRegexp.WRONG
									|| valueStatus == fr.orange.livebox.gui.api.ProgressiveRegexp.NOT_GOOD_NOT_WRONG){
								form.dataKO.push(node);
							}
						}
				});
				jQuery.orange.widget.Form.setButtonsDisabled.call($("#vpnSts form")[0], jQuery.orange.widget.Form.STATE_ONCREATE);
			}
			
			//retour de la fonction standard
			return resetresult;
		},
		onDataChange: function(node, showErrorMsg) {
			//appel fonction onDataChange par defaut
			$("#stsForm")[0].onDataChange = undefined;
			jQuery.orange.widget.Form.onDataChange.call(this, node, showErrorMsg);
			$("#stsForm")[0].onDataChange = jQuery.orange.config.areacontent.vpnSts.onDataChange;

			//Cas creation : traitement de l'ensemble du formulaire pour definir et positionner état des boutons en fonction des dataValueRef
			if($("#vpnSts form").attr('creation')){
				var modified=false;
				$("[dataId]", this).each(function() {
					var node = this;
					if(arrayIndexOf($("[widgetType='Button'] input"), node) == -1){
						if(node.dataValueRef != undefined){
							if(node.getDataValue() != node.dataValueRef){
								if(!modified){
									modified=true;
								}
							}
						}
					}
				});
				if(modified){
					jQuery.orange.widget.Form.setButtonsDisabled.call($("#vpnSts form")[0], jQuery.orange.widget.Form.getState.call(this));				
				}else{
					jQuery.orange.widget.Form.setButtonsDisabled.call($("#vpnSts form")[0], jQuery.orange.widget.Form.STATE_ONCREATE);					
				}
			}
		},
		preParse: function() {
			
			$("#stsForm")[0].onReset = jQuery.orange.config.areacontent.vpnSts.onReset; 
			$("#stsForm")[0].onDataChange = jQuery.orange.config.areacontent.vpnSts.onDataChange; 
			
			var selectedSite = $("#content").data('selectedSiteName');

			//Positionnement prealable a toute action...
			if(selectedSite == undefined){
				$("#vpnSts form").attr('creation',true);
			}

			var XPREFIX = "";
			if(selectedSite == undefined){
				$("#deleteStsVpn").hide();
				$("#saveStsVpn").hide();
				$("#saveStsVpn").attr("disabled", "disabled");
				$("#createStsVpn").show();
				XPREFIX = "";
			}else{
				XPREFIX = "Device/Networks/WAN[@name='WAN']/VPN/NetToNetVPNs/NetToNetVPN[@Name='"+selectedSite+"']/";
				$("#deleteStsVpn").show();
				$("#saveStsVpn").show();
				$("#createStsVpn").remove();
			}
			//init dataidArray
			
			$("#stsForm").data("XCONNECTED",XPREFIX+"Connected");
			$("#stsForm").data("XENABLE",XPREFIX+"Enable");
			if(selectedSite == undefined){
				$("#stsForm").data("XNAME",XPREFIX+"Name");
			} else {
				$("#stsForm").data("XNAME",XPREFIX+"@Name");
			}
			$("#stsForm").data("XHOSTNAME",XPREFIX+"Hostname");
			$("#stsForm").data("XREMOTEHARDWARE",XPREFIX+"RemoteHardware");
			$("#stsForm").data("XPRESHAREDKEY",XPREFIX+"PresharedKey");
			$("#stsForm").data("XLOCALIP",XPREFIX+"LocalIPAddress");
			$("#stsForm").data("XLOCALMASK",XPREFIX+"LocalIPMask");
			$("#stsForm").data("XREMOTEIP",XPREFIX+"RemoteIPAddress");
			$("#stsForm").data("XREMOTEMASK",XPREFIX+"RemoteIPMask");
			$("#stsForm").data("XPROTOCOL",XPREFIX+"Protocol");
			$("#stsForm").data("XAGRESSIVEMODE",XPREFIX+"AggressiveMode");
			$("#stsForm").data("XENCRYPTION1",XPREFIX+"Encryption1");
			$("#stsForm").data("XAUTH1",XPREFIX+"Authentication1");
			$("#stsForm").data("XDIFFIE",XPREFIX+"DiffieGroup");
			$("#stsForm").data("XLIFETIME1",XPREFIX+"LifeTime1");
			$("#stsForm").data("XENCRYPTION2",XPREFIX+"Encryption2");
			$("#stsForm").data("XAUTH2",XPREFIX+"Authentication2");
			$("#stsForm").data("XPFS",XPREFIX+"PFSGroup");
			$("#stsForm").data("XLIFETIME2",XPREFIX+"LifeTime2");
			$("#stsForm").data("XDEADPEER",XPREFIX+"DeadPeerDetection");
			$("#stsForm").data("XEXPERTMODE",XPREFIX+"ExpertMode");
			
			var dataidcontainers = $("#stsForm [dataidref]");
			for ( var int = 0; int < dataidcontainers.length; int++) {
				var currentDataidRef = dataidcontainers[int].getAttribute("dataidref");
				dataidcontainers[int].setAttribute(
					"dataid",$("#stsForm").data(currentDataidRef)
					);
			}
			
			$("#connectedSts").bind("valueChange", function(event, newValue) {
				$("#deleteStsVpn").setDisabled(newValue == undefined || newValue == true);
			});
		},
		postParse: function(area) {
			$("#backTovpn").bind("click",function(){
				jQuery.orange.widget.MenuItem.setCurrent('m2.m27');
			});
			
			$("#createStsVpn input[type='submit'], #saveStsVpn input[type='submit']").each(function (){
				this.crudCallback = function () {
					area.popupOnUnsubmitted = false;
					jQuery.orange.widget.MenuItem.setCurrent('m2.m27');
				};
			});
		},
		postLoad: function(area) {
			
			// positionnement des tooltips
			/*	if($("#enableSts")[0].getDataValue()){
				$("#enableSts").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.activate.true.tip"]);
			}else{
				$("#enableSts").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.activate.false.tip"]);
			}
			$("#enableSts").bind('click',function(event){
				if(event.target.checked){
					$("#enableSts").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.activate.true.tip"]);
				}else{
					$("#enableSts").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.activate.false.tip"]);
				}
			});
		
			if($("#DeadPeerDetection")[0].getDataValue()){
				$("#DeadPeerDetection").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.deadpeerdetection.false.tip"]);
			}else{
				$("#DeadPeerDetection").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.deadpeerdetection.true.tip"]);
			}
			$("#DeadPeerDetection").bind('valueChange',function(event){
				if(event.target.checked){
					$("#DeadPeerDetection").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.deadpeerdetection.false.tip"]);
				}else{
					$("#DeadPeerDetection").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.deadpeerdetection.true.tip"]);
				}
			});*/
			
			$("#help").bind("click",function() {
				helpPopup("html/main/help_vpnSts.html");
			});
			
			$("#sitename").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.name.tip"]);
			$("#hostname").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.hostname.tip"]);
			$("#psk").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.psk.tip"]);
			$("#currentIP").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.currentip.tip"]);
			$("#currentMask").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.currentmask.tip"]);
			$("#destip").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.destip.tip"]);
			$("#destmask").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.destmask.tip"]);
			$("#LifeTime1").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.lifetime"]);
			$("#LifeTime2").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.lifetime"]);
			$("#remotehardware").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.remotehardware.tip"]);
			$("#Protocol").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.protocol.tip"]);
			$("#AggressiveMode").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.mode.tip"]);
			$("#Encryption1").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.encrypt.tip"]);
			$("#Encryption2").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.encrypt.tip"]);
			$("#Authentication1").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.auth.tip"]);
			$("#Authentication2").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.auth.tip"]);
			$("#DiffieGroup").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.diffie.tip"]);
			$("#PFSGroup").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnSts.pfs.tip"]);
			
		
			// set default IP and Mask when not  defined.
			var subnetMask = $("#currentMask")[0].getDataValue();
			if(subnetMask==""){
				var XcurrentMask = "Device/Networks/LAN[@uid='1']/SubnetMask";
				jQuery.orange.config.api.crud.read([XcurrentMask],function(result){
					subnetMask = result[XcurrentMask].values[XcurrentMask];
					$("#currentMask")[0].setDataValue(subnetMask);
					$("#currentMask")[0].dataValueRef = subnetMask;
					$("#currentMask").trigger('valueChange');
				});
			}
			if($("#currentIP")[0].getDataValue()==""){
				var XcurrentIP = "Device/Networks/LAN[@uid='1']/IPRouters";
				jQuery.orange.config.api.crud.read([XcurrentIP],function(result){
					var newvalue = result[XcurrentIP].values[XcurrentIP];
					
					var ip32 = stringToIP32(newvalue);
					var mask32 = stringToIP32(subnetMask);
					newvalue = ip32ToString(ip32 & mask32);
					
					$("#currentIP")[0].setDataValue(newvalue);
					$("#currentIP")[0].dataValueRef = newvalue;
					$("#currentIP").trigger('valueChange');
				});
			}
			
			$("#saveStsVpn").bind('click',function(){
				$("#deleteStsVpn").css("display","");
			});
			
			$("#createStsVpn").bind('click',function(){
				$("#deleteStsVpn").css("display","");
				$("#saveStsVpn").css("display","");
				$("#createStsVpn").css("display","none");
			});
			
			function isNetworkOverlaped (newstate) {
				if(newstate){
					var currentIPNode = $("#currentIP");
					var currentIP = currentIPNode.val();
					var destIPNode = $("#destip");
					var destIP = destIPNode.val();

					var currentMaskNode = $("#currentMask");
					var currentMask = currentMaskNode.val();
					var destmaskNode = $("#destmask");
					var destmask = destmaskNode.val();

					var reg=new RegExp("[\.]+", "g");
					var currentMaskvalues =currentMask.split(reg);
					var destmaskvalues = destmask.split(reg);
					var currentIPvalues = currentIP.split(reg);
					var destIPvalues = destIP.split(reg);
					
					var currentMaskvaluesbool = currentMaskvalues.length == 4;
					var destmaskvaluesbool = destmaskvalues.length == 4;
					var currentIPvaluesbool = currentIPvalues.length == 4;
					var destIPvaluesbool = destIPvalues.length == 4;

					if (currentMaskvaluesbool && destmaskvaluesbool && currentIPvaluesbool && destIPvaluesbool){

						var chevauchementIp = false;

						for (var i = 0; i<4; i ++){
							if ((currentIPvalues[i] & currentMaskvalues[i]) == (destIPvalues [i] & destmaskvalues[i])){
								continue;
							}else {
								if (currentMaskvalues[i] == 0 || destmaskvalues[i] == 0){
									chevauchementIp = true;
								}
								break;
							}
						}

						if(chevauchementIp){
							$("#createStsVpn").attr('disabled','true');
							$("#networkOverlap").show();
						}
						else {
							$("#networkOverlap").hide();
						}
					}
				}
					else {
						$("#networkOverlap").hide();
					}
				}
			
			
			$("#currentMask").add($("#destmask")).bind("keyup change", isNetworkOverlaped);
			
			//Gestion erreur ip identiques
			$("#currentIP").add($("#destip")).bind("keyup change", function() {
				var form = $("#vpnSts form")[0];

				var currentIPNode = $("#currentIP");
				var currentIP = currentIPNode.val();
				var destIPNode = $("#destip");
				var destIP = destIPNode.val();

				var oldState = jQuery.orange.widget.Form.getState.call(form);
				
				if (destIP == currentIP
					&& jQuery.orange.widget.Form.verifyConstraints(currentIPNode[0])
					&& jQuery.orange.widget.Form.verifyConstraints(destIPNode[0])
					){
					
					$("#identicalIPerror").css('display', 'inline');
					currentIPNode.addClass('supErrorInput');
					destIPNode.addClass('supErrorInput');
					
					form.dataKO.push(currentIPNode);
					form.dataKO.push(destIPNode);

				} else if(destIP != currentIP){
					$("#identicalIPerror").css('display', 'none');

					if(jQuery.orange.widget.Form.verifyConstraints(currentIPNode[0])){
						currentIPNode.removeClass('supErrorInput');
						form.dataKO.splice(arrayIndexOf2(form.dataKO, currentIPNode), 1);
					}
					if(jQuery.orange.widget.Form.verifyConstraints(destIPNode[0])){
						destIPNode.removeClass('supErrorInput');
						form.dataKO.splice(arrayIndexOf2(form.dataKO, destIPNode), 1);
					}
				}
				
				// Special patch to prevent enabling the submit button when some fields are not filled
				jQuery.orange.widget.Form.onDataChange.call(form, $("#destip")[0]);
				jQuery.orange.widget.Form.onDataChange.call(form, $("#destmask")[0]);
					
				var newState = jQuery.orange.widget.Form.getState.call(form);
				if (newState != oldState) {
					jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
				}
				
				//Ticket 963: Affichage erreur et interdiction sauvegarde si chevauchement reseaux:
				//		(ilocal & maklocal & maskdistant) == (ipdsitant & masklocal & maskdistant)
				isNetworkOverlaped(newState);
			});
			
			$("#remotehardware").bind('change valueChange',function(event){
				var remotehardware = $("#remotehardware")[0].getDataValue();
				vpnStS_preset2Gui(remotehardware);
			});
	
			$("#deleteStsVpn").bind('activateButton',function(){				
				openConfirmationPopup('popup.confirm.title', 'popup.confirm.text',
					function() {
						var Xdelete = "Device/Networks/WAN[@name='WAN']/VPN/NetToNetVPNs/NetToNetVPN[@Name='"+$("#sitename")[0].getDataValue()+"']";
						jQuery.orange.config.api.crud.del(Xdelete,function(result){
							jQuery.orange.widget.MenuItem.setCurrent('m2.m27');
						});
					});
			});
			
			$("#vpnexpertmode").bind('change valueChange', function() {
				var expertMode = $("#vpnexpertmode")[0].getDataValue();
				if (expertMode === false) {
					var remotehardware = $("#remotehardware")[0].getDataValue();
					if (remotehardware == "OTHER") {
						$("#remotehardware")[0].setDataValue("LIVEBOXPROV3");
					} else {
						vpnStS_preset2Gui(remotehardware);
					}
				}
			});
			
			var selectedSite = $("#content").data('selectedSiteName');
			if(selectedSite == undefined){
				jQuery.orange.config.areacontent.vpnSts.setDefaultsValuesOnCreation();
				jQuery.orange.widget.Form.setButtonsDisabled.call($("#vpnSts form")[0], jQuery.orange.widget.Form.STATE_ONCREATE);
			}
			$("#content").removeData('selectedSiteName');
		}
	};
