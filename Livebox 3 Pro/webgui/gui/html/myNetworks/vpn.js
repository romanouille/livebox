function TableBorder(){
	
	$("#stsTable tr").css("border","none");
	$(".vpn_graphicsts").css("border-right","1px solid #CCCCCC");
	
	$("#nomadeTable tr").css("border","none");
	$(".vpn_graphicnomade").css("border-right","1px solid #CCCCCC");
	
	var nbLignestsTable =$("#stsTable tr").length-1;
	var nbLignenomadeTable=$("#nomadeTable tr").length-1;
	
	if(nbLignestsTable>=2){	
		$("#stsTable tr").css("border","1px solid #CCCCCC");
		$(".vpn_graphicsts").css("border-right","none");
	}
	if(nbLignenomadeTable>=2){
		$("#nomadeTable tr").css("border","1px solid #CCCCCC");
		$(".vpn_graphicnomade").css("border-right","none");
	}	

}

function vpn_synchronizeTableWidth() {
	// Synchronize the width of the two tables
	var nbColsSts = $("#stsTable th").length;
	var nbColsNomade = $("#nomadeTable th").length;
	for (var c = 0; c < Math.max(nbColsSts, nbColsNomade); c++) {
		var widthSts = 0;
		if (c < nbColsSts) {
			widthSts = $("#stsTable th:eq(" + c + ")").width();
		}
		var widthNomade = 0;
		if (c < nbColsNomade) {
			widthNomade = $("#nomadeTable th:eq(" + c + ")").width();
		}

		var finalWidth = Math.max(widthSts, widthNomade);
		if (c < nbColsSts) {
			$("#stsTable th:eq(" + c + ")").width(finalWidth);
		}
		if (c < nbColsNomade) {
			$("#nomadeTable th:eq(" + c + ")").width(finalWidth);
		}
	}
}

/**
 * Returns true if and only if the specified nod belongs to a row that is
 * deletable, according to the rows attributes "connected" and "activated"
 * 
 * @param node
 * @returns {Boolean}
 */
function vpn_isDeletable(node) {
	var deletable = false;
	var jRow = $(node).parents("tr");
	if (jRow.length == 1) {
		deletable = jRow.attr("connected") == "false";
	}
	return deletable;
}

/**
 * Update the little trash bin icon
 * @param node
 */
function vpn_updateDeletable(node) {
	var jRow = $(node).parents("tr");
	var jTrashBin = $("td img.deleting", jRow);
	if (jTrashBin.length == 1) {
		var deletable = vpn_isDeletable(node);
		jQuery.orange.setDataValue(jTrashBin[0], deletable);
	}
}

function vpn_updateMaskedSts() {
	var doMask = $("#maskSts")[0].getDataValue();
	if(doMask == "oui"){
		$("#stsTable tr[activated='false']").show();
		$("#maskSts").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.maskinactive.true.tip"]);
	}else{
		$("#stsTable tr[activated='false']").hide();
		$("#maskSts").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.maskinactive.false.tip"]);
	}
	$("#stsTable tr[activated='true']").show();
	$("#stsTable tr[deleted='true']").hide();
}

function vpn_updateMaskedNomade() {
	var doMask = $("#maskNomade")[0].getDataValue();
	if (doMask == "oui"){
		$("#nomadeTable tr[activated='false']").show();
		$("#maskNomade").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.maskinactive.true.tip"]);
	}else{
		$("#nomadeTable tr[activated='false']").hide();
		$("#maskNomade").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.maskinactive.false.tip"]);
	}
	$("#nomadeTable tr[activated='true']").show();
	$("#nomadeTable tr[deleted='true']").hide();
}

jQuery.orange.config.areacontent.vpn = {
		preParse: function() {
			
			// clear the last data used for vpnUser creation
			$("#content").removeData("selectedUserName");
			
			$("#stsTable, #nomadeTable").hide();

			// ********************************************
			//Creation conditonnelle du "groupe par defaut"
			// ********************************************
			var defaultGroupName="default";
			var XdefaultGroup = "Device/Networks/WAN[@name='WAN']/VPN/RoadWarriorVPNs/RoadWarriorVPN[@Name='"+defaultGroupName+"']";
			jQuery.orange.config.api.crud.read(
					[XdefaultGroup],
					function (result) {
						if(result[XdefaultGroup] == undefined){
							jQuery.orange.config.api.crud.create("Device/Networks/WAN[@name='WAN']/VPN/RoadWarriorVPNs/RoadWarriorVPN",{"Name":"default"});
						}
					});



			// **************************
			// STS BUILD ****************
			// **************************

			$("#maskSts").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.maskinactive.true.tip"]);
			$("#maskNomade").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.maskinactive.true.tip"]);

			var Xsites = "Device/Networks/WAN[@name='WAN']/VPN/NetToNetVPNs/NetToNetVPN";
			jQuery.orange.config.api.crud.read([Xsites],function(result){
				var lineref=0;
				for (site in result[Xsites].values) {
					var sitename = result[Xsites].values[site]["Name"];

					var rowContent="<tr id=\"sts"+lineref+"\" refid=\"Device/Networks/WAN[@name='WAN']/VPN/NetToNetVPNs/NetToNetVPN[@Name='"+sitename+"']\">";

					// Column STATUS
					var Xconnected = "Device/Networks/WAN[@name='WAN']/VPN/NetToNetVPNs/NetToNetVPN[@Name='"+sitename+"']/Connected";
					rowContent += "<td><img class=\"status\" dataid=\""+Xconnected+"\" i18nPrefix=\"data.vpn.vpnSts.status\" widgetType=\"Image\"/></td>";

					// Column NAME
					rowContent += "<td>"+sitename+"</td>";//<a id=\""+sitename+"\" class=\"orange linktosts\">"+sitename+"</a></td>";

					//Column ACTIVATE
					var Xenable ="Device/Networks/WAN[@name='WAN']/VPN/NetToNetVPNs/NetToNetVPN[@Name='"+sitename+"']/Enable";
					rowContent += "<td class='center'><input lineref=\""+lineref+"\" class=\"enablingSite\" type=\"checkbox\" dataId=\""+Xenable+"\"/></td>";

					//Column Update
					rowContent += "<td class=\"btnCursor\"> <a id=\""+sitename+"\" class=\"linktosts\"><img  i18n=\"data.vpn.vpnSts.Update\" widgetType=\"Image\"/></a></td>";

					//Column DELETE
					rowContent += "<td class='center'><img lineref=\""+lineref+"\" sitename=\""+sitename+"\" class=\"deleting\" dataid=\""+Xconnected+"\" i18nPrefix=\"data.vpn.vpnSts.deleteable\" widgetType=\"Image\"/></td>";

					//Column dummy (to have the same nb of columns as the other table
					//	rowContent += "<td/></td>";

					// END of row
					rowContent += "</tr>";
					$("#stsTable").append(rowContent);
					lineref++;
				}
			});

			// **************************
			// NOMADE BUILD *************
			// **************************
			var Xnomades = "Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser";
			jQuery.orange.config.api.crud.read([Xnomades],function(result){
				var lineref=0;
				for (nomade in result[Xnomades].values) {
					var nomadename = result[Xnomades].values[nomade]["Login"];	

					var rowContent="<tr id=\"nomade"+lineref+"\" refid=\"Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser[@Login='"+nomadename+"']\">";

					// Column STATUS
					var Xconnected = "Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser[@Login='"+nomadename+"']/ConnectionStatus";
					rowContent += "<td><img class=\"status\" dataid=\""+Xconnected+"\" i18nPrefix=\"data.vpn.vpnSts.status\"/></td>";

					// Column NAME
					rowContent += "<td>"+nomadename+"</td>";

					//Column ACTIVATE
					var Xenable ="Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser[@Login='"+nomadename+"']/Enable";
					rowContent += "<td class='center'><input lineref=\""+lineref+"\" class=\"enablingUser\" type=\"checkbox\" dataId=\""+Xenable+"\"/></td>";

					//Column Update
					rowContent += "<td class=\"btnCursor\"><a lineref=\""+lineref+"\" class=\"linktouser\" id=\""+nomadename+"\" ><img  i18n=\"data.vpn.vpnNomade.Update\" widgetType=\"Image\"/></a></td>";

					//Column GROUP
					rowContent += "<td class=\"Cursor\"><a lineref=\""+lineref+"\" class=\"orange linktogroup modeledlink\" dataid=\"Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser[@Login='"+nomadename+"']/Group\" i18nPrefix=\"data.vpn.group.name\"></a></td>";
					// rowContent += "<td class=\"Cursor\"><a lineref=\""+lineref+"\" class=\"orange linktogroup\" dataid=\"Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser[@Login='"+nomadename+"']/Group\" i18nPrefix=\"data.vpn.group.name\"></a></td>";
					// rowContent += "<td class=\"Cursor\"><a lineref=\""+lineref+"\" class=\"orange linktogroup\" dataid=\"Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser[@Login='"+nomadename+"']/Group\"></a></td>";

					//Column DELETE
					rowContent += "<td class='center'><img lineref=\""+lineref+"\" nomadename=\""+nomadename+"\" class=\"deleting\" dataid=\""+Xconnected+"\"  i18nPrefix=\"data.vpn.vpnNomade.deleteable\" widgetType=\"Image\"/></td>";

					// END of row
					rowContent += "</tr>";
					$("#nomadeTable").append(rowContent);
					lineref++;
				}
			});

		},

		postParse: function() {
		},

		postLoad: function(){
			
//			// Force the button "parametrer un vpn nomade" to be disabled since the box is not yet ready
//			$("#addVpnNomade")[0].setDisabled(true);
			$("#addVpnNomade a img").attr("disabled", "disabled");
			
			$("#help").bind("click",function() {
				helpPopup("html/main/help_vpn.html");
			});

			$(".linktosts").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.sts.tip"]);
			$(".linktogroup").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.group.tip"]);
			$(".linktouser").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.user.tip"]);

			// **************************
			// SITE TO SITE INITIALISATE*
			// **************************

			var stsInit = function(){ 
				var sitelist = $("input.enablingSite");
				var lineref = "";
				for ( var int = 0; int < sitelist.length; int++) {
					lineref = sitelist[int].getAttribute("lineref");
					
					var jCheckBoxActivate = $("#stsTable tr#sts"+lineref+" td input.enablingSite");
					var jImgStatus = $("#stsTable tr#sts"+lineref+" td img.status");
					var jRow = $("#stsTable tr#sts"+lineref);

					// during the building of the tables, hide the current row
					$("#stsTable tr#sts"+lineref).hide();

					//positionnenment du status "ACTIVATED"
					if(!jCheckBoxActivate[0].getDataValue()){
						jCheckBoxActivate.attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.activate.false.tip"]);
						jImgStatus.attr("i18nPrefix","data.vpn.vpnSts.status.deactivated");
						jRow.attr("activated","false");
					}else{
						jCheckBoxActivate.attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.activate.true.tip"]);
						jImgStatus.attr("i18nPrefix","data.vpn.vpnSts.status");
						jRow.attr("activated","true");
					}

					//positionnenment du status "CONNECTED"
					if(jImgStatus[0].dataValueRef){
						jRow.attr("connected","true");
					}else{
						jRow.attr("connected","false");
					}

					//positionnenment du status "DELETED"
					jRow.attr("deleted","false");
					//jRow.show();
					
					vpn_updateDeletable(jCheckBoxActivate);

					jImgStatus.parent().orangeRead();
					$("#stsTable tr#sts"+lineref+" td img.deleting").parent().orangeRead();
				}
				// Update the rows' visibility
				vpn_updateMaskedSts();
			};
			stsInit();

			$("#stsTable .status").bind("valueChange",function(event, newvalue){
				$(this).parents("tr").attr("connected", newvalue);
				vpn_updateDeletable(this);
			});

			$("#stsTable .enablingSite").bind("change",function(event){
			});
			
			$("#stsTable .deleting").bind("click",function(event){
				var lineref = $(event.target).attr("lineref");
				if (vpn_isDeletable(this)) {
					openConfirmationPopup('popup.confirm.title', 'popup.confirm.text', function() {
						$("#stsTable tr#sts"+lineref).attr("deleted","true");
						vpn_updateMaskedSts();
						$("#cancelation").setDisabled(false);
						$("#submiting").setDisabled(false);
					});
				}
			});

			$("#maskSts").bind("change",function(event,newValue){
				vpn_updateMaskedSts();
			});

			// **************************
			// NOMADE INITIALISATE*******
			// **************************	
			var nomadeInit = function(){
				var userlist = $("input.enablingUser");
				for ( var int = 0; int < userlist.length; int++) {
					var lineref = userlist[int].getAttribute("lineref");

					var jCheckBoxActivate = $("#nomadeTable tr#nomade"+lineref+" td input.enablingUser");
					var jImgStatus = $("#nomadeTable tr#nomade"+lineref+" td img.status");
					var jRow = $("#nomadeTable tr#nomade"+lineref);

					jRow.hide(); // hide all rows during table construction
					
					//positionnenment du status "ACTIVATED"
					if(!jCheckBoxActivate[0].getDataValue()){
						jCheckBoxActivate.attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.activate.nomade.false.tip"]);
						jImgStatus.attr("i18nPrefix","data.vpn.vpnSts.status.deactivated");
						jRow.attr("activated","false");
					}else{
						jCheckBoxActivate.attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.activate.nomade.true.tip"]);
						jImgStatus.attr("i18nPrefix","data.vpn.vpnSts.status");
						jRow.attr("activated","true");
					}
					//positionnenment du status "CONNECTED"
					if(jImgStatus[0].dataValueRef){
						jRow.attr("connected","true");
					}else{
						jRow.attr("connected","false");
					}

					//positionnenment du status "DELETED"
					jRow.attr("deleted","false");

					jImgStatus.bind("valueChange", function(event, newvalue) {
						$(this).parents("tr").attr("connected", newvalue);
						vpn_updateDeletable(this);
					});

					jCheckBoxActivate.bind("valueChange", function(event, newvalue) {
						$(this).parents("tr").attr("activated", newvalue);
						vpn_updateDeletable(this);
					});

					vpn_updateDeletable(jCheckBoxActivate);

					jImgStatus.parent().orangeRead();
					$("#nomadeTable tr#nomade"+lineref+" td img.deleting").parent().orangeRead();
				}
				vpn_updateMaskedNomade();
			};
			nomadeInit();

			$("#nomadeTable .enablingUser").bind("change",function(event){
			});

			$("#nomadeTable .deleting").bind("click", function(event){
				var lineref = $(event.target).attr("lineref");
				if (vpn_isDeletable(this)) {				
					openConfirmationPopup('popup.confirm.title', 'popup.confirm.text', function() {
						$("#nomadeTable tr#nomade"+lineref).attr("deleted","true");
						vpn_updateMaskedNomade();
						$("#cancelation").setDisabled(false);
						$("#submiting").setDisabled(false);
					});
				}
			});

			$("#maskNomade").bind("change",function(event,newValue){
				vpn_updateMaskedNomade();
			});

			$("#stsTable, #nomadeTable").show();
			vpn_synchronizeTableWidth();
			TableBorder();

			// Gestion des liens
			$("#stsTable .linktosts").bind("click",function(event){
				var selectedSiteName = $(event.target).parent().attr("id");
				$("#content").data("selectedSiteName",selectedSiteName);
				jQuery.orange.widget.MenuItem.setCurrent('m2.m271');
			});
			$("#nomadeTable .linktouser").bind("click",function(event){
				var selectedUserName = $(event.target).parent().attr("id");
				$("#content").data("selectedUserName",selectedUserName);
				jQuery.orange.widget.MenuItem.setCurrent('m2.m273');
			});	
			$("#nomadeTable .linktogroup").bind("click",function(event){
				var selectedGroupName = this.dataValueRef;
				$("#content").data("selectedGroupName",selectedGroupName);
				jQuery.orange.widget.MenuItem.setCurrent('m2.m272');
			});


			$(".modeledlink").each(function(){
				if(this.dataValueRef != "default"){
					this.innerHTML = this.dataValueRef;
				}
			});

			$("#vpn form")[0].crudCallDelegate = function(crudExec) {
				crudExec();
				$("tr[deleted='true']").each(function(){
					var Xtodelete = $(this).attr("refid");
					jQuery.orange.config.api.crud.del(Xtodelete,function(result){
						$("#content").orangeLoad(menu.mapping.vpn);
					});	
				});
				nomadeInit();
				stsInit();
				$("#cancelation").setDisabled(true);
				$("#submiting").setDisabled(true);
			};

			$("#cancelation").bind("click keydown",function(){
				nomadeInit();
				stsInit();
				$("#cancelation").setDisabled(true);
				$("#submiting").setDisabled(true);
			});
		}
};

