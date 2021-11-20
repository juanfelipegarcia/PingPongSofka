var jugador1 = document.getElementById("jugador-1");
var jugador2 = document.getElementById("jugador-2");

var puntosLimite = parseInt(prompt("Digita el numero de puntos que  quieres disputar", "1"));

var puntaje1 = 0;
var puntaje2 = 0;

function marcador(jugador){
	if (jugador == 1) {
		puntaje2++;
		jugador2.innerHTML = puntaje2;
	} else {
		
		puntaje1++;
		jugador1.innerHTML = puntaje1;
	}
}

function ganador(jugador){
	if (jugador == 1) {
		alert('Gamador jugador 1!!!!!!!')
		puntaje1 = 0;
		location.reload();
	} else {
		alert('Gamador jugador 2!!!!!!!')
		puntaje2 = 0;
		location.reload();
	}

}


(function(){
	self.Board = function(width,height){
		this.width = width;
		this.height = height;
		this.game_over = false;
		this.bars = [];
		this.ball = null;
		this.playing = false;
	}

	self.Board.prototype = {
		get elements(){
			var elements = this.bars.map(function(bar){ return bar; });
			elements.push(this.ball);
			return elements;
		}
	}
})();

//Crea la bola
(function(){
	self.Ball = function(x,y,radius,board){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.speed_y = 0;
		this.speed_x = 3;
		this.board = board;
		this.direction = -1;
		this.bounce_angle = 0;
		this.max_bounce_angle = Math.PI / 12;
		this.speed = 4;

		board.ball = this;
		this.kind = "circle";	
	}
	self.Ball.prototype = {
		move: function(){
			this.x += (this.speed_x * this.direction);
			this.y += (this.speed_y);

			if (puntaje1 == puntosLimite) {ganador(1);}
			else if (puntaje2 == puntosLimite) {ganador(2);}


			if (this.x <= 10) {
				console.log("llego1");
				marcador(1);
				this.x = 400;
				this.y = 200;
				this.speed_x = -this.speed_x;
				this.bounce_angle = -this.bounce_angle;
			}
			if (this.x >= 790) {
				console.log("llego2");
				marcador(2);
				this.x = 400;
				this.y = 200;
				this.speed_x = -this.speed_x;
				this.bounce_angle = -this.bounce_angle;
			}

			if (this.y <= 10) {
				
				this.speed_y = -this.speed_y;
				this.bounce_angle = -this.bounce_angle;
			}
			if (this.y >= 390) {
				
				this.speed_y = -this.speed_y;
				this.bounce_angle = -this.bounce_angle;
			}
		},
		
		get width(){
			return this.radius * 2;
		},
		get height(){
			return this.radius * 2;
		},
		collision: function(bar){
			var relative_intersect_y = ( bar.y + (bar.height / 2) ) - this.y;
			var normalized_intersect_y = relative_intersect_y / (bar.height / 2);
			this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
			
			this.speed_y = this.speed * -Math.sin(this.bounce_angle);
			this.speed_x = this.speed * Math.cos(this.bounce_angle);

			if(this.x > (this.board.width / 2)) this.direction = -1;
			else this.direction = 1;
		}
	}
})();


(function(){
	self.Bar = function(x,y,width,height,board){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.board = board;
		this.board.bars.push(this);
		this.kind = "rectangle";
		this.speed = 10;
	}
	self.Bar.prototype = {
		down: function(){
			this.y += this.speed;
		},
		up: function(){
			this.y -= this.speed;
		},
		toString: function(){
			return "x: "+ this.x +" y: "+ this.y ;
		}
	}
})();


(function(){
	self.BoardView = function(canvas,board){
		this.canvas = canvas;
		this.canvas.width = board.width;
		this.canvas.height = board.height;
		this.board = board;
		this.ctx = canvas.getContext("2d");

	}

	self.BoardView.prototype = {
		clean: function(){
			this.ctx.clearRect(0,0,this.board.width,this.board.height);
		},
		draw: function(){
			for (var i = this.board.elements.length - 1; i >= 0; i--) {
				var el = this.board.elements[i];


				draw(this.ctx,el);
			};
		},
		check_collisions: function(){
			for (var i = this.board.bars.length - 1; i >= 0; i--) {
				var bar = this.board.bars[i];
				if(hit(bar, this.board.ball)){
					this.board.ball.collision(bar);
				}
			};
		},
		play: function(){
			if(this.board.playing){
				this.clean();
				this.draw();
				this.check_collisions();
				this.board.ball.move();	
			}
		}
	}

	function hit(a,b){
		
		var hit = false;
		
		if(b.x + b.width >= a.x && b.x < a.x + a.width){
		  if(b.y + b.height >= a.y && b.y < a.y + a.height)
				hit = true;
		}
		
		if(b.x <= a.x && b.x + b.width >= a.x + a.width){
			if(b.y <= a.y && b.y + b.height >= a.y + a.height)
				hit = true;
		}
	
		if(a.x <= b.x && a.x + a.width >= b.x + b.width){
			if(a.y <= b.y && a.y + a.height >= b.y + b.height)
				hit = true;
		}
		
		return hit;
	}

	function draw(ctx,element){
		switch(element.kind){
			case "rectangle":
				ctx.fillRect(element.x,element.y,element.width,element.height);
				break;
			case "circle": 
				ctx.beginPath();
				ctx.arc(element.x,element.y,element.radius,0,7);
				ctx.fill();
				ctx.closePath();
				break;
		}	
	}
})();

var board = new Board(800,400);
var bar = new Bar(0,140,15,100,board);
var bar_2 = new Bar(785,140,15,100,board);
var canvas = document.getElementById('canvas');
var board_view = new BoardView(canvas,board);
var ball = new Ball(400, 200, 10,board);

document.addEventListener("keydown", function (ev) {

	if (ev.keyCode == 38) {
		ev.preventDefault();
		if (bar_2.y >= 10) {
			bar_2.up(); 
		}
	}
	else if (ev.keyCode == 40) {
		ev.preventDefault();
		if (bar_2.y <= 290) {
			bar_2.down(); 
		}
	}
	else if (ev.keyCode == 65) {
		//Tecla A
		ev.preventDefault();
		if (bar.y >= 10) {
			bar.up(); 
		}
	}
	else if (ev.keyCode == 90) {
		//tecla Z
		ev.preventDefault();
		if (bar.y <= 290) {
			bar.down(); 
		}
	} else if (ev.keyCode == 32) {
		ev.preventDefault();
		board.playing = !board.playing;
	}
});

board_view.draw();
window.requestAnimationFrame(controller);

function controller(){
	board_view.play();
	requestAnimationFrame(controller);
}