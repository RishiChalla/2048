
class NumberPlacer {

	/**
	 * Creates a new number placer
	 * @param {Point} pos 
	 * @param {Number} number 
	 * @param {Solver} solver 
	 */
	constructor(pos, number, solver) {
		this.pos = pos;
		this.number = number;
		this.solver = solver;
	}

	/**
	 * Updates the number placer
	 */
	update() {
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
	}

}
