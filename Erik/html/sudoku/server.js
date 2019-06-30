let express = require("express");
let app = express ();
let http = require("http").Server(app);
let io = require("socket.io")(http);
let path = require ("path");

const colors = require ("colors");
const PORT = 3800;

app.use (sendViewMiddleware);
app.use (express.static (path.join (__dirname + "/static")));

function sendViewMiddleware(req, res, next) {
	res.sendView = function(view) {
	   return res.sendFile(__dirname + "/static/" + view);
	}
	next();
}

function log (text, name="Sudoku Server") {
	console.log (new Date ().toString().blue + " | " + name.green + " : " + text);
}

app.get("/", (req, res) => {
	res.sendView ("index.html");
});

app.get("/game", (req, res) => {
	res.sendView ("game.html");
});

http.listen(PORT, () => {
    log ("Starting Sudoku Server on Port: " + PORT);
});

io.on("connection", (socket) => {
	log ("A user has connected");

	socket.on ("disconnect", (socket) => {
		log ("A user has disconnected");
	});
});
