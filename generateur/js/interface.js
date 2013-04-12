/*
 * interface.js
 * 
 * Gestion des événements dans genCrux
 * ( c ) 2012 Patrick cardona
 * 
 * Version : 1.3.2
 * 
 */ 

/* =================================================================== */
/* LICENCE
/* =================================================================== */
/*
@licstart  The following is the entire license notice for the 
    JavaScript code in this page.

	Copyright (C) 2012  Patrick CARDONA

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



// Initialisation  des données de la Barre de progression :
var pct=0;
var valmax=0;
var handle =0;
var navigateur = null;

/*
 * Gestion barre de progression
 */
function update(){
        pct = pct + 4;
        $("#barre").reportprogress(pct);
        if(pct == 100){
        	clearInterval(handle);
        	pct=0;
        	$("#enregistrement").show();
        	$("#label_barre").hide();
        	$("#exerciseur").show();
        	$("#bloc_barre").hide();
        }

}

/* **************************************************** */
/* 	GESTION DE L'INTERFACE...							*/
/* **************************************************** */

// Nécessite jQuery...

$("document").ready(function(){
	
	
/*
 * Quel navigateur ? Prévenir un souci avec Chrome en mode éditeur :
 */

if ( $.browser.webkit && !$.browser.opera && !$.browser.msie && !$.browser.mozilla ) {
	var userAgent = navigator.userAgent.toLowerCase();
	if ( userAgent.indexOf("chrome") === -1 ) { 
		navigateur = "safari";
	}
	else{
		navigateur = "chrome";
		var url = $.url();
		var protocole = url.attr('protocol');
		if (protocole == "file") {
			var msg = "Pour utiliser le mode 'éditeur' avec Chrome en accès local,<br />";
			msg += "c-à-d avec le protocole '" + protocole + "', veuillez consulter<br />";
			msg += "les remarques du fichier <a target='_blank' href='info_chrome.html'>LISEZMOI CHROME</a>.";
			$("#info_chrome").html(msg);
			// On désactive le mode éditeur
			//$("input[type=radio][name=choix_action][value=2]").attr("disabled",true);
		}
		
	}
}

	
	// On crée un objet de données oCrux :
	var crux = new oCrux();
	
	/*
	 * Données personnalisées
	 */
	$("#auteur").change(function(){
		if ( $("#auteur").val == "Patrick Cardona"){
			$("#url_auteur").val("http://patrick.cardona.free.fr/");
		}
	});
	
	
	
	
// Gestionnaire de l'aide contextuelle :
	
				
	$("a[title='aide copier']").click(function(){
		jAlert("Avec Windows, combinaison de touches : 'CTRL' + 'C'.<br />Avec Mac : 'CMD' + 'C'.","Aide : copier dans le presse-papier");
	});
	$("a[title='aide coller']").click(function(){
		jAlert("Avec Windows, combinaison de touches : 'CTRL' + 'V'.<br />Avec Mac : 'CMD' + 'V'.","Aide : coller à partir du presse-papier");
	});

/*
 * Préparation de l'interface
 */

// On masque le pied de page... pour l'afficher ensuite
$("footer").hide()
// On masque les boutons d'importation de glossaire, de création de grille...
$("#examiner_glossaire").hide();
$("#importer_glossaire").hide();
$("#creer").hide();
	
// Animation du logo initila : on le masque pour gagner de la place
	$("#logo").animate(
					{
					width:0,
					heigth: 0,
					top:0,
					opacity:0},{
						duration: 1500,
    					easing: 'linear',
    					complete: function(){
    						
				    			$("#etape1").fadeIn(3000);
				    			$("footer").fadeIn(4000);		
					}
	});   		

// Gestionnaire d'importation de glossaire :
	$("#glossaires").change(function(){
		$("#examiner_glossaire").show();
	});

// Gestionnaire des actions : si on clique sur un bouton Submit...
	$("input:submit").click(function(e){
		// On récupère le libellé du bouton cliqué.
		var monAction = $(this).val();
		// On va gérer les événements en fonction du libellé du bouton cliqué :
	
		/* SWITCH sur les actions */
		switch ( monAction ){
			case "Enregistrer les données éditoriales":
				var bonneSaisie = true;
				// Les données saisies sont-elles valides ?
				$("*[id*=edito_]").each(function(){
					if ( $(this).val().length == 0 ){ // Si une saisie est vide !
						var msg = "Le champ " + $(this).attr("name") + " est vide !";
						bonneSaisie = false;
						jAlert( msg, "Erreur de saisie" );
						return false;
					}
				}); // fin vérif saisie données édito

				if ( bonneSaisie == true ){ // La saisie est correcte
					// On stocke les données éditoriales
					crux.auteur = $("#edito_1").val();
					crux.theme = $("#edito_2").val();
					
					
					
					// On peut passer à l'étape suivante...
					// On masque l'étape actuelle et on dévoile la suivante...
					$("#titredeux").show();
					$("#titre").hide();
					$("#logo").hide();
					$("#etape2").show();
					$("#etape1").hide();
				}
			break; // Fin "Enregistrer les données éditoriales"
			
			
			case "Examiner ce glossaire":
				var fic = $("#glossaires").val();
				
				$.getJSON(fic, function(data){
				if (data.app_name == undefined || data.app_name != "Glossaire de JCruX"){
        				jAlert("Echec : format inconnu ou incompatible avec les glossaires de JCruX !","Erreur de format");
        				return false;	
        			}
					var info = "<p>Source de glossaire : " + fic + "<br />";
					info += "Thème : " + data.theme_source;
					info += "</p>";
					$("#infos_source_glossaire").html(info);
					$("#importer_glossaire").show();	
					
				});
					
				
			break;
			
			case "Importer ce glossaire":
				var fic = $("#glossaires").val();
				
				$.getJSON(fic, function(data){
					
					for (var i = 0;i < data.mots_source.length; i++){
								crux.mots.push( data.mots_source[i] );
								crux.indices.push( data.defs_source[i] );
							}
							// On actualise le tableau :
							var tableau = crux.tableau();
							$("#mots_saisis").html( tableau );
							// On rend le tableau visible :
							$("#mots_saisis").show();
							// On masque les colonnes : 1 & 4
							$("td:nth-child(1),th:nth-child(1)").hide();
							$("td:nth-child(4),th:nth-child(4)").hide();
							// On colore les lignes paires...
							$(".motdef tr:nth-child(even)").addClass("gris");
							// On montre le bouton supprimer
							$("#supprimer").show();
							if ( crux.mots.length > 0){
								$("#sauver").show();
							}
							$("#infos_source_glossaire").html("&nbsp;");
							$("#glossaires").val("");
							$("#importer_glossaire").hide();
							$("#examiner_glossaire").hide();	
				});
        							
        				
					
						
				
				
			break;
			
			case "Ajouter ce mot au glossaire":
				var bonneSaisie = true;
				// Les données saisies sont-elles valides ?
				$("*[id*=mot_]").each(function(){
					if ( $(this).val().length == 0 ){ // Si une saisie est vide !
						var msg = "Le champ " + $(this).attr("name") + " est vide !";
						bonneSaisie = false;
						jAlert( msg, "Erreur de saisie" );
						return false;
					}
				}); // fin vérif saisie des mots et indices

				if ( bonneSaisie == true ){ // La saisie est correcte
					// On stocke le mot et son indice
					
					crux.mots.push( crux.capitalise( $("#mot_1").val() ) );
					crux.indices.push( $("#mot_2").val() );
					
					// On actualise le tableau :
					var tableau = crux.tableau();
					$("#mots_saisis").html( tableau );
					
					// On alterne la couleur pour les lignes paires :
					$(".motdef tr:nth-child(even)").addClass("gris");
					// On vide le formulaire pour la saisie suivante :
					$("*[id*=mot_]").each(function(){
						$(this).val("");
					}); // fin effacement
					
					// On rend le tableau visible :
					$("#mots_saisis").show();
					// Et idem pour la bouton "supprimer" :
					$("#supprimer").show();
					// On masque colonnes 1 & 4
					$("td:nth-child(1),th:nth-child(1)").hide();
					$("td:nth-child(4),th:nth-child(4)").hide();	
					
					
				} // Fin if bonne saisie
				
			if ( crux.mots.length > 0){
				$("#sauver").show();
			}			
				
			break; // fin "Ajouter ce mot à la liste"
			
			case "Supprimer un mot":
				// On montre colonnes 1 & 4 : # et action
				$("td:nth-child(1),th:nth-child(1)").show();
				$("td:nth-child(4),th:nth-child(4)").show();
				
				$(".motdef").addClass("motdef_sensible");
				
				jAlert ("Cliquez sur la croix rouge pour supprimer le mot concerné.","Aide : suppression d'un mot");
				
				// Gestion event : si on clique sur une croix rouge
				$(".motdef tbody tr td:nth-child(4)").click(function(){
				var id = $(this).attr("id"); // Id de la forme 'ligne_x'
				var idx = id.charAt(6); // x est le 7e et on part de zéro...
				
				$(".motdef tbody tr:nth-child("+( parseInt(idx) + 1)+")").addClass("fond_rouge");
				
				jConfirm('Supprimer le mot '+( parseInt(idx) + 1)+'?',"Supression d'un mot", function(r){
    				if(r){ 
        			// Suppression du mot :
        			var tableau = crux.supprimeMot(idx);
        			$("#mots_saisis").html( tableau );
        			if (crux.mots.length > 0){
								$("#supprimer").show();
								// On masque colonnes 1 et 4
								$("td:nth-child(1),th:nth-child(1)").hide();
								$("td:nth-child(4),th:nth-child(4)").hide();
								// On colore les lignes paires...
								$(".motdef tr:nth-child(even)").addClass("gris");
							}		
        			}
        			else{
        				// On change d'avis : statu quo
        				$(".fond_rouge").removeClass("fond_rouge");
        				$(".motdef_sensible").removeClass("motdef_sensible");
        				$("#supprimer").show();
        				// On masque colonnes 1 & 4
						$("td:nth-child(1),th:nth-child(1)").hide();
						$("td:nth-child(4),th:nth-child(4)").hide();
						// On colore les lignes paires...
						$(".motdef tr:nth-child(even)").addClass("gris");	
        			}
				}); // Fin dialogue suppression de mot
       			
			}); // fin click sur ligne de tableau
			break;
			
			
			
			
			
			case "Sauver le glossaire":
				
				// A reprendre avec le code final
			break;
			
			case "Créer la grille":
				
				var dim = 20;
				var grille = new oJCW(dim); // Nouvelle grille de 20x20
				var mots = crux.mots.slice();
				grille.BuildCrossword( mots ); // On essaie de construire une grille 
											// avec les mots saisis							
				var schema = grille.CrosswordTable();
				
				// On stocke les mots placés...
				crux.Horizontal = grille.Horizontal;
				crux.Vertical = grille.Vertical;
				// Dimension unique (grille carrée)
				crux.dim = dim;
				
				$("#etape3").show();
				$("#schema").html( schema );
				$("#etape2").hide();
				
				
			break;
			
			case "Revenir au glossaire":
				$("#etape2").show();
				$("#etape3").hide();
				
			break;
			
			case "Afficher une autre disposition":
				var redim = $("#dimension").val(); // On récupère la dimension de la grille
				var mots = crux.mots.slice(); // On copie la liste de mots
				var grille = new oJCW( redim ); // Nouvelle grille : 20x20 par défaut
				grille.BuildCrossword( mots ); // On essaie de construire une grille 
											// avec les mots saisis
				var schema = grille.CrosswordTable();
				// On stocke les mots placés...
				crux.Horizontal = grille.Horizontal;
				crux.Vertical = grille.Vertical;
				crux.dim = redim;
				
				$("#schema").html( schema );
			break;
			
			case "Choisir cette disposition" :
				
				// On génère et on stocke le code JSON du glossaire, le code data.js de la grille :
				$("#bloc_barre").show();
				handle = setInterval("update()",25);
				crux.genereCode();
				
				// Affichage / masquage des étapes suivantes
				$("div#etape10").show();
				$("div#etape3").hide();
				
				
				// On génère le code, l'archive et le lien pour la télécharger...
				var leCode = new monCode(crux.fic_code, crux.code, crux.glossaire);
				leCode.prepareLien();
				/*
				 * Remarque importante :
				 * L'affichage du bloc exerciseur et du téléchargement du code sont consécutifs à la fin 
				 * de l'affichage de la barre de progression : cf. la fonction update() en début de fichier.
				 */
			break;
		
		
			case "Télécharger une copie de l'interpréteur de grille JCruX":
			
    			window.location.href = "https://github.com/pcardona34/grille/archive/master.zip";
			
			break;
				
			
			
			default:
				jAlert("Le bouton " + monAction + " n'a pas de gestionnaire d'événement!","Erreur de gestion de l'interface");
		} // Fin de switch
	
	e.preventDefault(); // Pour empêcher la soumission effective du formulaire
	
	}); // Fin de input:submit.click


	
	
}); // fin document.ready
