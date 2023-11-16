
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

/**
 * The size of the canvas
 * @type {Box}
 */
var canvasSize = new Box(window.innerWidth, window.innerHeight);

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
	board = new Board();
	update();
};

// Handle user input
window.onkeydown = function(e) {
	if (isSolving) return; // No user input while solver is working
	if (e.key == "ArrowUp") board.up();
	else if (e.key == "ArrowLeft") board.left();
	else if (e.key == "ArrowRight") board.right();
	else if (e.key == "ArrowDown") board.down();

	// Checks for gameover
	if (board.isGameover()) alert("Game over!");
};

// Sets up the canvas and the context
function setupCanvas() {
	canvas.style.width = window.innerWidth+"px";
	canvas.style.height = window.innerHeight+"px";
	canvas.width = window.innerWidth * window.devicePixelRatio;
	canvas.height = window.innerHeight * window.devicePixelRatio;
	ctx = canvas.getContext("2d");
	ctx.resetTransform();
	const scaleFactor = canvas.height / 1080;
	ctx.scale(scaleFactor, scaleFactor);
	canvasSize = new Box(canvas.width * 1080 / canvas.height, 1080);
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
	ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
	board.draw();
}