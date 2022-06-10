var Cell;

(function() {
	Cell = function(pos, size, value, arrPos) {
		this.pos = new Point(pos.x, pos.y);
		this.size = new Box(size, size);
		this.value = value;
		this.arrPos = new Point(arrPos.x, arrPos.y);
	};

	Cell.prototype.draw = function() {
		if (this.value == 0) {
			ctx.fillStyle = "gray";
		}
		if (this.value == 2) {
			ctx.fillStyle = "#cccc00";
		}
		if (this.value == 4) {
			ctx.fillStyle = "#999900";
		}
		if (this.value == 8) {
			ctx.fillStyle = "#ffa500";
		}
		if (this.value == 16) {
			ctx.fillStyle = "#ff0000";
		}
		if (this.value == 32) {
			ctx.fillStyle = "#66ccff";
		}
		if (this.value == 64) {
			ctx.fillStyle = "#0099e6";
		}
		if (this.value == 128) {
			ctx.fillStyle = "#ff99ff";
		}
		if (this.value == 256) {
			ctx.fillStyle = "#ff1aff";
		}
		if (this.value == 512) {
			ctx.fillStyle = "#b300b3";
		}
		if (this.value == 1024) {
			ctx.fillStyle = "#0000b3";
		}
		if (this.value == 2048) {
			ctx.fillStyle = "#000066";
		}
		if (this.value > 2048) {
			ctx.fillStyle = "purple";
		}
		ctx.roundRect(this.pos, this.size, 50);
		ctx.fill();
		if (this.value != 0) {
			ctx.font = "100px Comic Sans";
			ctx.fillStyle = "#ffffff";
			ctx.textAlign = "center";
			ctx.fillText(this.value, this.pos.x + this.size.width / 2, this.pos.y + this.size.height / 2 + 30);
		}
	};

	Cell.prototype.update = function() {
		this.draw();
	};
}());