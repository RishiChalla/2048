var Solver;

(function() {
	Solver = function(game, intervalBetweenMoves) {
		this.game = game;
		this.intervalBetweenMoves = intervalBetweenMoves;
		this.working = false;
		this.fails = 0;
		this.solved = false;
		this.highestNumber = 2;
		this.bestCycle = [];
		this.currentCycle = [];
	};

	Solver.prototype.solve = function() {
		var self = this;
		window.setTimeout(function() {
			if (this.solved) return;
			self.solve();
			// This is the game loop, call other functions for the solver here.
			// Use this rather than set interval so that the timer can be changed in middle of the loop.
			self.update();
		}, this.intervalBetweenMoves);
	};

	Solver.prototype.update = function() {
		// Update loop
		// This is where we play every move.

		// Before we do any moves, we need to make sure that our game hasnt lost yet
		if (this.hasFailed()) this.fail();

		
	};

	// All methods below this point are support methods to do various tasks with the board.

	Solver.prototype.countDownMerges = function() {
		var counter = 0;
		
		return counter;
	};

	Solver.prototype.randomMove = function() {
		var loops = 0;
		var done = false;
		while (!done && loops < 20) {
			let number = randomNumber(1, 4);
			if (number == 1 && this.theoreticalDown()) {
				done = true;
			}
			if (number == 2 && this.theoreticalLeft()) {
				done = true;
			}
			if (number == 3 && this.theoreticalRight()) {
				done = true;
			}
			if (number == 4 && this.theoreticalUp()) {
				done = true;
			}

			loops += 1;
		}

		if (loops >= 1000) {
			this.fail();
		}
	};

	Solver.prototype.hasFailed = function() {
		return !this.canMoveDown() && !this.canMoveLeft() && !this.canMoveRight() && !this.canMoveUp();
	};

	Solver.prototype.fail = function() {
		this.fails += 1;
		if (this.highestNumber < this.getBiggestNumber()) {
			this.highestNumber = this.getBiggestNumber();
			this.bestCycle = Object.assign([], this.currentCycle);
		}
		board = new Board(this.game.pos, this.game.size.width);
		this.game = board;
		this.currentCycle = [];
		return;
	};

	Solver.prototype.theoreticalRight = function() {
		this.backup = Object.assign([], this.game.grid);
		return this.right();
	};

	Solver.prototype.theoreticalLeft = function() {
		this.backup = Object.assign([], this.game.grid);
		return this.left();
	};

	Solver.prototype.theoreticalUp = function() {
		this.backup = Object.assign([], this.game.grid);
		return this.up();
	};

	Solver.prototype.theoreticalDown = function() {
		this.backup = Object.assign([], this.game.grid);
		return this.down();
	};

	Solver.prototype.up = function() {
		this.currentCycle.push("up");
		return this.game.up();
	};

	Solver.prototype.left = function() {
		this.currentCycle.push("left");
		return this.game.left();
	};

	Solver.prototype.right = function() {
		this.currentCycle.push("right");
		return this.game.right();
	};

	Solver.prototype.down = function() {
		this.currentCycle.push("down");
		return this.game.down();
	};

	Solver.prototype.undoTheoreticalMove = function() {
		this.game.grid = this.backup;
		this.backup = undefined;
		this.currentCycle.splice(this.currentCycle.length - 1, 1);
		return;
	};

	Solver.prototype.canCombineLeft = function() {
		this.game.rotate();
		var a = this.canCombineDown();
		this.game.rotate();
		this.game.rotate();
		this.game.rotate();
		return a;
	};

	Solver.prototype.canCombineRight = function() {
		this.game.rotate();
		this.game.rotate();
		this.game.rotate();
		var a = this.canCombineDown();
		this.game.rotate();
		return a;
	};

	Solver.prototype.canCombineUp = function() {
		this.game.rotate();
		this.game.rotate();
		var a = this.canCombineDown();
		this.game.rotate();
		this.game.rotate();
		return a;
	};

	Solver.prototype.canCombineDown = function() {
		for (var x = 0; x < this.game.grid.length; x++) {
			var prev = -1;
			for (var y = this.game.grid[x].length - 1; y >= 0; y--) {
				if (this.game.grid[x][y].value == 0) continue;
				if (this.game.grid[x][y].value == prev) {
					return true;
				}
				prev = this.game.grid[x][y].value;
			}
		}

		return false;
	};

	Solver.prototype.canMoveUp = function() {
		var tbackup = this.backup;
		if (this.theoreticalUp() == false) {
			this.game.grid = this.backup;
			this.backup = tbackup;
			return false;
		}
		else {
			this.game.grid = this.backup;
			this.backup = tbackup;
			return true;
		}
	};

	Solver.prototype.canMoveDown = function() {
		var tbackup = this.backup;
		if (this.theoreticalDown() == false) {
			this.game.grid = this.backup;
			this.backup = tbackup;
			return false;
		}
		else {
			this.game.grid = this.backup;
			this.backup = tbackup;
			return true;
		}
	};

	Solver.prototype.canMoveLeft = function() {
		var tbackup = this.backup
		if (this.theoreticalLeft() == false) {
			this.game.grid = this.backup;
			this.backup = tbackup;
			return false;
		}
		else {
			this.game.grid = this.backup;
			this.backup = tbackup;
			return true;
		}
	};

	Solver.prototype.canMoveRight = function() {
		var tbackup = this.backup;
		if (this.theoreticalRight() == false) {
			this.game.grid = this.backup;
			this.backup = tbackup;
			return false;
		}
		else {
			this.game.grid = this.backup;
			this.backup = tbackup;
			return true;
		}
	};

	Solver.prototype.getBiggestNumber = function() {
		var biggest = {"value": 0};
		for (var x = 0; x < this.game.grid.length; x++) {
			for (var y = 0; y < this.game.grid[x].length; y++) {
				if (this.game.grid[x][y].value > biggest.value) biggest = this.game.grid[x][y];
			}
		}

		return biggest;
	};

	Solver.prototype.getRow = function(y) {
		var row = [];

		for (var i = 0; i < 4; i++) {
			row.push(this.game.grid[i][y]);
		}

		return row;
	};

	Solver.prototype.getColumn = function(x) {
		// This allows it so that they can re order the array
		// But changing the object changes the real thing
		// This way .getRow and .getColumn are pretty similar
		return Object.shallowAssign([], this.game.grid[x]);
	};

	Solver.prototype.canMergeRow = function(y) {
		var prev = -1;
		var row = this.getRow(y);
		for (var i = row.length - 1; i >= 0; i--) {
			if (row[i].value == 0) continue;
			if (row[i].value == prev) {
				return true;
			}
			prev = row[i].value;
		}
	};

	Solver.prototype.canMergeColumn = function(x) {
		var prev = -1;
		var column = this.getColumn(x);
		for (var i = column.length - 1; i >= 0; i--) {
			if (column[i].value == 0) continue;
			if (column[i].value == prev) {
				return true;
			}
			prev = column[i].value;
		}

		return false;
	};
}());