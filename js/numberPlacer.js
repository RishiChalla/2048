var NumberPlacer;

(function() {
	NumberPlacer = function(pos, number, solver) {
		this.pos = pos;
		this.number = number;
		this.solver = solver;
	};

	NumberPlacer.prototype.update = function() {
		if (this.number == this.game.grid[this.pos.x][this.pos.y].value) {
			return;
		}

		if (this.canMergeColumn(this.pos.x)) {
			this.game.down();
			return;
		}

		if (this.canMergeRow(this.pos.y)) {
			this.game.left();
			return;
		}
	};
}());