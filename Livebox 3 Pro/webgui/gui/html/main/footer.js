jQuery.orange.config.areacontent.footer = {
		preParse: function() {
			try {
				fr.orange.livebox.gui.pages.engine.FooterPresenter.initWidget();
			} catch(err) {
			}
		},
		
		postLoad: function() {
			
			$("#sitemap").dialog({
				autoOpen: false,
				modal: true,
				width: "550px",
				minHeight: "110px",
				open: function() {
					$('.close').blur();
				}
			});
			
			$("#legalinfo").dialog({
				autoOpen: false,
				modal: true,
				width: "650px",
				open: function() {
					$('.close').blur();
				}
			});
	
			$("#contact").dialog({
				autoOpen: false,
				modal: true,
				width: "255px",
				minHeight: "110px",
				open: function() {
					$('.close').blur();
				}
			});
			
			$("#recommandations").dialog({
				autoOpen: false,
				modal: true,
				width: "450px",
				minHeight: "200px",
				open: function() {
					$('.close').blur();
				}
			});
			
			$("#recommandations>a.close").bind("click",function(){
				$("#recommandations").dialog('close');});
			
			$("#contact>a.close").bind("click",function(){
				$("#contact").dialog('close');});
			
			$("#legalinfo>a.close").bind("click",function(){
				$("#legalinfo").dialog('close');});
			
			$("#sitemap a").bind("click",function(){
				$("#sitemap").dialog('close');});
			
			if (window.location.protocol != "https:") {
				$("#menuserviceinternet").hide();
			}
			else{
				$("#menuserviceinternet").show();
			}
		},
		loadAdvancedMenu: function(menuid, substitutions,callback){
			openConfirmationPopup('popup.goExpert.title', 'popup.goExpert.text',
				function() {
					callback(menuid, substitutions);
				},
				function () {
					$('#sitemap').dialog('open');
				});
		}
};