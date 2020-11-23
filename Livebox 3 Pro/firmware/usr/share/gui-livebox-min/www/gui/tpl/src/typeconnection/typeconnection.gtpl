<!-- vim: set fileencoding=utf-8 : -->

<div id="typeconnectionframe" class="frame">
<img id="imgStep"/>
  <div class="title" xmsg="GUI_FIRSTCONNECTION_TITLE_LABEL"/>
  <div class="titleStep" xmsg="GUI_TYPECONNECTION_STEP1_LABEL"/>
  
  <div class="content">
    <div id="pageInfo">
      <div>
      	<img id="puce1"/>
      	<div class="typeInfo1" xmsg="GUI_FIRSTCONNECTION_RADIO_INFO1_LABEL"/>
      </div>
      <div>
      	<img id="puce2"/>
       	<div class="typeInfo2" xmsg="GUI_TYPECONNECTION_INFO_LABEL"/>
      </div>
    </div>
    <div class="radioLine">
      <div id="AdslType">
        <img id="iconAdsl"/>
        <span class="radioTypeLabel1" xmsg="GUI_TYPECONNECTION_RADIO1_LABEL"></span>
        <div id="radioTypeCon1" xpath="Device/Managers/NetworkData/InterfaceType" radioValue="ADSL"></div>
      </div>
      <div id="FiberType">
        <img id="iconFiber"/>
        <span class="radioTypeLabel2" xmsg="GUI_TYPECONNECTION_RADIO2_LABEL"></span>
        <div id="radioTypeCon2" connected="false" radioValue="FTTH"></div>
      </div>
    </div>
    <br>
    <div id="waitBox">
      <div id="waitMsg">
        <div class="warnWait" xmsg="GUI_TYPECONNECTION_WARN_LABEL"/>
      </div>
    </div>
    <div id="buttonBar2">
      <div id="btnL">
         <div class="cancel" tabindex="0" xmsg="GUI_FIRSTCONNECTION_BUTTON_CANCEL_LABEL"/>
      </div>
      <div id="btnR">
         <div class="submit" tabindex="0" xmsg="GUI_FIRSTCONNECTION_BUTTON_SUBMIT_LABEL"/>
      </div>
    </div>
  </div> 
  
  <div id="RPC" xpath="Device"/> 
</div>


<script type="text/javascript">
jQuery(function ($) {
        var gui = $.gui, target = gui.currentTarget;
        var objset = $('#typeconnectionframe', target).guiObjset();
	var rpc = $("#RPC").guiItem({rpc: true});
        $("#imgStep").attr("src", "img/etape1sur2.gif");
        $("#iconInfo").attr("src", "img/ico_information.gif");
        $("#puce1, #puce2").attr("src", "img/square.png");
        $("#waitBox").hide();
        $("#puce1").hide();
        $(".typeInfo1").hide();
        $("#iconAdsl").attr("src", "img/adsl.png");
        $("#iconFiber").attr("src", "img/fibre.png");

	var nextPage="login/login.gtpl";

	var cancel = $('.cancel', target).guiButton({disabled: true}).click(function(){
	  cancel.guiButton("option", "disabled", true);
	  objset.guiObjset('resetValues');
	  $("#waitBox").hide();
	  $("#puce1").hide();
      $(".typeInfo1").hide();
	  nextPage = "login/login.gtpl";
	}).keydown(function (e){
          if (e.keyCode==13){
            cancel.click();
	  }
        }).hover(function(){
          this.focus();
        }).mouseout(function(){
          this.blur();
        });
	var radioGroup = $('#radioTypeCon1, #radioTypeCon2');
	radioGroup.guiRadio({objset: objset, enumMode: true, group: radioGroup}).change(function(){
	  if($("#radioTypeCon1").guiRadio("value") !== gui.InterfaceType){
	    $("#waitBox").show();
	    $("#puce1").show();
        $(".typeInfo1").show();
	    cancel.guiButton("option", "disabled", false);
	    nextPage = "reboot/reboot.gtpl";
	  }
	  else{
	    $("#waitBox").hide();
	    $("#puce1").hide();
        $(".typeInfo1").hide();
	    nextPage = "login/login.gtpl";
	  }
	});
	var submit = $('.submit', target).guiButton().click(function(){
	   gui.InterfaceType = $("#radioTypeCon1").guiRadio("value");
	   objset.guiObjset('postValues');
      	   gui.setPage(nextPage);
	}).keydown(function (e){
          if (e.keyCode==13){
            submit.click();
	  }
        }).hover(function(){
          this.focus();
        }).mouseout(function(){
          this.blur();
        }); 
	objset.guiObjset('loadValues', {autoSubscribe: false});
    });
</script>
