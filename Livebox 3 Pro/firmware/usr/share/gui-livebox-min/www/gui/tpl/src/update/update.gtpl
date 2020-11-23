<!-- vim: set fileencoding=utf-8 : -->

<div class="frame">
  <div class="title" xmsg="GUI_UPDATE_TITLE_LABEL"/>
  <div class="content">
    <div class="tableForm">
      <div class="titleInfo1" xmsg="GUI_UPDATE_TITLE_INFO1_LABEL"/>
      <div class="titleInfo2" xmsg="GUI_UPDATE_TITLE_INFO2_LABEL"/>
      <div class="warn" xmsg="GUI_UPDATE_WARN_LABEL"/>
      <div class="updateInfo" xmsg="GUI_UPDATE_INFO_LABEL"/>
<div class="updateInfo" xmsg="GUI_UPDATE_UNPLUG_LABEL"/>
      <div id="waitBox">
        <div id="waitMsg">
          <div class="warnWait" xmsg="GUI_UPDATE_PROGRESSBAR_TITLE_LABEL"/>
        </div>
        <br>
        <img id="waiting"/>
      </div>
    	<div class="problemInfo" xmsg="GUI_UPDATE_PROBLEM_INFO_LABEL"/>
    </div>
    <div id="RPC" xpath="Device"/>
  </div>  
</div>


<script type="text/javascript">
jQuery(function ($) {
    var gui = $.gui, target = gui.currentTarget;
    var objset = $('.content', target).guiObjset();
	$("#progressBarIcon").attr("src", "img/ico_notification.gif");
	$("#waiting").attr("src", "img/wait.gif");
	$("#waitBox").hide();
    var rpc = $("#RPC").guiItem({rpc: true});
    gui.download = function ( ) {
      var input = new gui.api.Capability({FileType: "WEBCONTENT"});
      rpc.guiItem("FirmwareUpgradeInterface1.0_requestDownload", input, function (params) {
        $("#waitBox").show();
          gui.guiObjset.defaults.client.closeSession();
          var t = setTimeout("$.gui.refreshPage()",10000);
        }, function (err) {
          alert("Error rpc : " + err.description);
        });
    }
    objset.guiObjset('loadValues', function () {
	  gui.download();
	  }, {autoSubscribe: false});
  });
</script>
