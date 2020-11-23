jQuery.orange.config.areacontent.infoSystemTV = {
	preParse: function() {

		$("#routerlist").parent().remove();
		$("#MASTERBOX > div > span").removeClass('plus');
		$("#MASTERBOX > div > span").removeClass('moins');

		infoSystem_preParse();
	},
	postParse: function() {
		$("#help").bind("click",function() {
				helpPopup("html/main/help_infoSystem.html");
		});
		infoSystem_postParse("#infoSystemTV");
	}
};