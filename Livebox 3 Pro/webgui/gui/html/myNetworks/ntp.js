var ntpTimezone = new Object;
ntpTimezone["UTC-12_00_INTERNATIONAL_DATE_LINE_WEST"] = 9;
ntpTimezone["UTC-11_00_MIDWAY_ISLAND_SAMOA"] = 19; 
ntpTimezone["UTC-10_00_HAWAII"] = 29; 
ntpTimezone["UTC-09_00_ALASKA"] = 39; 
ntpTimezone["UTC-08_00_PACIFIC_TIME_(US/CANADA)_TIJUANA"] = 49; 
ntpTimezone["UTC-07_00_ARIZONA"] = 59; 
ntpTimezone["UTC-07_00_MOUNTAIN_TIME_(US/CANADA)"] = 59; 
ntpTimezone["UTC-07_00_CHIHUAHUA_MAZATLAN"] = 59; 
ntpTimezone["UTC-06_00_CENTRAL_AMERICA"] = 69; 
ntpTimezone["UTC-06_00_CENTRAL_TIME_(US/CANADA)"] = 69; 
ntpTimezone["UTC-06_00_GUADALAJARA_MEXICO_CITY_MONTERREY"] = 69; 
ntpTimezone["UTC-06_00_SASKATCHEWAN"] = 69; 
ntpTimezone["UTC-05_00_BOGOTA_LIMA_QUITO"] = 79; 
ntpTimezone["UTC-05_00_EASTERN_TIME_(US/CANADA)"] = 79; 
ntpTimezone["UTC-05_00_INDIANA_(EAST)"] = 79; 
ntpTimezone["UTC-04_00_ATLANTIC_TIME_(CANADA)"] = 89; 
ntpTimezone["UTC-04_00_CARACAS_LA_PAZ"] = 89; 
ntpTimezone["UTC-04_00_SANTIAGO"] = 89; 
ntpTimezone["UTC-03_30_NEWFOUNDLAND"] = 94; 
ntpTimezone["UTC-03_00_BRASILIA"] = 99; 
ntpTimezone["UTC-03_00_BUENOS_AIRES_GEORGETOWN"] = 99; 
ntpTimezone["UTC-03_00_GREENLAND"] = 99; 
ntpTimezone["UTC-02_00_MID-ATLANTIC"] = 109;
ntpTimezone["UTC-01_00_AZORES_CAPE_VERDE_IS"] = 119;
ntpTimezone["UTC-00_CASABLANCA_LISBON_MONROVIA"] = 129;
ntpTimezone["UTC-00_DUBLIN_EDINBURGH_LONDON"] = 129;
ntpTimezone["UTC+01_00_AMSTERDAM_BERN_ROME_STOCKHOLM"] = 139;
ntpTimezone["UTC+01_00_BELGRADE_BERLIN_BUDAPEST_LJUBLJANA"] = 139;
ntpTimezone["UTC+01_00_BRUSSELS_COPENHAGEN_MADRID"] = 139;
ntpTimezone["UTC+01_00_PARIS"] = 139;
ntpTimezone["UTC+01_00_BRATISLAVA_PRAGUE_VIENNA"] = 139;
ntpTimezone["UTC+01_00_SARAJEVO_SKOPJE_WARSAW_ZAGREB"] = 139;
ntpTimezone["UTC+01_00_WEST_CENTRAL_AFRICA"] = 139;
ntpTimezone["UTC+02_00_ATHENS_ISTANBUL_MINSK"] = 149;
ntpTimezone["UTC+02_00_BUCHAREST_CAIRO"] = 149;
ntpTimezone["UTC+02_00_HARARE_PRETORIA"] = 149;
ntpTimezone["UTC+02_00_HELSINKI_KYIV_RIGA_SOFIA_TALLINN_VILNIUS"] = 149;
ntpTimezone["UTC+02_00_JERUSALEM"] = 149;
ntpTimezone["UTC+03_00_BAGHDAD_KUWAIT_RIYADH"] = 159;
ntpTimezone["UTC+03_00_MOSCOW_ST_PETERSBURG_VOLGOGRAD"] = 159;
ntpTimezone["UTC+03_00_NAIROBI"] = 159;
ntpTimezone["UTC+03_30_TEHRAN"] = 165;
ntpTimezone["UTC+04_00_ABU_DHABI_MUSCAT"] = 169;
ntpTimezone["UTC+04_00_BAKU_TBILISI_YEREVAN"] = 169;
ntpTimezone["UTC+04_30_KABUL"] = 174;
ntpTimezone["UTC+05_00_EKATERINBURG"] = 179;
ntpTimezone["UTC+05_00_ISLAMABAD_KARACHI_TASHKENT"] = 179;
ntpTimezone["UTC+05_30_CHENNAY_KOLKATA_MUMBAL_NEW_DELHI"] = 184;
ntpTimezone["UTC+05_45_KATMANDU"] = 186;
ntpTimezone["UTC+06_00_ALMATY_NOVOSIBIRSK"] = 189;
ntpTimezone["UTC+06_00_ASTANA_DHAKA"] = 189;
ntpTimezone["UTC+06_30_RANGOON"] = 194;
ntpTimezone["UTC+07_00_BANGKOK_HANOI_JAKARTA"] = 199;
ntpTimezone["UTC+07_00_KRASNOYARSK"] = 199;
ntpTimezone["UTC+08_00_BEIJING_CHONGQING_HONG_KONG_URUMQI"] = 209;
ntpTimezone["UTC+08_00_IRKUTSK_ULAAN_BATAAR"] = 209;
ntpTimezone["UTC+08_00_KUALA_LUMPUR_SINGAPORE"] = 209;
ntpTimezone["UTC+08_00_PERTH_TAIPEI"] = 209;
ntpTimezone["UTC+09_00_OSAKA_SAPPORO_TOKYO"] = 219;
ntpTimezone["UTC+09_00_SEOUL_YAKUTSK"] = 219;
ntpTimezone["UTC+09_30_ADELAIDE_DARWIN"] = 224;
ntpTimezone["UTC+10_00_BRISBANE"] = 229;
ntpTimezone["UTC+10_00_CANBERRA_MELBOURNE_SYDNEY"] = 229;
ntpTimezone["UTC+10_00_GUAM_PORT_MORESBY"] = 229;
ntpTimezone["UTC+10_00_HOBART_VLADIVOSTOK"] = 229;
ntpTimezone["UTC+11_00_MAGADAN_SOLOMON_IS_NEW_CALEDONIA"] = 239;
ntpTimezone["UTC+12_00_AUCKLAND_WELLINGTON"] = 249;
ntpTimezone["UTC+12_00_FIJI_KAMCHATKA_MARSHALL_IS"] = 249;
ntpTimezone["UTC+13_00_NUKUALOFA"] = 259;

function ntp_updateEarthMap(newValue) {
	if(newValue) {
		$("#ntpmapselection").css('left', ntpTimezone[newValue]+'px');
	}
}


//on crée la variable qui permettra de relancer la fonction sur le bon fuseau horaire
var fuseau = 0;

function heure_gmt() {
	if(fuseau == 0){
		suffix = "Z";
	}else if (fuseau == -1){
		suffix = "A";
	}else if (fuseau == -2){
		suffix = "B";
	}else if (fuseau == -3){
		suffix = "C";
	}else if (fuseau == -4){
		suffix = "D";
	}else if (fuseau == -5){
		suffix = "E";
	}else if (fuseau == -6){
		suffix = "F";
	}else if (fuseau == -7){
		suffix = "G";
	}else if (fuseau == -8){
		suffix = "H";
	}else if (fuseau == -9){
		suffix = "I";
	}else if (fuseau == -10){
		suffix = "J";
	}else if (fuseau == -11){
		suffix = "K";
	}else if (fuseau == -12){
		suffix = "L";
	}else if (fuseau == 1){
		suffix = "M";
	}else if (fuseau == 2){
		suffix = "N";
	}else if (fuseau == 3){
		suffix = "O";
	}else if (fuseau == 4){
		suffix = "P";
	}else if (fuseau == 5){
		suffix = "Q";
	}else if (fuseau == 6){
		suffix = "R";
	}else if (fuseau == 7){
		suffix = "S";
	}else if (fuseau == 8){
		suffix = "T";
	}else if (fuseau == 9){
		suffix = "U";
	}else if (fuseau == 10){
		suffix = "V";
	}else if (fuseau == 11){
		suffix = "W";
	}else if (fuseau == 12){
		suffix = "X";
	}else if (fuseau == -1){
		suffix = "Y";
	}
	
	//on place le 'fuseau' dans la variable qu'on rappelera à la fin de la fonction
	memoire = fuseau;
	//on récupère l'heure du système
	var x = new Date();
	//on intercepte l'heure GMT
	var heure_gmt_temp = x.getUTCHours();
	//on la transforme pour obtenir l'heure du fuseau horaire demandé
	var heure_gmt = heure_gmt_temp + fuseau;
	
	var year = x.getUTCFullYear();
	var month = x.getUTCMonth()+1;
	var day = x.getUTCDate();
	
	//quelques corrections pour rétablir des heures inférieures à 0H et supérieures à 23H
	if ( heure_gmt < 0 ) {
		heure_gmt = 24 + heure_gmt;
	}
	if (heure_gmt > 23) {
		heure_gmt = heure_gmt - 24;
	}
	//on ajoute un zéro (0) devant si les heures sont inférieures à 10 
	if (heure_gmt <= 9) heure_gmt = "0" + heure_gmt;
	//on intercepte les minutes
	var minutes = x.getMinutes();
	//on ajoute un zéro (0) devant si les minutes sont inférieures à 10
	if (minutes <= 9) minutes = "0" + minutes;
	//on intercepte les secondes
	var secondes = x.getSeconds();
	//on ajoute un zéro (0) devant si les secondes sont inférieures à 10
	if (secondes <= 9) secondes = "0" + secondes;
	if (month <= 9) month = "0" + month;
	if (day <= 9) day = "0" + day;
	
	//la chaine qui affichera l'heure sur le fuseau demandé
	var gmt = year + "-" + month + "-" + day + "T" + heure_gmt  + ":" + minutes + ":" + secondes + suffix;
	//on place les deux heures dans le formulaire
	
	if($("#CurrentLocalTime")[0] != undefined){
		$("#CurrentLocalTime")[0].setDataValue(gmt);
	}
}

function getGmt (timeZone) { //timeZone ex : UTC+-13_00_NUKUALOFA
	var diffGMT = 0;
	var indexOp = timeZone.indexOf("+", 0);
	if (indexOp == -1) {
		indexOp = timeZone.indexOf("-", 0);
		var diff = timeZone.substring(indexOp+1,indexOp+3);
		diffGMT = 0 - parseInt(diff);
	}
	else {
		var diff = timeZone.substring(indexOp+1,indexOp+3);
		diffGMT = parseInt(diff);
	}
	return diffGMT;
}

var gmtTimer;

jQuery.orange.config.areacontent.ntp = {
	postParse: function() {	
		$("#ntpmapselection").css('left', ntpTimezone["UTC-12_00_INTERNATIONAL_DATE_LINE_WEST"]+'px');
		$("#ntptimezone").bind("change", function(event, newValue) {
			ntp_updateEarthMap(newValue);
		});
		$("#ntptimezone select").bind("change keyup", function(event) {
			var newValue = $("#ntptimezone")[0].getDataValue();
			fuseau = getGmt (newValue);
			clearTimeout(gmtTimer);
			gmtTimer = setInterval(function(){heure_gmt()},1000);
			ntp_updateEarthMap(newValue);
		});
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_ntp.html");
		});
	},
	postLoad:function(){
		gmtTimer = setInterval(function(){heure_gmt()},1000);
	}
};