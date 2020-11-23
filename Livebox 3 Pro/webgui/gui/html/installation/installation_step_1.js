jQuery.orange.config.areacontent.installation_step_1 = {
	postParse: function(area) {
		$("#container").removeData('detectedStatus');
	},
	postLoad: function() {
		
		var dsl = $("#dslenable")[0].getDataValue();
		var ftth = $("#ftthenable")[0].getDataValue(); 
		if(dsl=="ENABLE"){
			$("input.conntype[value=ADSL]").attr('checked',true);
		}else{
			$("input.conntype[value=FTTH]").attr('checked',true);
		}
		
		$(".conntype").bind('change',function(event){
			if(event.target.value=="ADSL"){
				$("#dslenable")[0].setDataValue("ENABLE");
				$("#ftthenable")[0].setDataValue("DISABLE");
				if($("#dslenable")[0].getDataValue() == $("#dslenable")[0].dataValueRef){
					$("#selectChangeWarning").css('display','none');
				}else{
					$("#selectChangeWarning").css('display','block');
				}
			}else if (event.target.value=="FTTH"){
				$("#dslenable")[0].setDataValue("DISABLE");
				$("#ftthenable")[0].setDataValue("ENABLE");
				if($("#ftthenable")[0].getDataValue() == $("#ftthenable")[0].dataValueRef){
					$("#selectChangeWarning").css('display','none');
				}else{
					$("#selectChangeWarning").css('display','block');
				}
			}
		});

		$("#jump2installation").bind('click',function(){
			jQuery.orange.config.api.authorization.login("guest", "guest");
			$("#global").orangeLoad(menu.mapping.installation);
		});
		
		$("#jump2installation_step_2").bind('click',function(){
			
			// sauvegarde des valeurs selectionnees avant etape suivante
			var adslEnable = "Device/Networks/WAN[@name='WAN']/WANPorts/DSL/Enable";
			var id2value = {};
			id2value[adslEnable] = $("#dslenable2")[0].getDataValue();
			if ((id2value[adslEnable] == "ENABLE" && !$("#connOptions").children()[0].children.item(1).checked)
				|| (id2value[adslEnable] == "DISABLE" && $("#connOptions").children()[0].children.item(1).checked)){
				if ($("#connOptions").children()[0].children.item(1).checked){
					id2value[adslEnable] = "ENABLE";
				}
				else {
					id2value[adslEnable] = "DISABLE";
				}
			}
			
			
			var ftthEnable = "Device/Networks/WAN[@name='WAN']/WANPorts/FTTH/Enable";
			id2value[ftthEnable] = $("#ftthenable2")[0].getDataValue();
			
			if ((id2value[ftthEnable] == "ENABLE" && !$("#connOptions").children()[1].children.item(1).checked)
					|| (id2value[ftthEnable] == "DISABLE" && $("#connOptions").children()[1].children.item(1).checked)){
				if ($("#connOptions").children()[1].children.item(1).checked){
					id2value[ftthEnable] = "ENABLE";
				}
				else {
					id2value[ftthEnable] = "DISABLE";
				}
				jQuery.orange.config.api.crud.update(id2value);
			}
			
			
			if( $("#selectChangeWarning").css('display') == 'block' ){
				//cas ou besoin de rebooter
				$("#global").orangeLoad(menu.mapping.simplereboot_oninstall);
			}else{
				$("#global").orangeLoad(menu.mapping.installation_step_2);
			}
		});
	}
};