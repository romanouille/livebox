/*****************************************************
	File: kb_block.js
	Version: 1.0
	Date : 19/06/2006
	Author : Emmanuel THOMAS (SII for FT RD)
********************************************************/

var saveKeyDown = null;

function kb_block(){
saveKeyDown = document.onkeydown;
document.onkeydown = block;
}

function kb_unblock(){
document.onkeydown = saveKeyDown;

}
var block = function(event){
	return false;
}