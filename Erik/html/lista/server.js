const express = require ("express");
const app = express ();
const server = require ("http").createServer (app);
const io = require ("socket.io").listen (server);
const colors = require ("colors");
const fs = require("fs");
const mysql = require ("mysql");
const database = mysql.createConnection ({
	host:"localhost",
	user:"root",
	password:"",
	database:"flist"
});

let port = process.env.PORT || 2000;

let connections = [];
let users = {};
let package = JSON.parse (fs.readFileSync ("package.json", "utf8"));

function log (message, name="Server") {
	console.log (new Date ().toTimeString().split(' ')[0] + " | " + name.cyan + " : " + message);
}

database.connect((error) => {
	if (error) {
		log ("MySql not connected", "MySql");
		throw error;
	} else {
		log ("MySql connected", "MySql");
	}
});

server.listen (port, () => {
	log ("Starting '" + package.name.underline + "' Server at Version: " + package.version.underline + " by " + package.author.cyan + ".", "Info");
	log ("Running at port: " + port, "Info");
});

app.use ("/static", express.static("static"));

app.get ("/", (req, res) => {
	res.sendFile (__dirname + "/static/index.html");
});

io.sockets.on ("connection", (socket) => {
	connections.push (socket);
	users [socket.id] = new User (socket.id);
	log ("Connections: " + (connections.length), "Connect");

	socket.on ("update", (data) => {
		Update (socket);
	});

	socket.on ("search", (data) => {
		let safeData = escape(data.query);
		let sql = "SELECT * FROM data WHERE name LIKE '%" + safeData + "%' OR type LIKE '%" + safeData + "%' OR subtype LIKE '%" + safeData + "%' OR location LIKE '%" + safeData + "%' OR quantity LIKE '%" + safeData + "%' OR extra LIKE '%" + safeData + "%' OR package LIKE '%" + safeData + "%' ORDER BY type";

		if (data.slut)
			sql = "SELECT * FROM data WHERE name LIKE '%" + safeData + "%' AND status = 1 OR type LIKE '%" + safeData + "%' AND status = 1 OR subtype LIKE '%" + safeData + "%' AND status = 1 OR location LIKE '%" + safeData + "%' AND status = 1 OR quantity LIKE '%" + safeData + "%' AND status = 1 OR extra LIKE '%" + safeData + "%' AND status = 1 OR package LIKE '%" + safeData + "%' AND status = 1 ORDER BY type";

		database.query (sql, (error, result) => {
			if (error) {
				log ("MySql Error", "MySql");
				log (error, "MySql Error");
			} else {
				socket.emit ("update", result);
			}
		});
	})

	socket.on ("disconnect", (data) => {
		delete users [socket.id];
		connections.splice (connections.indexOf (socket), 1);

		log ("Connections: " + (connections.length), "Disconnect");
	});
});

function Update (socket) {
	let sql = "SELECT * FROM data ORDER BY name";
	database.query (sql, (error, result) => {
		if (error) {
			log ("MySql Error", "MySql");
			throw error;
		} else {
			socket.emit ("update", result);
		}
	});
}

function User (id) {
	this.id = id;
}
