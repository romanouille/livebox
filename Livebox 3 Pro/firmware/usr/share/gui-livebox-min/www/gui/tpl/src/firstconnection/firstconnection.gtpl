<!-- vim: set fileencoding=utf-8 : -->

<div class="frame">
  <div class="title" xmsg="GUI_FIRSTCONNECTION_TITLE_LABEL"/>
  <div class="content">
    <div class="radiotitle" id="content-type-inst"  xmsg="GUI_FIRSTCONNECTION_RADIO_TITLE_LABEL"/>
    <div id="radioFirstCon1" xpath=""></div>
    <span class="radioLabel1" xmsg="GUI_FIRSTCONNECTION_RADIO1_LABEL"></span><br>
    
    <div class="radioInfo1"  xmsg="GUI_FIRSTCONNECTION_RADIO_INFO1_LABEL"/>
    <div id="radioFirstCon2" xpath=""></div>
    <span class="radioLabel2" xmsg="GUI_FIRSTCONNECTION_RADIO2_LABEL"></span><br>
    
    <div class="radioInfo2"  xmsg="GUI_FIRSTCONNECTION_RADIO_INFO2_LABEL"/>
    <div id="buttonBar2">
      <div id="btnL">
         <div class="cancel" tabindex="0" xmsg="GUI_FIRSTCONNECTION_BUTTON_CANCEL_LABEL"/>
      </div>
      <div id="btnR">
         <div class="submit" tabindex="0" xmsg="GUI_FIRSTCONNECTION_BUTTON_SUBMIT_LABEL"/>
      </div>
    </div>
  </div>
  <div id="cardState" xpath="Device/Managers/SimCard/CardStatus"/>
</div>


<script type="text/javascript">
jQuery(function ($) {
        var gui = $.gui, target = gui.currentTarget,
			client = gui.guiObjset.defaults.client, 
			objset = $('.frame').guiObjset(),
			nextPage="",
			cardStatus = "";
	
	$('#cardState', target).guiItem({objset: objset, notify: true, readOnly: true}).bind('gui_value', function (ev, ui) {
        cardStatus = ui.value;
        
        // Cross control if radio2 is checked
        if ( radio2.guiRadio("checked") && cardStatus != 'LOCKED' )
        	submit.guiButton("option", "disabled", true);
		else
			submit.guiButton("option", "disabled", false);
		
      });
	var radio1 = $('#radioFirstCon1').guiRadio().click(function () {
          nextPage = "typeconnection/typeconnection.gtpl";
          cancel.guiButton("option", "disabled", false);
          submit.guiButton("option", "disabled", false);
        });
	var radio2 = $('#radioFirstCon2').guiRadio().click(function () {
          nextPage = "card/card.gtpl"
          cancel.guiButton("option", "disabled", false);
          
          // Get current value
          var request = client.newRequest();
		  request.getValue("Device/Managers/SimCard/CardStatus", function (value) {
				 cardStatus = value;
		  });
		  request.send({ synchronous: true }); 
          
          if(cardStatus != "LOCKED"){
          	submit.guiButton("option", "disabled", true);
          }
          else{
          	submit.guiButton("option", "disabled", false);
          }
        });
        //Button controls //
	var cancel = $('.cancel', target).guiButton({disabled: true}).click(function(){
	  radio1.guiRadio("checked", false);
	  radio2.guiRadio("checked", false);
	  cancel.guiButton("option", "disabled", true);
      submit.guiButton("option", "disabled", true);
	}).keydown(function (e){
          if (e.keyCode==13){
            cancel.click();
	  }
        }).hover(function(){
          this.focus();
        }).mouseout(function(){
          this.blur();
        });
	var submit = $('.submit', target).guiButton({disabled: true}).click(function(){
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
      objset.guiObjset('loadValues', {autoSubscribe: true});
    });
</script>
