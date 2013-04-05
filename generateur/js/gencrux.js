// genCrux.js
// ( c ) 2012 Patrick cardona
// Version : 1.2.0

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
/* =================================================================== */
/* !!!!!!!!!!!!!!!! AVERTISSEMENT  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* =================================================================== */
/* 
	!!! IMPORTANT !!! Ne touchez pas à ce fichier à moins de posséder de solides
	connaissances en javascript, DOM et JQuery ! 
	
	Pour générer les données de l'exercice,
	utilisez le Générateur de JCrux, genCruX.html !!!
*/
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */

/* **************************************************** */
/* 	METHODES ET FONCTIONS...								*/
/* **************************************************** */

var glossaire = false; // drapeau pour l'importation d'un glossaire

function oCrux(){

// Propriétés
this.auteur;
this.theme;
this.mots = new Array();
this.indices = new Array();
this.defs = new Array();
this.guid; // identification unique de la grille
this.Horizontal = new Array(); // Pour stocker les mots placés dans la grille
this.Vertical = new Array(); // Idem
this.dim; // dimension héritée de la grille
this.url_exit;
this.code = " ";
this.fic_code;
this.glossaire;	
}

// On transforme le mot saisi en capitales sans accents...
// On dissocie les ligature : œ
oCrux.prototype.capitalise = function(_mot){
	var trans = _mot.toUpperCase();
	var reg = new RegExp( /[ÉÈÊË]/g );
	trans = trans.replace(reg,"E");
	reg = new RegExp( /[ÂÀ]/g );
	trans = trans.replace(reg,"A");
	reg = new RegExp( /[ÎÏ]/g );
	trans = trans.replace(reg,"I");
	reg = new RegExp( /[ÛÜÙ]/g );
	trans = trans.replace(reg,"U");
	reg = new RegExp( /[Ô]/g );
	trans = trans.replace(reg,"O");
	reg = new RegExp( /[Œ]/g );
	trans = trans.replace(reg,"OE");
	return trans;	
}

oCrux.prototype.tableau = function(){
	var tab = " ";
	if (this.mots.length > 0){
		// Le glossaire contient des mots...
		// On peut afficher le tableau du glossaire & on peut afficher le bouton de génération de la grille...
		$("#creer").show();
		// Tableau du glossaire :
		var tab = "<table class='motdef'>";
		tab+="<thead><tr><th>#</th><th>Mot</th><th>Définition</th><th class='action'>Action</th></tr></thead>";
		tab += "<tbody>";
		
		for (var i=0; i < this.mots.length; i++){
			tab+= "<tr>";
			tab+= "<td>"+ (i + 1) +"</td>";
			tab+= "<td>"+ this.mots[i] +"</td>";
			tab+= "<td>"+ this.indices[i] +"</td>";
			tab+= "<td id='ligne_"+ i +"' class='rouge' class='action'>X</td>";
			tab+= "</tr>";
		}
		tab+= "</tbody></table>";
		
	}
	else{
		tab = "<p>La liste est vide.</p>";
		// Pas de grille possible :
		$("#creer").hide();
	}
	return tab;
}


oCrux.prototype.supprimeMot = function(_idx){
	this.mots.splice(_idx,1);
	this.indices.splice(_idx,1);
    var html = this.tableau();
  	return html;
}

oCrux.prototype.stockeDefs = function(){
	for (var i=0; i < this.mots.length; i++){
		var mot = this.mots[i];
		this.defs[mot] = this.indices[i];	
	}
}

oCrux.prototype.voirDef = function(_mot){
	return this.defs[_mot];	
}

oCrux.prototype.ecritGlossaire = function(){
	var gloss = new Object;
	gloss.app_name = "Glossaire de JCruX";
	gloss.theme_source = this.theme;
	gloss.mots_source = new Array();
	gloss.defs_source = new Array();
	
	for (var i = 0; i < this.mots.length; i++){
		gloss.mots_source.push(this.mots[i]);
		gloss.defs_source.push(this.indices[i]);	
	}
	return JSON.stringify(gloss);
}



oCrux.prototype.ecritCode = function (){
	
	// On prépare l'encodage MD5 des réponses :
	/*var rep = new oySign();
	rep.reponseCryptee(guid, mot);
	rep.calcule();
	rep.motCrypte;*/
	 
	var code = "var oygCrosswordPuzzle = new oyCrosswordPuzzle (\n";
	code += "\"" + this.guid + "\",\n";
	code += "\"./JCE\",\n";
	code += "\"/a/a\",\n";
	code += "\"Mots croisés\",\n";
	code += "\"" + this.theme + "\",\n";
	code += "[\n";
	for(var i=0; i<this.Vertical.length; i++){
		// Pour débogage
		// alert (this.Vertical[i]);
		// On crypte la réponse :
		var rep = new oySign();
		rep.reponseCryptee(this.guid, this.Vertical[i][2]);
		rep.calcule();
		var crypto = rep.motCrypte;
 		if(i == 0){
 			code += "new oyCrosswordClue(";
 		}
 		else{
 			code += ",new oyCrosswordClue(";
 		} 
 		code += this.Vertical[i][2].length; // Longueur du mot
 		code += ",\"" + this.voirDef(this.Vertical[i][2]) + "\""; // Définition 
 		code += ",\"" + this.Vertical[i][2]; // le mot
 		code += "\",\"" + crypto; // empreinte MD5 du mot
 		code += "\",1,"; // 1 : direction verticale
 		code += this.Vertical[i][1]; // x
 		code += "," + (this.Vertical[i][0] - this.Vertical[i][2].length) + ")\n"; // y - longueur mot
 	}
 	for(var i=0; i<this.Horizontal.length; i++){
 		// alert ( this.Horizontal[i] );
 		// On crypte la réponse :
		var rep = new oySign();
		rep.reponseCryptee(this.guid, this.Horizontal[i][2]);
		rep.calcule();
		var crypto = rep.motCrypte;
 		code += ",new oyCrosswordClue(";
 		code += this.Horizontal[i][2].length; // longueur du mot
 		code += ",\"" + this.voirDef(this.Horizontal[i][2]) + "\""; // Définition
 		code += ",\"" + this.Horizontal[i][2]; // mot
 		code += "\",\"" + crypto; // empreinte MD5 du mot
 		code += "\",0,"; // 0 : direction horizontale
 		code += (this.Horizontal[i][1] - this.Horizontal[i][2].length); // x - longueur du mot
 		code += "," + this.Horizontal[i][0] + ")\n"; // y
 	}
	code += "],\n";
	code += this.dim + "," + this.dim + ");\n";
	code += "oygCrosswordPuzzle.publisherName = \"" + this.auteur + "\";\n";
	code += "oygCrosswordPuzzle.leaveGameURL = \"./licence.html\";\n";
	code += "oygCrosswordPuzzle.canTalkToServer = false;\n";
	this.code = code;
}

// Génération aléatoire du guid de la grille
oCrux.prototype.genAleat = function (){
	this.guid = Math.round(Math.random()*10000000000);	
}

oCrux.prototype.genereCode = function(){
	
	// On récupère le nom du thème,
	// et on adapte le nom du fichier :
	var reg = /é/g;
	var nom_fic_un = this.theme.replace(reg,"e");
	reg = / /g;
	var nom_fic_deux = nom_fic_un.replace(reg,"_");
	reg = /n°/g;
	var nom_fic = nom_fic_deux.replace(reg,"").toLowerCase();
	// On stocke les infos : nom du fichier ou du dossier sans extension
	this.fic_code = escape(nom_fic);
	$("#nom_fic").html(this.fic_code);
	
	// Le glossaire :
	this.glossaire = this.ecritGlossaire();
	
	// On crée le guid de la grille:
	this.genAleat();
	// On stocke les définitions pour les récupérer dans data.js
	this.stockeDefs();
	this.ecritCode();
	
}

/*
 * Gestion de la publication de l'exercice, archive zip, etc.
 *
 */

// Initialisation du téléchargement du code généré
function monCode(_fic_code, _code, _glossaire){
	this.fic_code = _fic_code;
	this.code = _code;
	this.glossaire = _glossaire;
	this.data = "data:application/zip;base64,";
}

monCode.prototype.prepareLien = function(){
		
	// On masque la zone d'enregistrement pour l'instant
	$("#enregistrement").hide();
	
	var lien = "Cliquez sur le bouton ci-dessous pour télécharger les données de la grille.<br />";
	
	if($.browser.mozilla){
		lien += "Veillez à supprimer l'extension <em>.part</em> à la fin du fichier.</p>";
	}
	if(navigateur == "safari"){
		lien += "Afin de renommer le fichier d'archive, baptisé 'inconnu' par Safari,<br />";
		lien += "il est recommandé de faire un clic du bouton de droite (ou ctrl + clic sous Mac)<br />";
		lien += "et de choisir l'option de menu : 'télécharger le fichier lié sous&hellip;'<br />";
		lien += "<code>Archive.zip</code> semble un nom convenable."
	}
	
	/*
	 * On prépare une archive zip du code :
	 */
	var zip = new JSZip();
	zip.folder(this.fic_code);
	zip.file(this.fic_code + "/glossaire_" + this.fic_code +".json", this.glossaire);
	zip.file(this.fic_code + "/data.js", this.code);
	var info = "Conservez sur votre ordinateur le fichier de glossaire glossaire_"+ this.fic_code +".json.\n";
	info += "Procurez-vous une copie de l'interpréteur de grille JCruX, 'grille.zip'. Décompressez cette archive.\n";
	info += "Déplacez le fichier 'data.js' du présent dossier dans le dossier 'grille' de l'interpréteur.\n";
	info += "Votre pouvez maintenant publier votre grille au moyen du dossier 'grille' mis à jour.";
	zip.file(this.fic_code + "/LISEZMOI.txt",info);
	this.data += zip.generate();
	
	lien += "<p><a download='archive_"+ this.fic_code +".zip' title='donnees' href='" + this.data + "'>Données de la grille</a></p>";
	$("#lien_code").html(lien);
	
}
