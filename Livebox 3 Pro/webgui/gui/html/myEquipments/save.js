jQuery.orange.config.areacontent.save = {
	postParse: function(area) {
//		$("#savename").attr("style","width:400px");
		$("#help").bind("click",function() {
			helpPopup("html/main/help_save.html");
		});
		
		$("#btnSave").setDisabled(true);
		$("#savename").bind('change keyup', function(event) {
			if(event.target.value == "") {
				$("#btnSave").setDisabled(true);
			}
			else {
				$("#btnSave").setDisabled(false);
			}
		});

		$("#savename").bind('change keyup', function(){
			var alphaNum = new RegExp("^[A-Za-z0-9]+$","g");
			var savename = $("#savename")[0].getDataValue();
			
			if (savename.length > 0 && !(alphaNum.test(savename))){
				$('#newSaveError').show();
				$("#savename").addClass("errorInput");
				return ;
			};
			if (savename.length > 32){
				$('#newSaveErrorLength').show();
				$("#savename").addClass("errorInput");
				return ;
			};
			$('#newSaveError').hide();
			$('#newSaveErrorLength').hide();
			$("#savename").removeClass("errorInput");
		});
		
		$("#btnSave").bind('click', function() {
			
			var alphaNum = new RegExp("^[A-Za-z0-9]+$","g");
			var savename = $("#savename")[0].getDataValue();
			
			if ( !(alphaNum.test(savename))){
				$('#newSaveError').show();
				return ;
			};
			if (savename.length > 32){
				$('#newSaveErrorLength').show();
				return ;
			};
			
			var customfilename = "livebox.bin";
			if(savename != "" || savename != undefined 	|| savename != null){
				customfilename = $("#savename")[0].getDataValue() +".bin";
			}
			var req = jQuery.orange.config.api.client.newRequest();
            req.downloadFile("Device/DeviceInfo/VendorConfigFile",
            	customfilename,
            	null,
            	function () {
            		//alert("Erreur lors de la sauvegarde");
            		alert("Le processus de sauvegarde a échoué");
            	});
            req.send();
		});
	}
};