function vpnNomade_getDefaultPresharedKey() {
	return $("#routerName")[0].dataValueRef;
}

function vpnNomade_preset2Gui(remotesoftware) {
	var preset = IPSecEasyModeRoadWarrior[remotesoftware];
	$("#roadWarriorEnabled")[0].setDataValue(true);
	if (preset === undefined) {
		preset = IPSecEasyModeRoadWarrior["default"];
	}
	if (preset != undefined) {
		$("#ipallocationmode")[0].setDataValue(preset.IPAllocation);
		$("#internetaccessmode")[0].setDataValue(preset.UsersAccess);
		$("#protocol")[0].setDataValue(preset.Protocol);
		$("#agressivemode")[0].setDataValue(preset.Mode);
		$("#crypt1")[0].setDataValue(preset.Encryption1);
		$("#auth1")[0].setDataValue(preset.Authentication1);
		$("#diffie")[0].setDataValue(preset.HellmannGroup);
		$("#lifetime1")[0].setDataValue(preset.LifeTime1);
		$("#crypt2")[0].setDataValue(preset.Encryption2);
		$("#auth2")[0].setDataValue(preset.Authentication2);
		$("#pfs")[0].setDataValue(preset.PFSGroup);
		$("#lifetime2")[0].setDataValue(preset.LifeTime2);
		$("#deadpeerdetection")[0].setDataValue(preset.DeadPeerDetection);
		if (preset.ExpertMode === true) {
			$("#vpnexpertmode")[0].setDataValue(true);
		}
	}
}

jQuery.orange.config.areacontent.vpnNomade = {
		onReset: function() {
			//appel fonction onReset par defaut
			$("#nomadeForm")[0].onReset = undefined;
			var resetresult = jQuery.orange.widget.Form.onReset.call(this);
			$("#nomadeForm")[0].onReset = jQuery.orange.config.areacontent.vpnNomade.onReset;
			
			//traitement cas de test
			var form = this;
			if($("#vpnNomade form").attr('creation')){
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
				jQuery.orange.widget.Form.setButtonsDisabled.call($("#vpnNomade form")[0], jQuery.orange.widget.Form.STATE_ONCREATE);
			}
			
			//retour de la fonction standard
			return resetresult;
		},
		onDataChange: function(node, showErrorMsg) {
			//appel fonction onDataChange par defaut
			$("#nomadeForm")[0].onDataChange = undefined;
			jQuery.orange.widget.Form.onDataChange.call(this, node, showErrorMsg);
			$("#nomadeForm")[0].onDataChange = jQuery.orange.config.areacontent.vpnNomade.onDataChange;

			//Cas creation : traitement de l'ensemble du formulaire pour definir et positionner état des boutons en fonction des dataValueRef
			if($("#vpnNomade form").attr('creation')){
				var modified=false;
				$("[dataId]", this).each(function() {
					var node = this;
					if(arrayIndexOf($("[widgetType='Button'] input"), node) == -1){
						if(node != $("#routerName")[0] 
								&& node != $("#noneditabelmgroupname")[0]
								&& node != $("#auth")[0]
								&& node.dataValueRef != undefined){
							if(node.getDataValue() != node.dataValueRef){
								if(!modified){
									modified=true;
								}
							}
						}
					}
				});
				if(modified){
					jQuery.orange.widget.Form.setButtonsDisabled.call($("#vpnNomade form")[0], jQuery.orange.widget.Form.getState.call(this));				
				}else{
					jQuery.orange.widget.Form.setButtonsDisabled.call($("#vpnNomade form")[0], jQuery.orange.widget.Form.STATE_ONCREATE);					
				}
			}
		},
		preParse: function() {
			
			$("#nomadeForm")[0].onReset = jQuery.orange.config.areacontent.vpnNomade.onReset; 
			$("#nomadeForm")[0].onDataChange = jQuery.orange.config.areacontent.vpnNomade.onDataChange; 
			
			var XPREFIX = "";
			var selectedGroup = $("#content").data('selectedGroupName');
			
			if(selectedGroup == undefined){
				$("#vpnNomade form").attr('creation',true);
			}
			
			if(selectedGroup == undefined){
				$("#assigneduserslist").prev().css("display","none");
				$("#assigneduserslist").css("display","none");
				$("#deleteNomadeGroup").css("display","none");
				$("#saveNomadeGroup").css("display","none");
				$("#createNomadeGroup").css("display","");
				$("#noUser").show();
				XPREFIX = "";
			}else{
				$("#createNomadeGroup").remove(); // prevent the form to be submitted via the enter key with crud='create'
				var Xnomades = "Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser";
				jQuery.orange.config.api.crud.read([Xnomades],function(result){
					var usersdisplay = "";
					var userRank=0;
					for (nomade in result[Xnomades].values) {
						var Xuser = Xnomades+"[@Login='"+result[Xnomades].values[nomade]["Login"]+"']";
						if(selectedGroup == result[Xnomades].values[nomade]["Group"]){
							usersdisplay += "<input userRank=\"user"+userRank+"\" class=\"assignedUser\" type=\"checkbox\" checked/>";
							usersdisplay += "<span dataId=\""+Xuser+"/@Login\"/>";
							usersdisplay += "<input style=\"display:none\" class=\"userconnectionstatus\" type=\"checkbox\" dataId=\""+Xuser+"/ConnectionStatus\"/>";
							usersdisplay += "<input id=\"user"+userRank+"\" style=\"display:none\" class=\"usergroup\" type=\"text\" dataId=\""+Xuser+"/Group\"/>";
							usersdisplay += "&#160;&#160;";
							userRank++;
						}
					}
					$("#assigneduserslist").append(usersdisplay);
					if (userRank == 0) {
						$("#noUser").show();
					} else {
						$("#noUser").hide();
					}
				});
								
				XPREFIX = "Device/Networks/WAN[@name='WAN']/VPN/RoadWarriorVPNs/RoadWarriorVPN[@Name='"+selectedGroup+"']/";
			}

			//init dataidArray
			
			if(selectedGroup == undefined){
				$("#nomadeForm").data("XNAME",XPREFIX+"Name");
			} else {
				$("#nomadeForm").data("XNAME",XPREFIX+"@Name");
			}
			
			//
			$("#nomadeForm").data("ENABLE",XPREFIX+"Enable");
			
			$("#nomadeForm").data("XREMOTESOFTWARE",XPREFIX+"RemoteSoftware");
			$("#nomadeForm").data("XAUTH",XPREFIX+"UserAuthentication");
			$("#nomadeForm").data("XIPALLOCATIONMODE",XPREFIX+"IPAllocationMode");
			$("#nomadeForm").data("XINTERNETACCESSMODE",XPREFIX+"InternetAccessMode");
			$("#nomadeForm").data("XPRESHAREDKAY",XPREFIX+"PresharedKey");
			$("#nomadeForm").data("XPROTOCOL",XPREFIX+"Protocol");
			$("#nomadeForm").data("XINTERFACENAME",XPREFIX+"InterfaceName");
			$("#nomadeForm").data("XAGRESSIVEMODE",XPREFIX+"AggressiveMode");
			$("#nomadeForm").data("XENCRYPTION1",XPREFIX+"Encryption1");
			$("#nomadeForm").data("XAUTH1",XPREFIX+"Authentication1");
			$("#nomadeForm").data("XDIFFIE",XPREFIX+"DiffieGroup");
			$("#nomadeForm").data("XLIGETIME1",XPREFIX+"LifeTime1");
			$("#nomadeForm").data("XENCRYPTION2",XPREFIX+"Encryption2");
			$("#nomadeForm").data("XAUTH2",XPREFIX+"Authentication2");
			$("#nomadeForm").data("XPFS",XPREFIX+"PFSGroup");
			$("#nomadeForm").data("XLIGETIME2",XPREFIX+"LifeTime2");
			$("#nomadeForm").data("XDEADPEERCONNECTION",XPREFIX+"DeadPeerDetection");
			$("#nomadeForm").data("XEXPERTMODE",XPREFIX+"ExpertMode");
		
			var dataidcontainers = $("#nomadeForm [dataidref]");
			for ( var int = 0; int < dataidcontainers.length; int++) {
				var currentDataidRef = dataidcontainers[int].getAttribute("dataidref");
				dataidcontainers[int].setAttribute("dataid",$("#nomadeForm").data(currentDataidRef));
			}
		},
		postParse: function(area) {
			$("#backTovpn").bind("click",function(){
				jQuery.orange.widget.MenuItem.setCurrent('m2.m27');
			});
						
			$("#createNomadeGroup input[type='submit'], #saveNomadeGroup input[type='submit']").each(function (){
				this.crudCallback = function () {
					area.popupOnUnsubmitted = false;
					jQuery.orange.widget.MenuItem.setCurrent('m2.m27');
				};
			});
		},
		postLoad: function(area){
			
			$("#help").bind("click",function() {
				helpPopup("html/main/help_vpnNomade.html");
			});
			
			// traitement nominal de positionnement du flag "montrer la cle"
			$("#keyvisible")[0].setDataValue(false);
			$("#keyvisible")[0].dataValueRef = false;
			$("#keyvisible").trigger('change');
			$("#presharedkey")[0].mask(true);
			
			$("#remotesoftware").bind('change valueChange', function() {
				var remotesoftware = $("#remotesoftware")[0].getDataValue();
				vpnNomade_preset2Gui(remotesoftware);
			});
			
			$("#vpnexpertmode").bind("change valueChange", function() {
				var expertMode = $("#vpnexpertmode")[0].getDataValue();
				if (expertMode === false) {
					var remotesoftware = $("#remotesoftware")[0].getDataValue();
					if (remotesoftware == "OTHER") {
						 $("#remotesoftware")[0].setDataValue("SHREW");
					} else {
						vpnNomade_preset2Gui(remotesoftware);
					}
				}
			});
			
			var selectedGroup = $("#content").data('selectedGroupName');
			if(selectedGroup == undefined){
				
				$("#groupname")[0].setDataValue("");
					$("#groupname")[0].dataValueRef = "";
					$("#groupname").trigger('valueChange');
				$("#remotesoftware")[0].setDataValue("SHREW");
					$("#remotesoftware")[0].dataValueRef = "SHREW";
					$("#remotesoftware").trigger('valueChange');
				$("#auth")[0].dataValueRef = 0;
					$("#auth").orangeTranslate();

				var presharedkey = vpnNomade_getDefaultPresharedKey();
				
				$("#presharedkey")[0].setDataValue(presharedkey);
				$("#presharedkey")[0].dataValueRef = presharedkey;
				$("#presharedkey").trigger('valueChange');
			$("#keyvisible")[0].setDataValue(true);
				$("#keyvisible")[0].dataValueRef = true;
				$("#keyvisible").trigger('change');
				$("#presharedkey")[0].mask(false);
			$("#vpnexpertmode")[0].setDataValue(false);
				$("#vpnexpertmode")[0].dataValueRef = false;
				$("#vpnexpertmode").trigger('valueChange');
				
			jQuery.orange.widget.Form.setButtonsDisabled.call($("#vpnNomade form")[0], jQuery.orange.widget.Form.STATE_ONCREATE);
		}
			
			// positionnement des tooltips
			$("#groupname").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.groupname.tip"]);
			$("#presharedkey").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.presharedkey.tip"]);
			$("#lifetime1").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.lifetime.tip"]);
			$("#lifetime2").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.lifetime.tip"]);
			$("#remotesoftware").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.remotesoftware.tip"]);
			$("#ipallocationmode").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.ipallocationmode.tip"]);
			$("#internetaccessmode").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.internetaccessmode.tip"]);
			$("#protocol").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.protocol.tip"]);
			$("#interfacename").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.interfacename.tip"]);
			$("#agressivemode").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.agressivemode.tip"]);
			$("#crypt1").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.crypt.tip"]);
			$("#crypt2").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.crypt.tip"]);
			$("#auth1").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.auth.tip"]);
			$("#auth2").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.auth.tip"]);
			$("#diffie").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.diffie.tip"]);
			$("#pfs").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.pfs.tip"]);
			
			$(".assignedUser").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.assigned.tip"]);
			
			$("#groupname").bind('change keyup',function(event){
				$(".usergroup").each(function(i){
					this.setDataValue($(event.target)[0].getDataValue());
				});
			});
			
			$(".usergroup").each(function(i){
				$(this).bind('valueChange', function(event, newValue) {	
					// Si nouvelle valeur different du groupe actuel
					if(newValue != $("#groupname")[0].getDataValue()) {
						// Si la case est cochée on la décoche
						if( $("[userrank='"+this.id+"']")[0].getDataValue() == true) {
							$("[userrank='"+this.id+"']")[0].setDataValue(false);
						}
					} else {
						// Si la case est decochée on la coche
						if( $("[userrank='"+this.id+"']")[0].getDataValue() == false) {
							$("[userrank='"+this.id+"']")[0].setDataValue(true);
						}
					}
				});
			});
			
			$(".assignedUser").bind('valueChange',function(event){
				var currentuser = event.target.getAttribute('userRank');
				var currentgroup = $("#groupname")[0].getDataValue();
				console.log(currentuser+" ::: "+$("#"+currentuser)[0].getDataValue());
				if(event.target.checked){
					$("#"+currentuser)[0].setDataValue(currentgroup);
					event.target.setAttribute('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.assigned.tip"]);
				}else{
					$("#"+currentuser)[0].setDataValue("default");
					event.target.setAttribute('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.unassigned.tip"]);
				}
			});
			/*
			if($("#deadpeerdetection")[0].getDataValue()){
				$("#deadpeerdetection").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.deadpeerdetection.true.tip"]);
			}else{
				$("#deadpeerdetection").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.deadpeerdetection.false.tip"]);
			}
			$("#deadpeerdetection").bind('valueChange',function(event){
				if(event.target.checked){
					$("#deadpeerdetection").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.deadpeerdetection.true.tip"]);
				}else{
					$("#deadpeerdetection").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.deadpeerdetection.false.tip"]);
				}
			});*/
			/*
			$("#keyvisible").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.keyvisible.false.tip"]);
			$("#keyvisible").bind('click',function(event){
				if(event.target.checked){
					$("#keyvisible").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.keyvisible.false.tip"]);
				}else{
					$("#keyvisible").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnNomade.keyvisible.true.tip"]);
				}
			});
			*/
			
			//Evol Safenet, Cisco et Netasq non disponibles
			$("#remotesoftware").setDisabled(true);
			
			if($("#groupname")[0].getDataValue()=="default"){
				$("#groupname").css("display","none");
				$("#noneditabelmgroupname").css("display","");
				$("#remotesoftware").setDisabled(true);
				$("#ipallocationmode").setDisabled(true);
				$("#internetaccessmode").setDisabled(true);
			}

			$(".userconnectionstatus").bind('change',function(event,newvalue){
				if(($("#groupname")[0].getDataValue()!="default"
					&& $("#groupname")[0].getDataValue()!="")){
					if(!asConnectedUsers($("#groupname")[0].getDataValue())){
						$("#deleteNomadeGroup").css("display","");
					}else{
						$("#deleteNomadeGroup").css("display","none");
					}
				}
			});

			if(($("#groupname")[0].getDataValue()!="default"
				&& $("#groupname")[0].getDataValue()!="")){
				if(!asConnectedUsers($("#groupname")[0].getDataValue())){
					$("#deleteNomadeGroup").css("display","");
				}
			}

			//Gestion affichage du bouton reinit
			if($("#groupname")[0].getDataValue()=="default"){
				$("#reinitnomadegroup").css("display","");
			}
			$("#reinitnomadegroup").bind("activateButton", function() {
				// r驮itialiser la cl頰artag饠nomade ࠳a valeur par d馡ut et rendre la cl頬isible
				$("#keyvisible")[0].setDataValue(true);
				var presharedkey = vpnNomade_getDefaultPresharedKey();
				$("#presharedkey")[0].setDataValue(presharedkey);
			});

			$('#keyvisible').bind("change valueChange", function(event, newValue) {
				if (newValue!=undefined) {
					$("#presharedkey")[0].mask(! newValue);
				}
			});

			var form = $("#nomadeForm")[0];
			var oldState = jQuery.orange.widget.Form.getState.call(form);
			form.dataKO=[];
			form.modifsOK=[];
			var newState = jQuery.orange.widget.Form.getState.call(form);
			if (newState != oldState){
				jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
			}
			
			
			$("#deleteNomadeGroup").bind('click',function(){
				openConfirmationPopup('popup.confirm.title', 'popup.confirm.text',
					function() {
						if(asUsers($("#groupname")[0].getDataValue())){
							var Xnomades = "Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser";
							jQuery.orange.config.api.crud.read([Xnomades],function(result){
								var id2value = {};
								for (nomade in result[Xnomades].values) {
									if($("#groupname")[0].getDataValue() == result[Xnomades].values[nomade]["Group"]){
										var XUserGroup = "Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser[@Login='"+result[Xnomades].values[nomade]["Login"]+"']/Group";
										id2value[XUserGroup] = "default";
									}
								}
								jQuery.orange.config.api.crud.update(id2value);
							});
						}
						
						var Xdelete = "Device/Networks/WAN[@name='WAN']/VPN/RoadWarriorVPNs/RoadWarriorVPN[@Name='"+$("#groupname")[0].getDataValue()+"']";
						jQuery.orange.config.api.crud.del(Xdelete,function(result){
							jQuery.orange.widget.MenuItem.setCurrent('m2.m27');
						});
					});
			});
						
			$("#content").removeData('selectedGroupName');
		}
	};

asConnectedUsers = function(groupname){
	var asConnectedUsersStatus = false;
	var Xnomades = "Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser";
	jQuery.orange.config.api.crud.read([Xnomades],function(result){
		for (nomade in result[Xnomades].values) {
			if(groupname == result[Xnomades].values[nomade]["Group"]
				&& result[Xnomades].values[nomade]["ConnectionStatus"] == true){
				asConnectedUsersStatus = true;
			}
		}
	});
	return asConnectedUsersStatus;
};

asUsers = function(groupname){
	var asUsersStatus = false;
	var Xnomades = "Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser";
	jQuery.orange.config.api.crud.read([Xnomades],function(result){
		for (nomade in result[Xnomades].values) {
			if(groupname == result[Xnomades].values[nomade]["Group"]){
				asUsersStatus = true;
			}
		}
	});
	return asUsersStatus;
};