function Point(x, y) {
	this.x = x;
	this.y = y;
}

function Box(width, height) {
	this.width = width;
	this.height = height;
}

CanvasRenderingContext2D.prototype.roundRect = function(pos, size, borderRadius) {
	roundRect(this, pos.x, pos.y, size.width, size.height, borderRadius);
};

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

function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

Array.prototype.validIndex = function(index) {
	return (this.length - 1 >= index && index > 0);
};

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

Object.shallowAssign = Object.assign;

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