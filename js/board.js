
class Board {

	/**
	 * Size of the grid
	 */
	static GridSize = 4;

	/**
	 * Corner radius to use when drawing
	 */
	static CornerRadius = 32;

	/**
	 * Size of the gutters to use when drawing
	 */
	static GutterSize = 16;

	/**
	 * Font Size to use when rendering cell values
	 */
	static CellFontSize = 64;

	/**
	 * Maps values of cells to colors to use when drawing
	 */
	static ColorMap = {
		"0": "#696969", "2": "#dbdbdb", "4": "#b3b3b3", "8": "#ebbf73", "16": "#e69245", "32": "#e35c27", "64": "#c72b0c",
		"128": "#a61246", "256": "#a6128d", "512": "#b13ede", "1024": "#192080", "2048": "#0c2545", "other": "#03556e",
	};

	/**
	 * Creates a new 2048 board
	 * @param {Array<Array<Number>>|null} grid The initial grid to use
	 */
	constructor(grid) {
		/**
		 * @type {Array<Array<Number>>} 2d grid of 2048 board
		 */
		this.grid = _.cloneDeep(grid);

		// Create a blank grid with 2 tiles
		if (this.grid == null) {
			this.grid = _.chunk(new Array(16).fill(0), 4);
			this.spawnTile();
			this.spawnTile();
		}
	}

	/**
	 * Deep copies the board
	 * @returns {Board} Deep copy
	 */
	copy() {
		return new Board(this.grid);
	}

	/**
	 * Draws the board on the canvas
	 */
	draw() {
		// Size calculations and constants
		const boardCenter = new Point(canvasSize.width / 2, canvasSize.height * 0.4);
		const boardSize = Math.min(canvasSize.width * 0.8, canvasSize.height * 0.6);
		const boardPos = new Point(boardCenter.x - boardSize/2, boardCenter.y - boardSize / 2);
		const cellSize = new Box(
			(boardSize - Board.GutterSize * (Board.GridSize + 1)) / Board.GridSize,
			(boardSize - Board.GutterSize * (Board.GridSize + 1)) / Board.GridSize
		);

		// Draw board background
		this.drawRect("#333333", boardPos, new Box(boardSize, boardSize));

		// Loop through cells and draw them
		for (let x = 0; x < Board.GridSize; x++) {
			for (let y = 0; y < Board.GridSize; y++) {
				const cellPos = new Point(
					boardPos.x + (x + 1) * Board.GutterSize + x * cellSize.width,
					boardPos.y + (y + 1) * Board.GutterSize + y * cellSize.width
				);

				const value = this.grid[y][x].toString();
				this.drawRect(Board.ColorMap[value] || Board.ColorMap["other"], cellPos, cellSize);

				if (value === "0") continue;
				ctx.fillStyle = "white";
				ctx.textAlign = "center";
				ctx.font = `${Board.CellFontSize}px Arial`;
				ctx.textBaseline = "middle";
				ctx.fillText(value, cellPos.x + cellSize.width / 2, cellPos.y + cellSize.height / 2);
			}
		}
	}

	/**
	 * Helper method to draw a rounded rectangle
	 * @param {String} color The color to draw with
	 * @param {Point} pos Position to draw the rect at relative to top left
	 * @param {Box} size The size to draw the rect
	 */
	drawRect(color, pos, size) {
		// Create path by going clockwise around the rectangle
		ctx.beginPath();
		ctx.moveTo(pos.x + Board.CornerRadius, pos.y);
		ctx.lineTo(pos.x + size.width - Board.CornerRadius, pos.y);
		ctx.arcTo(pos.x + size.width, pos.y, pos.x + size.width, pos.y + Board.CornerRadius, Board.CornerRadius);
		ctx.lineTo(pos.x + size.width, pos.y + size.width - Board.CornerRadius);
		ctx.arcTo(pos.x + size.width, pos.y + size.width, pos.x + size.width - Board.CornerRadius, pos.y + size.width, Board.CornerRadius);
		ctx.lineTo(pos.x + Board.CornerRadius, pos.y + size.height);
		ctx.arcTo(pos.x, pos.y + size.height, pos.x, pos.y + size.height - Board.CornerRadius, Board.CornerRadius);
		ctx.lineTo(pos.x, pos.y + Board.CornerRadius);
		ctx.arcTo(pos.x, pos.y, pos.x + Board.CornerRadius, pos.y, Board.CornerRadius);
		ctx.closePath();

		// Fill path
		ctx.fillStyle = color;
		ctx.fill();
	}

	/**
	 * Spawns a new tile randomly
	 */
	spawnTile() {
		// Check if game is filled to avoid infinite looping
		if (!this.grid.flat().includes(0)) return;
		// Finds a valid position to spawn the new tile
		let pos = null;
		do pos = Point.random(0, Board.GridSize, 0, Board.GridSize); while (this.grid[pos.y][pos.x] !== 0);
		this.grid[pos.y][pos.x] = 2;
	}

	/**
	 * Checks if there's a game over
	 * @returns {Boolean} Whether there's a game over or not
	 */
	isGameover() {
		// Check for filled grid
		if (this.grid.flat().includes(0)) return false;

		// Check for any possible merging
		const neighbors = [new Point(-1, 0), new Point(1, 0), new Point(0, -1), new Point(0, 1)];

		for (let y = 0; y < Board.GridSize; y++) {
			for (let x = 0; x < Board.GridSize; x++) {
				for (let neighbor of neighbors) {
					const coords = new Point(x + neighbor.x, y + neighbor.y);
					if (coords.x < 0 || coords.x >= Board.GridSize || coords.y < 0 || coords.y >= Board.GridSize) continue;
					if (this.grid[coords.y][coords.x] === this.grid[y][x]) return false;
				}
			}
		}
		return true;
	}

	/**
	 * Shifts and merges all the tiles down and spawns a new tile
	 */
	down() {
		const previous = _.cloneDeep(this.grid);

		for (let x = 0; x < Board.GridSize; x++) {
			// First we need to shift all the tiles down
			for (let y = Board.GridSize - 1; y >= 0; y--) {
				if (this.grid[y][x] !== 0) continue; // Loop till we find a spot to shift to
				const idx = _.findLastIndex(this.grid, (row, index) => row[x] !== 0 && index < y); // Find the number to shift
				if (idx === -1) break; // Unable to find number to shift to

				// Shift item to the left
				this.grid[y][x] = this.grid[idx][x];
				this.grid[idx][x] = 0;
			}

			// Then we can merge all the tiles down
			for (let y = Board.GridSize - 1; y >= 0; y--) {
				if (y-1 < 0 || this.grid[y-1][x] !== this.grid[y][x]) continue;
				this.grid[y][x] += this.grid[y-1][x];
				// Shift all tiles down after merge, ensuring valid indices
				for (let j = y-1; j >= 0; j--) this.grid[j][x] = (j-1 >= 0) ? this.grid[j-1][x] : 0;
			}
		}

		if (_.isEqual(previous, this.grid)) return; // Invalid move
		this.spawnTile();
	};

	/**
	 * Shifts and merges all the tiles up and spawns a new tile
	 */
	up() {
		const previous = _.cloneDeep(this.grid);

		for (let x = 0; x < Board.GridSize; x++) {
			// First we need to shift all the tiles up
			for (let y = 0; y < Board.GridSize; y++) {
				if (this.grid[y][x] !== 0) continue; // Loop till we find a spot to shift to
				const idx = _.findIndex(this.grid, (row, index) => row[x] !== 0 && index > y); // Find the number to shift
				if (idx === -1) break; // Unable to find number to shift to

				// Shift item to the left
				this.grid[y][x] = this.grid[idx][x];
				this.grid[idx][x] = 0;
			}

			// Then we can merge all the tiles up
			for (let y = 0; y < Board.GridSize; y++) {
				if (y+1 >= Board.GridSize || this.grid[y+1][x] !== this.grid[y][x]) continue;
				this.grid[y][x] += this.grid[y+1][x];
				// Shift all tiles up after merge, ensuring valid indices
				for (let j = y+1; j < Board.GridSize; j++) this.grid[j][x] = (j+1 < Board.GridSize) ? this.grid[j+1][x] : 0;
			}
		}

		if (_.isEqual(previous, this.grid)) return; // Invalid move
		this.spawnTile();
	};

	/**
	 * Shifts and merges all the tiles left and spawns a new tile
	 */
	left() {
		const previous = _.cloneDeep(this.grid);

		for (let y = 0; y < Board.GridSize; y++) {
			const row = this.grid[y];

			// First we need to shift all the tiles left
			for (let x = 0; x < Board.GridSize; x++) {
				if (row[x] !== 0) continue; // Loop till we find a spot to shift to
				const idx = _.findIndex(row, (item, index) => item !== 0 && index > x); // Find the number to shift
				if (idx === -1) break; // Unable to find number to shift to

				// Shift item to the left
				row[x] = row[idx];
				row[idx] = 0;
			}

			// Then we can merge all the tiles left
			for (let x = 0; x < Board.GridSize; x++) {
				if (row[x+1] !== row[x]) continue;
				row[x] += row[x+1];
				for (let j = x+1; j < Board.GridSize; j++) row[j] = row[j+1] || 0;
			}
		}

		if (_.isEqual(previous, this.grid)) return; // Invalid move
		this.spawnTile();
	};

	/**
	 * Shifts and merges all the tiles right and spawns a new tile
	 */
	right() {
		const previous = _.cloneDeep(this.grid);

		for (let y = 0; y < Board.GridSize; y++) {
			const row = this.grid[y];

			// First we need to shift all the tiles right
			for (let x = Board.GridSize - 1; x >= 0; x--) {
				if (row[x] !== 0) continue; // Loop till we find a spot to shift to
				const idx = _.findLastIndex(row, (item, index) => item !== 0 && index < x); // Find the number to shift
				if (idx === -1) break; // Unable to find number to shift to

				// Shift item to the left
				row[x] = row[idx];
				row[idx] = 0;
			}

			// Then we can merge all the tiles right
			for (let x = Board.GridSize - 1; x >= 0; x--) {
				if (row[x-1] !== row[x]) continue;
				row[x] += row[x-1];
				for (let j = x-1; j >= 0; j--) row[j] = row[j-1] || 0;
			}
		}

		if (_.isEqual(previous, this.grid)) return; // Invalid move
		this.spawnTile();
	};
}
