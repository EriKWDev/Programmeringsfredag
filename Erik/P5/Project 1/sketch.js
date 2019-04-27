

function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	if (mouseIsPressed) {
		fill(0);
	} else {
		fill("#62af59");
	}
	noStroke();
	ellipse(mouseX, mouseY, 80, 80);
}
