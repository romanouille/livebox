function installation_clickOnThisLink() {
	jQuery.orange.config.api.authorization.login("guest", "guest");
	installation_toggleDisplay(true);
	jQuery.orange.widget.MenuItem.setCurrent('m0');
}

installation_toggleDisplay = function(showHeader){
	if(showHeader) {
		$("#header_container").show();
		$("#mainMenu").show();
		//$("#footer_container").show();
	}else {
		$("#header_container").hide();
		$("#mainMenu").hide();
		//$("#footer_container").hide();
	}	
	jQuery.orange.init.i18n.load();
};

customizeInstallForm = function(){
	$(".forminput-label").each(function() {
		this.style.fontWeight = "bold";
	});
};