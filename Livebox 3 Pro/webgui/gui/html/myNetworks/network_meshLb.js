//function network_meshLb_getStrength(arrayLink, link, link2) {
//	var strength1 = -1;
//	var strength2 = -1;
//	if(arrayLink[link]['Links'] != undefined) {
//		strength1 = parseInt(arrayLink[link]['Links'][link2]);
//	}
//	if (arrayLink[link2]['Links'] != undefined) {
//		strength2 = parseInt(arrayLink[link2]['Links'][link]);
//	}
//	var signalValue;
//	if (0 <= strength1 && strength1 <= 4 && 0 <= strength2 && strength2 <= 4) {
//		signalValue = Math.min(strength1, strength2);
//	} else if (0 <= strength1 && strength1 <= 4) {
//		signalValue = strength1;
//	} else if (0 <= strength2 && strength2 <= 4) {
//		signalValue = strength2;
//	} else {
//		signalValue = -1;
//	}
//	return signalValue;
//}

jQuery.orange.config.areacontent.network_meshLb = {
	
	preParse: function() {	
//		var WiFiSignal="Device/MESH/AccessPoints/AccessPoint/Links/Link/WiFiSignal";
//		jQuery.orange.config.api.crud.read(
//			[WiFiSignal],
//			function (result) {
//				if (result[WiFiSignal].nb > 0) {
//				
//							var box;
//							for (box in result[WiFiSignal].values) {
//								var signalValeur = result[WiFiSignal].values[box];								
//								$("#hiddenLinks").append( " <input type='text' style='display:none' class='myLink'  dataId="+ box+"></input>");
//									
//							}
//					$('.myLink').bind('valueChange',function(event,newValue){
//					    var radioVue=$("#radioVue")[0].getDataValue();							    
//						jQuery.orange.config.areacontent.network_meshLb.TabConstr();
//						$("#radioVue")[0].setDataValue(radioVue);
//					});
//				}
//			});
		
		// We add the GWT MeshWidget
		try {
			fr.orange.livebox.gui.pages.engine.MeshPresenter.initWidget();
		} catch(err) { }
	
	},
	postParse: function() {	
		$("#btnDisableMesh").click(function(){			
			openConfirmationPopup('popup.disablemesh.title', 'popup.disablemesh.text',
				function() {
					var MeshEnable = "Device/MESH/Enable";
					//var MeshStatus = "Device/MESH/Status";
					var id2value = {};
					id2value[MeshEnable] = false;
					//id2value[MeshStatus] = "DOWN";
					jQuery.orange.config.api.crud.update(id2value, function() {
						jQuery.orange.widget.MenuItem.setCurrent('m0');
						$('[widgetType="VisibleDependent"][dataId="Device/MESH/Enable"]').each(function() {
							$(this)[0].setDataValue(false);
						});
					});
				});
		});
		
//		jQuery.orange.config.areacontent.network_meshLb.TabConstr();
	},
	postLoad: function(){
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_networkMeshLb.html");
		});
		
//		$("#radioVue")[0].setDataValue("TABLE");		
//		$('#graphSignal').orangeParse();
//		$("#graphSignal").orangeTranslate();
//		$('#meshLink').orangeParse();
//		$("#meshLink").orangeTranslate();
	}/*,
	
	
	TabConstr:function(){

		jQuery.orange.config.areacontent.network_meshLb.buildStructure();
		var arrayLink = new Object();
		
//		var RouterName = "Device/DeviceInfo/RouterName";
//		jQuery.orange.config.api.crud.read(
//			[RouterName],
//			function (result) {
//				arrayLink['GWC'] = {'RouterName': result[RouterName].values[RouterName]};
//			}
//		);
		
		
		var APDevice = "Device/MESH/AccessPoints/AccessPoint";
		jQuery.orange.config.api.crud.read(
			[APDevice],
			function (result) {
				nbAPDevice = result[APDevice].nb;
				if (result[APDevice].nb > 0) {
					for (var box in result[APDevice].values) {
						var uid = result[APDevice].values[box]["uid"];
						var RouterNameXPath = "Device/MESH/AccessPoints/AccessPoint[@uid='"+uid+"']/DeviceInfo/RouterName";
						var routerName;
						jQuery.orange.config.api.crud.read(
							[RouterNameXPath],
							function (result) {
								for (router in result[RouterNameXPath].values) {
									routerName = result[RouterNameXPath].values[router];
								}
							});

						var alias = result[APDevice].values[box]["Alias"];

						arrayLink[alias] = {
							'RouterName': routerName,
							'Alias': alias,
							'uid' : uid
						};
					}
				}
			});
		
		var arrayLinkNb=0;
		var box;
		for (box in arrayLink) {
			arrayLinkNb++;
			var Links = "Device/MESH/AccessPoints/AccessPoint[@uid='"+ arrayLink[box].uid+"']/Links/Link";				
			jQuery.orange.config.api.crud.read(
					[Links],
					function (result) {
						var LinkFinal = new Object();
						for(var link in result[Links].values) {
							LinkFinal[result[Links].values[link]['DeviceName']] = result[Links].values[link]['WiFiSignal'];
						}
						arrayLink[box]['Links'] = LinkFinal;
					});
		}

		var i=0;
		var link;
		for(link in arrayLink) {
			if(i!=arrayLinkNb-1) {
				$("#meshLink thead tr").append("<th style=\"border: 1px solid lightgrey\">"+arrayLink[link]['RouterName']+"</th>");
			}
			i++;
		}
		
		
		i=0;
		var td="";
		for(link in arrayLink) {
			if(i!=0) {
				var j=0;
				var link2;
				for(link2 in arrayLink) {
					if(j!=arrayLinkNb-1) {
						if(link != link2) {
							if(i>j) {
								var signalValue = network_meshLb_getStrength(arrayLink, link, link2);
								td += "<td><p class='wifiquality wifisignal_"+signalValue+"' i18n='page.myNetwork.routing.meshlb.wifisignal."+signalValue+"'/></td>";
							} else {
								td += '<td style="background-color:#F2F2F2"/>';
							}
						} else {
							td += '<td style="background-color:#F2F2F2"/>';
						}
					}
					j++;
				}
				
				$("#meshLink tbody").append(
						'<tr>' +
							'<td class="title">' + arrayLink[link]['RouterName'] + '</td>' +
							td +
						'</tr>');
				
				td="";
			}
			i++;
		}
		
		
		//Creation vue graphique
		var box;
		if(arrayLinkNb == 2){
			$("#levelUp").css('display','none');
			$("#levelUpBlank").css('display','block');
			$("#levelDown").css('display','block');
			var place=2;
			for(box in arrayLink) {
				$("#place"+place+"").append("<div class=\"boxblock\"><div class=\"boximg\"></div><span class=\"boxname\">"+arrayLink[box]['RouterName']+"</span></div>");
				place++;
			}
			for(link in arrayLink) {
				var signalValue = network_meshLb_getStrength(arrayLink, link, 'GWC');

				if(link!='GWC'){
					$("#the2link3").append("<p class='wifiquality wifisignal_"+signalValue+"' i18n='page.myNetwork.routing.meshlb.wifisignal."+signalValue+"'/>");
				}
			}
		}else if(arrayLinkNb == 3){
			$("#levelUp").css('display','block');
			$("#levelDown").css('display','block');
			var place=1;
			var worstAPCSignal=0;
			var secondArrayLink = arrayLink;
			for(box in arrayLink) {
				$("#place"+place+"").append("<div class=\"boxblock\"><div class=\"boximg\"></div><span class=\"boxname\">"+arrayLink[box]['RouterName']+"</span></div>");
				if(box!='GWC'){
					$("#the1link"+place+"").append("<p class='wifiquality wifisignal_"+arrayLink[box]['Links']['GWC']+"' i18n='page.myNetwork.routing.meshlb.wifisignal."+arrayLink[box]['Links']['GWC']+"'/>");
					for(boxe2 in secondArrayLink){
						if(boxe2!='GWC'){
							if(arrayLink[box]['Links'][boxe2]!= undefined 
									&& (worstAPCSignal==0 || arrayLink[box]['Links'][boxe2] < worstAPCSignal) ){
								worstAPCSignal = arrayLink[box]['Links'][boxe2];
							}	
						}
					}
				}
				place++;
			}
			$("#the2link3").append("<p class='wifiquality wifisignal_"+worstAPCSignal+"' i18n='page.myNetwork.routing.meshlb.wifisignal."+worstAPCSignal+"'/>");
		}else{
			$("#radioVueContainer").hide();
		}
	},
	buildStructure:function(){
		$("#signalStructures").empty();
		var structure = "<div id=\"tableSignal\" widgetType=\"VisibleDependent\" widgetArg=\"{id : 'radioVue', value : 'TABLE'}\"><div class=\"table\"><table id=\"meshLink\"><thead><tr><th style=\"border:0 ;background:none\"></th></tr></thead><tbody></tbody></table></div></div><div widgetType=\"VisibleDependent\" widgetArg=\"{id : 'radioVue', value : 'GRAPHICAL'}\"><div id=\"graphSignal\"><div id=\"levelUpBlank\" style=\"display:none\"></div><div id=\"levelUp\" style=\"display:none\"><div id=\"place1\"></div><div id=\"the1link2\"></div><div id=\"the1link3\"></div></div><div id=\"levelDown\" style=\"display:none\"><div id=\"place2\"></div><div id=\"place3\"></div><div id=\"the2link3\"></div></div></div></div>";
		$("#signalStructures").append(structure);
		$("#signalStructures").orangeParse();
	}
	*/
};