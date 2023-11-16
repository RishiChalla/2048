
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
 * Helper method that renders a rounded rectangle
 * @param {Point} pos The position to render at
 * @param {Box} size The size to render
 * @param {Number} borderRadius The border radius to use when rendering
 */
CanvasRenderingContext2D.prototype.roundRect = function(pos, size, borderRadius) {
	roundRect(this, pos.x, pos.y, size.width, size.height, borderRadius);
};

/**
 * Helper method that renders a rounded rectangle
 * @param {CanvasRenderingContext2D} ctx Canvas context
 * @param {Number} x Coordinates
 * @param {Number} y Coordinates
 * @param {Number} width Size
 * @param {Number} height Size
 * @param {Number} radius Rounded size
 */
function roundRect(ctx, x, y, width, height, radius) {
	if (typeof stroke == 'undefined') {
		stroke = true;
	}
	if (typeof radius === 'undefined') {
		radius = 5;
	}
	if (typeof radius === 'number') {
		radius = {tl: radius, tr: radius, br: radius, bl: radius};
	}
	else {
		var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
		for (var side in defaultRadius) {
			radius[side] = radius[side] || defaultRadius[side];
		}
	}
	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + width - radius.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	ctx.lineTo(x + width, y + height - radius.br);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	ctx.lineTo(x + radius.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
}

/**
 * Creaets a random integer inclusive of the minimum and maximum
 * @param {Number} min The minumum number
 * @param {Number} max The maximum number
 * @returns {Number} Random generated number
 */
function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Checks if an index is valid in an array
 * @param {Number} index The index to check
 * @returns Whether or not the index is valid
 */
Array.prototype.validIndex = function(index) {
	return (this.length - 1 >= index && index > 0);
};

/**
 * Checks if two arrays are equal
 * @param {Array<Object>} array An array to check
 * @returns {Boolean} Whether or not the two arrays are equal
 */
Array.prototype.equals = function(array) {
	if (array.length != this.length) return false;
	for (var i = 0; i < array.length; i++) {
		if (array[i].constructor === Array) {
			if (!(this[i].constructor === Array && this[i].equals(array[i]))) return false;
		}
		else {
			if (array[i] != this[i]) return false;
		}
	}

	return true;
};

/**
 * Creates a shallow copy of an object
 */
Object.shallowAssign = Object.assign;

/**
 * Creates a deep copy of an object
 * @param {Object} a Object to assign from
 * @param {Object} b Object to assign to
 * @returns 
 */
Object.assign = function(a, b) {
	if (a.constructor === Array && b.constructor === Array) {
		for (var i = 0; i < b.length; i++) {
			if (typeof b[i] != "object") a.push(b[i]);
			else {
				if (b[i].constructor === Array) a.push([]);
				else a.push({});
				a[i] = Object.assign(a[i], b[i]);
			}
		}

		return a;
	}
	else if (typeof a === "object" && typeof b === "object" && a.constructor !== Array && b.constructor !== Array) {
		for (key in b) {
			if (typeof b[key] != "object") a[key] = b[key];
			else {
				if (b[key].constructor === Array) a[key] = [];
				else a[key] = {};
				a[key] = Object.assign(a[key], b[key]);
			}
		}

		return a;
	}
	else return;
};