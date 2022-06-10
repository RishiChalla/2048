var canvas;
var ctx;
var mousePos;
var board;
var wait = false;
var done = false;
var solver;

window.onload = function() {
	canvas = document.getElementById("canvas");
	canvas.style.width = window.innerWidth+"px";
	canvas.style.height = window.innerHeight+"px";
	canvas.width = window.innerWidth * 2;
	canvas.height = window.innerHeight * 2;
	ctx = canvas.getContext("2d");
	mousePos = new Point(0, 0);
	window.addEventListener("mousemove", function(evt) {
		mousePos.x = evt.clientX * 2;
		mousePos.y = evt.clientY * 2;
	});

	window.addEventListener("keydown", function(evt) {
		if (wait == false) {
			if (evt.keyCode == 37) {
				board.left();
			}
			if (evt.keyCode == 38) {
				board.up();
			}
			if (evt.keyCode == 39) {
				board.right();
			}
			if (evt.keyCode == 40) {
				board.down();
			}
			wait = true;
			window.setTimeout(function() {
				wait = false;
			}, 100);
		}
	});

	document.getElementById("solve").onclick = solveIt;

	setup();
};

function solveIt() {
	if (done == false) {
		solver = new Solver(board, 50);
		solver.solve();
		done = true;
	}
}

function setup() {
	board = new Board(new Point((canvas.width / 2) - 500, (canvas.height / 2) - 600), 1000);
	update();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	board.draw();
}

function update() {
	window.requestAnimationFrame(update);
	draw();
}