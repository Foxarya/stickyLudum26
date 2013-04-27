function hayColision(elementoA, elementoB) {
	var verti = [];
	var verti2 = [];
	
	for(var i = 0; i < 4 ; i++){
		verti[i] = {};
		verti2[i] = {};
	}
	verti[0].x = elementoB.getX();
	verti[0].y = elementoB.getY();
	verti[1].x = elementoB.getX() + elementoB.getWidth();
	verti[1].y = elementoB.getY();
	verti[2].x = elementoB.getX();
	verti[2].y = elementoB.getY() + elementoB.getHeight;
	verti[3].x = elementoB.getX() + elementoB.getWidth();
	verti[3].y = elementoB.getY() + elementoB.getHeight;
	
	verti2[0].x = elementoB.getX();
	verti2[0].y = elementoB.getY();
	verti2[1].x = elementoB.getX() + elementoB.getWidth();
	verti2[1].y = elementoB.getY();
	verti2[2].x = elementoB.getX();
	verti2[2].y = elementoB.getY() + elementoB.getHeight;
	verti2[3].x = elementoB.getX() + elementoB.getWidth();
	verti2[3].y = elementoB.getY() + elementoB.getHeight;
	
	var mayorX = Math.max(elementoA.getX(), elementoA.getX() + elementoA.getWidth());
	var mayorY = Math.max(elementoA.getY(), elementoA.getY() + elementoA.getHeight());
	var menorX = Math.min(elementoA.getX(), elementoA.getX() + elementoA.getWidth());
	var menorY = Math.min(elementoA.getY(), elementoA.getY() + elementoA.getHeight());
	for(var i = 0 ; i < 4 ; i++){
		if ((verti[i].x > menorX && verti[i].x < mayorX) && (verti[i].y > menorY && verti[i].y < mayorY)) {
			//Calculamos la interpolacion
		} 
	}

	return false;

}
