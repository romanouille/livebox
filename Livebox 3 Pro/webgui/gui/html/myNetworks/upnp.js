jQuery.orange.config.areacontent.upnp = {
   postParse: function() {
       var UPNpEnable = "Device/NAT/UPNpEnable";
       jQuery.orange.config.api.crud.read(
           [UPNpEnable],
           function (result) {
               if(result[UPNpEnable].values[UPNpEnable] == false) {
                   var UPnP = "Device/NAT/PortMappings/PortMapping[Creator='UPNP']";
                   //jQuery.orange.config.api.crud.del([UPnP]);
               }
           });

       $('#ckUPnP').bind("change", function(event, newValue) {
           if (newValue) {
               $("#refreshBtn").removeClass("disabled");
               $("#refreshBtn").setDisabled(false);
           } else if(newValue!=undefined) {
               $("#refreshBtn").addClass("disabled");
               $("#refreshBtn").setDisabled(true);
           }
       });
       
       $("#refreshBtn").bind('click',function(){
    	    	$("#content").orangeLoad(menu.mapping.upnp);
		});
       
       var table = $("#upnpTable")[0];
       table.addRow = upnp_tableAddRow;
       
       function upnp_tableAddRow (id, attrs) {
    	   var tr = jQuery.orange.widget.Table.addRow.call(this, id, attrs);
    	   $(tr).attr("noAutoRefresh", "true");
    	   $("td:eq(5)", tr).attr("i18n", "page.myNetwork.upnp.applist.col.delete"); 
    	   $("td:eq(5)", tr).orangeTranslate();
    	   return tr;
       }
       
	   	$("#help").bind("click",function() {
			helpPopup("html/main/help_upnp.html");
		});
   }
};
