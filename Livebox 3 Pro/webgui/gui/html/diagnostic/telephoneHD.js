jQuery.orange.config.areacontent.telephoneHD = {
	preParse: function() {
		$("#MASTERBOX > div > span").removeClass('plus');
		$("#MASTERBOX > div > span").removeClass('moins');
	},
	postParse: function() {
		$("#help").bind("click",function() {
			helpPopup("html/main/help_infoSystem.html");
		});
		infoSystem_postParse("#telephoneHD");
	}
};