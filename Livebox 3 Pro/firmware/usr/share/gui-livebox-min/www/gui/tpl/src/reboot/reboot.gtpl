<!-- vim: set fileencoding=utf-8 : -->

<div id="rebootFrame" class="frame">
  <div class="title" xmsg="GUI_FIRSTCONNECTION_TITLE_LABEL"/>
  <div class="titleStep" xmsg="GUI_TYPECONNECTION_STEP1_LABEL"/>
  <img id="imgStep"/>
  <div class="content">
  <br>
  <br>
    <div id="waitBox">
      <div id="waitMsg">
        <div class="warnWait" xmsg="GUI_REBOOT_LABEL"/>
      </div>
      <br>
      <img id="waiting"/>
    </div>
  </div>
  <div id="RPC" xpath="Device"/>
</div> 


<script type="text/javascript">
jQuery(function ($) {
        var gui = $.gui, target = gui.currentTarget;
        var objset = $('#rebootFrame', target).guiObjset();
        var nextPage = "login/login.gtpl";
        var rpc = $("#RPC").guiItem({rpc: true});
        gui.inactivePrevious = true;  
        $("#imgStep").attr("src", "img/etape1sur2.gif");
        $("#waiting").attr("src", "img/wait.gif");
        $("#waitBox").hide();
        var i = 0;
        gui.tryConnect = function(){
          i++;
          if(i <= gui.maxConnectionTry){ //we want to control how many times it retryes
            gui.guiObjset.defaults.client.openSession('admin', 'admin', function (reply) {
            gui.setPage(nextPage);
            }, 
            function (error) {
              alert('error authenticate : ' + error);
            }, {
               ajaxTimeout: 5,
               ajaxErrorFunc: function(error) {
                 gui.tryConnect(); 
          }
            });
          }
          else{ //before it gets an error page
            nextPage = "error/error.gtpl";
            gui.setPage(nextPage);
          }
          }

        var reboot = function(){
          rpc.guiItem("InitInterface1.0_reboot",  function (params) {
            $("#waitBox").show();
            gui.guiObjset.defaults.client.closeSession();
            var t = setTimeout("$.gui.tryConnect()",10000);
          }, function (err) {
            alert("Error rpc : " + err.description);
        });
        }
        
        objset.guiObjset('loadValues', function () {
	  reboot();
	  }, {autoSubscribe: false});

    });
</script>
