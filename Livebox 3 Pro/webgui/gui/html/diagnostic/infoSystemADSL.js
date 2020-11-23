jQuery.orange.config.areacontent.infoSystemADSL = {
	preParse: function() {	
		$("#subtitleADSL").hide();
		$("#subtitleFTTH").hide();
		infoSystem_preParse();
	},
	postParse: function() {
		$("#help").bind("click",function() {
			helpPopup("html/main/help_infoSystem.html");
		});
		infoSystem_postParse("#infoSystemADSL");
	},
	postLoad: function() {
		$("#subtitleADSL").show();
		$("#subtitleFTTH").show();
	}
};
		
