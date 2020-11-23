function popups_crudCallback(result) {
	$("#saved_popup").dialog('open');
	setTimeout("$('#saved_popup').dialog('close')", 1000);
}

jQuery.orange.config.areacontent.popups = {
	postLoad: function() {
		$("#cm_abs").dialog({
			autoOpen: false,
			modal: true,
			width: "310px",
			minHeight: "110px"});
		$("#cm_abs #cm_abs_btnOk").bind("click",function(){
			$("#cm_abs").dialog('close');});		
		
		$("#cm_removed").dialog({
			autoOpen: false,
			modal: true,
			width: "310px",
			minHeight: "110px"});
		$("#cm_removed #cm_removed_btnOk").bind("click",function(){
			$("#cm_removed").dialog('close');});
		
		$("#saved_popup").dialog({
			autoOpen: false,
			modal: false,
			width: "350px",
			minHeight: "110px"});

		$("#confirmation_popup").dialog({
			autoOpen: false,
			modal: true,
			width: "405px",
			minHeight: "225px",
			open: function() {
				$('#no img').blur();
			}
		});
		
		$("#error_popup").dialog({
			autoOpen: false,
			modal: true,
			width: "405px",
			minHeight: "225px",
			open: function() {
				//$('#ok input').blur();
				$('#ok img').blur();
			}
		});
		
	}
};