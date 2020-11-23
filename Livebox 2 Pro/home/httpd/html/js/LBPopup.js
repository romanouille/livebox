
var popupDisplayed = false;

var lesSelect = null;

var lesIframes = null;



var headCornerWidth = 20;

var footCornerWidth = 20;

var defImg = 'images/images_popup/btNorm';

var popupBtOK = null;

var popupBtCsl = null;

var LBBBG1 = 'LBBBG1';
var LINKLBBBG1  = 'LINKLBBBG1';

var LBBBG2 = 'LBBBG2';
var LINKLBBBG2  = 'LINKLBBBG2';


/* function that creates the LBPopup at page loading

The LBPopup is hidden when not used but exists

*/

function createLBPopup(){



	if(document.getElementById('modal')==null){	

		/* Modal frame and popup global frame */

		document.writeln('<div id="modal"><div id="popup">');

			

			/* popup header */

			document.writeln('<div id="popupHead">');

				document.writeln('<div class="popupTL"></div><div id="popupHeadContent" class="popupHeadContent"><span id="popupHeadMsg">Attention</span></div><div class="popupTR"></div>');

			document.writeln('</div>');

			

			document.writeln('<div id="popupBody">');

				document.writeln('<div class="popupBodyL"></div><div class="popupBodyR"></div>');

				document.writeln('<div id="popupMsg"></div>');

				document.writeln('<div id="popupCslArea">');
                                
					document.writeln('<div class="LBButton_bg" id="LBBBG1" style=" width: 100px; height: 29px; background: url(images/images_popup/bt1.gif) no-repeat center; display: block; cursor: pointer;" onmouseup="PopupButtonUp(LBBBG1,LINKLBBBG1)" onmousedown="PopupButtonDown(LBBBG1,LINKLBBBG1)" onmouseover="PopupButtonOver(LINKLBBBG1)" onmouseout="PopupButtonOut(LINKLBBBG1)">');
						document.writeln('<div id="LINKLBBBG1" class="LBButton_fg" style="width: 100px; height: 29px; line-height: 29px; text-indent: 0px; background-image: url(null); color: rgb(0, 0, 0);">Non</div>');
					document.writeln('</div>');

				document.writeln('</div>')

				document.writeln('<div id="popupOKArea">');
                                
					document.writeln('<div class="LBButton_bg" id="LBBBG2" style="width: 100px; height: 29px; background: url(images/images_popup/bt1.gif) no-repeat center; display: block;cursor: pointer;" onmouseup="PopupButtonUp(LBBBG2,LINKLBBBG2)" onmousedown="PopupButtonDown(LBBBG2,LINKLBBBG2)" onmouseover="PopupButtonOver(LINKLBBBG2)" onmouseout="PopupButtonOut(LINKLBBBG2)">');
						document.writeln('<div id="LINKLBBBG2" class="LBButton_fg" style=" width: 100px; height: 29px; line-height: 29px; text-indent: 0px; background-image: url(null); color: rgb(0, 0, 0);">Oui</div>');
					document.writeln('</div>');

				document.writeln('</div>');

			document.writeln('</div>');

			

			document.writeln('<div id="popupFoot"><div class="popupBL"></div><div id="popupFootContent" class="popupFootContent"></div><div class="popupBR"></div></div>');

			

		document.writeln('</div></div>');

		popupBtOK = document.getElementById('LBBBG2');
		popupBtCsl = document.getElementById('LBBBG1');

   

	}

}





/*

function that display the LBPopup

the principle is to put it on the foreground and to specify:

    - a width and a height

    - several strings for the messages

    - the functions that will be called when pressing the buttons

    - the container in which the popup will appear (The modal div will fit to the width and height of the container)

    

    This function hides the select elements du correct an IE bug

*/

function LB_popup(LBPmaster,title,width,height,msg,okText,cslText,okFct,cslFct,okImg,cslImg,okPicto,cslPicto,okIndent,cslIndent,yesText,noText){


   leModal = document.getElementById('modal');

    if(leModal){

    popupDisplayed = true;

				/* blocking keyboard events */

				kb_block();

				/* displaying the popup */

        lePopup = document.getElementById('popup');

        lePopupHead = document.getElementById('popupHead');

        lePopupHeadContent = document.getElementById('popupHeadContent');

        lePopupBody = document.getElementById('popupBody');

        lePopupFoot = document.getElementById('popupFoot');

        lePopupFootContent = document.getElementById('popupFootContent');

        headMsg = document.getElementById('popupHeadMsg');

        lePopupMsg = document.getElementById('popupMsg');
	
	yesMsg = document.getElementById('LINKLBBBG2');
	noMsg  = document.getElementById('LINKLBBBG1');

 

 	Drag.init(lePopupHead,lePopup,0,LBPmaster.offsetWidth-width,0,LBPmaster.offsetHeight-height);

        

        /* Setting the prefered size for the elements */

        leModal.style.display='block';

        leModal.style.width = LBPmaster.offsetWidth+'px';

        leModal.style.height = LBPmaster.offsetHeight+'px';

        

        lePopup.style.width = width+'px';

        lePopup.style.height = height+'px';



        lePopupBody.style.height = (height-(lePopupHead.offsetHeight + lePopupFoot.offsetHeight))+'px';

        lePopupMsg.style.height = (height-(lePopupHead.offsetHeight + lePopupFoot.offsetHeight))+'px';

        lePopupHeadContent.style.width = (width-headCornerWidth) +'px';

        lePopupFootContent.style.width = (width-footCornerWidth) +'px';

        

        /* Centering the popup in the container */

        lePopup.style.left = ((leModal.offsetWidth/2) - (lePopup.offsetWidth / 2))+'px';

        lePopup.style.top = ((leModal.offsetHeight/2) - (lePopup.offsetHeight / 2))+'px';

        

        /* setting the messages in the elements */

        headMsg.innerHTML = title;

        lePopupMsg.innerHTML = msg;

	yesMsg.innerHTML = yesText;

	noMsg.innerHTML = noText;

        


        /* buttons functions */

        if(okFct!=null){popupBtOK.onclick = okFct}

        if(cslFct!=null){popupBtCsl.onclick = cslFct}

    

				lesSelect = new Array();

        /* hidding the select elements (to correct an IE "feature")*/

        lesSelect[0] = document.getElementsByTagName('select');

				

				// if the window contains iframes, we have to check in each one

				if(navigator.userAgent.indexOf("MSIE")>-1){

					lesIframes = document.frames;

				}else{

					lesIframes = document.getElementsByTagName('iframe');

				}

				

				for(ipop=0, j=1; ipop < lesIframes.length; ipop++, j++){

					if(navigator.userAgent.indexOf("MSIE")>-1){

						lesSelect[j] = lesIframes[ipop].document.getElementsByTagName('select');

					}else{

						lesSelect[j] = lesIframes[ipop].contentDocument.getElementsByTagName('select');

					}

				}

								

				for(ipop=0; ipop < lesSelect.length; ipop++){

					for(j=0 ; j <lesSelect[ipop].length ; j++){					

							lesSelect[ipop][j].style.visibility='hidden';

					}

				}

    }

}



/*

    this function hide the modal div which contains the popup and

    make the select elements visible again

*/

function LB_hidePopup(){

	if(popupDisplayed){

		if(lesSelect){

			for(ipop=0 ; ipop <lesSelect.length ; ipop++){

				for(j=0 ; j<lesSelect[ipop].length ; j++){

					lesSelect[ipop][j].style.visibility='';

				}

			}

		}

		/*  */

		kb_unblock();

		document.getElementById('modal').style.display='none';

	popupDisplayed = false;

	}

}
