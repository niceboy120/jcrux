/* 
 * apropos.js
 * A propos
 * 
 * ( c ) 2012 Patrick Cardona
 */


/* =================================================================== */
/* LICENCE
/* =================================================================== */
/*
@licstart  The following is the entire license notice for the 
    JavaScript code in this page.

Copyright (C) 2012  Patrick CARDONA - A propos

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

function oApropos( _auteur, _annee, _nom_appli, _version) {
	this.merci = new Array();
	this.auteur = _auteur;
	this.nom_appli = _nom_appli;
	this.annee = _annee;
	this.version = _version;	
}

oApropos.prototype.ajoute = function(_app, _url_site, _lic, _url_source) {
	var ref = new Array(_app, _url_site, _lic, _url_source);
	this.merci.push( ref );	
}

oApropos.prototype.licence = function(_type){
	switch (_type){
		case "GPL":
			var lic = "<a href='http://www.gnu.org/licenses/gpl-3.0.html'>Licence GPL</a>";
			return lic;
		break;
		
		case "LGPL":
			var lic = "<a href='http://www.gnu.org/copyleft/lesser.html'>Licence LGPL</a>";
			return lic;
		break;
		
		case "BSD":
			var lic = "<a href='http://www.freebsd.org/copyright/license.html'>Licence BSD</a>";
			return lic;
		break;
		
		case "MIT":
			var lic = "<a href='http://www.opensource.org/licenses/mit-license.php'>Licence MIT</a>";
			return lic;
		break;
		
		case "BOTH":
			var lic = "<a href='http://www.gnu.org/licenses/gpl-3.0.html'>Licence GPL</a> et ";
			lic += "<a href='http://www.opensource.org/licenses/mit-license.php'>Licence MIT</a>";
			return lic;
		break;
		
		default:
			var lic = "Licence inconnue !";
			return lic;
	}
}

oApropos.prototype.affiche = function() {
	var msg = "<h1 class=\"apropos\">À propos de "+ this.nom_appli +" "+ this.version +"</h1>";
	msg += "<h2 class=\"apropos\">©"+ this.annee +" "+ this.auteur +"</h2>";
	msg += "<p class=\"apropos\">Cette application est un logiciel libre, réalisé grâce à :</p><ul>";
	for (var i = 0; i < this.merci.length ; i++){
		msg	+= "<li class=\"apropos\"><a href=\""+ this.merci[i][1] +"\">"+ this.merci[i][0] +"</a>";
		msg += " ("+ this.licence(this.merci[i][2]) +" - <a href='"+ this.merci[i][3] +"'>code source</a>)</li>";
	}
	msg += "</ul>";
	jAlert ( msg, "À propos..." );	
}


var apropos = new oApropos("Patrick Cardona", "2012", "JCruX", "1.3.2");

// App ou API courantes :
apropos.ajoute("jQuery", "http://jquery.com/", "BOTH", "http://docs.jquery.com/Source_Code");
apropos.ajoute("jQuery Alert Dialogs de Cory S.N. LaViska", "http://www.abeautifulsite.net/blog/2008/12/jquery-alert-dialogs/", "BOTH", "http://labs.abeautifulsite.net/archived/jquery-alerts/jquery.alerts-1.1.zip");
apropos.ajoute("Plugin jQuery ProgressBar de Josh Bush","http://digitalbush.com/projects/progress-bar-plugin/","MIT","http://digitalbush.com/wp-content/uploads/2007/02/jqueryprogressbar.js");
apropos.ajoute("JSZip de Stuart Knightley","http://stuartk.com/jszip","BOTH","http://github.com/Stuk/jszip/zipball/master");
apropos.ajoute("JQuery URL Parser plugin de Mark Perkins","https://github.com/allmarkedup/jQuery-URL-Parser","MIT","https://raw.github.com/allmarkedup/jQuery-URL-Parser/master/jquery.url.js");


// App ou API spécifiques du projet
apropos.ajoute("Le générateur de grille (JCW) de Michael Johnson ", "http://startup-something.com/post/index/36/Open-Source-Javascript-Crossword-code", "MIT", "http://www.startup-something.com/files/cross.html");
apropos.ajoute("L'interpréteur de grille (JCE) de Pavel Simakov","http://www.softwaresecretweapons.com/jspwiki/cword","LGPL","http://www.softwaresecretweapons.com/jspwiki/articles/cword/oy-cword-1.0.zip");
apropos.ajoute("Signature des mots en hachage MD5 de Paul Johnston","http://pajhome.org.uk/crypt/md5/","BSD","http://pajhome.org.uk/crypt/md5/scripts.html");
apropos.ajoute("JCruX de Patrick Cardona", "http://patrick.cardona.free.fr/", "GPL", "https://code.google.com/p/jcrux/");

// Gestion de l'interface
$("document").ready(function(){
	// Si on clique sur apropos :
	$("a[title=apropos]").click(function(e){
		apropos.affiche();
		e.preventDefault();	
	});
});
