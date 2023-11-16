
class Board {

	/**
	 * Creates a new 2048 board
	 * @param {Point} pos The position of the board on the canvas for rendering
	 * @param {Number} size The size of the board on the canvas for rendering
	 */
	constructor(pos, size) {
		this.pos = new Point(pos.x, pos.y);
		this.size = new Box(size, size);
		this.grid = [];

		// Calculate the position of each cell on the board and add it
		for (var x = 0; x < 4; x++) {
			this.grid.push([]);
			for (var y = 0; y < 4; y++) {
				this.grid[x].push(
					new Cell(
						new Point(
							this.pos.x + 15 + (x*(this.size.width / 4)),
							this.pos.y + 15 + (y*(this.size.width / 4))
						),
						(this.size.width / 4) - 30, 0, new Point(x, y)
					)
				);
			}
		}

		// Setup grid
		this.grid[randomNumber(0, 3)][randomNumber(0, 3)].value = 2;
		var rand = [randomNumber(0, 3), randomNumber(0, 3)];
		while (this.grid[rand[0]][rand[1]].value == 2) {
			rand = [randomNumber(0, 3), randomNumber(0, 3)];
		}
		this.grid[rand[0]][rand[1]].value = 2;

		// Calculate score
		this.score = 0;
		this.messageDone = false;
	}

	/**
	 * Returns a deep copy of the board, meant for simulation and not rendering
	 * @returns {Board} A deep copy of the board
	 */
	copy() {
		const board = new Board(this.pos, this.size.x);
		board.grid = window.structuredClone(this.grid);
		board.score = this.score;
		board.messageDone = this.messageDone;
		return board;
	}

	/**
	 * Draws the board on the canvas
	 */
	draw() {
		ctx.roundRect(this.pos, this.size, 50);
		ctx.fillStyle = "#333333";
		ctx.fill();
		ctx.lineWidth = 30;
		ctx.strokeStyle = "#333333";
		ctx.stroke();
		for (var x = 0; x < 4; x++) {
			for (var y = 0; y < 4; y++) {
				this.grid[x][y].update();
			}
		}
	}

	/**
	 * Shifts all tiles down but does not merge anything
	 */
	shiftDown() {
		var xToCheck = this.getXToCheck();

		for (var i = 0; i < xToCheck.length; i++) {
			var column = this.grid[xToCheck[i]];
			for (var i2 = column.length - 1; i2 >= 0; i2--) {
				if (column[i2].value != 0 && this.hasBelow(column[i2].arrPos.x, column[i2].arrPos.y) == false && column[i2].arrPos.y != 3) {
					var a = column[i2];
					while (a.arrPos.y != 3 && this.hasBelow(a.arrPos.x, a.arrPos.y) == false) {
						var t = a.value;
						a.value = 0;
						a = this.grid[a.arrPos.x][a.arrPos.y + 1];
						a.value = t;
					}
				}
			}
		}
	};

	/**
	 * Gets the x indices to check
	 * @returns {Array<Number>} The indices of x positions to check
	 */
	getXToCheck() {
		var not0 = [];

		for (var x = 0; x < this.grid.length; x++) {
			for (var y = 0; y < this.grid[x].length; y++) {
				if (this.grid[x][y].value != 0) not0.push(this.grid[x][y]);
			}
		}

		var xToCheck = [];

		for (var i = 0; i < not0.length; i++) {
			var d = false;
			for (var i2 = 0; i2 < xToCheck.length; i2++) {
				if (xToCheck[i2] == not0[i].arrPos.x) {
					d = true;
				}
			}
			if (!d) xToCheck.push(not0[i].arrPos.x);
		}

		return xToCheck;
	};

	/**
	 * Merges down the tiles
	 */
	mergeDown() {
		var xToCheck = this.getXToCheck();

		for (var i = 0; i < xToCheck.length; i++) {
			var column = this.grid[xToCheck[i]];
			for (var i2 = column.length - 1; i2 >= 0; i2--) {
				if (i2 == 0) continue;
				var bottom = column[i2];
				var top = column[i2 - 1];
				if (bottom.value == top.value) {
					bottom.value += top.value;
					top.value = 0;
				}
			}
		}

		this.shiftDown();
	};

	/**
	 * Shifts and merges all the tiles down
	 * @returns {Boolean} Whether or not the merge was successful
	 */
	down() {
		var backup = this.convertToArray(Object.assign([], this.grid));

		this.shiftDown();
		this.mergeDown();

		if (this.convertToArray(this.grid).equals(backup) && this.gameOver != true) return false;

		this.spawnNewTile();


		// TMP - Removed win and lose messages to avoid them calling when RL algorithm is running simulations
		// if (this.gameOver == true) {
		// 	alert("Game Over! You lost. Click ok to start a new game.");
		// 	window.location.replace("");
		// }

		// for (var x = 0; x < this.grid.length; x++) {
		// 	for (var y = 0; y < this.grid[x].length; y++) {
		// 		if (this.grid[x][y].value == 2048 && this.messageDone == false) {
		// 			alert("Congratulations, you have beat the game. Continuing further may result in bugs as not everything is color coded.");
		// 			this.messageDone = true;
		// 		}
		// 	}
		// }

		return true;
	};

	/**
	 * Converts the grid into an array
	 * @param {Array<Array<Cell>>} grid The grid to convert
	 * @returns {Array<Array<Number>>} The grid with values instead of cells
	 */
	convertToArray(grid) {
		var finalVal = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
		for (var x = 0; x < 4; x++) {
			for (var y = 0; y < 4; y++) {
				finalVal[x][y] = grid[x][y].value;
			}
		}
		return finalVal;
	};

	/**
	 * Checks if there's an item below in the grid
	 * @param {Number} x The x position to check
	 * @param {Number} y The y position to check
	 * @returns {Boolean} Whether or not there's an item below
	 */
	hasBelow(x, y) {
		if (y == 3) return false;
		return this.grid[x][y + 1].value != 0;
	};

	/**
	 * Checks if there's an item above in the grid
	 * @param {Number} x The x position to check
	 * @param {Number} y The y position to check
	 * @returns {Boolean} Whether or not there's an item above
	 */
	hasAbove(x, y) {
		if (y == 0) return false;
		return this.grid[x][y - 1].value != 0;
	};

	/**
	 * Shifts and merges the board up completely
	 * @returns {Boolean} Whether or not the shift/merge was successful
	 */
	up() {
		this.rotate();
		this.rotate();
		var a = this.down();
		this.rotate();
		this.rotate();
		return a;
	};

	/**
	 * Shifts and merges the board left completely
	 * @returns {Boolean} Whether or not the shift/merge was successful
	 */
	left() {
		this.rotate();
		this.rotate();
		this.rotate();
		var a = this.down();
		this.rotate();
		return a;
	};

	/**
	 * Shifts and merges the board right completely
	 * @returns {Boolean} Whether or not the shift/merge was successful
	 */
	right() {
		this.rotate();
		var a = this.down();
		this.rotate();
		this.rotate();
		this.rotate();
		return a;
	};

	/**
	 * Rotates the board clockwise
	 */
	rotate() {
		var finalVal = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
		for (var x = 0; x < 4; x++) {
			for (var y = 0; y < 4; y++) {
				finalVal[-y + 3][x] = this.grid[x][y].value;
			}
		}
		for (var x = 0; x < 4; x++) {
			for (var y = 0; y < 4; y++) {
				this.grid[x][y].value = finalVal[x][y];
			}
		}
	};

	/**
	 * Checks for gameover and spawns a new tile
	 */
	spawnNewTile() {
		var gameOver = true;

		for (var x = 0; x < this.grid.length; x++) {
			for (var y = 0; y < this.grid[x].length; y++) {
				if (this.grid[x][y].value == 0) gameOver = false;
			}
		}

		if (gameOver) {
			this.gameOver = gameOver;
			return;
		}

		var done = false;
		while (done == false) {
			var x = randomNumber(0, 3), y = randomNumber(0, 3);
			if (this.grid[x][y].value == 0) {
				done = true;
				if (this.score > 100) {
					if (Math.random(0, 1) == 0) {
						this.grid[x][y].value = 2;
					}
					else {
						this.grid[x][y].value = 4;
					}
				}
				else {
					this.grid[x][y].value = 2;
				}
			}
		}
	};
}
