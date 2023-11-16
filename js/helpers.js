
class Point {

	/**
	 * Creates a new point
	 * @param {Number} x Coordinates
	 * @param {Number} y Coordinates
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Deep copies the point
	 * @returns {Point} A deep copy of the point
	 */
	copy() {
		return new Point(this.x, this.y);
	}

	/**
	 * Creates a new random point
	 * @param {Number} minX min x coordinate
	 * @param {Number} maxX max x coordinate
	 * @param {Number} minY min y coordinate
	 * @param {Number} maxY max y coordinate
	 */
	static random(minX, maxX, minY, maxY) {
		return new Point(randomNumber(minX, maxX), randomNumber(minY, maxY));
	}
}

class Box {

	/**
	 * Creates a new box'
	 * @param {Number} width size
	 * @param {Number} height size
	 */
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}
}

/**
 * Creaets a random integer inclusive of the minimum and exclusive of maximum
 * @param {Number} min The minumum number
 * @param {Number} max The maximum number
 * @returns {Number} Random generated number
 */
function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}
