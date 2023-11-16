
class Cell {
	
	/**
	 * Creates a new 2048 cell on the board
	 * @param {Point} pos The position of the cell on the canvas for rendering
	 * @param {Box} size The size of the cell on the canvas for rendering
	 * @param {Number} value The value of the cell on the board
	 * @param {Point} arrPos The index of the cell on the board in a 2d array setting
	 */
	constructor(pos, size, value, arrPos) {
		this.pos = new Point(pos.x, pos.y);
		this.size = new Box(size, size);
		this.value = value;
		this.arrPos = new Point(arrPos.x, arrPos.y);
	}

	/**
	 * Draws the cell on the board
	 */
	draw() {
		// Set fill style
		const fillMap = {
			"0": "gray", "2": "#cccc00", "4": "#999900", "8": "#ffa500", "16": "#ff0000", "32": "#66ccff",
			"64": "#0099e6", "128": "#ff99ff", "256": "#ff1aff", "512": "#b300b3", "1024": "#0000b3", "2048": "#000066"
		};
		if (this.value > 2048) ctx.fillStyle = "purple";
		else ctx.fillStyle = fillMap[this.value.toString()];

		// Draw
		ctx.roundRect(this.pos, this.size, 50);
		ctx.fill();
		if (this.value == 0) return;
		ctx.font = "100px Arial";
		ctx.fillStyle = "#ffffff";
		ctx.textAlign = "center";
		ctx.fillText(this.value, this.pos.x + this.size.width / 2, this.pos.y + this.size.height / 2 + 30);
	}

	// Updates the cell and draws it
	update() {
		this.draw();
	}
}
