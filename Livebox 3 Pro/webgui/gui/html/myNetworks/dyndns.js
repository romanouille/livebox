function dyndns_tableAddRow(id, attrs) {
	// this = widget node
	var tr;
	
	if (attrs != undefined && attrs.uid != undefined) {
		currentId = $("#dyndnsTable").attr("dataid") + "[@uid='"+attrs.uid+"']"; 
		tr = jQuery.orange.widget.Table.addRow.call(this, currentId, attrs);
	}
	else if (id != undefined) {
		currentId = $("#dyndnsTable").attr("dataid") + "[@uid='"+id+"']"; 
		tr = jQuery.orange.widget.Table.addRow.call(this, currentId, attrs);
	}else{
	tr = jQuery.orange.widget.Table.addRow.call(this, id, attrs);
	}

	if(attrs != undefined
			&& (attrs.Status != "ENABLED" || attrs.LastError != "NOERROR") ){
		$("td:eq(4)", tr).empty();
		$("td:eq(4)", tr).append('<span class="error" i18n="page.myNetwork.dyndns.error" i18nPrefix="page.myNetwork.dyndns.error">' + attrs.LastError + '</span>');
		$("td:eq(4)", tr).orangeParse();
		$("td:eq(4)", tr).orangeTranslate();
	}else if(attrs == undefined){
		$("td:eq(4)", tr).empty();
	}
	return tr;
}

jQuery.orange.config.areacontent.dyndns = {
	preParse: function(){
		$("#dyndnsTable").hide();
		$("#dyndnsTable")[0].addRow = dyndns_tableAddRow;
	},
	postParse: function() {
		$("#dyndnsTable").hide();
		
		$("#dyndnsTable .table-add-button").append("<span id=\"btnAdd\"  widgetType=\"ButtonImage\"  i18n=\"page.myNetwork.dyndns.add\"/>");//.attr('i18n', 'page.myNetwork.dyndns.add');//.parent().orangeParse();
		  $("#dyndnsTable .table-add-button").orangeParse();
		  $("#dyndnsTable .table-add-button").orangeTranslate();
		
		$("#dyndnsTable .table-add-container").append("<span id=\"btnRefresh\"  widgetType=\"ButtonImage\"  i18n=\"common.refreshtip\"/>");//widgetArg=\"{type:'simple'}\"
		  $("#dyndnsTable .table-add-container").orangeParse();
		  $("#dyndnsTable .table-add-container").orangeTranslate();
	},
	postLoad: function() {
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_dyndns.html");
		});
		
		$("img[i18n='table.button.add']").parent().remove();
		
		$("#dyndnsTableErr").insertAfter($("#dyndnsTable table"));
		$("#btnRefresh").bind('click',function(){
			$("#content").orangeLoad(menu.mapping.dyndns);
		});
		$("#dyndnsTable").show();
	}
};