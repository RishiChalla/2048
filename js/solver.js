var Solver;

(function() {
	Solver = function(game, intervalBetweenMoves) {
		this.game = game;
		this.intervalBetweenMoves = intervalBetweenMoves;
		this.working = false;
	};

	Solver.prototype.solve = function() {
		var self = this;
		window.setTimeout(function() {
			self.solve();
			// This is the game loop, call other functions for the solver here.
			self.update();
		}, this.intervalBetweenMoves);
	};

	Solver.prototype.update = function() {
		// Top Priority - Next Move
		if (this.nextMoves != undefined) {
			if (this.nextMoves[0] == "left") this.game.left();
			if (this.nextMoves[0] == "right") this.game.right();
			if (this.nextMoves[0] == "up") this.game.up();
			if (this.nextMoves[0] == "down") this.game.down();
			this.nextMoves.shift();
			if (this.nextMoves.length == 0) this.nextMoves = undefined;
			return;
		}

		// First we will check if the bottom row is entirely filled in or not.
		// This is so that we can keep all our big numbers in a corner for simplcity

		if (this.bottomRowDone() == false) {
			if (this.game.down() == false) this.normalUpdate();
			else return;
		}
		else this.normalUpdate();
	};

	Solver.prototype.normalUpdate = function() {
		// All the bottom row is filled in. There may be multiple with the exact same value in a row though, so we should combine those next.
		// However, while combining, we must remember the goal that all the big numbers stay on one corner.
		// For the sake of simplicity, we will merge towards the left rather than the right.
		// This means that all our big numbers will be kept towards the bottom left.

		if (this.getBiggestNumber().value >= 256) {
			// We have a 128, now lets get things more advanced then simply putting things in the corner.
			this.advancedUpdate();
			return;
		}

		if (this.bottomRowDone() && this.canCombineLeft()) {
			this.game.left();
			return;
		}

		if (this.canCombineDown()) {
			this.game.down();
			return;
		}

		if (this.canCombineLeft()) {
			this.game.left();
			return;
		}

		this.theoreticalLeft();

		if (this.canCombineDown()) {
			this.nextMoves = ["down"];
			return;
		}
		else {
			this.undoTheoreticalMove();
		}

		this.theoreticalDown();

		if (this.canCombineLeft()) {
			this.nextMoves = ["left"];
			return;
		}
		else {
			this.undoTheoreticalMove();
		}

		if (this.bottomRowDone()) {
			this.theoreticalRight();

			if (this.canCombineDown()) {
				this.nextMoves = ["down", "left"];
				return;
			}
			else {
				this.undoTheoreticalMove();
			}
		}

		if (this.canMoveDown()) {
			this.game.down();
			return;
		}

		if (this.canMoveLeft()) {
			this.game.left();
			return;
		}

		if (this.canMoveRight()) {
			this.game.right();
			this.nextMoves = ["left"];
			return;
		}

		if (this.canMoveUp()) {
			this.game.up();
			this.nextMoves = ["down"];
			return;
		}
	};

	Solver.prototype.advancedUpdate = function() {
		// Now we can check if the biggest number actually is in the bottom left corner.
		// If it is not, getting it there is out top priority.

		if (this.working == true) {
			this.updateTryToGetNumberAtPos();
			return;
		}

		var b = this.getBiggestNumber();

		if (b.arrPos.x != 0 || b.arrPos.y != 3) {
			// This is a very big issue
			// This means that the biggest number isn't in the corner.
			// The best option would honestly be to restart, but for now im gonna leave this blank.
			// NOTE: WHEN YOU COME BACK TO THIS CODE LATER - TRY TO RUN SEVERAL TESTS AND SEE HOW OFTEN THIS HAPPENS.
			// TODO: If this happens anymore than 20% of the time, then we must code this area
			//       Otherwise, it is ok to leave this blank, and simply say the AI has failed you.
			//       Then we can reload the page and be easily able to do it again and hope that it does it right this time.
			alert("The AI has failed you.");
			window.location.replace("");

			// This line should not be able to run, but its just a last resort.
			// Since putting window.location.replace inside of the update loop seems to be a bit buggy at the moment.
			return;
		}

		var bottomRow = this.getRow(3);
		var prevBig = 0;
		var done = false

		for (var i = 0; i < bottomRow.length; i++) {
			if (prevBig == 0) prevBig = bottomRow[i].value;
			else {
				if (prevBig != bottomRow[i].value * 2) {
					done = true;
					break;
				}
			}
		}

		if (done == true) {
			this.tryToGetNumberAtPos(bottomRow[i - 1].value / 2, new Point(i, 3));
			this.updateTryToGetNumberAtPos();
			return;
		}

		this.game.left();
	};

	Solver.prototype.tryToGetNumberAtPos = function(number, pos) {
		this.working = true;
		this.numberPlacer = new NumberPlacer(Object.shallowAssign({}, pos), number, this);
		this.pos = this.numberPlacer.pos;
	};

	Solver.prototype.updateTryToGetNumberAtPos = function() {
		if (this.working == false) return;
		if (this.number == this.game.grid[this.pos.x][this.pos.y].value) {
			this.working = false;
			return;
		}

		this.numberPlacer.update();
	};

	Solver.prototype.bottomRowDone = function() {
		var bottomRow = [];

		for (var x = 0; x < this.game.grid.length; x++) {
			bottomRow.push(this.game.grid[x][3]);
		}

		var bottomRowDone = true;

		for (var i = 0; i < bottomRow.length; i++) {
			if (bottomRow[i].value == 0) bottomRowDone = false
		}

		return bottomRowDone;
	};

	Solver.prototype.topRowDone = function() {
		this.game.rotate();
		this.game.rotate();
		var a = this.bottomRowDone();
		this.game.rotate();
		this.game.rotate();
		return a;
	};

	Solver.prototype.theoreticalRight = function() {
		this.backup = Object.assign([], this.game.grid);
		return this.game.right();
	};

	Solver.prototype.theoreticalLeft = function() {
		this.backup = Object.assign([], this.game.grid);
		return this.game.left();
	};

	Solver.prototype.theoreticalUp = function() {
		this.backup = Object.assign([], this.game.grid);
		return this.game.up();
	};

	Solver.prototype.theoreticalDown = function() {
		this.backup = Object.assign([], this.game.grid);
		return this.game.down();
	};

	Solver.prototype.undoTheoreticalMove = function() {
		this.game.grid = this.backup;
		this.backup = undefined;
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