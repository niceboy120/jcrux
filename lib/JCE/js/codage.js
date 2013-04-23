/* codage.js */
// ( c ) 2012 Patrick Cardona
// Version : 1.0.0

/* =================================================================== */
/* LICENCE
/* =================================================================== */
/*
@licstart  The following is the entire license notice for the 
    JavaScript code in this page.

Copyright (C) 2012  Patrick CARDONA - Reperage

    The JavaScript code in this page is free software: you can
    redistribute it and/or modify it under the terms of the GNU
    General Public License (GNU GPL) as published by the Free Software
    Foundation, either version 3 of the License, or (at your option)
    any later version.  The code is distributed WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS
    FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

    As additional permission under GNU GPL version 3 section 7, you
    may distribute non-source (e.g., minimized or compacted) forms of
    that code without the copy of the GNU GPL normally required by
    section 4, provided you include this license notice and a URL
    through which recipients can access the Corresponding Source.
    
@licend  The above is the entire license notice
    for the JavaScript code in this page.    
*/

// Etend les méthodes de oySign : voir JCE

oySign.prototype.reponseCryptee = function(_guid, _mot){
	this.guid = _guid;
	this.mot = _mot;
	this.motCrypte;
}

oySign.prototype.calcule = function(){
	var crypto = this.hex_hmac_md5(this.guid, this.mot);
	var motCode = new Array();
	for (var i=0; i < crypto.length; i++){
		for(var i in crypto){
			
			motCode.push(crypto[i]);
		}
	}
	var mot ="";
	for (var i=0; i < crypto.length; i++){
		mot += String(motCode[i]);
	}
	this.motCrypte = mot;	
}

/* Utilisation :

var rep = new oySign();
rep.reponseCryptee(guid, mot);
rep.calcule();
var resultat = rep.motCrypte; */
