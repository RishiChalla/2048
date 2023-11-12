var Board;

(function() {
	Board = function(pos, size) {
		this.pos = new Point(pos.x, pos.y);
		this.size = new Box(size, size);
		this.grid = [];
		for (var x = 0; x < 4; x++) {
			this.grid.push([]);
			for (var y = 0; y < 4; y++) {
				this.grid[x].push(new Cell(new Point(this.pos.x + 15 + (x*(this.size.width / 4)), this.pos.y + 15 + (y*(this.size.width / 4))), (this.size.width / 4) - 30, 0, new Point(x, y)));
			}
		}
		this.grid[randomNumber(0, 3)][randomNumber(0, 3)].value = 2;
		var rand = [randomNumber(0, 3), randomNumber(0, 3)];
		while (this.grid[rand[0]][rand[1]].value == 2) {
			rand = [randomNumber(0, 3), randomNumber(0, 3)];
		}
		this.grid[rand[0]][rand[1]].value = 2;
		this.score = 0;
		this.messageDone = false;
	};

	Board.prototype.copy = function() {
		const board = new Board(this.pos, this.size.x);
		board.grid = window.structuredClone(this.grid);
		board.score = this.score;
		board.messageDone = this.messageDone;
		return board;
	};

	Board.prototype.draw = function() {
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
	};

	Board.prototype.shiftDown = function() {
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

	Board.prototype.getXToCheck = function() {
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

	Board.prototype.mergeDown = function() {
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

	Board.prototype.down = function() {
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

	Board.prototype.convertToArray = function(grid) {
		var finalVal = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
		for (var x = 0; x < 4; x++) {
			for (var y = 0; y < 4; y++) {
				finalVal[x][y] = grid[x][y].value;
			}
		}
		return finalVal;
	};

	Board.prototype.hasBelow = function(x, y) {
		if (y == 3) return false;
		return this.grid[x][y + 1].value != 0;
	};

	Board.prototype.hasAbove = function(x, y) {
		if (y == 0) return false;
		return this.grid[x][y - 1].value != 0;
	};

	Board.prototype.up = function() {
		this.rotate();
		this.rotate();
		var a = this.down();
		this.rotate();
		this.rotate();
		return a;
	};

	Board.prototype.left = function() {
		this.rotate();
		this.rotate();
		this.rotate();
		var a = this.down();
		this.rotate();
		return a;
	};

	Board.prototype.right = function() {
		this.rotate();
		var a = this.down();
		this.rotate();
		this.rotate();
		this.rotate();
		return a;
	};

	Board.prototype.rotate = function() {
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

	Board.prototype.spawnNewTile = function() {
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
}());