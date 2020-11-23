jQuery.orange.config.areacontent.servicesMeshLb ={
	postLoad: function() {
		$("#help").bind("click",function() {
			helpPopup("html/main/help_serviceMeshLb.html");
		});
	}
};