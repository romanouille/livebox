<!-- vim: set fileencoding=utf-8 : -->

<div class="frame">
  <div class="title" xmsg="GUI_ERROR_TITLE_LABEL"/>
  <div class="content"  style="margin-top: 20px;">
    <div class="errorPage">
      <div id="error" style="margin-top: 20px;">
        <img id="iconErr"/>
        <div class="errorLabelTitle" xmsg="GUI_ERROR_WARN_LABEL"/>
        <div class="errorLabel" xmsg="GUI_ERROR_MESSAGE_LABEL"/>
      </div>
      <br>
      <div id="buttonBar" style="margin-top: 100px;">
        <div class="submit" tabindex="0" xmsg="GUI_FIRSTCONNECTION_BUTTON_SUBMIT_LABEL"/>
      </div>
    </div>
  </div>
</div>


<script type="text/javascript">
jQuery(function ($) {
        var gui = $.gui, target = gui.currentTarget;
	$("#iconErr").attr("src", "img/ico_alert.gif");
	//TO BE REMOVED
	var submit = $('.submit', target).guiButton().click(function(){
      gui.inactivePrevious = true;
	  gui.setPage('login/login.gtpl');
	}).keydown(function (e){
          if (e.keyCode==13){
            submit.click();
	  }
        }).hover(function(){
          this.focus();
        }).mouseout(function(){
          this.blur();
        });
    });
</script>
