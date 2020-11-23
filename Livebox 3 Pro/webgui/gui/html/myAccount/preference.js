jQuery.orange.config.areacontent.preference = {
	postLoad: function() {
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_preference.html");
		});
		
		$("#preference select").attr('i18n', 'page.myAccount.preferences.timeoutconfig.timeout').parent().orangeParse();
		
		currentsessiontimeout = $("#preference select")[0].dataValueRef;
		var val;
		$("#preference select option").each(function(){
			if($(this)[0].dataValue == currentsessiontimeout) {
				val = $(this).attr('value');
			}
		});
		$("#preference select").val(val);
		$("#preference select").trigger('valueChange');
	}
};
