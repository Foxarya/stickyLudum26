var dictImg = {};

var escenario = new Kinetic.Stage({
	container : 'container',
	width : 900,
	height : 575
});

var text;

var debugging = true;

var capa = new Kinetic.Layer();

var prota, world, context, tickFisicas, nodos = [];

var stilltime = 0;

$(document).ready(function() {

	escenario.add(capa);
	cargarImagenes();
});

function cargarImagenes() {
	var barraCarga = new Kinetic.Rect({
		x : escenario.getWidth / 2 - 250,
		y : escenario.getHeight / 2,
		width : 0,
		height : 5,
		stroke : 'black',
		strokeWidth : 2,
		fill : 'orange'
	});

	capa.add(barraCarga);

	$.ajax({
		type : "GET",
		url : "images.xml",
		dataType : "xml",
		success : function(xml) {
			var cargadas = 0;
			var numeroImagenes = $(xml).find('imagen').length;
			$(xml).find('imagen').each(function() {
				var nombreImagen = $(this).text();
				var imagen = new Image();

				imagen.onload = function() {

					dictImg[nombreImagen] = imagen;
					cargadas++;
					barraCarga.transitionTo({
						width : ((cargadas * 100) / numeroImagenes) * 5,
						duration : 0.1,
						easing : 'ease-in-out'
					});
					barraCarga.draw();
					if (cargadas == numeroImagenes) {
						barraCarga.destroy();
						initBox2d();
						logicaJuego();
						dibujarMapa();
						tickFisicas.start();
					}
				};

				imagen.src = "img/" + nombreImagen + ".png";
			});
		}
	});

}

/*
 function cargarPuntos() {
 $.ajax({
 type : "GET",
 url : "maps.xml",
 dataType : "xml",
 success : function(xml) {
 var i = 0;
 var numeroLineas = $(xml).find('linea').length;
 var numeroPuntos = $(xml).find('vertice').length;
 $(xml).find('linea').each(function() {
 var j = 0;
 $(xml).find('vertice').each(function() {
 var str = $(this).text();
 var x = str.subString(0,str.indexOf(','));
 var y =  str.subString(str.indexOf(','),str.length);
 puntosDestino[i][j]	= {x: x.parseInt(), y: y.parseInt()};
 j++;
 });
 i++;
 });
 }
 });
 }

 */
function initBox2d() {

	var timeCamera = 0;
	// Define the world
	world = new b2World(new b2Vec2(0, 10)//gravity of 10 in downward y direction
	, true //allows objects to sleep if they are in equilibrium, indicated by change of color from Red to Grey in debugDraw mode
	);

	// The native function that draws the object for us to debug their physics and visualize interaction
	if (debugging) {
		var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(contextoDebug);
		debugDraw.SetDrawScale(scale);
		debugDraw.SetFillAlpha(0.5);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_centerOfMassBit);

		world.SetDebugDraw(debugDraw);
	}

	var fixDef = new b2FixtureDef;
	fixDef.density = 2.0;
	fixDef.friction = 0;
	fixDef.restitution = 0;

	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.x = 100 / scale;
	bodyDef.position.y = 500 / scale;

	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(50 / scale, 10 / scale);

	var suelo = world.CreateBody(bodyDef);
	suelo.CreateFixture(fixDef);

	tickFisicas = new Kinetic.Animation(function(frame) {
		timeCamera += frame.timeDiff;
		world.Step(1 / frame.frameRate, 3, 3);
		// timestep, velocityIterations, positionIterations. Read manual for more details

		suelo.SetPosition(new b2Vec2(prota.body.GetPosition().x, puntosDestino[0].y / scale));

		// Controls for jump
		prota.stilltime += frame.timeDiff;
		if ((!prota.grounded) && prota.body.GetLinearVelocity().y > -1) {
			if (prota.direction == 1)
				prota.nodo.setAnimation("idler");
			else
				prota.nodo.setAnimation("idlel");
		}
		if (prota.grounded && !prota.movement && prota.stilltime > 200)
			prota.body.SetLinearVelocity(new b2Vec2(0, 0));
		if (prota.body.GetContactList() != null)
			prota.grounded = true;
		else
			prota.grounded = false;

		// Controls to the force
		if (prota.body.GetLinearVelocity().x > 9)
			prota.body.SetLinearVelocity(new b2Vec2(9, prota.body.GetLinearVelocity().y));
		else if (prota.body.GetLinearVelocity().x < -9)
			prota.body.SetLinearVelocity(new b2Vec2(-9, prota.body.GetLinearVelocity().y));

		if (prota.body.GetLinearVelocity().y < -9)
			prota.body.SetLinearVelocity(new b2Vec2(prota.body.GetLinearVelocity().x, -9));

		// This is called after we are done with time steps to clear the forces
		world.ClearForces();

		// Camera control

		if (timeCamera >= 500) {
			timeCamera = 0;
			if ((escenario.getWidth() - 200) / 2 - escenario.getX() > prota.body.GetPosition().x * scale)
				transitionCamera(escenario.getX() + 200, escenario.getY());
			if (escenario.getWidth() - escenario.getX() - (escenario.getWidth() - 200) / 2 < prota.body.GetPosition().x * scale)
				transitionCamera(escenario.getX() - 200, escenario.getY());
			if ((escenario.getHeight() - 200) / 2 - escenario.getY() > prota.body.GetPosition().y * scale)
				transitionCamera(escenario.getX(), escenario.getY() + 200);
			if (escenario.getHeight() - escenario.getY() - (escenario.getHeight() - 200) / 2 < prota.body.GetPosition().y * scale)
				transitionCamera(escenario.getX(), escenario.getY() - 200);

		}
		/*
		if ((escenario.getWidth() - 200) / 2 - escenario.getX() > prota.body.GetPosition().x * scale)
		escenario.setX(escenario.getX() + 4);
		if (escenario.getWidth() - escenario.getX() - (escenario.getWidth() - 200) / 2 < prota.body.GetPosition().x * scale)
		escenario.setX(escenario.getX() - 4);
		if ((escenario.getHeight() - 200) / 2 - escenario.getY() > prota.body.GetPosition().y * scale)
		escenario.setY(escenario.getY() + 4);
		if (escenario.getHeight() - escenario.getY() - (escenario.getHeight() - 200) / 2 < prota.body.GetPosition().y * scale)
		escenario.setY(escenario.getY() - 4);
		*/
		// Traverse through all the box2d objects and update the positions and rotations of corresponding KineticJS objects
		for (var i = 0; i < nodos.length; i++) {
			var body = nodos[i].body;
			// A small hack to save on unnecessary redraws.
			//if (!body.IsAwake())
			//	count++;

			var nodo = nodos[i].nodo;
			var p = body.GetPosition();
			nodo.setRotation(body.GetAngle());
			nodo.setPosition(p.x * scale, p.y * scale);
		}

		if (debugging) {
			contextoDebug.setTransform(escenario.getAbsoluteTransform().m[0], escenario.getTransform().m[1], escenario.getTransform().m[2], escenario.getTransform().m[3], escenario.getTransform().m[4], escenario.getTransform().m[5]);
			world.DrawDebugData();
			debugEscenario.setPosition(escenario.getX(), escenario.getY());
		}

	}, capa);

}

function logicaJuego() {
	var keypressed = false;
	var impulso = 150;
	prota = new Personaje(100, 50, dictImg['Sticky']);

	text = new Kinetic.Text({
		x : 10 / 2,
		y : 15,
		text : '',
		fontSize : 30,
		fontFamily : 'Calibri',
		fill : 'green'
	});
	capa.add(text);
	//prota.nodo.setId("#prota");

	capa.add(prota.nodo);

	prota.body = world.CreateBody(prota.bodyDef);
	prota.body.CreateFixture(prota.fixDef);

	nodos.push(prota);

	$(document).keydown(function(e) {
		if (e.keyCode == 39) {
			if (!keypressed) {
				prota.nodo.setAnimation("walkr");
				prota.body.ApplyImpulse(new b2Vec2(300, 0), prota.body.GetWorldCenter());
				//prota.body.GetFixtureList().m_friction = 0;
				e.preventDefault();
				keypressed = true;
				prota.direction = 1;
				prota.movement = true;
			}

		} else if (e.keyCode == 37) {
			if (!keypressed) {
				prota.nodo.setAnimation("walkl");
				prota.body.ApplyImpulse(new b2Vec2(-300, 0), prota.body.GetWorldCenter());
				//prota.body.GetFixtureList().m_friction = 0;
				e.preventDefault();
				keypressed = true;
				prota.direction = 0;
				prota.movement = true;
			}

		}
		if (e.keyCode == 32) {
			if ((!prota.jump) && prota.grounded) {
				prota.jump = true;
				prota.stilltime = 0;
				if (prota.direction == 1)
					prota.nodo.setAnimation("jumpr");
				else
					prota.nodo.setAnimation("jumpl");
				prota.body.ApplyImpulse(new b2Vec2(0, -150), prota.body.GetWorldCenter());
			}
			if (prota.stilltime < 500)
				prota.body.ApplyImpulse(new b2Vec2(0, -25), prota.body.GetWorldCenter());
		}

	});
	$(document).keyup(function(e) {

		if (e.keyCode == 39) {
			if (prota.grounded) {
				prota.nodo.setAnimation("idler");
				prota.body.SetLinearVelocity(new b2Vec2(0, 0));
			}
			e.preventDefault();
			keypressed = false;
			prota.movement = false;
		} else if (e.keyCode == 37) {
			if (prota.grounded) {
				prota.nodo.setAnimation("idlel");
				prota.body.SetLinearVelocity(new b2Vec2(0, 0));
			}
			e.preventDefault();
			keypressed = false;
			prota.movement = false;
		}

		if (e.keyCode == 32) {
			prota.jump = false;
		}

	});

	prota.nodo.start();

}

function transitionCamera(newx, newy) {
	escenario.transitionTo({
		x : newx,
		y : newy,
		duration : 1,
		//easing: easing-in-out
	});
}
