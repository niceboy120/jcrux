
// c. 2009 BigAtticHouse.com (Michael Johnson)
// MIT style license as long as you include these comment lines in your code... do with it as you will.
// Posted 11/19/2009 www.startup-something.com

// Réécriture en POO par Patrick Cardona : http://patrick.cardona.free.fr/
// Correction du bogue d'inversion des tableaux Horizontal et Vertical
// Voir en fin de fichier... le commentaire du schéma (var schema)

// Paramètres de la grille
function oJCW(_dim){
this.board = Array();
this.board_width = _dim; // Largeur de la grille
this.board_board = _dim; // Hauteur de la grille
this.Horizontal = Array();
this.Vertical = Array();
}
 

oJCW.prototype.ClearBoard = function(){
   this.board = Array();
   for(var x=0;x<this.board_width;x++){
     this.board.push(Array())
     for(var y=0;y<this.board_board;y++){
       this.board[x].push(' ');    
     }
   }
}

 
oJCW.prototype.MatchedLetters = function(Word){
  var Locations = Array(); 
  for(var x=0;x<this.board_width;x++){
     for(var y=0;y<this.board_board;y++){
       var c = this.board[x][y].toUpperCase();
       if (Word.indexOf(c)>-1){
           Locations.push(Array(c,x,y));  //'M',1,2
       }
     } 
   }
  return Locations;
}

oJCW.prototype.BlankPrior = function (x,y,dx,dy,word){
  dx=dx*-1; dy=dy*-1;
  x=x+dx; y=y+dy;
  if(this.board[x]){
   if (this.board[x][y]==" "){ return true; } else {return false;}  
  }  
  return true; 
}


oJCW.prototype.BlankAfter = function (x,y,dx,dy,word){
  dx=dx*(word.length+1); dy=dy*(word.length+1);
  x=x+dx ; y=y+dy ;
  if(this.board[x]){
   if (this.board[x][y]==" "){ return true; } else {return false;}  
  }  
  return true; 
}


oJCW.prototype.ScorePath = function (x,y,dx,dy,word){
  var score = 0;
  var size = word.length;
  var blank = 0;

   px=x-dx; py=y-dy;
    if(this.board[px]){
      if (this.board[px][py]!=" "){return -1;}
    }


  for(var i=0;i<size;i++){
   if(((x<this.board_width) && (y<this.board_board) && (x>-1) && (y>-1))){
     if(this.board[x][y]!=" "){
         if(this.board[x][y]==word[i]){ score+=1; } else {return -1;}
     } else blank+=1;

     if(this.board[x][y]!=word[i]){
       if(dx==1){
           var subscore = 0; 
           if(this.board[x][y-1]) {if(this.board[x][y-1]==" ")  subscore+=1} else  subscore+=1;
           if(this.board[x][y+1]) {if(this.board[x][y+1]==" ") subscore+=1} else  subscore+=1;
           if (subscore==2) {score+=1} else {return -1;}
         }
       if(dy==1){
           var subscore = 0; 
           if(this.board[x-1]) {if(this.board[x-1][y]==" ") subscore+=1} else  subscore+=1;
           if(this.board[x+1]) {if(this.board[x+1][y]==" ") subscore+=1} else  subscore+=1;
           if (subscore==2) {score+=1} else {return -1;}
         }
        }

   } else return -1;
    x=x+dx; y=y+dy;
  }
   
    if(this.board[x]){
      if (this.board[x][y]!=" "){return -1;}
    }

 
  if(blank==word.length) score=0;
  return score;
}


oJCW.prototype.CrossablePlaces = function (word){
  var Places = Array();
  var StartingPoints = this.MatchedLetters(word);
  var dx=0; var dy=0;
  var bestscore = 0;
  var bestdx = 0; var bestx=0;
  var bestdy = 0; var besty=0;
  var Hscore = 0;
  var Vscore = 0;
 
  for(var x=0;x<this.board_width;x++){
     for(var y=0;y<this.board_board;y++){
        Hscore = this.ScorePath(x,y,1,0,word);
        Vscore = this.ScorePath(x,y,0,1,word); 
       
        if(Hscore> bestscore){ 
            bestscore = Hscore; bestx=x; besty=y; bestdx=1; bestdy=0;
        }
        if(Vscore> bestscore){ 
            bestscore = Vscore; bestx=x; besty=y; bestdx=0; bestdy=1;
        }
     }  
  }
  if(bestscore>0){
      Places.push(Array(bestscore,bestx,besty,bestdx,bestdy));
   }
  return Places;
} 
 
oJCW.prototype.PlaceWord = function (x,y,dx,dy,word){
  var size = word.length;
  for(var i=0;i<size;i++){
   if(this.board[x]){
      this.board[x][y]= word[i];
    }
    x=x+dx; y=y+dy;
  }

  /* Correction : il faut inverser ces deux dimensions :
  if(dx==1){this.Horizontal.push(Array(x,y,word));}
  if(dy==1){this.Vertical.push(Array(x,y,word));}
  */
  if(dx==1){this.Vertical.push(Array(x,y,word));}
  if(dy==1){this.Horizontal.push(Array(x,y,word));}
  
  return true;
}

oJCW.prototype.PathIsClear = function (x,y,dx,dy,word){
  var size = word.length;
  for(var i=0;i<size;i++){
   if(this.board[x]){
    if (this.board[x][y]!=" "){ return false; }
    if (this.ScorePath(x,y,dx,dy,word)<0) {return false;}
   } else return false;
    x=x+dx; y=y+dy;
  }
  return true;
}

oJCW.prototype.PlaceAtRandom = function (word){  
  var trynum=0; var keeptrying=true;
  while(keeptrying){
      var x=Math.floor(Math.random()*this.board_width);
      var y=Math.floor(Math.random()*this.board_board);
      var HorV = Math.floor(Math.random()*this.board_width); // Correction : * 20 : par : *this.board_width
      if(HorV % 2 == 0){ dx=0; dy=1;} else { dx=1; dy=0;}
      keeptrying = ((trynum<this.board_width*this.board_board) && (!this.PathIsClear(x,y,dx,dy,word)));
      trynum++;
  } //  document.write(word+":random("+(trynum+1)+")<br>");
  if (this.PathIsClear(x,y,dx,dy,word)){ 
    this.PlaceWord(x,y,dx,dy,word);
  }
}

oJCW.prototype.PlaceAtBestCrossing = function (places,word){
  var x=places[0][1];  var y=places[0][2];
  var dx=places[0][3];  var dy=places[0][4];
  this.PlaceWord(x,y,dx,dy,word);
}

// Boucles 

oJCW.prototype.BuildCrossword = function (listemots){
this.ClearBoard(); unconnected=0;
var xwordlist = listemots;	 
var Retry = Array();
var Retry2 = Array();
while(xwordlist.length > 0){
  var word = xwordlist.pop(); 
  var places = this.CrossablePlaces(word);
  if(places.length>0){
  	// Pour débogage :  
  	// alert(word+":best("+places.length+" results)<br>");
  	// Fin débog
    this.PlaceAtBestCrossing(places,word);  //so Mia could cross both Mike and Ann..
  } 
  else {
     if(Retry.indexOf(word)==-1){
     	Retry.push(word);
     	xwordlist.push(word);
     }
     else{
     	if(Retry2.indexOf(word)==-1){
     		Retry2.push(word);
     		xwordlist.push(word);
     	}
     	else{
       		this.PlaceAtRandom(word);
   		}
	}
  } // fin else
 } // fin while  
}

oJCW.prototype.CrosswordTable = function (){
	
 var schema = "<table class='schema'>";  
   for(var x=0;x<this.board_width;x++){
   		schema += "<tr>";  
     	for(var y=0;y<this.board_board;y++){
       		var c = this.board[x][y]; 
       		if(c==" "){
       			schema += "<td class='vide'>"; 
       		} 
       		else {
       			schema += "<td class='plein'>";        
       		}
       		schema += c;
       		schema += "</td>";  
     	}
    schema += "</tr>";  
    }
    schema += "</table>";
    
    /* Attention !
    Les tableaux Horiz. et Vert. ont été manifestement inversés !!!
    Cela a été corrigés plus haut. Voir cette correction.
    */ 
    
    /* Coordonnées :
    
    H -> où chaque entrée a la forme : (y,x+mot.length,mot)
    D'où les coordonnées corrigées :
    H : x = H[i][1] - H[i][2].length ; y  =  H[i][0]
    
    V ->  où chaque entrée a la forme : (y+mot.length,x,mot)
    D'où les coordonnées corrigées :
    V : x = V[i][1]  ; y  =  V[i][0] - V[i][2].length
    
    On en déduit ici les coordonnées corrigées : */
    
   /* schema += "<p>Horizontalement :<br />";
	for (var i = 0;i < this.Horizontal.length; i++){
    	schema += (i + 1) + ".&nbsp;&nbsp;  " + this.Horizontal[i][2];
    	schema +=  " (x: " + (this.Horizontal[i][1] - this.Horizontal[i][2].length);
    	schema +=  ", y: " + this.Horizontal[i][0];
    	schema += ")</p>";
	}
	
	schema += "<p>Verticalement :<br />";
    for (var i = 0;i < this.Vertical.length; i++){
    	schema += (i + 1) + ".&nbsp;&nbsp;" + this.Vertical[i][2];
    	schema +=  " (x: " + this.Vertical[i][1];
    	schema +=  ", y: " + (this.Vertical[i][0] - this.Vertical[i][2].length);
    	schema += ")</p>";
    }
	
	*/
return schema;
}
