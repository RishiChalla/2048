/**
 * The html canvas
 * @type {HTMLCanvasElement}
 */
var canvas;

/**
 * Canvas rendering context
 * @type {CanvasRenderingContext2D}
 */
var ctx;

/**
 * The 2048 board object
 * @type {Board}
 */
var board;

/**
 * The solver AI agent used to solve the game
 * @type {Solver}
 */
var solver;

/**
 * Whether or not to use dark mode
 * @type {Boolean}
 */
var isDark = false;

/**
 * Whether or not the solver is currently in control of the game
 * @type {Boolean}
 */
var isSolving = false;

// Called on window load
window.onload = function() {
	// Setup canvas and context
	canvas = document.getElementById("canvas");
	setupCanvas();
	window.onresize = setupCanvas;

	// Check for dark mode and handle mode changing
	isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => isDark = event.matches);

	// Solving event listener
	document.getElementById("solve").onclick = solveIt;

	// Setup board and start update loop
	board = new Board(new Point((canvas.width / 2) - 500, (canvas.height / 2) - 600), 1000);
	update();
};

// Handle user input
window.onkeydown = function(e) {
	if (isSolving) return; // No user input while solver is working
	if (e.key == "ArrowUp") board.up();
	else if (e.key == "ArrowLeft") board.left();
	else if (e.key == "ArrowRight") board.right();
	else if (e.key == "ArrowDown") board.down();
};

// Sets up the canvas and the context
function setupCanvas() {
	canvas.style.width = window.innerWidth+"px";
	canvas.style.height = window.innerHeight+"px";
	canvas.width = window.innerWidth * window.devicePixelRatio;
	canvas.height = window.innerHeight * window.devicePixelRatio;
	ctx = canvas.getContext("2d");
}

// Creates an AI agent to solve the game and runs it in 50 millisecond intervals
function solveIt() {
	if (isSolving) return;
	solver = new Solver(board, 50);
	solver.solve();
	isSolving = true;
}

// Handles updating and drawing
function update() {
	window.requestAnimationFrame(update);
	ctx.fillStyle = isDark ? "black" : "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	board.draw();
}