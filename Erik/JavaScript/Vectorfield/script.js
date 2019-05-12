
class Vector {
	constructor(x, y, angle, magnitude=1) {
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.magnitude = magnitude;

		this.dx = cos(angle) * magnitude;
		this.dy = sin(angle) * magnitude;
	}

	draw() {
		save();
		translate(this.x, this.y);
		rotate(this.angle);
		line(0, 0, magnitude*SCALE, 0, 2, COLORS.white);
		restore();
	}
}

const COLORS = {
	background:"rgba(60, 60, 60, 1.0)",
	white:"rgba(200, 200, 200, 1.0)"
};
const SCALE = 10;
let redraw = true;
let vectors = [];
vectors.push(new Vector(totalWidth/2, totalHeight/2, pi));

const drawVectorField = () => {
	for(let vector of vectors) {
		vector.draw();
	}
}

update = () => {
	if(redraw) {
		fill(COLORS.background);
		drawVectorField();
	}
}
