function infoSystem_preParse() {
	
	$("#routerlist").attr('i18n', 'page.myEquipments.userEquipment.filtre.lb').parent().orangeParse();
	$("#routerlist").bind("change", function(event, newValue) {
		if (newValue) {
			if (newValue == 'ALL') {
				$(".sysinfo").css('height', 'auto');
				$(".sysinfo").css('overflow', 'visible');
				$(".sysinfo").parent().children('div').children('span').removeClass('plus');
				$(".sysinfo").parent().children('div').children('span').addClass('moins');
			} else {
				$(".sysinfo").css('height', '0');
				$(".sysinfo").css('overflow', 'hidden');
				$(".sysinfo").parent().children('div').children('span').removeClass('moins');
				$(".sysinfo").parent().children('div').children('span').addClass('plus');

				if (newValue != "MASTERBOX") {
					newValue = "id" + newValue;
				}
				$("#"+newValue+" > div > span").removeClass('plus');
				$("#"+newValue+" > div > span").addClass('moins');
				$("#"+newValue+" > .sysinfo").css('height', 'auto');
				$("#"+newValue+" > .sysinfo").css('overflow', 'visible');
			}
		}
	});
}

function infoSystem_postParse(element) {
	
	var MeshEnable = "Device/MESH/Enable";
	jQuery.orange.config.api.crud.read(
			[MeshEnable],
			function (result) {
				MeshEnable = result[MeshEnable].values[MeshEnable];
			});
	
	if(MeshEnable != true){
		$("#routerlist").parent().remove();
		$("#MASTERBOX > div > span").removeClass('plus');
		$("#MASTERBOX > div > span").addClass('moins');
	}else{
		var APDevice = "Device/MESH/AccessPoints/AccessPoint[Alias!='GWC']";
		jQuery.orange.config.api.crud.read(
			[APDevice],
			function (result) {
				var RouterName = "Device/DeviceInfo/RouterName";
				jQuery.orange.config.api.crud.read(
						[RouterName],
						function (result) {
							$("#routerlist select").append('<option value="MASTERBOX">'+result[RouterName].values[RouterName]+'</option>');
						});
				if (result[APDevice].nb > 0) {
					for (var box in result[APDevice].values) {
						var uid = result[APDevice].values[box]["uid"];
						var RouterName = "Device/MESH/AccessPoints/AccessPoint[@uid='"+uid+"']/DeviceInfo/RouterName";
						jQuery.orange.config.api.crud.read(
								[RouterName],
								function (result) {
									$("#routerlist select").append('<option value="'+uid+'">'+result[RouterName].values[RouterName]+'</option>');
								});
						$("#id"+uid+" > .sysinfo").css('height', '0');
						$("#id"+uid+" > .sysinfo").css('overflow', 'hidden');
					}
					$("#routerlist select").append('<option value="ALL" i18n="livebox.ALL"/>');
				}
			});
	}
	$(element).orangeRead();
	$(element).orangeParse();
	$(element).orangeTranslate();
	
	//afficher le tootip 
	$(".moins").each(function() { //div>span>span
		var tip = jQuery.orange.config.i18n.map["page.diagnostic.infosystem.section.tip"];
		tip = tip.replace("<Section>", $("h1>span:eq(1)").html());
		tip = tip.replace("<RouterName>", $(this).text());
		$(this).attr('title', tip);
		});
	
	$(".plus").each(function() { //div>span>span
		var tip = jQuery.orange.config.i18n.map["page.diagnostic.infosystem.section.tip"];
		tip = tip.replace("<Section>", $("h1>span:eq(1)").html());
		tip = tip.replace("<RouterName>", $(this).text());
		$(this).attr('title', tip);
		});
	
	$("div>span").each(function() {				
		$(this).bind("click", function() {
			if( $(this).attr('class') == "plus" ) {
				$(this).parent().parent().children('.sysinfo').css('height', 'auto');
				$(this).parent().parent().children('.sysinfo').css('overflow', 'visible');
				$(this).removeClass('plus');
				$(this).addClass('moins');
			}
			else if( $(this).attr('class') == "moins" ) {
				$(this).parent().parent().children('.sysinfo').css('height', '0');
				$(this).parent().parent().children('.sysinfo').css('overflow', 'hidden');
				$(this).removeClass('moins');
				$(this).addClass('plus');
			}
		});
	});
	
	// Mettre label à droite
  /*  $(".forminput-label").each(function() {
            collectedMargin = this.style.marginLeft;
            this.style.marginRight = collectedMargin;
            this.style.marginLeft = "0px";
          //  this.style.fontWeight = "bold";
    });*/
	
}

jQuery.orange.config.areacontent.infoSystem = {
	preParse: function() {
	
		var MeshEnable = "Device/MESH/Enable";
		jQuery.orange.config.api.crud.read(
				[MeshEnable],
				function (result) {
					MeshEnable = result[MeshEnable].values[MeshEnable];
				});
		
		if(MeshEnable != true){
			$("#routerlist").parent().remove();
			$("#MASTERBOX > div > span").removeClass('plus');
			$("#MASTERBOX > div > span").removeClass('moins');
		}else{
			var nbAPDevice;
			var APDevice = "Device/MESH/AccessPoints/AccessPoint[Alias!='GWC']";
			jQuery.orange.config.api.crud.read(
				[APDevice],
				function (result) {
					if (result[APDevice] == undefined) {
						$("#routerlist").parent().remove();
						$("#MASTERBOX > div > span").removeClass('plus');
						$("#MASTERBOX > div > span").removeClass('moins');
					}
					else {					
						nbAPDevice = result[APDevice].nb;
						if (result[APDevice].nb == 0) {
							$("#routerlist").parent().remove();
							$("#MASTERBOX > div > span").removeClass('plus');
							$("#MASTERBOX > div > span").removeClass('moins');
						}
						else if (result[APDevice].nb > 0) {
							var box;
							for (box in result[APDevice].values) {
								var uid = result[APDevice].values[box]["uid"];
								$(".maindiv > form").append('<div id="id'+uid+'"/>');
								$("#id"+uid).append('<div class="headBoxType1 margin-top-10"><span class="plus" ><span class="h3Text margin-left-30" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/DeviceInfo/RouterName"/></span></div>');
								var content = "";
								content += '<div class="sysinfo">';
								content += 	'<div class="boxType4 border-bottom-3">';
								content += 		'<div class="h2Text orange" i18n="page.diagnostic.infosystem.general"/>';
								content += 		'<div class="clear"/>';
								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.general.1.1">';
								content += '<span class="bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/DeviceInfo/Manufacturer"/>';
								content += '</div>';
								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.general.1.2">';
								content += '<span class="bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/DeviceInfo/ModelName"/>';
								content += '</div>';
								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.general.1.3">';
								content += '<span class="bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/DeviceInfo/Country" i18nPrefix="data.diagnostic.infosystem.country"/>';
								content += '</div>';
								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.general.1.4">';
								content += '<span class="bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/DeviceInfo/OSVersion"/>';
								content += '</div>';
								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.general.1.5">';
								content += '<span class="bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/DeviceInfo/GUIVersion"/>';
								content += '</div>';
								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.general.mesh.1.10">';
								content += '<span class="bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/IPAddress"/>';
								content += '</div>';
		
								content += 	'</div>';
								content += '</div>';
								$("#id"+uid).append(content);
							}
						}
					}
				});
		}
		infoSystem_preParse();
	},
	postParse: function() {
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_infoSystem.html");
		});
		
		infoSystem_postParse("#infoSystem");
	}
};