
equipmentImages = new Array( "alarm_enable.gif","camera_enable.gif","console_enable.gif","homecinema_enable.gif","key_enable.gif","laptop_enable.gif","mediacenter_enable.gif","mobile_enable.gif","mp3_enable.gif","others_enable.gif","pc_enable.gif","pda_enable.gif","phone_enable.gif","photo_enable.gif","pocketconsole_enable.gif","printer_enable.gif","projector_enable.gif","radio_enable.gif","stereo_enable.gif","tv_enable.gif","unknown_enable.gif","videocamera_enable.gif","visiophone_enable.gif","walkman_enable.gif");
ptrEquipementImage = 0;
imagePath = "/images/hardware/equipement/";

var last_change  = new Array();

var buttState = new Array();
var seconds = 1000; // nr of milliseconds in a second
var totalProgressDuration = 30; // seconds
var stepDuration = 0;
var progress;
var stop=false;
var let = 1;
imgexpand = new Image();
imgexpand.src = 'images/menu/expand.png';

imgcollapse = new Image();
imgcollapse.src = 'images/menu/collapse.png';

imgarrowrightwhite = new Image();
imgarrowrightwhite.src = 'images/menu/arrowrightwhite.png';

imgarrowrightorange = new Image();
imgarrowrightorange.src = 'images/menu/arrowrightorange.png';

var oldPasswd = "";

var lb_save;
var lb_reset;

var StaticDhcpTab = new Array();
var StaticDhcpMac = new Array();

function DisplayMenu(menuID) {  // last modif by wissem 31-10-2007 BUG 7143  
	var i; 
	var divobj;
	var imgobj;

	for (i=1; i<=3; i++) 
	{
	   
		divobj = document.getElementById('submenu' + i);
		imgobj = document.getElementById('imgmenu' + i);
      
      if(i==menuID)
      {
			if(divobj.style.display == 'block')
			{
      		divobj.style.display = 'none';
				imgobj.src = imgexpand.src;
			}
			else
			{
				divobj.style.display = 'block'; 
				imgobj.src = imgcollapse.src;
			}      	
       }
       else
       {
            divobj.style.display = 'none';
				imgobj.src = imgexpand.src;
       }
	}

}

function MouseOnArrow(row, imgName) {
	obj = document.getElementById(imgName);

	row.style.background = '#FF6600';
	obj.src = imgarrowrightwhite.src;
}

function MouseOutArrow(row, imgName) {
	obj = document.getElementById(imgName);

	row.style.background = '#FFFFFF';
	obj.src = imgarrowrightorange.src;
}


function ButtonOver(type, buttName) {
	if (buttState[buttName] == 0)
		return;

	linkobj = document.getElementById('link' + buttName);

	linkobj.style.color = '#FF6600';
}

function ButtonOut(type, buttName) {
	if (buttState[buttName] == 0)
		return;

	ButtonUp(type, buttName);

linkobj = document.getElementById('link' + buttName);

	linkobj.style.color = '#000000';
}

function ButtonDown(type, buttName) {
	if (buttState[buttName] == 0)
		return;
	
	rowobj = document.getElementById('row' + buttName);
	imgobj = document.getElementById('img' + buttName);
	linkobj = document.getElementById('link' + buttName);

	rowobj.style.backgroundImage = 'url(images/button/right-clic.gif)';
	imgobj.src = 'images/button/left-' + type + '-clic.gif';
	linkobj.style.color = '#FFFFFF';
}

function ButtonUp(type, buttName) {
	if (buttState[buttName] == 0)
		return;

	rowobj = document.getElementById('row' + buttName);
	imgobj = document.getElementById('img' + buttName);
	linkobj = document.getElementById('link' + buttName);

	rowobj.style.backgroundImage = 'url(images/button/right-normal.gif)';
	imgobj.src = 'images/button/left-' + type + '-normal.gif';
	linkobj.style.color = '#000000';
}

function ButtonEnable(type, buttName) {
	buttState[buttName] = 1;

	rowobj = document.getElementById('row' + buttName);
	imgobj = document.getElementById('img' + buttName);
	linkobj = document.getElementById('link' + buttName);

	rowobj.style.backgroundImage = 'url(images/button/right-normal.gif)';
	imgobj.src = 'images/button/left-' + type + '-normal.gif';
	linkobj.style.color = '#000000';
}

function ButtonDisable(type, buttName) {
	buttState[buttName] = 0;

	rowobj = document.getElementById('row' + buttName);
	imgobj = document.getElementById('img' + buttName);
	linkobj = document.getElementById('link' + buttName);

	rowobj.style.backgroundImage = 'url(images/button/right-disable.gif)';
	imgobj.src = 'images/button/left-' + type + '-disable.gif';
	linkobj.style.color = '#666666';
}

function AllButtonEnable(liste) {
	var i;

	if (liste.length < 2)
		return;

	if (liste.length % 2)
		return;

	for (i=0; i<liste.length; i=i+2)
		ButtonEnable(liste[i], liste[i+1]);
}

function AllButtonDisable(liste) {
	var i;

	if (liste.length < 2)
		return;

	if (liste.length % 2)
		return;

	for (i=0; i<liste.length; i=i+2)
		ButtonDisable(liste[i], liste[i+1]);
}

function MouseDownVignette(num) {
	var obj;

	obj = document.getElementById('vignette' + num);

	obj.style.backgroundImage = 'url(images/hardware/round_bg_clic.gif)';
}

function MouseUpVignette(num) {
	var obj;
	obj = document.getElementById('vignette' + num);
	obj.style.backgroundImage = 'url(images/hardware/round_bg.gif)';
}






function FieldGenericPage() {
	obj = document.form_contents;

	n = obj.length;

	flag = true;

	for (i=0; i<n; i++) {
		if ((obj.elements[i].type == 'text') || (obj.elements[i].type == 'password')) {
			str = obj.elements[i].value;
		}
	}

	if (flag)
		AllButtonEnable(arguments);
	else
		AllButtonDisable(arguments);
}

function CheckboxGenericPage () {
 AllButtonEnable(arguments);
}

function FieldLivezoomControlChange() {
	obj = document.form_contents;
	flag = false;
	if ((obj.elements[0].checked == true ) || (obj.elements[1].checked == true))
		flag = true;
	

	if (!flag)
		AllButtonEnable(arguments);
	else
		AllButtonDisable(arguments);
}

function FieldCheckboxControl(Controle) {
obj = document.form_contents;
n = obj.length;
var objControle = document.getElementById(Controle);
	for (i=0; i<n; i++)
		if(objControle.checked == false)
		{
			if (obj.elements[i].name != objControle.name)
			obj.elements[i].disabled = true;
			}
			else
			obj.elements[i].disabled = false;
	
}

function FieldCheckboxControlDisabled(Controle) {
obj = document.form_contents;
n = obj.length;
var objControle = document.getElementById(Controle);
	for (i=0; i<n; i++)
		if (obj.elements[i].name != objControle.name)
			obj.elements[i].disabled = true;
}

function FieldWirelessConnectionEnabled() {
	obj = document.form_contents;
	n = obj.length;
	flag = false;
	for (i=0; i<n; i++) 
	{
		if ((obj.elements[i].type == 'text')) {
			str = obj.elements[i].value;
			if (str.length != 0)
				flag = true;
		}
		else if ((obj.elements[i].type == 'list'))
		{
			obj.elements[i].list.option.selectedIndex = true;
			flag = true;
		}
		else
		{
			if((obj.elements[i].type == 'CHECKBOX'))
			{
				obj.elements[i].checked==true;
				flag = true;
			}
		}
	}
	if (flag)
		AllButtonEnable(arguments);
	else
		AllButtonDisable(arguments);	
}

function FieldFirewallControlChange() {
	obj = document.form_contents;
	flag = false;
	if ((obj.elements[0].checked == true ) || (obj.elements[2].checked == true)) 
		flag = true;
	if (!flag)
		AllButtonEnable(arguments);
	else
		AllButtonDisable(arguments);
}

function FieldWirelessControl(Controle,Simple,Butt1,Simple,Butt2) {
obj = document.form_contents;
var objControle = document.getElementById(Controle);

if (objControle.checked)
	AllButtonEnable(Array(Simple,Butt1,Simple,Butt2));
else
	AllButtonDisable(Array(Simple,Butt1,Simple,Butt2));

}



function FieldDdnsControlChange() {
	obj = document.form_contents;

	n = obj.length;

	for (i=0; i<n; i++) {
             obj.elements[i].disabled == 'disabled';

	}
}

function my_fun(name, id)
{
	document.getElementById(name).value = id;
	lb_mimic_button('lb_apply: ...', 0, 'butt1');
}


function checkPswdLength(str, id)
{
	var obj=0;
	var len=0;
	obj= document.getElementById(id)
	len = str.length;
	
	if ( (len < 4) || (len > 32) ){
		obj.style.display = 'block';
	}
	else {
		obj.style.display = 'none';
	}	
}


function check_len_password(id_div, len)
{
	var obj, chek_box;
	obj = document.getElementById(id_div);
	chek_box = document.getElementById('checkbox_administration');

	if((len < 3 || len > 32) && chek_box.checked==false)
  	    obj.style.display = 'block';
	else
  	    obj.style.display = 'none';
}

function check_same_password(id_div, conf_pass, olpass)
{
	var obj, chek_box;
	obj = document.getElementById(id_div);
	chek_box = document.getElementById('checkbox_administration');

	if((conf_pass != olpass) && chek_box.checked==false)
 	    obj.style.display = 'block';
	else
	    obj.style.display = 'none';
}

// Reload this page, by submitting the search for firmware form.
function btnSearchFirmware()
{
	document.getElementById("id_dlg_install").style.display = '';
	document.getElementById("id_dlg_failed").style.display = 'none';
	document.getElementById("id_dlg_search").style.display = 'none';
}

function btnhiddenFirmware()
{
	document.getElementById("id_dlg_install").style.display = 'none';
	document.getElementById("id_dlg_failed").style.display = 'none';
	document.getElementById("id_dlg_search").style.display = 'none';
}

function btnloadFirmware()
{
	document.getElementById("id_reinit").style.display = 'none';
	document.getElementById("id_dlg_install").style.display = 'none';
	document.getElementById("id_dlg_failed").style.display = 'none';
	document.getElementById("id_dlg_search").style.display = '';
	return true ;
}

function Detectemptybox()
{
	flag1=true;
	flag2=true;

	str=document.getElementById("username").value;
	if (str.length == 0)
	      flag1 = false;

    str=document.getElementById("password").value;
	if (str.length == 0)
	            flag2 = false;

	if(flag1==false)
	{
		document.getElementById("id_hidden").value="1";
		document.getElementById("alerte-user").style.display = '';
	}
	else
	{
		document.getElementById("id_hidden").value="0";
		document.getElementById("alerte-user").style.display = 'none';

	}

	if(flag2==false)
		document.getElementById("alerte-pass").style.display = '';
	else
		document.getElementById("alerte-pass").style.display = 'none';

	
	if(flag2==false || flag1==false)
		return false;
	else
		return true;
		

}

function DetectemptyboxDD()
{
 flag1=true;
 flag2=true;
 
 str=document.getElementById("dev_name").value;
	if (str.length == 0)
	      flag1 = false;

 str=document.getElementById("net_name").value;
	if (str.length == 0)
	      flag2 = false;

 if (flag1==false)
	{
		document.getElementById("id_equ").value="1";
		document.getElementById("alerte-device").style.display = '';
	}
	else
	{
		document.getElementById("id_equ").value="0";
		document.getElementById("alerte-device").style.display = 'none';
	}

 if (flag2==false)
	{
		document.getElementById("id_equ").value="1";
		document.getElementById("alerte-network").style.display = '';
	}
	else
	{
		document.getElementById("id_equ").value="0";
		document.getElementById("alerte-network").style.display = 'none';
	}

if (flag1==false || flag2==false)
		return false;
	else
		return true;
}



function DetectemptyboxAdmin(old_password)
{
 flag1=true;
 flag2=true; 
 flag3=true;

 str1=document.getElementById("new_password").value;	     
 str2=document.getElementById("confirm_new_password").value;

 if(str1 != str2) 

  {
	document.getElementById("id_admin").value="1";	
	document.getElementById("alerte-confirm-pass").style.display = ''; 
     	flag2 = false;	
  }
 
 else
  {

	document.getElementById("id_admin").value="0";
	document.getElementById("alerte-confirm-pass").style.display = 'none';
  } 

 
 if(str1.length == 0)
	{
		document.getElementById("id_admin").value="1";	
		document.getElementById("alerte-new-pass").style.display = '';
		flag1 = false;
	}
	else
	{
		document.getElementById("id_admin").value="0";
		document.getElementById("alerte-new-pass").style.display = 'none';
	}
 
 if(old_password == 1) 

  {
	document.getElementById("id_admin").value="1";	
	document.getElementById("alerte-old-pass").style.display = ''; 
	flag3 = false;
     		
  }
 
 else
  {

	document.getElementById("id_admin").value="0";
	document.getElementById("alerte-old-pass").style.display = 'none';
  }


     if(flag1==false || flag2==false || flag3==false)
		return false;
	else
		return true;
}


function DetectemptyboxAdmin1(old_password)
{
 flag1=true;
 flag2=true; 
 flag3=true;

 str1=document.getElementById("new_password").value;	     
 str2=document.getElementById("confirm_new_password").value;
 str3= document.getElementById("old_password").value;

if(!(str1)&&!(str2)&&!(str3)) return true;


 if(str1 != str2) 

  {
	document.getElementById("id_admin").value="1";	
	document.getElementById("alerte-confirm-pass").style.display = ''; 
   flag2 = false;	
  }
 
 else
  {

	document.getElementById("id_admin").value="0";
	document.getElementById("alerte-confirm-pass").style.display = 'none';
  } 

 if(str1.length < 4 || str1.length > 32 )
	{
		document.getElementById("id_admin").value="1";	
		document.getElementById("alerte-new-pass").style.display = '';
		flag1 = false;
	}
	else
	{
		document.getElementById("id_admin").value="0";
		document.getElementById("alerte-new-pass").style.display = 'none';
	}

 
 if(str3 != old_password )
	{
		document.getElementById("id_admin").value="1";	
		document.getElementById("alerte-old-pass").style.display = '';
		flag3 = false;
	}
	else
	{
		document.getElementById("id_admin").value="0";
		document.getElementById("alerte-old-pass").style.display = 'none';
	}


     if(flag1==false || flag2==false || flag3==false)
		return false;
	else
		return true;

}

 
function BlackListEquipement()
{
  flag1 = true;	
  obj = document.getElementById("check_black_list");
  
  if(obj.checked == true)
   {
    document.getElementById("black-list").style.display = '';
    flag1 = false;
   }
   else
   {
    document.getElementById("black-list").style.display = 'none';
   }
   return flag1;	
      
} 


//
// Progress bar
//
function initProgressBar()
{
  document.getElementById("progressbar_id").style.width='10px';
  progress=0;
  stepDuration = seconds * totalProgressDuration / 394
}





function startProgressBar(step)
{
	if (progress < 0) {
		// force the progressbar to stop, don't call onEndProgressBar
	}
	// value of progress = #progressbar.width (see styles.css)  - padding.left - padding.right - 1
	else if (progress <= 394)
	{
		document.getElementById("progressbar_id").style.width = progress + "px";
		setTimeout("startProgressBar("+ step +");", stepDuration);
		progress = progress + step;   
	}
}
function btnshowbar(step)
{
	initProgressBar();
	startProgressBar(step);

}


function startProgressBarhdd(step)
{
	if (progress < 0) {
		// force the progressbar to stop, don't call onEndProgressBar
	}
	// value of progress = #progressbar.width (see styles.css)  - padding.left - padding.right - 1
	else if (progress <= 394)
	{
		document.getElementById("progressbar_id").style.width = progress + "px";
		setTimeout("startProgressBarhdd("+ step +");", stepDuration);
		document.getElementById("percent").value = parseInt((progress / 394) * 100) + "%";
		progress = progress + step;   
	}
if ((progress >= 394) )
document.getElementById("percent").value = "Formatage terminé";
}

function btnshowbarhdd(step)
{
	initProgressBar();
	startProgressBarhdd(step);

}

function enabled_remote_access()
{
var obj=document.getElementById('hiddensubcontener');
obj.style.display = 'block';

}
function display_remote_access()
{
	var obj, obj2;
	var flag1, flag2, n;
	obj = document.getElementById('hiddensubcontener');
	msg = document.getElementById('permanente_msg');
	obj2 = document.form_contents;
	n = obj2.length;
	flag1 = false;
	flag2 = false;

	for (i=0; i<n; i++) 
	{
		if ((obj2.elements[i].type == 'radio')) {
			if ((obj2.elements[i].name == "radio_activation") && 
			(obj2.elements[i].value == 1) && (obj2.elements[i].checked == true))
			flag1 = true;
			if ((obj2.elements[i].name == "radio_mode") && (obj2.elements[i].value == 1)
			&& (obj2.elements[i].checked == true))
			flag2 = true;
		}
	}

	if (flag1 && flag2){
		obj.style.display = 'block';
		msg.style.display = '';
	}
	else{
		obj.style.display = 'none';
		msg.style.display = 'none';
	}
}

function enable_remote_mode()
{
	var obj;
	obj = document.form_contents;
	n = obj.length;
	for (i=0; i<n; i++) 
	{
		if ((obj.elements[i].type == 'radio') && (obj.elements[i].name == "radio_mode"))
			obj.elements[i].disabled = false;
	}
}

function disable_remote_mode()
{
	var obj;
	obj = document.form_contents;
	n = obj.length;
	for (i=0; i<n; i++) 
	{
		if ((obj.elements[i].type == 'radio') && (obj.elements[i].name == "radio_mode"))
			obj.elements[i].disabled = true;
	}
}

function startProgressBarfast()
{
	if (progress < 0) {
		// force the progressbar to stop, don't call onEndProgressBar
	}
	// value of progress = #progressbar.width (see styles.css)  - padding.left - padding.right - 1
	else if (progress <= 394)
	{
		document.getElementById("progressbar_id").style.width = progress + "4px";
		//document.getElementById("percent").value = progress + "4";
		setTimeout("startProgressBar();", stepDuration);
		progress+=4;   
		
		}
	else if (progress > 394)
	{
	document.getElementById("percent").value = "terminé";

	}
	
}

function btnshowbarfast()
{
	initProgressBar();
	startProgressBarfast();

}


//progressBar
var progressBarValue;
var progressBarWidth;
var progressBarFG = '#9999FF';
var progressBarBG = '#FFFFFF';
var progressBarBorderColor = '#000000';
var progressBarBorderWidth = 2;
fini = true;

function mainProgressBar(width)
{
	setProgressBar(width);
	progressBarWidth = width;
	document.write('<div id="MyprogressBar" >here will be the progress bar</div>');
	dispProgressBar();
	return true;
}

function dispProgressBar()
{
	var html = '';
	var td1 = '';
	var td2 = '';
	var td3;
	var timer;
	var timer = getProgressBar();

	html += '<div class="borderBody" style="padding: 0px 1px;">';
		html += '<div style="background-color: rgb(255, 102, 51); height: 10px; width: '+ timer +';"></div>';
	html += '</div>';
	writeToLayer('MyprogressBar', html);
}

function setProgressBar(value)
{
	if (value < 0) {
		progressBarValue = 0;
	}
	else if (value > 500) {
		progressBarValue = 500;
	}
	else {
		progressBarValue = value;
	}
	return true;
}

function getProgressBar()
{
	return progressBarValue;
}

function augmenterRegulierement () {

	if (getProgressBar() != 0) {

		setProgressBar(getProgressBar()-1);

		dispProgressBar();

		setTimeout("augmenterRegulierement()", 2000);
	}

	else {

		fini = true;

	}

}

function commencer()
{
	if (fini) {

		fini = false;

		setProgressBar(405);
		dispProgressBar();
		augmenterRegulierement();
	}
}

function stop()
{
	setProgressBar(1);
}

function repeat()
{
	setProgressBar(405);
	commencer();
}

function setProgressBar_remote(value)
{
	if (value < 0) {
		progressBarValue = 0;
	}
	else if (value > 600) {
		progressBarValue = 600;
	}
	else {
		progressBarValue = value;
	}
	return true;
}

function diminuerRegulierement (delais) {

	if (getProgressBar() != 0) {

		setProgressBar_remote(getProgressBar()-1);

		dispProgressBar();
		setTimeout("diminuerRegulierement( '" + delais + "' )", delais);
	}

	else {

		fini = true;

	}

}


function commencer_remote(value,delais)
{
	if (fini) {

		fini = false;

		setProgressBar_remote(value);
		dispProgressBar();
		diminuerRegulierement(delais);
	}
}


function remote_repeat(value,delais)
{
	setProgressBar_remote(value);
	commencer_remote(value,delais);
	lb_mimic_button('rhd_extend: ...', 0, 'butt1');
}

//ProgressBar tools
var isDHTML = 0;
var isLayers = 0;
var isAll = 0;
var isID = 0;
var isBusy = false;

if (document.getElementById) {
	isID = 1; isDHTML = 1;
} else {
	browserVersion = parseInt(navigator.appVersion);
	if ((navigator.appName.indexOf('Netscape') != -1) && (browserVersion == 4)) {
		isLayers = 1; isDHTML = 1;
	} else {
		if (document.all) {
			isAll = 1; isDHTML = 1;
		}
	}
}

function findDOM(objectID,withStyle) {
	if (withStyle == 1) {
		if (isID) {
			return (document.getElementById(objectID).style);
		} else {
			if (isAll) {
				return (document.all[objectID].style);
			} else {
				return getObjNN4(top.document,objectID);
			}
		}
	} else {
		if (isID) {
			return (document.getElementById(objectID));
		} else {
			if (isAll) {
				return (document.all[objectID]);
			} else {
				if (isLayers) {
					return getObjNN4(top.document,objectID);
				}
			}
		}
	}
}

function getObjNN4(obj,name)
{
	var x = obj.layers;
	for (var i=0;i<x.length;i++)
	{
		if (x[i].id == name)
			return x[i];
		else if (x[i].layers.length)
			var tmp = getObjNN4(x[i],name);
		if (tmp) return tmp;
	}
	return null;
}

function writeToLayer ( id, text )
{
	x = findDOM( id, 0 );

	if ( !x )
		return;
	if ( isLayers ) {
		if ( isBusy ) {
			setTimeout ( "writeToLayer( '" + id + "', '" + text + "' )", 20 );
		} else {
			isBusy = true;
			x.document.write(text);
			x.document.close();
			isBusy = false;
		}
	} else {
		x.innerHTML = text;
	}
}
//end progressbar
 function defaultEnterAction()
 {
	return true;
}

function keypressfunction(e)
 {
 	var keynum;

 	if(window.event) //IE
 	{
 		keynum = e.keyCode;
 	}
 	else
 	{
 		keynum = e.which;
 	}

 	if (keynum == 13)
 	{
 		try
 		{
            SendPassword();
 			return defaultEnterAction();
 		}
		catch(err)
		{
 			return false;
 		}
 	}
 }


function nextIcon() {
	var imageElement = ptrEquipementImage;
	imageElement ++;

	if(imageElement>=equipmentImages.length)
		imageElement = 0;

	DisplayPicto(imageElement);
}

function previousIcon() {
	var imageElement = ptrEquipementImage;
	imageElement --;

	if(imageElement<0)
		imageElement = equipmentImages.length - 1;

	DisplayPicto(imageElement);
}

function DisplayPicto(value) {
	var imagepicto = document.getElementById('equipmentIcon');
	var filename = imagePath + equipmentImages[value];

	imagepicto.src = filename;
	ptrEquipementImage = value;
	document.getElementById('id_equ').value = value;
}




function display_upnp_table()
{
	var obj, obj1, obj2;
	var flag1, n;
	obj = document.getElementById('hiddensubcontener1');
	obj1 = document.getElementById('hiddensubcontener2');
	obj3 = document.getElementById('hiddensubcontener3');

	obj2 = document.form_contents;
	n = obj2.length;
	flag1 = false;

	for (i=0; i<n; i++) 
	{
		if ((obj2.elements[i].type == 'radio')) {
			if ((obj2.elements[i].name == "radio_activation") && (obj2.elements[i].value == 1) && (obj2.elements[i].checked == true))
			flag1 = true;
			
		}
	}

	if (flag1)
               {
		obj.style.display = 'block';
		obj1.style.display = 'block';
		obj3.style.display = 'block';
	       } 
	else
	       {
		obj.style.display = 'none';
		obj1.style.display = 'none';
		obj3.style.display = 'none';
               }
}

//////////////////////

ptrRoom = 0;
arrayRoom = new Array();
arrayRoom[0] = '/images/hardware/room/bureau_50x50.gif';
arrayRoom[1] = '/images/hardware/room/chambre1_50x50.gif';
arrayRoom[2] = '/images/hardware/room/chambre2_50x50.gif';
arrayRoom[3] = '/images/hardware/room/chambre3_50x50.gif';
arrayRoom[4] = '/images/hardware/room/chambre4_50x50.gif';
arrayRoom[5] = '/images/hardware/room/chambre5_50x50.gif';
arrayRoom[6] = '/images/hardware/room/cuisine_50x50.gif';
arrayRoom[7] = '/images/hardware/room/entree_50x50.gif';
arrayRoom[8] = '/images/hardware/room/garage_50x50.gif';
arrayRoom[9] = '/images/hardware/room/itinerant_50x50.gif';
arrayRoom[10] = '/images/hardware/room/jardin_50x50.gif';
arrayRoom[11] = '/images/hardware/room/salleamanger_50x50.gif';
arrayRoom[12] = '/images/hardware/room/salledebain_50x50.gif';
arrayRoom[13] = '/images/hardware/room/salon_50x50.gif';
arrayRoom[14] = '/images/hardware/room/terrasse_50x50.gif';

function DisplayRoom(value) {
	document.getElementById("RoomTable_SelectAllRules").disabled = true;
	m_checksEnabled(false);
	m_manageEditRowButtons();
	if (value < 0) {
		value = arrayRoom.length - 1;
	}

	if (value >= arrayRoom.length) {
		value = 0;
	}

	ptrRoom = value;
	document.form_contents.room.value = value;
	document.getElementById('id_room').src = arrayRoom[ptrRoom];
}

function DisplayRoomNext() {
	value = ptrRoom + 1;
	DisplayRoom(value);
}

function DisplayRoomPrev() {
	value = ptrRoom - 1;

	DisplayRoom(value);
}

var decoder_text;
var showorhide = 0;

function showDays()
{
	// Check current state
	if (showorhide == 0)
	{
		showorhide = 1;
		document.getElementById("id_days").style.display = "block";
	}
}

function hideDays()
{
	// Check current state
	if (showorhide==1)
	{
		showorhide = 0;
		document.getElementById("id_days").style.display = "none";

	}
}

function pageInit()
{
	fw_radio_setSelectedValue(document.mainform.radio_activated,   js_mbv_viewperelement_limitations_activated);
	initDailyHours();
	updateDailyHoursVisibility();
	onDailyTimeChanged();

    if ( js_mbv_viewperelement_limitations_activated == "1" )
    {
		showDays();
    }
	else
	{
		hideDays();
	}

    fw_saveOriginalFormValues(document.mainform);
}

function fw_radio_setSelectedValue(radioButton, selectedValue) 
// Note that the radiobuttons should have the same "name" attribute
// and different values, selectedValue should be there in the radiobutton 
// list, otherwise no radiobutton will be selected.
{

	for (v=0; v<radioButton.length;v++){
		if (radioButton[v].value == selectedValue) {
			radioButton[v].checked = true;
		}
		else {
			radioButton[v].checked = false;
		}
	}
}

function fw_update_activation(radio_button)
{
    if ( radio_button == 1 )
    {
		showDays();
    }
    else
    {
		hideDays();
    }
}

function initDailyHours() {
	checkBoxes = document.getElementsByTagName("input");
	var j = 0;
	for (var i = 0; i < checkBoxes.length; i++) {
		var checkBox = checkBoxes[i];
		if (checkBox.name.indexOf("dayChecked") >= 0) {
			if (js_dayActiveArray[j] != null) {
				if (js_dayActiveArray[j] == 1) {
					checkBox.checked = true;
				} else {
					checkBox.checked = false;
				}
				var timeRangeParentTable = checkBox.parentNode.parentNode.childNodes[3].childNodes[0].childNodes[0].childNodes[0];
				var startHourBox = timeRangeParentTable.childNodes[0].childNodes[1];
				fw_select_setSelectedValue(startHourBox, js_startHours[j]);
				var endHourBox = timeRangeParentTable.childNodes[1].childNodes[1];
				fw_select_setSelectedValue(endHourBox, js_endHours[j]);
				j++;
			}
		}
	}
}
//lamis
function set_daily_limited()
{
	var k = 1;
var flag =0;
	applyDailyLimits = document.getElementById('frm_dailyChecked').checked;
	if (!applyDailyLimits) {
		flag = 0;
		for (var i = 0; i < 7; i++) {
			checkBox = document.getElementById("frm_" + i + "dayChecked");
			if (checkBox) {
				if ((checkBox.checked == true) && (checkBox.name.indexOf("watermark") < 0)) {
					hour_start = eval("document.form_contents.frm_" + i + "dayStart.value");
					hour_end = eval("document.form_contents.frm_" + i + "dayEnd.value");
					if (parseInt(hour_start) > parseInt(hour_end)) {
						document.getElementById("error_block0").style.display = "block";
						//document.getElementById("error_block").innerHTML ="L'heure de départ doit précéder l'heure de fin !";
						checkedday = "";
						return (-1);
					}
					if (parseInt(hour_start) == parseInt(hour_end)) {
						document.getElementById("error_block1").style.display = "block";
						//document.getElementById("error_block").innerHTML ="L'heure de départ et de fin ne peuvent être égale !";
						checkedday = "";
						return (-1);
					}
					flag =1;
					if (i == 6)
						k = 0;
					checkedday = checkedday + "T" + hour_start + ":" + hour_end + "D" + k + "_";
				}
			}
			k++;
		}
		if (flag == 0) {
			document.getElementById("error_block2").style.display = "block";
			//document.getElementById("error_block").innerHTML = "Au moins une règle du programmeur doit être spécifiée !";
			checkedday = "";
			return (-1);
		}
		document.getElementById("day_limitation").value = checkedday + "T";
		checkedday = "";
	}
	else {
	flag =0;	
	dailyStart = document.form_contents.frm_dailyStart.value;
		dailyEnd = document.form_contents.frm_dailyEnd.value;
		if (parseInt(dailyStart) > parseInt(dailyEnd)) {
			document.getElementById("error_block0").style.display = "block";
			//document.getElementById("error_block").innerHTML = "L'heure de départ doit précéder l'heure de fin !";
			checkedday = "";
			return (-1);
		}
		if (parseInt(dailyStart) == parseInt(dailyEnd)) {
		document.getElementById("error_block1").style.display = "block";
		//document.getElementById("error_block").innerHTML ="L'heure de départ et de fin ne peuvent être égale !";
		checkedday = "";
		return (-1);
		}
		checkedday = checkedday + "T" + dailyStart + ":" + dailyEnd;
		days = "D";
		for (var i = 0; i < 7; i++) {
			checkBox = document.getElementById("frm_" + i + "dayChecked");
			if (checkBox) {
				if ((checkBox.checked == true) && (checkBox.name.indexOf("watermark") < 0)) {
					flag = 1;
					if (i == 6)
						k = 0;
					days = days + k + "_";
				}
			}
			k++;
		}
		if (flag == 0) {
			document.getElementById("error_block3").style.display = "block";
			//document.getElementById("error_block").innerHTML = "Au moins un jour de la semaine doit être choisi !";
			checkedday = "";
			days = "";
			return (-1);
		}
		checkedday = checkedday + "D" + days + "T";
		days = "";
		document.getElementById("day_limitation").value = checkedday;
		checkedday = "";
	}
	lb_mimic_button('lb_apply: ...', 0, 'butt2');
}
var checkedday = "";
var days ="";	

function onDailyTimeChanged()
{
	applyDailyLimits = document.getElementById('frm_dailyChecked').checked;
	if (applyDailyLimits) {
		dailyStart = document.form_contents.frm_dailyStart.value;
		dailyEnd = document.form_contents.frm_dailyEnd.value;
		selectionBoxes = document.getElementsByTagName('select');
		for (i = 0; i < selectionBoxes.length; i++) {
			selectionBox = selectionBoxes[i];
			if (selectionBox.name.indexOf("dayStart") >= 0) {
				selectionBox.value = dailyStart;
				selectionBox.disabled = true;
			}
			if (selectionBox.name.indexOf("dayEnd") >= 0) {
				selectionBox.value = dailyEnd;
				selectionBox.disabled = true;
			}
		}
	}
	else {
		selectionBoxes = document.getElementsByTagName('select');
		for (i = 0; i < selectionBoxes.length; i++) {
			selectionBox = selectionBoxes[i];
			if (selectionBox.name.indexOf("dayStart") >= 0) {
				selectionBox.disabled = false;
			}
			if (selectionBox.name.indexOf("dayEnd") >= 0) {
				selectionBox.disabled = false;
			}
		}
	}
}

function fw_select_setSelectedValue(selectInput, selectedValue) {
	if ( selectInput ) {
		if (typeof selectInput.length != 'undefined') {
			for ( select_iter = 0 ; select_iter < selectInput.length ; select_iter++ ) {
				if ( selectInput.options[select_iter].value == selectedValue ) {
					selectInput.selectedIndex = select_iter;
				}
			}
		}
		else {
			selectInput.selectedIndex = 0;
		}
	}
}
function fw_saveOriginalFormValues(form)
// Call this function from the pageInit function, after
// the original values are set
{
   var saveButtonIndex=-1;
	 
   fw_originalFormValues=fw_internal_form2Array(form);  

   fw_internal_setSaveBotton(form, false);
}
function fw_internal_form2Array(form)
{
   var aFormValues= new Array(); 
  
   for (i=0; i< form.elements.length; i++)
   {
	    switch (form.elements[i].type)
			{
			   case "checkbox" : if (form.elements[i].name.search("_checks") == -1)
								 {
									aFormValues[aFormValues.length] = form.elements[i].checked;
								 }
								 break;
				 case "radio"    : aFormValues[aFormValues.length] = form.elements[i].checked;
								   break; 
				 default: aFormValues[aFormValues.length] = form.elements[i].value;
				          break;
			}   			
   }
	 
	 return aFormValues;
}
function fw_internal_setSaveBotton(form, enabled)
// Control the state of the Save and Cancel buttons
{
   for (i=0; i< form.elements.length; i++)
	 {
	 		if (form.elements[i].name.search("Save")!=-1)
			     form.elements[i].disabled = !enabled;
	 		if (form.elements[i].name.search("Cancel")!=-1)
			  	 form.elements[i].disabled = !enabled;
	 }
	 // Addition for LBButton framework 0.3
	 // Note: only one save and cancel button are supported!
	 var ButtonIds = new Array (
	 	"LBBASave", "LBBACancel", "LBBXTASave", "LBBXTACancel"  
	 );
	 
	 for (var i = 1; i < ButtonIds.length ; i++) {
		 var obj = document.getElementById(ButtonIds[i]);
		 if (null != obj){
		 	if (enabled) {
			 	obj.parentObj.enable();
			} else {
			 	obj.parentObj.disable();
			}
		 }
	 }
}

function limitation()
{
	lb_mimic_button('lb_apply: ...', 0, 'butt5');
}

function updateDailyHoursVisibility() {
checkBoxes = document.getElementsByTagName("input");
checkBoxIndex = 0;
for (var i = 0; i < checkBoxes.length; i++) {
var checkBox = checkBoxes[i];
if ((checkBox.name.indexOf("dayChecked") >= 0) && (checkBox.name.indexOf("watermark") < 0)) {
var visibility = "visible";
if (!checkBox.checked) {
visibility = "hidden";
}
if(document.getElementById('day'+checkBoxIndex))
document.getElementById('day'+checkBoxIndex).style.visibility = visibility;
checkBoxIndex++;
}
}
}

function check_mail(e) {
ok = "1234567890qwertyuiop[]asdfghjklzxcvbnm.@-_QWERTYUIOPASDFGHJKLZXCVBNM";

for(i=0; i < e.length ;i++){
if(ok.indexOf(e.charAt(i))<0){ 
return (false);
}	
} 

if (document.images) {
re = /(@.*@)|(\.\.)|(^\.)|(^@)|(@$)|(\.$)|(@\.)/;
re_two = /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
if (!e.match(re) && e.match(re_two)) {
return (-1);		
} 

}

}

function is_number(value) {
    
        checkvalue = parseInt(value);
        if (value != checkvalue) 
        {
            return false;
        } else {
            return true;
        			}
}

// f is the form (passed using the this keyword)
function check_empty(objet,err)
{
	if (objet.value.length < 1) {
		document.getElementById(err).style.display = "";
		objet.focus();
		return false;
	}
	else {
		
		document.getElementById(err).style.display = "none";
		return true;
	}
}

// check the first email address ( the exclamation means "not" )
function check_email(objet,err)
{
	if (!check_mail(objet.value)) {

		document.getElementById(err).style.display = "";
		objet.focus();
		return false;
	}
	else {
		document.getElementById(err).style.display = "none";
		return true;
	}
}

// check numbers

function check_num(objet,err)
{
	if (!is_number(objet.value)) {
		document.getElementById(err).style.display = "";
		objet.focus();
		return false;
		}
	else {
		document.getElementById(err).style.display = "none";
		return true;
		}
}

function check_info_perso(optional)
{
check = 0;
if (!optional)
check = (check_empty(document.form_contents.perso_company, 'perso_company_err') && check_empty(document.form_contents.perso_lastname, 'perso_lastname_err') && check_empty(document.form_contents.perso_firstname, 'perso_firstname_err') && check_empty(document.form_contents.perso_tel,'perso_tel_err') && check_email(document.form_contents.perso_email,'perso_email_err') && check_empty(document.form_contents.perso_address,'perso_address_err') && check_num(document.form_contents.perso_cp,'perso_cp_err') && check_empty(document.form_contents.perso_city,'perso_city_err') && check_empty(document.form_contents.perso_pageweb,'perso_pageweb_err'));
if (check || optional)
{
lb_mimic_button('lb_apply: ...', 0, 'butt1');
return true;
}

else
return false;
}

function  check_ip_address()
{
str0=document.getElementsByTagName("INPUT");
str1=document.getElementsByTagName("INPUT");
str2=document.getElementsByTagName("INPUT");

var start_address = 0 ;
var end_address = 0 ; 
var j = 0;
var k = 0;

for(i=0;i<str0.length;i++)
{ 
  if(str0[i].name.indexOf('frm_ip')>-1) {
   if(!is_number(str0[i].value))
    {
     document.getElementById("dhcp_ip_address").style.display = "";
     return false;
    }
    else if ((str0[i].value < 0 || str0[i].value > 255))
    {
     document.getElementById("dhcp_ip_address").style.display = "";
     return false;
    }
    else  	
    {
     document.getElementById("dhcp_ip_address").style.display = "none"; 	
    }
   }
}
 for(i=0;i<str1.length;i++) 
{
  if(str1[i].name.indexOf('pref_conn_set_start_ip')>-1) {
   if(!is_number(str1[i].value))
    {
     document.getElementById("dhcp_ip_address_start").style.display = "";
     return false;
    }
    else if ((str1[i].value < 0 || str1[i].value > 255))
    {
     document.getElementById("dhcp_ip_address_start").style.display = "";
     return false;
    }
    else  	
    {
     document.getElementById("dhcp_ip_address_start").style.display = "none";		
     start_address = start_address + str1[i].value;
     j = j + 1;	   	
    }    
   }
}

for(i=0;i<str2.length;i++)
 {
   if(str2[i].name.indexOf('pref_conn_set_end_ip')>-1) {
   if(!is_number(str2[i].value))
    {
     document.getElementById("dhcp_ip_address_end").style.display = "";
     return false;
    }
    else if ((str2[i].value < 0 || str2[i].value > 255))
    {
     document.getElementById("dhcp_ip_address_end").style.display = "";
     return false;
    }
    else  	
    {
     document.getElementById("dhcp_ip_address_end").style.display = "none"; 
     end_address = end_address + str2[i].value; 
     k = k + 1;
    }  
   }
 }

}	


function checkIP(ip0, ip1, ip2, ip3)
{
	if (!is_number(ip0) || !is_number(ip1) || !is_number(ip2) || !is_number(ip3))
		return false;

	if ((ip0 < 0) || (ip0 > 255))
		return false;

	if ((ip1 < 0) || (ip1 > 255))
		return false;

	if ((ip2 < 0) || (ip2 > 255))
		return false;

	if ((ip3 < 0) || (ip3 > 255))
		return false;

	return true;
}


function check_ip_address1()
{
	var error = false;

	// Read input fields
	ip0 = document.getElementsByName("frm_ip0")[0].value;
	ip1 = document.getElementsByName("frm_ip1")[0].value;
	ip2 = document.getElementsByName("frm_ip2")[0].value;
	ip3 = document.getElementsByName("frm_ip3")[0].value;

	mask0 = document.getElementsByName("pref_conn_set_dhcp_netmask0")[0].value;
	mask1 = document.getElementsByName("pref_conn_set_dhcp_netmask1")[0].value;
	mask2 = document.getElementsByName("pref_conn_set_dhcp_netmask2")[0].value;
	mask3 = document.getElementsByName("pref_conn_set_dhcp_netmask3")[0].value;

	start0 = document.getElementsByName("pref_conn_set_start_ip0")[0].value;
	start1 = document.getElementsByName("pref_conn_set_start_ip1")[0].value;
	start2 = document.getElementsByName("pref_conn_set_start_ip2")[0].value;
	start3 = document.getElementsByName("pref_conn_set_start_ip3")[0].value;

	end0 = document.getElementsByName("pref_conn_set_end_ip0")[0].value;
	end1 = document.getElementsByName("pref_conn_set_end_ip1")[0].value;
	end2 = document.getElementsByName("pref_conn_set_end_ip2")[0].value;
	end3 = document.getElementsByName("pref_conn_set_end_ip3")[0].value;


	// Clear message
	document.getElementById("dhcp_ip_address").style.display = "none";
	document.getElementById("dhcp_ip_address_start").style.display = "none";
	document.getElementById("dhcp_ip_address_end").style.display = "none";
	document.getElementById("dhcp_ip_address_cmp").style.display = "none";


	// Check IP, mask, start & end...
	ret = checkIP(ip0, ip1, ip2, ip3);

	if (!ret) {
		error = true;
		document.getElementById("dhcp_ip_address").style.display = "";
	}

	ret = checkIP(mask0, mask1, mask2, mask3);

	if (!ret) {
		error = true;
//		document.getElementById("dhcp_ip_address_mask").style.display = "";
	}


	ret = checkIP(start0, start1, start2, start3);

	if (!ret) {
		error = true;
		document.getElementById("dhcp_ip_address_start").style.display = "";
	}


	ret = checkIP(end0, end1, end2, end3);

	if (!ret) {
		error = true;
		document.getElementById("dhcp_ip_address_end").style.display = "";
	}


	// String => Int
	ip0 = parseInt(ip0);
	ip1 = parseInt(ip1);
	ip2 = parseInt(ip2);
	ip3 = parseInt(ip3);

	mask0 = parseInt(mask0);
	mask1 = parseInt(mask1);
	mask2 = parseInt(mask2);
	mask3 = parseInt(mask3);

	start0 = parseInt(start0);
	start1 = parseInt(start1);
	start2 = parseInt(start2);
	start3 = parseInt(start3);

	end0 = parseInt(end0);
	end1 = parseInt(end1);
	end2 = parseInt(end2);
	end3 = parseInt(end3);


	// Check IP start in function of Mask
	val0 = (ip0 ^ start0) & mask0;
	val1 = (ip1 ^ start1) & mask1;
	val2 = (ip2 ^ start2) & mask2;
	val3 = (ip3 ^ start3) & mask3;

	if ((val0 | val1 | val2 | val3) > 0) {
		error = true;
		document.getElementById("dhcp_ip_address_start").style.display = "";
	}


	// Check IP end in function of Mask
	val0 = (ip0 ^ end0) & mask0;
	val1 = (ip1 ^ end1) & mask1;
	val2 = (ip2 ^ end2) & mask2;
	val3 = (ip3 ^ end3) & mask3;

	if ((val0 | val1 | val2 | val3) > 0) {
		error = true;
		document.getElementById("dhcp_ip_address_end").style.display = "";
	}

	// Check IP start < IP end
	if ((start0 > end0) || (start1 > end1) || (start2 > end2) || (start3 > end3)) {
		error = true;
		document.getElementById("dhcp_ip_address_cmp").style.display = "";
	}

	return (!error);
}


function check_ip_address1old()
{
	flag0 = true;
	flag1 = true;
	flag2 = true;
	flag3 = true;

	start_address = 0;
	end_address = 0;

	str0 = document.getElementsByName("frm_ip0");
	str1 = document.getElementsByName("frm_ip1");
	str2 = document.getElementsByName("frm_ip2");
	str3 = document.getElementsByName("frm_ip3");

	str4 = document.getElementsByName("pref_conn_set_start_ip0");
	str5 = document.getElementsByName("pref_conn_set_start_ip1");
	str6 = document.getElementsByName("pref_conn_set_start_ip2");
	str7 = document.getElementsByName("pref_conn_set_start_ip3");

	str8 = document.getElementsByName("pref_conn_set_end_ip0");
	str9 = document.getElementsByName("pref_conn_set_end_ip1");
	str10 = document.getElementsByName("pref_conn_set_end_ip2");
	str11 = document.getElementsByName("pref_conn_set_end_ip3");


	if (!(is_number(str0[0].value)) || !(is_number(str1[0].value)) || !(is_number(str2[0].value)) || !(is_number(str3[0].value))) {
		document.getElementById("dhcp_ip_address").style.display = "";
		flag0 = false;
	}
	else if ((str0[0].value < 0 || str0[0].value > 255) || (str1[0].value < 0 || str1[0].value > 255)
		 || (str2[0].value < 0 || str2[0].value > 255) || (str3[0].value < 0 || str3[0].value > 255)) {
		document.getElementById("dhcp_ip_address").style.display = "";
		flag0 = false;
	}
	else {
		document.getElementById("dhcp_ip_address").style.display = "none";
	}


	if (!(is_number(str4[0].value)) || !(is_number(str5[0].value)) || !(is_number(str6[0].value)) || !(is_number(str7[0].value))) {
		document.getElementById("dhcp_ip_address_start").style.display = "";
		flag1 = false;
	}
	else if ((str4[0].value < 0 || str4[0].value > 255) || (str5[0].value < 0 || str5[0].value > 255)
		 || (str6[0].value < 0 || str6[0].value > 255) || (str7[0].value < 0 || str7[0].value > 255)) {
		document.getElementById("dhcp_ip_address_start").style.display = "";
		flag1 = false;
	}
	else {
		document.getElementById("dhcp_ip_address_start").style.display = "none";
	}


	if (!(is_number(str8[0].value)) || !(is_number(str9[0].value)) || !(is_number(str10[0].value)) || !(is_number(str11[0].value))) {
		document.getElementById("dhcp_ip_address_end").style.display = "";
		flag2 = false;
	}
	else if ((str8[0].value < 0 || str8[0].value > 255) || (str9[0].value < 0 || str9[0].value > 255)
		 || (str10[0].value < 0 || str10[0].value > 255) || (str11[0].value < 0 || str11[0].value > 255)) {
		document.getElementById("dhcp_ip_address_end").style.display = "";
		flag2 = false;
	}
	else {
		document.getElementById("dhcp_ip_address_end").style.display = "none";
	}


	if (is_number(str4[0].value) && is_number(str5[0].value) && is_number(str6[0].value) && is_number(str7[0].value) && is_number(str8[0].value)
	    && is_number(str9[0].value) && is_number(str10[0].value) && is_number(str11[0].value))
	{
		if (str4[0].value > str8[0].value) {
			document.getElementById("dhcp_ip_address_cmp").style.display = "";
			flag3 = false;
		}
		else if (str5[0].value > str9[0].value) {
			document.getElementById("dhcp_ip_address_cmp").style.display = "";
			flag3 = false;
		}
		else if (str6[0].value > str10[0].value) {
			document.getElementById("dhcp_ip_address_cmp").style.display = "";
			flag3 = false;
		}
		else if (str7[0].value > str11[0].value) {
			document.getElementById("dhcp_ip_address_cmp").style.display = "";
			flag3 = false;
		}
		else {
			document.getElementById("dhcp_ip_address_cmp").style.display = "none";
		}

	}

	alert("ici");

	if (flag0 == false || flag1 == false || flag2 == false || flag3 == false)
		return false;
	else
		return true;
}

function  check_static_ip_address()
{
 flag0=true;

 str0 = document.getElementsByName("static_frm_ip0");
 str1 = document.getElementsByName("static_frm_ip1");
 str2 = document.getElementsByName("static_frm_ip2");
 str3 = document.getElementsByName("static_frm_ip3");


 if(!(is_number(str0[0].value)) || !(is_number(str1[0].value)) || !(is_number(str2[0].value)) || !(is_number(str3[0].value)) )
  {
  //disactivateButtonArray("butt_save");
  flag0 = false;
  }
 else if ((str0[0].value < 0 || str0[0].value > 255) || (str1[0].value < 0 || str1[0].value > 255) || (str2[0].value < 0 || str2[0].value > 255) || (str3[0].value < 0 || str3[0].value > 255))
    {
    //disactivateButtonArray("butt_save");
     flag0 = false;
    }
    //else  	
    //{
  //activateButtonArray("butt_save");
    //}

    return flag0;
}	


function check_ssid_wpa(e) {
 ok = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ&éè_çà@^'\\|[]#()$êù%Œ~{}/*-+=\"!?<>§ð:;,.âåþýûîô¶~ÂøÊ±æðÛÎÔ«»©®ß¬¿×÷¡"; 
flag=true;
  for(i=0; i < e.length ;i++){
    if(ok.indexOf(e.charAt(i))<0){ 
     flag=false;
  }	
 } 
 return flag;
}

function check_ssid_wep(e) {
ok = "1234567890abcdefABCDEF";
flag=true;
  for(i=0; i < e.length ;i++){
    if(ok.indexOf(e.charAt(i))<0){ 
     flag=false;
  }	
 } 
 return flag;
}
 
  
function check_wifi_ssid(sec_mode)
{
	flag1 = true;
	flag2 = true;
	str2 = document.getElementById("ssid_name").value;
	if (sec_mode == 2 || sec_mode == 3 || sec_mode == 5) {
		str1 = document.getElementById("security_key_wpa");
		str3 = "perso_wpa_err";
	}
	else if (sec_mode == 1) {
		str1 = document.getElementById("security_key_wep");
		str3 = "perso_wep104_err";
	}
	else if (sec_mode == 4) {
	str1 = document.getElementById("security_key_wep");
	str3=  "perso_wep40_err";
	}
	else {
		str1 = "1234567890abcdefABCDEF";
		str3 = "perso_none_err";
	}

	if (sec_mode == 2 ||  sec_mode == 3 || sec_mode == 5)
	{
		if ((!check_ssid_wpa(str1.value)) || ((str1.value).length < 8) || ((str1.value).length > 63)) {
			document.getElementById(str3).style.display = '';
			flag1 = false;
		}
		else {
			document.getElementById(str3).style.display = 'none';
		}
	}
	else if (sec_mode == 1) {
		if ((!check_ssid_wep(str1.value)) || ((str1.value).length != 26)) {
			document.getElementById(str3).style.display = '';
			flag1 = false;
		}
		else {
			document.getElementById(str3).style.display = 'none';
		}
	}
	else if (sec_mode == 4) {
		if ((!check_ssid_wep(str1.value)) || ((str1.value).length != 10)) {
		document.getElementById(str3).style.display = '';
		flag1 = false;
		}
		else {
		document.getElementById(str3).style.display = 'none';
		}
	}
	else
	{
		if ((!check_ssid_wpa(str1)) || (str1.length < 8) || (str1.length > 26)) {
			document.getElementById(str3).style.display = '';
			flag1 = false;
		}
		else {
			document.getElementById(str3).style.display = 'none';
		}
	}
	if (str2.length == 0)
		flag2 = false;
	if (flag2 == false) {
		document.getElementById("alerte-ssid").style.display = '';
	}
	else {
		document.getElementById("alerte-ssid").style.display = 'none';
	}
	if (flag1 == false || flag2 == false)
	//	lb_mimic_button('reset: ...', 0, 'butt2');
	return false;
	else
	//	lb_mimic_button('submit: ...', 0, 'butt1');
	return true;
}

/*************** Bloc Popup ********/

var js_esp_ConfirmDialogTitle ;
var js_esp_ConfirmDialogText ;
var js_esp_ConfirmDialogYes ;
var js_esp_ConfirmDialogNo ;



var doingAConfirmedCancel=false;
var confirmedOK=false;


// This boolean is used to keep track of possible changes to the fields on a page
// Use the setter function below to set/reset it.
var b_isChanged = false;

function setChanged (isChanged)
{
	b_isChanged = isChanged;
}

function openLink(url,id)  
{
	mimic_button(url, id);
}


// This bool is used to keep track if the LBPopup has been shown; in that case the "system" popup doesn't have to be used anymore
var FTDialogDisplayed=false;


// The new openLink function
var savParam1="";
var savParam2="";

function openLinkCheckConfirm (sParam1,sParam2)
{
	savParam1=sParam1;
	savParam2=sParam2;

	if (navigator.userAgent.indexOf("MSIE") > -1)
	 {
	   listElements = document.form_contents.elements;
      for ( i=0 ;  i < listElements.length ;i++ ) 
      {
      	if (last_change[i] != listElements[i].value) 
      	{ 
             	setChanged(true);
          }
         
		}
	}	
	
	// The LBDialog will be displayed, so no need to show the "system" dialog
	FTDialogDisplayed=true;
	if ((sParam1.indexOf("sidebar")>-1 || sParam1.indexOf("btn_tab_goto")>-1) && js_mbv_ConfirmActions == '0' && b_isChanged && !doingAConfirmedCancel) 
	{
		ShowPopup();
		 
	}
	else
	
		// The parameters on the page weren't changed or the "confirmactions" flag is not set
		openLink(savParam1,savParam2); 
	
}

function ShowPopup ()
{
	popupContent1="<span style='font-weight: bold; font-family: verdana, arial, sans-serif; font-size: 12px;'>"+js_esp_ConfirmDialogText+"</span>"; 
	if (window.parent.LB_popup) 
	{
		window.parent.LB_popup(window.parent.document.getElementById ("HNM_master"), js_esp_ConfirmDialogTitle, 300, 200, popupContent1, js_esp_ConfirmDialogYes, js_esp_ConfirmDialogNo, function(){okPressed();},function(){cancelPressed();},'images_popup','images_popup',null,null,0,0,js_esp_ConfirmDialogYes,js_esp_ConfirmDialogNo);
	} else 
	openLink(savParam1,savParam2);
	

}


function okPressed()
{
 if (window.parent.LB_popup)
 {
 window.parent.LB_hidePopup();
 }
 openLink(savParam1, savParam2);
}

function cancelPressed()
{
 if (window.parent.LB_popup)
 {
 window.parent.LB_hidePopup();
 }
 FTDialogDisplayed=false;
 doingAConfirmedCancel = false;
 confirmedOK = false;
}

function formIsChanged()
{
	listElements = document.form_contents.elements;
	var last_onchange  = new Array();
	
	for ( i=0 ;  i < listElements.length ;i++ )
	{     	
   	if(navigator.userAgent.indexOf("MSIE")>-1) 
   	{ 
     	  	last_change[i] = listElements[i].value;		
		}
		else 
		{
				last_onchange = listElements[i].getAttribute('onchange');   
         	listElements[i].setAttribute('onchange',last_onchange +'; setChanged(true);');
		} 
	}		
}



function PopupButtonUp(buttId,linkId) {

	button = document.getElementById(buttId);
	button.style.backgroundImage = 'url(images/images_popup/bt1.gif)';
}

function PopupButtonDown(buttId,linkId) {

	button = document.getElementById(buttId);
	button.style.backgroundImage = 'url(images/images_popup/bt3.gif)';

}
function PopupButtonOver(linkId) {

}

function PopupButtonOut(linkId) {


}

/* SAMY - MODIFIED BY WISSEM 24092007 */
var activate_bnt_ddns = false; 
function AllCheckboxGenericPage () {
if ((document.getElementById('ddns_host').value != "") && (document.getElementById('ddns_username').value != "") && (document.getElementById('ddns_password').value != ""))
 {
   activateButtonArray("butt_save");
   activateButtonArray("butt_reset");
   activate_bnt_ddns = true;    
 }
else {
   disactivateButtonArray("butt_save");
   disactivateButtonArray("butt_reset");
   activate_bnt_ddns = false;

  }

}

// WISSEM - BEGIN

var Addflag = false;
var AddflagDdns = false;
var registermodif = false;
var registermodifDdns = false;
var registeradd = false;

var tableEnabled = true;
var addButtonEnabled = true;
var eraseButtonEnabled = false;
var modifyButtonEnabled = false;
var addButtonEnabledDdns = true;

var tableEnabledDdns = true;
var modifyButtonEnabledDdns = false;
var eraseButtonEnabledDdns = false;

var editRow = null;
var inputsColl = new Array();
currentRow = null;

function m_inverseSelect()	// OK
{
	var set_check = document.getElementById("RoomTable_SelectAllRules").checked;
	var checksElem = document.getElementsByTagName("INPUT"); 
	for (i = 0; i < checksElem.length; i++) {
		if (checksElem[i].name.indexOf("frm_RoomTable_checks") >= 0){
			checksElem[i].checked = set_check;
		}
	}
	m_manageButtonsAndChecks();
}
function m_inverseSelectDdns()	// OK
{
	var set_check = document.getElementById("DdnsTable_SelectAllRules").checked;
	var checksElem = document.getElementsByTagName("INPUT"); 
	for (i = 0; i < checksElem.length; i++) {
		if (checksElem[i].name.indexOf("frm_DdnsTable_checks") >= 0){
			checksElem[i].checked = set_check;
		}
	}
	m_manageButtonsAndChecksDdns();
}
function m_manageButtonsAndChecksDdns()	// OK
{
	var tmp = document.getElementById("DdnsTable_SelectAllRules");
	if (tmp.disabled == false && tmp.checked == true) { 
		var checksElem = document.getElementsByTagName("INPUT");
		for (i = 0; i < checksElem.length; i++) {
			if (checksElem[i].name.indexOf("frm_DdnsTable_checks") >= 0) {
				if (checksElem[i].checked == false || checksElem[i].disabled == true) {
					tmp.checked = false;
					i = checksElem.length;
				}

			}
		}
	}
	if (tableEnabledDdns) {
		var count = m_countChecksDdns();
		//addButtonEnabledDdns= true;
		//if ((count == 0) && addButtonEnabledDdns) {
		//	AllButtonEnable(Array('simple', 'butt4'));
		//}
		//else {
		//	AllButtonDisable(Array('simple', 'butt4'));
		//	addButtonEnabledDdns = false;
		//}

		if (count == 0) {
			disactivateButtonArray("butt_modify");
			modifyButtonEnabledDdns = false;
		//	disactivateButtonArray("butt_delete");
		//	eraseButtonEnabledDdns = false;
		}
		else if (count == 1) {
			activateButtonArray("butt_modify");
			modifyButtonEnabledDdns = true;
		//	activateButtonArray("butt_delete");
		//	eraseButtonEnabledDdns = true;
		}
		else {
			disactivateButtonArray("butt_modify");
			modifyButtonEnabledDdns = false;
		//	activateButtonArray("butt_delete");
		//	eraseButtonEnabledDdns = true; 
		}
		document.getElementById("DdnsTable_SelectAllRules").disabled = false;
		m_checksEnabledDdns(true);
	}
	else 
     {
		//AllButtonDisable(Array('simple', 'butt4'));
		//addButtonEnabledDdns = false;
		disactivateButtonArray("butt_modify");
		modifyButtonEnabledDdns = false;
	//	activateButtonArray("butt_delete"); 
	//	eraseButtonEnabledDdns = false;
		document.getElementById("DdnsTable_SelectAllRules").disabled = true;
		m_checksEnabledDdns(false);

	}
}


function m_manageButtonsAndChecks()	// OK
{
	var tmp = document.getElementById("RoomTable_SelectAllRules");
	if (tmp.disabled == false && tmp.checked == true) { 
		var checksElem = document.getElementsByTagName("INPUT");
		for (i = 0; i < checksElem.length; i++) {
			if (checksElem[i].name.indexOf("frm_RoomTable_checks") >= 0) {
				if (checksElem[i].checked == false || checksElem[i].disabled == true) {
					tmp.checked = false;
					i = checksElem.length;
				}

			}
		}
	}
	if (tableEnabled) {
		var count = m_countChecks();
		addButtonEnabled = true;
		if ((count == 0) && addButtonEnabled) {
			AllButtonEnable(Array('simple', 'butt4'));
		}
		else {
			AllButtonDisable(Array('simple', 'butt4'));
			addButtonEnabled = false;
		}

		if (count == 0) {
			disactivateButtonArray("butt_modify");
			modifyButtonEnabled = false;
			disactivateButtonArray("butt_delete");
			eraseButtonEnabled = false;
		}
		else if (count == 1) {
			activateButtonArray("butt_modify");
			modifyButtonEnabled = true;
			activateButtonArray("butt_delete");
			eraseButtonEnabled = true;
		}
		else {
			disactivateButtonArray("butt_modify");
			modifyButtonEnabled = false;
			activateButtonArray("butt_delete");
			eraseButtonEnabled = true; 
		}
		document.getElementById("RoomTable_SelectAllRules").disabled = false;
		m_checksEnabled(true);
	}
	else 
     {
		AllButtonDisable(Array('simple', 'butt4'));
		addButtonEnabled = false;
		disactivateButtonArray("butt_modify");
		modifyButtonEnabled = false;
		activateButtonArray("butt_delete"); 
		eraseButtonEnabled = false;
		document.getElementById("RoomTable_SelectAllRules").disabled = true;
		m_checksEnabled(false);

	}
}


function m_checksEnabled(bEnabled)	// OK
{
	var checksElem = document.getElementsByTagName("INPUT");
	if (typeof checksElem.length != 'undefined') {
		for (i = 0; i < checksElem.length; i++) {
			if ((checksElem[i].name.indexOf("frm_RoomTable_checks") >= 0) && (checksElem[i].name.indexOf("watermark") < 0)) {
				checksElem[i].disabled = !bEnabled;
			}
		}
	}

}
function m_checksEnabledDdns(bEnabled)	// OK
{
	var checksElem = document.getElementsByTagName("INPUT");
	if (typeof checksElem.length != 'undefined') {
		for (i = 0; i < checksElem.length; i++) {
			if ((checksElem[i].name.indexOf("frm_DdnsTable_checks") >= 0) && (checksElem[i].name.indexOf("watermark") < 0)) {
				checksElem[i].disabled = !bEnabled;
			}
		}
	}

}

function fw_disableAllInputs()
{
	if (document.form_contents){
		form = document.form_contents;
	}
	else {
		return;
	}
	for (i = 0; i < form.elements.length; i++) {
		switch (form.elements[i].type) {
		    case "checkbox":
			    // Do not disable table-checks
			    if (form.elements[i].name.search("_checks") == -1) { 
				    form.elements[i].disabled = true;
			    }
			    break;
			case "radio":
		    case "select": 
		    case "text":
		    case "password":
			    form.elements[i].disabled = true;
			    break;
		    default:
			    break;
		}
	}
}


function m_prepareAdd()
{
	//disable checkboxes 
	var box1= document.getElementById("RoomTable_SelectAllRules");
	box1.disabled = true;
	m_checksEnabled(false);
	//disable buttons
	AllButtonDisable(Array('simple', 'butt4'));
	addButtonEnabled = false;
	disactivateButtonArray("butt_modify");
	modifyButtonEnabled = false;
	disactivateButtonArray("butt_delete"); 
	eraseButtonEnabled = false;
}
function m_prepareAddDdns()
{
	//disable checkboxes 
	var box1= document.getElementById("DdnsTable_SelectAllRules");
	box1.disabled = true;
	m_checksEnabledDdns(false);
	//disable buttons
	AllButtonDisable(Array('simple', 'butt4'));
	addButtonEnabledDdns = false;
	disactivateButtonArray("butt_modify");
	modifyButtonEnabledDdns = false;
//	disactivateButtonArray("butt_delete"); 
//	eraseButtonEnabledDdns = false;
}

function RoomTable_internalAddline()
{
	if (addButtonEnabled) {
		m_prepareAdd();
		RoomTable_addlineCB();
	}
}
function DdnsTable_internalAddline(nb_row)
{
	if (addButtonEnabledDdns) {
		m_prepareAddDdns();
		DdnsTable_addlineCB();
	}
}

function m_manageEditRowButtons()
{
	if (!tableEnabled) {
		if (Addflag) {
			butobj = document.getElementById('LBBBAReservedSave');
			if (butobj) {
				activateButtonArray("LBBBAReservedSave");
				registeradd = true;
			}
		}
		else {
			butobj = document.getElementById('LBBBAReservedSave');
			if (butobj) {
				if ((document.getElementById("input_room").value) != TableRowDevice) {
					activateButtonArray("LBBBAReservedSave"); 
					registermodif = true;
				}
				if (ptrRoom != ptrRoomold) 
                {
					activateButtonArray("LBBBAReservedSave");
					registermodif = true;
				}
			}
		}
	}
}
function m_manageEditDdnsButtons()
{
	if (!tableEnabledDdns) {
		if (AddflagDdns) {
			butobj = document.getElementById('LBBBAReservedSave');
			if (butobj) {
				activateButtonArray("LBBBAReservedSave");
				registeraddDdns = true;
			}
		}
		else {
			butobj = document.getElementById('LBBBAReservedSavehidden');
			if (butobj) {
			activateButtonArray("LBBBAReservedSavehidden"); 
			registermodifDdns = true;
			}
		}
	}
}

function addddns()
{
if(registeraddDdns){
	addButtonEnabledDDns = true;
	AddflagDdns = false;
	registeraddDdns = false;
	lb_mimic_button('lb_apply: ...', 0,'butt2');
}
}
function addroom()
{
if(registeradd){
	addButtonEnabled = true;
	Addflag = false;
	registeradd = false;
	lb_mimic_button('lb_apply: ...', 0,'butt2');
}
}
function DdnsTable_addlineCB1()
{
	var tbody1 = document.getElementById("dom_manup"); 
	var tr1 = document.createElement('TR');
	tableEnabledDdns = false;
	AddflagDdns =true;
	tr1.className = 'ahead';
	tbody1.appendChild(tr1);
	var td1 = document.createElement('TD');
	td1.className = 'aleft';
	tr1.appendChild(td1);
	var td2 = document.createElement('TD');
	td2.className = 'data';
	tr1.appendChild(td2);
	var input1 = ce('INPUT', 'ddns_domaine');
	input1.setAttribute('type', 'text');
	input1.onkeyup = m_manageEditDdnsButtons;
	input1.setAttribute('id', 'ddns_domain');
	input1.onblur = m_manageButtonsAndChecksDdns;
	input1.setAttribute('maxlength', '30');
	input1.setAttribute('size', '20');
	input1.setAttribute('value', '');
	td2.appendChild(input1);
	
	var td3 = document.createElement('TD');
	td3.className = 'amid';
	tr1.appendChild(td3);
	var td4 = document.createElement('TD');
	td4.className = 'data';
	tr1.appendChild(td4);
	var input2 = ce('INPUT', 'ddns_host');
	input2.setAttribute('type', 'text');
	input2.onkeyup = m_manageEditDdnsButtons;
	input2.setAttribute('id', 'ddns_host');
	input2.onblur = m_manageButtonsAndChecksDdns;
	input2.setAttribute('maxlength', '255');
	input2.setAttribute('size', '10');
	input2.setAttribute('value', '');
	td4.appendChild(input2);
	
	var td5 = document.createElement('TD');
	td5.className = 'amid';
	tr1.appendChild(td5);
	var td6 = document.createElement('TD');
	td6.className = 'data';
	tr1.appendChild(td6);
	var input3 = ce('INPUT', 'ddns_username');
	input3.setAttribute('type', 'text');
	input3.onkeyup = m_manageEditDdnsButtons;
	input3.setAttribute('id', 'ddns_username');
	input3.onblur = m_manageButtonsAndChecksDdns;
	input3.setAttribute('maxlength', '255');
	input3.setAttribute('size', '10');
	input3.setAttribute('value', '');
	td6.appendChild(input3);
	
	var td7 = document.createElement('TD');
	td7.className = 'amid';
	tr1.appendChild(td7);
	var td8 = document.createElement('TD');
	td8.className = 'data';
	tr1.appendChild(td8);
	var input4 = ce('INPUT', 'ddns_password');
	input4.setAttribute('type', 'text');
	input4.onkeyup = m_manageEditDdnsButtons;
	input4.setAttribute('id', 'ddns_password');
	input4.onblur = m_manageButtonsAndChecksDdns;
	input4.setAttribute('maxlength', '128');
	input4.setAttribute('size', '10');
	input4.setAttribute('value', '');
	td8.appendChild(input4);
	
var td9 = document.createElement('TD');
	td9.className = 'amid';
	tr1.appendChild(td9);
	var td10 = document.createElement('TD');
	td10.className = 'data';
	tr1.appendChild(td10);
/*	var input4 = ce('INPUT', 'ddns_password');
	input4.setAttribute('type', 'text');
	input4.onkeyup = m_manageEditDdnsButtons;
	input4.setAttribute('id', 'ddns_password');
	input4.onblur = m_manageButtonsAndChecksDdns;
	input4.setAttribute('maxlength', '128');
	input4.setAttribute('size', '10');
	input4.setAttribute('value', '');
	td8.appendChild(input4);*/

	

var td11 = document.createElement('TD');
	td11.className = 'amid_dbl';
	tr1.appendChild(td11);
	var td12 = 
document.createElement('TD');
	td12.className = 'dbl_button';
	tr1.appendChild(td12);
	var div1 = document.createElement('DIV');
	div1.className = 'dblbttn';
	div1.setAttribute('id', 'editRowButtons');
	td12.appendChild(div1);
	var table3 = document.createElement('TABLE');
	div1.appendChild(table3);
	var tbody3 = document.createElement('TBODY');
	table3.appendChild(tbody3);
	var tr3 = document.createElement('TR');
	tbody3.appendChild(tr3);
	var td13 = document.createElement('TD'); 
	tr3.appendChild(td13);
	var div2 = document.createElement('DIV'); 
	div2.setAttribute('id', 'btdiv2');
	td13.appendChild(div2);
	var div3 = document.createElement('DIV'); 
	div3.className = 'LBButton_bg';
	div3.setAttribute('id', 
'LBBBGReservedSave');
	div2.appendChild(div3);
	var div4 = document.createElement('DIV');
	div4.className = 'LBButton_fg';
	div4.setAttribute('id', 'LBBBAReservedSave');
	div4.onclick=function(){addddns();};
	div4.style.color = "rgb(0, 0, 0)"; 
	div4.style.position ="relative";
	div4.style.top ="3px";
	div4.style.backgroundImage = "url(images/button/desact.gif)";
	div4.style.height = "26px";
	div4.style.width = "99px";
	div3.appendChild(div4);
	var div5 = document.createElement('DIV');
	div5.className = 'txtbuttstyle';
	div4.appendChild(div5);
	var txt1 = document.createTextNode(lb_save);
	div5.appendChild(txt1);
	


var tr4 = document.createElement('TR');
	tbody3.appendChild(tr4);
	var td14 = document.createElement('TD');
	tr4.appendChild(td14);
	var div6 = document.createElement('DIV');
	div6.setAttribute('id', 'btdiv3');
	td14.appendChild(div6);
	var div7 = document.createElement('DIV');
	div7.className = 'LBButton_bg';
	div7.setAttribute('id', 'LBBBGReservedCancel');
	div6.appendChild(div7);
	var div8 = document.createElement('DIV');
	div8.className = 'LBButton_fg';
	div8.setAttribute('id', 'LBBBAReservedCancel');
	div8.onclick=function(){RemoveNodeinAddDdns();};
	div8.style.height = "26px";
	div8.style.width = "99px";
	div8.style.color = "rgb(0, 0, 0)";
	div8.style.backgroundImage = "url(images/button/activ.gif)"; 
	div7.appendChild(div8);
	var div9 = document.createElement('DIV');
	div9.className = 'txtbuttstyle';
	div8.appendChild(div9);
	var txt1 = document.createTextNode(lb_reset);
	div9.appendChild(txt1);
	var td15 = document.createElement('TD');
	td15.className = 'aright';
	tr1.appendChild(td15);

	tr1.setAttribute("id", "newDdns_row");
}

function DdnsTable_addlineCB()
{
	var tbody1 = document.getElementById("dom_manup"); 
	tbody1.style.display='';
	tableEnabledDdns = false;
	AddflagDdns =true;
}


function RoomTable_addlineCB()
{
	var tbody1 = document.getElementById("dom_manup"); 
	var tr1 = document.createElement('TR');
	tableEnabled = false;
	Addflag =true;
	tr1.className = 'ahead';
	tbody1.appendChild(tr1);
	var td1 = document.createElement('TD');
	td1.className = 'aleft';
	tr1.appendChild(td1);
	var td2 = document.createElement('TD');
	td2.className = 'data';
	tr1.appendChild(td2);
	var input1 = ce('INPUT', 'input_room');
	input1.setAttribute('type', 'text');
		
	input1.onkeyup = m_manageEditRowButtons;
	
	input1.setAttribute('id', 'input_room');
	input1.onblur = m_manageButtonsAndChecks;
	input1.setAttribute('maxlength', '30');
	input1.setAttribute('size', '20');
	input1.setAttribute('value', '');
	td2.appendChild(input1);
	var td3 = document.createElement('TD');
	td3.className = 'amid';
	tr1.appendChild(td3);
	var td4 = document.createElement('TD');
	td4.className = 'data';
	tr1.appendChild(td4);
	var table2 = document.createElement('TABLE');
	table2.setAttribute('align', 'center');
	td4.appendChild(table2);
	var tbody2 = document.createElement('TBODY');
	table2.appendChild(tbody2);
	var tr2 = document.createElement('TR');
	tbody2.appendChild(tr2);
	var td5 = document.createElement('TD');
	td5.setAttribute('valign', 'middle');
	td5.setAttribute('align', 'center');
	tr2.appendChild(td5);
	var a1 = ce('A', 'prev');
//	a1.setAttribute('title', 'Précédent');
//	a1.setAttribute('alt', 'Précédent');
	a1.setAttribute('href', 'javascript:DisplayRoomPrev();');
	td5.appendChild(a1);
	var img1 = document.createElement('IMG');
	img1.setAttribute('width', '20');
	img1.setAttribute('height', '15');
	img1.setAttribute('border', '0');
	img1.setAttribute('src', 'images/prev.gif');
	a1.appendChild(img1);
	var td6 = document.createElement('TD');
	tr2.appendChild(td6);
	var img2 = document.createElement('IMG');
	img2.setAttribute('width', '50');
	img2.setAttribute('height', '50');
	img2.setAttribute('border', '0');
	img2.setAttribute('src', 'images/hardware/room/bureau_50x50.gif');
	img2.setAttribute('id', 'id_room');
	td6.appendChild(img2);
	var td7 = document.createElement('TD');
	td7.setAttribute('valign', 'middle');
	td7.setAttribute('align', 'center');
	tr2.appendChild(td7);
	var a2 = ce('A', 'prev');
//	a2.setAttribute('title', 'Suivant');
//	a2.setAttribute('alt', 'Suivant');
	a2.setAttribute('href', 'javascript:DisplayRoomNext();');
	td7.appendChild(a2);
	var img3 = document.createElement('IMG');
	img3.setAttribute('width', '20');
	img3.setAttribute('height', '15');
	img3.setAttribute('border', '0');
	img3.setAttribute('src', 'images/next.gif');
	a2.appendChild(img3);
	var td8 = document.createElement('TD');
	td8.className = 'amid_dbl';
	tr1.appendChild(td8);
	var td9 = document.createElement('TD');
	td9.className = 'dbl_button';
	tr1.appendChild(td9);
	var div1 = document.createElement('DIV');
	div1.className = 'dblbttn';
	div1.setAttribute('id', 'editRowButtons');
	td9.appendChild(div1);
	var table3 = document.createElement('TABLE');
	div1.appendChild(table3);
	var tbody3 = document.createElement('TBODY');
	table3.appendChild(tbody3);
	var tr3 = document.createElement('TR');
	tbody3.appendChild(tr3);
	var td10 = document.createElement('TD'); 
	tr3.appendChild(td10);
	var div2 = document.createElement('DIV'); 
	div2.setAttribute('id', 'btdiv2');
	td10.appendChild(div2);
	var div3 = document.createElement('DIV'); 
	div3.className = 'LBButton_bg';
	div3.setAttribute('id', 'LBBBGReservedSave');
	div2.appendChild(div3);
	var div4 = document.createElement('DIV');
	div4.className = 'LBButton_fg';
	div4.setAttribute('id', 'LBBBAReservedSave');
	div4.onclick=function(){addroom();};
	div4.style.color = "rgb(0, 0, 0)"; 
	div4.style.position ="relative";
	div4.style.top ="3px";
	div4.style.backgroundImage = "url(images/button/desact.gif)";
	div4.style.height = "26px";
	div4.style.width = "99px";
	div3.appendChild(div4);
	var div5 = document.createElement('DIV');
	div5.className = 'txtbuttstyle';
	div4.appendChild(div5);
	var txt1 = document.createTextNode(lb_save);
	div5.appendChild(txt1);
	var tr4 = document.createElement('TR');
	tbody3.appendChild(tr4);
	var td11 = document.createElement('TD');
	tr4.appendChild(td11);
	var div6 = document.createElement('DIV');
	div6.setAttribute('id', 'btdiv3');
	td11.appendChild(div6);
	var div7 = document.createElement('DIV');
	div7.className = 'LBButton_bg';
	div7.setAttribute('id', 'LBBBGReservedCancel');
	div6.appendChild(div7);
	var div8 = document.createElement('DIV');
	div8.className = 'LBButton_fg';
	div8.setAttribute('id', 'LBBBAReservedCancel');
	div8.onclick=function(){RemoveNodeinAdd();};
	div8.style.height = "26px";
	div8.style.width = "99px";
	div8.style.color = "rgb(0, 0, 0)";
	div8.style.backgroundImage = "url(images/button/activ.gif)"; 
	div7.appendChild(div8);
	var div9 = document.createElement('DIV');
	div9.className = 'txtbuttstyle';
	div8.appendChild(div9);
	var txt1 = document.createTextNode(lb_reset);
	div9.appendChild(txt1);
	var td12 = document.createElement('TD');
	td12.className = 'aright';
	tr1.appendChild(td12);

	tr1.setAttribute("id", "newRoom_row");
}

function m_countChecks()
{
	var counter = 0;
	var checksElem = document.getElementsByTagName("INPUT");
	if (typeof checksElem.length != 'undefined') { 
		for (i = 0; i < checksElem.length; i++) {
			if ((checksElem[i].name.indexOf("frm_RoomTable_checks") >= 0)&&(checksElem[i].name.indexOf("watermark") < 0)){
					if(checksElem[i].checked == true){
						counter++;
					}
			}	
		}
}

	return counter;
}
function m_countChecksDdns()
{
	var counter = 0;
	var checksElem = document.getElementsByTagName("INPUT");
	if (typeof checksElem.length != 'undefined') { 
		for (i = 0; i < checksElem.length; i++) {
			if ((checksElem[i].name.indexOf("frm_DdnsTable_checks") >= 0)&&(checksElem[i].name.indexOf("watermark") < 0)){
					if(checksElem[i].checked == true){
						counter++;
					}
			}	
		}
}

	return counter;
}

function RoomTable_internalInsertRow (bdy, c0html, c1html, selHtml)
{
	var cA = Array ();
	cA[cA.length]=c0html;
	cA[cA.length]=c1html;
	return m_insertRow (cA, selHtml); 
}

function getAllInputs(elm)
{
	var elmStore = new Array();
	function getInputsRec(n) { 
		if ((n.type != "undefined") && ((n.type == "text") || (n.type == "password") || (n.type == "hidden") || (n.type == "select-one"))) {
			elmStore[elmStore.length] = n;
		}
		var children = n.childNodes;	// Now get all children of n
		for (var i = 0; i < children.length; i++) {	// Loop through the children
			getInputsRec(children[i]);	// Recurse on each one
		}
	}
	getInputsRec(elm);
	return (elmStore);
}

function ce(tag, name)
{
	if (name && window.ActiveXObject) {
		element = document.createElement('<' + tag + ' name="' + name + '">');
	}
	else {
		element = document.createElement(tag); 
		element.setAttribute('name', name);
	}
	return element;
}


function ce2(tag, name, name2)
{
if (navigator.userAgent.indexOf("MSIE") > -1) {
	if (name && window.ActiveXObject) {
		element = document.createElement('<' + tag + ' data="' + name + '" ' + ' type="' + name2 + '">');
	}
	else {
		element = document.createElement(tag); 
		element.setAttribute('data', name);
		element.setAttribute('type', name2);
	}
} else
{
	element = document.createElement(tag); 
	element.setAttribute('data', name);
	element.setAttribute('type', name2);
} 
	return element;
}
function RoomTable_internalModifyline()
{
	if (modifyButtonEnabled) {
		m_prepareModify();
		RoomTable_modifylineCB();
	}
	else
		return;
}
function DdnsTable_internalModifyline()
{
	if (modifyButtonEnabledDdns) {
		m_prepareModifyDdns();
		DdnsTable_modifylineCB();
	}
	else
		return;
}
function m_prepareModifyDdns()
{
	var box1 = document.getElementById("DdnsTable_SelectAllRules"); 
	box1.disabled = true;
	m_checksEnabledDdns(false);
	//disable buttons
//	AllButtonDisable(Array('simple', 'butt4')); 
//	addButtonEnabledDdns = false;
	disactivateButtonArray("butt_modify");
	modifyButtonEnabledDdns = false;
//	disactivateButtonArray("butt_delete");
//	eraseButtonEnabledDdns = false; 
}

function m_prepareModify()
{
	var box1 = document.getElementById("RoomTable_SelectAllRules"); 
	box1.disabled = true;
	m_checksEnabled(false);
	//disable buttons
	AllButtonDisable(Array('simple', 'butt4')); 
	addButtonEnabled = false;
	disactivateButtonArray("butt_modify");
	modifyButtonEnabled = false;
	disactivateButtonArray("butt_delete");
	eraseButtonEnabled = false; 
}
function dontmodify(){
	tableEnabled = true;
	mimic_button('sidebar:lb_sidebar_hard_home_setting..', 0);
}
function dontmodifyDdns()
{
	tableEnabledDdns = true;
	lb_mimic_button('reset: ...', 0, 'butt2');
}
function modifddns(){
	if(registermodifDdns){
		//addButtonEnabledDdns = true;
		//AddflagDdns = false;
		registeraddDdns = false;
		lb_mimic_button('submit: ...', 0,'butt2');
	}
}

function modifroom(){
	if(registermodif){
		addButtonEnabled = true;
		Addflag = false;
		registeradd = false;
		lb_mimic_button('lb_apply: ...', 0,'butt2');
	}
}
function DdnsTable_modifylineCB()
{
	var row_idx = m_getSelectedRowDdns();
	tr1 = document.getElementById("DdnsTableRow" + row_idx);
	tr1.style.display='none';
	tr1hidden = document.getElementById("DdnsTableRowhidden" + row_idx);
	tr1hidden.style.display='';
	tableEnabledDdns = false;
	AddflagDdns = false;
}
function RoomTable_modifylineCB()
{
	var tr1 = m_getSelectedRow();
	while (tr1.hasChildNodes())
		tr1.removeChild(tr1.firstChild);
	tableEnabled = false;
	Addflag = false;
	var td1 = document.createElement('TD');
	td1.className = 'aleft';
	tr1.appendChild(td1);
	var td2 = document.createElement('TD');
	td2.className = 'data';
	tr1.appendChild(td2);
	var input1 = ce('INPUT', 'input_room');
	input1.setAttribute('type', 'text');
   	input1.setAttribute('id', 'input_room');
   	input1.onkeyup = m_manageEditRowButtons;
   	input1.setAttribute('maxlength', '30');
	input1.setAttribute('size', '20');
	input1.setAttribute('value',TableRoomRowData);
	td2.appendChild(input1);
	var td3 = document.createElement('TD');
	td3.className = 'amid';
	tr1.appendChild(td3);
	var td4 = document.createElement('TD');
	td4.className = 'data';
	tr1.appendChild(td4);
	var table2 = document.createElement('TABLE');
	table2.setAttribute('align', 'center');
	td4.appendChild(table2);
	var tbody2 = document.createElement('TBODY');
	table2.appendChild(tbody2);
	var tr2 = document.createElement('TR');
	tbody2.appendChild(tr2);
	var td5 = document.createElement('TD');
	td5.setAttribute('valign', 'middle');
	td5.setAttribute('align', 'center');
	tr2.appendChild(td5);
	var a1 = ce('A', 'prev');
//	a1.setAttribute('title', 'Précédent');
//	a1.setAttribute('alt', 'Précédent');
	a1.setAttribute('href', 'javascript:DisplayRoomPrev();');
	td5.appendChild(a1);
	var img1 = document.createElement('IMG');
	img1.setAttribute('width', '20');
	img1.setAttribute('height', '15');
	img1.setAttribute('border', '0');
	img1.setAttribute('src', 'images/prev.gif');
	a1.appendChild(img1);
	tr2.appendChild(TableRoomRowImg);
   	var td7 = document.createElement('TD');
	td7.setAttribute('valign', 'middle');
	td7.setAttribute('align', 'center');
	tr2.appendChild(td7);
	var a2 = ce('A', 'prev');
//	a2.setAttribute('title', 'Suivant');
//	a2.setAttribute('alt', 'Suivant');
	a2.setAttribute('href', 'javascript:DisplayRoomNext();');
	td7.appendChild(a2);
	var img3 = document.createElement('IMG');
	img3.setAttribute('width', '20');
	img3.setAttribute('height', '15');
	img3.setAttribute('border', '0');
	img3.setAttribute('src', 'images/next.gif');
	a2.appendChild(img3);
	var td8 = document.createElement('TD');
	td8.className = 'amid_dbl';
	tr1.appendChild(td8);
	var td9 = document.createElement('TD');
	td9.className = 'dbl_button';
	tr1.appendChild(td9);
	var div1 = document.createElement('DIV');
	div1.className = 'dblbttn';
	div1.setAttribute('id', 'editRowButtons');
	td9.appendChild(div1);
	var table3 = document.createElement('TABLE');
	div1.appendChild(table3);
	var tbody3 = document.createElement('TBODY');
	table3.appendChild(tbody3);
	var tr3 = document.createElement('TR');
	tbody3.appendChild(tr3);
	var td10 = document.createElement('TD');
	tr3.appendChild(td10);
	var div2 = document.createElement('DIV');
	div2.setAttribute('id', 'btdiv2');
	td10.appendChild(div2);
	var div3 = document.createElement('DIV');
	div3.className = 'LBButton_bg';
	div3.setAttribute('id', 'LBBBGReservedSave');
	div2.appendChild(div3);
	var div4 = document.createElement('DIV');
	div4.className = 'LBButton_fg';
	div4.setAttribute('id', 'LBBBAReservedSave');
	div4.onclick = function(){modifroom();};
	div4.style.color = "rgb(0, 0, 0)";
	div4.style.height = "26px";
	div4.style.width = "99px";
	div2.style.position = "relative"; 
	div2.style.top = "3px";
	div4.style.backgroundImage = "url(images/button/desact.gif)";
	div3.appendChild(div4);
	var div5 = document.createElement('DIV');
	div5.className = 'txtbuttstyle';
	div4.appendChild(div5);
	var txt1 = document.createTextNode(lb_save);
	div5.appendChild(txt1);
	var tr4 = document.createElement('TR');
	tbody3.appendChild(tr4);
	var td11 = document.createElement('TD');
	tr4.appendChild(td11);
	var div6 = document.createElement('DIV');
	div6.setAttribute('id', 'btdiv3');
	td11.appendChild(div6);
	var div7 = document.createElement('DIV');
	div7.className = 'LBButton_bg';
	div7.setAttribute('id', 'LBBBGReservedCancel');
	div6.appendChild(div7);
	var div8 = document.createElement('DIV');
	div8.className = 'LBButton_fg';
	div8.setAttribute('id', 'LBBBAReservedCancel');
        div8.onmouseover = function(){activateButtonArray("LBBBAReservedCancel");};
	div8.onclick = function(){dontmodify();};
	div8.style.color = "rgb(0, 0, 0)";
	div8.style.height = "26px";
	div8.style.width = "99px"; 
	div8.style.backgroundImage = "url(images/button/activ.gif)";
	div7.appendChild(div8);
	var div9 = document.createElement('DIV');
	div9.className = 'txtbuttstyle';
	div8.appendChild(div9);
	var txt1 = document.createTextNode(lb_reset);
	div9.appendChild(txt1);
	var td12 = document.createElement('TD');
	td12.className = 'aright';
	tr1.appendChild(td12);
	tr1.setAttribute("id", "newRoom_row");
}
var TableRoomRowData;
var TableRoomRowImg;
var TableRoomRowImgNode;
var ptrRoomold;
function m_getSelectedRow()	// OK
{
	var rownr = 0;
	var row = null;
	var checksElem = document.getElementsByTagName("INPUT");
	if (typeof checksElem.length != 'undefined') { 
		for (i = 0; i < checksElem.length; i++) {
			if ((checksElem[i].name.indexOf("frm_RoomTable_checks") >= 0) && (checksElem[i].name.indexOf("watermark") < 0)) {
				rownr++;
				if (checksElem[i].checked) {
					break;
				}

			}
		}
		if (rownr != 0) {
			row = document.getElementById("RoomTableRow" + rownr);
			document.getElementById("modify_room").value = rownr;
			TableRoomRowData = document.getElementById("RoomTableData" + rownr).innerHTML;
			TableRoomRowImg = document.getElementById("RoomTableImg" + rownr);
			TableRoomRowImgNode = TableRoomRowImg.childNodes[1]; 
			if (navigator.userAgent.indexOf("MSIE") > -1) {
				TableRoomRowImgNode = TableRoomRowImg.childNodes[0];
			}

			TableRoomRowImgNode.id = "id_room";
			ptrRoom = search_index_array(TableRoomRowImgNode.src);
			ptrRoomold = ptrRoom;
			document.form_contents.room.value = ptrRoom;


		}
	}
	return row;
}
function m_getSelectedRowDdns()	// OK
{
	var rownr = 0;
	var row = null;
	var checksElem = document.getElementsByTagName("INPUT");
	if (typeof checksElem.length != 'undefined') { 
		for (i = 0; i < checksElem.length; i++) {
			if ((checksElem[i].name.indexOf("frm_DdnsTable_checks") >= 0) && (checksElem[i].name.indexOf("watermark") < 0)) {
				rownr++;
				if (checksElem[i].checked) {
					break;
				}

			}
		}
		if (rownr != 0) {
			document.getElementById("modify_ddns").value = rownr;
		}
	}
	return rownr;
}
function search_index_array(src)
{
	var i = 0;
	while (i < arrayRoom.length) {
		if (src.indexOf(arrayRoom[i]) >= 0) {
			ptrRoom = i;
			i = arrayRoom.length;
		}
	i++
	}
	return ptrRoom;
}
// WISSEM - END 
function ShowPopupConfirme ()
{
	popupContent1="<span style='font-weight: bold; font-family: verdana, arial, sans-serif; font-size: 12px;'>"+ js_esp_ConfirmDialogTextConfirme +"</span>";
	if (window.parent.LB_popup)
	{
	window.parent.LB_popup(window.parent.document.getElementById ("HNM_master"), js_esp_ConfirmDialogTitle, 300, 200, popupContent1, js_esp_ConfirmDialogYes, js_esp_ConfirmDialogNo, function(){okPressedConfirme();},function(){cancelPressedConfirme();},'images_popup','images_popup',null,null,0,0,js_esp_ConfirmDialogYes,js_esp_ConfirmDialogNo);
	}
}

function confirmationYesNo()
{  
	var result = false;
	if(!doingAConfirmedCancel)
	{
		ShowPopupConfirme();
	}
	return result;
}

function okPressedConfirme()
{
if (window.parent.LB_popup)
 {
 window.parent.LB_hidePopup();
 }
 lb_mimic_button('erase: ...', 0, 'butt4')
 }
function cancelPressedConfirme()
{
if (window.parent.LB_popup)
 {
 window.parent.LB_hidePopup();
 }
 FTDialogDisplayed=false;

 doingAConfirmedCancel = false;
 confirmedOK = false;
 return false;
}
/**
*  bug 6529: couleur font :#fffff 
*
**/
function changeDefaultFontColor()
{ 
	var myZoneFont1 = document.getElementById("contener");	;
	var myZoneFont2 = document.getElementsByName("zone_font_bug");	
	if(myZoneFont1)
	{
		var listFontIthem1 = myZoneFont1.getElementsByTagName('FONT'); 
		for(i=0;i<listFontIthem1.length;i++) 
		{
			if((listFontIthem1[i].color == "#ffffff")||(listFontIthem1[i].color == "#FFFFFF"))
				listFontIthem1[i].color = "#000000";
		}
	}
	if(myZoneFont2)
	{
		for(j=0;j<myZoneFont2.length;j++) 
		{
			var listFontIthem2 = myZoneFont2[j].getElementsByTagName('FONT');
			for(i=0;i<listFontIthem2.length;i++) 
			{
				listFontIthem2[i].color = '#FFFFFF';
			}
	   }
	}
}
function RemoveNodeinAddDdns1()
{
	var tbody1 = document.getElementById("dom_manup"); 
	while (tbody1.hasChildNodes())
		tbody1.removeChild(tbody1.firstChild);
	tableEnabledDdns = true;
	addButtonEnabledDdns = true;
	AddflagDdns = false;
	registeraddDdns = false;
	m_manageButtonsAndChecksDdns();
}
function RemoveNodeinAddDdns()
{
	var tbody1 = document.getElementById("dom_manup");
	 tbody1.style.display='none';
	 tableEnabledDdns = true;
	//addButtonEnabledDdns = true;
	//AddflagDdns = false;
	registeraddDdns = false;
	m_manageButtonsAndChecksDdns();	
}
function RemoveNodeinAdd()
{
	var tbody1 = document.getElementById("dom_manup"); 
	while (tbody1.hasChildNodes())
		tbody1.removeChild(tbody1.firstChild);
	tableEnabled = true;
	addButtonEnabled = true;
	Addflag = false;
	registeradd = false;
	m_manageButtonsAndChecks();
}
var checkederasedroom = "";
var checkederasedddns = ""; 
//SAMY - 20112007 - BEGIN
var checkederasedrow = ""; 
//SAMY - 20112007 - END
function EraseRoom()
{
	if(eraseButtonEnabled){
		var rownr = 0;
		if (!document.getElementById("RoomTable_SelectAllRules").checked) { 
			var checksElem = document.getElementsByTagName("INPUT");
			if (typeof checksElem.length != 'undefined') {
				for (i = 0; i < checksElem.length; i++) {
					if ((checksElem[i].name.indexOf("frm_RoomTable_checks") >= 0)
					    && (checksElem[i].name.indexOf("watermark") < 0)) {
						rownr++;
						if (checksElem[i].checked) {
							checkederasedroom = checkederasedroom + rownr + "/"; 
						}

					}
				}

				document.getElementById("erase_room").value = checkederasedroom;
			}
		}
		lb_mimic_button('erase: ...', 0, 'butt0');
	}
}
function EraseDdns()
{
	if(eraseButtonEnabledDdns){
		var rownr = 0;
		if (!document.getElementById("DdnsTable_SelectAllRules").checked) { 
			var checksElem = document.getElementsByTagName("INPUT");
			if (typeof checksElem.length != 'undefined') {
				for (i = 0; i < checksElem.length; i++) {
					if ((checksElem[i].name.indexOf("frm_DdnsTable_checks") >= 0)
					    && (checksElem[i].name.indexOf("watermark") < 0)) {
						rownr++;
						if (checksElem[i].checked) {
							checkederasedddns = checkederasedddns + rownr + "/"; 
						}

					}
				}

				document.getElementById("erase_ddns").value = checkederasedddns;
			}
		}
		lb_mimic_button('erase: ...', 0, 'butt0');
	}
}

//WISSEM - 24092007 - BEGIN 
function disactivateButtonArray(liste)
{  	
   	document.getElementById(liste).style.backgroundImage='url(images/button/desact.gif)';
      document.getElementById(liste).style.color='#000000'; 
   	document.getElementById(liste).onmouseup=null;
   	document.getElementById(liste).onmousedown=null;
   	document.getElementById(liste).onmouseout=null;
   	document.getElementById(liste).onmouseover=null;
}

function activateButtonArray(liste)
{
	document.getElementById(liste).style.backgroundImage='url(images/button/activ.gif)';
        document.getElementById(liste).style.backgroundImage='url(images/button/activ.gif)';
        document.getElementById(liste).onmouseup= function() { this.style.backgroundImage='url(images/button/activ.gif)';
                                                                      this.style.color='#FF6600';
                                                                     };
        document.getElementById(liste).onmousedown=function() { this.style.backgroundImage='url(images/button/bas.gif)';
                                                                       this.style.color='#FFFFFF';
                                                                      };
        document.getElementById(liste).onmouseout=function() { this.style.color='#000000'; };
        document.getElementById(liste).onmouseover=function() { this.style.color='#ff6600';};
	
}


//WISSEM - 24092007 - END
//WISSEM - 9/10/2007 - begin  

function manage_display()
{
	if (navigator.userAgent.indexOf("MSIE") > -1) {
		window.attachEvent('onload', updateDailyHoursVisibility);
	}
	else {
		window.addEventListener('load', updateDailyHoursVisibility, false);
	}
}

/* infobulle for URL : added by wissem 10102007 BEGIN*/  
function helpGetOffset(obj, coord) {
	var val = obj["offset"+coord] ;
	if (coord == "Top") val += obj.offsetHeight;
	while ((obj = obj.offsetParent )!=null) {
		val += obj["offset"+coord]; 
		if (obj.border && obj.border != 0) val++;  
	}
	return val;
}
function helpDown (num) {
	document.getElementById("helpBox"+num).style.visibility = "hidden";  
}
function helpOver (node,num,textUrlLong_num) { 
	var ptrLayer;
	ptrLayer = document.getElementById("helpBox"+num); 
	var str = '<DIV CLASS="helpBoxDIV">'+textUrlLong_num+'</DIV>'; 
	ptrLayer.innerHTML = str;
	ptrLayer.style.top  = helpGetOffset (node,"Top") + 2;
	ptrLayer.style.left = helpGetOffset (node,"Left");
	ptrLayer.style.visibility = "visible";
	ptrLayer.style.position = "absolute";
}
function tronquerUrl(idDiv,maxLen,nbrC,type) 
{
	var strUrlNode;
    if(type==1)          
    	strUrlNode = document.getElementById(idDiv);
    else 
		strUrlNode = document.getElementById(idDiv).firstChild;
	var textUrlLong_t = strUrlNode.innerHTML;
    var strUrlCh = strUrlNode.innerHTML.replace(/^\s+|\s+$/g, '') ;
	var strUrl = strUrlCh.split('');
	var len = strUrl.length; 
	var strUrlDeb = "";
	var strUrlFin  = "";
	if(len > maxLen){ 
		for(i=0;i<nbrC;i++){ 
			strUrlDeb = strUrlDeb + strUrl[i]}
		for(i=nbrC-1;i>-1;i--){ 
			strUrlFin = strUrlFin + strUrl[len-1-i]
		}
        strUrl = strUrlDeb + "..." + strUrlFin; 
			  strUrlNode.innerHTML = strUrl;
            }
                    return  textUrlLong_t; 
}

function checkRemotePswd(id)
{
	var passwd = "";
	var len=0;
	var check = 0;
	passwd= document.getElementById(id).value;
	len = passwd.length;
	// [Verified] check for Upper Letters, Lower Letters, numbers and special characters and length of the password
	if ( passwd.match(/\d/) && passwd.match(/[!,@#$%^&*?_~]/) && (len >= 8 && len <= 32))
	{
		check = 1;
		 document.getElementById("pass_invalid").style.display = 'none';
	}
	else 
	{
		check = 0;
		document.getElementById("pass_invalid").style.display = '';
	}	
	if (check)
	{
       return true;
	}
	else{
		return false;
	}
}
//SAMY - 20112007 - BEGIN

var show_add_line = 0;
function manageButtonsAndChecks()	// OK
{
	var tmp = document.getElementById("all_checkbox_select");
	if (tmp.disabled == false && tmp.checked == true) { 
		var checksElem = document.getElementsByTagName("INPUT");
		for (i = 0; i < checksElem.length; i++) {
			if (checksElem[i].name.indexOf("select_line") >= 0) {
				if (checksElem[i].checked == false || checksElem[i].disabled == true) {
					tmp.checked = false;
					i = checksElem.length;
				}

			}
		}
	}
	if (tableEnabled) {
		var count = countChecks();
		addButtonEnabled = true;
		if ((count == 0) && addButtonEnabled) {
			AllButtonEnable(Array('simple', 'butt5'));
		}
		else {
			AllButtonDisable(Array('simple', 'butt5'));
			addButtonEnabled = false;
		}

		if (count == 0) {
			disactivateButtonArray("butt_modify");
			modifyButtonEnabled = false;
			disactivateButtonArray("butt_delete");
			eraseButtonEnabled = false;
		}
		else if (count == 1) {
			activateButtonArray("butt_modify");
			modifyButtonEnabled = true;
			activateButtonArray("butt_delete");
			eraseButtonEnabled = true;
		}
		else {
			disactivateButtonArray("butt_modify");
			modifyButtonEnabled = false;
			activateButtonArray("butt_delete");
			eraseButtonEnabled = true; 
		}
		document.getElementById("all_checkbox_select").disabled = false;
		checksEnabled(true);
	}
	else 
     {
		AllButtonDisable(Array('simple', 'butt5'));
		addButtonEnabled = false;
		disactivateButtonArray("butt_modify");
		modifyButtonEnabled = false;
		activateButtonArray("butt_delete"); 
		eraseButtonEnabled = false;
		document.getElementById("all_checkbox_select").disabled = true;
		checksEnabled(false);

	}
}

function display_line()
{
	if (addButtonEnabled){
		document.getElementById("head_add").style.display= '' ; 
		document.getElementById("line_add").style.display= '' ; 
		activateButtonArray("butt_reset");
		document.getElementById("all_checkbox_select").disabled = true;
		checksEnabled(false);
		disactivateButtonArray("butt_modify");
		modifyButtonEnabled = false;
		disactivateButtonArray("butt_delete");
		eraseButtonEnabled = false;
		document.getElementById("show_add_line").value=1;
		document.getElementById("dhcp_ip_exist_err").style.display = 'none';
	}
}

function hide_line()
{
		document.getElementById("head_add").style.display= 'none' ; 
		document.getElementById("line_add").style.display= 'none' ; 
		document.getElementById("all_checkbox_select").disabled = false;
		checksEnabled(true);
		activateButtonArray("butt_modify");
		modifyButtonEnabled = true;
		activateButtonArray("butt_delete");
		eraseButtonEnabled = true; 
		document.getElementById("show_add_line").value=0;
		document.getElementById("dhcp_ip_exist_err").style.display = 'none';
}

function inversecheckbox()
{
	var set_check = document.getElementById("all_checkbox_select").checked;
	var checksElem = document.getElementsByTagName("INPUT"); 
	for (i = 0; i < checksElem.length; i++) {
		if (checksElem[i].name.indexOf("select_line") >= 0){
			checksElem[i].checked = set_check;
		}
	}
	manageButtonsAndChecks();
}
function checksEnabled(bEnabled)	// OK
{
	var checksElem = document.getElementsByTagName("INPUT");
	if (typeof checksElem.length != 'undefined') {
		for (i = 0; i < checksElem.length; i++) {
			if ((checksElem[i].name.indexOf("select_line") >= 0) && (checksElem[i].name.indexOf("watermark") < 0)) {
				checksElem[i].disabled = !bEnabled;
			}
		}
	}
}
function delete_checked()
{
	var ret = false;
	var checksElem = document.getElementsByTagName("INPUT");
	if (typeof checksElem.length != 'undefined') {
		for (i = 0; i < checksElem.length; i++) {
			if ((checksElem[i].name.indexOf("select_line") >= 0)) {
				if (checksElem[i].checked == true)
					ret = true;
			}
		}
	}
return ret;
}

function EraseRows()
{
	if(eraseButtonEnabled){
	var rownr = 0;
	var checksElem = document.getElementsByTagName("INPUT");
	if (typeof checksElem.length != 'undefined'){
	for (i = 0; i < checksElem.length; i++){
	if ((checksElem[i].name.indexOf("select_line") >= 0) && (checksElem[i].name.indexOf("watermark") < 0)){
	rownr++;
	if (checksElem[i].checked){
	checkederasedrow = checkederasedrow + rownr + "/"; 
						}

					}
				}

				document.getElementById("erase_row").value = checkederasedrow;
			}
		lb_mimic_button('erase: ...', 0, 'butt4');
	}
}

function countChecks()
{
	var counter = 0;
	var checksElem = document.getElementsByTagName("INPUT");
	if (typeof checksElem.length != 'undefined') { 
		for (i = 0; i < checksElem.length; i++) {
			if ((checksElem[i].name.indexOf("select_line") >= 0)&&(checksElem[i].name.indexOf("watermark") < 0)){
					if(checksElem[i].checked == true){
						counter++;
					}
			}	
		}
}

	return counter;
}
function RowTable_internalModifyline()
{
	if (modifyButtonEnabled) {
		prepareModify();
		RowTable_modifylineCB();
	}
	else
		return;
}

var TableRowDevice;
var StringRowIp;
var TableRowIp;
var TableRowMac;

function getSelectedRow()	// OK
{
	var rownr = 0;
	var row = null;
	var checksElem = document.getElementsByTagName("INPUT");
	if (typeof checksElem.length != 'undefined') { 
		for (i = 0; i < checksElem.length; i++) {
			if ((checksElem[i].name.indexOf("select_line") >= 0) && (checksElem[i].name.indexOf("watermark") < 0)) {
				rownr++;
				if (checksElem[i].checked) {
					break;
				}

			}
		}
			
		if (rownr != 0) {
			row = document.getElementById("TableRow" + (rownr - 1));
			document.getElementById("modify_row").value = rownr - 1;
			TableRowDevice = document.getElementById("deviceRow" + (rownr - 1)).innerHTML;
			TableRowMac = document.getElementById("macRow" + (rownr - 1)).innerHTML;
		
			StringRowIp = document.getElementById("ipRow" + (rownr - 1)).innerHTML;
      		StringRowIp = StringRowIp.replace(/^\n+|\s+$/g, '');
			TableRowIp = StringRowIp.split('.');

		}
	}
	return row;
}

function manageEditRowButtons()
{
	if (!tableEnabled) {
		if (Addflag) {
			butobj = document.getElementById('LBBBAReservedSave');
			if (butobj) {
				activateButtonArray("LBBBAReservedSave");
				registeradd = true;
			}
		}
		else {
			butobj = document.getElementById('LBBBAReservedSave');
			if (butobj) {
					activateButtonArray("LBBBAReservedSave"); 
					registermodif = true;
				}
		}
	}
}

function prepareModify()
{
	var box1 = document.getElementById("all_checkbox_select"); 
	box1.disabled = true;
	checksEnabled(false);
	//disable buttons
	AllButtonDisable(Array('simple', 'butt5')); 
	addButtonEnabled = false;
	disactivateButtonArray("butt_modify");
	modifyButtonEnabled = false;
	disactivateButtonArray("butt_delete");
	eraseButtonEnabled = false;
}

function modifrow()
{
	if(registermodif){
		addButtonEnabled = true;
		Addflag = false;
		registeradd = false;
		lb_mimic_button('modify: ...', 0,'butt8');
	}
}

function RowTable_modifylineCB()
{
	var tr1 = getSelectedRow();
	while (tr1.hasChildNodes())
	tr1.removeChild(tr1.firstChild);
	tr1.className = 'aeven2';
	tableEnabled = false;
	Addflag = false;
	
	var td1 = document.createElement('TD');
	td1.className = 'aleft';
	tr1.appendChild(td1);
	
	var td2 = document.createElement('TD');
	td2.className = 'data';
	tr1.appendChild(td2);
	td2.innerHTML = TableRowDevice;
	
	var td3 = document.createElement('TD');
	td3.className = 'amid';
	tr1.appendChild(td3);
	
	var td4 = document.createElement('TD');
	td4.className = 'data';
	tr1.appendChild(td4);
	
	var input1 = ce('INPUT', 'ip0');
	input1.setAttribute('type', 'text');
   	input1.setAttribute('id', 'ip0');
   	input1.onkeyup = manageEditRowButtons;
   	input1.setAttribute('maxlength', '3');
	input1.setAttribute('size', '3');
	input1.value = TableRowIp[0];
	td4.appendChild(input1);
	
	var input11 = ce('INPUT', 'ip1');
	input11.setAttribute('type', 'text');
   	input11.setAttribute('id', 'ip1');
   	input11.onkeyup = manageEditRowButtons;
   	input11.setAttribute('maxlength', '3');
	input11.setAttribute('size', '3');
	input11.value = TableRowIp[1];
	td4.appendChild(input11);
			
	var input12 = ce('INPUT', 'ip2');
	input12.setAttribute('type', 'text');
   	input12.setAttribute('id', 'ip2');
   	input12.onkeyup = manageEditRowButtons;
   	input12.setAttribute('maxlength', '3');
	input12.setAttribute('size', '3');
	input12.value = TableRowIp[2];
	td4.appendChild(input12);
	
	var input13 = ce('INPUT', 'ip3');
	input13.setAttribute('type', 'text');
   	input13.setAttribute('id', 'ip3');
   	input13.onkeyup = manageEditRowButtons;
   	input13.setAttribute('maxlength', '3');
	input13.setAttribute('size', '3');
	input13.value = TableRowIp[3];
	td4.appendChild(input13);

	var td5 = document.createElement('TD');
    td5.className = 'amid';
    tr1.appendChild(td5);
	
	var td6 = document.createElement('TD');
	td6.className = 'data';
	tr1.appendChild(td6);
	td6.innerHTML = TableRowMac;
	td6.setAttribute('id', 'modify_ip_mac');

	var td8 = document.createElement('TD');
	td8.className = 'aright';
	tr1.appendChild(td8);
	
	var td81 = document.createElement('TD');
	td81.className = 'aleft';
	tr1.appendChild(td81);

	var td9 = document.createElement('TD');
	td9.className = 'dbl_button';
	tr1.appendChild(td9);
	
	var div1 = document.createElement('DIV');
	div1.className = 'dblbttn';
	div1.setAttribute('id', 'editRowButtons');
	td9.appendChild(div1);
	var table3 = document.createElement('TABLE');
	div1.appendChild(table3);
	var tbody3 = document.createElement('TBODY');
	table3.appendChild(tbody3);
	var tr3 = document.createElement('TR');
	tbody3.appendChild(tr3);
	var td10 = document.createElement('TD');
	tr3.appendChild(td10);
	var div2 = document.createElement('DIV');
	div2.setAttribute('id', 'btdiv2');
	td10.appendChild(div2);
	var div3 = document.createElement('DIV');
	div3.className = 'LBButton_bg';
	div3.setAttribute('id', 'LBBBGReservedSave');
	div2.appendChild(div3);
	var div4 = document.createElement('DIV');
	div4.className = 'LBButton_fg';
	div4.setAttribute('id', 'LBBBAReservedSave');
	div4.onclick = function(){if (valid_modified_ip()){modifrow();}};
	div4.style.color = "rgb(0, 0, 0)";
	div4.style.height = "26px";
	div4.style.width = "99px";
	div2.style.position = "relative"; 
	div2.style.top = "3px";
	div4.style.backgroundImage = "url(images/button/desact.gif)";
	div3.appendChild(div4);
	var div5 = document.createElement('DIV');
	div5.className = 'txtbuttstyle';
	div4.appendChild(div5);
	var txt1 = document.createTextNode(lb_save);
	div5.appendChild(txt1);
	var tr4 = document.createElement('TR');
	tbody3.appendChild(tr4);
	var td11 = document.createElement('TD');
	tr4.appendChild(td11);
	var div6 = document.createElement('DIV');
	div6.setAttribute('id', 'btdiv3');
	td11.appendChild(div6);
	var div7 = document.createElement('DIV');
	div7.className = 'LBButton_bg';
	div7.setAttribute('id', 'LBBBGReservedCancel');
	div6.appendChild(div7);
	var div8 = document.createElement('DIV');
	div8.className = 'LBButton_fg';
	div8.setAttribute('id', 'LBBBAReservedCancel');
    div8.onmouseover = function(){activateButtonArray("LBBBAReservedCancel");};
	div8.onclick = function(){document.getElementById('show_add_line').value=0; lb_mimic_button('reset: ...', 0,'butt9');};
	div8.style.color = "rgb(0, 0, 0)";
	div8.style.height = "26px";
	div8.style.width = "99px"; 
	div8.style.backgroundImage = "url(images/button/activ.gif)";
	div7.appendChild(div8);
	var div9 = document.createElement('DIV');
	div9.className = 'txtbuttstyle';
	div8.appendChild(div9);
	var txt1 = document.createTextNode(lb_reset);
	div9.appendChild(txt1);
	var td12 = document.createElement('TD');
	td12.className = 'aright';
	tr1.appendChild(td12);
	tr1.setAttribute("id", "newRow_row");
}

//SAMY - 20112007 - END

//SAMY - 27112007 - BEGIN

function check_port_in_range(min,max)
{
	var port=document.getElementById('lb_remote_port').value;

	if((port <= max) && (port >= min))
	{
	document.getElementById("port_invalid").style.display = 'none';
	return true;
	}
else
	{
	document.getElementById("port_invalid").style.display = '';
	return false;
	}
}

function check_username()
{
var name=document.getElementById('lb_remote_user').value;
if (name == 'admin' || name == 'Support' || name == 'root')
{
	document.getElementById("user_invalid").style.display = '';
	return false;
}
else if ((name.length > 32) || (name.length < 4))
{
	document.getElementById("user_empty").style.display = '';
	return false;

}
else
{
	document.getElementById("user_empty").style.display = 'none';
	document.getElementById("user_invalid").style.display = 'none';
	return true;
}
}
function hidden_button_hd ()
{
	var obj, obj2, n, flag1,i;
	obj = document.getElementById('button_remte_hd');
	obj2 = document.form_contents;
    n = obj2.length;
	flag1=true;
	for (i=0; i<n; i++){
		if ((obj2.elements[i].type == 'radio')) {
			if ((obj2.elements[i].value == 1)&& (obj2.elements[i].checked == false))
				flag1= false;
		}
    }
	if (obj){
		if(flag1)
		{
			obj.style.display = 'none';
			disable_remote_mode();
			}
		else
			obj.style.display = '';
	}

}


function appear_button_hd()
{
var obj = document.getElementById('button_remte_hd');
	if (obj)
	{
		obj.style.display = '';
	}
}


function appear_button(enabled,enabled_mode)
{

	if (navigator.userAgent.indexOf("MSIE") > -1) {
	if(!enabled || enabled_mode)
		window.attachEvent('onload',  appear_button_hd);
	else
		window.attachEvent('onload',  disable_remote_mode);
	}
	
	else {
	if(!enabled || enabled_mode)
		window.addEventListener('load', appear_button_hd, false);
	else
		window.addEventListener('load', disable_remote_mode, false);
	}

}

function enable_disable_mode_sec_wep_cb()
{
name_modewifi='pref_conn_set_wl_dot11_mode';
eval('obj=document.form_contents.'+name_modewifi);
 name_modewifi_sec='lb_wl_security_type';
 eval('obj1=document.form_contents.'+name_modewifi_sec);
 if(obj && obj1)
 {
 	if(obj.value==1)
	{
		obj1.options[1].disabled=false;
		obj1.options[2].disabled=false;
	}
	else 
	if(obj.value==6)
	{
		obj1.options[1].disabled=true;
		obj1.options[2].disabled=true;
		if(obj1.value==1 || obj1.value==4)
			obj1.value=2;
	}
}
return true;
}
function enable_disable_mode_sec_cb()
{
    name_modewifi='pref_conn_set_wl_dot11_mode';
	eval('obj=document.form_contents.'+name_modewifi);
	name_modewifi_sec='lb_wl_security_type';
	eval('obj1=document.form_contents.'+name_modewifi_sec);
	if(obj && obj1)
	{
		if(obj.value==1)
			obj1.options[1].disabled=false;
		else
		if(obj.value==6)
			obj1.options[1].disabled=true;
	}
	return true;
}

function enable_disable_mode_sec(wep64)
{
	if (navigator.userAgent.indexOf("MSIE") > -1) {
	if(!wep64)
		window.attachEvent('onload',  enable_disable_mode_sec_wep_cb);
	else
		window.attachEvent('onload',  enable_disable_mode_sec_cb);
	}
	else
	{
	if(!wep64)
		 window.addEventListener('load', enable_disable_mode_sec_wep_cb, false);
	else
		window.addEventListener('load', enable_disable_mode_sec_cb, false);
	}
}

function check_remote_permanent()
{
	var obj, obj2;
	var flag1, flag2, n;
	var username,pswd,port;
	obj = document.getElementById('hiddensubcontener');
	obj2 = document.form_contents;
	n = obj2.length;
	flag1 = false;
	flag2 = false;
	for (i=0; i<n; i++){
		if ((obj2.elements[i].type == 'radio')){
			if ((obj2.elements[i].name == "radio_activation") && (obj2.elements[i].value == 1) && (obj2.elements[i].checked == true))
				flag1 = true;
			if ((obj2.elements[i].name == "radio_mode") && (obj2.elements[i].value == 0) && (obj2.elements[i].checked == true))
				flag2 = true;
		}
     }
     if (flag1 && flag2)
	 	return true;
	flag1 = false;
	for (i=0; i<n; i++){
		if ((obj2.elements[i].type == 'radio')){
			if ((obj2.elements[i].name == "radio_activation") && (obj2.elements[i].value == 0) && (obj2.elements[i].checked == true))
				flag1 = true;
		}
    }
	if(flag1)
		return true;
	username= check_username();
	pswd= checkRemotePswd('remotepswd');
	port=check_port_in_range(0,65535);
	if (!username)
		return false;
	else{
		if(!pswd)
			return false;
		else{
			if(!port)
				return false
			else
				return true;
		}
	}
}

//SAMY - 27112007 - END
// -->
/* infobulle for URL: added by wissem 10102007 BEGIN*/
function setClasseNameS(elm, paramClassName)
{
	if (elm)
		if (elm.className.indexOf('selected') < 0)
			elm.className = paramClassName;
}

//SAMY - 10122007 - BEGIN

function valid_new_ip()
{
	ret = true;
	mac = document.getElementById("devices_mac").innerHTML;
	mac = mac.replace(/^\n+|\s+$/g, '');
	if(document.getElementById("modify_ip_mac"))
	{
		mac1 =  document.getElementById("modify_ip_mac").innerHTML;
		mac1 = mac1.replace(/^\n+|\s+$/g, '');
	}
	ip0 = document.getElementsByName("static_frm_ip0");
	ip1 = document.getElementsByName("static_frm_ip1");
	ip2 = document.getElementsByName("static_frm_ip2");
	ip3 = document.getElementsByName("static_frm_ip3");
	
	ip = ip0[0].value + "." + ip1[0].value + "." + ip2[0].value + "." + ip3[0].value;

        if(ip0[0].value=="192" && ip1[0].value=="168" &&  ip2[0].value=="1"  &&  ip3[0].value=="0")
           ret = false;

	for ( i = 0; i < StaticDhcpTab.length; i++)
	{
		if (ip == StaticDhcpTab[i])
		{
			if(document.getElementById("modify_ip_mac"))
			{
				if(StaticDhcpMac[i] != mac1)
					ret = false;
			}
			else
				ret = false;
		}

	}

	for( i = 0; i < listDeviceisdynamic.length; i++)
	{
		if( listDeviceisdynamic[i] == '1' && listDeviceIp[i] == ip && mac != listDeviceMac[i])
			ret=false;
	}
		
	
	if (ret == false)
		document.getElementById("dhcp_ip_exist_err").style.display = '';
	else
		document.getElementById("dhcp_ip_exist_err").style.display = 'none';
	
	return ret;

}

function valid_modified_ip()
{
	ret = true;
	mac = document.getElementById("devices_mac").innerHTML;	
	mac = mac.replace(/^\n+|\s+$/g, '');
	if(document.getElementById("modify_ip_mac")){
		mac1 =  document.getElementById("modify_ip_mac").innerHTML;
		mac1 = mac1.replace(/^\n+|\s+$/g, '');
	}
	ip0 = document.getElementsByName("ip0");
	ip1 = document.getElementsByName("ip1");
	ip2 = document.getElementsByName("ip2");
	ip3 = document.getElementsByName("ip3");
	ip = ip0[0].value + "." + ip1[0].value + "." + ip2[0].value + "." + ip3[0].value;
	for ( i = 0; i < StaticDhcpTab.length; i++){
		if (ip == StaticDhcpTab[i]){
			if(document.getElementById("modify_ip_mac")){
				if(StaticDhcpMac[i] != mac1)
					ret = false;
			}
			else
				ret = false;
		}
	}
	for( i = 0; i < listDeviceisdynamic.length; i++){
		if( listDeviceisdynamic[i] == '1' && listDeviceIp[i] == ip && mac != listDeviceMac[i])
			ret=false;
	}
	if (ret == false)
		document.getElementById("dhcp_ip_exist_err").style.display = '';
	else
		document.getElementById("dhcp_ip_exist_err").style.display = 'none';
	return ret;
}
var name_modewifi;
function appear_modewifi()
{
var obj, obj1;
var selected_mode;
eval('obj=document.form_contents.'+name_modewifi);
if (obj)
{
selected_mode = obj.value;
obj1 = document.getElementById('channel_select');

if(selected_mode == '1')
	obj1.style.display = 'none';
else
	obj1.style.display = '';

}
}

function appear_modewifi_loading ()
{
	if (navigator.userAgent.indexOf("MSIE") > -1) {
	window.attachEvent('onload', appear_modewifi);
	}
	else {
	window.addEventListener('load', appear_modewifi, false);
	}

}


//gestion de la liste des devices (Name,IP, MAC)

var listDeviceName = new Array();
var listDeviceIp = new Array();
var listDeviceMac = new Array();
var listDeviceisdynamic = new Array();

function majDevicesParam()
{
	var elem = document.form_contents.device_selected;
	if(elem)
	{	
		for(i=0;i<listDeviceName.length;i++)
		{
			if(elem.options[elem.selectedIndex].text == listDeviceName[i])
				document.getElementById("devices_mac").innerHTML = listDeviceMac[i];
		}
	}
}

//SAMY - 10122007 - END



//ANIS 01022008 - BEGIN


function showHelp(state)
{
	if(state==0)
		document.getElementById("window_help").style.display = "block";
	else
		document.getElementById("window_help").style.display = "none";	
}




function p_window_help(nom_page,lang){


if(document.getElementById("bt_help"))
{

document.getElementById("bt_help").style.visibility = "visible";


var tbody1 = document.getElementById("help"); 
	var div1 = document.createElement('DIV');
	div1.setAttribute('id', 'window_help');
	div1.style.display="none";
	tbody1.appendChild(div1);
	
	var table2 = document.createElement('TABLE');
	table2.className = 'contener';
	div1.appendChild(table2);
	
	var tbody2 = document.createElement('TBODY');
	table2.appendChild(tbody2);
	
	var tr2 = document.createElement('TR');
	tbody2.appendChild(tr2);
	var td5 = document.createElement('TD');
	td5.className = 'topleft';
	tr2.appendChild(td5);
	var td6 = document.createElement('TD');
	td6.className = 'top';
	tr2.appendChild(td6);
	var td7 = document.createElement('TD');
	td7.className = 'topright';
	tr2.appendChild(td7);
	
	var tr3 = document.createElement('TR');
	tbody2.appendChild(tr3);
	var td53 = document.createElement('TD');
	td53.className = 'left';
	tr3.appendChild(td53);
	var td63 = document.createElement('TD');
	tr3.appendChild(td63);
	
	var table20 = document.createElement('TABLE');
	table20.setAttribute('width', '100%');
	table20.setAttribute('height', '35');
	td63.appendChild(table20);
	
	var tbody20 = document.createElement('TBODY');
	table20.appendChild(tbody20);
	
	var tr30 = document.createElement('TR');
	tbody20.appendChild(tr30);
	var td530 = document.createElement('TD');
	td530.className = 'titlepage';
	var text_aide = document.createTextNode("Aide");
	td530.appendChild(text_aide);
	tr30.appendChild(td530);
	var td630 = document.createElement('TD');
	td630.className = 'close_help';
        td630.onclick=function(){showHelp(1);};
	
	var text_close = document.createTextNode("X");
	td630.appendChild(text_close);
	tr30.appendChild(td630);
	
	
	var td73 = document.createElement('TD');
	td73.className = 'right';
	tr3.appendChild(td73);


	
	var tr11 = document.createElement('TR');
	var td11 = document.createElement('TD');
	td11.className = 'titlesepleft';
	tr11.appendChild(td11);
	var td12 = document.createElement('TD');
	td12.className = 'titlesep';
	tr11.appendChild(td12);
	var td13 = document.createElement('TD');
	td13.className = 'titlesepright';
	tr11.appendChild(td13);
	tbody2.appendChild(tr11);
	
	
	var tr21 = document.createElement('TR');
	var td21 = document.createElement('TD');
	td21.className = 'left';
	tr21.appendChild(td21);
	var td22 = document.createElement('TD');
	td22.className = 'content';


        var object1= ce2('OBJECT', 'html/'+nom_page+'_'+lang+'.html', 'text/html');
        td22.appendChild(object1);


	
	
	tr21.appendChild(td22);
	var td23 = document.createElement('TD');
	td23.className = 'right';
	tr21.appendChild(td23);
	tbody2.appendChild(tr21);

	
	
	var tr31 = document.createElement('TR');
	var td31 = document.createElement('TD');
	td31.className = 'bottomleft';
	tr31.appendChild(td31);
	var td32 = document.createElement('TD');
	td32.className = 'bottom';
	
	var img1 = document.createElement('IMG');
	img1.setAttribute("src", "images/menu/vide.gif");
	img1.setAttribute("width", "1");
        img1.setAttribute("height", "1");
	td32.appendChild(img1);
	
	tr31.appendChild(td32);
	var td33 = document.createElement('TD');
	td33.className = 'bottomright';
	tr31.appendChild(td33);
	tbody2.appendChild(tr31);


}


}

// ANIS - 01022008 END

