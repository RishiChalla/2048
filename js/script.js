/**
 * @type {HTMLCanvasElement}
 */
var canvas;

/**
 * @type {CanvasRenderingContext2D}
 */
var ctx;

/**
 * @type {Point}
 */
var mousePos;

/**
 * @type {Board}
 */
var board;

/**
 * @type {Solver}
 */
var solver;

var isSolving = false;

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
		if (isSolving) return; // No user input while solver is working
		if (evt.key == "ArrowUp") board.up();
		else if (evt.key == "ArrowLeft") board.left();
		else if (evt.key == "ArrowRight") board.right();
		else if (evt.key == "ArrowDown") board.down();
	});

	document.getElementById("solve").onclick = solveIt;

	setup();
};

function solveIt() {
	if (isSolving) return;
	solver = new Solver(board, 50);
	solver.solve();
	isSolving = true;
}

function setup() {
	board = new Board(new Point((canvas.width / 2) - 500, (canvas.height / 2) - 600), 1000);
	update();
}

function draw() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	board.draw();
}

function update() {
	window.requestAnimationFrame(update);
	draw();
}