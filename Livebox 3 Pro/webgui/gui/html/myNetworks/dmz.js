function resetDeviceList(){
	$(".unselectable").show();
	$("#DeviceList").val('unselected');
	$("#DeviceList").css("font-style","italic");
}

jQuery.orange.config.areacontent.dmz = {
	goDisable: function(disable){
		//disable=true signifie "go for disabled"
		$("#btnDelete").setDisabled(disable);
		if(disable){
			$("#btnDelete").attr("i18n","page.myNetwork.dmz.delete.undeletable");
			$("#btnDelete").orangeTranslate();
		}else{
			$("#btnDelete").attr("i18n","page.myNetwork.dmz.delete");
			$("#btnDelete").orangeTranslate();
		}
	},
	preParse: function() {
		$("#DMZIP").hide();
		$("#DeviceList").append('<option style="font-style:italic;" class="unselectable" value="" i18n="page.myNetwork.dmz.device"/>');
	},
	postParse: function() {
		var EthernetDevice = "Device/Networks/LAN[@name='LAN']/ConnectedDevices/EthernetDevice";
		jQuery.orange.config.api.crud.read(
			[EthernetDevice],
			function (result) {
				if (result[EthernetDevice] != undefined) { 
					for (var device in result[EthernetDevice].values) {
						if(result[EthernetDevice].values[device]["IPAddress"] != ""){
							$("#DeviceList").append('<option style="font-style: normal;" value="'+result[EthernetDevice].values[device]["IPAddress"]+'">'+result[EthernetDevice].values[device]["UserFriendlyName"]+'</option>');
						} 
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
						if(result[WiFiDevice].values[device]["IPAddress"] != "")
								$("#DeviceList").append('<option style="font-style: normal;" value="'+result[WiFiDevice].values[device]["IPAddress"]+'">'+result[WiFiDevice].values[device]["UserFriendlyName"]+'</option>');
					}
				}
			}
		);
		$("#DeviceList").append('<option value="null" disabled="disabled"/>');
		$("#DeviceList").append('<option style="font-style: italic;" value="STATIC" i18n="page.myNetwork.dmz.static"/>');
		$("#DeviceList").parent().orangeParse();

		$("#DeviceList").bind("change", function(event, newValue) {
			$("#DMZIP").removeClass("supErrorInput");
			$("#existantiperror").hide();
			var jNode = $("#DMZIP_vis");
			if (event.currentTarget.value == "STATIC") {
				jNode.setDisabled(false);
				$("#DMZIP").val("");
				$("#DMZIP").show();
				$("#DMZIP_vis").hide();
				$("#DeviceList").css("font-style","italic");
			} else {
				$("#DeviceList").css("font-style","normal");
				jNode.setDisabled(true);
				$("#DMZIP").hide();
				$("#DMZIP_vis").show();
				if(event.currentTarget.value != "null"){
					if(event.currentTarget.value == ""){
						$("#DMZIP").val("");
						$("#DeviceList").css("font-style","italic");
						resetDeviceList();
					}else{
						$("#DMZIP").val(event.currentTarget.value);
					}
				}else{
					$("#DMZIP").val("");
					$("#DeviceList").css("font-style","italic");
					resetDeviceList();
				}
			}
			$("#DMZIP").trigger("valueChange");
		});

		$("#DeviceList").attr('i18n', 'page.myNetwork.dmz.device').parent().orangeParse();
		
		$("#dmz form")[0].onReset = function() {
			$("#DMZIP").removeClass("supErrorInput");
			$("#existantiperror").hide();
			
			jQuery.orange.config.areacontent.dmz.postLoad();
			
			var form = $("#dmz form")[0];
			var dmzNode = $("#DMZIP");
			
			var oldState = jQuery.orange.widget.Form.getState.call(form);
			form.dataKO.splice( arrayIndexOf2(form.dataKO, dmzNode), 1 );

			var newState = jQuery.orange.widget.Form.getState.call(form);
			if (newState != oldState)
				jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
		};
		
		$("#dmz form")[0].crudCallDelegate = function(crudExec) {
			crudExec();
			$("#DMZIP").removeClass("supErrorInput");
			$("#existantiperror").hide();
			if( $("#DMZIP")[0].getDataValue() != "" ) {
				jQuery.orange.config.areacontent.dmz.goDisable(false);
			}
			else {
				jQuery.orange.config.areacontent.dmz.goDisable(true);
			}
		};
		
		$("#btnDelete").bind('click', function() {
			$("#DMZIP").removeClass("supErrorInput");
			$("#existantiperror").hide();
			if(this.getAttribute('disabled') != "disabled"){
				openConfirmationPopup('popup.confirm.title', 'popup.confirm.text',
					function() {
						resetDeviceList();
						$("#DeviceList").trigger('change');
						jQuery.orange.config.areacontent.dmz.goDisable(true);
				});
			}
		});
	},
	postLoad: function() {
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_dmz.html");
		});
		
		var notAllowedIP = new Array();
		var IPRouters = "Device/Networks/LAN[@name='LAN']/IPRouters";
		jQuery.orange.config.api.crud.read(
				[IPRouters],
				function (result) {
					for(var Xiprouter in result[IPRouters].values){
						notAllowedIP.push(result[IPRouters].values[Xiprouter]);
					}
				});
			
		var MeshEnable = "Device/MESH/Enable";
		jQuery.orange.config.api.crud.read(
				[MeshEnable],
				function (result) {
					MeshEnable = result[MeshEnable].values[MeshEnable];
				});
		
		if(MeshEnable == true){
			var APDevice = "Device/MESH/AccessPoints/AccessPoint";
			jQuery.orange.config.api.crud.read(
				[APDevice],
				function (result) {
					if (result[APDevice].nb > 0) {
						for (var box in result[APDevice].values) {
							notAllowedIP.push(result[APDevice].values[box]["IPAddress"]);
						}
					}
				});
		}
		
		var jNode = $("#DMZIP_vis");
		var value = $("#DMZIP")[0].dataValueRef;
		var options = $("#DeviceList")[0].options;
		if (value != "") {
			for (var i=0; i<options.length; i++) {
				if(options[i].value == value) {
					jNode.setDisabled(true);
					$("#DMZIP").hide();
					$("#DMZIP_vis").show();
					$("#DeviceList").val(value);
					break;
				} else {
					$("#DeviceList").val("STATIC");
					$("#DMZIP").val(value);
					jNode.setDisabled(false);
					$("#DMZIP").show();
					$("#DMZIP_vis").hide();
				}
			}
		} else {
			resetDeviceList();
			$("#DMZIP").val("");
			jNode.setDisabled(true);
			$("#DMZIP").hide();
			$("#DMZIP_vis").show();
		}
		
		$("#DMZIP").trigger("valueChange");		
		$("#DMZIP").bind('valueChange', function(event) {
			$("#DMZIP").removeClass("supErrorInput");
			$("#DMZIP_vis").val(event.target.value);
		});
		$("#DMZIP_vis").val($("#DMZIP").val());
		
		if($("#DMZIP").val() == "" ) {
			jQuery.orange.config.areacontent.dmz.goDisable(true);
		}
		else {
			jQuery.orange.config.areacontent.dmz.goDisable(false);
		}
		
		$("#DMZIP").bind('change keyup', function(event) {
			
			var form = $("#dmz form")[0];
			var dmzNode = $("#DMZIP");
			
			var oldState = jQuery.orange.widget.Form.getState.call(form);
			
			if( arrayIndexOf(notAllowedIP, event.target.value) != -1 ) {
				if( arrayIndexOf2(form.dataKO, dmzNode) == -1 ){
					$("#existantiperror").show();
					$("#DMZIP").addClass("supErrorInput");
					form.dataKO.push(dmzNode);
				}else {
					$("#existantiperror").hide();
				}
			} else {
				dmzNode.removeClass("supErrorInput");
				form.dataKO.splice( arrayIndexOf2(form.dataKO, $("#DMZIP")), 1 );
				$("#existantiperror").hide();
			}
			
			var newState = jQuery.orange.widget.Form.getState.call(form);
			if (newState != oldState)
				jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
		});
		
		$("select#DeviceList").bind('click',function(){
			$(".unselectable").hide();
		});
		
		if($("#DeviceList").val() != "STATIC"
			&& $("#DeviceList").val() != ""){
			$("#DeviceList").css("font-style","normal");
		}
	}
};